import React from 'react';
import { Html, useProgress } from '@react-three/drei';

/**
 * High-Clarity Suspense Loading Indicator for 3D GLB Models
 */
export function ModelLoadingFallback({ message = 'Loading 3D Model Asset...' }) {
  const { progress, active } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900/95 backdrop-blur-lg rounded-xl border border-cyan-500/40 shadow-2xl min-w-[260px] text-center">
        <div className="relative w-12 h-12 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <span className="text-[11px] font-mono font-bold text-cyan-300">
            {Math.round(progress)}%
          </span>
        </div>
        <p className="text-xs font-mono font-semibold text-white tracking-wide uppercase">
          {message}
        </p>
        <p className="text-[10px] font-mono text-cyan-400/80 mt-1">
          {active ? 'Parsing WebGL Geometries & Textures' : 'Finalizing Scene Graph'}
        </p>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-700">
          <div
            className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
      </div>
    </Html>
  );
}
