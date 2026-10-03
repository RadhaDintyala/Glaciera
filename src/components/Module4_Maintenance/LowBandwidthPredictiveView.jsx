import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Radio, Database, ShieldAlert, Cpu, Lock, UserCheck, RefreshCw, Send, CheckCircle2, AlertTriangle, Activity, Sliders, Zap, Wifi, SignalHigh, Server } from 'lucide-react';

export function LowBandwidthPredictiveView() {
  const {
    activeStation,
    setActiveStation,
    activeRole,
    setActiveRole,
    telemetry,
    satcomStatus,
    setSatcomStatus,
    compressionMode,
    setCompressionMode,
    localBufferCount,
    queueBacklog,
    payloadMetrics,
    isManualBlackout,
    setIsManualBlackout,
    alerts,
    addAlert,
    triggerEdgeAction
  } = useTelemetry();

  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const anomalies = telemetry.predictiveAnomalies || [];

  const rolesList = [
    { id: 'COMMANDER', name: 'Station Commander', title: 'Full Station Command & Emergency Authority' },
    { id: 'TECHNICIAN', name: 'Maintenance Technician', title: 'Telemetry, Breakers & Machinery Diagnostics' },
    { id: 'SCIENTIST', name: 'Mainland Scientist', title: 'In-Situ Research Datasets & Space Weather' },
    { id: 'MINISTRY', name: 'Ministry Administrator / NCPOR', title: 'Executive Overview & Multi-Station Auditing' }
  ];

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans">
      
      {/* Title Header Banner */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-500 text-white shadow-xl shadow-purple-500/20">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Low-Bandwidth Sync & Predictive Maintenance <span className="text-purple-400 font-mono text-lg font-normal">| Module 4</span>
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 tracking-wide uppercase">
                SIH26060 Requirement 4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Store-and-Forward VSAT Satellite Resilience, Predictive Anomaly Failure Detection, and Role-Based Access Control (RBAC)
            </p>
          </div>
        </div>

        {/* RBAC Quick Role Switcher */}
        <div className="flex flex-col items-end gap-1.5 shrink-0 font-mono text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Role Selector (RBAC):</span>
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {rolesList.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  addAlert('INFO', `RBAC Role Switched to ${r.name}`, `Permissions updated for user session.`);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-[11px] ${
                  activeRole === r.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={r.title}
              >
                {r.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Role Access Matrix Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <UserCheck className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <span className="text-white font-bold">Current Logged Role: </span>
            <span className="text-purple-400 font-bold">{rolesList.find(r => r.id === activeRole)?.name}</span>
            <span className="text-slate-400 text-[11px] block">{rolesList.find(r => r.id === activeRole)?.title}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className={`px-2.5 py-1 rounded border font-bold ${activeRole === 'COMMANDER' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
            Command Override: {activeRole === 'COMMANDER' ? 'ALLOWED' : 'RESTRICTED'}
          </span>
          <span className={`px-2.5 py-1 rounded border font-bold ${activeRole === 'TECHNICIAN' || activeRole === 'COMMANDER' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
            Breaker Control: {activeRole === 'TECHNICIAN' || activeRole === 'COMMANDER' ? 'ALLOWED' : 'RESTRICTED'}
          </span>
          <span className={`px-2.5 py-1 rounded border font-bold ${activeRole === 'MINISTRY' || activeRole === 'COMMANDER' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>
            Executive Resupply Sign-Off: {activeRole === 'MINISTRY' || activeRole === 'COMMANDER' ? 'ALLOWED' : 'RESTRICTED'}
          </span>
        </div>
      </div>

      {/* Section 1 & 2: Store-and-Forward Satellite Resilience & Predictive Failure Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module 4 Component A: Store-and-Forward / VSAT Satellite Resilience */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Database className="w-4 h-4 text-cyan-400" /> 1. Store-and-Forward & Low-Bandwidth Sync Engine
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${satcomStatus === 'BLACKOUT' ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'}`}>
              SATCOM LINK: {satcomStatus}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400">
            Antarctic VSAT link simulator with station edge caching, Protobuf compression, and mainland batch sync to NCPOR Goa.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Edge Local Buffer</span>
              <p className="text-base font-bold text-cyan-400">{localBufferCount} frames</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Backlog Queue</span>
              <p className={`text-base font-bold ${queueBacklog > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-200'}`}>
                {queueBacklog} batches
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400">Compression Mode</span>
              <p className="text-base font-bold text-emerald-400">{compressionMode}</p>
            </div>
          </div>

          {/* Compression Selector & Blackout Toggle */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Protobuf / Delta Encoding Format:</span>
              <select
                value={compressionMode}
                onChange={(e) => setCompressionMode(e.target.value)}
                className="bg-slate-900 text-white text-xs rounded border border-slate-700 px-2 py-1"
              >
                <option value="PROTOBUF">Protobuf (Binary 8.2x Compression)</option>
                <option value="GZIP">Gzip Compressed JSON (4.1x)</option>
                <option value="JSON">Raw Uncompressed JSON (1.0x)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-bold">Payload Size & Savings:</span>
              <span className="text-emerald-400 font-bold">
                {payloadMetrics?.compressedBytes || 142} bytes / payload ({payloadMetrics?.savingsPct || 88}% bandwidth saved)
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-bold">Simulate Satellite Blackout:</span>
              <button
                onClick={() => {
                  setIsManualBlackout(!isManualBlackout);
                  triggerEdgeAction('BLACKOUT_TOGGLE', `VSAT Link manual blackout simulated from Module 4`);
                }}
                className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
                  isManualBlackout ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isManualBlackout ? 'RESTORE SATCOM LINK' : 'SIMULATE SATCOM BLACKOUT'}
              </button>
            </div>
          </div>

          {/* Batch Sync Stream Log */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
            <span className="text-slate-400 font-bold uppercase block">Mainland Sync Log (NCPOR Gateway, Goa):</span>
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-emerald-400">[SYNC OK] Batch #1428 synced</span>
                <span className="text-slate-500">224 bytes | 750ms lag</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">[SYNC OK] Batch #1429 synced</span>
                <span className="text-slate-500">218 bytes | 742ms lag</span>
              </div>
              {queueBacklog > 0 && (
                <div className="flex justify-between text-amber-400 animate-pulse font-bold">
                  <span>[STORE & FORWARD] Satcom degradation detected. Caching {queueBacklog} batches to local NVMe edge buffer.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module 4 Component B: Predictive Equipment Anomaly & Failure Detection */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> 2. Predictive Equipment Failure Engine (AI Anomalies)
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 font-bold">
              {anomalies.length} Active Anomalies
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400">
            Real-time anomaly detection algorithms analyzing telemetry from DG sets, hydraulic pumps, and heating modules to calculate RUL (Remaining Useful Life) before breakdown.
          </p>

          <div className="space-y-3 font-mono">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className={`p-4 rounded-xl border transition-all ${
                  anom.severity === 'CRITICAL'
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${anom.severity === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="font-bold text-white text-xs">{anom.equipment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 uppercase">{anom.station}</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${anom.severity === 'CRITICAL' ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'}`}>
                      {anom.severity} (RUL {anom.rulPct}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] my-2 text-slate-300">
                  <div>
                    <span className="text-slate-400">Observed Metric: </span>
                    <span className="font-bold text-white">{anom.metric} ({anom.currentVal})</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Threshold: </span>
                    <span className="font-bold text-slate-400">{anom.thresholdVal}</span>
                  </div>
                </div>

                <p className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-500/20">
                  💡 <span className="font-bold">Recommended Action:</span> {anom.suggestedAction}
                </p>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      triggerEdgeAction('PREVENTATIVE_DISPATCH', `Dispatched preventive maintenance override for ${anom.id} (${anom.equipment})`);
                      addAlert('COMMAND', `Preventative Work Order Dispatched`, `Assigned to ${anom.station.toUpperCase()} Maintenance Technician team.`);
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded transition-all shadow"
                  >
                    DISPATCH PREVENTIVE WORK ORDER
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Multi-Channel Alert Dispatch & Emergency Console */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> 3. Multi-Channel Alert Dispatcher & Incident Log
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/30 font-bold">
            Emergency Dispatch Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Dispatch Logs */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-slate-400 font-bold uppercase block">Recent Dispatched Alerts</span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.map((al) => (
                <div key={al.id} className="p-2 rounded bg-slate-900/90 border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        al.type === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : al.type === 'WARNING' ? 'bg-amber-950 text-amber-300' : 'bg-cyan-950 text-cyan-300'
                      }`}>
                        {al.type}
                      </span>
                      <span className="text-white font-bold">{al.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{al.desc}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0">{al.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Emergency Alert Dispatch Trigger */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-slate-400 font-bold uppercase block">Station Commander Emergency Alert Dispatch</span>
            <p className="text-slate-400 text-[11px]">
              Dispatch high-priority alert via VSAT satellite channel, SMS relay, and station acoustic sirens.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => addAlert('CRITICAL', 'EMERGENCY BLIZZARD SHUTDOWN', 'Station Commander issued manual shelter-in-place protocol.')}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded transition-all"
              >
                DISPATCH EMERGENCY SHELTER ALERT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
