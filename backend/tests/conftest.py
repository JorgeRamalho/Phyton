"""Fixtures pytest — banco e cliente HTTP."""

import uuid

import pytest
from fastapi.testclient import TestClient

from app import db
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def _init_database():
    db.init_db()


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def unique_email():
    return f"user-{uuid.uuid4().hex[:10]}@phytonfree.local"