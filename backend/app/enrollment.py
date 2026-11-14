"""Matrículas persistidas em SQLite."""

from __future__ import annotations

import hashlib
import re
import uuid
from datetime import datetime, timezone
from typing import Any

from . import db
from .security import create_access_token


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


def find_by_email(email: str) -> dict[str, Any] | None:
    return db.get_student_by_email(email)


def find_by_id(student_id: str) -> dict[str, Any] | None:
    return db.get_student_by_id(student_id)


def list_enrollments_public() -> list[dict[str, Any]]:
    return db.list_students_public()


def public_student(student: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": student.get("id"),
        "name": student.get("name"),
        "email": student.get("email"),
        "levelStart": student.get("level_start"),
        "goal": student.get("goal"),
        "hours": student.get("hours"),
    }


def issue_token(student: dict[str, Any]) -> dict[str, str]:
    return {
        "access_token": create_access_token(student["id"], student["email"]),
        "token_type": "bearer",
    }


def validate_enrollment(payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip().lower()
    password = str(payload.get("password", ""))

    if len(name.split()) < 2:
        errors.append("Informe o nome completo.")
    if "@" not in email or "." not in email.split("@")[-1]:
        errors.append("Informe um e-mail válido.")
    phone_raw = str(payload.get("phone", "")).strip()
    if phone_raw:
        phone_digits = re.sub(r"\D", "", phone_raw)
        if len(phone_digits) < 10:
            errors.append("Informe um telefone com DDD.")
    if len(password) < 6:
        errors.append("A senha precisa ter ao menos 6 caracteres.")
    if not payload.get("levelStart"):
        errors.append("Selecione o nível da trilha.")
    return errors


def save_enrollment(payload: dict[str, Any]) -> dict[str, Any]:
    errors = validate_enrollment(payload)
    if errors:
        return {"ok": False, "errors": errors}

    email = str(payload["email"]).strip().lower()
    if find_by_email(email):
        return {"ok": False, "errors": ["Já existe matrícula com este e-mail no servidor."]}

    record = {
        "id": str(uuid.uuid4()),
        "enrolled_at": datetime.now(timezone.utc).isoformat(),
        "name": str(payload["name"]).strip(),
        "email": email,
        "password_hash": hash_password(str(payload["password"])),
        "level_start": payload.get("levelStart"),
        "goal": str(payload.get("goal", ""))[:240],
        "hours": int(payload.get("hours") or 0),
        "phone": str(payload.get("phone", "")).strip(),
        "birth": str(payload.get("birth", "")),
        "city": str(payload.get("city", "")).strip(),
        "state": str(payload.get("state", "")),
        "experience": payload.get("experience"),
        "schedule": payload.get("schedule"),
        "contact": payload.get("contact"),
        "source": payload.get("source"),
        "newsletter": bool(payload.get("newsletter")),
    }
    db.insert_student(record)
    token = issue_token(record)
    return {"ok": True, "id": record["id"], "student": public_student(record), **token}