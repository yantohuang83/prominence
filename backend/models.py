"""Shared API and migration validation models."""
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone

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


