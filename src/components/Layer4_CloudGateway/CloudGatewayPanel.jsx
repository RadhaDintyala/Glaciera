import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Server, Database, Activity, Wifi, ShieldAlert, CheckCircle2, Command } from 'lucide-react';

export function CloudGatewayPanel() {
  const { alerts, satcomStatus, localBufferCount, queueBacklog } = useTelemetry();

  // Simulated live ingestion stats
  const activeSockets = satcomStatus === 'BLACKOUT' ? 0 : 42;
  const ingestRate = satcomStatus === 'BLACKOUT' ? 0 : satcomStatus === 'DEGRADED' ? 14 : 68; // msgs/sec
  const timescaleWrites = (localBufferCount * 12).toLocaleString();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-950 text-teal-400 border border-teal-500/30">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">NCPOR Cloud Gateway & Web Portal Ingestion</h3>
            <p className="text-[11px] font-mono text-slate-400">Layer 4 Ingestion API, TimescaleDB & Socket.IO Engine</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Layer 4 Component
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        {/* 1. Ingestion API Gateway */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Ingestion API Gateway</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Express
            </span>
          </div>
          <p className="text-sm font-bold font-mono text-white flex items-center justify-between">
            <span>{ingestRate} msgs/sec</span>
            <span className="text-xs text-teal-400 font-mono">POST /api/v1/stream</span>
          </p>
        </div>

        {/* 2. Time-Series DB (InfluxDB / TimescaleDB) */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Time-Series DB</span>
            <span className="text-cyan-400 font-bold">TimescaleDB</span>
          </div>
          <p className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            {timescaleWrites} records
          </p>
        </div>

        {/* 3. WebSocket Streaming Server */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Socket.IO Server</span>
            <span className={`text-[10px] font-bold ${activeSockets > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {activeSockets > 0 ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          <p className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-teal-400" />
            {activeSockets} active subscribers
          </p>
        </div>

        {/* 4. Alert & Anomaly Engine */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Alert & Anomaly Engine</span>
            <span className="text-amber-400 font-bold">Rule Engine ACTIVE</span>
          </div>
          <p className="text-sm font-bold font-mono text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            {alerts.length} triggers evaluated
          </p>
        </div>
      </div>

      {/* Standing Level 2 Commands Queue Status */}
      <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Command className="w-4 h-4 text-purple-400" />
          <span>Standing Level 2 Control Channel:</span>
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-semibold">
            SYNCHRONIZED (Bi-directional RPC)
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>Edge Backlog: <strong className={queueBacklog > 0 ? 'text-rose-400' : 'text-emerald-400'}>{queueBacklog} pkts</strong></span>
          <span>•</span>
          <span>Last Ingest Pulse: <strong className="text-teal-300">{new Date().toLocaleTimeString()}</strong></span>
        </div>
      </div>
    </div>
  );
}
