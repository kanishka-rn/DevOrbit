import { useWorldStore } from '../stores/useWorldStore';
import { X, Layers, Link as LinkIcon } from 'lucide-react';

export const SceneGraphPanel = () => {
  const { setActivePanel, sceneNodes, sceneGraph, setSelectedRegion, selectedRegion } = useWorldStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-neutral-200 uppercase">SCENE GRAPH</h2>
        </div>
        <button onClick={() => setActivePanel(null)} className="text-neutral-500 hover:text-neutral-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3 uppercase">Scene Tree</div>
          <div className="space-y-1 text-xs text-neutral-300 font-mono">
            <div>Room</div>
            {sceneNodes.map(node => (
              <div 
                key={node.id} 
                className={`pl-4 py-1 cursor-pointer hover:text-emerald-400 ${selectedRegion === node.id ? 'text-emerald-500 font-bold' : ''}`}
                onClick={() => setSelectedRegion(node.id)}
              >
                ├── {node.id} {node.status === 'generated' && '(Gen)'}
              </div>
            ))}
          </div>
        </div>

        {sceneGraph && sceneGraph.relations && (
          <div>
            <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3 uppercase">Semantic Relations</div>
            <ul className="space-y-2 text-xs text-neutral-400">
              {sceneGraph.relations.map((rel: any, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <LinkIcon size={12} className="text-neutral-600" />
                  <span className="text-neutral-300">{rel.source}</span>
                  <span className="text-[10px] px-1 bg-neutral-800 rounded text-emerald-500">{rel.type}</span>
                  <span className="text-neutral-300">{rel.target}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
