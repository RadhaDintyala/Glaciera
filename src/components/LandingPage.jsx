import React, { useState } from 'react';
import heroImg from '../assets/hero.jpg';
import { useTelemetry } from '../context/TelemetryContext';
import { 
  Box, ShieldCheck, Zap, Radio, Thermometer, Wind, MapPin, 
  ArrowRight, Layers, Cpu, Server, Activity, Database, Waves, 
  Sparkles, CheckCircle2, RefreshCw, BarChart3, Globe, Compass, 
  ChevronRight, ArrowRightLeft, Eye, Flame, ShieldAlert
} from 'lucide-react';

export function LandingHeroContent({ onNavigate }) {
  const { telemetry, setActiveStation } = useTelemetry();
  const [hoveredCard, setHoveredCard] = useState(null);

  const maitriTemp = telemetry?.maitri?.atmospheric?.ambientTemp !== undefined 
    ? `${Math.round(telemetry.maitri.atmospheric.ambientTemp)}°C` 
    : '-24°C';
    
  const bharatiWind = telemetry?.bharati?.aws?.windSpeedKmh !== undefined 
    ? `${Math.round(telemetry.bharati.aws.windSpeedKmh / 3.6)} m/s` 
    : '18 m/s';

  const handleLaunchStation = (stationKey) => {
    setActiveStation(stationKey);
    if (onNavigate) {
      onNavigate(stationKey);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F8FAFC] font-sans select-none overflow-x-hidden">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. HERO SECTION WITH IMAGE OVERLAY & CLEAN CALIBRATED SURFACES     */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden border-b border-[#202632]">
        
        {/* Background Image with Dark Neutral Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Glaciera Antarctic Station Hero"
            className="w-full h-full object-cover object-center scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D11]/90 via-[#0B0D11]/70 to-[#0B0D11]" />
        </div>

        {/* Hero Top Live Status Ticker */}
        <div className="relative z-10 max-w-[1700px] w-full mx-auto px-6 pt-6 flex flex-wrap items-center justify-end gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-[#12161D]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#202632]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SATCOM Link: OPTIMAL
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-slate-400" /> Edge Gateway: ACTIVE
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> Dual Station Telemetry
            </span>
          </div>
        </div>

        {/* Main Hero Central Typography & Launch CTAs */}
        <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center my-auto space-y-6">
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans leading-tight">
              Monitor the Extreme.{' '}
              <span className="block text-slate-400 font-normal">
                Antarctic Operations Redefined.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-normal max-w-3xl mx-auto leading-relaxed font-sans">
              Next-generation 3D WebGL Digital Twin & Real-time Telemetry Platform for India's polar research stations — <span className="text-slate-100 font-medium">Bharati (Larsemann Hills)</span> and <span className="text-slate-100 font-medium">Maitri (Schirmacher Oasis)</span>.
            </p>
          </div>

          {/* Interactive Action Buttons (Single Accent + Demoted Outline Companion) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunchStation('bharati')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all shadow-sm border border-white/20 cursor-pointer"
            >
              <Box className="w-4 h-4 text-slate-800" />
              <span>Launch Bharati 3D Twin</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleLaunchStation('maitri')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#181D26] text-slate-200 font-medium text-sm border border-[#202632] hover:bg-[#1F2633] hover:text-white transition-all cursor-pointer"
            >
              <Box className="w-4 h-4 text-slate-400" />
              <span>Launch Maitri 3D Twin</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <a
              href="#features-section"
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-transparent border border-[#202632] hover:border-slate-700 text-slate-400 hover:text-white font-medium text-sm transition-all"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Explore Platform Features</span>
            </a>
          </div>

        </main>

        {/* Hero Telemetry Live Stream Bar Overlay */}
        <footer className="relative z-20 w-full max-w-[1700px] mx-auto px-6 pb-8 pt-4">
          <div className="bg-[#12161D]/90 border border-[#202632] rounded-2xl p-4 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-bold tracking-wide font-mono uppercase">
                Glaciera Telemetry Live Stream
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 font-mono">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Coordinates</span>
                  <span className="text-sm sm:text-base font-semibold text-white">69°24'S, 76°11'E</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Maitri Ambient</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{maitriTemp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Bharati Wind</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{bharatiWind}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">ISRO Downlink</span>
                  <span className="text-sm sm:text-base font-semibold text-white">1.24 Gbps</span>
                </div>
              </div>
            </div>

          </div>
        </footer>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. DUAL STATION QUICK SELECT CARDS SHOWCASE                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 max-w-[1700px] mx-auto space-y-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-[#12161D] text-slate-400 border border-[#202632] uppercase tracking-widest">
            Dual Antarctic Research Hubs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
            Integrated Station Digital Twins
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Monitor real-time structural health, CHP cogeneration microgrids, space weather absorption, and logistics across India's two active Antarctic stations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Bharati Station Card */}
          <div 
            onClick={() => handleLaunchStation('bharati')}
            className="group relative bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 sm:p-8 backdrop-blur-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 shadow-sm">
                  <Box className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ONLINE | 3D TWIN LIVE
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white font-sans group-hover:text-slate-200 transition-colors">
                    Bharati Research Station
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Est. 2012</span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Larsemann Hills, Prydz Bay, East Antarctica | 69°24'S, 76°11'E
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Features a stilt-supported 3-level aerodynamic superstructure crafted from 134 shipping containers. Equipped with 3 x Volvo Penta 280kW CHP microgrid generators, reverse osmosis desalination, and an ISRO Earth Observation Ground Station radome.
              </p>

              {/* Station Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                <div className="bg-[#0B0D11] p-3 rounded-xl border border-[#202632]">
                  <span className="text-[10px] text-slate-500 uppercase block">Elevation</span>
                  <span className="text-sm font-semibold text-white">35 Meters</span>
                </div>
                <div className="bg-[#0B0D11] p-3 rounded-xl border border-[#202632]">
                  <span className="text-[10px] text-slate-500 uppercase block">Max Occupancy</span>
                  <span className="text-sm font-semibold text-white">47 Personnel</span>
                </div>
                <div className="bg-[#0B0D11] p-3 rounded-xl border border-[#202632]">
                  <span className="text-[10px] text-slate-500 uppercase block">ISRO Downlink</span>
                  <span className="text-sm font-semibold text-emerald-400">1.24 Gbps</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-[#202632] mt-6">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1 group-hover:text-white transition-colors font-medium">
                Launch 3D WebGL Digital Twin &rarr;
              </span>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors border border-slate-700/60">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Maitri Station Card */}
          <div 
            onClick={() => handleLaunchStation('maitri')}
            className="group relative bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 sm:p-8 backdrop-blur-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 shadow-sm">
                  <Box className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ONLINE | NEXT-GEN TWIN LIVE
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white font-sans group-hover:text-slate-200 transition-colors">
                    Maitri Research Station
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Est. 1989</span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Schirmacher Oasis, Queen Maud Land, East Antarctica | 70°45'S, 11°44'E
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Next-Gen aerodynamic dual-tier module architecture built over rocky Oasis permafrost. Connected to Lake Priyadarshini sub-ice freshwater intake, high-strength V-truss stilts, dual wind turbine spine, and cosmic noise riometer array.
              </p>

              {/* Station Quick Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                <div className="bg-[#0B0D11] p-3 rounded-xl border border-[#202632]">
                  <span className="text-[10px] text-slate-500 uppercase block">Elevation</span>
                  <span className="text-sm font-semibold text-white">117 Meters</span>
                </div>
                <div className="bg-[#0B0D11] p-3 rounded-xl border border-[#202632]">
                  <span className="text-[10px] text-slate-500 uppercase block">Water Source</span>
                  <span className="text-sm font-semibold text-white">Priyadarshini Lake</span>
                </div>
                <div className="bg-[#0B0D11] p-3 rounded-xl border border-[#202632]">
                  <span className="text-[10px] text-slate-500 uppercase block">Space Weather</span>
                  <span className="text-sm font-semibold text-emerald-400">1.84 dB Riometer</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-[#202632] mt-6">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1 group-hover:text-white transition-colors font-medium">
                Launch 3D WebGL Digital Twin &rarr;
              </span>
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors border border-slate-700/60">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. CORE SYSTEM FEATURES GRID SECTION (#features-section)           */}
      {/* ------------------------------------------------------------------ */}
      <section id="features-section" className="py-16 px-6 max-w-[1700px] mx-auto space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-[#12161D] text-slate-400 border border-[#202632] uppercase tracking-widest">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
            Engineered for Polar Survivability
          </h2>
          <p className="text-slate-400 text-base leading-relaxed font-sans">
            A comprehensive suite of remote operations, predictive telemetry, low-bandwidth satellite synchronization, and 3D digital twin monitoring designed for severe sub-zero environments.
          </p>
        </div>

        {/* Feature Cards Grid (Clean Engineering Grade) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div 
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all duration-200 space-y-4 hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center group-hover:text-white transition-colors">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              3D WebGL Digital Twin Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Interactive 3D structural canvas rendering full CAD-grade station geometry, cutaway floor inspections, thermal heatmap overlays, and mesh click telemetry diagnostics.
            </p>
            <ul className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Level-by-Level Cutaway Floor Inspector
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Live Ground Thermal Heatmap Layers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Blizzard Particle Physics Simulation
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div 
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all duration-200 space-y-4 hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Edge Gateway & Compression
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              On-station Linux edge daemon compressing raw sensor streams using Google Protocol Buffers (Protobuf) to minimize expensive satellite throughput.
            </p>
            <ul className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                82.4% Protobuf Payload Compression Ratio
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Local Memory Queue During Polar Blackout
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Automatic Resuming Store-and-Forward
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div 
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all duration-200 space-y-4 hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center group-hover:text-white transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Microgrid & Energy Telemetry
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Combined Heat & Power (CHP) cogeneration monitoring, diesel generator fuel burn rate analytics, solar PV arrays, and automated smart load shedding.
            </p>
            <ul className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                CHP Thermal Exhaust Hydronic Recovery
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Projected Fuel Runtime Days Counter
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Remote Load Shedding Breaker Control
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div 
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all duration-200 space-y-4 hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center group-hover:text-white transition-colors">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              ISRO SATCOM Ground Station
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Hilltop geodesic radome telemetry downlinking Cartosat-3 and Oceansat-2 earth observation satellite passes directly to NRSC Shadnagar and NCPOR Goa.
            </p>
            <ul className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Automatic De-Icing Thermal Shroud
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Dual-Axis Azimuth & Elevation Tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                1.24 Gbps Direct Pass Downlink
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div 
            onMouseEnter={() => setHoveredCard(5)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all duration-200 space-y-4 hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center group-hover:text-white transition-colors">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Logistics & Life Support
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Tracking ISO shipping container pods, emergency medical trauma supplies, freeze-dried rations, and MV Vasiliy Golovnin expedition ship resupply ETA.
            </p>
            <ul className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Reverse Osmosis Desalination Tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Madrid Protocol Effluent Zero-Discharge
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Expedition Ship Cargo & ETA Countdown
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div 
            onMouseEnter={() => setHoveredCard(6)}
            onMouseLeave={() => setHoveredCard(null)}
            className="bg-[#12161D] border border-[#202632] hover:border-slate-700 rounded-2xl p-6 backdrop-blur-md transition-all duration-200 space-y-4 hover:shadow-lg hover:shadow-black/20 group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center group-hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white font-sans">
              Space Weather & Riometer
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Ionospheric cosmic noise absorption monitoring (dB), solar flare degradation alert system, and geomagnetic field vector visualization.
            </p>
            <ul className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Cosmic Noise Absorption (38.2 MHz)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Solar Particle Flux Anomaly Trigger
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Automated Fallback to Local Edge Queue
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. SYSTEM ARCHITECTURE 5-LAYER STACK DIAGRAM                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 max-w-[1700px] mx-auto">
        <div className="bg-[#12161D] border border-[#202632] rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-xl space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#202632] pb-6">
            <div>
              <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-widest block">
                End-to-End System Pipeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans mt-1">
                Glaciera 5-Layer Operational Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono max-w-md">
              From polar in-situ sensors through Protobuf edge encryption and VSAT satellite transport to the WebGL 3D Twin.
            </p>
          </div>

          {/* Visual Architecture Steps Grid (Geometric Hairline Rhythm) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="bg-[#0B0D11] p-5 rounded-2xl border border-[#202632] flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">LAYER 1</span>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">In-Situ Datasets</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">AWS Weather, CHP Sensors, Sonar Ice, Riometer</p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-1 rounded w-fit border border-slate-700/50">
                100 Hz Raw Sampling
              </span>
            </div>

            <div className="bg-[#0B0D11] p-5 rounded-2xl border border-[#202632] flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">LAYER 2</span>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Edge Gateway</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Protobuf Binary Serialization & Ring Buffer</p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-1 rounded w-fit border border-slate-700/50">
                82% Size Reduction
              </span>
            </div>

            <div className="bg-[#0B0D11] p-5 rounded-2xl border border-[#202632] flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">LAYER 3</span>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">SATCOM Transport</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Store-and-Forward VSAT Link to Ground Station</p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-1 rounded w-fit border border-slate-700/50">
                1.24 Gbps ISRO Downlink
              </span>
            </div>

            <div className="bg-[#0B0D11] p-5 rounded-2xl border border-[#202632] flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">LAYER 4</span>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">Cloud Ingestion</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">NCPOR Central Gateway & WebSocket Server</p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-1 rounded w-fit border border-slate-700/50">
                Real-Time Broadcast
              </span>
            </div>

            <div className="bg-[#0B0D11] p-5 rounded-2xl border border-[#202632] flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">LAYER 5</span>
              <div>
                <h4 className="text-sm font-bold text-white font-sans">3D Digital Twin</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">WebGL Viewport, Cutaway & Mission Control</p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-1 rounded w-fit border border-slate-700/50">
                Interactive Telemetry
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-8 border-t border-[#202632] text-center text-xs text-slate-500 font-mono">
        <p>Glaciera | Indian Antarctic Remote Operations Platform | NCPOR / MoES India</p>
      </footer>

    </div>
  );
}
