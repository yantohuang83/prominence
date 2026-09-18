from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response, Request, Query
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from starlette.middleware.cors import CORSMiddleware
from database import Database
from sqlalchemy.exc import IntegrityError
from contextlib import asynccontextmanager
import logging
from models import (
    StatusCheck, StatusCheckCreate, ContactInquiry, ContactInquiryCreate,
    NewsletterSubscribe, NewsletterSubscribeCreate, Insight, InsightBase,
    FAQ, FAQBase, LoginPayload, UserOut,
)
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from slugify import slugify

import auth as auth_lib

db = Database()

@asynccontextmanager
async def lifespan(app):
    try:
        await on_startup()
        yield
    finally:
        await db.close()


app = FastAPI(title="Prominence API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ============= Helpers =============
def _serialize_dt(d: dict) -> dict:
    for k, v in list(d.items()):
        if isinstance(v, datetime):
            d[k] = v.isoformat()
    return d


def _parse_dt(d: dict) -> dict:
    for k in ("created_at", "updated_at", "timestamp"):
        if isinstance(d.get(k), str):
            try:
                d[k] = datetime.fromisoformat(d[k])
            except Exception:
                pass
    return d


# ============= Routes: public =============
@api_router.get("/")
async def root():
    return {"service": "Prominence API", "status": "ok"}


@api_router.get("/health")
async def health():
    try:
        await db.ping()
    except Exception:
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    obj = StatusCheck(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.status_checks.create(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    items = await db.status_checks.list(limit=1000)
    return [_parse_dt(i) for i in items]


@api_router.post("/contact", response_model=ContactInquiry, status_code=201)
async def create_contact(payload: ContactInquiryCreate):
    obj = ContactInquiry(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.contact_inquiries.create(doc)
    return obj


@api_router.post("/newsletter", response_model=NewsletterSubscribe, status_code=201)
async def newsletter_subscribe(payload: NewsletterSubscribeCreate):
    obj = NewsletterSubscribe(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    return await db.newsletter_subs.get_or_create(doc, "email")


# ----- Public CMS read endpoints -----
@api_router.get("/insights", response_model=List[Insight])
async def list_insights(limit: int = Query(50, ge=1)):
    items = await db.insights.list({"published": True}, order_by="created_at", descending=True, limit=min(limit, 200))
    return [_parse_dt(i) for i in items]


@api_router.get("/insights/{slug}", response_model=Insight)
async def get_insight(slug: str):
    item = await db.insights.get(slug=slug, published=True)
    if not item:
        raise HTTPException(status_code=404, detail="Insight not found")
    return _parse_dt(item)


@api_router.get("/faqs", response_model=List[FAQ])
async def list_faqs():
    items = await db.faqs.list({"published": True}, order_by="order", descending=False, limit=500)
    return [_parse_dt(i) for i in items]


# ============= Auth routes =============
@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginPayload, request: Request, response: Response):
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    await auth_lib.check_lockout(db, identifier)

    user = await db.users.get(email=email)
    if not user or not auth_lib.verify_password(payload.password, user["password_hash"]):
        await auth_lib.record_failed(db, identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await auth_lib.clear_failed(db, identifier)
    access = auth_lib.create_access_token(user["id"], user["email"])
    refresh = auth_lib.create_refresh_token(user["id"])
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none",
                        max_age=auth_lib.ACCESS_TTL_MIN * 60, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none",
                        max_age=auth_lib.REFRESH_TTL_DAYS * 86400, path="/")
    # Also return token so the SPA can store it (Authorization header fallback)
    response.headers["X-Access-Token"] = access
    return UserOut(id=user["id"], email=user["email"], name=user.get("name", "Admin"), role=user.get("role", "admin"))


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(admin: dict = Depends(auth_lib.get_current_admin)):
    return UserOut(**admin)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = auth_lib.decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.get(id=payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access = auth_lib.create_access_token(user["id"], user["email"])
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none",
                        max_age=auth_lib.ACCESS_TTL_MIN * 60, path="/")
    response.headers["X-Access-Token"] = access
    return {"ok": True}


# ============= Admin routes =============
admin_router = APIRouter(prefix="/admin", dependencies=[Depends(auth_lib.get_current_admin)])


@admin_router.get("/inquiries", response_model=List[ContactInquiry])
async def admin_list_inquiries(limit: int = Query(200, ge=1)):
    items = await db.contact_inquiries.list({}, order_by="created_at", descending=True, limit=min(limit, 500))
    return [_parse_dt(i) for i in items]


@admin_router.patch("/inquiries/{iid}/read")
async def admin_mark_read(iid: str):
    res = await db.contact_inquiries.update({"id": iid}, {"read": True})
    if res == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"ok": True}


@admin_router.delete("/inquiries/{iid}")
async def admin_delete_inquiry(iid: str):
    res = await db.contact_inquiries.delete(id=iid)
    if res == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"ok": True}


@admin_router.get("/newsletter", response_model=List[NewsletterSubscribe])
async def admin_list_newsletter(limit: int = Query(500, ge=1)):
    items = await db.newsletter_subs.list({}, order_by="created_at", descending=True, limit=min(limit, 1000))
    return [_parse_dt(i) for i in items]


@admin_router.delete("/newsletter/{nid}")
async def admin_delete_newsletter(nid: str):
    res = await db.newsletter_subs.delete(id=nid)
    if res == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return {"ok": True}


# ----- Insights CRUD -----
async def _generate_unique_slug(base: str, current_id: Optional[str] = None) -> str:
    base = (slugify(base) or "insight")[:170]
    slug = base
    i = 2
    while True:
        existing = await db.insights.get(slug=slug)
        if not existing or (current_id and existing.get("id") == current_id):
            return slug
        slug = f"{base}-{i}"
        i += 1


@admin_router.get("/insights", response_model=List[Insight])
async def admin_list_insights():
    items = await db.insights.list({}, order_by="created_at", descending=True, limit=500)
    return [_parse_dt(i) for i in items]


@admin_router.post("/insights", response_model=Insight, status_code=201)
async def admin_create_insight(payload: InsightBase):
    base = payload.title.en or payload.title.id or "insight"
    slug = await _generate_unique_slug(base)
    obj = Insight(**payload.model_dump(), slug=slug)
    doc = _serialize_dt(obj.model_dump())
    for attempt in range(5):
        try:
            await db.insights.create(doc)
            return obj
        except IntegrityError as exc:
            if getattr(exc.orig, "args", [None])[0] != 1062:
                raise
            obj.slug = await _generate_unique_slug(base)
            doc["slug"] = obj.slug
    raise HTTPException(status_code=409, detail="Slug conflict; please retry")


@admin_router.get("/insights/{iid}", response_model=Insight)
async def admin_get_insight(iid: str):
    item = await db.insights.get(id=iid)
    if not item:
        raise HTTPException(status_code=404, detail="Insight not found")
    return _parse_dt(item)


@admin_router.put("/insights/{iid}", response_model=Insight)
async def admin_update_insight(iid: str, payload: InsightBase):
    existing = await db.insights.get(id=iid)
    if not existing:
        raise HTTPException(status_code=404, detail="Insight not found")
    base = payload.title.en or payload.title.id or "insight"
    # Regenerate slug if title changed and slug becomes non-unique-by-self
    slug = existing["slug"]
    desired = (slugify(base) or "insight")[:170]
    if not slug.startswith(desired):
        slug = await _generate_unique_slug(base, current_id=iid)
    update = payload.model_dump()
    update["slug"] = slug
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    try:
        await db.insights.update({"id": iid}, update)
    except IntegrityError as exc:
        if getattr(exc.orig, "args", [None])[0] != 1062:
            raise
        raise HTTPException(status_code=409, detail="Slug conflict; please retry")
    merged = {**existing, **update}
    return _parse_dt(merged)


@admin_router.delete("/insights/{iid}")
async def admin_delete_insight(iid: str):
    res = await db.insights.delete(id=iid)
    if res == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    return {"ok": True}


# ----- FAQ CRUD -----
@admin_router.get("/faqs", response_model=List[FAQ])
async def admin_list_faqs():
    items = await db.faqs.list({}, order_by="order", descending=False, limit=500)
    return [_parse_dt(i) for i in items]


@admin_router.post("/faqs", response_model=FAQ, status_code=201)
async def admin_create_faq(payload: FAQBase):
    obj = FAQ(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.faqs.create(doc)
    return obj


@admin_router.put("/faqs/{fid}", response_model=FAQ)
async def admin_update_faq(fid: str, payload: FAQBase):
    existing = await db.faqs.get(id=fid)
    if not existing:
        raise HTTPException(status_code=404, detail="FAQ not found")
    update = payload.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.faqs.update({"id": fid}, update)
    merged = {**existing, **update}
    return _parse_dt(merged)


@admin_router.delete("/faqs/{fid}")
async def admin_delete_faq(fid: str):
    res = await db.faqs.delete(id=fid)
    if res == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"ok": True}


@admin_router.get("/stats")
async def admin_stats():
    return {
        "inquiries": await db.contact_inquiries.count(),
        "inquiries_unread": await db.contact_inquiries.count(read=False),
        "subscribers": await db.newsletter_subs.count(),
        "insights": await db.insights.count(),
        "faqs": await db.faqs.count(),
    }


api_router.include_router(admin_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Access-Token"],
)


async def on_startup():
    await db.ping()
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@prominence.id").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD")
    if not os.environ.get("JWT_SECRET"):
        raise RuntimeError("JWT_SECRET is required")
    existing = await db.users.get(email=admin_email)
    if not existing and not admin_password:
        raise RuntimeError("ADMIN_PASSWORD is required to create the initial admin")
    if not existing:
        await db.users.get_or_create({
            "id": str(uuid.uuid4()), "email": admin_email,
            "password_hash": auth_lib.hash_password(admin_password),
            "name": "Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc),
        }, "email")
        logger.info("Seeded admin user %s", admin_email)
    elif admin_password and not auth_lib.verify_password(admin_password, existing["password_hash"]):
        await db.users.update({"email": admin_email},
                              {"password_hash": auth_lib.hash_password(admin_password)})
        logger.info("Updated admin password for %s", admin_email)
