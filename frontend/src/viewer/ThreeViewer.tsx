import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Html } from '@react-three/drei';
import { useWorldStore } from '../stores/useWorldStore';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

const DummyScene = () => {
  const { viewMode, setSelectedRegion } = useWorldStore();

  const handlePointerDown = (e: any, region: string) => {
    e.stopPropagation();
    setSelectedRegion(region);
  };

  const getMaterial = (regionType: string) => {
    if (viewMode === 'uncertainty') {
      if (regionType === 'observed') return new THREE.MeshStandardMaterial({ color: '#22c55e' }); // green
      if (regionType === 'inferred') return new THREE.MeshStandardMaterial({ color: '#eab308' }); // yellow
      if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#f97316' }); // orange
    }
    
    if (viewMode === 'reality' && (regionType === 'inferred' || regionType === 'generated')) {
      return new THREE.MeshBasicMaterial({ visible: false });
    }
    
    if (viewMode === 'inferred' && regionType === 'generated') {
      return new THREE.MeshBasicMaterial({ visible: false });
    }

    if (regionType === 'observed') return new THREE.MeshStandardMaterial({ color: '#f5f5f5' });
    if (regionType === 'inferred') return new THREE.MeshStandardMaterial({ color: '#cbd5e1' });
    if (regionType === 'generated') return new THREE.MeshStandardMaterial({ color: '#94a3b8', wireframe: viewMode === 'reality' ? false : false });
    
    return new THREE.MeshStandardMaterial({ color: '#333' });
  };

  return (
    <group>
      {/* Floor - Observed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onPointerDown={(e) => handlePointerDown(e, 'floor_01')}>
        <planeGeometry args={[10, 10]} />
        <primitive object={getMaterial('observed')} />
      </mesh>

      {/* Wall 1 - Observed */}
      <mesh position={[0, 1.5, -5]} onPointerDown={(e) => handlePointerDown(e, 'wall_01')}>
        <boxGeometry args={[10, 3, 0.2]} />
        <primitive object={getMaterial('observed')} />
      </mesh>
      
      {/* Wall 2 - Observed */}
      <mesh position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} onPointerDown={(e) => handlePointerDown(e, 'wall_02')}>
        <boxGeometry args={[10, 3, 0.2]} />
        <primitive object={getMaterial('observed')} />
      </mesh>

      {/* Wall 3 - Inferred */}
      <mesh position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} onPointerDown={(e) => handlePointerDown(e, 'wall_03')}>
        <boxGeometry args={[10, 3, 0.2]} />
        <primitive object={getMaterial('inferred')} />
      </mesh>

      {/* Wall 4 - Generated (Missing Region) */}
      <mesh position={[0, 1.5, 5]} onPointerDown={(e) => handlePointerDown(e, 'wall_04')}>
        <boxGeometry args={[10, 3, 0.2]} />
        <primitive object={getMaterial('generated')} />
      </mesh>

      {/* Furniture - Observed */}
      <mesh position={[0, 0.5, -2]} onPointerDown={(e) => handlePointerDown(e, 'sofa_01')}>
        <boxGeometry args={[2, 1, 1]} />
        <primitive object={getMaterial('observed')} />
      </mesh>
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
          <DummyScene />
          <Environment preset="city" />
        </Suspense>

        <Grid infiniteGrid fadeDistance={20} sectionColor="#333" cellColor="#111" />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};
