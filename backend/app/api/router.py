from fastapi import APIRouter
from app.api.endpoints import input, reconstruct, world

api_router = APIRouter()
api_router.include_router(input.router, prefix="/input", tags=["input"])
api_router.include_router(reconstruct.router, prefix="/reconstruct", tags=["reconstruct"])
api_router.include_router(world.router, prefix="/world", tags=["world"])
