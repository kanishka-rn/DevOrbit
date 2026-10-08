from fastapi import APIRouter
from app.evaluation.evaluator import GroundTruthEvaluator
from app.api.endpoints.world import get_world
from app.pipeline.completion import SceneCompleter

router = APIRouter()

@router.post("/run/{world_id}")
async def run_evaluation(world_id: str, scenario: str = "hidden_back_wall"):
    world = await get_world(world_id)
    evaluator = GroundTruthEvaluator(scenario_name=scenario)
    completer = SceneCompleter()
    
    # Base nodes without completions for fair baseline
    base_nodes = [n for n in world["nodes"] if n.get("status") != "generated"]
    
    # Apply noise if the scenario specifies it
    if "noise_profile" in evaluator.scenario:
        base_nodes = evaluator.apply_noise(base_nodes, evaluator.scenario["noise_profile"])
    
    # 1. Geometry Only
    geom_nodes = completer.complete(list(base_nodes), mode="geometry_only")
    rep_geom = evaluator.evaluate(geom_nodes)
    
    # 2. Structural Constraints
    struct_nodes = completer.complete(list(base_nodes), mode="structural")
    rep_struct = evaluator.evaluate(struct_nodes)
    
    # 3. Full SpaceMind
    full_nodes = completer.complete(list(base_nodes), mode="full")
    rep_full = evaluator.evaluate(full_nodes)
    
    report = rep_full.copy()
    report["ablation"] = {
        "geometry_only": {"iou": rep_geom["completion"]["iou"], "error": rep_geom["completion"]["geometric_error"]},
        "structural": {"iou": rep_struct["completion"]["iou"], "error": rep_struct["completion"]["geometric_error"]},
        "full": {"iou": rep_full["completion"]["iou"], "error": rep_full["completion"]["geometric_error"]}
    }
    
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
