"""SQLite — matrículas e progresso."""

from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DB_PATH = DATA_DIR / "phytonfree.sqlite"
LEGACY_ENROLLMENTS = DATA_DIR / "enrollments.json"
LEGACY_PROGRESS = DATA_DIR / "progress.json"


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                enrolled_at TEXT NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                level_start TEXT,
                goal TEXT,
                hours INTEGER DEFAULT 6,
                phone TEXT,
                birth TEXT,
                city TEXT,
                state TEXT,
                experience TEXT,
                schedule TEXT,
                contact TEXT,
                source TEXT,
                newsletter INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS progress (
                student_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(id)
            );
            """
        )
    migrate_legacy_json()


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def _row_to_student(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "enrolled_at": row["enrolled_at"],
        "name": row["name"],
        "email": row["email"],
        "password_hash": row["password_hash"],
        "level_start": row["level_start"],
        "goal": row["goal"],
        "hours": row["hours"],
        "phone": row["phone"],
        "birth": row["birth"],
        "city": row["city"],
        "state": row["state"],
        "experience": row["experience"],
        "schedule": row["schedule"],
        "contact": row["contact"],
        "source": row["source"],
        "newsletter": bool(row["newsletter"]),
    }


def insert_student(record: dict[str, Any]) -> dict[str, Any]:
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO students (
                id, enrolled_at, name, email, password_hash, level_start, goal, hours,
                phone, birth, city, state, experience, schedule, contact, source, newsletter
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record["id"],
                record["enrolled_at"],
                record["name"],
                record["email"],
                record["password_hash"],
                record.get("level_start"),
                record.get("goal"),
                int(record.get("hours") or 6),
                record.get("phone", ""),
                record.get("birth", ""),
                record.get("city", ""),
                record.get("state", ""),
                record.get("experience", ""),
                record.get("schedule", ""),
                record.get("contact", ""),
                record.get("source", ""),
                1 if record.get("newsletter") else 0,
            ),
        )
    return record


def get_student_by_email(email: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute("SELECT * FROM students WHERE email = ?", (email.strip().lower(),)).fetchone()
    return _row_to_student(row) if row else None


def get_student_by_id(student_id: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    return _row_to_student(row) if row else None


def list_students_public() -> list[dict[str, Any]]:
    with connect() as conn:
        rows = conn.execute(
            "SELECT id, name, email, level_start, enrolled_at, city, state FROM students ORDER BY enrolled_at DESC"
        ).fetchall()
    return [dict(row) for row in rows]


def get_progress(student_id: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute("SELECT payload FROM progress WHERE student_id = ?", (student_id,)).fetchone()
    if not row:
        return None
    return json.loads(row["payload"])


def upsert_progress(student_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    now = datetime.now(timezone.utc).isoformat()
    data = json.dumps(payload, ensure_ascii=False)
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO progress (student_id, payload, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(student_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
            """,
            (student_id, data, now),
        )
    return payload


def progress_summary() -> dict[str, dict[str, Any]]:
    summary: dict[str, dict[str, Any]] = {}
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT s.email, p.payload
            FROM progress p
            JOIN students s ON s.id = p.student_id
            """
        ).fetchall()
    for row in rows:
        payload = json.loads(row["payload"])
        summary[row["email"]] = {
            "xp": payload.get("xp", 0),
            "completedLessons": len(payload.get("completedLessons") or []),
            "completedExercises": len(payload.get("completedExercises") or []),
        }
    return summary


def migrate_legacy_json() -> None:
    with connect() as conn:
        count = conn.execute("SELECT COUNT(*) AS c FROM students").fetchone()["c"]
    if count:
        return
    if LEGACY_ENROLLMENTS.exists():
        try:
            rows = json.loads(LEGACY_ENROLLMENTS.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            rows = []
        for row in rows:
            try:
                insert_student(row)
            except sqlite3.IntegrityError:
                continue
    if LEGACY_PROGRESS.exists():
        try:
            progress_map = json.loads(LEGACY_PROGRESS.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            progress_map = {}
        for email, payload in progress_map.items():
            student = get_student_by_email(email)
            if student:
                upsert_progress(student["id"], payload)