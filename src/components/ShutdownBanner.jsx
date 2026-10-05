import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Power } from 'lucide-react';

// Shared banner: renders nothing normally, shows an engineering-grade shutdown banner
// on base views when the Remote Access panel trips the grid.
export function ShutdownBanner({ station }) {
  const { isBaseShutdown } = useTelemetry();
  if (!isBaseShutdown) return null;
  return (
    <div className="bg-[#1A1215] border border-rose-500/50 rounded-xl p-4 flex items-center justify-between gap-4 text-white shadow-lg animate-fade-in font-sans">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
          <Power className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <p className="text-xs sm:text-sm font-bold text-rose-300 font-mono uppercase tracking-wider">
              Base Grid Shutdown Latched — {station || 'Station'} Offline
            </p>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Main 11kV bus tripped via Remote Access matrix. All sector loads collapsed to 0 kW, breakers TRIPPED, SATCOM BLACKOUT.
          </p>
        </div>
      </div>
      <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-[#0B0D11] border border-rose-500/30 text-[10px] font-mono text-rose-400 uppercase tracking-widest font-semibold shrink-0">
        Tripped: 11kV Substation
      </span>
    </div>
  );
}
