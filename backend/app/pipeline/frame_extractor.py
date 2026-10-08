import cv2
import os

class FrameExtractor:
    def __init__(self, output_dir="data/frames", max_frames=20):
        self.output_dir = output_dir
        self.max_frames = max_frames
        os.makedirs(self.output_dir, exist_ok=True)
        
    def extract(self, video_path):
        if not os.path.exists(video_path):
            return []
            
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        if total_frames <= 0 or fps <= 0:
            return []
            
        step = max(1, total_frames // self.max_frames)
        
        extracted = []
        count = 0
        frame_id = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            if count % step == 0 and len(extracted) < self.max_frames:
                # Resize if too large to save space/time
                h, w = frame.shape[:2]
                if w > 1280:
                    scale = 1280 / w
                    frame = cv2.resize(frame, (1280, int(h * scale)))
                    
                timestamp = count / fps
                path = os.path.join(self.output_dir, f"frame_{frame_id:04d}.jpg")
                cv2.imwrite(path, frame)
                
                extracted.append({
                    "frame_id": frame_id,
                    "timestamp": timestamp,
                    "path": path,
                    "quality": 0.95 # Mock quality heuristic
                })
                frame_id += 1
                
            count += 1
            
        cap.release()
        return extracted
