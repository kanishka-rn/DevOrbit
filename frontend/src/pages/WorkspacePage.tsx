import { useEffect } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { getReconstructStatus, getWorld } from '../api/client';
import { ThreeViewer } from '../viewer/ThreeViewer';
import { Panels } from '../panels/Panels';
import { Eye, Target, AlertTriangle, Activity } from 'lucide-react';

export const WorkspacePage = () => {
  const { status, setStatus, jobId, processingStage, setProcessingStage, viewMode, setViewMode, setWorldId, worldId, setWorldData } = useWorldStore();

  useEffect(() => {
    if (status === 'processing' && jobId) {
      const interval = setInterval(async () => {
        const res = await getReconstructStatus(jobId);
        if (res.status === 'completed') {
          setStatus('ready');
          setProcessingStage(res.stage);
          setWorldId(res.world_id);
          clearInterval(interval);
        } else {
          setProcessingStage(res.stage);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, jobId, setStatus, setProcessingStage, setWorldId]);

  useEffect(() => {
    if (status === 'ready' && worldId) {
      getWorld(worldId).then(data => {
        setWorldData(data);
      });
    }
  }, [status, worldId, setWorldData]);

  if (status === 'processing') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 gap-6">
        <div className="w-12 h-12 border-4 border-neutral-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="text-sm font-mono tracking-wider">{processingStage.toUpperCase()}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-neutral-950">
      {/* LEFT SIDEBAR - VIEW MODES */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-950/80 flex flex-col z-10 shrink-0">
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 mb-3">WORLD LAYERS</h3>
          <div className="space-y-1">
            <ViewModeButton active={viewMode === 'reality'} onClick={() => setViewMode('reality')} icon={<Eye size={14} />} label="RECONSTRUCTED" desc="Observed geometry only" />
            <ViewModeButton active={viewMode === 'complete'} onClick={() => setViewMode('complete')} icon={<Target size={14} />} label="COMPLETED" desc="Observed + Generated" />
          </div>
        </div>
        
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 mb-3">ANALYSIS</h3>
          <div className="space-y-1">
            <ViewModeButton active={viewMode === 'uncertainty'} onClick={() => setViewMode('uncertainty')} icon={<AlertTriangle size={14} />} label="EVIDENCE VIEW" desc="Provenance tracking" />
            <ViewModeButton active={viewMode === 'coverage'} onClick={() => setViewMode('coverage')} icon={<Activity size={14} />} label="UNSEEN REGIONS" desc="Highlight missing geometry" />
            <ViewModeButton active={viewMode === 'difference'} onClick={() => setViewMode('difference')} icon={<Eye size={14} />} label="DIFFERENCE VIEW" desc="Ground-truth error highlight" />
          </div>
        </div>
      </div>

      {/* CENTER - 3D VIEWER */}
      <div className="flex-1 relative bg-black">
        <ThreeViewer />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 px-4 py-2 bg-neutral-900/80 rounded-full text-xs font-medium border border-neutral-800 backdrop-blur-md">
          <LegendItem color="bg-emerald-500" label="OBSERVED" />
          <LegendItem color="bg-blue-500" label="INFERRED" />
          <LegendItem color="bg-amber-500" label="GENERATED" />
          <LegendItem color="bg-rose-500" label="UNCERTAIN" />
        </div>
      </div>

      {/* RIGHT SIDEBAR - PANELS */}
      <Panels />
    </div>
  );
};

const ViewModeButton = ({ active, onClick, icon, label, desc }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-col items-start px-3 py-2 rounded-md transition-all ${active ? 'bg-neutral-800/80 border-l-2 border-emerald-500' : 'hover:bg-neutral-900 border-l-2 border-transparent'}`}
  >
    <div className={`flex items-center gap-2 text-xs font-bold ${active ? 'text-emerald-400' : 'text-neutral-300'}`}>
      {icon}
      {label}
    </div>
    <span className="text-[10px] text-neutral-500 mt-0.5 ml-6">{desc}</span>
  </button>
);

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-neutral-300">{label}</span>
  </div>
);
