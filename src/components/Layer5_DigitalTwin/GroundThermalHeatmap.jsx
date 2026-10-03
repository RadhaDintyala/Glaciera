import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * 2D & 3D Ground Risk Heat Map Plane
 * Fixed Z-fighting by setting elevated Y layer, depthWrite=false, and polygonOffset.
 * Renders vibrant risk gradient (Lime -> Yellow -> Orange -> Red) and blue sensor nodes.
 */
export function GroundThermalHeatmap({ isVisible = true, isFaultActive = false }) {
  const meshRef = useRef();

  // Create procedural Risk Heat Map texture matching reference image (Green -> Yellow -> Orange -> Red gradient)
  const riskHeatmapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Horizontal & Diagonal smooth gradient matching reference image
    const grad = ctx.createLinearGradient(0, 1024, 1024, 0);
    grad.addColorStop(0.0, '#65a30d'); // Bright Lime Green (Low Risk / Low Impact)
    grad.addColorStop(0.25, '#84cc16');
    grad.addColorStop(0.5, '#eab308'); // Yellow (Moderate Activity)
    grad.addColorStop(0.75, '#f97316'); // Orange (High Activity)
    grad.addColorStop(1.0, '#dc2626'); // Deep Red (High Impact / Critical)

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Crisp White Grid Lines Overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 1024; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Risk Node Sensor Points plotted on the ground plane (matching R1, R2, R3 blue dots)
  const riskNodes = [
    { id: 'R3', label: 'R3: Hydraulic Stilts', x: -16, z: 2, val: '84.5°C' },
    { id: 'R2', label: 'R2: Water Intake', x: -8, z: 8, val: '+3.8°C' },
    { id: 'R1', label: 'R1: Fuel Storage', x: -6, z: -4, val: '-12.4°C' },
    { id: 'R4', label: 'R4: CHP Generator', x: 4, z: -8, val: '280 kW' },
    { id: 'R5', label: 'R5: VSAT Satellite', x: 8, z: -2, val: '1.24 Gbps' },
    { id: 'R6', label: 'R6: Ice Sheet Margin', x: 18, z: -14, val: '1.85 m' },
  ];

  if (!isVisible) return null;

  return (
    <group position={[0, 0.08, 0]}>
      {/* Risk Heat Map Gradient Ground Plane (Lifted with depthWrite=false & polygonOffset to prevent shaking) */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 50]} />
        <meshBasicMaterial
          map={riskHeatmapTexture}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={-10}
          polygonOffsetUnits={-10}
          depthWrite={false}
        />
      </mesh>

      {/* Blue Sensor Node Markers Plotted directly on 3D Ground Mesh */}
      {riskNodes.map((node) => (
        <group key={node.id} position={[node.x, 0.09, node.z]}>
          {/* Outer Ring & Blue Fill */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial color="#2563eb" polygonOffset polygonOffsetFactor={-12} polygonOffsetUnits={-12} depthWrite={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.7, 0.9, 32]} />
            <meshBasicMaterial color="#ffffff" polygonOffset polygonOffsetFactor={-13} polygonOffsetUnits={-13} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
