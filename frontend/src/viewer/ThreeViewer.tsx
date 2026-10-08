import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { useWorldStore } from '../stores/useWorldStore';
import { Suspense, useMemo } from 'react';
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
    
    if (viewMode === 'uncertainty') {
      if (regionType === 'observed') return new THREE.MeshStandardMaterial({ color: '#22c55e' }); // green
      if (regionType === 'inferred') return new THREE.MeshStandardMaterial({ color: '#eab308' }); // yellow
      if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#f97316' }); // orange
    }
    
    if (viewMode === 'coverage') {
      if (regionType === 'observed') return new THREE.MeshStandardMaterial({ color: '#0ea5e9' }); // blue
      if (regionType === 'inferred') return new THREE.MeshStandardMaterial({ color: '#6366f1' }); // indigo
      if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#f43f5e' }); // rose
    }

    if (viewMode === 'reality' && (regionType === 'inferred' || regionType === 'generated')) {
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
        const material = getMaterial(node);
        const args = node.scale || [1, 1, 1];
        
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
            <primitive object={material} />
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
