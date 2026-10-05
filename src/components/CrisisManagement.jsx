import React, { useEffect, useRef, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  AlertTriangle, Power, KeyRound, Flame, DoorClosed, Waves,
  RotateCcw, Radio, Zap, Gauge, CheckCircle2,
  Lock, Unlock, FlaskConical, Building2, BatteryCharging,
  SlidersHorizontal, Activity, ArrowRight, ShieldAlert, Check
} from 'lucide-react';

const SECTORS = [
  {
    key: 'alpha',
    circuit: 'ISO-VLV-01A',
    name: 'Sector 1-A: Clean Research Labs',
    zone: 'Biosafety Level 3 Corridor',
    desc: 'Isolates microbiological air scrubbers and hydronic heating loops',
    nominalFlow: '480 LPM',
    flowPct: 82,
    hasFault: true,
    icon: FlaskConical,
  },
  {
    key: 'bravo',
    circuit: 'ISO-VLV-02B',
    name: 'Sector 2-B: Habitation Core',
    zone: 'Living Quarters & Mess Deck',
    desc: 'Isolates domestic freshwater supply and central ventilation plenum',
    nominalFlow: '320 LPM',
    flowPct: 64,
    hasFault: false,
    icon: Building2,
  },
  {
    key: 'charlie',
    circuit: 'ISO-VLV-03C',
    name: 'Sector 3-C: Power Farm',
    zone: 'DG Generator Shed & Rack 1-4',
    desc: 'Isolates main diesel fuel feeds and generator heat recovery lines',
    nominalFlow: '610 LPM',
    flowPct: 91,
    hasFault: false,
    icon: BatteryCharging,
  },
];

const MACROS = [
  {
    key: 'blizzard',
    id: 'MACRO-01',
    name: 'Blizzard Thermal Damper Override',
    category: 'Thermal Protection',
    time: '~12s Execution',
    desc: 'Forces ventilation damper #4 to 100% aperture, routing 100% of generator exhaust heat loops directly into habitat living quarters.',
    icon: Flame,
    action: 'MACRO_BLIZZARD',
    badge: 'text-amber-400',
  },
  {
    key: 'breach',
    id: 'MACRO-02',
    name: 'Bulkhead Perimeter Hydraulic Seal',
    category: 'Structural Containment',
    time: '4.2s Fast Trip',
    desc: 'Trips hydraulic fail-safe solenoids to seal blast doors B-01 through B-12 simultaneously, arresting structural pressure loss.',
    icon: DoorClosed,
    action: 'MACRO_BREACH',
    badge: 'text-rose-400',
  },
  {
    key: 'gas',
    id: 'MACRO-03',
    name: 'Wellhead Hydrostatic Suppression',
    category: 'Borehole Safety',
    time: '8,000 PSI Pressure',
    desc: 'Injects high-density barite mud slurry into well annulus at 8,000 PSI to suppress high-pressure borehole gas release.',
    icon: Waves,
    action: 'MACRO_GAS',
    badge: 'text-sky-400',
  },
];

