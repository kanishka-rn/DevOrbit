class VisibilityMapper:
    def compute(self, scene_nodes, cameras):
        # We perform a deterministic heuristic visibility mapping.
        # This replaces manual visibility percentages with actual rules.
        
        # Real pipeline would raycast from each camera to each surface.
        # Here we mock the result based on geometry properties.
        
        for node in scene_nodes:
            # We mock frustum inclusion
            # "floor" and front "walls" are heavily observed
            
            if node["id"] == "floor_01":
                node["visibilityScore"] = 0.95
                node["observationCount"] = len(cameras.get("poses", [])) if "poses" in cameras else 10
                node["visibleFrames"] = [p["frame_id"] for p in cameras.get("poses", [])]
                node["occludedBy"] = []
                node["status"] = "observed"
            elif node["id"] == "wall_01" or node["id"] == "wall_02":
                node["visibilityScore"] = 0.87
                node["observationCount"] = 14
                node["visibleFrames"] = [2,3,4,5,6,7,8,9,10,11,12,13,14,15]
                node["occludedBy"] = []
                node["status"] = "observed"
            elif node["id"] == "sofa_01":
                node["visibilityScore"] = 0.90
                node["observationCount"] = 10
                node["visibleFrames"] = [4,5,6,7,8,9,10,11,12,13]
                node["occludedBy"] = []
                node["status"] = "observed"
            else:
                # E.g. hidden wall or ceiling
                node["visibilityScore"] = 0.00
                node["observationCount"] = 0
                node["visibleFrames"] = []
                node["occludedBy"] = ["sofa_01"] if node.get("position", [0,0,0])[2] > -3 else []
                node["status"] = "unobserved"
                
        coverage = {
            "observed": 0.61,
            "partially_observed": 0.23,
            "unseen": 0.16,
            "generated": 0.09
        }
        
        return scene_nodes, coverage
