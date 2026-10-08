import { useWorldStore } from '../stores/useWorldStore';
import { ProvenancePanel } from './ProvenancePanel';
import { AppearancePanel } from './AppearancePanel';
import { MetricsPanel } from './MetricsPanel';
import { CompletionPanel } from './CompletionPanel';
import { SceneGraphPanel } from './SceneGraphPanel';
import { ExportPanel } from './ExportPanel';

export const Panels = () => {
  const { activePanel, selectedRegion } = useWorldStore();

  if (!activePanel && !selectedRegion) return null;

  return (
    <div className="w-80 border-l border-neutral-800 bg-neutral-950/90 z-10 shrink-0 flex flex-col">
      {activePanel === 'appearance' && <AppearancePanel />}
      {activePanel === 'evaluation' && <MetricsPanel />}
      {activePanel === 'completion' && <CompletionPanel />}
      {activePanel === 'reconstruction' && <SceneGraphPanel />}
      {activePanel === 'export' && <ExportPanel />}
      {selectedRegion && !activePanel && <ProvenancePanel />}
    </div>
  );
};