export function CrisisManagement() {
  const {
    telemetry, alerts, addAlert, triggerEdgeAction,
    isolatedCircuits, activeMacros,
    isBaseShutdown, isGridFaultActive, satcomStatus,
    executeBaseShutdown, resetBaseShutdown,
  } = useTelemetry();

  // Active view tab: 'all' | 'valves' | 'macros' | 'grid' | 'logs'
  const [activeTab, setActiveTab] = useState('all');

  // Dual-Custody Key State
  const [keyA, setKeyA] = useState(true);
  const [keyB, setKeyB] = useState(true);
  const keysEngaged = keyA && keyB;

  // Macro Sequence Execution Phases
  const [macroPhase, setMacroPhase] = useState({ blizzard: 'idle', breach: 'idle', gas: 'idle' });

  // 2-Second Hold for Master Cutoff
  const [holdPct, setHoldPct] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef(null);
  const holdTicker = useRef(null);

  // Live Telemetry
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
      addAlert(
        'WARNING',
        'INTERLOCK RESTRICTION',
        'Dual-custody safety interlock locked: Engage both Key Switch A and Key Switch B to enable command dispatch.'
      );
      return false;
    }
    if (isBaseShutdown) {
      addAlert(
        'WARNING',
        'GRID DE-ENERGIZED',
        'Base grid is currently tripped. Click "Re-energize Base Grid" before issuing valve or macro overrides.'
      );
      return false;
    }
    return true;
  };

  const handleIsoToggle = (def) => {
    if (!requireKeys()) return;
    const action = def.key === 'alpha' ? 'ISOLATE_ALPHA' : def.key === 'bravo' ? 'ISOLATE_BRAVO' : 'ISOLATE_CHARLIE';
    const willIsolate = !isolatedCircuits?.[def.key];
    triggerEdgeAction(
      action,
      `${def.name} ${willIsolate ? 'VALVE TRIPPED [ISOLATED]' : 'RESTORED TO NOMINAL FLOW'}`
    );
  };

  const handleMacro = (def) => {
    if (!requireKeys()) return;
    if (macroPhase[def.key] !== 'idle' && macroPhase[def.key] !== 'active') return;
    setMacroPhase((p) => ({ ...p, [def.key]: 'transmitting' }));
    triggerEdgeAction(def.action, `Dispatched ${def.id} (${def.name}) to station PLC controller`);
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
      executeBaseShutdown('Main 11kV bus tripped — hydraulic prime movers severed. All station loads collapsed to 0 kW.');
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

  const isolatedCount = [isolatedCircuits?.alpha, isolatedCircuits?.bravo, isolatedCircuits?.charlie].filter(Boolean).length;

  return (
    <div className="max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans bg-[#0B0D11] min-h-screen text-[#F8FAFC]">
      
      {/* 1. Header Banner */}
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 sm:p-6 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632] shadow-sm">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Remote Access & SCADA Safety Control
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#181D26] text-slate-300 border border-[#202632] tracking-wider uppercase">
                Level-4 Supervisory Clearance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Direct SCADA override terminal for hydraulic valve isolation, disaster contingency macros, and emergency grid cutoff.
            </p>
          </div>
        </div>

        {/* Real-Time Uplink & State Badges */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${satcomStatus === 'BLACKOUT' ? 'bg-rose-500' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 font-medium">
              SATCOM: {satcomStatus === 'BLACKOUT' ? 'BLACKOUT' : 'INSAT-4CR (420ms)'}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${keysEngaged ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-medium">
              INTERLOCK: {keysEngaged ? 'ARMED' : 'KEYWAY LOCKED'}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#0B0D11] border border-[#202632] flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isBaseShutdown ? 'bg-rose-500' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 font-medium">
              GRID: {isBaseShutdown ? '11kV TRIPPED' : 'ONLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sleek Interactive Control Bar: Interlocks + View Switcher */}
      <div className="bg-[#12161D] border border-[#202632] rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Dual Hardware Interlock Keys (Crisp & Simple) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-semibold mr-1">
            SAFETY INTERLOCK:
          </span>

          <button
            type="button"
            onClick={() => setKeyA((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
              keyA
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-[#181D26] text-slate-400 border-[#202632] hover:border-slate-600'
            }`}
          >
            {keyA ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
            <span>Key Switch A: {keyA ? 'ENGAGED' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setKeyB((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
              keyB
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-[#181D26] text-slate-400 border-[#202632] hover:border-slate-600'
            }`}
          >
            {keyB ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
            <span>Key Switch B: {keyB ? 'ENGAGED' : 'OFF'}</span>
          </button>

          <span className={`text-[11px] font-mono px-2 py-1 rounded ${
            keysEngaged ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {keysEngaged ? '✓ Overrides Permitted' : '⚠ Locked (Engage Both Keys)'}
          </span>
        </div>

        {/* Right: Clean View Switcher */}
        <div className="flex items-center bg-[#0B0D11] p-1 rounded-lg border border-[#202632] shrink-0 text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Actions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('valves')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === 'valves'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sector Valves ({isolatedCount}/3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('macros')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === 'macros'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Emergency Macros (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grid Cutoff
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log
          </button>
        </div>

      </div>

      {/* 3. Compact Live SCADA Telemetry Strip */}
      <div className="bg-[#12161D] border border-[#202632] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Load:</span>
            <span className={`font-bold text-sm ${loadKw === 0 ? 'text-rose-400' : 'text-white'}`}>
              {loadKw} kW
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Grid Frequency:</span>
            <span className={`font-bold text-sm ${freqHz === 0 ? 'text-rose-400' : 'text-white'}`}>
              {freqHz} Hz
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Habitat Temp:</span>
            <span className="font-bold text-sm text-white">
              {livingTemp} °C
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] text-slate-500 uppercase">Breakers:</span>
          <span>Labs: <strong className={breakers.labs === 'TRIPPED' ? 'text-rose-400' : 'text-slate-200'}>{breakers.labs || 'OK'}</strong></span>
          <span>·</span>
          <span>Living: <strong className={breakers.livingQuarters === 'TRIPPED' ? 'text-rose-400' : 'text-slate-200'}>{breakers.livingQuarters || 'OK'}</strong></span>
          <span>·</span>
          <span>HVAC: <strong className={breakers.hvacPrimary === 'TRIPPED' ? 'text-rose-400' : 'text-slate-200'}>{breakers.hvacPrimary || 'OK'}</strong></span>
          <span>·</span>
          <span>GenShed: <strong className={breakers.generatorShed === 'TRIPPED' ? 'text-rose-400' : 'text-slate-200'}>{breakers.generatorShed || 'OK'}</strong></span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTION 1: SECTOR VALVES ISOLATION                                  */}
      {/* ------------------------------------------------------------------ */}
      {(activeTab === 'all' || activeTab === 'valves') && (
        <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202632] pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                Sector Hydraulic & Atmospheric Isolation Valves
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Trip fluid supply and ventilation dampers to contain localized fire, biological hazard, or pipe burst.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-[#0B0D11] px-3 py-1 rounded-lg border border-[#202632]">
              {isolatedCount} of 3 Isolated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SECTORS.map((def) => {
              const Icon = def.icon;
              const isIsolated = !!isolatedCircuits?.[def.key];

              return (
                <div
                  key={def.circuit}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isIsolated
                      ? 'bg-[#181114] border-rose-500/40'
                      : 'bg-[#181D26] border-[#202632] hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 uppercase tracking-wider">{def.circuit}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase ${
                        isIsolated
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : def.hasFault
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {isIsolated ? 'VALVE CLOSED' : def.hasFault ? 'ACTIVE FAULT' : 'VALVE OPEN'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Icon className={`w-4 h-4 shrink-0 ${isIsolated ? 'text-rose-400' : 'text-sky-400'}`} />
                      <h3 className="text-sm font-bold text-white font-sans">{def.name}</h3>
                    </div>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {def.desc}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#202632]">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Flow Rate:</span>
                      <span className={isIsolated ? 'text-rose-400 font-bold' : 'text-slate-200 font-medium'}>
                        {isIsolated ? '0 LPM (SEALED)' : `${def.nominalFlow} [ACTIVE]`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#0B0D11] rounded-full h-1.5 overflow-hidden border border-[#202632]">
                      <div
                        className={`h-full transition-all duration-300 ${isIsolated ? 'bg-rose-500 w-full' : 'bg-sky-400'}`}
                        style={{ width: isIsolated ? '100%' : `${def.flowPct}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleIsoToggle(def)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        isIsolated
                          ? 'btn-primary-clean'
                          : 'btn-secondary-clean'
                      }`}
                    >
                      {isIsolated ? '✓ Restore Nominal Valve' : '⚡ Trip Isolation Valve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* ACTION 2: AUTOMATED EMERGENCY MACROS                               */}
      {/* ------------------------------------------------------------------ */}
      {(activeTab === 'all' || activeTab === 'macros') && (
        <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202632] pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Flame className="w-4 h-4 text-sky-400" />
                Emergency Automated Macro Sequences
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Pre-programmed multi-subsystem disaster routines dispatched simultaneously to station PLC units.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-[#0B0D11] px-3 py-1 rounded-lg border border-[#202632]">
              3 Sequences Primed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MACROS.map((def) => {
              const Icon = def.icon;
              const phase = macroPhase[def.key];
              const isCompleted = phase === 'active' || activeMacros?.[def.key];

              return (
                <div
                  key={def.id}
                  className="bg-[#181D26] border border-[#202632] rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-sky-400 font-bold bg-[#0B0D11] px-2 py-0.5 rounded border border-[#202632]">
                        {def.id}
                      </span>
                      <span className="text-slate-400 text-[11px]">{def.time}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Icon className={`w-4 h-4 shrink-0 ${def.badge}`} />
                      <h3 className="text-sm font-bold text-white font-sans">{def.name}</h3>
                    </div>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {def.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#202632]">
                    <button
                      type="button"
                      onClick={() => handleMacro(def)}
                      disabled={phase === 'transmitting' || phase === 'executing'}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : phase === 'executing' || phase === 'transmitting'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'btn-secondary-clean'
                      }`}
                    >
                      {phase === 'transmitting' ? (
                        'Transmitting Packet…'
                      ) : phase === 'executing' ? (
                        'Executing PLC Logic…'
                      ) : isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Sequence Active ■
                        </>
                      ) : (
                        `Execute ${def.id}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* ACTION 3: EMERGENCY MASTER GRID CUTOFF (11kV)                       */}
      {/* ------------------------------------------------------------------ */}
      {(activeTab === 'all' || activeTab === 'grid') && (
        <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202632] pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <Power className="w-4 h-4 text-rose-400" />
                Master 11kV Substation Grid Trip (Emergency Base Cutoff)
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Emergency disconnect of the primary 11kV bus. Immediately vents all hydraulic accumulators and collapses station power to 0 kW.
              </p>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-[#0B0D11] px-3 py-1 rounded-lg border border-[#202632]">
              11kV SUBSTATION
            </span>
          </div>

          {!isBaseShutdown ? (
            <div
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full bg-[#1A1215] hover:bg-[#201418] border-2 border-rose-500/40 hover:border-rose-500 rounded-xl p-6 sm:p-7 flex flex-col items-center justify-center text-center space-y-3 select-none touch-none cursor-pointer transition-all shadow-lg"
            >
              <div className="flex items-center gap-2.5 text-rose-400">
                <Power className="w-6 h-6" />
                <h3 className="text-lg font-bold font-sans text-white">
                  Trip Main 11kV Base Power Grid
                </h3>
              </div>

              <p className="text-xs font-mono text-slate-400 max-w-md">
                Press and hold continuously for 2 seconds to execute complete base electrical disconnect.
              </p>

              {/* Hold Progress Bar */}
              <div className="w-full max-w-sm bg-[#0B0D11] rounded-full h-2 overflow-hidden border border-[#202632]">
                <div
                  className="h-full bg-rose-500 transition-none"
                  style={{ width: `${holdPct}%` }}
                />
              </div>

              <span className={`text-xs font-mono font-semibold px-4 py-1 rounded-full border transition-all ${
                holding
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-[#12161D] text-slate-300 border-slate-700'
              }`}>
                {holding ? `HOLDING CONFIRMATION: ${holdPct}%` : 'HOLD FOR 2 SECONDS TO TRIP GRID'}
              </span>
            </div>
          ) : (
            <div className="w-full bg-[#181013] border-2 border-rose-500/50 rounded-xl p-6 sm:p-7 text-center space-y-4">
              <div>
                <p className="text-lg font-bold text-rose-400 flex items-center justify-center gap-2">
                  <Power className="w-5 h-5" /> Base Substation Grid Tripped & De-Energized
                </p>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  11kV main bus breaker open · All loads collapsed to 0 kW · SATCOM BLACKOUT
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center font-mono text-xs">
                <div className="bg-[#0B0D11] border border-[#202632] p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">LOAD</span>
                  <span className="text-rose-400 font-bold">0 kW</span>
                </div>
                <div className="bg-[#0B0D11] border border-[#202632] p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">FREQ</span>
                  <span className="text-rose-400 font-bold">0 Hz</span>
                </div>
                <div className="bg-[#0B0D11] border border-[#202632] p-2 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">SATCOM</span>
                  <span className="text-rose-400 font-bold">BLACKOUT</span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetBaseShutdown}
                className="btn-primary-clean inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer uppercase tracking-wider"
              >
                <RotateCcw className="w-4 h-4" /> Re-energize Base Substation Grid
              </button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* AUDIT TRAIL LOG                                                    */}
      {/* ------------------------------------------------------------------ */}
      {(activeTab === 'all' || activeTab === 'logs') && (
        <section className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#202632] pb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              SCADA Command Dispatch & Safety Audit Trail
            </span>
            <span className="text-[11px] font-mono text-slate-500">Immutable Log Feed</span>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {alerts.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between text-xs font-mono bg-[#181D26] border border-[#202632] p-2.5 rounded-lg gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 uppercase ${
                    item.type === 'CRITICAL'
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : item.type === 'COMMAND'
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-slate-200 font-medium truncate">
                    {item.title} — <span className="text-slate-400 font-normal">{item.desc}</span>
                  </span>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
