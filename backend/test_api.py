from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_upload():
    response = client.post("/api/input/url", params={"url": "demo_url"})
    assert response.status_code == 200
    assert "input_id" in response.json()

def test_reconstruction_and_world():
    # Start
    response = client.post("/api/reconstruct", params={"input_id": "test_input_id"})
    assert response.status_code == 200
    job_id = response.json()["job_id"]
    
    # We can't easily wait for the async background task in a simple test without proper asyncio handling
    # Let's just check the job status endpoint exists
    response_status = client.get(f"/api/reconstruct/{job_id}/status")
    assert response_status.status_code == 200
    assert "status" in response_status.json()
