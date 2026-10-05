import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { TwinViewportCanvas } from './Layer5_DigitalTwin/TwinViewportCanvas';
import { RiskHeatMap2DChart } from './RiskHeatMap2DChart';
import { ShutdownBanner } from './ShutdownBanner';
import { 
  Zap, Radio, Thermometer, ShieldCheck, Flame, Cpu, Waves, Wind, 
  Database, Gauge, RefreshCw, Layers, CheckCircle2, AlertTriangle, ChevronRight, Activity, Box,
  MapPin, Sliders, Info, Sparkles, Building2, Truck, Server, RadioReceiver, ArrowRightLeft
} from 'lucide-react';

export function BharatiStationView({ onSwitchStation }) {
  const { 
    telemetry, 
    activeStation,
    setActiveStation,
    isStormActive, 
    isGridFaultActive,
    isBaseShutdown,
    isCutawayView,
    setIsCutawayView,
    isHeatmapActive,
    setIsHeatmapActive
  } = useTelemetry();

  const [selectedLevel, setSelectedLevel] = useState('level2'); // 'level1' | 'level2' | 'level3' | 'radome' | 'site'
  const [activeSubsystem, setActiveSubsystem] = useState('chp'); // 'chp' | 'satcom' | 'coastal' | 'madrid'

  const handleSwitchToMaitri = () => {
    setActiveStation('maitri');
    if (onSwitchStation) {
      onSwitchStation('maitri');
    }
  };

  // Bharati live telemetry values
  const chpEfficiency = isBaseShutdown ? 0 : (isGridFaultActive ? 68.4 : 94.2);
  const heatRecoveryTemp = isBaseShutdown ? 0 : (isGridFaultActive ? 52.1 : 84.5);
  const radomeStatus = isStormActive ? 'DE-ICING ACTIVE' : 'OPTIMAL TRACKING';
  const passThroughput = isStormActive ? '480 Mbps' : '1.24 Gbps';
  const fastIceThickness = '1.85 m';
  const roOutputLiters = 12450;
  const mbrPurity = 99.4;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F8FAFC] p-4 sm:p-6 max-w-[1700px] mx-auto space-y-6 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-slate-800/80 text-white border border-slate-700/60 shadow-sm">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Bharati Station <span className="text-slate-400 font-mono text-base font-normal">| 3D Digital Twin & Operation Hub</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 tracking-wide uppercase">
                Active 3D Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Larsemann Hills, Prydz Bay, East Antarctica | 69°24'S, 76°11'E | ISRO Earth Observation Ground Station
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Switch to Maitri Button */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">BMS: OPTIMAL</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-slate-300 font-medium">ISRO Downlink: {passThroughput}</span>
          </div>

          {/* Prominent Switch to Maitri Button (Clean Engineering Secondary Action) */}
          <button
            onClick={handleSwitchToMaitri}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181D26] hover:bg-[#1F2633] text-slate-200 hover:text-white border border-[#202632] hover:border-slate-700 font-sans font-medium text-xs shadow-sm transition-all cursor-pointer"
            title="Switch View to Maitri Antarctic Station 3D Digital Twin"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Switch to Maitri</span>
          </button>
        </div>
      </div>

      <ShutdownBanner station="Bharati" />

      {/* 3D WebGL Digital Twin Viewport Section */}
      <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#202632] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              3D Superstructure Viewport & Real-Time Area Inspector
            </h2>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCutawayView(!isCutawayView)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                isCutawayView
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'bg-[#0B0D11] text-slate-400 hover:text-white border border-[#202632]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {isCutawayView ? 'Cutaway View: ON' : 'Cutaway View: OFF'}
            </button>

            <button
              onClick={() => setIsHeatmapActive(!isHeatmapActive)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                isHeatmapActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'bg-[#0B0D11] text-slate-400 hover:text-white border border-[#202632]'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              {isHeatmapActive ? 'Thermal Heatmap: ON' : 'Thermal Heatmap: OFF'}
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas */}
        <div className="w-full rounded-xl overflow-hidden border border-[#202632] shadow-inner">
          <TwinViewportCanvas />
        </div>
      </section>

      {/* 2D Risk Heat Map Subsystem Matrix */}
      <RiskHeatMap2DChart />

      {/* Real Area Location Inspector Tabs */}
      <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#202632] pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Bharati Station Zonal Architecture & Facility Mapping
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Select any real area to view layout specifications
          </span>
        </div>

        {/* Area Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedLevel('level1')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'level1'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Truck className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Level 1: Garage & Power</span>
            <span className="text-[10px] text-slate-400">Gensets & Water Plant</span>
          </button>

          <button
            onClick={() => setSelectedLevel('level2')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'level2'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Level 2: Science & Living</span>
            <span className="text-[10px] text-slate-400">24 Cabins, Labs & Lounge</span>
          </button>

          <button
            onClick={() => setSelectedLevel('level3')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'level3'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Server className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Level 3: Operations Command</span>
            <span className="text-[10px] text-slate-400">Solar Array & AWS Mast</span>
          </button>

          <button
            onClick={() => setSelectedLevel('radome')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'radome'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <RadioReceiver className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Hilltop ISRO Radome</span>
            <span className="text-[10px] text-slate-400">Satellite Tracking Sphere</span>
          </button>

          <button
            onClick={() => setSelectedLevel('site')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'site'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Database className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Site & Depot</span>
            <span className="text-[10px] text-slate-400">Container Depot & Pipelines</span>
          </button>
        </div>

        {/* Selected Zonal Details Box */}
        <div className="bg-[#0B0D11] border border-[#202632] p-5 rounded-xl space-y-3 font-mono">
          {selectedLevel === 'level1' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-400" /> Level 1: Ground Floor Logistics & Power Infrastructure
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Houses the central double rollup door vehicle garage for PistenBully snowcats, 3 x Volvo Penta 280kW CHP Combined Heat & Power diesel generators, the Reverse Osmosis (RO) desalination plant (12,450 L/day output), and the Membrane Bioreactor (MBR) zero-discharge waste treatment system.
              </p>
            </div>
          )}

          {selectedLevel === 'level2' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> Level 2: First Floor Living & Research Superstructure
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Features 24 living cabins (*camarotes*), earth science and glaciology labs, atmospheric physics servers, dining hall, galley kitchen, medical operating theater, sauna, and a double-glazed panoramic observation lounge looking out over Prydz Bay.
              </p>
            </div>
          )}

          {selectedLevel === 'level3' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" /> Level 3: Penthouse Control Room & Weather Deck
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Houses the Station Commander operations desk, Building Management System (BMS) telemetry consoles, roof photovoltaic solar panel array, and the Automatic Weather Station (AWS) meteorological mast measuring wind speeds up to 200 km/h.
              </p>
            </div>
          )}

          {selectedLevel === 'radome' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <RadioReceiver className="w-4 h-4 text-slate-400" /> Hilltop ISRO SATCOM Earth Observation Ground Station
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                A 3.5m white translucent geodesic fiberglass radome sphere situated on the rocky ridge behind the station. Contains an automated dual-axis satellite dish tracking Cartosat-3, Oceansat-2, and EOS satellite passes, directly downlinking high-throughput telemetry to NRSC Shadnagar and NCPOR Goa.
              </p>
            </div>
          )}

          {selectedLevel === 'site' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" /> Larsemann Hills Site Layout & Container Logistics Yard
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Surrounding the main stilt-supported building are colorful 20ft/40ft shipping container pods (Hapag-Lloyd orange, Maersk blue, Evergreen green, EXIM red) used for cold storage and expedition equipment, alongside trace-heated hydronic pipelines running from Lake Astrid to the desalination intake.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Subsystem Telemetry Widgets Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#202632] pb-2">
        <button
          onClick={() => setActiveSubsystem('chp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'chp'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-400" />
          A. Microgrid & CHP Telemetry
        </button>

        <button
          onClick={() => setActiveSubsystem('satcom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'satcom'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Radio className="w-4 h-4 text-slate-400" />
          B. ISRO Satellite Ground Station
        </button>

        <button
          onClick={() => setActiveSubsystem('coastal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'coastal'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Waves className="w-4 h-4 text-slate-400" />
          C. Coastal Prydz Bay Environmental
        </button>

        <button
          onClick={() => setActiveSubsystem('madrid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'madrid'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          D. Madrid Protocol & Habitat
        </button>
      </div>

      {/* Telemetry Widgets */}
      {activeSubsystem === 'chp' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">CHP Cogeneration Efficiency</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">{chpEfficiency}%</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              3 x Volvo Penta 280kW CHP units converting thermal exhaust into hydronic floor heating.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">Hydronic Coolant Temp</span>
              <Thermometer className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">{heatRecoveryTemp}°C</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              HVAC Air Handling Unit (AHU) recovery maintaining +21.5°C indoor room gradient.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">Arctic Fuel Reserves</span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">184,200 L</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Daily Burn: 640 L/day | Projected Runtime: 287 Days without refueling.
            </p>
          </div>
        </div>
      )}

      {activeSubsystem === 'satcom' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">ISRO Radome Tracking Status</span>
              <Radio className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl font-bold font-mono text-white">{radomeStatus}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Azimuth: 142.8° | Elevation: 48.2° | Automatic de-icing system operational.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">Pass Throughput & Downlink</span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">{passThroughput}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Cartosat-3 / Oceansat-2 earth observation pass downlink to NRSC & NCPOR.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">VSAT Bandwidth</span>
              <Gauge className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">640 ms RTT</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Dedicated polar VSAT uplink with store-and-forward edge fallback.
            </p>
          </div>
        </div>
      )}

      {activeSubsystem === 'coastal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">Prydz Bay Ice Thickness</span>
              <Waves className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">{fastIceThickness}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Coastal acoustic sonar monitoring sea ice thickness & SST (-1.8°C).
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">RO Desalination Output</span>
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400">{roOutputLiters.toLocaleString()} L/day</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Reverse Osmosis plant with trace-heated intake pipeline delivering potable water.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">AWS Weather Station</span>
              <Wind className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white">-24.8°C</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Wind: 22 knots ESE | Barometric Pressure: 988 hPa | Chill: -38°C.
            </p>
          </div>
        </div>
      )}

      {activeSubsystem === 'madrid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">MBR Effluent Purity</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400">{mbrPurity}%</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Membrane Bioreactor zero-discharge plant compliant with Madrid Protocol.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">Structural Integrity</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl font-bold font-mono text-white">Stilts Load Normal</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Hydraulic leveling jacks & hermetic door seals: SECURE.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-semibold">Fire Suppression</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400">SYSTEM ARMED</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Automated aerosol fire suppression canister network: 0 Incidents.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
