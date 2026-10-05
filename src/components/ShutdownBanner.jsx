import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { Power } from 'lucide-react';

// Shared banner: renders nothing normally, shows a red shutdown strip
// on base views when the Crisis Management panel trips the grid.
export function ShutdownBanner({ station }) {
  const { isBaseShutdown } = useTelemetry();
  if (!isBaseShutdown) return null;
  return (
    <div className="bg-red-950/50 border-2 border-red-600 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
      <span className="p-2 rounded-lg bg-red-600 text-white shrink-0">
        <Power className="w-5 h-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-red-300 font-mono uppercase tracking-widest">
          ■ Base Grid Shutdown — {station || 'Station'} Offline
        </p>
        <p className="text-[11px] text-red-200/80 font-mono">
          Main 11kV bus tripped via Crisis Management panel. All loads at 0 kW, breakers TRIPPED, SATCOM BLACKOUT.
        </p>
      </div>
    </div>
  );
}
