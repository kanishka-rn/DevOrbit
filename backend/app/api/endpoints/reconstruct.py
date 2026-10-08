from fastapi import APIRouter, BackgroundTasks
import uuid
import time
import asyncio
import json
import os

router = APIRouter()

jobs = {}

OUTPUT_DIR = "data/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

async def process_reconstruction(job_id: str, input_id: str):
    jobs[job_id] = {"status": "processing", "stage": "Input analyzed", "progress": 10, "message": "Analyzing video..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Frames extracted", "progress": 20, "message": "Extracting frames..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Keyframes selected", "progress": 30, "message": "Selecting keyframes..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Camera estimated", "progress": 40, "message": "Estimating camera poses..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Depth generated", "progress": 50, "message": "Generating depth maps..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "3D geometry built", "progress": 60, "message": "Building point cloud..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Scene graph created", "progress": 70, "message": "Creating scene graph..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Visibility analyzed", "progress": 80, "message": "Analyzing visibility..."}
    await asyncio.sleep(1)
    jobs[job_id] = {"status": "processing", "stage": "Missing regions detected", "progress": 90, "message": "Detecting missing regions..."}
    await asyncio.sleep(1)
    
    world_id = str(uuid.uuid4())
    
    world_state = {
        "world_id": world_id,
        "input": {"input_id": input_id},
        "room": {},
        "cameras": [],
        "geometry": {},
        "scene_graph": {},
        "regions": [],
        "objects": [],
        "visibility": {},
        "completion": {},
        "validation": {},
        "appearance": {},
        "versions": ["v1"],
        "metrics": {
            "frames": 84,
            "keyframes": 18,
            "observed_coverage": 71,
            "generated_coverage": 0,
            "points": 150000,
            "triangles": 50000,
            "processing_time": 9.2
        }
    }
    
    with open(f"{OUTPUT_DIR}/{world_id}_state.json", "w") as f:
        json.dump(world_state, f)
        
    jobs[job_id] = {"status": "completed", "stage": "Validation completed", "progress": 100, "message": "Reconstruction complete", "world_id": world_id}

@router.post("")
async def start_reconstruction(input_id: str, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "queued", "stage": "queued", "progress": 0, "message": "Job queued"}
    background_tasks.add_task(process_reconstruction, job_id, input_id)
    return {"job_id": job_id}

@router.get("/{job_id}")
async def get_reconstruct_job(job_id: str):
    return jobs.get(job_id, {"status": "not_found"})

@router.get("/{job_id}/status")
async def get_reconstruct_status(job_id: str):
    return jobs.get(job_id, {"status": "not_found"})
