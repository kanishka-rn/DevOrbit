import { useState } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { X, Send, Palette } from 'lucide-react';

export const AppearancePanel = () => {
  const { setActivePanel } = useWorldStore();
  const [prompt, setPrompt] = useState('');
  
  const handleApply = () => {
    if(!prompt) return;
    console.log("Applying edit:", prompt);
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-neutral-200 uppercase">APPEARANCE STUDIO</h2>
        </div>
        <button onClick={() => setActivePanel(null)} className="text-neutral-500 hover:text-neutral-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">THEMES</div>
          <div className="grid grid-cols-2 gap-2">
            <ThemeButton label="Original" />
            <ThemeButton label="Minimal White" />
            <ThemeButton label="Dark Modern" active />
            <ThemeButton label="Natural" />
            <ThemeButton label="Cool Blue" />
            <ThemeButton label="Professional" />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">NATURAL LANGUAGE EDITING</div>
          <div className="space-y-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe an appearance change... (e.g. Make the walls cream and the sofa dark green)"
              className="w-full h-24 bg-neutral-900 border border-neutral-800 rounded-md p-3 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button 
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition-colors"
            >
              <Send size={14} />
              APPLY EDITS
            </button>
          </div>
        </div>
        
        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">WORLD VERSIONS</div>
          <div className="space-y-2">
            <div className="p-2 bg-neutral-800/50 rounded text-xs text-neutral-300 flex justify-between items-center border border-neutral-700 cursor-pointer">
              <span>WORLD v3 (Active)</span>
              <span className="text-[10px] text-emerald-500">Current</span>
            </div>
            <div className="p-2 bg-neutral-900/50 hover:bg-neutral-800/50 rounded text-xs text-neutral-400 flex justify-between items-center cursor-pointer">
              <span>WORLD v2 (Completed)</span>
              <span className="text-[10px]">Restore</span>
            </div>
            <div className="p-2 bg-neutral-900/50 hover:bg-neutral-800/50 rounded text-xs text-neutral-400 flex justify-between items-center cursor-pointer">
              <span>WORLD v1 (Original)</span>
              <span className="text-[10px]">Restore</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeButton = ({ label, active }: any) => (
  <button className={`px-3 py-2 text-xs rounded border transition-colors ${active ? 'bg-neutral-800 border-emerald-500 text-emerald-400 font-medium' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}>
    {label}
  </button>
);
