class DepthEstimator:
    def estimate(self, frames):
        raise NotImplementedError

class FallbackDepthEstimator(DepthEstimator):
    def estimate(self, frames):
        depth_maps = []
        for frame in frames:
            depth_maps.append({
                "frame_id": frame["frame_id"],
                "method": "fallback",
                "mean_depth": 3.5
            })
        return {
            "method": "fallback",
            "depths": depth_maps
        }

class PretrainedDepthEstimator(DepthEstimator):
    def estimate(self, frames):
        # Placeholder for MiDaS / ZoeDepth
        pass

def get_depth_estimator():
    return FallbackDepthEstimator()
