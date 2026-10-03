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
import { StationAreaDropdownCard } from './StationAreaDropdownCard';
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
    setIsCutawayView,
    isHeatmapActive,
    setIsHeatmapActive,
    isStormActive,
    setIsStormActive,
    isPowerConduitActive,
    isGridFaultActive,
    setIsGridFaultActive,
    viewPreset,
    setViewPreset,
    triggerEdgeAction
  } = useTelemetry();

  const controlsRef = useRef();

  // Selected Area & Model Source State
  const [activeAreaKey, setActiveAreaKey] = useState('level2');
  const [modelSource, setModelSource] = useState('bharati'); // 'bharati' | 'glb' | 'maitri'
  const [selectedMeshObject, setSelectedMeshObject] = useState(null);
  const [hoveredMeshObject, setHoveredMeshObject] = useState(null);

  const riometerDb = telemetry?.maitri?.riometer?.absorptionDb || 1.84;
  const windSpeedKmh = telemetry?.bharati?.aws?.windSpeedKmh || 63.3;

  // Camera focus function for area dropdown card
  const focusCameraOnArea = (areaKey) => {
    setActiveAreaKey(areaKey);
    if (!controlsRef.current) return;

    if (areaKey === 'level1') {
      controlsRef.current.object.position.set(-14, 8, 12);
      controlsRef.current.target.set(-2, 3, 0);
    } else if (areaKey === 'level2') {
      controlsRef.current.object.position.set(0, 10, 18);
      controlsRef.current.target.set(0, 5, 0);
    } else if (areaKey === 'level3') {
      controlsRef.current.object.position.set(4, 14, 12);
      controlsRef.current.target.set(0, 7, 0);
    } else if (areaKey === 'radome') {
      controlsRef.current.object.position.set(-24, 11, -8);
      controlsRef.current.target.set(-18, 6, -14);
    } else if (areaKey === 'fuel') {
      controlsRef.current.object.position.set(20, 9, 14);
      controlsRef.current.target.set(10, 2, 4);
    } else if (areaKey === 'lake') {
      controlsRef.current.object.position.set(-22, 6, 14);
      controlsRef.current.target.set(-14, 1, 6);
    } else if (areaKey === 'grid') {
      controlsRef.current.object.position.set(14, 5, 12);
      controlsRef.current.target.set(0, 2, 0);
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
    <div className="relative w-full h-[680px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-900/40 shadow-2xl">
      
      {/* High-Contrast Interactive White Dropdown Card Overlay */}
      <StationAreaDropdownCard
        activeAreaKey={activeAreaKey}
        setActiveAreaKey={setActiveAreaKey}
        onFocusCamera={focusCameraOnArea}
        telemetry={telemetry}
        isCutawayView={isCutawayView}
        setIsCutawayView={setIsCutawayView}
        isHeatmapActive={isHeatmapActive}
        setIsHeatmapActive={setIsHeatmapActive}
        isStormActive={isStormActive}
        setIsStormActive={setIsStormActive}
        isGridFaultActive={isGridFaultActive}
        setIsGridFaultActive={setIsGridFaultActive}
        triggerEdgeAction={triggerEdgeAction}
      />

      {/* Model Selector Top Right */}
      <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <span className="text-[10px] font-mono text-slate-400 px-2 font-semibold">3D Model:</span>
        <button
          onClick={() => handleStationOrModelChange('bharati')}
          className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            modelSource === 'bharati' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
          }`}
        >
          Bharati Station
        </button>
        <button
          onClick={() => handleStationOrModelChange('maitri')}
          className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            modelSource === 'maitri' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
          }`}
        >
          Maitri II Station
        </button>
        <button
          onClick={() => handleStationOrModelChange('glb')}
          className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            modelSource === 'glb' ? 'bg-cyan-600 text-white shadow' : 'text-slate-300 hover:text-white'
          }`}
        >
          Native GLB Crew Quarters
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
        
        {/* Soft Horizon Haze Fog */}
        <fog attach="fog" args={['#090d16', 35, 110]} />

        {/* Photorealistic Environment Lighting */}
        <Environment preset="night" />

        {/* Twinkling Stars & Atmospheric Crystals */}
        <Stars radius={140} depth={60} count={7000} factor={4.5} saturation={0} fade speed={1.2} />
        <Sparkles count={180} scale={[50, 30, 50]} size={2.8} speed={0.4} color="#e0f2fe" />

        {/* Directional Sunlight */}
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

        {/* Stable Arctic Ground Terrain */}
        <AntarcticTerrain />

        {/* Ambient Shadows */}
        <ContactShadows position={[0, 0.02, 0]} opacity={0.7} scale={50} blur={2.0} far={12} color="#090d16" />

        {/* 3D Model Rendering */}
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
          minDistance={6}
          maxDistance={90}
        />
      </Canvas>
    </div>
  );
}
