import { useEffect, useState } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

const SCENARIOS = [
  { id: 'hidden_back_wall', label: 'Hidden Back Wall' },
  { id: 'partial_back_wall', label: 'Partial Back Wall' },
  { id: 'occluded_corner', label: 'Occluded Corner' },
  { id: 'partial_ceiling', label: 'Partial Ceiling' },
  { id: 'noisy_observation', label: 'Noisy Observation' },
  { id: 'low_evidence', label: 'Low Evidence' }
];

export const EvaluationPage = () => {
  const { worldId, setWorldValidation } = useWorldStore();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('hidden_back_wall');
  const [allReports, setAllReports] = useState<any[]>([]);
  const [robustnessData, setRobustnessData] = useState<any[]>([]);
  const [runProgress, setRunProgress] = useState(0);

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
        setWorldValidation(res.data);
        if (res.data.scenario) setScenario(res.data.scenario);
      }
    } catch (e) {
      console.log("No report yet");
    }
  };

  const runBenchmark = async () => {
    if (!worldId) return;
    setLoading(true);
    setAllReports([]);
    try {
      const res = await apiClient.post(`/evaluation/run/${worldId}?scenario=${scenario}`);
      setReport(res.data.report);
      setWorldValidation(res.data.report);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const runAllScenarios = async () => {
    if (!worldId) return;
    setLoading(true);
    setRunProgress(0);
    const results = [];
    for (let i = 0; i < SCENARIOS.length; i++) {
      try {
        const res = await apiClient.post(`/evaluation/run/${worldId}?scenario=${SCENARIOS[i].id}`);
        results.push(res.data.report);
      } catch (e) {
        console.error(e);
      }
      setRunProgress(i + 1);
    }
    setAllReports(results);
    if (results.length > 0) {
      setReport(results[0]);
      setWorldValidation(results[0]);
    }
    
    // Run robustness
    try {
      const rob = await apiClient.post(`/evaluation/robustness/${worldId}`);
      if (rob.data && rob.data.results) {
        setRobustnessData(rob.data.results);
      }
    } catch (e) {
      console.error(e);
    }
    
    setLoading(false);
  };

  if (!worldId) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500 flex-col gap-4 bg-neutral-950">
        <div className="text-xl">No World Loaded</div>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-emerald-600 text-white rounded">Go to Dashboard</button>
      </div>
    );
  }

  const avgIoU = allReports.length > 0 ? allReports.reduce((acc, r) => acc + r.completion.iou, 0) / allReports.length : 0;
  const avgError = allReports.length > 0 ? allReports.reduce((acc, r) => acc + r.completion.geometric_error, 0) / allReports.length : 0;
  const avgCompleteness = allReports.length > 0 ? allReports.reduce((acc, r) => acc + r.overall.completeness, 0) / allReports.length : 0;

  return (
    <div className="h-full overflow-y-auto bg-neutral-950 pb-20">
      <div className="bg-neutral-900 border-b border-neutral-800 p-8 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workspace')} className="text-emerald-500 font-mono text-sm tracking-widest hover:text-emerald-400">← WORKSPACE</button>
          <div className="h-6 w-px bg-neutral-800"></div>
          <div>
            <h1 className="text-xl font-bold text-neutral-100">SpaceMind Benchmark</h1>
            <p className="text-sm text-neutral-500">Ground-truth geometric completion benchmark</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select 
            value={scenario} 
            onChange={(e) => setScenario(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded text-sm focus:outline-none focus:border-emerald-500"
            disabled={loading}
          >
            {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button 
            onClick={runBenchmark}
            disabled={loading}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition flex items-center gap-2 disabled:opacity-50 text-sm"
          >
            RUN SINGLE
          </button>
          <button 
            onClick={runAllScenarios}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading && runProgress < SCENARIOS.length ? `RUNNING... (${runProgress}/${SCENARIOS.length})` : "RUN ALL SCENARIOS"}
          </button>
          
          {(report || allReports.length > 0) && (
            <button 
              onClick={() => {
                const dataToExport = allReports.length > 0 ? { reports: allReports, robustness: robustnessData } : report;
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
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

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {loading && (
          <div className="border border-neutral-800 bg-neutral-900 rounded p-6">
            <h3 className="text-sm font-bold tracking-wider text-emerald-400 mb-4">BENCHMARK RUNNING</h3>
            <div className="space-y-2 text-sm text-neutral-400 font-mono">
              {SCENARIOS.map((s, i) => (
                <div key={s.id}>
                  {i < runProgress ? <span className="text-emerald-500">✓</span> : i === runProgress ? <span className="text-blue-500 animate-pulse">●</span> : <span className="text-neutral-700">○</span>} {s.label}
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs font-bold text-neutral-500">{runProgress} / {SCENARIOS.length} scenarios completed</div>
          </div>
        )}

        {(allReports.length > 0 && !loading) && (
          <>
            <div className="border border-neutral-800 bg-neutral-900 rounded overflow-hidden">
              <div className="bg-neutral-800/80 px-4 py-3 text-sm font-bold tracking-wider text-neutral-200 border-b border-neutral-800 flex justify-between">
                <span>SPACEMIND RESEARCH SUMMARY</span>
              </div>
              <div className="p-6 grid grid-cols-5 gap-4">
                <MetricRow label="Scenarios Tested" value={SCENARIOS.length} />
                <MetricRow label="Ablation Methods" value="3" />
                <MetricRow label="Noise Levels" value="4" />
                <MetricRow label="Failure Cases" value="1" />
                <MetricRow label="Region Resolution" value="10 × 10" />
              </div>
            </div>

            <div className="border border-neutral-800 bg-neutral-900 rounded overflow-hidden">
              <div className="bg-neutral-800/80 px-4 py-3 text-sm font-bold tracking-wider text-emerald-400 border-b border-neutral-800">
                SPACE MIND BENCHMARK
              </div>
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900 text-neutral-500 text-xs">
                  <tr>
                    <th className="px-4 py-3 border-b border-neutral-800 font-medium">Scenario</th>
                    <th className="px-4 py-3 border-b border-neutral-800 font-medium font-mono">IoU</th>
                    <th className="px-4 py-3 border-b border-neutral-800 font-medium font-mono">Error</th>
                    <th className="px-4 py-3 border-b border-neutral-800 font-medium font-mono">Completeness</th>
                  </tr>
                </thead>
                <tbody>
                  {allReports.map((r, i) => (
                    <tr key={i} className="border-b border-neutral-800">
                      <td className="px-4 py-3 text-neutral-200">{SCENARIOS.find(s => s.id === r.scenario)?.label || r.scenario}</td>
                      <td className="px-4 py-3 font-mono text-neutral-400">{Math.round(r.completion.iou * 100)}%</td>
                      <td className="px-4 py-3 font-mono text-neutral-400">{r.completion.geometric_error.toFixed(3)}m</td>
                      <td className="px-4 py-3 font-mono text-neutral-400">{Math.round(r.overall.completeness * 100)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-neutral-800/30">
                    <td className="px-4 py-3 font-bold text-neutral-200">AVERAGE</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{Math.round(avgIoU * 100)}%</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{avgError.toFixed(3)}m</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{Math.round(avgCompleteness * 100)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {robustnessData.length > 0 && (
              <div className="border border-neutral-800 bg-neutral-900 rounded overflow-hidden">
                <div className="bg-neutral-800/80 px-4 py-3 text-sm font-bold tracking-wider text-amber-400 border-b border-neutral-800">
                  ROBUSTNESS CURVE (Noisy Observation)
                </div>
                <div className="p-6">
                  <div className="flex gap-4 mb-4">
                    {robustnessData.map((d, i) => (
                      <div key={i} className="flex-1 bg-neutral-800 border border-neutral-700 p-3 rounded">
                        <div className="text-xs text-neutral-500 font-bold mb-1">NOISE {d.noise_level * 100}%</div>
                        <div className="text-lg font-mono text-neutral-200">IoU: {Math.round(d.completion_iou * 100)}%</div>
                        <div className="text-sm font-mono text-neutral-400">Error: {d.geometric_error.toFixed(3)}m</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-32 w-full mt-4 flex items-end gap-2 border-l border-b border-neutral-700 p-2">
                     {robustnessData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                           <div className="w-full bg-emerald-500/80 rounded-t" style={{ height: `${d.completion_iou * 100}%` }}></div>
                           <div className="text-xs font-mono text-neutral-500">{d.noise_level * 100}%</div>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {report && !loading && (
          <>
            <div className="border border-neutral-800 bg-neutral-900 rounded overflow-hidden mt-8">
              <div className="bg-neutral-800/80 px-4 py-2 text-sm font-bold tracking-wider text-indigo-400 border-b border-neutral-800">
                METHOD COMPARISON ({SCENARIOS.find(s => s.id === report.scenario)?.label || report.scenario})
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
                    <td className="px-4 py-3 font-mono text-neutral-500">{Math.round(report.ablation?.geometry_only?.iou * 100)}%</td>
                    <td className="px-4 py-3 font-mono text-neutral-500">{report.ablation?.geometry_only?.error.toFixed(3)}</td>
                  </tr>
                  <tr className="border-b border-neutral-800">
                    <td className="px-4 py-3 text-neutral-400">Structural Constraints</td>
                    <td className="px-4 py-3 font-mono text-amber-500/70">{Math.round(report.ablation?.structural?.iou * 100)}%</td>
                    <td className="px-4 py-3 font-mono text-amber-500/70">{report.ablation?.structural?.error.toFixed(3)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-emerald-400">Full SpaceMind</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{Math.round(report.ablation?.full?.iou * 100)}%</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">{report.ablation?.full?.error.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-neutral-950 text-xs text-neutral-400 border-t border-neutral-800 leading-relaxed">
                {report.ablation?.full?.iou > report.ablation?.geometry_only?.iou ? (
                  <p>Structural constraints improve geometric alignment over geometry-only continuation. Full SpaceMind combines visibility and structural reasoning with evidence tracking.</p>
                ) : (
                  <p>No measurable difference was observed under this scenario.</p>
                )}
              </div>
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
          </>
        )}
      </div>
    </div>
  );
};

const MetricRow = ({ label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-neutral-500 text-xs font-bold uppercase mb-1">{label}</span>
    <span className="text-2xl font-mono font-bold text-neutral-200">{value}</span>
  </div>
);
