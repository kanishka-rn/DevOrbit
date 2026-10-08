import { useWorldStore } from '../stores/useWorldStore';
import { X, Wand2, Target } from 'lucide-react';
import { completeWorld } from '../api/client';

export const CompletionPanel = () => {
  const { setActivePanel, worldId, setViewMode } = useWorldStore();

  const handleComplete = async () => {
    if(worldId) {
      await completeWorld(worldId);
      setViewMode('complete');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-neutral-200 uppercase">COMPLETION</h2>
        </div>
        <button onClick={() => setActivePanel(null)} className="text-neutral-500 hover:text-neutral-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        
        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3 uppercase">Missing Regions</div>
          <div className="space-y-2">
            <div className="p-3 bg-neutral-900 border border-amber-500/30 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-500">Camera-Blind Wall</span>
                <span className="text-[10px] text-neutral-500">ID: wall_04</span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">Occluded by camera trajectory. Needs evidence-grounded completion.</p>
              <div className="text-[10px] space-y-1 text-neutral-500">
                <div className="flex justify-between"><span>Hypothesis A:</span> <span className="text-emerald-500">Plain wall (87%)</span></div>
                <div className="flex justify-between"><span>Hypothesis B:</span> <span>Window wall (12%)</span></div>
                <div className="flex justify-between"><span>Hypothesis C:</span> <span>Door wall (1%)</span></div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleComplete}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition-colors"
        >
          <Target size={14} />
          COMPLETE WORLD
        </button>

      </div>
    </div>
  );
};
