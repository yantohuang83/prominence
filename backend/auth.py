"""Authentication utilities: password hashing, JWT, dependencies."""
import os
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Request

JWT_ALGORITHM = "HS256"
ACCESS_TTL_MIN = 60  # 1 hour
REFRESH_TTL_DAYS = 7


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TTL_MIN),
        "type": "access",
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TTL_DAYS),
        "type": "refresh",
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])


def extract_token(request: Request) -> str | None:
    token = request.cookies.get("access_token")
    if token:
        return token
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


async def get_current_admin(request: Request) -> dict:
    """FastAPI dependency: returns admin user dict or raises 401."""
    from server import db  # late import to avoid circulars
    token = extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.get(id=payload["sub"])
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    user.pop("password_hash", None)
    return user


# -------- Brute force --------
MAX_FAILED = 5
LOCKOUT_MIN = 15


async def check_lockout(db, identifier: str):
    rec = await db.login_attempts.get(identifier=identifier)
    if not rec:
        return
    if rec.get("locked_until"):
        locked = rec["locked_until"]
        if isinstance(locked, str):
            locked = datetime.fromisoformat(locked)
        if locked.tzinfo is None:
            locked = locked.replace(tzinfo=timezone.utc)
        if locked > datetime.now(timezone.utc):
            mins = int((locked - datetime.now(timezone.utc)).total_seconds() // 60) + 1
            raise HTTPException(status_code=429, detail=f"Account temporarily locked. Try again in {mins} minute(s).")


async def record_failed(db, identifier: str):
    await db.record_failed(identifier, MAX_FAILED, LOCKOUT_MIN)


async def clear_failed(db, identifier: str):
    await db.login_attempts.delete(identifier=identifier)
