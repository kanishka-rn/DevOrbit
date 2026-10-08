class ProvenanceGenerator:
    def annotate(self, scene_nodes, frames):
        # Link frames to observed surfaces
        frame_ids = [f["frame_id"] for f in frames[:5]] if frames else []
        for node in scene_nodes:
            if node["status"] == "observed":
                node["evidence_frames"] = frame_ids
                node["source"] = "video_reconstruction"
            elif node["status"] == "inferred":
                node["source"] = "geometry_completion"
                node["reason"] = "continuation_of_adjacent_wall"
            elif node["status"] == "generated":
                node["source"] = "geometry_completion"
                node["reason"] = "wall_plane_continuation"
                
        return scene_nodes
