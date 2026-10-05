import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Radio, Database, ShieldAlert, Cpu, Lock, UserCheck, RefreshCw,
  Send, CheckCircle2, AlertTriangle, Activity, Sliders, Zap, Wifi, SignalHigh, Server
} from 'lucide-react';

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
  const anomalies = telemetry?.predictiveAnomalies || [];

  const rolesList = [
    { id: 'COMMANDER', name: 'Station Commander', title: 'Full Station Command & Emergency Authority' },
    { id: 'TECHNICIAN', name: 'Maintenance Technician', title: 'Telemetry, Breakers & Machinery Diagnostics' },
    { id: 'SCIENTIST', name: 'Mainland Scientist', title: 'In-Situ Research Datasets & Space Weather' },
    { id: 'MINISTRY', name: 'Ministry Administrator / NCPOR', title: 'Executive Overview & Multi-Station Auditing' }
  ];

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans bg-[#0B0D11] min-h-screen text-[#F8FAFC]">
      
      {/* Title Header Banner */}
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 sm:p-6 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632] shadow-sm">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Low-Bandwidth Sync & Predictive Maintenance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#181D26] text-slate-300 border border-[#202632] tracking-wider uppercase">
                SIH26060 Module 4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Store-and-Forward VSAT Satellite Resilience, Predictive Anomaly Failure Detection, and Role-Based Access Control (RBAC)
            </p>
          </div>
        </div>

        {/* RBAC Quick Role Switcher */}
        <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0 font-mono text-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Role Selector (RBAC):</span>
          <div className="flex items-center bg-[#0B0D11] p-1 rounded-xl border border-[#202632]">
            {rolesList.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  addAlert('INFO', `RBAC Role Switched to ${r.name}`, `Permissions updated for user session.`);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all text-xs font-sans ${
                  activeRole === r.id
                    ? 'bg-white text-neutral-950 font-semibold shadow-sm'
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
      <div className="bg-[#12161D] border border-[#202632] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-300 font-medium">Logged Role: </span>
            <span className="text-white font-bold">{rolesList.find(r => r.id === activeRole)?.name}</span>
            <span className="text-slate-400 text-[11px] block">{rolesList.find(r => r.id === activeRole)?.title}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className={`px-2.5 py-1 rounded border font-semibold ${
            activeRole === 'COMMANDER' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[#0B0D11] text-slate-500 border-[#202632]'
          }`}>
            Command Override: {activeRole === 'COMMANDER' ? 'PERMITTED' : 'RESTRICTED'}
          </span>
          <span className={`px-2.5 py-1 rounded border font-semibold ${
            activeRole === 'TECHNICIAN' || activeRole === 'COMMANDER' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[#0B0D11] text-slate-500 border-[#202632]'
          }`}>
            Breaker Control: {activeRole === 'TECHNICIAN' || activeRole === 'COMMANDER' ? 'PERMITTED' : 'RESTRICTED'}
          </span>
          <span className={`px-2.5 py-1 rounded border font-semibold ${
            activeRole === 'MINISTRY' || activeRole === 'COMMANDER' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[#0B0D11] text-slate-500 border-[#202632]'
          }`}>
            Resupply Sign-Off: {activeRole === 'MINISTRY' || activeRole === 'COMMANDER' ? 'PERMITTED' : 'RESTRICTED'}
          </span>
        </div>
      </div>

      {/* Section 1 & 2: Store-and-Forward Satellite Resilience & Predictive Failure Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module 4 Component A: Store-and-Forward / VSAT Satellite Resilience */}
        <div className="lg:col-span-6 bg-[#12161D] border border-[#202632] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202632] pb-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Database className="w-4 h-4 text-sky-400" /> 1. Store-and-Forward & Low-Bandwidth Sync Engine
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
              satcomStatus === 'BLACKOUT'
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
            }`}>
              SATCOM: {satcomStatus}
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400">
            Antarctic VSAT link simulator with station edge caching, Protobuf compression, and mainland batch sync to NCPOR Goa.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-[#181D26] p-3 rounded-xl border border-[#202632]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Edge Local Buffer</span>
              <p className="text-base font-bold text-sky-400 mt-1">{localBufferCount} frames</p>
            </div>

            <div className="bg-[#181D26] p-3 rounded-xl border border-[#202632]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Backlog Queue</span>
              <p className={`text-base font-bold mt-1 ${queueBacklog > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {queueBacklog} batches
              </p>
            </div>

            <div className="bg-[#181D26] p-3 rounded-xl border border-[#202632]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Compression Mode</span>
              <p className="text-base font-bold text-emerald-400 mt-1">{compressionMode}</p>
            </div>
          </div>

          {/* Compression Selector & Blackout Toggle */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Protobuf / Delta Encoding Format:</span>
              <select
                value={compressionMode}
                onChange={(e) => setCompressionMode(e.target.value)}
                className="bg-[#0B0D11] text-white text-xs rounded-lg border border-[#202632] px-2.5 py-1.5 focus:outline-none focus:border-sky-400"
              >
                <option value="PROTOBUF">Protobuf (Binary 8.2x Compression)</option>
                <option value="GZIP">Gzip Compressed JSON (4.1x)</option>
                <option value="JSON">Raw Uncompressed JSON (1.0x)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#202632]">
              <span className="text-slate-300 font-medium">Payload Size & Savings:</span>
              <span className="text-emerald-400 font-bold">
                {payloadMetrics?.compressedBytes || 142} bytes / payload ({payloadMetrics?.savingsPct || 88}% bandwidth saved)
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#202632]">
              <span className="text-slate-300 font-medium">Simulate Satellite Blackout:</span>
              <button
                onClick={() => {
                  setIsManualBlackout(!isManualBlackout);
                  triggerEdgeAction('BLACKOUT_TOGGLE', `VSAT Link manual blackout simulated from Module 4`);
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                  isManualBlackout
                    ? 'btn-primary-clean'
                    : 'btn-secondary-clean'
                }`}
              >
                {isManualBlackout ? 'RESTORE SATCOM LINK' : 'SIMULATE SATCOM BLACKOUT'}
              </button>
            </div>
          </div>

          {/* Batch Sync Stream Log */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-2 font-mono text-[11px]">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Mainland Sync Log (NCPOR Gateway, Goa):</span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-emerald-400">[SYNC OK] Batch #1428 synced</span>
                <span className="text-slate-500">224 bytes | 750ms lag</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">[SYNC OK] Batch #1429 synced</span>
                <span className="text-slate-500">218 bytes | 742ms lag</span>
              </div>
              {queueBacklog > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>[STORE & FORWARD] Satcom degradation detected. Caching {queueBacklog} batches to local NVMe edge buffer.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module 4 Component B: Predictive Equipment Anomaly & Failure Detection */}
        <div className="lg:col-span-6 bg-[#12161D] border border-[#202632] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202632] pb-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-sky-400" /> 2. Predictive Equipment Failure Engine (AI Anomalies)
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold">
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
                    ? 'bg-[#1A1215] border-rose-500/40'
                    : 'bg-[#181D26] border-[#202632] hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202632] pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${anom.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    <span className="font-bold text-white text-xs">{anom.equipment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[#0B0D11] text-slate-300 uppercase border border-[#202632]">{anom.station}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold border ${
                      anom.severity === 'CRITICAL' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
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

                <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 font-sans">
                  💡 <span className="font-semibold">Recommended Action:</span> {anom.suggestedAction}
                </p>

                <div className="flex justify-end mt-2.5">
                  <button
                    onClick={() => {
                      triggerEdgeAction('PREVENTATIVE_DISPATCH', `Dispatched preventive maintenance override for ${anom.id} (${anom.equipment})`);
                      addAlert('COMMAND', `Preventative Work Order Dispatched`, `Assigned to ${anom.station.toUpperCase()} Maintenance Technician team.`);
                    }}
                    className="btn-secondary-clean px-3 py-1.5 text-[10px] font-semibold font-mono rounded-lg transition-all cursor-pointer"
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
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#202632] pb-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-sky-400" /> 3. Multi-Channel Alert Dispatcher & Incident Log
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-semibold">
            Emergency Dispatch Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Dispatch Logs */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3">
            <span className="text-slate-400 font-semibold uppercase tracking-wider block">Recent Dispatched Alerts</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div key={al.id} className="p-2.5 rounded-lg bg-[#12161D] border border-[#202632] flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                        al.type === 'CRITICAL' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : al.type === 'WARNING' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      }`}>
                        {al.type}
                      </span>
                      <span className="text-white font-semibold">{al.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">{al.desc}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 shrink-0">{al.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Emergency Alert Dispatch Trigger */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-slate-300 font-semibold uppercase tracking-wider block">Station Commander Emergency Alert Dispatch</span>
              <p className="text-slate-400 text-xs font-sans mt-1 leading-relaxed">
                Dispatch high-priority alert via VSAT satellite channel, SMS relay, and station acoustic sirens.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => addAlert('CRITICAL', 'EMERGENCY BLIZZARD SHUTDOWN', 'Station Commander issued manual shelter-in-place protocol.')}
                className="btn-primary-clean w-full py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer uppercase tracking-wider"
              >
                Dispatch Emergency Shelter Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
