import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Video } from 'lucide-react';
import { useWorldStore } from '../stores/useWorldStore';
import { startReconstruction } from '../api/client';

export const UploadPage = () => {
  const navigate = useNavigate();
  const { setStatus, setJobId } = useWorldStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDemo = async () => {
    setStatus('processing');
    const res = await startReconstruction("demo_input_id");
    setJobId(res.job_id);
    navigate('/workspace');
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="max-w-2xl w-full flex flex-col gap-8 items-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-neutral-200 tracking-wide">Reconstruct the unseen.</h2>
          <p className="text-neutral-500 max-w-md mx-auto leading-relaxed">
            Upload a room video. We reconstruct what was observed, infer what is hidden, and generate the missing regions with explicit provenance.
          </p>
        </div>

        <div 
          className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all ${isDragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-800 bg-neutral-900/20'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Handle file */ }}
        >
          <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-neutral-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-300">Drag and drop room video</p>
            <p className="text-xs text-neutral-600 mt-1">MP4, MOV, WEBM up to 500MB</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-px bg-neutral-800"></div>
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-neutral-800"></div>
        </div>

        <button 
          onClick={handleDemo}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-sm font-medium text-neutral-300 transition-colors"
        >
          <Video className="w-4 h-4 text-emerald-400" />
          USE DEMO ROOM
        </button>
      </div>
    </div>
  );
};
