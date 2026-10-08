import { useWorldStore } from '../stores/useWorldStore';
import { X, Download, Box, FileJson, Layers } from 'lucide-react';
import { apiClient } from '../api/client';

export const ExportPanel = () => {
  const { setActivePanel, worldId } = useWorldStore();

  const handleExport = async (format: string) => {
    if (!worldId) return;
    try {
      const res = await apiClient.get(`/world/${worldId}/export/${format}`);
      alert(`Export ready: ${res.data.url}\n(In a full implementation, this would trigger a file download)`);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Download size={16} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-neutral-200 uppercase">EXPORT SCENE</h2>
        </div>
        <button onClick={() => setActivePanel(null)} className="text-neutral-500 hover:text-neutral-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <p className="text-xs text-neutral-400">Download the reconstructed scene, preserving semantic layers, geometry, and provenance metadata.</p>
        
        <div className="space-y-3">
          <button onClick={() => handleExport('glb')} className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors text-left group">
            <Box size={20} className="text-neutral-500 group-hover:text-emerald-500" />
            <div>
              <div className="text-sm font-bold text-neutral-200">GLTF / GLB</div>
              <div className="text-[10px] text-neutral-500">Standard 3D web format. Includes materials and textures.</div>
            </div>
          </button>
          
          <button onClick={() => handleExport('ply')} className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors text-left group">
            <Layers size={20} className="text-neutral-500 group-hover:text-emerald-500" />
            <div>
              <div className="text-sm font-bold text-neutral-200">Point Cloud (PLY)</div>
              <div className="text-[10px] text-neutral-500">Raw point cloud with confidence/evidence scalars.</div>
            </div>
          </button>
          
          <button onClick={() => handleExport('json')} className="w-full flex items-center gap-3 p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-md transition-colors text-left group">
            <FileJson size={20} className="text-neutral-500 group-hover:text-emerald-500" />
            <div>
              <div className="text-sm font-bold text-neutral-200">World State JSON</div>
              <div className="text-[10px] text-neutral-500">Structured scene graph and semantic provenance data.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
