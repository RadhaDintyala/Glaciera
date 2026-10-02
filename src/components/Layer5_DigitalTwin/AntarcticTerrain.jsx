import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Generic Arctic Base Ground & Polar Snow Field
 * Replaces heavy mountain ranges with a clean, smooth, photorealistic generic arctic ice & snow base.
 */
export function AntarcticTerrain() {
  const { geometry, material } = useMemo(() => {
    const width = 160;
    const height = 160;
    const segments = 120;

    const geo = new THREE.PlaneGeometry(width, height, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const pureSnowColor = new THREE.Color('#f8fafc');
    const glacialIceColor = new THREE.Color('#e0f2fe');
    const softDriftColor = new THREE.Color('#f1f5f9');

    // 1. Calculate Subtle Gentle Snow Ripples (No steep mountains)
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Distance from station center
      const distFromCenter = Math.sqrt(x * x + z * z);

      // Gentle micro snow ripples
      let ripple = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 0.35 +
                   Math.sin(x * 0.25 + 0.5) * Math.sin(z * 0.25) * 0.15;

      // Keep central station base area completely flat
      if (distFromCenter < 30) {
        const factor = Math.min(1.0, distFromCenter / 30);
        ripple *= Math.pow(factor, 2);
      }

      pos.setY(i, ripple);

      // Color mapping: pure snow with subtle polar ice tinting
      const vertexColor = new THREE.Color();
      if (distFromCenter < 25) {
        vertexColor.copy(pureSnowColor).lerp(glacialIceColor, 0.15);
      } else {
        const blend = (ripple + 0.5) / 1.0;
        vertexColor.copy(softDriftColor).lerp(pureSnowColor, blend);
      }

      colors[i * 3] = vertexColor.r;
      colors[i * 3 + 1] = vertexColor.g;
      colors[i * 3 + 2] = vertexColor.b;
    }

    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.75,
      metalness: 0.05,
      envMapIntensity: 0.9
    });

    return { geometry: geo, material: mat };
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Clean Generic Arctic Base Ground Mesh */}
      <mesh geometry={geometry} material={material} receiveShadow castShadow />

      {/* Subtle Polar Station Base Pad Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[14, 14.3, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
    </group>
  );
}

