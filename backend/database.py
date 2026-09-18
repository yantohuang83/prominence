"""MySQL persistence. API dictionaries retain their original field names."""
import os
from datetime import datetime, timezone, timedelta

from sqlalchemy import (
    MetaData, Table, Column, String, Text, Boolean, Integer, JSON, Index,
    select, insert, update, delete, func, text,
)
from sqlalchemy.dialects.mysql import DATETIME, insert as mysql_insert
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.types import TypeDecorator


class UTCDateTime(TypeDecorator):
    impl = DATETIME(fsp=6)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, str):
            value = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value

    def process_result_value(self, value, dialect):
        return value.replace(tzinfo=timezone.utc) if value is not None else None


metadata = MetaData()


def entity(name, *columns):
    return Table(name, metadata, Column("id", String(36), primary_key=True), *columns,
                 mysql_engine="InnoDB", mysql_charset="utf8mb4", mysql_collate="utf8mb4_bin")


def created():
    return Column("created_at", UTCDateTime(), nullable=False)


users = entity("users", Column("email", String(254), nullable=False, unique=True),
               Column("password_hash", String(255), nullable=False),
               Column("name", String(120), nullable=False, default="Admin"),
               Column("role", String(32), nullable=False, default="admin"), created())
status_checks = entity("status_checks", Column("client_name", Text, nullable=False),
                       Column("timestamp", UTCDateTime(), nullable=False))
contact_inquiries = entity(
    "contact_inquiries", Column("name", String(120), nullable=False),
    Column("company", String(160)), Column("position", String(120)),
    Column("email", String(254), nullable=False), Column("phone", String(40)),
    Column("industry", String(80)), Column("interest", String(120)),
    Column("solution", String(160)), Column("deployment_scope", String(120)),
    Column("message", Text, nullable=False), Column("locale", String(5)),
    Column("read", Boolean, nullable=False, default=False), created())
newsletter_subs = entity("newsletter_subs", Column("email", String(254), nullable=False, unique=True),
                         Column("locale", String(5)), created())
insights = entity("insights", Column("slug", String(191), nullable=False, unique=True),
                  Column("title", JSON, nullable=False), Column("excerpt", JSON, nullable=False),
                  Column("body", JSON, nullable=False), Column("category", String(60), nullable=False),
                  Column("cover_image", String(800)), Column("published", Boolean, nullable=False),
                  created(), Column("updated_at", UTCDateTime(), nullable=False))
faqs = entity("faqs", Column("question", JSON, nullable=False), Column("answer", JSON, nullable=False),
              Column("order", Integer, nullable=False, default=0),
              Column("published", Boolean, nullable=False), created(),
              Column("updated_at", UTCDateTime(), nullable=False))
login_attempts = Table("login_attempts", metadata,
                       Column("identifier", String(320), primary_key=True),
                       Column("count", Integer, nullable=False, default=0),
                       Column("locked_until", UTCDateTime()),
                       mysql_engine="InnoDB", mysql_charset="utf8mb4", mysql_collate="utf8mb4_bin")
Index("ix_contact_created", contact_inquiries.c.created_at)
Index("ix_newsletter_created", newsletter_subs.c.created_at)
Index("ix_insights_public_created", insights.c.published, insights.c.created_at)
Index("ix_faqs_public_order", faqs.c.published, faqs.c.order)


class Repository:
    def __init__(self, engine, table):
        self.engine, self.table = engine, table

    def conditions(self, filters):
        return [self.table.c[key] == value for key, value in (filters or {}).items()]

    async def get(self, **filters):
        async with self.engine.connect() as conn:
            row = (await conn.execute(select(self.table).where(*self.conditions(filters)).limit(1))).mappings().first()
            return dict(row) if row else None

    async def list(self, filters=None, *, order_by=None, descending=False, limit=500):
        query = select(self.table).where(*self.conditions(filters))
        if order_by:
            col = self.table.c[order_by]
            query = query.order_by(col.desc() if descending else col.asc())
        query = query.limit(limit)
        async with self.engine.connect() as conn:
            return [dict(row) for row in (await conn.execute(query)).mappings()]

    async def create(self, values):
        async with self.engine.begin() as conn:
            await conn.execute(insert(self.table).values(**values))

    async def update(self, filters, values):
        async with self.engine.begin() as conn:
            result = await conn.execute(update(self.table).where(*self.conditions(filters)).values(**values))
            return result.rowcount

    async def delete(self, **filters):
        async with self.engine.begin() as conn:
            result = await conn.execute(delete(self.table).where(*self.conditions(filters)))
            return result.rowcount

    async def count(self, **filters):
        async with self.engine.connect() as conn:
            return (await conn.execute(select(func.count()).select_from(self.table).where(*self.conditions(filters)))).scalar_one()

    async def get_or_create(self, values, key):
        # Unique constraints arbitrate concurrent requests; return the persisted ID.
        stmt = mysql_insert(self.table).values(**values)
        stmt = stmt.on_duplicate_key_update(**{key: self.table.c[key]})
        async with self.engine.begin() as conn:
            await conn.execute(stmt)
            row = (await conn.execute(select(self.table).where(self.table.c[key] == values[key]))).mappings().one()
            return dict(row)


class Database:
    def __init__(self, url=None):
        url = url or os.environ["DATABASE_URL"]
        if not url.startswith("mysql+aiomysql://"):
            raise ValueError("DATABASE_URL must use mysql+aiomysql://")
        self.engine = create_async_engine(url, pool_pre_ping=True, pool_recycle=1800,
                                         connect_args={"charset": "utf8mb4"})
        for table in metadata.tables.values():
            setattr(self, table.name, Repository(self.engine, table))

    async def ping(self):
        async with self.engine.connect() as conn:
            await conn.execute(text("SELECT 1"))

    async def close(self):
        await self.engine.dispose()

    async def record_failed(self, identifier, maximum, lockout_minutes):
        # Serialize increments across all API workers to avoid lost failures.
        async with self.engine.begin() as conn:
            stmt = mysql_insert(login_attempts).values(identifier=identifier, count=0)
            await conn.execute(stmt.on_duplicate_key_update(identifier=login_attempts.c.identifier))
            rec = (await conn.execute(select(login_attempts).where(
                login_attempts.c.identifier == identifier).with_for_update())).mappings().one()
            now = datetime.now(timezone.utc)
            if rec["locked_until"] and rec["locked_until"] > now:
                return
            count = rec["count"] + 1
            locked = now + timedelta(minutes=lockout_minutes) if count >= maximum else None
            await conn.execute(update(login_attempts).where(login_attempts.c.identifier == identifier).values(
                count=0 if locked else count, locked_until=locked))
