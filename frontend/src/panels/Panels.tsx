import { useWorldStore } from '../stores/useWorldStore';
import { ProvenancePanel } from './ProvenancePanel';
import { AppearancePanel } from './AppearancePanel';
import { MetricsPanel } from './MetricsPanel';

export const Panels = () => {
  const { activePanel, selectedRegion } = useWorldStore();

  if (!activePanel && !selectedRegion) return null;

  return (
    <div className="w-80 border-l border-neutral-800 bg-neutral-950/90 z-10 shrink-0 flex flex-col">
      {activePanel === 'appearance' && <AppearancePanel />}
      {activePanel === 'evaluation' && <MetricsPanel />}
      {selectedRegion && !activePanel && <ProvenancePanel />}
      {!selectedRegion && activePanel === 'reconstruction' && (
        <div className="p-4">
          <h2 className="text-sm font-bold text-neutral-200 mb-4">RECONSTRUCTION PIPELINE</h2>
          <ul className="space-y-3 text-xs text-neutral-400">
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Input analyzed</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Frames extracted</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Keyframes selected</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Camera estimated</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Depth generated</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 3D geometry built</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Scene graph created</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Visibility analyzed</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Missing regions detected</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> World completed</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Validation completed</li>
          </ul>
        </div>
      )}
    </div>
  );
};
