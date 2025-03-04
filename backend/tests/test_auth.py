from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
# Tests para pobrar el registrado del usuario y la invalidacion de un login
def test_user_registration():
    response = client.post("/auth/register", json={
        "username": "Test User",
        "useremail": "test@example.com",
        "passwordhash": "securepassword123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_invalid_login():
    response = client.post("/auth/login", data={
        "username": "wrong@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401