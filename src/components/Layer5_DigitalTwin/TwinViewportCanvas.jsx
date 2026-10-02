import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Sparkles, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { AntarcticTerrain } from './AntarcticTerrain';
import { BharatiModel } from './BharatiModel';
import { MaitriModel } from './MaitriModel';
import { GLBModelViewer } from './GLBModelViewer';
import { ModelLoadingFallback } from './ModelLoadingFallback';
import { ModelInspectorHUD } from './ModelInspectorHUD';
import { GroundThermalHeatmap } from './GroundThermalHeatmap';
import { RiometerVectorField } from './RiometerVectorField';
import { IonosphereAuroraDome } from './IonosphereAuroraDome';
import { useTelemetry } from '../../context/TelemetryContext';

/**
 * Outdoor Antarctic Blizzard Snowfall Particles
 */
function BlizzardSnow({ windSpeedKmh = 63.3 }) {
  const pointsRef = useRef();
  const count = 850;

  const positions = React.useMemo(() => {
    const posArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      posArr[i * 3] = (Math.random() - 0.5) * 70;
      posArr[i * 3 + 1] = Math.random() * 30;
      posArr[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    return posArr;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const speed = (windSpeedKmh / 16) * delta;
      const positionsArr = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        positionsArr[i * 3 + 1] -= speed * 0.45;
        positionsArr[i * 3] += speed * 0.85;
        if (positionsArr[i * 3 + 1] < 0) {
          positionsArr[i * 3 + 1] = 30;
          positionsArr[i * 3] = (Math.random() - 0.5) * 70;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.25} color="#f8fafc" transparent opacity={0.8} />
    </points>
  );
}

export function TwinViewportCanvas() {
  const {
    activeStation,
    setActiveStation,
    telemetry,
    isCutawayView,
    isHeatmapActive,
    isAuroraVisible,
    isPowerConduitActive,
    isGridFaultActive,
    viewPreset,
    setViewPreset
  } = useTelemetry();

  const controlsRef = useRef();

  // Selected / Hovered 3D GLB Object State
  const [modelSource, setModelSource] = useState('bharati'); // 'bharati' | 'glb' | 'maitri'
  const [selectedMeshObject, setSelectedMeshObject] = useState(null);
  const [hoveredMeshObject, setHoveredMeshObject] = useState(null);

  const riometerDb = telemetry?.maitri?.riometer?.absorptionDb || 1.84;
  const windSpeedKmh = telemetry?.bharati?.aws?.windSpeedKmh || 63.3;

  // Camera preset snap positions
  const setPresetCamera = (preset) => {
    setViewPreset(preset);
    if (!controlsRef.current) return;
    if (preset === 'overview') {
      controlsRef.current.object.position.set(28, 22, 38);
      controlsRef.current.target.set(0, 2, 0);
    } else if (preset === 'generators') {
      controlsRef.current.object.position.set(-14, 8, -4);
      controlsRef.current.target.set(-8, 2, -2);
    } else if (preset === 'radomes') {
      controlsRef.current.object.position.set(-5, 11, 9);
      controlsRef.current.target.set(-4, 5, 1.5);
    } else if (preset === 'stilts') {
      controlsRef.current.object.position.set(14, 4, 12);
      controlsRef.current.target.set(0, 1, 0);
    }
    controlsRef.current.update();
  };

  const handleStationOrModelChange = (source) => {
    setModelSource(source);
    if (source === 'bharati' || source === 'maitri') {
      setActiveStation(source);
    }
    setSelectedMeshObject(null);
    setHoveredMeshObject(null);
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/40 shadow-2xl">
      {/* Top Left Header Overlay */}
      <div className="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 shadow-lg">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mr-2">
          3D VIEWPORT ENGINE
        </span>
        
        {/* Model Asset Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => handleStationOrModelChange('glb')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
              modelSource === 'glb' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Arctic Crew Quarters (.GLB)
          </button>
          <button
            onClick={() => handleStationOrModelChange('bharati')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
              modelSource === 'bharati' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bharati Station
          </button>
          <button
            onClick={() => handleStationOrModelChange('maitri')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-all ${
              modelSource === 'maitri' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Maitri Station
          </button>
        </div>
      </div>

      {/* Camera Presets Selector */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg">
        <span className="text-[10px] font-mono text-slate-400 px-2 font-semibold">3D Presets:</span>
        <button
          onClick={() => setPresetCamera('overview')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${viewPreset === 'overview' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
        >
          Landscape Overview
        </button>
        <button
          onClick={() => setPresetCamera('generators')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${viewPreset === 'generators' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
        >
          Generator Shed
        </button>
        <button
          onClick={() => setPresetCamera('radomes')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${viewPreset === 'radomes' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
        >
          SATCOM Radomes
        </button>
        <button
          onClick={() => setPresetCamera('stilts')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${viewPreset === 'stilts' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
        >
          Stilts & Foundation
        </button>
      </div>

      {/* Interactive Mesh Inspection HUD */}
      <ModelInspectorHUD
        selectedObject={selectedMeshObject}
        hoveredObject={hoveredMeshObject}
        onClose={() => setSelectedMeshObject(null)}
      />

      {/* 3D WebGL Canvas Rendering */}
      <Canvas
        shadows
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.35, antialias: true }}
        camera={{ position: [28, 22, 38], fov: 42 }}
      >
        <color attach="background" args={['#090d16']} />
        
        {/* Soft Horizon Haze Fog matching Reference Image */}
        <fog attach="fog" args={['#090d16', 35, 110]} />

        {/* Photorealistic Environment Lighting */}
        <Environment preset="night" />

        {/* Twinkling Stars & Atmospheric Crystals */}
        <Stars radius={140} depth={60} count={7000} factor={4.5} saturation={0} fade speed={1.2} />
        <Sparkles count={180} scale={[50, 30, 50]} size={2.8} speed={0.4} color="#e0f2fe" />

        {/* Cinematic Directional Polar Sunlight */}
        <ambientLight intensity={0.65} color="#e0f2fe" />
        <directionalLight
          position={[45, 50, 35]}
          intensity={2.8}
          color="#fffbeb"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={120}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
          shadow-bias={-0.00008}
        />
        <directionalLight position={[-30, 20, -30]} intensity={0.6} color="#38bdf8" />

        {/* Ultra-Detail Mountainous Antarctic Landscape */}
        <AntarcticTerrain />

        {/* Contact Ambient Occlusion Ground Shadows */}
        <ContactShadows position={[0, 0.05, 0]} opacity={0.75} scale={50} blur={2.0} far={12} color="#090d16" />

        {/* 3D Model Asset Rendering */}
        {modelSource === 'glb' ? (
          <Suspense fallback={<ModelLoadingFallback message="Loading Native Arctic Crew Quarters GLB..." />}>
            <GLBModelViewer
              modelKey="crewQuarters"
              onObjectClick={(obj) => setSelectedMeshObject(obj)}
              onObjectHover={(obj) => setHoveredMeshObject(obj)}
              isHeatmapActive={isHeatmapActive}
              isFaultActive={isGridFaultActive}
            />
          </Suspense>
        ) : modelSource === 'bharati' ? (
          <BharatiModel
            telemetry={telemetry}
            isCutaway={isCutawayView}
            isHeatmapActive={isHeatmapActive}
            isFaultActive={isGridFaultActive}
          />
        ) : (
          <MaitriModel
            telemetry={telemetry}
            isCutaway={isCutawayView}
            isHeatmapActive={isHeatmapActive}
            isFaultActive={isGridFaultActive}
            isPowerConduitActive={isPowerConduitActive}
          />
        )}

        {/* Dynamic Overlays */}
        <GroundThermalHeatmap isVisible={isHeatmapActive} isFaultActive={isGridFaultActive} />
        <RiometerVectorField absorptionDb={riometerDb} isVisible={isHeatmapActive} />
        <BlizzardSnow windSpeedKmh={windSpeedKmh} />

        {/* Floating Anchored 3D Badges */}
        {modelSource === 'glb' ? (
          <Html position={[0, 9.5, 0]} center>
            <div className="bg-slate-900/95 text-cyan-300 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border border-cyan-500/50 shadow-xl pointer-events-none whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              NATIVE GLB MODEL: Arctic Crew Quarters (Interactive)
            </div>
          </Html>
        ) : activeStation === 'bharati' ? (
          <>
            <Html position={[-4.5, 6.8, 1.5]} center>
              <div className="bg-slate-900/90 text-cyan-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-cyan-500/50 shadow-xl pointer-events-none whitespace-nowrap">
                SATCOM Radome #1
              </div>
            </Html>
            <Html position={[6.2, 7.2, 2.2]} center>
              <div className="bg-slate-900/90 text-amber-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-amber-500/50 shadow-xl pointer-events-none whitespace-nowrap">
                AWS Mast: {telemetry?.bharati?.aws?.windSpeedKnots} kts
              </div>
            </Html>
          </>
        ) : (
          <>
            <Html position={[-9.2, 4.2, -2.2]} center>
              <div className="bg-slate-900/90 text-rose-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-rose-500/50 shadow-xl pointer-events-none whitespace-nowrap">
                Generator Shed: {telemetry?.maitri?.electricCircuits?.totalLoadKw} kW
              </div>
            </Html>
            <Html position={[8.5, 3.8, -5.5]} center>
              <div className="bg-slate-900/90 text-purple-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border border-purple-500/50 shadow-xl pointer-events-none whitespace-nowrap">
                Riometer Absorption: {telemetry?.maitri?.riometer?.absorptionDb} dB
              </div>
            </Html>
          </>
        )}

        {/* Post-Processing Effects for Crisp Bloom & Cinematic Vignette */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.82} intensity={1.1} mipmapBlur />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          enablePan
          enableZoom
          maxPolarAngle={Math.PI / 2 - 0.02}
          minDistance={8}
          maxDistance={90}
        />
      </Canvas>
    </div>
  );
}

