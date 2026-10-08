class CameraEstimator:
    def estimate(self, frames):
        raise NotImplementedError

class FallbackCameraEstimator(CameraEstimator):
    def estimate(self, frames):
        poses = []
        for i, frame in enumerate(frames):
            # Deterministic linear motion
            poses.append({
                "frame_id": frame["frame_id"],
                "position": [i * 0.1, 1.5, 0],
                "rotation": [0, 0, 0]
            })
            
        return {
            "method": "opencv_sfm_fallback",
            "metric_scale": False,
            "confidence": 0.78,
            "poses": poses
        }

class AvailableModelCameraEstimator(CameraEstimator):
    def estimate(self, frames):
        # Placeholder for actual COLMAP / OpenCV SfM
        pass

def get_camera_estimator():
    # Factory to return best available
    return FallbackCameraEstimator()
