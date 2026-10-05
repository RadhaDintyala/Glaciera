import React from 'react';
import { Html, useProgress } from '@react-three/drei';

/**
 * High-Clarity Suspense Loading Indicator for 3D GLB Models
 */
export function ModelLoadingFallback({ message = 'Loading 3D Model Asset...' }) {
  const { progress, active } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-[#12161D]/95 backdrop-blur-lg rounded-xl border border-[#202632] shadow-2xl min-w-[260px] text-center font-sans">
        <div className="relative w-12 h-12 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#202632] border-t-sky-400 animate-spin" />
          <span className="text-[11px] font-mono font-bold text-sky-400">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-xs font-mono font-semibold text-white tracking-wide uppercase">
          {message}
        </p>
        <p className="text-[10px] font-mono text-slate-400 mt-1">
          {active ? 'Parsing WebGL Geometries & Textures' : 'Finalizing Scene Graph'}
        </p>
        {/* Progress Bar */}
        <div className="w-full bg-[#0B0D11] rounded-full h-1.5 mt-3 overflow-hidden border border-[#202632]">
          <div
            className="bg-sky-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
      </div>
    </Html>
  );
}
