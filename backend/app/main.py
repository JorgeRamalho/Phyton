"""FastAPI — motor Python do PhytonFree."""

from __future__ import annotations

import platform
import sys
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import db
from .admin import assert_admin, build_summary
from .auth import login as auth_login
from .enrollment import find_by_id, save_enrollment
from .exercises_catalog import check_answer
from .progress_store import load_progress, load_progress_by_id, save_progress, save_progress_for_student
from .runner import run_python
from .security import decode_access_token


@asynccontextmanager
async def lifespan(_: FastAPI):
    db.init_db()
    yield


app = FastAPI(
    title="PhytonFree API",
    description="Execução de Python, exercícios, JWT, SQLite e painel local.",
    version="1.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5501",
        "http://localhost:5501",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class RunBody(BaseModel):
    source: str = Field(..., max_length=8000)
    repl: bool = True


class EnrollBody(BaseModel):
    name: str
    email: str
    password: str
    levelStart: str
    goal: str = ""
    hours: int = 6
    phone: str = ""
    birth: str = ""
    city: str = ""
    state: str = ""
    experience: str = ""
    schedule: str = ""
    contact: str = ""
    source: str = ""
    newsletter: bool = False


class LoginBody(BaseModel):
    email: str
    password: str


class ExerciseCheckBody(BaseModel):
    exercise_id: str = Field(..., max_length=8)
    choice_index: int | None = None
    value: str | None = Field(None, max_length=240)
    source: str | None = Field(None, max_length=8000)


class ProgressBody(BaseModel):
    email: str
    password: str
    progress: dict


class ProgressSyncBody(BaseModel):
    progress: dict


def student_from_bearer(authorization: str | None = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token ausente.")
    payload = decode_access_token(authorization.removeprefix("Bearer ").strip())
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")
    student = find_by_id(str(payload.get("sub")))
    if not student:
        raise HTTPException(status_code=401, detail="Aluno não encontrado.")
    return student


@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "service": "phytonfree-api",
        "python_version": platform.python_version(),
        "platform": sys.platform,
        "storage": "sqlite",
        "features": ["run", "matricula", "auth", "jwt", "exercises", "code_run", "progress", "admin"],
    }


@app.post("/api/run")
def run_code(body: RunBody) -> dict:
    result = run_python(body.source, repl=body.repl)
    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "error": result.error,
        "exit_code": result.exit_code,
        "engine": "python",
    }


@app.post("/api/matricula")
def matricula(body: EnrollBody) -> dict:
    return save_enrollment(body.model_dump())


@app.post("/api/auth/login")
def login(body: LoginBody) -> dict:
    return auth_login(body.email, body.password)


@app.post("/api/exercises/check")
def exercises_check(body: ExerciseCheckBody) -> dict:
    result = check_answer(
        body.exercise_id,
        choice_index=body.choice_index,
        value=body.value,
        source=body.source,
    )
    if result.get("error") and not result.get("ok"):
        return {"ok": False, "error": result["error"], "explain": result.get("explain", "")}
    return result


@app.get("/api/progress/me")
def progress_me(student: dict = Depends(student_from_bearer)) -> dict:
    return load_progress_by_id(student["id"])


@app.post("/api/progress/sync")
def progress_sync(body: ProgressSyncBody, student: dict = Depends(student_from_bearer)) -> dict:
    return save_progress_for_student(student["id"], body.progress)


@app.post("/api/progress/pull")
def progress_pull(body: LoginBody) -> dict:
    result = load_progress(body.email, body.password)
    if result.get("ok"):
        from .enrollment import issue_token

        student = find_by_id(result["student"]["id"])
        if student:
            result.update(issue_token(student))
    return result


@app.post("/api/progress/push")
def progress_push(body: ProgressBody) -> dict:
    return save_progress(body.email, body.password, body.progress)


@app.get("/api/admin/summary")
def admin_summary(
    x_admin_key: str | None = Header(None, alias="X-Admin-Key"),
    key: str | None = Query(None),
) -> dict:
    denied = assert_admin(x_admin_key or key)
    if denied:
        return denied
    return build_summary()