import { useWorldStore } from '../stores/useWorldStore';
import { X, BarChart2 } from 'lucide-react';

export const MetricsPanel = () => {
  const { setActivePanel } = useWorldStore();

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
        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Frames" value="84" />
          <MetricCard label="Keyframes" value="18" />
        </div>

        <div>
          <div className="text-[10px] font-semibold text-neutral-500 tracking-widest mb-3">COVERAGE</div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400">Observed</span>
                <span className="text-neutral-300">71%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[71%]"></div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400">Generated</span>
                <span className="text-neutral-300">29%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[29%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Points" value="150,000" />
          <MetricCard label="Triangles" value="50,000" />
          <MetricCard label="Validation Score" value="92/100" />
          <MetricCard label="Processing Time" value="4.2s" />
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
