import os
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_export_endpoints():
    # First get the test world created
    client.post("/api/reconstruct", params={"input_id": "test_input_id"})
    
    # Normally we'd wait for reconstruction, but the mock world endpoint creates a default world if not found
    world_id = "test_export_world_id"
    
    # Test GLB export
    response = client.get(f"/api/world/{world_id}/export/glb")
    assert response.status_code == 200
    assert response.headers["content-type"] == "model/gltf-binary"
    assert len(response.content) > 0 # Non-zero size file
    
    # Test PLY export
    response = client.get(f"/api/world/{world_id}/export/ply")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/octet-stream"
    assert len(response.content) > 0
    
    # Test JSON export
    response = client.get(f"/api/world/{world_id}/export/json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert len(response.content) > 0
