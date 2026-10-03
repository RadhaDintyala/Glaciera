import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Radio, Box, Monitor, Activity, ShieldAlert, Wind, Zap, Layers, ChevronRight } from 'lucide-react';

export function Navbar({ activePage, setActivePage }) {
  const {
    isStormActive,
    setIsStormActive,
    isGridFaultActive,
    setIsGridFaultActive,
    activeStation,
    setActiveStation
  } = useTelemetry();

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (pageId === 'bharati') {
      setActiveStation('bharati');
    } else if (pageId === 'maitri') {
      setActiveStation('maitri');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Platform Name */}
        <div 
          onClick={() => handleNavClick('overview')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full rounded-[10px] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center border border-cyan-400/30">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-sans">
                Glaciera
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
              NCPOR Antarctic Station Digital Twin
            </p>
          </div>
        </div>

        {/* Unified Navigation Bar Links */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/60 p-1 rounded-full border border-slate-800 backdrop-blur-md overflow-x-auto">
          {/* Overview */}
          <button
            onClick={() => handleNavClick('overview')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activePage === 'overview'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>

          {/* Bharati Station */}
          <button
            onClick={() => handleNavClick('bharati')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activePage === 'bharati'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            Bharati Station
            <span className="hidden lg:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              3D Twin
            </span>
          </button>

          {/* Maitri Station */}
          <button
            onClick={() => handleNavClick('maitri')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activePage === 'maitri'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            Maitri Station
            <span className="hidden lg:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
              2D Telemetry
            </span>
          </button>

          {/* Monitoring */}
          <button
            onClick={() => handleNavClick('monitoring')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activePage === 'monitoring'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Monitoring
          </button>

          {/* Data */}
          <button
            onClick={() => handleNavClick('data')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activePage === 'data'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Data
          </button>
        </nav>

        {/* Right Console CTA & Simulation Toggles - Shown ONLY when inside 3D models / station views */}
        {activePage !== 'overview' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsStormActive(!isStormActive)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                isStormActive
                  ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title="Toggle Blizzard Simulation"
            >
              <Wind className="w-3.5 h-3.5 text-blue-400" />
              Blizzard
            </button>

            <button
              onClick={() => setIsGridFaultActive(!isGridFaultActive)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                isGridFaultActive
                  ? 'bg-rose-600 text-white border-rose-400 animate-bounce'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
              title="Toggle Grid Fault Simulation"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Grid Fault
            </button>

            <button
              onClick={() => handleNavClick('console')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all backdrop-blur-md shadow-lg ${
                activePage === 'console'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-cyan-500/30'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-white/40'
              }`}
            >
              Launch Console
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
