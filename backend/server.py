from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response, Request, Query
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from slugify import slugify

import auth as auth_lib

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Prominence API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ============= Models =============
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactInquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    company: Optional[str] = Field(None, max_length=160)
    position: Optional[str] = Field(None, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=40)
    industry: Optional[str] = Field(None, max_length=80)
    interest: Optional[str] = Field(None, max_length=120)
    solution: Optional[str] = Field(None, max_length=160)
    deployment_scope: Optional[str] = Field(None, max_length=120)
    message: str = Field(..., min_length=10, max_length=4000)
    locale: Optional[str] = Field(default="en", max_length=5)


class ContactInquiry(ContactInquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False


class NewsletterSubscribeCreate(BaseModel):
    email: EmailStr
    locale: Optional[str] = Field(default="en", max_length=5)


class NewsletterSubscribe(NewsletterSubscribeCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ----- CMS Models -----
class LocalizedField(BaseModel):
    en: str = ""
    id: str = ""


class InsightBase(BaseModel):
    title: LocalizedField
    excerpt: LocalizedField
    body: LocalizedField  # Markdown
    category: str = Field(default="Insights", max_length=60)
    cover_image: Optional[str] = Field(None, max_length=800)
    published: bool = True


class Insight(InsightBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FAQBase(BaseModel):
    question: LocalizedField
    answer: LocalizedField
    order: int = 0
    published: bool = True


class FAQ(FAQBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ----- Auth Models -----
class LoginPayload(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=200)


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str = "Admin"
    role: str = "admin"


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
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    obj = StatusCheck(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    items = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    return [_parse_dt(i) for i in items]


@api_router.post("/contact", response_model=ContactInquiry, status_code=201)
async def create_contact(payload: ContactInquiryCreate):
    obj = ContactInquiry(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.contact_inquiries.insert_one(doc)
    return obj


@api_router.post("/newsletter", response_model=NewsletterSubscribe, status_code=201)
async def newsletter_subscribe(payload: NewsletterSubscribeCreate):
    obj = NewsletterSubscribe(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.newsletter_subs.update_one(
        {"email": doc["email"]}, {"$setOnInsert": doc}, upsert=True
    )
    return obj


# ----- Public CMS read endpoints -----
@api_router.get("/insights", response_model=List[Insight])
async def list_insights(limit: int = 50):
    items = await db.insights.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(min(limit, 200))
    return [_parse_dt(i) for i in items]


@api_router.get("/insights/{slug}", response_model=Insight)
async def get_insight(slug: str):
    item = await db.insights.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Insight not found")
    return _parse_dt(item)


@api_router.get("/faqs", response_model=List[FAQ])
async def list_faqs():
    items = await db.faqs.find({"published": True}, {"_id": 0}).sort("order", 1).to_list(500)
    return [_parse_dt(i) for i in items]


# ============= Auth routes =============
@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginPayload, request: Request, response: Response):
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    await auth_lib.check_lockout(db, identifier)

    user = await db.users.find_one({"email": email})
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
    user = await db.users.find_one({"id": payload["sub"]})
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
async def admin_list_inquiries(limit: int = 200):
    items = await db.contact_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(min(limit, 500))
    return [_parse_dt(i) for i in items]


@admin_router.patch("/inquiries/{iid}/read")
async def admin_mark_read(iid: str):
    res = await db.contact_inquiries.update_one({"id": iid}, {"$set": {"read": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"ok": True}


@admin_router.delete("/inquiries/{iid}")
async def admin_delete_inquiry(iid: str):
    res = await db.contact_inquiries.delete_one({"id": iid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"ok": True}


@admin_router.get("/newsletter", response_model=List[NewsletterSubscribe])
async def admin_list_newsletter(limit: int = 500):
    items = await db.newsletter_subs.find({}, {"_id": 0}).sort("created_at", -1).to_list(min(limit, 1000))
    return [_parse_dt(i) for i in items]


@admin_router.delete("/newsletter/{nid}")
async def admin_delete_newsletter(nid: str):
    res = await db.newsletter_subs.delete_one({"id": nid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return {"ok": True}


# ----- Insights CRUD -----
async def _generate_unique_slug(base: str, current_id: Optional[str] = None) -> str:
    base = slugify(base) or "insight"
    slug = base
    i = 2
    while True:
        existing = await db.insights.find_one({"slug": slug}, {"_id": 0, "id": 1})
        if not existing or (current_id and existing.get("id") == current_id):
            return slug
        slug = f"{base}-{i}"
        i += 1


@admin_router.get("/insights", response_model=List[Insight])
async def admin_list_insights():
    items = await db.insights.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [_parse_dt(i) for i in items]


@admin_router.post("/insights", response_model=Insight, status_code=201)
async def admin_create_insight(payload: InsightBase):
    base = payload.title.en or payload.title.id or "insight"
    slug = await _generate_unique_slug(base)
    obj = Insight(**payload.model_dump(), slug=slug)
    doc = _serialize_dt(obj.model_dump())
    await db.insights.insert_one(doc)
    return obj


@admin_router.get("/insights/{iid}", response_model=Insight)
async def admin_get_insight(iid: str):
    item = await db.insights.find_one({"id": iid}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Insight not found")
    return _parse_dt(item)


@admin_router.put("/insights/{iid}", response_model=Insight)
async def admin_update_insight(iid: str, payload: InsightBase):
    existing = await db.insights.find_one({"id": iid}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Insight not found")
    base = payload.title.en or payload.title.id or "insight"
    # Regenerate slug if title changed and slug becomes non-unique-by-self
    slug = existing["slug"]
    desired = slugify(base) or "insight"
    if not slug.startswith(desired):
        slug = await _generate_unique_slug(base, current_id=iid)
    update = payload.model_dump()
    update["slug"] = slug
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.insights.update_one({"id": iid}, {"$set": update})
    merged = {**existing, **update}
    return _parse_dt(merged)


@admin_router.delete("/insights/{iid}")
async def admin_delete_insight(iid: str):
    res = await db.insights.delete_one({"id": iid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Insight not found")
    return {"ok": True}


# ----- FAQ CRUD -----
@admin_router.get("/faqs", response_model=List[FAQ])
async def admin_list_faqs():
    items = await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(500)
    return [_parse_dt(i) for i in items]


@admin_router.post("/faqs", response_model=FAQ, status_code=201)
async def admin_create_faq(payload: FAQBase):
    obj = FAQ(**payload.model_dump())
    doc = _serialize_dt(obj.model_dump())
    await db.faqs.insert_one(doc)
    return obj


@admin_router.put("/faqs/{fid}", response_model=FAQ)
async def admin_update_faq(fid: str, payload: FAQBase):
    existing = await db.faqs.find_one({"id": fid}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="FAQ not found")
    update = payload.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.faqs.update_one({"id": fid}, {"$set": update})
    merged = {**existing, **update}
    return _parse_dt(merged)


@admin_router.delete("/faqs/{fid}")
async def admin_delete_faq(fid: str):
    res = await db.faqs.delete_one({"id": fid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"ok": True}


@admin_router.get("/stats")
async def admin_stats():
    return {
        "inquiries": await db.contact_inquiries.count_documents({}),
        "inquiries_unread": await db.contact_inquiries.count_documents({"read": {"$ne": True}}),
        "subscribers": await db.newsletter_subs.count_documents({}),
        "insights": await db.insights.count_documents({}),
        "faqs": await db.faqs.count_documents({}),
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


@app.on_event("startup")
async def on_startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.insights.create_index("slug", unique=True)
    await db.insights.create_index("id", unique=True)
    await db.faqs.create_index("id", unique=True)
    await db.contact_inquiries.create_index("id", unique=True)
    await db.contact_inquiries.create_index([("created_at", -1)])
    await db.newsletter_subs.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier", unique=True)

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@prominence.id").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": auth_lib.hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user %s", admin_email)
    elif not auth_lib.verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": auth_lib.hash_password(admin_password)}}
        )
        logger.info("Updated admin password for %s", admin_email)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
