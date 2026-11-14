"""Tokens JWT para sessão sem reenviar senha."""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

DEFAULT_SECRET = "phytonfree-dev-secret-change-in-production"
ALGORITHM = "HS256"
TOKEN_HOURS = 72


def jwt_secret() -> str:
    return os.environ.get("PHYTONFREE_JWT_SECRET", DEFAULT_SECRET)


def create_access_token(student_id: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": student_id,
        "email": email.strip().lower(),
        "iat": now,
        "exp": now + timedelta(hours=TOKEN_HOURS),
    }
    return jwt.encode(payload, jwt_secret(), algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, jwt_secret(), algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None