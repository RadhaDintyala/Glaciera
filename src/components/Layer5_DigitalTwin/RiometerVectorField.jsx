import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Terrain-Aligned Space Weather & Riometer Vector Field
 * Visualizes ionospheric particle flux and cosmic noise absorption
 */
export function RiometerVectorField({ absorptionDb = 1.84, isVisible = true }) {
  const pointsRef = useRef();

  // Create 300 random particle vectors elevated over terrain
  const { positions, colors } = useMemo(() => {
    const count = 350;
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    const baseColor = new THREE.Color('#38bdf8');
    const alertColor = new THREE.Color('#f43f5e');

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = 3 + Math.random() * 9;

      posArr[i * 3] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;

      const mixed = baseColor.clone().lerp(alertColor, Math.min(1, absorptionDb / 6));
      colArr[i * 3] = mixed.r;
      colArr[i * 3 + 1] = mixed.g;
      colArr[i * 3 + 2] = mixed.b;
    }

    return { positions: posArr, colors: colArr };
  }, [absorptionDb]);

  useFrame((_, delta) => {
    if (pointsRef.current && isVisible) {
      pointsRef.current.rotation.y += delta * (0.1 + absorptionDb * 0.05);
    }
  });

  if (!isVisible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={Math.min(0.9, 0.3 + absorptionDb * 0.1)}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
