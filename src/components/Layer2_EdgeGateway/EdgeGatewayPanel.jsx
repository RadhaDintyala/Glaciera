import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Cpu, HardDrive, Layers, Zap } from 'lucide-react';

export function EdgeGatewayPanel() {
  const { compressionMode, setCompressionMode, payloadMetrics, localBufferCount, queueBacklog, satcomStatus } = useTelemetry();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Local Station Edge Gateway</h3>
            <p className="text-[11px] font-mono text-slate-400">Antarctic Ingestion & Payload Serialization</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Layer 2 Component
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Protocol Ingestion Status */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <p className="text-[10px] font-mono text-slate-400 mb-1">Telemetry Protocols</p>
          <div className="flex flex-wrap gap-1 text-[10px] font-mono font-semibold text-cyan-300">
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">CSV</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">JSON</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">Modbus</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">MQTT</span>
          </div>
        </div>

        {/* Local SQLite Buffer */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <p className="text-[10px] font-mono text-slate-400 mb-1">Local SQLite Buffer</p>
          <p className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            {localBufferCount.toLocaleString()} ticks
          </p>
        </div>

        {/* Store-and-Forward Queue */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <p className="text-[10px] font-mono text-slate-400 mb-1">Store-and-Forward Queue</p>
          <p className={`text-sm font-bold font-mono ${queueBacklog > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {queueBacklog} packets queued
          </p>
        </div>

        {/* Compression Efficiency */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <p className="text-[10px] font-mono text-slate-400 mb-1">Bandwidth Saved</p>
          <p className="text-sm font-bold font-mono text-emerald-400">
            {payloadMetrics.compressionRatio}
          </p>
        </div>
      </div>

      {/* Serialization Selector & Byte Savings Breakdown */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300">Payload Serialization:</span>
          <select
            value={compressionMode}
            onChange={(e) => setCompressionMode(e.target.value)}
            className="bg-slate-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono rounded px-2.5 py-1 focus:outline-none"
          >
            <option value="PROTOBUF">Protobuf Binary (Schema)</option>
            <option value="GZIP">Gzip Stream (Deflate)</option>
            <option value="FLATBUFFERS">FlatBuffers Zero-Copy</option>
            <option value="RAW">Raw JSON (Uncompressed)</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
          <span>Raw: <strong className="text-slate-200">{payloadMetrics.rawBytes} B</strong></span>
          <span>→</span>
          <span>Compressed: <strong className="text-cyan-400">{payloadMetrics.compressedBytes} B</strong></span>
          <span className="text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
            Saved {payloadMetrics.bytesSaved} B / tick
          </span>
        </div>
      </div>
    </div>
  );
}
