import json
import os
from .geometry_metrics import compute_box_iou, compute_geometric_error

class GroundTruthEvaluator:
    def __init__(self, ground_truth_path="data/ground_truth/demo_room/ground_truth.json",
                 scenario_path="data/ground_truth/scenarios/hidden_back_wall.json"):
        with open(ground_truth_path, 'r') as f:
            self.gt = json.load(f)
        with open(scenario_path, 'r') as f:
            self.scenario = json.load(f)
            
        self.gt_nodes_by_id = {n["id"]: n for n in self.gt["nodes"]}

    def evaluate(self, prediction_nodes):
        observed_evals = []
        completion_evals = []
        
        # Match predicted nodes to Ground Truth
        for p_node in prediction_nodes:
            # Simple heuristic matcher: find best IoU overlap with GT
            best_iou = 0
            best_gt = None
            for gt_node in self.gt["nodes"]:
                iou = compute_box_iou(p_node, gt_node)
                if iou > best_iou:
                    best_iou = iou
                    best_gt = gt_node
                    
            if best_gt:
                error = compute_geometric_error(p_node, best_gt)
                eval_record = {
                    "predicted_id": p_node["id"],
                    "target_id": best_gt["id"],
                    "iou": best_iou,
                    "geometric_error": error,
                    "surface_coverage": min(1.0, best_iou * 1.2) # Mock coverage scaling
                }
                
                # Check if it was in the hidden set or observed set
                if best_gt["id"] in self.scenario["hidden"]:
                    completion_evals.append(eval_record)
                else:
                    observed_evals.append(eval_record)
                    
        # Aggregate metrics
        obs_coverage = sum(e["surface_coverage"] for e in observed_evals) / max(1, len(self.scenario["observed"]))
        obs_error = sum(e["geometric_error"] for e in observed_evals) / max(1, len(observed_evals))
        
        comp_coverage = sum(e["surface_coverage"] for e in completion_evals) / max(1, len(self.scenario["hidden"]))
        comp_error = sum(e["geometric_error"] for e in completion_evals) / max(1, len(completion_evals))
        comp_iou = sum(e["iou"] for e in completion_evals) / max(1, len(completion_evals))
        
        overall_completeness = (len(observed_evals) + len(completion_evals)) / len(self.gt["nodes"])
        
        return {
            "scene_id": self.gt["scene_id"],
            "scenario": self.scenario["scenario"],
            "observed": {
                "surface_coverage": min(1.0, obs_coverage),
                "geometric_error": round(obs_error, 3)
            },
            "completion": {
                "surface_coverage": min(1.0, comp_coverage),
                "geometric_error": round(comp_error, 3),
                "iou": round(comp_iou, 3)
            },
            "overall": {
                "completeness": min(1.0, overall_completeness)
            },
            "details": {
                "observed": observed_evals,
                "completion": completion_evals
            }
        }
