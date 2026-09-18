"""Import mongoexport --jsonArray files without requiring MongoDB at runtime.

All selected files are validated before writing; all inserts share one transaction.
Existing primary keys are skipped, never overwritten. Other uniqueness conflicts fail.
"""
import argparse
import asyncio
import json
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import insert, select
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from database import Database, metadata

load_dotenv(Path(__file__).with_name(".env"))


class UserImport(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    password_hash: str
    name: str = "Admin"
    role: str = "admin"
    created_at: datetime


def read_documents(directory, include_users=False):
    # Models preserve defaults and reject malformed source data before any writes.
    from models import ContactInquiry, NewsletterSubscribe, Insight, FAQ, StatusCheck
    models = {"contact_inquiries": ContactInquiry, "newsletter_subs": NewsletterSubscribe,
              "insights": Insight, "faqs": FAQ, "status_checks": StatusCheck}
    if include_users:
        models["users"] = UserImport
    result = {}
    for name, model in models.items():
        path = directory / f"{name}.json"
        if not path.exists():
            continue
        content = path.read_text(encoding="utf-8-sig").strip()
        # mongoexport can emit an empty file for an empty collection.
        raw = json.loads(content) if content else []
        if not isinstance(raw, list):
            raise ValueError(f"{path}: expected JSON array")
        docs = []
        for item in raw:
            item = dict(item)
            item.pop("_id", None)
            if not item.get("id"):
                raise ValueError(f"{path}: every document must have an existing application id")
            for key in ("created_at", "updated_at", "timestamp"):
                if isinstance(item.get(key), dict) and "$date" in item[key]:
                    value = item[key]["$date"]
                    if isinstance(value, dict):
                        value = int(value["$numberLong"]) / 1000
                    item[key] = value
            if name == "users":
                item["email"] = item["email"].lower().strip()
            doc = model.model_validate(item).model_dump()
            # Validate SQL string limits as well as API constraints (e.g. legacy slugs).
            for column in metadata.tables[name].columns:
                value = doc.get(column.name)
                length = getattr(column.type, "length", None)
                if length and isinstance(value, str) and len(value) > length:
                    raise ValueError(f"{path}: {column.name} exceeds {length} characters")
            docs.append(doc)
        result[name] = docs
    if not result:
        raise ValueError("No supported JSON export files found")
    return result


async def import_documents(db, documents):
    totals = {}
    async with db.engine.begin() as conn:
        for name, docs in documents.items():
            table = metadata.tables[name]
            added = skipped = 0
            for doc in docs:
                existing = (await conn.execute(select(table.c.id).where(table.c.id == doc["id"]))).first()
                if existing:
                    skipped += 1
                    continue
                await conn.execute(insert(table).values(**doc))
                added += 1
            totals[name] = {"inserted": added, "skipped": skipped}
    return totals


async def main(args):
    documents = read_documents(args.directory, args.include_users)
    if args.dry_run:
        print(json.dumps({name: len(docs) for name, docs in documents.items()}, indent=2))
        return
    db = Database()
    try:
        print(json.dumps(await import_documents(db, documents), indent=2))
    finally:
        await db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("--include-users", action="store_true", help="Import legacy password hashes too")
    parser.add_argument("--dry-run", action="store_true", help="Validate files without writing to MySQL")
    asyncio.run(main(parser.parse_args()))
