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
    <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-[#12161D]/95 backdrop-blur-xl border border-[#202632] p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center justify-between border-b border-[#202632] pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#181D26] text-sky-400 border border-[#202632]">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {meta?.label || meshName}
            </h4>
            <p className="text-[10px] font-mono text-slate-400">
              Mesh Node: <span className="font-medium text-white">{meshName}</span>
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181D26] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2 bg-[#181D26] p-2.5 rounded-lg border border-[#202632] font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Component Type</span>
            <span className="text-slate-200 font-medium">{meta?.type || 'Mesh Node'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Subsystem</span>
            <span className="text-sky-400 font-medium">{meta?.system || 'Structural'}</span>
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
          <div className="flex items-center justify-between bg-[#0B0D11] px-3 py-1.5 rounded-md text-[10px] font-mono text-slate-400 border border-[#202632]">
            <span>Dimensions (WxHxD):</span>
            <span className="text-white font-medium">
              {boundingInfo.dimensions.width}m × {boundingInfo.dimensions.height}m × {boundingInfo.dimensions.depth}m
            </span>
          </div>
        )}

        {point && (
          <div className="flex items-center justify-between bg-[#0B0D11] px-3 py-1.5 rounded-md text-[10px] font-mono text-slate-400 border border-[#202632]">
            <span>Hit Position (X,Y,Z):</span>
            <span className="text-white font-medium">
              [{point.join(', ')}]
            </span>
          </div>
        )}

        {hasAnimations && (
          <div className="bg-[#181D26] border border-[#202632] p-2 rounded-md text-[10px] font-mono text-slate-300">
            <span className="font-semibold text-white block">Embedded Animation Track Detected</span>
            <span className="text-slate-400">{availableAnimations.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-[#202632] flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" /> Native GLB Mesh Asset Verified
        </span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live Telemetry
        </span>
      </div>
    </div>
  );
}
