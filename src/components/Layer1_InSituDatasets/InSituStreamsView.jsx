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
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans bg-[#0B0D11] min-h-screen text-[#F8FAFC]">
      
      {/* Title Header Banner */}
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-6 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632]">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                In-Situ Datasets & Environmental Streams
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#181D26] text-slate-300 border border-[#202632] tracking-wider uppercase">
                Live Sensor Telemetry
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Raw Physical Sensors Stream, Atmospheric Weather, Microgrid & Space Weather Ingestion for {stationData.stationName}
            </p>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center bg-[#0B0D11] p-1 rounded-xl border border-[#202632] shrink-0 font-sans text-xs">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              stationKey === 'bharati'
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bharati Station
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              stationKey === 'maitri'
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maitri Station
          </button>
        </div>
      </div>

      {/* Top Level 4 Status Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Atmospheric Ambient Temperature */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Atmospheric Temperature</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-sky-400 border border-[#202632]">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {ambientTemp} <span className="text-sm font-medium text-slate-400">Outdoor</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '68%' }} />
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sensor Status: OPTIMAL (AWS Calibrated)
          </span>
        </div>

        {/* Card 2: Surface Glacier Drift */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Permafrost & Glacier Drift</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-slate-400 border border-[#202632]">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {driftRate} <span className="text-sm font-medium text-slate-400">Displacement</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '42%' }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Bedrock Anchor Tilt: 0.08° (STABLE)
          </span>
        </div>

        {/* Card 3: Microgrid Power Load */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Microgrid Power Load</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-amber-400 border border-[#202632]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {totalLoad} <span className="text-sm font-medium text-slate-400">Active Load</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '64%' }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Grid Frequency: 50.01 Hz | Phase A: 231 V
          </span>
        </div>

        {/* Card 4: Space Weather Riometer */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Ionospheric Riometer</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-sky-400 border border-[#202632]">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-sky-400 font-mono tracking-tight">
            {riometerDb} <span className="text-sm font-medium text-slate-400">Absorption</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '35%' }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Cosmic Noise: QUIET (0.4 dB Loss)
          </span>
        </div>

      </div>

      {/* Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 1. Live Raw Sensor Stream & In-Situ Parameters */}
        <div className="lg:col-span-7 bg-[#12161D] border border-[#202632] rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#202632] pb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632]">
                <Gauge className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white font-sans tracking-tight">
                1. Multi-Parameter In-Situ Sensor Telemetry
              </h2>
            </div>

            {/* Subtab Controls */}
            <div className="flex items-center bg-[#0B0D11] p-1 rounded-xl border border-[#202632] text-xs font-medium">
              <button
                onClick={() => setActiveSubTab('atmospheric')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'atmospheric' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Atmospheric
              </button>
              <button
                onClick={() => setActiveSubTab('microgrid')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'microgrid' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Microgrid
              </button>
              <button
                onClick={() => setActiveSubTab('riometer')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'riometer' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Riometer
              </button>
              <button
                onClick={() => setActiveSubTab('geotechnical')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeSubTab === 'geotechnical' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Geotechnical
              </button>
            </div>
          </div>

          {/* Atmospheric Tab 2x2 Grid */}
          {activeSubTab === 'atmospheric' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">AWS Wind Speed & Gust</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{windVelocity}</p>
                <p className="text-[11px] text-slate-400">Peak Gust: {isBharati ? '89.8 km/h (ESE)' : '72.4 km/h'}</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Barometric Station Pressure</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">978.4 hPa</p>
                <p className="text-[11px] text-slate-400">Stable Polar Gradient | Dew Point: -28°C</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Snowpack Accumulation & Load</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">188.4 cm</p>
                <p className="text-[11px] text-slate-400">Structural Snow Load: 310.2 kg/m²</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Indoor Air Quality (HVAC Core)</span>
                <p className="text-2xl font-bold text-sky-400 font-mono tracking-tight">398 ppm CO2</p>
                <p className="text-[11px] text-slate-400">PM2.5: 1.4 µg/m³ | VOC Index: 8 (Optimal)</p>
              </div>
            </div>
          )}

          {/* Microgrid Tab 2x2 Grid */}
          {activeSubTab === 'microgrid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Diesel Cogeneration (CHP)</span>
                <p className="text-2xl font-bold text-amber-400 font-mono tracking-tight">{isBharati ? '390 kW' : '265 kW'}</p>
                <p className="text-[11px] text-slate-400">Volvo/Cummins Sets Operating in Parallel</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Renewable Solar PV & Wind</span>
                <p className="text-2xl font-bold text-sky-400 font-mono tracking-tight">{isBharati ? '100 kW' : '63.3 kW'}</p>
                <p className="text-[11px] text-slate-400">Solar PV Array + Micro Wind Turbines</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Polar ATF / Jet A-1 Reserves</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{isBharati ? '92,000 L' : '48,500 L'}</p>
                <p className="text-[11px] text-slate-400">Current Burn: {isBharati ? '38.2 L/h' : '24.5 L/h'}</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Grid Phase Voltage & Frequency</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">231.0 V</p>
                <p className="text-[11px] text-slate-400">Frequency: 50.01 Hz | Breakers: NOMINAL</p>
              </div>
            </div>
          )}

          {/* Riometer Tab 2x2 Grid */}
          {activeSubTab === 'riometer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Cosmic Noise Absorption (38.2 MHz)</span>
                <p className="text-2xl font-bold text-sky-400 font-mono tracking-tight">{riometerDb}</p>
                <p className="text-[11px] text-slate-400">Wide-Beam Riometer Antenna Array</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Solar Particle Radiation Flux</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">8.2 pfu</p>
                <p className="text-[11px] text-slate-400">Quiet Geomagnetic Baseline Condition</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">SATCOM Signal Attenuation</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">-0.4 dB</p>
                <p className="text-[11px] text-slate-400">Polar VSAT Uplink Margin: 94%</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Ionospheric Flare State</span>
                <p className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">QUIET</p>
                <p className="text-[11px] text-slate-400">Zero Blackout Threshold Triggered</p>
              </div>
            </div>
          )}

          {/* Geotechnical Tab 2x2 Grid */}
          {activeSubTab === 'geotechnical' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Surface GPS Glacier Drift</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{driftRate}</p>
                <p className="text-[11px] text-slate-400">Continental Ice Sheet Margin Vector</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Permafrost Foundation Tilt</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">0.08°</p>
                <p className="text-[11px] text-slate-400">Bedrock Anchor Hydraulic Jack Sensors</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Stilt Pillar Strain Rating</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">42.8%</p>
                <p className="text-[11px] text-slate-400">Within Nominal Safe Structural Bounds</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Seismic Micro-Vibration RMS</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">0.98 mm/s</p>
                <p className="text-[11px] text-slate-400">Triaxial Accelerometers (Under 2.5 mm/s)</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 2. Edge Serialization & Telemetry Gateway */}
        <div className="lg:col-span-5 bg-[#12161D] border border-[#202632] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#202632] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632]">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white font-sans tracking-tight">
                2. Ingestion Gateway & Stream Transport
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#181D26] text-slate-300 font-medium border border-[#202632]">
              100 Hz Raw
            </span>
          </div>

          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white text-sm">NCPOR Protobuf Binary Gateway</span>
              <span className="text-emerald-400 font-bold font-mono bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live Stream
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Ingestion Pipeline Throughput</span>
                <span className="font-bold text-white">100% Buffered</span>
              </div>
              <div className="w-full bg-[#0B0D11] rounded-full h-2 overflow-hidden border border-[#202632]">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-[#202632] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Stream Protocol:</span>
                <span className="text-white font-medium">Google Protocol Buffers (v3)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compression Savings:</span>
                <span className="text-sky-400 font-medium">82.4% vs JSON Payload</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Local Buffer Queue:</span>
                <span className="text-white font-medium">0 Packets (Online Low-Latency)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ingestion Server:</span>
                <span className="text-white font-medium">NCPOR Central Gateway (Goa)</span>
              </div>
            </div>
          </div>

          {/* Telemetry Snapshot Export Action */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-sans text-slate-300 font-medium">In-Situ Telemetry Archive</span>
              <button
                onClick={handleExportSnapshot}
                disabled={exportStatus === 'exporting'}
                className={`px-3.5 py-1.5 font-sans text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  exportStatus === 'success'
                    ? 'bg-emerald-600 text-white'
                    : exportStatus === 'exporting'
                    ? 'bg-neutral-700 text-neutral-400 cursor-wait'
                    : 'bg-white text-neutral-950 hover:bg-neutral-200'
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
            <p className="text-[11px] text-slate-400 font-sans">
              {exportStatus === 'success' ? (
                <span className="text-emerald-400 font-medium font-sans">
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
