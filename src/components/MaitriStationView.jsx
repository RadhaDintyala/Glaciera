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

export function MaitriStationView({ onSwitchStation }) {
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

  const [selectedLevel, setSelectedLevel] = useState('blockA'); // 'blockA' | 'blockB' | 'blockC' | 'lake' | 'site'
  const [activeSubsystem, setActiveSubsystem] = useState('microgrid'); // 'microgrid' | 'riometer' | 'lake' | 'madrid'

  const handleSwitchToBharati = () => {
    setActiveStation('bharati');
    if (onSwitchStation) {
      onSwitchStation('bharati');
    }
  };

  // Maitri live telemetry values from context / fallbacks
  const totalLoadKw = isBaseShutdown ? 0 : (telemetry?.maitri?.electricCircuits?.totalLoadKw ?? (isGridFaultActive ? 360.2 : 265.2));
  const riometerDb = telemetry?.maitri?.riometer?.absorptionDb || (isStormActive ? 4.85 : 1.84);
  const riometerStatus = telemetry?.maitri?.riometer?.solarFlareState || (isStormActive ? 'CRITICAL FLARE' : 'QUIET');
  const fuelReserve = telemetry?.maitri?.fuelStorage?.totalReserveLiters 
    ? `${telemetry.maitri.fuelStorage.totalReserveLiters.toLocaleString()} L` 
    : '48,500 L';
  const ambientTemp = telemetry?.maitri?.atmospheric?.ambientTemp !== undefined 
    ? `${telemetry.maitri.atmospheric.ambientTemp}°C` 
    : '-24.5°C';

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
                Maitri Station <span className="text-slate-400 font-mono text-base font-normal">| 3D Digital Twin & Operation Hub</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 tracking-wide uppercase">
                Active 3D Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Schirmacher Oasis, Queen Maud Land, East Antarctica | 70°45'S, 11°44'E | Lake Priyadarshini Ground Station
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Switch to Bharati Button */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">BMS: OPTIMAL</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-slate-300 font-medium">VSAT Uplink: 480 Mbps</span>
          </div>

          {/* Prominent Switch to Bharati Button */}
          <button
            onClick={handleSwitchToBharati}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181D26] hover:bg-[#1F2633] text-slate-200 hover:text-white border border-[#202632] hover:border-slate-700 font-sans font-medium text-xs shadow-sm transition-all cursor-pointer"
            title="Switch View to Bharati Antarctic Station 3D Digital Twin"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Switch to Bharati</span>
          </button>
        </div>
      </div>

      <ShutdownBanner station="Maitri" />

      {/* 3D WebGL Digital Twin Viewport Section */}
      <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#202632] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Maitri Aerodynamic Modular 3D Viewport & Area Inspector
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
              Maitri II Station Zonal Architecture & Modular Layout
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Select any station module to view layout telemetry
          </span>
        </div>

        {/* Area Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedLevel('blockA')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'blockA'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Block A: Upper Tier Living</span>
            <span className="text-[10px] text-slate-400">Cabins, Mess & Control</span>
          </button>

          <button
            onClick={() => setSelectedLevel('blockB')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'blockB'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Server className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Block B: Lower Tier Science</span>
            <span className="text-[10px] text-slate-400">18 Labs & Workstations</span>
          </button>

          <button
            onClick={() => setSelectedLevel('blockC')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'blockC'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Zap className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Block C: Generator & Wind</span>
            <span className="text-[10px] text-slate-400">Cummins DG & Wind Spine</span>
          </button>

          <button
            onClick={() => setSelectedLevel('lake')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all ${
              selectedLevel === 'lake'
                ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
                : 'bg-[#0B0D11] text-slate-400 border-[#202632] hover:text-white hover:border-slate-700'
            }`}
          >
            <Waves className="w-5 h-5 mb-1 text-slate-300" />
            <span className="text-xs font-semibold">Lake Priyadarshini Intake</span>
            <span className="text-[10px] text-slate-400">Freshwater Sub-Ice Pump</span>
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
            <span className="text-xs font-semibold">Oasis Ground & Depot</span>
            <span className="text-[10px] text-slate-400">Containers & Fuel Tanks</span>
          </button>
        </div>

        {/* Selected Zonal Details Box */}
        <div className="bg-[#0B0D11] border border-[#202632] p-5 rounded-xl space-y-3 font-mono">
          {selectedLevel === 'blockA' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> Block A: Upper Aerodynamic Module Living & Operations
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Houses crew living quarters, dining hall, galley kitchen, station commander desk, medical clinic, and a panoramic double-glazed end lounge overlooking Schirmacher Oasis permafrost.
              </p>
            </div>
          )}

          {selectedLevel === 'blockB' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" /> Block B: Lower Aerodynamic Science Superstructure
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Houses 18 specialized science laboratories including atmospheric physics, geomagnetism, environmental chemistry, glaciology research, and high-performance telemetry server racks.
              </p>
            </div>
          )}

          {selectedLevel === 'blockC' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-400" /> Block C: Service Block, Diesel Gensets & Wind Turbine Spine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Houses Cummins 250kW DG sets, twin thermal exhaust stacks, heat recovery exchangers, and twin vertical-axis wind turbines mounted on the module roof spine.
              </p>
            </div>
          )}

          {selectedLevel === 'lake' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Waves className="w-4 h-4 text-slate-400" /> Lake Priyadarshini Sub-Ice Freshwater Intake Station
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Pumps pristine freshwater from Lake Priyadarshini through 380 meters of trace-heated insulated conduits into the station's central filtration and reverse osmosis desalination plant.
              </p>
            </div>
          )}

          {selectedLevel === 'site' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-400" /> Schirmacher Oasis Container Depot & Polar Fuel Yard
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Surrounding the V-truss steel stilts are ISO shipping containers storing scientific drill rigs, snowcat spares, emergency rations, and 48,500 L of polar-grade Jet A-1 fuel.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Subsystem Telemetry Widgets Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#202632] pb-2">
        <button
          onClick={() => setActiveSubsystem('microgrid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'microgrid'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-400" />
          A. Microgrid & Wind Spine
        </button>

        <button
          onClick={() => setActiveSubsystem('riometer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'riometer'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Radio className="w-4 h-4 text-slate-400" />
          B. Cosmic Noise Riometer
        </button>

        <button
          onClick={() => setActiveSubsystem('lake')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            activeSubsystem === 'lake'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Waves className="w-4 h-4 text-slate-400" />
          C. Priyadarshini Hydronics
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
          D. Habitat & Waste Treatment
        </button>
      </div>

      {/* Telemetry Widgets */}
      {activeSubsystem === 'microgrid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Total Station Electrical Load</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white tracking-tight">{totalLoadKw} kW</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Cummins DG-1 & DG-2 coupled with 24.8 kW wind spine & 38.5 kW roof solar PV array.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Wind Spine Generation</span>
              <Wind className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-sky-400 tracking-tight">24.8 kW</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Vertical-axis wind turbines mounted on Service Block C spine operating under 28.4 knot gusts.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Fuel Reserves & Burn Rate</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">{fuelReserve}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Burn Rate: 24.5 L/hr | Projected Runtime: 82.5 Days remaining before resupply ship.
            </p>
          </div>
        </div>
      )}

      {activeSubsystem === 'riometer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Ionospheric Noise Absorption</span>
              <Radio className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white tracking-tight">{riometerDb} dB</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              38.2 MHz wide-beam riometer tracking solar particle flux & geomagnetic storm events.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Space Weather Flare Status</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400">{riometerStatus}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Satcom link degradation: 0.8 dB | Store-and-forward edge fallback ready.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">VSAT Terminal Link</span>
              <Gauge className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white tracking-tight">480 Mbps</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Dedicated polar satellite transceiver link connecting Maitri directly to NCPOR Goa.
            </p>
          </div>
        </div>
      )}

      {activeSubsystem === 'lake' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Priyadarshini Intake Temp</span>
              <Waves className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-sky-400 tracking-tight">+3.8°C</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Sub-ice freshwater intake maintaining continuous circulation via trace-heated conduits.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Potable Water Production</span>
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">11,500 L / day</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Filtration & Reverse Osmosis plant delivering pure drinking water to Block A.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Ambient Oasis Weather</span>
              <Wind className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-white tracking-tight">{ambientTemp}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Wind: 28.4 knots ESE | Barometric Pressure: 981.2 hPa | Permafrost: Stable.
            </p>
          </div>
        </div>
      )}

      {activeSubsystem === 'madrid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">MBR Waste Purity</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">99.4%</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Zero-discharge membrane bioreactor fully compliant with Madrid Protocol Antarctic Treaty.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">V-Stilts Structural Load</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl font-bold font-mono text-white">Steel Truss Secure</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              High-strength steel V-stilts anchor bolts & permafrost settlement: NOMINAL.
            </p>
          </div>

          <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase font-medium">Incinerator Status</span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400">ACTIVE CYCLE</p>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              High-temperature bio-waste incinerator with particulate scrubbers operational.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
