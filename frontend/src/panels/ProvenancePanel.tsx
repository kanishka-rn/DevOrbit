import { useWorldStore } from '../stores/useWorldStore';
import { X, CheckCircle, ShieldAlert } from 'lucide-react';

export const ProvenancePanel = () => {
  const { selectedRegion, setSelectedRegion, sceneNodes, worldValidation } = useWorldStore();

  const node = sceneNodes.find(n => n.id === selectedRegion);

  if (!node) return null;

  const isGenerated = node.status === 'generated';
  
  // Find validation data if available
  const diffMeta = worldValidation?.difference?.find((d: any) => d.region_id === node.id);

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
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-bold rounded ${isGenerated ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                {node.status.toUpperCase()}
              </span>
              <span className="text-xs text-neutral-400 font-mono">{Math.round(node.confidence * 100)}% CONFIDENCE</span>
            </div>
            <div className="text-[10px] text-neutral-600 uppercase tracking-widest">Prediction-time estimate</div>
          </div>
          
          {(isGenerated && node.confidence < 0.5) && (
             <div className="mt-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded flex items-start gap-2">
               <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
               <div>
                 <div className="text-xs font-bold text-rose-500">⚠ LOW-CONFIDENCE GENERATED</div>
                 <div className="text-[10px] text-rose-400/80 mt-1">Insufficient visual evidence and missing structural anchors.</div>
               </div>
             </div>
          )}
        </div>

        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">EVIDENCE RECORD</div>
          
          <div className="space-y-3 text-xs">
            {node.status === 'observed' && (
              <>
                <div className="flex justify-between border-b border-neutral-800 pb-1">
                  <span className="text-neutral-500">Observation Count</span>
                  <span className="text-neutral-300">{node.observationCount || 'N/A'} frames</span>
                </div>
                {(node.visibleFrames && node.visibleFrames.length > 0) && (
                  <div className="flex justify-between border-b border-neutral-800 pb-1">
                    <span className="text-neutral-500">Source Frames</span>
                    <span className="text-neutral-300">[{node.visibleFrames.slice(0, 3).join(', ')}{node.visibleFrames.length > 3 ? ', ...' : ''}]</span>
                  </div>
                )}
              </>
            )}

            {(isGenerated || node.status === 'inferred') && (
              <>
                <div className="flex justify-between border-b border-neutral-800 pb-1">
                  <span className="text-neutral-500">Direct Observation</span>
                  <span className="text-neutral-300">None</span>
                </div>
                {node.reason && (
                  <div className="flex flex-col border-b border-neutral-800 pb-1 gap-1">
                    <span className="text-neutral-500">Reason</span>
                    <span className="text-neutral-300">{node.reason}</span>
                  </div>
                )}
                {node.supporting_elements && (
                  <div className="flex flex-col border-b border-neutral-800 pb-1 gap-1">
                    <span className="text-neutral-500">Supporting Elements</span>
                    <div className="flex gap-1 flex-wrap">
                      {node.supporting_elements.map((el: string) => (
                        <span key={el} className="px-1.5 py-0.5 bg-neutral-800 rounded">{el}</span>
                      ))}
                    </div>
                  </div>
                )}
                {node.constraints && (
                  <div className="flex flex-col border-b border-neutral-800 pb-1 gap-1">
                    <span className="text-neutral-500">Constraints Enforced</span>
                    <div className="flex gap-1 flex-wrap">
                      {node.constraints.map((c: string) => (
                        <span key={c} className="px-1.5 py-0.5 border border-neutral-700 rounded text-neutral-400">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {diffMeta && (
                  <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-900 rounded flex flex-col gap-2">
                    <div className="text-[10px] text-indigo-500/80 uppercase tracking-widest mb-1 border-b border-indigo-900/50 pb-1">Post-hoc evaluation</div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Ground-Truth Match</span>
                      <span className="text-indigo-300 font-mono font-bold text-sm">{Math.round(diffMeta.overlap * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Geometric Error</span>
                      <span className="text-indigo-300 font-mono font-bold text-sm">{diffMeta.position_error}m</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {node.occludedBy && node.occludedBy.length > 0 && (
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-neutral-500">Occlusion (Hidden behind)</span>
                <span className="text-neutral-300">{node.occludedBy.join(', ')}</span>
              </div>
            )}
          </div>
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
