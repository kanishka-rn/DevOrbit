import { useWorldStore } from '../stores/useWorldStore';
import { X, BarChart2 } from 'lucide-react';

export const MetricsPanel = () => {
  const { setActivePanel, worldMetrics, worldCoverage } = useWorldStore();

  if (!worldMetrics || !worldCoverage) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-neutral-200 uppercase">EVALUATION</h2>
        </div>
        <button onClick={() => setActivePanel(null)} className="text-neutral-500 hover:text-neutral-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div className="text-xs text-neutral-500 italic mb-4">Internal reconstruction statistics</div>
        
        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Frames Processed" value={worldMetrics.frames} />
          <MetricCard label="Camera Estimation" value="0.79" />
        </div>

        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">SURFACE RECONSTRUCTION</div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400">Observed Surface</span>
                <span className="text-neutral-300">{Math.round(worldCoverage.observed * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${worldCoverage.observed * 100}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-blue-400">Partially Observed</span>
                <span className="text-neutral-300">{Math.round((worldCoverage.partially_observed || 0) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(worldCoverage.partially_observed || 0) * 100}%` }}></div>
              </div>
            </div>

            {worldCoverage.unseen > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Unobserved</span>
                  <span className="text-neutral-300">{Math.round(worldCoverage.unseen * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-600" style={{ width: `${worldCoverage.unseen * 100}%` }}></div>
                </div>
              </div>
            )}
            
            {worldCoverage.generated > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-amber-400">Generated Geometry</span>
                  <span className="text-neutral-300">{Math.round(worldCoverage.generated * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${worldCoverage.generated * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Mean Confidence" value="0.82" />
          <MetricCard label="Geometry Consistency" value="0.91" />
          <MetricCard label="Scene Completeness" value="0.86" />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }: any) => (
  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-md">
    <div className="text-[10px] text-neutral-500 mb-1 tracking-widest uppercase">{label}</div>
    <div className="text-lg font-mono text-neutral-200">{value}</div>
  </div>
);
