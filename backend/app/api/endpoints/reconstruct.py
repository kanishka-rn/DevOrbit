from fastapi import APIRouter, BackgroundTasks
import uuid
import time
import asyncio

router = APIRouter()

jobs = {}

async def process_reconstruction(job_id: str, input_id: str):
    jobs[job_id] = {"status": "processing", "stage": "Frames extracted", "progress": 10, "message": "Extracting frames..."}
    await asyncio.sleep(2)
    jobs[job_id] = {"status": "processing", "stage": "Camera estimated", "progress": 30, "message": "Estimating camera poses..."}
    await asyncio.sleep(2)
    jobs[job_id] = {"status": "processing", "stage": "Depth generated", "progress": 50, "message": "Generating depth maps (fallback)..."}
    await asyncio.sleep(2)
    jobs[job_id] = {"status": "processing", "stage": "3D geometry built", "progress": 70, "message": "Building point cloud..."}
    await asyncio.sleep(2)
    jobs[job_id] = {"status": "completed", "stage": "Validation completed", "progress": 100, "message": "Reconstruction complete", "world_id": str(uuid.uuid4())}

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
