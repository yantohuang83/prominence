"""Integration tests against a dedicated MySQL database; never use production."""
import asyncio
import os
import sys
import uuid
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
if not os.environ.get("TEST_DATABASE_URL"):
    pytest.skip("Set TEST_DATABASE_URL to a dedicated MySQL database", allow_module_level=True)
os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]
os.environ["JWT_SECRET"] = "integration-test-secret-32-characters-minimum"
os.environ["ADMIN_EMAIL"] = "mysql-test@example.com"
os.environ["ADMIN_PASSWORD"] = "MysqlTest!12345"

from fastapi.testclient import TestClient
from database import Database, metadata
from migrate import migrate
import server


@pytest.fixture(scope="module")
def client():
    # No table truncation: unique records and a dedicated test database.
    async def setup():
        db = Database()
        try:
            await migrate(db)
            await migrate(db)  # Migration must be repeatable.
        finally:
            await db.close()
    asyncio.run(setup())
    with TestClient(server.app, base_url="https://testserver") as client:
        yield client


@pytest.fixture
def admin(client):
    result = client.post("/api/auth/login", json={"email": os.environ["ADMIN_EMAIL"], "password": os.environ["ADMIN_PASSWORD"]})
    assert result.status_code == 200, result.text
    return {"Authorization": "Bearer " + result.headers["X-Access-Token"]}


def test_health_and_status(client):
    assert client.get("/api/health").json()["status"] == "healthy"
    record = client.post("/api/status", json={"client_name": "MySQL unicode \u2601"}).json()
    assert record in client.get("/api/status").json()
    assert record["timestamp"].endswith("Z")


def test_auth_and_refresh(client, admin):
    assert client.get("/api/auth/me", headers=admin).json()["role"] == "admin"
    assert "password_hash" not in client.get("/api/auth/me", headers=admin).json()
    assert client.post("/api/auth/refresh").status_code == 200
    assert client.post("/api/auth/logout").status_code == 200
    assert client.get("/api/admin/stats").status_code == 401


def test_contact_stats_and_not_found(client, admin):
    baseline = client.get("/api/admin/stats", headers=admin).json()
    result = client.post("/api/contact", json={"name": "MySQL Test", "email": "contact@example.com", "message": "A message with emoji \U0001f680 and apostrophe '"})
    assert result.status_code == 201, result.text
    item = result.json()
    assert item["read"] is False
    assert any(row["id"] == item["id"] for row in client.get("/api/admin/inquiries", headers=admin).json())
    stats = client.get("/api/admin/stats", headers=admin).json()
    assert stats["inquiries_unread"] == baseline["inquiries_unread"] + 1
    path = "/api/admin/inquiries/" + item["id"]
    assert client.patch(path + "/read", headers=admin).status_code == 200
    assert client.patch(path + "/read", headers=admin).status_code == 200
    assert client.get("/api/admin/stats", headers=admin).json()["inquiries_unread"] == baseline["inquiries_unread"]
    assert client.delete(path, headers=admin).status_code == 200
    assert client.delete(path, headers=admin).status_code == 404
    assert client.patch(path + "/read", headers=admin).status_code == 404


def test_newsletter_concurrent_idempotence(client, admin):
    email = f"mysql-{uuid.uuid4().hex}@example.com"
    with ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(lambda _: client.post("/api/newsletter", json={"email": email}), range(8)))
    assert all(r.status_code == 201 for r in results)
    assert len({r.json()["id"] for r in results}) == 1
    rows = client.get("/api/admin/newsletter", headers=admin).json()
    assert sum(row["email"] == email for row in rows) == 1
    assert client.delete("/api/admin/newsletter/" + results[0].json()["id"], headers=admin).status_code == 200


def test_insight_crud_and_slug_races(client, admin):
    title = "Test " + uuid.uuid4().hex
    payload = {"title": {"en": title, "id": "Judul"}, "excerpt": {"en": "Excerpt"},
               "body": {"en": "Markdown **body** \U0001f680", "id": "Isi"}, "published": False}
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(lambda _: client.post("/api/admin/insights", json=payload, headers=admin), range(3)))
    assert all(r.status_code == 201 for r in results), [r.text for r in results]
    rows = [r.json() for r in results]
    assert len({row["slug"] for row in rows}) == 3
    for row in rows:
        assert client.get("/api/insights/" + row["slug"]).status_code == 404
    first = rows[0]
    path = "/api/admin/insights/" + first["id"]
    assert client.get(path, headers=admin).json()["body"] == payload["body"]
    payload["published"] = True
    payload["title"]["en"] = "Updated " + title
    result = client.put(path, json=payload, headers=admin)
    assert result.status_code == 200, result.text
    assert result.json()["created_at"] == first["created_at"]
    public = client.get("/api/insights/" + result.json()["slug"])
    assert public.status_code == 200 and public.json()["body"] == payload["body"]
    assert any(r["id"] == first["id"] for r in client.get("/api/insights").json())
    for row in rows:
        assert client.delete("/api/admin/insights/" + row["id"], headers=admin).status_code == 200
    assert client.get(path, headers=admin).status_code == 404


