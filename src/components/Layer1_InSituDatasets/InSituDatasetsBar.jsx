import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Database, Gauge, Zap, Radio, CloudSnow, Compass } from 'lucide-react';

export function InSituDatasetsBar() {
  const { telemetry } = useTelemetry();

  const maitriGps = telemetry?.maitri?.gpsSurface || {};
  const maitriPower = telemetry?.maitri?.electricCircuits || {};
  const maitriRio = telemetry?.maitri?.riometer || {};
  const maitriAtmo = telemetry?.maitri?.atmospheric || {};
  const bharatiAws = telemetry?.bharati?.aws || {};

  return (
    <div className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-purple-500/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            Antarctic Station In-Situ Datasets (Live Raw Sensors Stream)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 animate-pulse">
          5 Active In-Situ Sensor Streams
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Stream 1: Maitri U-8-S Surface Data */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-purple-900/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <Compass className="w-3 h-3" /> Maitri U-8-S Surface
            </span>
            <span className="text-purple-300 font-bold">{maitriGps.driftX} mm/yr</span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
            <p className="flex justify-between">
              <span>Glacier Drift:</span>
              <strong className="text-purple-300">X: {maitriGps.driftX}, Y: {maitriGps.driftY}</strong>
            </p>
            <p className="flex justify-between">
              <span>Foundation Tilt:</span>
              <strong className="text-slate-200">{maitriGps.foundationTilt}°</strong>
            </p>
            <p className="flex justify-between">
              <span>Pillar Strain:</span>
              <strong className="text-emerald-400">{maitriGps.pillarStrain}%</strong>
            </p>
          </div>
        </div>

        {/* Stream 2: Maitri Electric Circuits */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-purple-900/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Zap className="w-3 h-3" /> Maitri Microgrid
            </span>
            <span className="text-amber-300 font-bold">{maitriPower.totalLoadKw} kW</span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
            <p className="flex justify-between">
              <span>Gen 1 / Gen 2:</span>
              <strong className="text-amber-300">{maitriPower.gen1Output} / {maitriPower.gen2Output} kW</strong>
            </p>
            <p className="flex justify-between">
              <span>Voltage Ph-A:</span>
              <strong className="text-slate-200">{maitriPower.phaseVoltageA} V</strong>
            </p>
            <p className="flex justify-between">
              <span>Fuel Reserve:</span>
              <strong className="text-emerald-400">{maitriPower.fuelReserveLiters?.toLocaleString()} L</strong>
            </p>
          </div>
        </div>

        {/* Stream 3: Maitri Riometer Data */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-purple-900/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <Radio className="w-3 h-3" /> Maitri Riometer
            </span>
            <span className={`font-bold ${maitriRio.absorptionDb > 3 ? 'text-rose-400' : 'text-cyan-300'}`}>
              {maitriRio.absorptionDb} dB
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
            <p className="flex justify-between">
              <span>Particle Flux:</span>
              <strong className="text-cyan-300">{maitriRio.solarParticleFlux} pfu</strong>
            </p>
            <p className="flex justify-between">
              <span>Solar Flare:</span>
              <strong className={maitriRio.solarFlareState === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {maitriRio.solarFlareState}
              </strong>
            </p>
            <p className="flex justify-between">
              <span>SATCOM Loss:</span>
              <strong className="text-amber-300">-{maitriRio.satcomDegradationDb} dB</strong>
            </p>
          </div>
        </div>

        {/* Stream 4: Maitri Atmospheric Sensors */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-purple-900/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Gauge className="w-3 h-3" /> Atmospheric Sensors
            </span>
            <span className="text-emerald-300 font-bold">{maitriAtmo.ambientTemp}°C</span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
            <p className="flex justify-between">
              <span>Humidity:</span>
              <strong className="text-slate-200">{maitriAtmo.humidity}%</strong>
            </p>
            <p className="flex justify-between">
              <span>Solar Irrad.:</span>
              <strong className="text-emerald-300">{maitriAtmo.solarIrradiance} W/m²</strong>
            </p>
            <p className="flex justify-between">
              <span>Living Temp:</span>
              <strong className="text-cyan-300">{maitriAtmo.livingTemp}°C</strong>
            </p>
          </div>
        </div>

        {/* Stream 5: Bharati AWS Weather Station */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-purple-900/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              <CloudSnow className="w-3 h-3" /> Bharati AWS
            </span>
            <span className="text-blue-300 font-bold">{bharatiAws.windSpeedKnots} kts</span>
          </div>
          <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
            <p className="flex justify-between">
              <span>Wind Gust:</span>
              <strong className="text-blue-300">{bharatiAws.gustSpeedKnots} kts</strong>
            </p>
            <p className="flex justify-between">
              <span>Pressure:</span>
              <strong className="text-slate-200">{bharatiAws.barometricPressureHpa} hPa</strong>
            </p>
            <p className="flex justify-between">
              <span>Blizzard Threat:</span>
              <strong className={bharatiAws.blizzardSeverity === 'EXTREME' ? 'text-rose-400 font-bold' : 'text-amber-300'}>
                {bharatiAws.blizzardSeverity}
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
