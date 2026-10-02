import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Next-Gen Maitri II Antarctic Research Station 3D WebGL Digital Twin Model
 * Inspired by modern aerodynamic modular stilt architecture (Comandante Ferraz style)
 * Features dual-tier parallel aerodynamic modules, high-strength V-truss stilts,
 * panoramic end lounges, skywalk connection, and internal modular container cutaways.
 */
export function MaitriModel({ telemetry, isCutaway, isHeatmapActive, isFaultActive, isPowerConduitActive }) {
  const groupRef = useRef();
  const exhaustParticlesRef = useRef();
  const windTurbineRef1 = useRef();
  const windTurbineRef2 = useRef();

  // Animate generator heat exhaust & wind turbine rotation
  useFrame((_, delta) => {
    if (exhaustParticlesRef.current) {
      const positions = exhaustParticlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < 30; i++) {
        positions[i * 3 + 1] += delta * 1.8;
        if (positions[i * 3 + 1] > 4.5) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      exhaustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (windTurbineRef1.current) windTurbineRef1.current.rotation.z += delta * 3.5;
    if (windTurbineRef2.current) windTurbineRef2.current.rotation.z += delta * 3.5;
  });

  const particlePos = React.useMemo(() => {
    const arr = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 1] = Math.random() * 4.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return arr;
  }, []);

  // V-shaped Steel Stilt Legs Generator Helper
  const renderVStilts = (positionsX, zOffset, height = 3.5) => {
    return positionsX.map((x, idx) => (
      <group key={`v-stilt-${zOffset}-${idx}`} position={[x, height / 2, zOffset]}>
        {/* Left V-Leg */}
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, height, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Right V-Leg */}
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, height, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Concrete Foundation Footing */}
        <mesh position={[0, -height / 2 + 0.2, 0]} receiveShadow>
          <boxGeometry args={[2.2, 0.4, 1.2]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
      </group>
    ));
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Antarctic Oasis Terrain Base (Schirmacher Permafrost & Rocky Terrain) */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[32, 34, 0.6, 64]} />
        <meshStandardMaterial color="#334155" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Ice & Snow Drifts under Stilts */}
      {[-12, -4, 4, 12].map((x, i) => (
        <mesh key={`snow-drift-${i}`} position={[x, 0.05, (i % 2 === 0 ? 5 : -5)]} rotation={[-Math.PI / 2, 0, i * 0.8]}>
          <planeGeometry args={[14, 10]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.35} />
        </mesh>
      ))}

      {/* ------------------------------------------------------------------ */}
      {/* 2. BLOCK A (UPPER TIER): Living Cabins, Mess Hall, Control Room    */}
      {/* ------------------------------------------------------------------ */}
      <group position={[0, 5.2, -4.5]}>
        {/* Main Aerodynamic Dark Teal Module Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[18, 2.8, 4.8]} />
          <meshPhysicalMaterial
            color="#0e4e58" // Metallic Dark Teal / Blue-Green
            metalness={0.7}
            roughness={0.2}
            clearcoat={0.8}
            transparent={isCutaway}
            opacity={isCutaway ? 0.35 : 1.0}
            wireframe={isCutaway}
          />
        </mesh>

        {/* Aerodynamic Chamfer Roof Cap */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <boxGeometry args={[17.6, 0.4, 4.4]} />
          <meshStandardMaterial color="#0b3c44" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Panoramic End Glass Window (Front Lounge Facing Priyadarshini Lake) */}
        <mesh position={[-8.95, 0, 0]}>
          <boxGeometry args={[0.1, 2.4, 4.2]} />
          <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.75} opacity={0.85} transparent />
        </mesh>

        {/* Vertical Ribbon Windows along Block A */}
        {[-6, -4, -2, 0, 2, 4, 6].map((wX) => (
          <mesh key={`blockA-win-${wX}`} position={[wX, 0.2, 2.41]}>
            <boxGeometry args={[0.5, 1.6, 0.05]} />
            <meshPhysicalMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Indian Tricolor Badge & MAITRI II Lettering on Shell */}
        <mesh position={[6, 0.6, 2.42]}>
          <boxGeometry args={[2.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[6, 0.75, 2.43]}>
          <boxGeometry args={[2.2, 0.2, 0.02]} />
          <meshStandardMaterial color="#f97316" /> {/* Saffron */}
        </mesh>
        <mesh position={[6, 0.45, 2.43]}>
          <boxGeometry args={[2.2, 0.2, 0.02]} />
          <meshStandardMaterial color="#16a34a" /> {/* Green */}
        </mesh>

        {/* Internal Modular Shipping Containers (Visible when Cutaway Mode is ON) */}
        {isCutaway && (
          <group position={[0, 0, 0]}>
            {[-6.5, -2.5, 1.5, 5.5].map((cX, cIdx) => (
              <mesh key={`container-A-${cIdx}`} position={[cX, -0.2, 0]}>
                <boxGeometry args={[3.6, 2.0, 4.0]} />
                <meshStandardMaterial color={cIdx % 2 === 0 ? '#38bdf8' : '#e2e8f0'} wireframe={false} opacity={0.9} transparent />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* V-Stilts Supporting Block A */}
      {renderVStilts([-7, -2.5, 2.5, 7], -4.5, 3.8)}

      {/* ------------------------------------------------------------------ */}
      {/* 3. BLOCK B (LOWER TIER): 18 Science Labs & Tech Command Center    */}
      {/* ------------------------------------------------------------------ */}
      <group position={[-2, 3.8, 3.5]}>
        {/* Main Aerodynamic Dark Teal Module Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[22, 3.0, 5.2]} />
          <meshPhysicalMaterial
            color="#08333e" // Sleek Antarctic Teal
            metalness={0.75}
            roughness={0.18}
            clearcoat={0.9}
            transparent={isCutaway}
            opacity={isCutaway ? 0.35 : 1.0}
            wireframe={isCutaway}
          />
        </mesh>

        {/* Panoramic Observation Bay Glass Window (Front Science Lounge) */}
        <mesh position={[-10.95, 0, 0]}>
          <boxGeometry args={[0.1, 2.6, 4.6]} />
          <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.75} opacity={0.85} transparent />
        </mesh>

        {/* Double-Glazed Side Windows (18 Lab Workstations) */}
        {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((wX) => (
          <React.Fragment key={`blockB-win-${wX}`}>
            <mesh position={[wX, 0.3, 2.61]}>
              <boxGeometry args={[0.6, 1.8, 0.05]} />
              <meshPhysicalMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} />
            </mesh>
            <mesh position={[wX, 0.3, -2.61]}>
              <boxGeometry args={[0.6, 1.8, 0.05]} />
              <meshPhysicalMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Raised External Access Ramp & Observation Deck */}
        <mesh position={[10, -1.2, 0]} rotation={[0, 0, 0.15]} castShadow>
          <boxGeometry args={[5, 0.2, 2.5]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Internal Modular Shipping Containers (Visible when Cutaway Mode is ON) */}
        {isCutaway && (
          <group position={[0, 0, 0]}>
            {[-8, -4, 0, 4, 8].map((cX, cIdx) => (
              <mesh key={`container-B-${cIdx}`} position={[cX, -0.1, 0]}>
                <boxGeometry args={[3.6, 2.2, 4.4]} />
                <meshStandardMaterial color={cIdx % 2 === 0 ? '#10b981' : '#f59e0b'} wireframe={false} opacity={0.85} transparent />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* V-Stilts Supporting Block B */}
      {renderVStilts([-9, -4.5, 0, 4.5, 9], 3.5, 2.3)}

      {/* ------------------------------------------------------------------ */}
      {/* 4. INTERCONNECTING GLAZED SKYBRIDGE PASSALERA                       */}
      {/* ------------------------------------------------------------------ */}
      <group position={[0, 4.5, -0.5]} rotation={[0, 0.2, 0]}>
        {/* Enclosed Steel Tunnel */}
        <mesh castShadow>
          <boxGeometry args={[2.4, 2.2, 4.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Side Walls */}
        <mesh position={[1.21, 0, 0]}>
          <boxGeometry args={[0.05, 1.6, 3.8]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.7} opacity={0.8} transparent />
        </mesh>
        <mesh position={[-1.21, 0, 0]}>
          <boxGeometry args={[0.05, 1.6, 3.8]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.7} opacity={0.8} transparent />
        </mesh>
      </group>

      {/* ------------------------------------------------------------------ */}
      {/* 5. BLOCK C: SERVICE, GENERATOR HOUSE & WIND TURBINE SPINE          */}
      {/* ------------------------------------------------------------------ */}
      <group position={[12, 3.2, -1.0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6.5, 3.2, 6.0]} />
          <meshPhysicalMaterial
            color={isFaultActive ? '#ef4444' : '#1e293b'}
            metalness={0.85}
            roughness={0.2}
            emissive={isFaultActive ? '#b91c1c' : '#0f172a'}
            emissiveIntensity={isFaultActive ? 0.9 : 0.2}
          />
        </mesh>

        {/* Generator Twin Smoke Stacks */}
        <mesh position={[1.5, 2.4, 1.5]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 2.2, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.5, 2.4, -1.5]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 2.2, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Generator Heat Haze Particles */}
        <group position={[1.5, 3.5, 0]}>
          <points ref={exhaustParticlesRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[particlePos, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.25} color="#94a3b8" transparent opacity={0.4} />
          </points>
        </group>

        {/* Wind Turbines Mounted on Service Block Spine */}
        <group position={[-1.5, 2.8, 2.0]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 3.0, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <group ref={windTurbineRef1} position={[0, 3.0, 0]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
              <mesh key={`blade1-${i}`} rotation={[0, 0, angle]} position={[0, 0.6, 0]}>
                <boxGeometry args={[0.12, 1.4, 0.02]} />
                <meshStandardMaterial color="#f8fafc" />
              </mesh>
            ))}
          </group>
        </group>

        <group position={[-1.5, 2.8, -2.0]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 3.0, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <group ref={windTurbineRef2} position={[0, 3.0, 0]}>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
              <mesh key={`blade2-${i}`} rotation={[0, 0, angle]} position={[0, 0.6, 0]}>
                <boxGeometry args={[0.12, 1.4, 0.02]} />
                <meshStandardMaterial color="#f8fafc" />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* V-Stilts Supporting Service Block C */}
      {renderVStilts([10, 14], -1.0, 1.6)}

      {/* ------------------------------------------------------------------ */}
      {/* 6. LAKE PRIYADARSHINI FRESHWATER PUMPHOUSE & HEATED CONDUIT PIPES   */}
      {/* ------------------------------------------------------------------ */}
      <group position={[-18, 0.2, -6]}>
        {/* Lake Surface Simulation */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[7, 32]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.1} transmission={0.6} opacity={0.9} transparent />
        </mesh>
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-cyan-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap shadow-lg">
            Lake Priyadarshini Basin (Trace Heated Intake)
          </div>
        </Html>
      </group>

      {/* Heated Water & Microgrid Power Conduits Running Under Stilts */}
      <mesh position={[-3, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 28, 16]} />
        <meshStandardMaterial
          color={isFaultActive ? '#ef4444' : isPowerConduitActive ? '#38bdf8' : '#475569'}
          emissive={isFaultActive ? '#ef4444' : isPowerConduitActive ? '#0284c7' : '#000000'}
          emissiveIntensity={isPowerConduitActive ? 1.5 : 0}
        />
      </mesh>
    </group>
  );
}
