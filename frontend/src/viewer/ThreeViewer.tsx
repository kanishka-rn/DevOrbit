import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { useWorldStore } from '../stores/useWorldStore';
import { Suspense } from 'react';
import * as THREE from 'three';

const DynamicScene = () => {
  const { viewMode, setSelectedRegion, sceneNodes } = useWorldStore();

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
      if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.5, wireframe: true }); // Red error
      if (regionType === 'partially_observed') return new THREE.MeshStandardMaterial({ color: '#f59e0b', emissive: '#f59e0b', emissiveIntensity: 0.5 }); // Amber
      return new THREE.MeshStandardMaterial({ color: '#111827', transparent: true, opacity: 0.1 }); // ghostly GT baseline
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
          return (
            <group key={node.id} position={node.position} rotation={node.rotation}>
              {node.regions?.map((region: any, i: number) => {
                 // Distribute regions along the main axis.
                 // For simplicity, just divide X
                 const numReg = node.regions!.length;
                 const regW = args[0] / numReg;
                 const offsetX = -args[0]/2 + regW/2 + (i * regW);
                 const rArgs = [regW, args[1], args[2]];
                 const rMat = getMaterial({...region, material: node.material, type: node.type});
                 
                 return (
                   <mesh 
                     key={region.id} 
                     position={[offsetX, 0, 0]}
                     onPointerDown={(e) => handlePointerDown(e, node.id)} // Keep selecting the parent node
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
