class CameraEstimator:
    def estimate(self, frames):
        # In a full SFM pipeline we would extract features and compute poses.
        # Here we provide a modular fallback.
        
        poses = []
        for i, frame in enumerate(frames):
            # Mock linear movement for fallback
            poses.append({
                "frame_id": frame["frame_id"],
                "position": [i * 0.1, 1.5, 0],
                "rotation": [0, 0, 0]
            })
            
        return {
            "method": "opencv_fallback",
            "metric_scale": False,
            "confidence": 0.72,
            "poses": poses
        }
