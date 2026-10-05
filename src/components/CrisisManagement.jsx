import React, { useEffect, useRef, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  AlertTriangle, Power, KeyRound, Flame, DoorClosed, Waves,
  RotateCcw, Radio, Zap, Gauge
} from 'lucide-react';

const ISOLATION_DEFS = [
  {
    key: 'alpha', circuit: 'ISO-VLV-01A', title: 'ISOLATE ALPHA (CLEAN LABS)',
    zone: 'SECTOR 1-A / BIOSAFETY L3', flowNominal: '480 LPM', flowPct: 82,
  },
  {
    key: 'bravo', circuit: 'ISO-VLV-02B', title: 'ISOLATE BRAVO (DOMESTIC)',
    zone: 'SECTOR 2-B / HABITATION CORE', flowNominal: 'NOMINAL', flowPct: 64,
  },
  {
    key: 'charlie', circuit: 'ISO-VLV-03C', title: 'ISOLATE CHARLIE (POWER FARM)',
    zone: 'SECTOR 3-C / GENERATOR RACK 1-4', flowNominal: 'NOMINAL', flowPct: 91,
  },
];

const MACRO_DEFS = [
  {
    key: 'blizzard', id: 'MACRO-SEQ-01', title: 'BLIZZARD PROTOCOL (MAXIMIZE CORE PLENUM HEAT)',
    meta: 'EXEC TIME: ~12s', desc: 'Overrides zone damper 4 to 100%, routes all generator bypass thermal loops to habitat.',
    icon: Flame, action: 'MACRO_BLIZZARD',
  },
  {
    key: 'breach', id: 'MACRO-SEQ-02', title: 'STRUCTURAL BREACH (SEAL BULKHEADS)',
    meta: 'EXEC TIME: 4.2s (FAST TRIP)', desc: 'Closes hydraulic blast doors B-01 through B-12 within 4.2 seconds.',
    icon: DoorClosed, action: 'MACRO_BREACH',
  },
  {
    key: 'gas', id: 'MACRO-SEQ-03', title: 'GAS BLOWOUT HYDROSTATIC PRESSURE COMPENSATION SEQUENCE',
    meta: 'PRESSURE: 8,000 PSI', desc: 'Injects high-density barite mud slurry into well annulus at 8,000 PSI.',
    icon: Waves, action: 'MACRO_GAS',
  },
];

