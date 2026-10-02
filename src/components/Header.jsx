import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Activity, Radio, ShieldAlert, Zap, Wind, Eye, ArrowLeft, Home } from 'lucide-react';

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
    <header className="bg-slate-900/90 border-b border-cyan-500/20 backdrop-blur-md px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Organization Brand */}
        <div className="flex items-center gap-3.5">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-all shadow-sm"
              title="Return to Polaris Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
              Overview
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              ANTARCTICA DIGITAL TWIN PLATFORM
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                SIH26060
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              National Centre for Polar and Ocean Research (NCPOR) | MoES India
            </p>
          </div>
        </div>

        {/* Dual Station Switcher Toggle */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeStation === 'bharati'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeStation === 'bharati' ? 'bg-cyan-300' : 'bg-slate-600'}`} />
            BHARATI STATION
            <span className="text-[10px] opacity-75 font-mono">(69°24'S, 76°11'E)</span>
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeStation === 'maitri'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeStation === 'maitri' ? 'bg-cyan-300' : 'bg-slate-600'}`} />
            MAITRI STATION
            <span className="text-[10px] opacity-75 font-mono">(70°45'S, 11°44'E)</span>
          </button>
        </div>

        {/* Quick View Controls & Scenario Simulations */}
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <button
            onClick={() => setIsCutawayView(!isCutawayView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isCutawayView
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Cutaway
          </button>

          <button
            onClick={() => setIsHeatmapActive(!isHeatmapActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isHeatmapActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Heatmaps
          </button>

          {/* Scenario Triggers */}
          <button
            onClick={() => setIsStormActive(!isStormActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isStormActive
                ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Blizzard Storm
          </button>

          <button
            onClick={() => setIsGridFaultActive(!isGridFaultActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isGridFaultActive
                ? 'bg-rose-600 text-white border-rose-400 animate-bounce'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
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
