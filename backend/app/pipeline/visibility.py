class VisibilityMapper:
    def compute(self, scene_nodes, cameras):
        # Fallback visibility computation
        # In a real app we'd use frustum culling + raycasting occlusion
        
        for node in scene_nodes:
            if node["status"] == "observed":
                node["visibility"] = 0.8
                node["observation_count"] = 15
            else:
                node["visibility"] = 0.0
                node["observation_count"] = 0
                
        coverage = {
            "observed": 0.68,
            "occluded": 0.12,
            "unseen": 0.20,
            "generated": 0
        }
        
        return scene_nodes, coverage
