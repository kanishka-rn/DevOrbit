from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class EditRequest(BaseModel):
    target: str
    property: str
    value: str

@router.get("/{world_id}")
async def get_world(world_id: str):
    return {"world_id": world_id, "versions": ["v1"]}

@router.get("/{world_id}/scene")
async def get_scene(world_id: str):
    return {"world_id": world_id, "scene_graph": {"ROOM": {"FLOOR": {}, "WALL_01": {}, "WALL_02": {}}}}

@router.get("/{world_id}/evidence")
async def get_evidence(world_id: str):
    return {"world_id": world_id, "regions": []}

@router.get("/{world_id}/metrics")
async def get_metrics(world_id: str):
    return {
        "frames": 84,
        "keyframes": 18,
        "observed_coverage": 71,
        "generated_coverage": 29,
        "points": 150000,
        "triangles": 50000,
        "validation_score": 92
    }

@router.post("/{world_id}/complete")
async def complete_world(world_id: str):
    return {"world_id": world_id, "status": "completed"}

@router.post("/{world_id}/validate")
async def validate_world(world_id: str):
    return {"world_id": world_id, "validation_score": 95}

@router.post("/{world_id}/edit")
async def edit_world(world_id: str, edit: EditRequest):
    return {"world_id": world_id, "edit": edit.dict(), "status": "applied"}

@router.get("/{world_id}/export/glb")
async def export_glb(world_id: str):
    return {"url": f"/exports/{world_id}/scene.glb"}

@router.get("/{world_id}/export/ply")
async def export_ply(world_id: str):
    return {"url": f"/exports/{world_id}/scene.ply"}
