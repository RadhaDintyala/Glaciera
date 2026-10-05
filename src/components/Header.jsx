import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity, Radio, ShieldAlert, Zap, Wind, Eye, Home } from 'lucide-react';

export function Header({ onBackToLanding }) {
  const {
    activeStation,
    setActiveStation,
    satcomStatus,
    payloadMetrics,
    isStormActive,
    setIsStormActive,
    isGridFaultActive,
    setIsGridFaultActive,
    isManualBlackout,
    setIsManualBlackout,
    isCutawayView,
    setIsCutawayView,
    isHeatmapActive,
    setIsHeatmapActive
  } = useTelemetry();

  return (
    <header className="bg-[#0B0D11]/90 border-b border-[#202632] backdrop-blur-md px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Organization Brand */}
        <div className="flex items-center gap-3.5">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181D26] hover:bg-[#1F2633] text-slate-200 border border-[#202632] text-xs font-medium transition-all shadow-sm cursor-pointer"
              title="Return to Glaciera Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              Overview
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632] flex items-center justify-center shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 font-sans">
              ANTARCTICA DIGITAL TWIN PLATFORM
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#181D26] text-slate-300 border border-[#202632]">
                SIH26060
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              National Centre for Polar and Ocean Research (NCPOR) | MoES India
            </p>
          </div>
        </div>

        {/* Dual Station Switcher Toggle */}
        <div className="flex items-center bg-[#0B0D11] p-1 rounded-xl border border-[#202632]">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeStation === 'bharati'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeStation === 'bharati' ? 'bg-sky-500' : 'bg-slate-600'}`} />
            BHARATI STATION
            <span className="text-[10px] opacity-75 font-mono">(69°24'S, 76°11'E)</span>
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
              activeStation === 'maitri'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeStation === 'maitri' ? 'bg-sky-500' : 'bg-slate-600'}`} />
            MAITRI STATION
            <span className="text-[10px] opacity-75 font-mono">(70°45'S, 11°44'E)</span>
          </button>
        </div>

        {/* Quick View Controls & Scenario Simulations */}
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <button
            onClick={() => setIsCutawayView(!isCutawayView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              isCutawayView
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                : 'bg-[#181D26] text-slate-300 border-[#202632] hover:border-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Cutaway
          </button>

          <button
            onClick={() => setIsHeatmapActive(!isHeatmapActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              isHeatmapActive
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-[#181D26] text-slate-300 border-[#202632] hover:border-slate-600'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Heatmaps
          </button>

          {/* Scenario Triggers */}
          <button
            onClick={() => setIsStormActive(!isStormActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              isStormActive
                ? 'bg-sky-950/40 text-sky-300 border-sky-500/40'
                : 'bg-[#181D26] text-slate-300 border-[#202632] hover:border-slate-600'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Blizzard Storm
          </button>

          <button
            onClick={() => setIsGridFaultActive(!isGridFaultActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              isGridFaultActive
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                : 'bg-[#181D26] text-slate-300 border-[#202632] hover:border-slate-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Grid Fault
          </button>
        </div>
      </div>
    </header>
  );
}
