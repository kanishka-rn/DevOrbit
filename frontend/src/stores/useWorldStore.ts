import { create } from 'zustand'

interface WorldState {
  worldId: string | null;
  status: 'idle' | 'uploading' | 'processing' | 'ready';
  viewMode: 'reality' | 'inferred' | 'complete' | 'uncertainty' | 'provenance';
  activePanel: 'reconstruction' | 'completion' | 'evidence' | 'appearance' | 'evaluation' | 'export' | null;
  selectedRegion: string | null;
  jobId: string | null;
  processingStage: string;
  setWorldId: (id: string | null) => void;
  setStatus: (status: 'idle' | 'uploading' | 'processing' | 'ready') => void;
  setViewMode: (mode: 'reality' | 'inferred' | 'complete' | 'uncertainty' | 'provenance') => void;
  setActivePanel: (panel: 'reconstruction' | 'completion' | 'evidence' | 'appearance' | 'evaluation' | 'export' | null) => void;
  setSelectedRegion: (regionId: string | null) => void;
  setJobId: (id: string | null) => void;
  setProcessingStage: (stage: string) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  worldId: null,
  status: 'idle',
  viewMode: 'complete',
  activePanel: null,
  selectedRegion: null,
  jobId: null,
  processingStage: '',
  setWorldId: (id) => set({ worldId: id }),
  setStatus: (status) => set({ status }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setJobId: (id) => set({ jobId: id }),
  setProcessingStage: (stage) => set({ processingStage: stage })
}))
