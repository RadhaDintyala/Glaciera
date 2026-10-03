import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Radio, Box, Monitor, Activity, ShieldAlert, Wind, Zap, ShoppingBag, Cpu, UserCheck } from 'lucide-react';

export function Navbar({ activePage, setActivePage }) {
  const {
    isStormActive,
    setIsStormActive,
    isGridFaultActive,
    setIsGridFaultActive,
    activeStation,
    setActiveStation,
    activeRole,
    setActiveRole
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
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
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
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-sans">
                Glaciera
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                MoES / NCPOR SIH26060
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 hidden xl:block">
              Indian Antarctic Remote Operations Platform
            </p>
          </div>
        </div>

        {/* Unified Navigation Bar Links (Includes all 4 SIH26060 Modules) */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800 backdrop-blur-md overflow-x-auto text-xs font-mono font-semibold">
          {/* Overview */}
          <button
            onClick={() => handleNavClick('overview')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activePage === 'overview'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>

          {/* Module 1: 3D Twin (Bharati) */}
          <button
            onClick={() => handleNavClick('bharati')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activePage === 'bharati'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            M1: 3D Twin
          </button>

          {/* Module 1: 2D/3D (Maitri) */}
          <button
            onClick={() => handleNavClick('maitri')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activePage === 'maitri'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            Maitri Station
          </button>

          {/* Module 2: Energy & Microgrid */}
          <button
            onClick={() => handleNavClick('energy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activePage === 'energy'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            M2: Microgrid
          </button>

          {/* Module 3: Inventory & Life Support */}
          <button
            onClick={() => handleNavClick('logistics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activePage === 'logistics'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            M3: Logistics
          </button>

          {/* Module 4: Low-BW Sync & AI Maintenance */}
          <button
            onClick={() => handleNavClick('maintenance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activePage === 'maintenance'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            M4: Sync & AI
          </button>

          {/* Monitoring & Edge */}
          <button
            onClick={() => handleNavClick('monitoring')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activePage === 'monitoring'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Edge SATCOM
          </button>

          {/* Data */}
          <button
            onClick={() => handleNavClick('data')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activePage === 'data'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            In-Situ Stream
          </button>
        </nav>

        {/* Right Action & RBAC Role Switcher */}
        <div className="flex items-center gap-2 shrink-0 font-mono">
          
          {/* Role selector dropdown badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="COMMANDER" className="bg-slate-900 text-white">Role: Station Commander</option>
              <option value="TECHNICIAN" className="bg-slate-900 text-white">Role: Maintenance Technician</option>
              <option value="SCIENTIST" className="bg-slate-900 text-white">Role: Mainland Scientist</option>
              <option value="MINISTRY" className="bg-slate-900 text-white">Role: Ministry Administrator</option>
            </select>
          </div>

          <button
            onClick={() => setIsStormActive(!isStormActive)}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
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
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
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
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide border transition-all backdrop-blur-md shadow-lg ${
              activePage === 'console'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-cyan-500/30'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-white/40'
            }`}
          >
            Console
          </button>
        </div>
      </div>
    </header>
  );
}
