import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { useWorldStore } from '../stores/useWorldStore';
import { Suspense, useState } from 'react';
import * as THREE from 'three';

const DynamicScene = () => {
  const { viewMode, setSelectedRegion, sceneNodes } = useWorldStore();
  const [hoveredRegion, setHoveredRegion] = useState<any>(null);

  const handlePointerDown = (e: any, region: string) => {
    e.stopPropagation();
    setSelectedRegion(region);
  };

  const getMaterial = (node: any) => {
    const regionType = node.status;
    const baseColor = node.material?.color || '#333';
    
    if (viewMode === 'uncertainty') { // Evidence View
      if (regionType === 'observed') return new THREE.MeshStandardMaterial({ color: '#22c55e' }); // green
      if (regionType === 'inferred') return new THREE.MeshStandardMaterial({ color: '#eab308' }); // yellow
      if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#f97316' }); // orange
    }
    
    if (viewMode === 'coverage') { // Unseen Regions
      if (regionType === 'observed') return new THREE.MeshStandardMaterial({ color: '#111827', transparent: true, opacity: 0.3 }); // dark/ghosted
      if (regionType === 'inferred') return new THREE.MeshStandardMaterial({ color: '#6366f1' }); // indigo
      if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#f43f5e', emissive: '#f43f5e', emissiveIntensity: 0.5 }); // bright rose
    }

    if (viewMode === 'difference') {
      const diffMeta = useWorldStore.getState().worldValidation?.difference?.find((d: any) => d.region_id === node.id);
      const stat = diffMeta ? diffMeta.status : (regionType === 'generated' ? 'misaligned' : 'correct');
      
      if (stat === 'misaligned') return new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#f59e0b', emissiveIntensity: 0.2 }); // Amber
      if (stat === 'extra') return new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.2, wireframe: true }); // Red error
      if (stat === 'correct') return new THREE.MeshStandardMaterial({ color: '#22c55e', transparent: true, opacity: 0.2 }); // Green ghost
      return new THREE.MeshStandardMaterial({ color: '#111827', transparent: true, opacity: 0.1 }); 
    }

    if (viewMode === 'reality' && (regionType === 'inferred' || regionType === 'generated' || regionType === 'unobserved')) {
      return new THREE.MeshBasicMaterial({ visible: false });
    }
    
    if (viewMode === 'inferred' && regionType === 'generated') {
      return new THREE.MeshBasicMaterial({ visible: false });
    }

    if (regionType === 'generated' && viewMode === 'complete') {
       return new THREE.MeshStandardMaterial({ color: baseColor });
    }

    return new THREE.MeshStandardMaterial({ color: baseColor });
  };

  return (
    <group>
      {sceneNodes.map((node) => {
        const nodeMaterial = getMaterial(node);
        const args = node.scale || [1, 1, 1];
        
        // Render sub-regions if available
        if (node.regions && node.regions.length > 0 && viewMode !== 'complete' && viewMode !== 'reality') {
          const res = 10; // REGION_RESOLUTION
          const regW = args[0] / res;
          const regH = args[1] / res;
          
          return (
            <group key={node.id} position={node.position} rotation={node.rotation}>
              {node.regions?.map((region: any) => {
                 const u = region.u || 0;
                 const v = region.v || 0;
                 const offsetX = -args[0]/2 + regW/2 + (u * regW);
                 const offsetY = -args[1]/2 + regH/2 + (v * regH);
                 
                 const rArgs = [regW, regH, args[2]];
                 const rMat = getMaterial({...region, material: node.material, type: node.type});
                 
                 return (
                   <mesh 
                     key={region.id} 
                     position={node.type === 'floor' ? [offsetX, offsetY, 0] : [offsetX, offsetY, 0]}
                     onPointerDown={(e) => handlePointerDown(e, node.id)} 
                     onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(region); }}
                     onPointerOut={(e) => { e.stopPropagation(); setHoveredRegion(null); }}
                   >
                     {node.type === 'floor' ? (
                       <planeGeometry args={[rArgs[0], rArgs[1]]} />
                     ) : (
                       <boxGeometry args={[rArgs[0], rArgs[1], rArgs[2]]} />
                     )}
                     <primitive object={rMat} />
                   </mesh>
                 )
              })}
            </group>
          )
        }
        
        return (
          <mesh
            key={node.id}
            position={node.position}
            rotation={node.rotation}
            onPointerDown={(e) => handlePointerDown(e, node.id)}
          >
            {node.type === 'floor' ? (
              <planeGeometry args={[args[0], args[1]]} />
            ) : (
              <boxGeometry args={[args[0], args[1], args[2]]} />
            )}
            <primitive object={nodeMaterial} />
          </mesh>
        );
      })}

      {hoveredRegion && (
        <Html position={[0, 3, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-md shadow-xl text-neutral-300 text-xs w-56 font-sans">
            <div className="text-[10px] text-neutral-500 font-bold tracking-wider mb-2 uppercase">SURFACE REGION</div>
            <div className="text-emerald-400 font-mono mb-4">{hoveredRegion.parentId} / R_{hoveredRegion.u}_{hoveredRegion.v}</div>
            
            <div className="space-y-3">
              <div>
                <span className="text-neutral-500 block mb-0.5">Status</span>
                <span className="font-bold text-neutral-200 uppercase">{hoveredRegion.status}</span>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Visibility</span>
                  <span className="font-mono text-neutral-200">{Math.round(hoveredRegion.visibilityScore * 100)}%</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Observations</span>
                  <span className="font-mono text-neutral-200">{hoveredRegion.observationCount}</span>
                </div>
              </div>
              
              {hoveredRegion.status === 'observed' && hoveredRegion.evidenceFrames?.length > 0 && (
                <div>
                  <span className="text-neutral-500 block mb-0.5">Evidence frames</span>
                  <span className="font-mono text-neutral-300">{hoveredRegion.evidenceFrames.join(', ')}...</span>
                </div>
              )}
              
              {hoveredRegion.status !== 'observed' && hoveredRegion.supportingElements?.length > 0 && (
                <div>
                  <span className="text-neutral-500 block mb-0.5">Supporting evidence</span>
                  <div className="text-neutral-300">
                    {hoveredRegion.supportingElements.map((el: string) => <div key={el}>{el}</div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const ThreeViewer = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [8, 5, 8], fov: 45 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={<Html><div className="text-white">Loading...</div></Html>}>
          <DynamicScene />
          <Environment preset="city" />
        </Suspense>

        <Grid infiniteGrid fadeDistance={20} sectionColor="#333" cellColor="#111" />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};
