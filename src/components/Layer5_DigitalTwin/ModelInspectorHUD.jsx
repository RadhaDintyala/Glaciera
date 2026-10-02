import React from 'react';
import { Box, Layers, Activity, Cpu, X, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * Real-Time Object & Mesh Inspector HUD Overlay for GLB 3D Models
 */
export function ModelInspectorHUD({ selectedObject, hoveredObject, onClose }) {
  const target = selectedObject || hoveredObject;
  if (!target) return null;

  const { meshName, meta, point, boundingInfo, hasAnimations, availableAnimations } = target;

  return (
    <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {meta?.label || meshName}
            </h4>
            <p className="text-[10px] font-mono text-cyan-400">
              Mesh Node: <span className="font-semibold text-white">{meshName}</span>
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Component Type</span>
            <span className="text-slate-200 font-medium">{meta?.type || 'Mesh Node'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Subsystem</span>
            <span className="text-cyan-300 font-medium">{meta?.system || 'Structural'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Material Spec</span>
            <span className="text-slate-200 font-medium truncate block">{meta?.material || 'PBR Standard'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Health Status</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {meta?.status || 'Nominal'}
            </span>
          </div>
        </div>

        {boundingInfo && (
          <div className="flex items-center justify-between bg-slate-950/40 px-3 py-1.5 rounded-md text-[10px] font-mono text-slate-400 border border-slate-800/50">
            <span>Dimensions (WxHxD):</span>
            <span className="text-cyan-300 font-semibold">
              {boundingInfo.dimensions.width}m × {boundingInfo.dimensions.height}m × {boundingInfo.dimensions.depth}m
            </span>
          </div>
        )}

        {point && (
          <div className="flex items-center justify-between bg-slate-950/40 px-3 py-1.5 rounded-md text-[10px] font-mono text-slate-400 border border-slate-800/50">
            <span>Hit Position (X,Y,Z):</span>
            <span className="text-emerald-300 font-semibold">
              [{point.join(', ')}]
            </span>
          </div>
        )}

        {hasAnimations && (
          <div className="bg-purple-950/40 border border-purple-500/30 p-2 rounded-md text-[10px] font-mono text-purple-300">
            <span className="font-bold block">Embedded Animation Track Detected</span>
            <span className="text-slate-300">{availableAnimations.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" /> Native GLB Mesh Asset Verified
        </span>
        <span className="text-cyan-400 animate-pulse">● Live Telemetry</span>
      </div>
    </div>
  );
}
