"""
Iteration 2 backend tests: Prominence CMS (auth + admin CRUD + public reads).
Run: pytest /app/backend/tests/backend_test.py -v --tb=short --junitxml=/app/test_reports/pytest/pytest_results.xml
"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    pytest.skip("Set REACT_APP_BACKEND_URL for live HTTP tests", allow_module_level=True)
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@prominence.id")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    # Clear lockout in case previous failed runs locked the account
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code == 429:
        pytest.skip(f"Account locked, skipping. Detail: {r.text}")
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    token = r.headers.get("X-Access-Token")
    assert token, "Missing X-Access-Token header"
    return token


@pytest.fixture(scope="session")
def auth_session(session, admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


# ====== Public / health ======
class TestPublic:
    def test_health(self, session):
        r = session.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"

    def test_public_insights_only_published(self, session):
        r = session.get(f"{API}/insights")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert it.get("published") is True

    def test_public_faqs_ordered(self, session):
        r = session.get(f"{API}/faqs")
        assert r.status_code == 200
        items = r.json()
        orders = [it["order"] for it in items]
        assert orders == sorted(orders)
        for it in items:
            assert it.get("published") is True

    def test_newsletter_idempotent(self, session):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        r1 = session.post(f"{API}/newsletter", json={"email": email, "locale": "en"})
        r2 = session.post(f"{API}/newsletter", json={"email": email, "locale": "en"})
        assert r1.status_code == 201 and r2.status_code == 201
        # Verify via admin
        # done in admin test


# ====== Auth ======
class TestAuth:
    def test_login_bad_password(self, session):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPassword!1"})
        assert r.status_code in (401, 429)

    def test_login_success_sets_cookies(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if r.status_code == 429:
            pytest.skip("locked")
        assert r.status_code == 200
        assert r.headers.get("X-Access-Token")
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        # Cookies set
        # Note: requests Session stores cookies; samesite=none secure cookies may not be retained without https? URL is https.
        cookie_names = {c.name for c in s.cookies}
        assert "access_token" in cookie_names
        assert "refresh_token" in cookie_names
        # me with cookies
        rm = s.get(f"{API}/auth/me")
        assert rm.status_code == 200
        assert rm.json()["email"] == ADMIN_EMAIL
        # refresh
        rr = s.post(f"{API}/auth/refresh")
        assert rr.status_code == 200
        # logout
        rl = s.post(f"{API}/auth/logout")
        assert rl.status_code == 200
        # The server tells client to clear; subsequent me without bearer should 401
        s.cookies.clear()
        rm2 = s.get(f"{API}/auth/me")
        assert rm2.status_code == 401

    def test_admin_routes_require_auth(self, session):
        for path in ["/admin/inquiries", "/admin/newsletter", "/admin/insights", "/admin/faqs", "/admin/stats"]:
            r = requests.get(f"{API}{path}")
            assert r.status_code in (401, 403), f"{path} returned {r.status_code}"


# ====== Insights CRUD ======
class TestInsights:
    def test_crud_and_slug_uniqueness(self, auth_session):
        title_en = f"TEST Insight {uuid.uuid4().hex[:6]}"
        payload = {
            "title": {"en": title_en, "id": "ID title"},
            "excerpt": {"en": "ex en", "id": "ex id"},
            "body": {"en": "# Body\nhello", "id": "isi"},
            "category": "Insights",
            "published": True,
        }
        r1 = auth_session.post(f"{API}/admin/insights", json=payload)
        assert r1.status_code == 201, r1.text
        a = r1.json()
        slug1 = a["slug"]
        assert slug1
        # Second with same title -> unique slug
        r2 = auth_session.post(f"{API}/admin/insights", json=payload)
        assert r2.status_code == 201
        b = r2.json()
        assert b["slug"] != slug1
        assert b["slug"].startswith(slug1)

        # Public list contains them
        rp = requests.get(f"{API}/insights")
        slugs = [it["slug"] for it in rp.json()]
        assert slug1 in slugs

        # Public get by slug
        rg = requests.get(f"{API}/insights/{slug1}")
        assert rg.status_code == 200
        assert rg.json()["slug"] == slug1

        # Admin GET by id
        rid = auth_session.get(f"{API}/admin/insights/{a['id']}")
        assert rid.status_code == 200

        # Update
        upd = {**payload, "excerpt": {"en": "updated ex", "id": "isi"}}
        ru = auth_session.put(f"{API}/admin/insights/{a['id']}", json=upd)
        assert ru.status_code == 200
        assert ru.json()["excerpt"]["en"] == "updated ex"

        # Verify persistence
        rgv = auth_session.get(f"{API}/admin/insights/{a['id']}")
        assert rgv.json()["excerpt"]["en"] == "updated ex"

        # Delete both
        for iid in (a["id"], b["id"]):
            rd = auth_session.delete(f"{API}/admin/insights/{iid}")
            assert rd.status_code == 200
        rgone = auth_session.get(f"{API}/admin/insights/{a['id']}")
        assert rgone.status_code == 404

    def test_unpublished_not_public(self, auth_session):
        payload = {
            "title": {"en": f"TEST Draft {uuid.uuid4().hex[:6]}", "id": ""},
            "excerpt": {"en": "", "id": ""},
            "body": {"en": "draft body", "id": ""},
            "published": False,
        }
        r = auth_session.post(f"{API}/admin/insights", json=payload)
        assert r.status_code == 201
        slug = r.json()["slug"]
        rg = requests.get(f"{API}/insights/{slug}")
        assert rg.status_code == 404
        # cleanup
        auth_session.delete(f"{API}/admin/insights/{r.json()['id']}")


# ====== FAQ CRUD ======
class TestFAQs:
    def test_crud_and_order(self, auth_session):
        created = []
        for order in [3, 1, 2]:
            p = {
                "question": {"en": f"TEST Q{order}", "id": f"TEST Q{order} id"},
                "answer": {"en": f"A{order}", "id": f"A{order} id"},
                "order": order,
                "published": True,
            }
            r = auth_session.post(f"{API}/admin/faqs", json=p)
            assert r.status_code == 201
            created.append(r.json())

        # Public list ordered ascending by order
        r = requests.get(f"{API}/faqs")
        assert r.status_code == 200
        items = r.json()
        # Filter the TEST ones
        test_items = [it for it in items if it["question"]["en"].startswith("TEST Q")]
        orders = [it["order"] for it in test_items]
        assert orders == sorted(orders)

        # Update
        target = created[0]
        upd = {
            "question": {"en": "TEST Q3 updated", "id": "x"},
            "answer": {"en": "updated", "id": "x"},
            "order": target["order"],
            "published": True,
        }
        ru = auth_session.put(f"{API}/admin/faqs/{target['id']}", json=upd)
        assert ru.status_code == 200
        assert ru.json()["question"]["en"] == "TEST Q3 updated"

        # Cleanup
        for c in created:
            rd = auth_session.delete(f"{API}/admin/faqs/{c['id']}")
            assert rd.status_code == 200


# ====== Inquiries ======
class TestInquiries:
    def test_inquiry_lifecycle(self, auth_session, session):
        # Create one via public endpoint
        payload = {
            "name": "TEST Person",
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "message": "TEST message body content",
            "locale": "en",
        }
        rc = session.post(f"{API}/contact", json=payload)
        assert rc.status_code == 201
        iid = rc.json()["id"]

        # List
        rl = auth_session.get(f"{API}/admin/inquiries")
        assert rl.status_code == 200
        items = rl.json()
        assert any(i["id"] == iid for i in items)
        # Ordered desc by created_at
        timestamps = [i["created_at"] for i in items]
        assert timestamps == sorted(timestamps, reverse=True)

        # Mark read
        rr = auth_session.patch(f"{API}/admin/inquiries/{iid}/read")
        assert rr.status_code == 200
        rl2 = auth_session.get(f"{API}/admin/inquiries")
        found = next(i for i in rl2.json() if i["id"] == iid)
        assert found["read"] is True

        # Delete
        rd = auth_session.delete(f"{API}/admin/inquiries/{iid}")
        assert rd.status_code == 200
        rl3 = auth_session.get(f"{API}/admin/inquiries")
        assert not any(i["id"] == iid for i in rl3.json())


# ====== Newsletter admin ======
class TestNewsletterAdmin:
    def test_list_and_delete(self, auth_session, session):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        # Subscribe twice to verify idempotent
        session.post(f"{API}/newsletter", json={"email": email, "locale": "en"})
        session.post(f"{API}/newsletter", json={"email": email, "locale": "en"})

        rl = auth_session.get(f"{API}/admin/newsletter")
        assert rl.status_code == 200
        items = rl.json()
        matches = [i for i in items if i["email"] == email]
        assert len(matches) == 1, f"Expected 1 entry, got {len(matches)}"

        rd = auth_session.delete(f"{API}/admin/newsletter/{matches[0]['id']}")
        assert rd.status_code == 200

    def test_stats(self, auth_session):
        r = auth_session.get(f"{API}/admin/stats")
        assert r.status_code == 200
        for k in ("inquiries", "subscribers", "insights", "faqs"):
            assert k in r.json()
