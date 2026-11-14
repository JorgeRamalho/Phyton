"""Testes da API, JWT, SQLite e code_run."""

from app.exercises_catalog import check_answer

SAMPLE_STUDENT = {
    "name": "Ada Lovelace",
    "password": "segredo1",
    "levelStart": "iniciante",
    "goal": "Concluir trilha",
    "hours": 6,
}


def test_health(client):
    response = client.get("/api/health")
    data = response.json()
    assert data["ok"] is True
    assert data["storage"] == "sqlite"
    assert "jwt" in data.get("features", [])


def test_matricula_returns_jwt(client, unique_email):
    client.post("/api/matricula", json={**SAMPLE_STUDENT, "email": unique_email})
    login = client.post("/api/auth/login", json={"email": unique_email, "password": SAMPLE_STUDENT["password"]})
    data = login.json()
    assert data["ok"] is True
    assert data.get("access_token")


def test_progress_sync_with_jwt(client, unique_email):
    reg = client.post("/api/matricula", json={**SAMPLE_STUDENT, "email": unique_email})
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    push = client.post(
        "/api/progress/sync",
        headers=headers,
        json={
            "progress": {
                "xp": 200,
                "streak": 3,
                "minutes": 50,
                "completedLessons": ["l01", "l02"],
                "completedExercises": ["e01"],
                "currentLessonId": "l03",
                "lastVisit": "Mon",
            }
        },
    )
    assert push.json()["ok"] is True
    pull = client.get("/api/progress/me", headers=headers)
    assert pull.json()["progress"]["xp"] == 200
    assert "l02" in pull.json()["progress"]["completedLessons"]


def test_code_run_exercise():
    good = check_answer("e13", source='print("PhytonFree")')
    assert good["ok"] is True
    bad = check_answer("e14", source='print("oi")')
    assert bad["ok"] is False
    loop = check_answer("e14", source="for n in range(3):\n    print(n)")
    assert loop["ok"] is True


def test_exercise_check_endpoint(client):
    response = client.post(
        "/api/exercises/check",
        json={"exercise_id": "e13", "source": 'print("PhytonFree")'},
    )
    assert response.json()["ok"] is True


def test_admin_denied_and_allowed(client):
    denied = client.get("/api/admin/summary")
    assert denied.json()["ok"] is False
    allowed = client.get("/api/admin/summary?key=phytonfree-local-dev")
    assert allowed.json()["ok"] is True
    assert allowed.json()["storage"] == "sqlite"