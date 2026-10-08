import { create } from 'zustand'

export type SceneNode = {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  status: "observed" | "inferred" | "generated" | "unobserved" | "partially_observed";
  confidence: number;
  evidence: string[];
  validated: boolean;
  material?: { color: string };
  observationCount?: number;
  visibleFrames?: number[];
  visibilityScore?: number;
  occludedBy?: string[];
  reason?: string;
  supporting_elements?: string[];
  constraints?: string[];
  source?: string;
  regions?: any[];
};

interface WorldState {
  worldId: string | null;
  status: 'idle' | 'uploading' | 'processing' | 'ready';
  viewMode: 'reality' | 'inferred' | 'complete' | 'uncertainty' | 'coverage' | 'difference';
  activePanel: 'reconstruction' | 'completion' | 'evidence' | 'appearance' | 'evaluation' | 'export' | null;
  selectedRegion: string | null;
  jobId: string | null;
  processingStage: string;
  sceneNodes: SceneNode[];
  sceneGraph: any;
  worldMetrics: any;
  worldCoverage: any;
  worldValidation: any;
  versions: string[];
  researchMode: boolean;
  
  setWorldId: (id: string | null) => void;
  setStatus: (status: 'idle' | 'uploading' | 'processing' | 'ready') => void;
  setViewMode: (mode: 'reality' | 'inferred' | 'complete' | 'uncertainty' | 'coverage' | 'difference') => void;
  setActivePanel: (panel: 'reconstruction' | 'completion' | 'evidence' | 'appearance' | 'evaluation' | 'export' | null) => void;
  setSelectedRegion: (regionId: string | null) => void;
  setJobId: (id: string | null) => void;
  setProcessingStage: (stage: string) => void;
  setSceneNodes: (nodes: SceneNode[]) => void;
  setWorldValidation: (evalData: any) => void;
  setWorldData: (data: any) => void;
  setResearchMode: (mode: boolean) => void;
  resetDemo: () => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  worldId: null,
  status: 'idle',
  viewMode: 'complete',
  activePanel: null,
  selectedRegion: null,
  jobId: null,
  processingStage: '',
  sceneNodes: [],
  sceneGraph: null,
  worldMetrics: null,
  worldCoverage: null,
  worldValidation: null,
  versions: [],
  researchMode: true,
  
  setWorldId: (id) => set({ worldId: id }),
  setStatus: (status) => set({ status }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setJobId: (id) => set({ jobId: id }),
  setProcessingStage: (stage) => set({ processingStage: stage }),
  setSceneNodes: (nodes) => set({ sceneNodes: nodes }),
  setWorldValidation: (evalData) => set({ worldValidation: evalData }),
  setWorldData: (data) => set({
    sceneNodes: data.nodes || [],
    sceneGraph: data.scene_graph || null,
    worldMetrics: data.metrics || null,
    worldCoverage: data.coverage || null,
    worldValidation: data.validation || null,
    versions: data.versions || []
  }),
  setResearchMode: (mode) => set({ researchMode: mode }),
  resetDemo: () => set({
    worldId: null,
    status: 'idle',
    viewMode: 'complete',
    activePanel: null,
    selectedRegion: null,
    jobId: null,
    processingStage: '',
    sceneNodes: [],
    sceneGraph: null,
    worldMetrics: null,
    worldCoverage: null,
    worldValidation: null,
    researchMode: true
  })
}));
