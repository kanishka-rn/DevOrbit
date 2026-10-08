import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorldStore } from '../stores/useWorldStore';
import { getReconstructStatus, getWorld } from '../api/client';
import { ThreeViewer } from '../viewer/ThreeViewer';
import { Panels } from '../panels/Panels';
import { Eye, Target, AlertTriangle, Activity } from 'lucide-react';

export const WorkspacePage = () => {
  const { status, setStatus, jobId, processingStage, setProcessingStage, viewMode, setViewMode, setWorldId, worldId, setWorldData, researchMode, setResearchMode, resetDemo } = useWorldStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'processing' && jobId) {
      const interval = setInterval(async () => {
        try {
          const res = await getReconstructStatus(jobId);
          if (res.status === 'completed') {
            setStatus('ready');
            setProcessingStage(res.stage);
            setWorldId(res.world_id);
            clearInterval(interval);
          } else {
            setProcessingStage(res.stage);
          }
        } catch (e) {
          setProcessingStage("Fallback active: proceeding with reduced confidence...");
          setTimeout(() => {
            setStatus('ready');
            setWorldId('demo_world_fallback');
            clearInterval(interval);
          }, 2000);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, jobId, setStatus, setProcessingStage, setWorldId]);

  useEffect(() => {
    if (status === 'ready' && worldId) {
      getWorld(worldId).then(data => {
        setWorldData(data);
      }).catch(() => {
        console.error("Failed to load world data");
      });
    }
  }, [status, worldId, setWorldData]);

  if (status === 'processing') {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-400 gap-6">
        <div className="w-12 h-12 border-4 border-neutral-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="text-sm font-mono tracking-wider text-center max-w-sm">
          <div className="mb-2 text-emerald-500">PROCESSING SPACE</div>
          {processingStage.toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-neutral-950">
      {/* LEFT SIDEBAR - VIEW MODES */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-950/80 flex flex-col z-10 shrink-0 h-full">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500">RESEARCH MODE</h3>
          <button 
            onClick={() => setResearchMode(!researchMode)}
            className={`w-8 h-4 rounded-full transition-colors relative ${researchMode ? 'bg-emerald-500' : 'bg-neutral-700'}`}
          >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${researchMode ? 'left-4' : 'left-0.5'}`}></div>
          </button>
        </div>
        
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 mb-3">WORLD LAYERS</h3>
          <div className="space-y-1">
            <ViewModeButton active={viewMode === 'reality'} onClick={() => setViewMode('reality')} icon={<Eye size={14} />} label="RECONSTRUCTED" desc="Observed geometry only" />
            <ViewModeButton active={viewMode === 'coverage'} onClick={() => setViewMode('coverage')} icon={<AlertTriangle size={14} />} label="UNSEEN REGIONS" desc="Highlight missing geometry" />
            <ViewModeButton active={viewMode === 'complete'} onClick={() => setViewMode('complete')} icon={<Target size={14} />} label="COMPLETE WORLD" desc="Observed + Generated" />
          </div>
        </div>
        
        {researchMode && (
          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-xs font-semibold tracking-widest text-neutral-500 mb-3">ANALYSIS</h3>
            <div className="space-y-1">
              <ViewModeButton active={viewMode === 'uncertainty'} onClick={() => setViewMode('uncertainty')} icon={<AlertTriangle size={14} />} label="EVIDENCE VIEW" desc="Provenance tracking" />
              <ViewModeButton active={viewMode === 'difference'} onClick={() => setViewMode('difference')} icon={<Activity size={14} />} label="DIFFERENCE VIEW" desc="Ground-truth error highlight" />
            </div>
          </div>
        )}
        
        <div className="mt-auto p-4 border-t border-neutral-800">
          <button 
            onClick={() => { resetDemo(); navigate('/'); }}
            className="w-full py-2 bg-neutral-900 hover:bg-rose-900/30 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-900/50 rounded transition text-xs font-bold tracking-wider"
          >
            RESET DEMO
          </button>
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
        
        {viewMode === 'difference' && useWorldStore.getState().worldValidation?.difference && (
          <div className="absolute top-4 left-4 p-4 bg-neutral-900/90 border border-neutral-800 rounded shadow-xl text-xs space-y-2 pointer-events-none">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 border-b border-neutral-800 pb-1">Difference Summary</div>
            <div className="flex justify-between gap-6">
              <span className="text-emerald-500">CORRECT</span>
              <span className="font-mono text-neutral-300">{useWorldStore.getState().worldValidation.difference.filter((d:any) => d.status==='correct').length} regions</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-amber-500">MISALIGNED</span>
              <span className="font-mono text-neutral-300">{useWorldStore.getState().worldValidation.difference.filter((d:any) => d.status==='misaligned').length} regions</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-rose-500">MISSING</span>
              <span className="font-mono text-neutral-300">{useWorldStore.getState().worldValidation.difference.filter((d:any) => d.status==='missing').length} regions</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-rose-500">EXTRA</span>
              <span className="font-mono text-neutral-300">{useWorldStore.getState().worldValidation.difference.filter((d:any) => d.status==='extra').length} regions</span>
            </div>
          </div>
        )}
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
