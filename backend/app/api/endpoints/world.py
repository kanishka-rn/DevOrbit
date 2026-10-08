from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter()

class EditRequest(BaseModel):
    target: str
    property: str
    value: str

# In-memory store for world states
# In a real app this would be a DB or filesystem, but for the hackathon we can use dict
global_worlds = {}

def get_default_nodes():
    return [
        {
            "id": "floor_01",
            "type": "floor",
            "position": [0, 0, 0],
            "rotation": [-1.5708, 0, 0],
            "scale": [10, 10, 1],
            "status": "observed",
            "confidence": 0.99,
            "evidence": ["Video coverage: 95%"],
            "validated": True,
            "material": {"color": "#f5f5f5"}
        },
        {
            "id": "wall_01",
            "type": "wall",
            "position": [0, 1.5, -5],
            "rotation": [0, 0, 0],
            "scale": [10, 3, 0.2],
            "status": "observed",
            "confidence": 0.95,
            "evidence": ["Direct visual observation"],
            "validated": True,
            "material": {"color": "#f5f5f5"}
        },
        {
            "id": "wall_02",
            "type": "wall",
            "position": [-5, 1.5, 0],
            "rotation": [0, 1.5708, 0],
            "scale": [10, 3, 0.2],
            "status": "observed",
            "confidence": 0.93,
            "evidence": ["Direct visual observation"],
            "validated": True,
            "material": {"color": "#f5f5f5"}
        },
        {
            "id": "wall_03",
            "type": "wall",
            "position": [5, 1.5, 0],
            "rotation": [0, -1.5708, 0],
            "scale": [10, 3, 0.2],
            "status": "inferred",
            "confidence": 0.85,
            "evidence": ["Room boundary extension", "Floor intersection"],
            "validated": True,
            "material": {"color": "#cbd5e1"}
        },
        {
            "id": "sofa_01",
            "type": "object",
            "position": [0, 0.5, -2],
            "rotation": [0, 0, 0],
            "scale": [2, 1, 1],
            "status": "observed",
            "confidence": 0.96,
            "evidence": ["Instance segmentation", "Depth projection"],
            "validated": True,
            "material": {"color": "#f5f5f5"}
        }
    ]

import os
import json

@router.get("/{world_id}")
async def get_world(world_id: str):
    if world_id not in global_worlds:
        filepath = f"data/outputs/{world_id}_state.json"
        if os.path.exists(filepath):
            with open(filepath, "r") as f:
                global_worlds[world_id] = json.load(f)
        else:
            global_worlds[world_id] = {
                "world_id": world_id,
                "nodes": get_default_nodes(),
                "scene_graph": {
                    "relations": [
                        {"source": "sofa_01", "target": "wall_02", "type": "AGAINST"},
                        {"source": "sofa_01", "target": "floor_01", "type": "ON"}
                    ]
                },
                "coverage": {"observed": 0.68, "occluded": 0.12, "unseen": 0.20, "generated": 0},
                "metrics": {
                    "frames": 84, "keyframes": 18, 
                    "observed_coverage": 0.68, "generated_coverage": 0, 
                    "points": 150000, "triangles": 50000, "validation_score": 92
                },
                "versions": ["v1"],
                "validation": {
                    "geometry": "PASS",
                    "spatial": "PASS",
                    "semantic": "PASS",
                    "room_consistency": "PASS"
                }
            }
    return global_worlds[world_id]

@router.get("/{world_id}/scene")
async def get_scene(world_id: str):
    world = await get_world(world_id)
    return {"world_id": world_id, "nodes": world["nodes"]}

@router.get("/{world_id}/evidence")
async def get_evidence(world_id: str):
    return {"world_id": world_id, "regions": []}

@router.get("/{world_id}/metrics")
async def get_metrics(world_id: str):
    world = await get_world(world_id)
    return world["metrics"]

@router.post("/{world_id}/complete")
async def complete_world(world_id: str):
    world = await get_world(world_id)
    
    # Check if we already generated the wall
    has_wall_4 = any(n["id"] == "wall_04" for n in world["nodes"])
    if not has_wall_4:
        world["nodes"].append({
            "id": "wall_04",
            "type": "wall",
            "position": [0, 1.5, 5],
            "rotation": [0, 0, 0],
            "scale": [10, 3, 0.2],
            "status": "generated",
            "confidence": 0.87,
            "evidence": ["Adjacent wall geometry", "Floor boundary", "Room dimensions"],
            "validated": True,
            "material": {"color": "#94a3b8"}
        })
        world["metrics"]["generated_coverage"] = 29
        world["coverage"]["unseen"] = 0
        world["coverage"]["observed"] = 0.68
        world["coverage"]["generated"] = 0.32
    
    return {"world_id": world_id, "status": "completed"}

@router.post("/{world_id}/validate")
async def validate_world(world_id: str):
    return {"world_id": world_id, "validation_score": 95}

@router.post("/{world_id}/edit")
async def edit_world(world_id: str, edit: EditRequest):
    world = await get_world(world_id)
    target = edit.target.lower()
    value = edit.value.lower()
    
    # Basic NL parser logic simulation
    for node in world["nodes"]:
        if target in node["type"].lower() or target in node["id"].lower():
            if edit.property == "material_change" or edit.property == "color":
                node["material"] = {"color": value}
    
    new_version = f"v{len(world['versions']) + 1}"
    world["versions"].append(new_version)
    
    return {"world_id": world_id, "edit": edit.dict(), "status": "applied", "version": new_version}

@router.get("/{world_id}/export/glb")
async def export_glb(world_id: str):
    return {"url": f"/exports/{world_id}/scene.glb"}

@router.get("/{world_id}/export/ply")
async def export_ply(world_id: str):
    return {"url": f"/exports/{world_id}/scene.ply"}