export function CrisisManagement() {
  const {
    telemetry, alerts, addAlert, triggerEdgeAction,
    isolatedCircuits, activeMacros,
    isBaseShutdown, isGridFaultActive, satcomStatus,
    executeBaseShutdown, resetBaseShutdown,
  } = useTelemetry();

  const [keyA, setKeyA] = useState(true);
  const [keyB, setKeyB] = useState(true);
  const keysEngaged = keyA && keyB;

  const [macroPhase, setMacroPhase] = useState({ blizzard: 'idle', breach: 'idle', gas: 'idle' });
  const [holdPct, setHoldPct] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef(null);
  const holdTicker = useRef(null);

  const loadKw = telemetry?.maitri?.electricCircuits?.totalLoadKw ?? 0;
  const freqHz = telemetry?.maitri?.electricCircuits?.gridFrequencyHz ?? 0;
  const livingTemp = telemetry?.maitri?.atmospheric?.livingTemp ?? 0;
  const breakers = telemetry?.maitri?.electricCircuits?.breakers ?? {};

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (holdTicker.current) clearInterval(holdTicker.current);
    };
  }, []);

  const requireKeys = () => {
    if (!keysEngaged) {
      addAlert('WARNING', 'INTERLOCK DENIED', 'Both Key A and Key B must be ENGAGED before any isolation or shutdown command.');
      return false;
    }
    if (isBaseShutdown) {
      addAlert('WARNING', 'GRID ALREADY SHUTDOWN', 'Re-energize the base grid before issuing new isolation commands.');
      return false;
    }
    return true;
  };

  const handleIsoToggle = (def) => {
    if (!requireKeys()) return;
    const action = def.key === 'alpha' ? 'ISOLATE_ALPHA' : def.key === 'bravo' ? 'ISOLATE_BRAVO' : 'ISOLATE_CHARLIE';
    const willIsolate = !isolatedCircuits?.[def.key];
    triggerEdgeAction(action, def.title + ' ' + (willIsolate ? 'ENGAGED — valve tripped, load trimmed on dashboard' : 'RELEASED — valve restored'));
  };

  const handleMacro = (def) => {
    if (!requireKeys()) return;
    if (macroPhase[def.key] !== 'idle' && macroPhase[def.key] !== 'active') return;
    setMacroPhase((p) => ({ ...p, [def.key]: 'transmitting' }));
    triggerEdgeAction(def.action, def.id + ' dispatched to PLC buffer');
    setTimeout(() => {
      setMacroPhase((p) => ({ ...p, [def.key]: 'executing' }));
      setTimeout(() => setMacroPhase((p) => ({ ...p, [def.key]: 'active' })), 1000);
    }, 700);
  };

  const startHold = () => {
    if (!requireKeys()) return;
    setHolding(true);
    setHoldPct(0);
    const t0 = Date.now();
    holdTicker.current = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - t0) / 2000) * 100));
      setHoldPct(pct);
    }, 50);
    holdTimer.current = setTimeout(() => {
      if (holdTicker.current) clearInterval(holdTicker.current);
      setHolding(false);
      setHoldPct(100);
      executeBaseShutdown('Main 11kV bus tripped — hydraulic prime movers severed. All dashboard loads collapsed to 0 kW.');
    }, 2000);
  };

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdTicker.current) clearInterval(holdTicker.current);
    holdTimer.current = null;
    holdTicker.current = null;
    setHolding(false);
    setHoldPct(0);
  };

  const macroBtnStyle = (phase) => {
    if (phase === 'active') return 'bg-emerald-600 text-white border border-emerald-400';
    if (phase === 'executing') return 'bg-amber-600 text-white border border-amber-400 animate-pulse';
    if (phase === 'transmitting') return 'bg-sky-700 text-white border border-sky-400 animate-pulse';
    return 'bg-slate-100 text-slate-950 border border-slate-300 hover:bg-white';
  };

  const macroBtnLabel = (def) => {
    const phase = macroPhase[def.key];
    if (phase === 'transmitting') return 'TRANSMITTING COMMAND PACKET…';
    if (phase === 'executing') return 'EXECUTING PLC LOGIC…';
    if (phase === 'active' || activeMacros?.[def.key]) return 'SEQUENCE VERIFIED ACTIVE ■';
    return 'ARM & INITIATE ' + def.id.split('-')[2];
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5 font-mono">
      {/* Master status banner */}
      <div className="bg-[#12161D] border border-[#202632] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={'w-2.5 h-2.5 ' + (isBaseShutdown ? 'bg-red-600' : 'bg-red-500 animate-pulse')} />
            <span className="text-xs font-bold tracking-widest text-red-400 uppercase">
              Remote Access &amp; Safety Override Protocols
            </span>
          </div>
          <span className={'text-[11px] font-bold px-2 py-1 border ' + (isBaseShutdown ? 'bg-red-950 text-red-300 border-red-500/50 animate-pulse' : 'bg-slate-900 text-slate-300 border-slate-700')}>
            {isBaseShutdown ? 'SYS-STAT: SHUTDOWN — 11kV TRIPPED' : 'SYS-STAT: ARMED'}
          </span>
        </div>
        <div className="bg-slate-950 px-3 py-2 flex flex-wrap items-center justify-between gap-2 border border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase tracking-widest">Interlock Registry</span>
          <span className="text-[11px] font-bold text-emerald-400">SYSTEM INTERLOCK: LEVEL-4 SUPERVISORY CLEARANCE VERIFIED</span>
        </div>
        <div className="bg-red-950/40 border border-red-500/30 text-red-200 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-300">Critical Caution Advisory</p>
            <p className="text-[11px] leading-snug text-red-200/80 uppercase">
              Manual isolation overrides bypass automated feedback loops. Command telemetry logged direct to blackbox immutable storage.
            </p>
          </div>
        </div>
      </div>

      {/* Live sync strip — proves dashboard metrics follow this panel */}
      <div className={'border p-4 ' + (isBaseShutdown ? 'bg-red-950/30 border-red-500/50' : 'bg-[#12161D] border-[#202632]')}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Gauge className="w-4 h-4" /> Live Grid Sync — Main Dashboard Mirror
          </span>
          <span className={'text-[11px] font-bold px-2 py-0.5 border ' + (isBaseShutdown ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40')}>
            {isBaseShutdown ? '■ SHUTDOWN VISIBLE ON DASHBOARD' : '● SYNCED LIVE'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <div className="bg-slate-950 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-500 uppercase">Total Load</p>
            <p className={'text-lg font-bold ' + (loadKw === 0 ? 'text-red-400' : 'text-amber-300')}>{loadKw} kW</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-500 uppercase">Grid Freq</p>
            <p className={'text-lg font-bold ' + (freqHz === 0 ? 'text-red-400' : 'text-slate-100')}>{freqHz} Hz</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-500 uppercase">SATCOM</p>
            <p className={'text-lg font-bold ' + (satcomStatus === 'BLACKOUT' ? 'text-red-400 animate-pulse' : 'text-emerald-300')}>{satcomStatus}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3">
            <p className="text-[10px] text-slate-500 uppercase">Habitat Temp</p>
            <p className="text-lg font-bold text-slate-100">{livingTemp}°C</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Breakers — Labs: {breakers.labs || '—'} · Living: {breakers.livingQuarters || '—'} · HVAC: {breakers.hvacPrimary || '—'} · GenShed: {breakers.generatorShed || '—'}
          {isGridFaultActive ? ' · GRID FAULT LATCHED' : ''}
        </p>
      </div>

      {/* Dual-custody keys */}
      <div className="bg-[#12161D] border border-[#202632] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Dual-Custody Physical Interlock Verification</span>
          <span className="text-[11px] text-slate-400">SEC-BUS: LINKED</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[{ k: 'A', on: keyA, set: setKeyA }, { k: 'B', on: keyB, set: setKeyB }].map((s) => (
            <button
              key={s.k}
              type="button"
              onClick={() => s.set((v) => !v)}
              className={'p-3 flex items-center justify-between border text-left transition-all ' + (s.on ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950 border-slate-700 hover:border-slate-500')}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase">
                <KeyRound className={'w-4 h-4 ' + (s.on ? 'text-emerald-400' : 'text-slate-500')} />
                Key Switch {s.k}: [{s.on ? 'ENGAGED' : 'RELEASED'}]
              </span>
              <span className={'text-[11px] font-bold ' + (s.on ? 'text-emerald-400' : 'text-slate-500')}>
                {s.on ? '■ VERIFIED' : '□ CLICK TO ENGAGE'}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 px-3 py-2 border border-slate-800 text-[11px]">
          <span className="text-slate-400">AUTHORIZED BY: OP-409 / L4 COMMAND DECK</span>
          <span className={'font-bold ' + (keysEngaged ? 'text-emerald-400' : 'text-red-400 animate-pulse')}>
            {keysEngaged ? 'KEYWAY RELAY: ENERGIZED' : 'KEYWAY RELAY: LOCKED — ENGAGE BOTH KEYS'}
          </span>
        </div>
      </div>

      {/* Isolation row */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Sector Hydraulic &amp; Atmospheric Isolation</span>
          <span className="text-[11px] font-bold text-red-400">
            {[isolatedCircuits?.alpha, isolatedCircuits?.bravo, isolatedCircuits?.charlie].filter(Boolean).length} / 3 CIRCUITS ISOLATED
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ISOLATION_DEFS.map((def) => {
            const isolated = !!isolatedCircuits?.[def.key];
            return (
              <button
                key={def.circuit}
                type="button"
                onClick={() => handleIsoToggle(def)}
                className={'text-left p-4 flex flex-col gap-2 border-2 transition-all duration-150 active:scale-[0.99] ' + (isolated ? 'bg-red-700 border-red-400 text-white shadow-[0_0_24px_rgba(220,38,38,0.45)] animate-pulse' : 'bg-[#141a24] border-red-600/80 text-slate-200 hover:bg-[#1a2230] hover:border-red-500')}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[10px] tracking-widest opacity-80">CIRCUIT: {def.circuit}</span>
                  <span className={'text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ' + (isolated ? 'bg-white text-red-700' : def.key === 'alpha' ? 'bg-red-950 text-red-300 border border-red-500/50' : 'bg-slate-800 text-slate-300 border border-slate-600')}>
                    {isolated ? 'VALVE TRIPPED [ISOLATED]' : def.key === 'alpha' ? 'ACTIVE FAULT DETECTED' : 'STANDBY / NOMINAL'}
                  </span>
                </span>
                <span className={'text-lg font-extrabold uppercase leading-tight tracking-tight ' + (isolated ? 'text-white' : 'text-red-500')}>
                  {def.title}
                </span>
                <span className="text-[10px] opacity-70 uppercase">Zone: {def.zone}</span>
                <span className="h-1.5 w-full bg-black/40 overflow-hidden">
                  <span
                    className={'block h-full transition-all ' + (isolated ? 'bg-white' : 'bg-red-600')}
                    style={{ width: isolated ? '100%' : def.flowPct + '%' }}
                  />
                </span>
                <span className="flex items-center justify-between text-[11px]">
                  <span className={isolated ? 'text-white font-bold' : 'text-slate-300'}>
                    {isolated ? 'FLOW: 0 LPM [SEALED]' : 'FLOW: ' + def.flowNominal + ' [READY]'}
                  </span>
                  <span className={'font-bold ' + (isolated ? 'text-white' : 'text-red-400')}>{isolated ? '■ CLICK TO RESTORE' : '▷ CLICK TO ISOLATE'}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Emergency Macro Sequences (Automated Presets)</span>
          <span className="text-[11px] text-slate-400">PLC DISPATCH BUFFER: EMPTY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MACRO_DEFS.map((def) => {
            const Icon = def.icon;
            const phase = macroPhase[def.key];
            return (
              <div key={def.id} className="bg-[#12161D] border border-slate-700 p-4 flex flex-col gap-2">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-700 text-slate-100 uppercase">{def.id}</span>
                  <span className="text-[10px] text-slate-400">{def.meta}</span>
                </span>
                <span className="flex items-center gap-2 text-sm font-bold text-white uppercase leading-snug">
                  <Icon className="w-4 h-4 shrink-0 text-slate-300" /> {def.title}
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{def.desc}</p>
                {(phase === 'transmitting' || phase === 'executing') && (
                  <span className="h-1 w-full bg-slate-800 overflow-hidden">
                    <span className="block h-full w-1/2 bg-amber-400 animate-pulse" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleMacro(def)}
                  className={'w-full py-2 px-3 text-[11px] font-bold uppercase tracking-widest transition-all ' + macroBtnStyle(phase)}
                >
                  {macroBtnLabel(def)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Master cutoff — massive flat solid crimson block */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Final Tier Defense / Irreversible Operation</span>
          <span className="text-[11px] font-bold text-red-400">BUS: 11kV DIRECT</span>
        </div>
        {!isBaseShutdown ? (
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full bg-[#C1121F] hover:bg-[#A50E1A] text-white p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-2 border-4 border-[#7A0B12] select-none touch-none"
            title="Press and HOLD for 2 seconds to execute base grid shutdown"
          >
            <span className="flex items-center gap-3">
              <Power className="w-7 h-7" />
              <span className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">Critical Override: Execute Base Grid Shutdown</span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
              Immediately trips main 11kV bus and severs hydraulic prime movers
            </span>
            <span className="mt-1 w-full max-w-md h-2 bg-black/40 overflow-hidden">
              <span className="block h-full bg-white transition-none" style={{ width: holdPct + '%' }} />
            </span>
            <span className="bg-white text-[#C1121F] px-4 py-1 text-[11px] font-extrabold uppercase tracking-widest">
              {holding ? 'HOLDING… ' + holdPct + '% — DO NOT RELEASE' : 'Requires confirmed 2-second hold'}
            </span>
          </button>
        ) : (
          <div className="w-full bg-black border-4 border-red-600 p-6 sm:p-8 text-center space-y-3">
            <p className="text-xl sm:text-2xl font-extrabold uppercase text-red-500 animate-pulse flex items-center justify-center gap-2">
              <Power className="w-6 h-6" /> Grid Shutdown Initiated
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">
              11kV breaker tripped — hydraulic accumulators vented — dashboard at 0 kW / BLACKOUT
            </p>
            <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto text-center text-[11px]">
              <div className="bg-red-950 border border-red-500/40 p-2"><p className="text-slate-400">LOAD</p><p className="text-red-300 font-bold">{loadKw} kW</p></div>
              <div className="bg-red-950 border border-red-500/40 p-2"><p className="text-slate-400">FREQ</p><p className="text-red-300 font-bold">{freqHz} Hz</p></div>
              <div className="bg-red-950 border border-red-500/40 p-2"><p className="text-slate-400">SATCOM</p><p className="text-red-300 font-bold">{satcomStatus}</p></div>
            </div>
            <button
              type="button"
              onClick={resetBaseShutdown}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest"
            >
              <RotateCcw className="w-4 h-4" /> Re-energize Base Grid
            </button>
          </div>
        )}
        <p className="text-[10px] text-slate-500 flex items-center gap-1 px-1">
          <Radio className="w-3 h-3" /> Shutdown propagates to TelemetryContext: loads → 0 kW, breakers → TRIPPED, SATCOM → BLACKOUT, habitat temps decay — visible on Overview / Mission Control / Energy views.
          <Zap className="w-3 h-3 ml-2" /> Edge queue backlog grows while shutdown is latched.
        </p>
      </div>

      {/* Audit trail */}
      <div className="bg-slate-950/90 p-3 border border-slate-800 max-h-44 overflow-y-auto space-y-1.5">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Remote Access Audit Trail (mirrors main command log):</p>
        {alerts.slice(0, 8).map((item) => (
          <div key={item.id} className="flex items-start justify-between text-[11px] border-b border-slate-800/60 pb-1 gap-2">
            <span className="flex items-center gap-2 min-w-0">
              <span className={'px-1.5 py-0.5 text-[9px] font-bold shrink-0 ' + (item.type === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-500/40' : item.type === 'COMMAND' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-300')}>
                {item.type}
              </span>
              <span className="text-slate-200 font-semibold truncate">{item.title} — <span className="text-slate-400 font-normal">{item.desc}</span></span>
            </span>
            <span className="text-slate-500 text-[10px] shrink-0">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
