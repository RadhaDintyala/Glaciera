import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 2D & 3D Ground Risk Heat Map Plane
 * Matches the user's reference image:
 * - Gradient background running from Green (Low Impact/Activity) -> Yellow -> Orange -> Red (High Impact/Activity)
 * - Interactive blue data points plotted across the ground plane: R1, R2, R3, R4, R5, R6, etc.
 * - Optimized with polygonOffset & depthWrite=false to prevent z-fighting flicker/shaking.
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
    // Bottom-Left: Green (#65a30d) -> Center: Yellow (#facc15) -> Right: Red (#dc2626)
    const grad = ctx.createLinearGradient(0, 1024, 1024, 0);
    grad.addColorStop(0.0, '#65a30d'); // Bright Lime Green (Low Risk / Low Impact)
    grad.addColorStop(0.3, '#a3e635'); 
    grad.addColorStop(0.5, '#facc15'); // Yellow (Moderate Activity)
    grad.addColorStop(0.75, '#f97316'); // Orange (High Activity)
    grad.addColorStop(1.0, '#dc2626'); // Deep Red (High Impact / Critical)

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Crisp Grid Lines Overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
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

  // Risk Node Points plotted on the ground plane (matching R1, R2, R3 blue dots in image)
  const riskNodes = [
    { id: 'R3', label: 'R3: Hydraulic Stilts', x: -16, z: 2, color: '#2563eb' },
    { id: 'R2', label: 'R2: Water Intake', x: -8, z: 8, color: '#2563eb' },
    { id: 'R1', label: 'R1: Fuel Storage', x: -6, z: -4, color: '#2563eb' },
    { id: 'R4', label: 'R4: CHP Generator', x: 4, z: -8, color: '#2563eb' },
    { id: 'R5', label: 'R5: VSAT Satellite', x: 8, z: -2, color: '#2563eb' },
    { id: 'R6', label: 'R6: Ice Sheet Margin', x: 18, z: -14, color: '#2563eb' },
  ];

  if (!isVisible) return null;

  return (
    <group position={[0, 0.35, 0]}>
      {/* Risk Heat Map Gradient Ground Plane (Lifted with depthWrite=false & polygonOffset to fix shaking) */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 50]} />
        <meshBasicMaterial
          map={riskHeatmapTexture}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
          depthWrite={false}
        />
      </mesh>

      {/* Axis Labels on Ground Plane (Impact vs Activity) */}
      <Html position={[-30, 0.4, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} center>
        <div className="text-white font-mono text-xs font-bold bg-slate-900/95 px-3 py-1 rounded border border-slate-700 shadow-2xl tracking-widest uppercase backdrop-blur-md">
          ▲ IMPACT (Y-AXIS)
        </div>
      </Html>
      <Html position={[0, 0.4, 26]} center>
        <div className="text-white font-mono text-xs font-bold bg-slate-900/95 px-3 py-1 rounded border border-slate-700 shadow-2xl tracking-widest uppercase backdrop-blur-md">
          ACTIVITY (X-AXIS) ►
        </div>
      </Html>

      {/* Blue Data Points & Labels (R1, R2, R3...) Plotted on Ground */}
      {riskNodes.map((node) => (
        <group key={node.id} position={[node.x, 0.45, node.z]}>
          {/* Blue Circular Dot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.7, 32]} />
            <meshBasicMaterial color="#2563eb" polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[0.7, 0.9, 32]} />
            <meshBasicMaterial color="#ffffff" polygonOffset polygonOffsetFactor={-7} polygonOffsetUnits={-7} />
          </mesh>

          {/* HTML Label pinned to the node */}
          <Html position={[1.2, 0.3, 0]} center>
            <div className="bg-slate-900/95 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-blue-500 shadow-xl whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              {node.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
