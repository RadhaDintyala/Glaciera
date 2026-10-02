import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Photorealistic Three.js 3D Model for Bharati Antarctic Research Station (Larsemann Hills)
 * Built to match official photographs:
 * - Angular metallic silver-grey 3-tier main building elevated on steel stilts
 * - Level 1: Heavy vehicle garage doors, CHP power plant, MBR waste treatment
 * - Level 2: 24 living cabins, research labs, panoramic glass viewing lounge
 * - Level 3: Penthouse operations command, solar array, AWS mast
 * - Hilltop: White ISRO SATCOM geodesic radome sphere with satellite tracking dish
 * - Site: Winding trace-heated pipeline conduits, colorful ISO shipping containers (blue, red, orange, green), and Lake Astrid
 */
export function BharatiModel({ telemetry, isCutaway, isHeatmapActive, isFaultActive, onObjectClick, onObjectHover }) {
  const groupRef = useRef();
  const radomeDishRef = useRef();
  const anemometerRef = useRef();
  const solarRef = useRef();

  // Animate satellite dish tracking & anemometer wind speed
  useFrame((_, delta) => {
    if (radomeDishRef.current) radomeDishRef.current.rotation.y += delta * 1.2;
    if (anemometerRef.current) anemometerRef.current.rotation.y += delta * 5.5;
    if (solarRef.current) solarRef.current.rotation.y = Math.sin(Date.now() / 3000) * 0.15;
  });

  const getLabColor = (baseTemp) => {
    if (!isHeatmapActive) return '#1e293b';
    if (isFaultActive) return '#ef4444';
    if (baseTemp > 20) return '#f59e0b';
    return '#10b981';
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TERRAIN & ENVIRONMENT (Larsemann Hills Rocky Ground & Ice)    */}
      {/* ------------------------------------------------------------------ */}
      {/* Main Brown-Tan Oasis Rocky Ground Base */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[36, 40, 0.6, 64]} />
        <meshStandardMaterial color="#926239" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Rocky Outcrops & Bluffs */}
      <mesh position={[-18, 1.8, -14]} rotation={[0.2, 0.4, 0]} receiveShadow castShadow>
        <dodecahedronGeometry args={[6.5, 2]} />
        <meshStandardMaterial color="#6b4423" roughness={0.95} />
      </mesh>
      <mesh position={[18, 1.2, 12]} rotation={[-0.1, 0.8, 0.2]} receiveShadow castShadow>
        <dodecahedronGeometry args={[5.2, 2]} />
        <meshStandardMaterial color="#784e28" roughness={0.9} />
      </mesh>
      <mesh position={[-12, 0.8, 16]} rotation={[0.3, -0.5, 0.1]} receiveShadow castShadow>
        <dodecahedronGeometry args={[4.8, 2]} />
        <meshStandardMaterial color="#5c3818" roughness={0.95} />
      </mesh>

      {/* Snow Patches & Sea Ice Margin */}
      {[-16, -6, 8, 16].map((x, i) => (
        <mesh key={`snow-patch-${i}`} position={[x, 0.05, (i % 2 === 0 ? 12 : -12)]} rotation={[-Math.PI / 2, 0, i * 0.7]}>
          <planeGeometry args={[14, 10]} />
          <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
        </mesh>
      ))}

      {/* Lake Astrid Freshwater Basin (Front Left) */}
      <group position={[-14, 0.04, 6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[8, 32]} />
          <meshPhysicalMaterial color="#0284c7" roughness={0.1} transmission={0.7} opacity={0.9} transparent />
        </mesh>
        <Html position={[0, 0.6, 0]} center>
          <div className="bg-cyan-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap shadow-lg">
            Lake Astrid (Freshwater Intake)
          </div>
        </Html>
      </group>

      {/* ------------------------------------------------------------------ */}
      {/* 2. ELEVATED STILT FOUNDATIONS & UNDERBELLY TRUSS GRID             */}
      {/* ------------------------------------------------------------------ */}
      {[-8.5, -4.5, -0.5, 3.5, 7.5].map((x) =>
        [-3.2, 3.2].map((z) => (
          <group key={`stilt-${x}-${z}`} position={[x, 1.2, z]}>
            {/* Dark Heavy Steel Stilt Pillar */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.28, 2.4, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Concrete Anchor Footing */}
            <mesh position={[0, -1.2, 0]} receiveShadow>
              <boxGeometry args={[1.1, 0.2, 1.1]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
          </group>
        ))
      )}

      {/* Heavy Steel Cradle Frame under Level 1 */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <boxGeometry args={[18.2, 0.25, 8.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ------------------------------------------------------------------ */}
      {/* 3. BHARATI MAIN BUILDING (3-TIER SUPERSTRUCTURE)                   */}
      {/* ------------------------------------------------------------------ */}
      {/* LEVEL 1 (GROUND FLOOR): Vehicle Garage, CHP Power House, Water/Waste */}
      <group position={[0, 3.4, 0]}>
        {/* Main Base Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[18.0, 2.2, 8.2]} />
          <meshPhysicalMaterial
            color="#94a3b8" // Metallic Silver-Grey
            metalness={0.8}
            roughness={0.2}
            clearcoat={0.9}
            transparent={isCutaway}
            opacity={isCutaway ? 0.35 : 1.0}
            wireframe={isCutaway}
          />
        </mesh>

        {/* Central Double Rollup Vehicle Garage Doors (Visible in Photo 1) */}
        <group position={[0, -0.2, 4.12]}>
          <mesh castShadow>
            <boxGeometry args={[3.8, 1.6, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Garage Door Ribs */}
          {[-0.5, 0, 0.5].map((y, i) => (
            <mesh key={`g-rib-${i}`} position={[0, y, 0.05]}>
              <boxGeometry args={[3.6, 0.04, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
          {/* Status Light */}
          <mesh position={[1.6, 0.6, 0.06]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>

      {/* LEVEL 2 (FIRST FLOOR): 24 Crew Cabins, Labs, Dining Hall, Panoramic Lounge */}
      <group position={[0, 5.5, 0]}>
        {/* Main Faceted Module Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[19.6, 2.2, 9.4]} />
          <meshPhysicalMaterial
            color="#cbd5e1" // Bright Polished Silver-Grey
            metalness={0.85}
            roughness={0.15}
            clearcoat={1.0}
            transparent={isCutaway}
            opacity={isCutaway ? 0.35 : 1.0}
            wireframe={isCutaway}
          />
        </mesh>

        {/* Polar Orange Accent Trim */}
        <mesh position={[0, 0, 4.72]}>
          <boxGeometry args={[19.6, 0.35, 0.05]} />
          <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* BHARATI INDIA Identification Plate */}
        <mesh position={[0, 0.5, 4.73]}>
          <boxGeometry args={[4.5, 0.5, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <Html position={[0, 5.8, 4.8]} center>
          <div className="bg-slate-950/90 text-cyan-300 font-mono text-[11px] font-bold px-3 py-1 rounded-md border border-cyan-500/50 shadow-xl pointer-events-none whitespace-nowrap">
            BHARATI STATION — LEVEL 2: SCIENCE & LIVING
          </div>
        </Html>

        {/* Front Panoramic Glass Lounge Window (Prydz Bay View - Seen in Photo 1 & 2) */}
        <mesh position={[-9.81, 0, 0]}>
          <boxGeometry args={[0.1, 1.8, 8.8]} />
          <meshPhysicalMaterial color="#38bdf8" roughness={0.1} transmission={0.8} opacity={0.85} transparent />
        </mesh>

        {/* Side Ribbon Windows (Lab Workstations & Cabins) */}
        {[-7.5, -5, -2.5, 0, 2.5, 5, 7.5].map((wX) => (
          <React.Fragment key={`win-l2-${wX}`}>
            <mesh position={[wX, 0.2, 4.73]}>
              <boxGeometry args={[1.5, 0.7, 0.06]} />
              <meshPhysicalMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} roughness={0.1} />
            </mesh>
            <mesh position={[wX, 0.2, -4.73]}>
              <boxGeometry args={[1.5, 0.7, 0.06]} />
              <meshPhysicalMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} roughness={0.1} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Internal Room Pods (Visible in Cutaway / Heatmap mode) */}
        {isCutaway && (
          <group position={[0, 0, 0]}>
            {/* Science Labs */}
            <mesh position={[-6, 0, 0]}>
              <boxGeometry args={[5.5, 1.8, 8.2]} />
              <meshStandardMaterial color={getLabColor(21)} opacity={0.85} transparent />
            </mesh>
            {/* Living Quarters */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[5.5, 1.8, 8.2]} />
              <meshStandardMaterial color={getLabColor(20)} opacity={0.85} transparent />
            </mesh>
            {/* Dining & Lounge */}
            <mesh position={[6, 0, 0]}>
              <boxGeometry args={[5.5, 1.8, 8.2]} />
              <meshStandardMaterial color={getLabColor(22)} opacity={0.85} transparent />
            </mesh>
          </group>
        )}
      </group>

      {/* LEVEL 3 (ROOF PENTHOUSE & COMMAND DECK) */}
      <group position={[0, 7.1, 0]}>
        {/* Central Penthouse Control Room Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8.4, 1.4, 5.2]} />
          <meshPhysicalMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        <Html position={[0, 7.9, 0]} center>
          <div className="bg-slate-900/90 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 pointer-events-none whitespace-nowrap shadow-lg">
            Level 3: Operations Command & Weather Deck
          </div>
        </Html>

        {/* Roof Solar PV Array (Visible in Photo 2) */}
        <group position={[0, 0.75, -0.5]} ref={solarRef}>
          <mesh rotation={[Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[14.0, 0.1, 3.2]} />
            <meshPhysicalMaterial
              color="#0f172a"
              emissive="#1e3a8a"
              emissiveIntensity={0.4}
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Automatic Weather Station (AWS) Anemometer Mast */}
        <group position={[3.8, 1.2, 2.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.1, 2.4, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <group ref={anemometerRef} position={[0, 1.2, 0]}>
            <mesh>
              <boxGeometry args={[0.8, 0.04, 0.04]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.8, 0.04, 0.04]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ------------------------------------------------------------------ */}
      {/* 4. HILLTOP ISRO SATCOM RADOME GEODESIC SPHERE (Photo 3 & 4)        */}
      {/* ------------------------------------------------------------------ */}
      <group position={[-18, 5.8, -14]}>
        {/* White Translucent Geodesic Radome Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[2.8, 32, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.3}
            opacity={0.92}
            transparent
            roughness={0.1}
            ior={1.4}
          />
        </mesh>
        {/* Support Base Pedestal */}
        <mesh position={[0, -2.6, 0]} receiveShadow>
          <cylinderGeometry args={[2.0, 2.4, 1.2, 24]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        {/* Internal Satellite Tracking Parabolic Dish */}
        <group ref={radomeDishRef} position={[0, 0, 0]}>
          <mesh rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[1.8, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.4]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>

        <Html position={[0, 3.8, 0]} center>
          <div className="bg-slate-950/95 text-cyan-300 font-mono text-[11px] font-bold px-3 py-1 rounded-md border border-cyan-500/50 shadow-2xl pointer-events-none whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            ISRO SATCOM Ground Station (Cartosat-3 / Oceansat Downlink)
          </div>
        </Html>
      </group>

      {/* ------------------------------------------------------------------ */}
      {/* 5. ISO SHIPPING CONTAINER LOGISTICS DEPOT (Photos 1, 2 & 3)        */}
      {/* ------------------------------------------------------------------ */}
      <group position={[0, 0, 0]}>
        {/* Hapag-Lloyd Orange Containers */}
        <mesh position={[10, 0.6, 6]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[10, 2.1, 6]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Maersk Ocean Blue Containers */}
        <mesh position={[-9, 0.6, 8]} rotation={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[-5, 0.6, 9]} rotation={[0, -0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#0369a1" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Evergreen Bright Green Container */}
        <mesh position={[14, 0.6, 2]} rotation={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* EXIM Red Containers */}
        <mesh position={[15, 0.6, -6]} rotation={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[-16, 0.6, -5]} rotation={[0, -0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.5, 1.8]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.5} />
        </mesh>

        <Html position={[11, 2.8, 6]} center>
          <div className="bg-slate-900/90 text-amber-300 font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap shadow-md">
            ISO Container Depot
          </div>
        </Html>
      </group>

      {/* ------------------------------------------------------------------ */}
      {/* 6. WINDING TRACE-HEATED PIPELINE CONDUITS (Photo 2)               */}
      {/* ------------------------------------------------------------------ */}
      <group position={[0, 0, 0]}>
        {/* Main Pipeline Segment 1 (From Level 1 to Ground) */}
        <mesh position={[-3, 0.8, 3]} rotation={[0, 0.4, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 18, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Main Pipeline Segment 2 (Extending across Larsemann Hills terrain) */}
        <mesh position={[6, 0.4, 10]} rotation={[0.1, 1.2, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 22, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        <Html position={[6, 1.2, 10]} center>
          <div className="bg-slate-950/90 text-teal-300 font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-teal-500/40 whitespace-nowrap shadow-md">
            Trace-Heated Desalination & Hydronic Pipeline Chase
          </div>
        </Html>
      </group>
    </group>
  );
}
