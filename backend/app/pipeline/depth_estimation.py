class DepthEstimator:
    def estimate(self, frames):
        # Fallback to planar/heuristic depth
        depth_maps = []
        for frame in frames:
            depth_maps.append({
                "frame_id": frame["frame_id"],
                "method": "heuristic_fallback",
                "mean_depth": 3.5
            })
        return depth_maps
