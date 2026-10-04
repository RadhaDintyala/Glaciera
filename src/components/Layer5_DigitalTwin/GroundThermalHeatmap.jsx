import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Smooth Blended Ground Thermal Heatmap
 * Seamlessly projected and blended with the Antarctic permafrost/snow surface.
 * Features soft Gaussian radial falloff, organic thermal gradients (cool teal -> warm amber -> critical red),
 * zero harsh rectangular boundaries, and glowing translucent sensor node rings.
 */
export function GroundThermalHeatmap({ isVisible = true, isFaultActive = false }) {
  const meshRef = useRef();

  // Create an organic, softly blended procedural thermal texture with radial edge falloff
  const blendedHeatmapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Clear with fully transparent background
    ctx.clearRect(0, 0, 1024, 1024);

    // 2. Base Permafrost Ambient Thermal Gradient (Soft radial dispersion)
    const baseGrad = ctx.createRadialGradient(512, 512, 50, 512, 512, 480);
    baseGrad.addColorStop(0.0, 'rgba(16, 185, 129, 0.55)');  // Temperate Green/Teal at center
    baseGrad.addColorStop(0.35, 'rgba(234, 179, 8, 0.45)');  // Warm Yellow
    baseGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.35)'); // Amber / Orange
    baseGrad.addColorStop(0.85, 'rgba(56, 189, 248, 0.15)'); // Cool Polar Blue
    baseGrad.addColorStop(1.0, 'rgba(14, 165, 233, 0.0)');   // Completely transparent feathered edge

    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.arc(512, 512, 480, 0, Math.PI * 2);
    ctx.fill();

    // 3. Generator / CHP High-Thermal Hotspot Plume (Right / Core Zone)
    const coreX = 640;
    const coreY = isFaultActive ? 520 : 500;
    const coreGrad = ctx.createRadialGradient(coreX, coreY, 20, coreX, coreY, isFaultActive ? 260 : 200);
    coreGrad.addColorStop(0.0, isFaultActive ? 'rgba(239, 68, 68, 0.95)' : 'rgba(244, 63, 94, 0.75)'); // Intense Red hotspot
    coreGrad.addColorStop(0.4, isFaultActive ? 'rgba(249, 115, 22, 0.75)' : 'rgba(251, 146, 60, 0.55)');
    coreGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.25)');
    coreGrad.addColorStop(1.0, 'rgba(234, 179, 8, 0.0)');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(coreX, coreY, isFaultActive ? 260 : 200, 0, Math.PI * 2);
    ctx.fill();

    // 4. Freshwater Intake / Sub-Ice Cool Thermal Zone (Left Zone)
    const coolGrad = ctx.createRadialGradient(320, 600, 20, 320, 600, 180);
    coolGrad.addColorStop(0.0, 'rgba(6, 182, 212, 0.65)'); // Cyan / Cold Loop
    coolGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
    coolGrad.addColorStop(1.0, 'rgba(2, 132, 199, 0.0)');

    ctx.fillStyle = coolGrad;
    ctx.beginPath();
    ctx.arc(320, 600, 180, 0, Math.PI * 2);
    ctx.fill();

    // 5. Living Quarters Comfort Temperature Loop (Center-Left)
    const livingGrad = ctx.createRadialGradient(450, 420, 15, 450, 420, 160);
    livingGrad.addColorStop(0.0, 'rgba(34, 197, 94, 0.55)'); // Optimal Green
    livingGrad.addColorStop(0.6, 'rgba(74, 222, 128, 0.25)');
    livingGrad.addColorStop(1.0, 'rgba(74, 222, 128, 0.0)');

    ctx.fillStyle = livingGrad;
    ctx.beginPath();
    ctx.arc(450, 420, 160, 0, Math.PI * 2);
    ctx.fill();

    // 6. Very subtle, organic thermal contour ripples (faintly blended)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    [120, 220, 320, 420].forEach((r) => {
      ctx.beginPath();
      ctx.arc(512, 512, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [isFaultActive]);

  // Risk Node Sensor Points plotted softly on the ground
  const riskNodes = [
    { id: 'R3', label: 'R3: Hydraulic Stilts', x: -16, z: 2, temp: '84.5°C', color: '#38bdf8' },
    { id: 'R2', label: 'R2: Water Intake', x: -8, z: 8, temp: '+3.8°C', color: '#06b6d4' },
    { id: 'R1', label: 'R1: Fuel Storage', x: -6, z: -4, temp: '-12.4°C', color: '#818cf8' },
    { id: 'R4', label: 'R4: CHP Generator', x: 4, z: -8, temp: isFaultActive ? '108.4°C' : '84.5°C', color: isFaultActive ? '#ef4444' : '#f59e0b' },
    { id: 'R5', label: 'R5: VSAT Satellite', x: 8, z: -2, temp: '1.24 Gbps', color: '#38bdf8' },
    { id: 'R6', label: 'R6: Ice Sheet Margin', x: 18, z: -14, temp: '1.85 m', color: '#0ea5e9' },
  ];

  if (!isVisible) return null;

  return (
    <group position={[0, 0.03, 0]}>
      {/* Seamlessly Blended Thermal Heatmap Disc (Blends into snow surface with additive transparency) */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[28, 64]} />
        <meshStandardMaterial
          map={blendedHeatmapTexture}
          transparent
          opacity={0.62}
          blending={THREE.NormalBlending}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle Blended Sensor Node Markers */}
      {riskNodes.map((node) => (
        <group key={node.id} position={[node.x, 0.04, node.z]}>
          {/* Soft Glowing Outer Halo */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.9, 32]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.35}
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-6}
              polygonOffsetUnits={-6}
            />
          </mesh>
          {/* Inner Core Dot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <circleGeometry args={[0.35, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-7}
              polygonOffsetUnits={-7}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
