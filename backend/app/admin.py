"""Painel local (demonstração) — somente com chave de desenvolvimento."""

from __future__ import annotations

import os
from typing import Any

from .enrollment import list_enrollments_public
from .progress_store import all_progress_summary

DEFAULT_ADMIN_KEY = "phytonfree-local-dev"


def admin_key() -> str:
    return os.environ.get("PHYTONFREE_ADMIN_KEY", DEFAULT_ADMIN_KEY)


def assert_admin(provided: str | None) -> dict | None:
    if not provided or provided != admin_key():
        return {"ok": False, "error": "Chave de administrador inválida."}
    return None


def build_summary() -> dict[str, Any]:
    enrollments = list_enrollments_public()
    progress_rows = all_progress_summary()
    return {
        "ok": True,
        "storage": "sqlite",
        "enrollments_count": len(enrollments),
        "progress_count": len(progress_rows),
        "enrollments": enrollments,
        "progress_by_email": progress_rows,
    }