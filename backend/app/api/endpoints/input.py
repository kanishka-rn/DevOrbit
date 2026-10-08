from fastapi import APIRouter, UploadFile, File
import uuid

import os
import shutil

router = APIRouter()

INPUT_DIR = "data/inputs"
os.makedirs(INPUT_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    filepath = os.path.join(INPUT_DIR, f"{file_id}_{file.filename}")
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"input_id": file_id, "filename": file.filename, "status": "uploaded", "path": filepath}

@router.post("/url")
async def upload_url(url: str):
    file_id = str(uuid.uuid4())
    return {"input_id": file_id, "url": url, "status": "uploaded", "path": "demo_path"}

@router.get("/{input_id}")
async def get_input(input_id: str):
    return {"input_id": input_id, "status": "ready"}
