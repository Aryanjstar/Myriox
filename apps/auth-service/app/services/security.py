from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import get_settings

PASSWORD_MIN_LENGTH = 8


def validate_password_strength(password: str) -> str | None:
    """Returns an error message if the password is too weak, else None."""
    if len(password) < PASSWORD_MIN_LENGTH:
        return f"Password must be at least {PASSWORD_MIN_LENGTH} characters."
    if not re.search(r"[A-Za-z]", password):
        return "Password must contain at least one letter."
    if not re.search(r"\d", password):
        return "Password must contain at least one number."
    return None


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def issue_token(*, user_id: str, org_id: str, email: str, name: str) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "org_id": org_id,
        "email": email,
        "name": name,
        "iss": settings.auth_jwt_issuer,
        "iat": now,
        "exp": now + timedelta(minutes=settings.auth_token_expires_minutes),
    }
    return jwt.encode(payload, settings.auth_jwt_secret, algorithm="HS256")
