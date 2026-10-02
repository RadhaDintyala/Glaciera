import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Satellite, Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react';

export function SatcomControlPanel() {
  const {
    satcomStatus,
    simulatedLagMs,
    setSimulatedLagMs,
    packetLossPct,
    setPacketLossPct,
    isManualBlackout,
    setIsManualBlackout,
    telemetry
  } = useTelemetry();

  const riometerDb = telemetry?.maitri?.riometer?.absorptionDb || 1.84;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/30">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Inter-Site SATCOM Gateway Network</h3>
            <p className="text-[11px] font-mono text-slate-400">Polar Satellite Link Simulation Channel</p>
          </div>
        </div>

        {/* SATCOM Status Badge */}
        <div className="flex items-center gap-2">
          {satcomStatus === 'ONLINE' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <Wifi className="w-3.5 h-3.5" /> SATCOM ONLINE
            </span>
          )}
          {satcomStatus === 'DEGRADED' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5" /> DEGRADED LINK
            </span>
          )}
          {satcomStatus === 'BLACKOUT' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold animate-pulse">
              <WifiOff className="w-3.5 h-3.5" /> SATCOM BLACKOUT
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Latency Controls */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Simulated SATCOM Lag
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">{simulatedLagMs} ms</span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="50"
            value={simulatedLagMs}
            onChange={(e) => setSimulatedLagMs(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Link Quality Degradation (Loss Rate) */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-300">Packet Loss Rate</span>
            <span className="text-xs font-mono font-bold text-amber-400">{packetLossPct}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="15.0"
            step="0.5"
            value={packetLossPct}
            onChange={(e) => setPacketLossPct(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Force Manual Blackout Simulation */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-300 font-semibold">Simulate Solar Blackout</p>
            <p className="text-[10px] text-slate-400 font-mono">Forces edge queueing & offline mode</p>
          </div>
          <button
            onClick={() => setIsManualBlackout(!isManualBlackout)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              isManualBlackout
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isManualBlackout ? 'RECONNECT' : 'SIMULATE CUT'}
          </button>
        </div>
      </div>
    </div>
  );
}
