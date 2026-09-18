"""Apply schema migrations once, before starting API workers."""
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import text
from database import Database, metadata

load_dotenv(Path(__file__).with_name(".env"))
SCHEMA_VERSION = 1


async def migrate(db):
    async with db.engine.connect() as conn:
        locked = (await conn.execute(text("SELECT GET_LOCK('prominence_schema_migration', 30)"))).scalar()
        if locked != 1:
            raise RuntimeError("Could not acquire schema migration lock")
        try:
            await conn.execute(text("CREATE TABLE IF NOT EXISTS schema_migrations "
                                    "(version INT PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) "
                                    "ENGINE=InnoDB"))
            version = (await conn.execute(text("SELECT COALESCE(MAX(version), 0) FROM schema_migrations"))).scalar()
            if version > SCHEMA_VERSION:
                raise RuntimeError("Database schema is newer than this application")
            if version < 1:
                # MySQL DDL auto-commits. checkfirst makes interrupted initial setup resumable.
                await conn.run_sync(metadata.create_all)
                await conn.execute(text("INSERT INTO schema_migrations (version) VALUES (1)"))
            await conn.commit()
        finally:
            await conn.execute(text("SELECT RELEASE_LOCK('prominence_schema_migration')"))
            await conn.commit()


async def main():
    db = Database()
    try:
        await migrate(db)
        print(f"MySQL schema is at version {SCHEMA_VERSION}")
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(main())
