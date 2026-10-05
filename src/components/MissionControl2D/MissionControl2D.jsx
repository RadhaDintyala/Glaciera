import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Wind, Zap, Fuel, Satellite, Send, ShieldAlert, CheckCircle2, AlertTriangle, Power, RefreshCw, Thermometer } from 'lucide-react';

export function MissionControl2D() {
  const {
    activeStation,
    telemetry,
    history,
    satcomStatus,
    simulatedLagMs,
    packetLossPct,
    triggerEdgeAction,
    alerts,
    isGridFaultActive,
    setIsGridFaultActive,
    isBaseShutdown
  } = useTelemetry();

  const [commandInput, setCommandInput] = useState('');
  const [selectedBreaker, setSelectedBreaker] = useState('hvacPrimary');

  const awsData = telemetry?.bharati?.aws || {};
  const maitriPower = telemetry?.maitri?.electricCircuits || {};
  const riometer = telemetry?.maitri?.riometer || {};
  const maitriAtmospheric = telemetry?.maitri?.atmospheric || {};

  // Local state for Breaker status overrides if user clicks interactive breaker switches
  const [breakerStates, setBreakerStates] = useState({
    livingQuarters: 'NOMINAL',
    labs: 'NOMINAL',
    hvacPrimary: 'NOMINAL',
    generatorShed: 'NOMINAL',
    commsTower: 'NOMINAL'
  });

  const toggleBreaker = (breakerKey) => {
    setBreakerStates((prev) => {
      const nextState = prev[breakerKey] === 'NOMINAL' ? 'TRIPPED' : 'NOMINAL';
      triggerEdgeAction('BREAKER_TOGGLE', `Station Breaker '${breakerKey}' switched to ${nextState}`);
      return { ...prev, [breakerKey]: nextState };
    });
  };

  const handleDispatchCommand = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    triggerEdgeAction('CUSTOM_DISPATCH', `L2 Standing Command: "${commandInput}" executed on ${activeStation.toUpperCase()} Edge Gateway`);
    setCommandInput('');
  };

  return (
    <div className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-5 backdrop-blur-md flex flex-col gap-5">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2D Operational Mission Control
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Station Commander Real-Time Command & Dispatch Console
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 font-bold">
          LAYER 5: 2D COMMAND HUB
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: AWS Weather Dashboard */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
              <Wind className="w-4 h-4 text-blue-400" /> 1. AWS Weather Dashboard
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${awsData.blizzardSeverity === 'EXTREME' ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-blue-950 text-blue-300'}`}>
              BLIZZARD: {awsData.blizzardSeverity}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Wind Speed</p>
              <p className="text-sm font-bold text-blue-300">{awsData.windSpeedKnots} kts</p>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Gust Speed</p>
              <p className="text-sm font-bold text-amber-300">{awsData.gustSpeedKnots} kts</p>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Baro Pressure</p>
              <p className="text-sm font-bold text-slate-200">{awsData.barometricPressureHpa} hPa</p>
            </div>
          </div>

          {/* Recharts Wind Speed Live Trend */}
          <div className="h-28 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="windKmh" stroke="#38bdf8" fillOpacity={1} fill="url(#windGrad)" name="Wind Speed (km/h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module 2: Remote Switch & Electrical Circuit Control */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-400" /> 2. Remote Switch & Circuit Control
            </div>
            <button
              onClick={() => {
                setIsGridFaultActive(!isGridFaultActive);
                triggerEdgeAction(isGridFaultActive ? 'CLEAR_FAULT' : 'INJECT_FAULT', 'Grid fault simulation toggled from 2D Mission Control');
              }}
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold transition-all ${
                isGridFaultActive ? 'bg-rose-600 text-white animate-bounce' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isGridFaultActive ? 'RESET GRID FAULT' : 'INJECT FAULT'}
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Station Power Grid Breakers & Automatic Load Shedding Switches:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {Object.keys(breakerStates).map((key) => {
              const isTripped = isBaseShutdown || breakerStates[key] === 'TRIPPED' || (isGridFaultActive && key === 'hvacPrimary');
              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    isTripped ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-[10px] opacity-75">{isTripped ? 'CIRCUIT TRIPPED' : 'ONLINE (NOMINAL)'}</p>
                  </div>
                  <button
                    onClick={() => toggleBreaker(key)}
                    className={`p-1.5 rounded transition-all ${
                      isTripped ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900'
                    }`}
                    title="Toggle Breaker Switch"
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module 3: Microgrid Energy Sources & Fuel Telemetry */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Fuel className="w-4 h-4 text-emerald-400" /> 3. Microgrid Energy Sources & Fuel
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              Load: {maitriPower.totalLoadKw} / {maitriPower.maxCapacityKw} kW
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Gen 1 Primary Output</span>
                <span className="text-amber-400">{maitriPower.gen1Output} kW</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${(maitriPower.gen1Output / 200) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Gen 2 Auxiliary Output</span>
                <span className="text-amber-400">{maitriPower.gen2Output} kW</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${(maitriPower.gen2Output / 200) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
              <div>
                <p className="text-slate-400">Station Fuel Reserve</p>
                <p className="text-sm font-bold text-emerald-400">
                  {maitriPower.fuelReserveLiters?.toLocaleString()} L ({((maitriPower.fuelReserveLiters / maitriPower.fuelMaxLiters) * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400">Burn Rate</p>
                <p className="text-sm font-bold text-amber-300">{maitriPower.fuelBurnRateLh} L/hr</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module 4: SATCOM Link Health & Connectivity Status */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
              <Satellite className="w-4 h-4 text-purple-400" /> 4. SATCOM Link Health & Status
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${satcomStatus === 'ONLINE' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400 animate-pulse'}`}>
              {satcomStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Signal Strength</p>
              <p className="text-sm font-bold text-purple-300">{riometer.satcomSignalStrength || 88}%</p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Riometer Absorption</p>
              <p className="text-sm font-bold text-cyan-300">{riometer.absorptionDb || 1.84} dB</p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Simulated Latency</p>
              <p className="text-sm font-bold text-blue-300">{simulatedLagMs} ms</p>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <p className="text-[10px] text-slate-400">Packet Loss Rate</p>
              <p className="text-sm font-bold text-amber-300">{packetLossPct}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module 5: Proactive Command & Control Dispatcher Panel */}
      <div className="bg-slate-950/90 p-4 rounded-xl border border-rose-900/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
            <Send className="w-4 h-4 text-rose-400" /> 5. Proactive Command & Control Dispatcher Panel
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Dotted Loop to Layer 4 & Layer 2 Edge
          </span>
        </div>

        {/* Quick Pre-set Command Dispatch Buttons */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => triggerEdgeAction('SHED_NON_ESSENTIAL', 'Standing L2: Shed Non-Essential Lab Loads')}
            className="px-3 py-1.5 rounded bg-slate-900 text-rose-300 border border-rose-500/30 hover:bg-rose-950 transition-all"
          >
            + Shed Lab Load
          </button>
          <button
            onClick={() => triggerEdgeAction('OPTIMIZE_HEATER_PULSE', 'Standing L2: Pulse Heat Living Quarters')}
            className="px-3 py-1.5 rounded bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-amber-950 transition-all"
          >
            + Pulse HVAC Heaters
          </button>
          <button
            onClick={() => triggerEdgeAction('RESET_COMM_STATION', 'Standing L2: Reboot SATCOM Radome Transceiver')}
            className="px-3 py-1.5 rounded bg-slate-900 text-purple-300 border border-purple-500/30 hover:bg-purple-950 transition-all"
          >
            + Reboot SATCOM Mast
          </button>
        </div>

        {/* Dispatch Console Input Form */}
        <form onSubmit={handleDispatchCommand} className="flex gap-2">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type custom Level 2 remote edge command (e.g. SET_GENERATOR_LOAD 80%)..."
            className="flex-1 bg-slate-900 border border-rose-500/40 text-rose-200 text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-rose-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
          >
            <Send className="w-3.5 h-3.5" /> Dispatch L2
          </button>
        </form>

        {/* Real-Time Command Log Feed */}
        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 max-h-36 overflow-y-auto space-y-1.5 text-xs font-mono">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">
            Dispatched Commands & Edge Audit Trail:
          </p>
          {alerts.map((item) => (
            <div key={item.id} className="flex items-start justify-between text-[11px] border-b border-slate-800/60 pb-1">
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  item.type === 'COMMAND' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : item.type === 'WARNING' ? 'bg-amber-950 text-amber-300' : 'bg-blue-950 text-blue-300'
                }`}>
                  {item.type}
                </span>
                <span className="text-slate-200 font-semibold">{item.title}</span>
                <span className="text-slate-400 hidden sm:inline">— {item.desc}</span>
              </div>
              <span className="text-slate-400 text-[10px]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
