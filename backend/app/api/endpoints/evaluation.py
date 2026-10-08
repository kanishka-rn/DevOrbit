from fastapi import APIRouter
from app.evaluation.evaluator import GroundTruthEvaluator
from app.api.endpoints.world import get_world

router = APIRouter()

@router.post("/run/{world_id}")
async def run_evaluation(world_id: str):
    world = await get_world(world_id)
    evaluator = GroundTruthEvaluator()
    report = evaluator.evaluate(world["nodes"])
    
    # Save the report internally to the world object for persistence
    world["evaluation"] = report
    return {"status": "success", "report": report}

@router.get("/{world_id}")
async def get_evaluation(world_id: str):
    world = await get_world(world_id)
    return world.get("evaluation", None)

@router.get("/{world_id}/report")
async def get_evaluation_report(world_id: str):
    world = await get_world(world_id)
    eval_data = world.get("evaluation", {})
    
    # Format the explicit JSON report
    report = {
        "project": "SpaceMind",
        "scene": eval_data.get("scene_id", "demo_room_01"),
        "scenario": eval_data.get("scenario", "hidden_back_wall"),
        "pipeline": {
            "camera_estimator": "fallback",
            "depth_estimator": "fallback",
            "visibility": "geometric",
            "completion": "procedural"
        },
        "metrics": {
            "observed_surface_coverage": eval_data.get("observed", {}).get("surface_coverage", 0),
            "observed_geometric_error": eval_data.get("observed", {}).get("geometric_error", 0),
            "completion_surface_coverage": eval_data.get("completion", {}).get("surface_coverage", 0),
            "completion_iou": eval_data.get("completion", {}).get("iou", 0),
            "completion_geometric_error": eval_data.get("completion", {}).get("geometric_error", 0)
        }
    }
    return report
