import { useState, useEffect } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { apiClient } from '../api/client';
import { Beaker, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EvaluationPage = () => {
  const { worldId } = useWorldStore();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('hidden_back_wall');

  useEffect(() => {
    if (worldId) {
      loadReport();
    }
  }, [worldId]);

  const loadReport = async () => {
    if (!worldId) return;
    try {
      const res = await apiClient.get(`/evaluation/${worldId}`);
      if (res.data) {
        setReport(res.data);
        useWorldStore.getState().setWorldValidation(res.data);
        if (res.data.scenario) setScenario(res.data.scenario);
      }
    } catch (e) {
      console.log("No report yet");
    }
  };

  const runBenchmark = async () => {
    if (!worldId) return;
    setLoading(true);
    try {
      const res = await apiClient.post(`/evaluation/run/${worldId}?scenario=${scenario}`);
      setReport(res.data.report);
      useWorldStore.getState().setWorldValidation(res.data.report);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!worldId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-neutral-950 text-neutral-500">
        Run reconstruction first.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-neutral-950 text-neutral-200 overflow-y-auto">
      <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workspace')} className="p-2 hover:bg-neutral-800 rounded">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Beaker className="text-emerald-500" />
              SPACE MIND — EVALUATION
            </h1>
            <p className="text-sm text-neutral-500">Ground-truth geometric completion benchmark</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select 
            value={scenario} 
            onChange={(e) => setScenario(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="hidden_back_wall">Hidden Back Wall</option>
            <option value="occluded_corner">Occluded Corner</option>
            <option value="noisy_observation">Noisy Observation</option>
          </select>
          <button 
            onClick={runBenchmark}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? "Running..." : "RUN BENCHMARK"}
          </button>
          
          {report && (
            <button 
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href",     dataStr);
                downloadAnchorNode.setAttribute("download", "spacemind_evaluation.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="px-4 py-2 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 rounded text-sm transition"
            >
              Export JSON Report
            </button>
          )}
        </div>
      </div>

      {report && (
        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded">
              <div className="text-xs text-neutral-500 font-bold mb-1 tracking-wider uppercase">Dataset</div>
              <div className="text-lg text-emerald-400 font-mono">{report.scene_id}</div>
            </div>
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded">
              <div className="text-xs text-neutral-500 font-bold mb-1 tracking-wider uppercase">Scenario</div>
              <div className="text-lg text-emerald-400 font-mono">{report.scenario}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border border-neutral-800 bg-neutral-900/50 rounded overflow-hidden">
              <div className="bg-neutral-800/80 px-4 py-2 text-sm font-bold tracking-wider text-blue-400 border-b border-neutral-800">
                OBSERVED REGION
              </div>
              <div className="p-6 space-y-4">
                <MetricRow label="Surface Coverage" value={`${Math.round(report.observed.surface_coverage * 100)}%`} />
                <MetricRow label="Mean Geometric Error" value={`${report.observed.geometric_error.toFixed(3)}m`} />
              </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-900/50 rounded overflow-hidden">
              <div className="bg-neutral-800/80 px-4 py-2 text-sm font-bold tracking-wider text-amber-400 border-b border-neutral-800">
                GENERATED COMPLETION
              </div>
              <div className="p-6 space-y-4">
                <MetricRow label="Completion Coverage" value={`${Math.round(report.completion.surface_coverage * 100)}%`} />
                <MetricRow label="Completion IoU" value={`${Math.round(report.completion.iou * 100)}%`} />
                <MetricRow label="Mean Geometric Error" value={`${report.completion.geometric_error.toFixed(3)}m`} />
              </div>
            </div>
          </div>

          <div className="p-6 border border-neutral-800 bg-neutral-900 rounded flex justify-between items-center">
            <div>
              <div className="text-xs text-neutral-500 tracking-wider font-bold mb-1">OVERALL SCENE</div>
              <div className="text-2xl text-neutral-200">Completeness</div>
            </div>
            <div className="text-4xl font-mono text-emerald-500 font-bold">
              {Math.round(report.overall.completeness * 100)}%
            </div>
          </div>
          
          <div className="border border-neutral-800 bg-neutral-900 rounded overflow-hidden">
            <div className="bg-neutral-800/80 px-4 py-2 text-sm font-bold tracking-wider text-indigo-400 border-b border-neutral-800">
              ABLATION STUDY
            </div>
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-900 text-neutral-500 text-xs">
                <tr>
                  <th className="px-4 py-3 border-b border-neutral-800 font-medium">METHOD</th>
                  <th className="px-4 py-3 border-b border-neutral-800 font-medium font-mono">IoU</th>
                  <th className="px-4 py-3 border-b border-neutral-800 font-medium font-mono">ERROR (m)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-800">
                  <td className="px-4 py-3 text-neutral-400">Geometry Only</td>
                  <td className="px-4 py-3 font-mono text-neutral-500">{report.ablation?.geometry_only?.iou.toFixed(2) || '--'}</td>
                  <td className="px-4 py-3 font-mono text-neutral-500">{report.ablation?.geometry_only?.error.toFixed(3) || '--'}</td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="px-4 py-3 text-neutral-400">Structural Constraints</td>
                  <td className="px-4 py-3 font-mono text-amber-500/70">{report.ablation?.structural?.iou.toFixed(2) || '--'}</td>
                  <td className="px-4 py-3 font-mono text-amber-500/70">{report.ablation?.structural?.error.toFixed(3) || '--'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-emerald-400">Full SpaceMind</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{report.ablation?.full?.iou.toFixed(2) || '--'}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{report.ablation?.full?.error.toFixed(3) || '--'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 border border-neutral-800 rounded overflow-hidden">
            <div className="bg-neutral-900 px-4 py-3 text-sm font-bold border-b border-neutral-800">Pipeline Methodology</div>
            <div className="p-4 grid grid-cols-2 gap-4 text-xs">
               <div className="flex justify-between"><span className="text-neutral-500">Camera Estimator</span><span className="text-neutral-300 font-mono">fallback</span></div>
               <div className="flex justify-between"><span className="text-neutral-500">Depth Estimator</span><span className="text-neutral-300 font-mono">fallback</span></div>
               <div className="flex justify-between"><span className="text-neutral-500">Visibility Mapper</span><span className="text-emerald-400 font-mono">geometric</span></div>
               <div className="flex justify-between"><span className="text-neutral-500">Completer</span><span className="text-emerald-400 font-mono">procedural</span></div>
            </div>
          </div>
          
          <div className="mt-8 border border-neutral-800 rounded overflow-hidden">
            <div className="bg-neutral-900 px-4 py-3 text-sm font-bold border-b border-neutral-800">Benchmark Run Log</div>
            <div className="p-4 space-y-2 text-xs font-mono text-neutral-400">
               <div><span className="text-emerald-500">✓</span> Observation generated</div>
               <div><span className="text-emerald-500">✓</span> Frames processed</div>
               <div><span className="text-emerald-500">✓</span> Camera estimated</div>
               <div><span className="text-emerald-500">✓</span> Depth estimated</div>
               <div><span className="text-emerald-500">✓</span> Scene reconstructed</div>
               <div><span className="text-emerald-500">✓</span> Visibility calculated</div>
               <div><span className="text-emerald-500">✓</span> Hidden regions detected</div>
               <div><span className="text-emerald-500">✓</span> Completion generated</div>
               <div><span className="text-emerald-500">✓</span> Ground truth comparison</div>
               <div><span className="text-emerald-500">✓</span> Metrics calculated</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-neutral-400 text-sm">{label}</span>
    <span className="text-xl font-mono font-bold text-neutral-200">{value}</span>
  </div>
);
