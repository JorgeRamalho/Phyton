"""Progresso do aluno em SQLite."""

from __future__ import annotations

from typing import Any

from . import db
from .enrollment import find_by_email, find_by_id, public_student, verify_password

DEFAULT_PROGRESS = {
    "xp": 0,
    "streak": 0,
    "lastVisit": None,
    "minutes": 0,
    "completedLessons": [],
    "completedExercises": [],
    "currentLessonId": "l01",
}


def _merge_progress(local: dict[str, Any], remote: dict[str, Any]) -> dict[str, Any]:
    merged = {**DEFAULT_PROGRESS, **remote, **local}
    merged["xp"] = max(int(local.get("xp") or 0), int(remote.get("xp") or 0))
    merged["minutes"] = max(int(local.get("minutes") or 0), int(remote.get("minutes") or 0))
    merged["streak"] = max(int(local.get("streak") or 0), int(remote.get("streak") or 0))
    merged["completedLessons"] = sorted(
        set(local.get("completedLessons") or []) | set(remote.get("completedLessons") or [])
    )
    merged["completedExercises"] = sorted(
        set(local.get("completedExercises") or []) | set(remote.get("completedExercises") or [])
    )
    return merged


def _sanitize(progress: dict[str, Any]) -> dict[str, Any]:
    return {
        "xp": int(progress.get("xp") or 0),
        "streak": int(progress.get("streak") or 0),
        "lastVisit": progress.get("lastVisit"),
        "minutes": int(progress.get("minutes") or 0),
        "completedLessons": list(progress.get("completedLessons") or []),
        "completedExercises": list(progress.get("completedExercises") or []),
        "currentLessonId": str(progress.get("currentLessonId") or "l01"),
    }


def progress_for_student_id(student_id: str) -> dict[str, Any]:
    stored = db.get_progress(student_id)
    return {**DEFAULT_PROGRESS, **(stored or {})}


def load_progress(email: str, password: str) -> dict[str, Any]:
    student = find_by_email(email)
    if not student or not verify_password(password, student.get("password_hash", "")):
        return {"ok": False, "error": "E-mail ou senha não conferem no servidor."}
    return {
        "ok": True,
        "student": public_student(student),
        "progress": progress_for_student_id(student["id"]),
    }


def load_progress_by_id(student_id: str) -> dict[str, Any]:
    student = find_by_id(student_id)
    if not student:
        return {"ok": False, "error": "Sessão inválida."}
    return {
        "ok": True,
        "student": public_student(student),
        "progress": progress_for_student_id(student_id),
    }


def save_progress(email: str, password: str, progress: dict[str, Any]) -> dict[str, Any]:
    student = find_by_email(email)
    if not student or not verify_password(password, student.get("password_hash", "")):
        return {"ok": False, "error": "E-mail ou senha não conferem no servidor."}
    return save_progress_for_student(student["id"], progress)


def save_progress_for_student(student_id: str, progress: dict[str, Any]) -> dict[str, Any]:
    current = db.get_progress(student_id) or {}
    merged = _merge_progress(_sanitize(progress), current)
    stored = db.upsert_progress(student_id, merged)
    return {"ok": True, "progress": stored}


def all_progress_summary() -> dict[str, dict[str, Any]]:
    return db.progress_summary()