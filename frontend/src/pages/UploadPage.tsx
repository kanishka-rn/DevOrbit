import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Video, FileImage, AlertCircle, Loader2 } from 'lucide-react';
import { useWorldStore } from '../stores/useWorldStore';
import { uploadVideo, startReconstruction } from '../api/client';

export const UploadPage = () => {
  const navigate = useNavigate();
  const { setStatus, setJobId } = useWorldStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<'video' | 'blueprint'>('video');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDemo = async () => {
    try {
      setStatus('processing');
      const res = await startReconstruction("demo_input_id", mode);
      setJobId(res.job_id);
      navigate('/workspace');
    } catch (err) {
      setErrorMsg("Failed to connect to backend server.");
      setStatus('idle');
    }
  };

  const validateAndProcessFile = async (file: File) => {
    setErrorMsg(null);
    
    let validTypes = mode === 'video' 
      ? ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']
      : ['image/jpeg', 'image/png', 'application/pdf'];
      
    let validExtensions = mode === 'video'
      ? ['mp4', 'mov', 'webm', 'mkv', 'avi']
      : ['jpg', 'jpeg', 'png', 'pdf'];
      
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && (!extension || !validExtensions.includes(extension))) {
      setErrorMsg(`INVALID_FILE: Unsupported format. Please upload ${mode === 'video' ? 'MP4, MOV, or WEBM' : 'JPG, PNG, or PDF'}.`);
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setErrorMsg("FILE_TOO_LARGE: Exceeds the 500MB limit.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadRes = await uploadVideo(file);
      setStatus('processing');
      // Pass the mode along so backend could switch pipelines
      const reconRes = await startReconstruction(uploadRes.input_id, mode);
      setJobId(reconRes.job_id);
      navigate('/workspace');
    } catch (err) {
      console.error(err);
      setErrorMsg("UPLOAD_FAILED: Could not connect to backend processing server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-neutral-950 p-6 overflow-y-auto">
      <div className="max-w-2xl w-full flex flex-col gap-8 items-center py-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-neutral-200 tracking-wide">Reconstruct the unseen.</h2>
          <p className="text-neutral-500 max-w-md mx-auto leading-relaxed">
            Upload an architectural blueprint or a room video. We reconstruct what was observed, infer what is hidden, and generate the missing regions with explicit provenance.
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-neutral-900 rounded-lg w-full max-w-md">
          <button 
            onClick={() => { setMode('blueprint'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'blueprint' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <FileImage className="w-4 h-4" />
            Mode A: Blueprint
          </button>
          <button 
            onClick={() => { setMode('video'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'video' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Video className="w-4 h-4" />
            Mode B: Room Video
          </button>
        </div>

        <div 
          className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/40'}`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept={mode === 'video' ? "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" : "image/jpeg,image/png,application/pdf,.jpg,.png,.pdf"}
            onChange={handleFileChange}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-sm font-medium text-emerald-400">UPLOADING...</p>
            </div>
          ) : isDragging ? (
            <div className="flex flex-col items-center gap-3">
              <UploadCloud className="w-10 h-10 text-emerald-500 animate-bounce" />
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Drop {mode} to upload</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
                {mode === 'video' ? <Video className="w-8 h-8 text-neutral-400" /> : <FileImage className="w-8 h-8 text-neutral-400" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-300">Click or drag and drop {mode}</p>
                <p className="text-xs text-neutral-600 mt-1">
                  {mode === 'video' ? 'MP4, MOV, WEBM up to 500MB' : 'JPG, PNG, PDF up to 50MB'}
                </p>
              </div>
            </>
          )}
        </div>

        {errorMsg && (
          <div className="w-full flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold mb-1">ERROR</p>
              <p className="text-rose-400/80">{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-px bg-neutral-800"></div>
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-neutral-800"></div>
        </div>

        <button 
          onClick={(e) => { e.preventDefault(); handleDemo(); }}
          disabled={isUploading}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-sm font-medium text-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Video className="w-4 h-4 text-emerald-400" />
          TRY DEMO ROOM
        </button>
      </div>
    </div>
  );
};
