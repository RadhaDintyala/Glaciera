import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { 
  Database, Gauge, Zap, Radio, CloudSnow, Compass, Thermometer, 
  Wind, Activity, CheckCircle2, RefreshCw, Download, FileText, 
  Layers, Cpu, Server, Waves, ShieldCheck, MapPin, Sparkles, Box
} from 'lucide-react';

export function InSituStreamsView() {
  const {
    activeStation,
    setActiveStation,
    telemetry,
    triggerEdgeAction
  } = useTelemetry();

  const stationKey = activeStation === 'maitri' ? 'maitri' : 'bharati';
  const stationData = telemetry[stationKey] || telemetry.bharati;

  const [activeSubTab, setActiveSubTab] = useState('atmospheric'); // 'atmospheric' | 'microgrid' | 'riometer' | 'geotechnical'
  const [exportStatus, setExportStatus] = useState('idle'); // 'idle' | 'exporting' | 'success'

  const handleExportSnapshot = () => {
    setExportStatus('exporting');
    triggerEdgeAction('EXPORT_TELEMETRY_SNAPSHOT', `In-situ telemetry snapshot generated for ${stationData.stationName}`);
    setTimeout(() => {
      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
      }, 4500);
    }, 700);
  };

  // Live telemetry metrics
  const isBharati = stationKey === 'bharati';
  const ambientTemp = isBharati 
    ? '-18.2°C' 
    : `${telemetry?.maitri?.atmospheric?.ambientTemp ? Math.round(telemetry.maitri.atmospheric.ambientTemp) : -24}°C`;
  const windVelocity = isBharati 
    ? `${telemetry?.bharati?.aws?.windSpeedKmh || 63.3} km/h` 
    : `${telemetry?.maitri?.atmospheric?.windSpeedKmh || 52.6} km/h`;
  const totalLoad = isBharati 
    ? `${telemetry?.bharati?.electricCircuits?.totalLoadKw || 490} kW` 
    : `${telemetry?.maitri?.electricCircuits?.totalLoadKw || 265} kW`;
  const riometerDb = isBharati 
    ? `${telemetry?.bharati?.riometer?.absorptionDb || 1.12} dB` 
    : `${telemetry?.maitri?.riometer?.absorptionDb || 1.84} dB`;
  const driftRate = isBharati ? '1.82 mm/yr' : `${telemetry?.maitri?.gpsSurface?.driftX || 2.14} mm/yr`;

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans bg-slate-50 min-h-screen text-slate-800">
      
      {/* Title Header Banner - Glossy Deep Teal / Ocean Gradient matching Logistics banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 border border-teal-500/40 rounded-3xl p-6 text-white shadow-xl shadow-teal-700/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                In-Situ Datasets & Environmental Streams
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white border border-white/40 tracking-wider uppercase backdrop-blur-sm">
                Live Sensor Telemetry
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-100 font-sans mt-1 opacity-95">
              Raw Physical Sensors Stream, Atmospheric Weather, Microgrid & Space Weather Ingestion for {stationData.stationName}
            </p>
          </div>
        </div>

        {/* Station Switcher (Exact style from reference image) */}
        <div className="flex items-center bg-white/20 p-1.5 rounded-2xl border border-white/30 shrink-0 font-sans text-xs backdrop-blur-md shadow-inner">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
              stationKey === 'bharati'
                ? 'bg-white text-teal-800 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Bharati Station
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
              stationKey === 'maitri'
                ? 'bg-white text-teal-800 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Maitri Station
          </button>
        </div>
      </div>

      {/* Top Level 4 Status Cards Row (Exact style from reference image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Atmospheric Ambient Temperature */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Atmospheric Temperature</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {ambientTemp} <span className="text-sm font-semibold text-teal-600">Outdoor</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-full rounded-full" style={{ width: '68%' }} />
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sensor Status: OPTIMAL (AWS Calibrated)
          </span>
        </div>

        {/* Card 2: Surface Glacier Drift */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Permafrost & Glacier Drift</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {driftRate} <span className="text-sm font-semibold text-purple-600">Displacement</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full" style={{ width: '42%' }} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Bedrock Anchor Tilt: 0.08° (STABLE)
          </span>
        </div>

        {/* Card 3: Microgrid Power Load */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Microgrid Power Load</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-700 font-mono">
            {totalLoad} <span className="text-sm font-semibold text-slate-500">Active Load</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full" style={{ width: '64%' }} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Grid Frequency: 50.01 Hz | Phase A: 231 V
          </span>
        </div>

        {/* Card 4: Space Weather Riometer */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Ionospheric Riometer</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-700 font-mono">
            {riometerDb} <span className="text-sm font-semibold text-slate-500">Absorption</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-sky-500 h-full rounded-full" style={{ width: '35%' }} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Cosmic Noise: QUIET (0.4 dB Loss)
          </span>
        </div>

      </div>

      {/* Two-Column Section (Exact structure matching the attached image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 1. Live Raw Sensor Stream & In-Situ Parameters */}
        <div className="lg:col-span-7 bg-white border border-teal-100 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Gauge className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                1. Multi-Parameter In-Situ Sensor Telemetry
              </h2>
            </div>

            {/* Subtab Controls (Exact style from reference image) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setActiveSubTab('atmospheric')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  activeSubTab === 'atmospheric' ? 'bg-[#0f766e] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Atmospheric
              </button>
              <button
                onClick={() => setActiveSubTab('microgrid')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  activeSubTab === 'microgrid' ? 'bg-[#0f766e] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Microgrid
              </button>
              <button
                onClick={() => setActiveSubTab('riometer')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  activeSubTab === 'riometer' ? 'bg-[#0f766e] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Riometer
              </button>
              <button
                onClick={() => setActiveSubTab('geotechnical')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  activeSubTab === 'geotechnical' ? 'bg-[#0f766e] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Geotechnical
              </button>
            </div>
          </div>

          {/* Atmospheric Tab 2x2 Grid */}
          {activeSubTab === 'atmospheric' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1">
                <span className="text-slate-500 font-medium">AWS Wind Speed & Gust</span>
                <p className="text-2xl font-extrabold text-teal-800 font-mono">{windVelocity}</p>
                <p className="text-[11px] text-slate-500">Peak Gust: {isBharati ? '89.8 km/h (ESE)' : '72.4 km/h'}</p>
              </div>

              <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1">
                <span className="text-slate-500 font-medium">Barometric Station Pressure</span>
                <p className="text-2xl font-extrabold text-teal-800 font-mono">978.4 hPa</p>
                <p className="text-[11px] text-slate-500">Stable Polar Gradient | Dew Point: -28°C</p>
              </div>

              <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1">
                <span className="text-slate-500 font-medium">Snowpack Accumulation & Load</span>
                <p className="text-2xl font-extrabold text-teal-800 font-mono">188.4 cm</p>
                <p className="text-[11px] text-slate-500">Structural Snow Load: 310.2 kg/m²</p>
              </div>

              <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-1">
                <span className="text-slate-500 font-medium">Indoor Air Quality (HVAC Core)</span>
                <p className="text-2xl font-extrabold text-cyan-700 font-mono">398 ppm CO2</p>
                <p className="text-[11px] text-slate-500">PM2.5: 1.4 µg/m³ | VOC Index: 8 (Optimal)</p>
              </div>
            </div>
          )}

          {/* Microgrid Tab 2x2 Grid */}
          {activeSubTab === 'microgrid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-slate-500 font-medium">Diesel Cogeneration (CHP)</span>
                <p className="text-2xl font-extrabold text-amber-700 font-mono">{isBharati ? '390 kW' : '265 kW'}</p>
                <p className="text-[11px] text-slate-500">Volvo/Cummins Sets Operating in Parallel</p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-slate-500 font-medium">Renewable Solar PV & Wind</span>
                <p className="text-2xl font-extrabold text-amber-700 font-mono">{isBharati ? '100 kW' : '63.3 kW'}</p>
                <p className="text-[11px] text-slate-500">Solar PV Array + Micro Wind Turbines</p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-slate-500 font-medium">Polar ATF / Jet A-1 Reserves</span>
                <p className="text-2xl font-extrabold text-amber-700 font-mono">{isBharati ? '92,000 L' : '48,500 L'}</p>
                <p className="text-[11px] text-slate-500">Current Burn: {isBharati ? '38.2 L/h' : '24.5 L/h'}</p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-slate-500 font-medium">Grid Phase Voltage & Frequency</span>
                <p className="text-2xl font-extrabold text-amber-700 font-mono">231.0 V</p>
                <p className="text-[11px] text-slate-500">Frequency: 50.01 Hz | Breakers: NOMINAL</p>
              </div>
            </div>
          )}

          {/* Riometer Tab 2x2 Grid */}
          {activeSubTab === 'riometer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100 space-y-1">
                <span className="text-slate-500 font-medium">Cosmic Noise Absorption (38.2 MHz)</span>
                <p className="text-2xl font-extrabold text-cyan-700 font-mono">{riometerDb}</p>
                <p className="text-[11px] text-slate-500">Wide-Beam Riometer Antenna Array</p>
              </div>

              <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100 space-y-1">
                <span className="text-slate-500 font-medium">Solar Particle Radiation Flux</span>
                <p className="text-2xl font-extrabold text-cyan-700 font-mono">8.2 pfu</p>
                <p className="text-[11px] text-slate-500">Quiet Geomagnetic Baseline Condition</p>
              </div>

              <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100 space-y-1">
                <span className="text-slate-500 font-medium">SATCOM Signal Attenuation</span>
                <p className="text-2xl font-extrabold text-cyan-700 font-mono">-0.4 dB</p>
                <p className="text-[11px] text-slate-500">Polar VSAT Uplink Margin: 94%</p>
              </div>

              <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100 space-y-1">
                <span className="text-slate-500 font-medium">Ionospheric Flare State</span>
                <p className="text-2xl font-extrabold text-emerald-700 font-mono">QUIET</p>
                <p className="text-[11px] text-slate-500">Zero Blackout Threshold Triggered</p>
              </div>
            </div>
          )}

          {/* Geotechnical Tab 2x2 Grid */}
          {activeSubTab === 'geotechnical' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 font-medium">Surface GPS Glacier Drift</span>
                <p className="text-2xl font-extrabold text-purple-700 font-mono">{driftRate}</p>
                <p className="text-[11px] text-slate-500">Continental Ice Sheet Margin Vector</p>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 font-medium">Permafrost Foundation Tilt</span>
                <p className="text-2xl font-extrabold text-purple-700 font-mono">0.08°</p>
                <p className="text-[11px] text-slate-500">Bedrock Anchor Hydraulic Jack Sensors</p>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 font-medium">Stilt Pillar Strain Rating</span>
                <p className="text-2xl font-extrabold text-purple-700 font-mono">42.8%</p>
                <p className="text-[11px] text-slate-500">Within Nominal Safe Structural Bounds</p>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-1">
                <span className="text-slate-500 font-medium">Seismic Micro-Vibration RMS</span>
                <p className="text-2xl font-extrabold text-purple-700 font-mono">0.98 mm/s</p>
                <p className="text-[11px] text-slate-500">Triaxial Accelerometers (Under 2.5 mm/s)</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 2. Edge Serialization & Telemetry Gateway */}
        <div className="lg:col-span-5 bg-white border border-teal-100 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                2. Ingestion Gateway & Stream Transport
              </h2>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-200">
              100 Hz Raw
            </span>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-4 rounded-2xl border border-teal-100 space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">NCPOR Protobuf Binary Gateway</span>
              <span className="text-teal-700 font-extrabold font-mono bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                Live Stream
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Ingestion Pipeline Throughput</span>
                <span className="font-bold text-teal-800">100% Buffered</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 font-mono">
              <div className="flex justify-between">
                <span>Stream Protocol:</span>
                <span className="text-slate-900 font-semibold">Google Protocol Buffers (v3)</span>
              </div>
              <div className="flex justify-between">
                <span>Compression Savings:</span>
                <span className="text-teal-700 font-bold">82.4% vs JSON Payload</span>
              </div>
              <div className="flex justify-between">
                <span>Local Buffer Queue:</span>
                <span className="text-slate-900 font-semibold">0 Packets (Online Low-Latency)</span>
              </div>
              <div className="flex justify-between">
                <span>Ingestion Server:</span>
                <span className="text-slate-900 font-semibold">NCPOR Central Gateway (Goa)</span>
              </div>
            </div>
          </div>

          {/* Telemetry Snapshot Export Action (Exact style from reference image) */}
          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-sans text-slate-900 font-bold">In-Situ Telemetry Archive</span>
              <button
                onClick={handleExportSnapshot}
                disabled={exportStatus === 'exporting'}
                className={`px-3.5 py-1.5 font-sans text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  exportStatus === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : exportStatus === 'exporting'
                    ? 'bg-teal-400 text-white cursor-wait'
                    : 'bg-[#0f766e] hover:bg-teal-800 text-white shadow-teal-600/20'
                }`}
              >
                {exportStatus === 'exporting' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Snapshot...</span>
                  </>
                ) : exportStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Snapshot Exported Successfully!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Telemetry Snapshot</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 font-sans">
              {exportStatus === 'success' ? (
                <span className="text-emerald-700 font-medium font-sans">
                  ✓ Validated in-situ dataset CSV/JSON package archived for {stationData.stationName}.
                </span>
              ) : (
                'Generate a timestamped scientific dataset snapshot of all active sensor nodes for research analysis.'
              )}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
