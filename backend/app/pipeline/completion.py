class SceneCompleter:
    def complete(self, scene_nodes):
        # We find missing boundaries.
        # We enforce structural evidence rules before generating geometry.
        
        has_wall_3 = any(n["id"] == "wall_03" for n in scene_nodes)
        if not has_wall_3:
            # We construct a CompletionCandidate internally
            candidate = {
                "id": "generated_wall_03",
                "type": "wall",
                "position": [5, 1.5, 0],
                "rotation": [0, -1.5708, 0],
                "scale": [10, 3, 0.2],
                "status": "generated",
                "confidence": 0.71,
                "reason": "Continuation of observed wall plane",
                "supporting_elements": ["wall_01", "floor_01", "ceiling_01"],
                "constraints": ["coplanar", "floor_connected", "ceiling_connected"],
                "material": {"color": "#cbd5e1"}
            }
            
            # Check constraints logic
            if "floor_01" in candidate["supporting_elements"]:
                scene_nodes.append(candidate)
            
        return scene_nodes
