import React from 'react';
import { Clock, ShieldAlert, Sparkles, Box, ArrowRight, Construction } from 'lucide-react';

export function MaitriStationView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-8 animate-fade-in font-sans">
      
      {/* High-Tech Coming Soon Card */}
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/40 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glowing Background Radial */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-400 shadow-xl shadow-amber-500/10 animate-bounce">
            <Construction className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 2 Integration
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Maitri Antarctic Station <span className="text-amber-400 block sm:inline font-mono">Digital Twin</span>
          </h1>
          <p className="text-lg font-semibold text-amber-300 font-mono">
            COMING SOON
          </p>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            The 3D WebGL Digital Twin & telemetry telemetry stream for Maitri Station (Schirmacher Oasis) is currently undergoing Phase 2 telemetry calibration and VSAT bandwidth optimization.
          </p>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-4">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase block">Active Node</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">Bharati Station (3D Twin Live)</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase block">Target Release</span>
            <span className="text-sm font-bold text-amber-300 font-mono">Phase 2 Update</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase block">Telemetry Protocol</span>
            <span className="text-sm font-bold text-emerald-300 font-mono">Protobuf + VSAT Stream</span>
          </div>
        </div>

      </div>

    </div>
  );
}
