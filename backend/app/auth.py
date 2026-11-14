"""Autenticação e sessão JWT."""

from __future__ import annotations

from .enrollment import find_by_email, issue_token, public_student, verify_password
from .progress_store import progress_for_student_id


def login(email: str, password: str) -> dict:
    student = find_by_email(email)
    if not student or not verify_password(password, student.get("password_hash", "")):
        return {"ok": False, "error": "E-mail ou senha não conferem no servidor local."}

    return {
        "ok": True,
        "student": public_student(student),
        "progress": progress_for_student_id(student["id"]),
        **issue_token(student),
    }