def test_faq_crud_order_and_drafts(client, admin):
    rows = []
    for order in (12, -1, 4):
        payload = {"question": {"en": "Q", "id": "Tanya"}, "answer": {"en": "Answer"}, "order": order, "published": order != 4}
        result = client.post("/api/admin/faqs", json=payload, headers=admin)
        assert result.status_code == 201, result.text
        rows.append(result.json())
    public = client.get("/api/faqs").json()
    assert [r["order"] for r in public] == sorted(r["order"] for r in public)
    assert rows[-1]["id"] not in {r["id"] for r in public}
    payload["published"] = True
    assert client.put("/api/admin/faqs/" + rows[-1]["id"], json=payload, headers=admin).status_code == 200
    for row in rows:
        assert client.delete("/api/admin/faqs/" + row["id"], headers=admin).status_code == 200
    assert client.put("/api/admin/faqs/missing", json=payload, headers=admin).status_code == 404


@pytest.mark.parametrize("path", ["/api/insights", "/api/admin/inquiries", "/api/admin/newsletter"])
def test_invalid_limits(client, admin, path):
    assert client.get(path + "?limit=-1", headers=admin).status_code == 422


def test_login_lockout(client):
    email = f"absent-{uuid.uuid4().hex}@example.com"
    payload = {"email": email, "password": "WrongPassword"}
    for _ in range(5):
        assert client.post("/api/auth/login", json=payload).status_code == 401
    assert client.post("/api/auth/login", json=payload).status_code == 429


def test_parallel_lockout_and_expiry(client):
    from datetime import datetime, timezone, timedelta
    import auth
    from fastapi import HTTPException
    async def check():
        db = Database()
        identifier = "parallel:" + uuid.uuid4().hex
        try:
            await asyncio.gather(*(db.record_failed(identifier, 5, 15) for _ in range(5)))
            with pytest.raises(HTTPException) as error:
                await auth.check_lockout(db, identifier)
            assert error.value.status_code == 429
            await db.login_attempts.update({"identifier": identifier},
                {"locked_until": datetime.now(timezone.utc) - timedelta(seconds=1)})
            await auth.check_lockout(db, identifier)
            await auth.clear_failed(db, identifier)
            assert await db.login_attempts.get(identifier=identifier) is None
        finally:
            await db.close()
    asyncio.run(check())


def test_health_database_failure(client, monkeypatch):
    async def unavailable():
        raise ConnectionError("database unavailable")
    monkeypatch.setattr(server.db, "ping", unavailable)
    assert client.get("/api/health").status_code == 503


def test_import_validation_before_writes(tmp_path):
    from import_mongo_json import read_documents
    import json
    (tmp_path / "faqs.json").write_text(json.dumps([{"question": {"en": "Missing id"}}]))
    with pytest.raises(ValueError, match="application id"):
        read_documents(tmp_path)


def test_import_repeat_and_rollback(client):
    from import_mongo_json import read_documents, import_documents
    from sqlalchemy.exc import IntegrityError
    async def check():
        db = Database()
        try:
            exports = Path(__file__).resolve().parents[2] / "exports" / "json"
            docs = read_documents(exports)
            await import_documents(db, docs)
            repeated = await import_documents(db, docs)
            assert all(counts["inserted"] == 0 for counts in repeated.values())
            faq = docs["faqs"][0]
            assert (await db.faqs.get(id=faq["id"]))["question"] == faq["question"]
            original = docs["newsletter_subs"][0]
            new = dict(original, id=str(uuid.uuid4()), email=f"rollback-{uuid.uuid4().hex}@example.com")
            conflict = dict(original, id=str(uuid.uuid4()))
            with pytest.raises(IntegrityError):
                await import_documents(db, {"newsletter_subs": [new, conflict]})
            assert await db.newsletter_subs.get(id=new["id"]) is None
        finally:
            await db.close()
    asyncio.run(check())
