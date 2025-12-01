'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface DigitalTwin3DProps {
  metrics: any[];
  onMetricHover: (id: string | null) => void;
  hoveredMetric: string | null;
}

function Model() {
  const { scene } = useGLTF('/modells/Digital_DNA_Blueprint_1125173503_texture.glb');
  const meshRef = useRef<THREE.Group>(null);

  // Traverse and enhance materials once
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.metalness = 0.3;
              mat.roughness = 0.4;
            }
          });
        } else if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.metalness = 0.3;
          child.material.roughness = 0.4;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </group>
  );
}


export default function DigitalTwin3D({ metrics, onMetricHover, hoveredMetric }: DigitalTwin3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Enhanced lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.6} />
      <pointLight position={[0, -5, 0]} intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
      
      <Model />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={5}
        autoRotate={false}
      />
    </Canvas>
  );
}

// Preload the model for better performance
if (typeof window !== 'undefined') {
  useGLTF.preload('/modells/Digital_DNA_Blueprint_1125173503_texture.glb');
}

