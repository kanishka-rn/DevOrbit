import { useWorldStore } from '../stores/useWorldStore';
import { X, CheckCircle, ShieldAlert } from 'lucide-react';

export const ProvenancePanel = () => {
  const { selectedRegion, setSelectedRegion, sceneNodes } = useWorldStore();

  const node = sceneNodes.find(n => n.id === selectedRegion);

  if (!node) return null;

  const isGenerated = node.status === 'generated';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <h2 className="text-sm font-bold text-neutral-200 uppercase">{node.id.replace('_', ' ')}</h2>
        <button onClick={() => setSelectedRegion(null)} className="text-neutral-500 hover:text-neutral-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-2">SOURCE</div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-bold rounded ${isGenerated ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
              {node.status.toUpperCase()}
            </span>
            <span className="text-xs text-neutral-400 font-mono">{Math.round(node.confidence * 100)}% CONFIDENCE</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">EVIDENCE USED</div>
          <ul className="space-y-2 text-xs text-neutral-300">
            {node.evidence.map((ev: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" /> {ev}
              </li>
            ))}
          </ul>
        </div>

        {node.validated && (
          <div>
            <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">VALIDATION CHECKS</div>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Geometry consistent</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Room boundary valid</li>
            </ul>
          </div>
        )}
            
        {isGenerated && (
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-md">
            <div className="flex items-start gap-2 text-xs text-neutral-400">
              <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p>This region was procedurally generated using hypotheses constrained by structural priors.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
