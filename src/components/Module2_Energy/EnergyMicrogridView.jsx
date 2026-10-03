import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Zap, Sun, Wind, Fuel, Gauge, AlertTriangle, ShieldCheck, Cpu, ArrowUpRight, Flame, Layers, Sliders } from 'lucide-react';

export function EnergyMicrogridView() {
  const {
    activeStation,
    setActiveStation,
    telemetry,
    history,
    isStormActive,
    isGridFaultActive,
    toggleSmartLoadShedding,
    triggerEdgeAction
  } = useTelemetry();

  const stationData = telemetry[activeStation] || telemetry.bharati;
  const power = stationData.electricCircuits || {};
  const fuel = stationData.fuelStorage || {};

  const totalLoad = power.totalLoadKw || 265;
  const maxCapacity = power.maxCapacityKw || 600;
  const loadPercentage = Math.min(100, Math.round((totalLoad / maxCapacity) * 100));

  const dg1 = power.gen1Output || 180;
  const dg2 = power.gen2Output || 120;
  const solar = power.solarPvOutputKw || 45;
  const wind = power.windTurbineOutputKw || 30;

  // Chart data generation for generation mix breakdown
  const generationData = [
    { name: 'DG Set 1', kw: dg1, type: 'Diesel' },
    { name: 'DG Set 2', kw: dg2, type: 'Diesel' },
    { name: 'Solar PV Array', kw: solar, type: 'Solar' },
    { name: 'Wind Turbines', kw: wind, type: 'Wind' }
  ];

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans">
      
      {/* Module Title Header */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-500 text-white shadow-xl shadow-amber-500/20">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Energy & Microgrid Management <span className="text-amber-400 font-mono text-lg font-normal">| Module 2</span>
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 tracking-wide uppercase">
                SIH26060 Requirement 2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Power Generation Tracking (DG/Solar/Wind), HVAC Load Forecasting, and Fuel Reserve Analytics for {stationData.stationName}
            </p>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeStation === 'bharati'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bharati Microgrid
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeStation === 'maitri'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maitri Microgrid
          </button>
        </div>
      </div>

      {/* KPI Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Total Power Load */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Grid Total Load</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalLoad} <span className="text-sm font-normal text-amber-400">kW</span>
          </div>
          <div className="mt-2 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all ${loadPercentage > 85 ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'}`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Capacity: {maxCapacity} kW</span>
            <span className={loadPercentage > 85 ? 'text-rose-400 font-bold' : 'text-slate-400'}>{loadPercentage}% Load</span>
          </div>
        </div>

        {/* Renewable Energy Contribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Renewable Mix (Solar + Wind)</span>
            <Sun className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {+(solar + wind).toFixed(1)} <span className="text-sm font-normal text-slate-300">kW</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {( (solar + wind) / totalLoad * 100 ).toFixed(1)}% of station load offset by green energy
          </p>
        </div>

        {/* Fuel Storage Remaining */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>ATF / Jet A-1 Fuel Reserve</span>
            <Fuel className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">
            {fuel.totalReserveLiters ? Math.round(fuel.totalReserveLiters).toLocaleString() : '48,500'} <span className="text-sm font-normal text-slate-400">Liters</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Max Tank Capacity: {fuel.maxCapacityLiters ? fuel.maxCapacityLiters.toLocaleString() : '65,000'} L
          </p>
        </div>

        {/* Fuel Days Remaining under Normal / Blizzard */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Operating Days Autonomy</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">{fuel.remainingDaysNormal || 82.5}</span>
            <span className="text-xs text-slate-400">Days (Normal)</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 border-t border-slate-800/80 pt-1">
            <span>Blizzard Autonomy:</span>
            <span className="text-rose-400 font-bold">{fuel.remainingDaysBlizzard || 47.9} Days</span>
          </div>
        </div>
      </div>

      {/* Section 1: Power Generation Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Power Generation Breakdown Cards */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-amber-400" /> 1. Power Generation Monitoring (DG Sets, Solar PV, Wind)
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
              Live Microgrid Generation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            {/* DG Set 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Cummins DG-1 (Primary)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  RUNNING
                </span>
              </div>
              <div className="text-xl font-extrabold text-amber-400">{dg1} kW</div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>Phase Voltage: {power.phaseVoltageA || 230} V</div>
                <div>Frequency: {power.gridFrequencyHz || 50.0} Hz</div>
              </div>
            </div>

            {/* DG Set 2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Cummins DG-2 (Secondary)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  RUNNING
                </span>
              </div>
              <div className="text-xl font-extrabold text-amber-400">{dg2} kW</div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>Phase Voltage: {power.phaseVoltageB || 230} V</div>
                <div>Frequency: {power.gridFrequencyHz || 50.0} Hz</div>
              </div>
            </div>

            {/* Solar PV Array */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Polar Solar PV Array</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                  ACTIVE
                </span>
              </div>
              <div className="text-xl font-extrabold text-cyan-400">{solar} kW</div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>Irradiance: {stationData.atmospheric?.solarIrradiance || 340} W/m²</div>
                <div>Panel Angle: 65° South-facing</div>
              </div>
            </div>

            {/* Wind Turbines */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Antarctic Wind Turbines</span>
                <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30 text-[10px]">
                  ACTIVE
                </span>
              </div>
              <div className="text-xl font-extrabold text-teal-300">{wind} kW</div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>Wind Speed: {stationData.aws?.windSpeedKnots || stationData.atmospheric?.windSpeedKnots || 32} knots</div>
                <div>Pitch Angle: Auto-feathered</div>
              </div>
            </div>
          </div>

          {/* Bar Chart comparison */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'kW Output', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="kw" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Power Output (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 2: Load Forecasting & Optimization */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sliders className="w-4 h-4 text-cyan-400" /> 2. Load Forecasting & Smart Optimization
            </div>
            <button
              onClick={() => toggleSmartLoadShedding(activeStation)}
              className={`text-[10px] font-mono px-3 py-1 rounded-lg font-bold transition-all border ${
                power.smartLoadSheddingActive
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md animate-pulse'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {power.smartLoadSheddingActive ? 'LOAD SHEDDING: ACTIVE' : 'ENABLE SMART LOAD SHED'}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <p className="text-slate-400">Station Subsystem Consumption Breakdown:</p>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>HVAC & Primary Heating Loop</span>
                  <span className="font-bold text-amber-400">110 kW (41.5%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '41.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Critical Science Laboratories</span>
                  <span className="font-bold text-cyan-400">78.5 kW (29.6%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: '29.6%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Living Quarters & Mess Hall</span>
                  <span className="font-bold text-teal-400">52.2 kW (19.7%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-teal-400 h-full" style={{ width: '19.7%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Utility & Communications Tower</span>
                  <span className="font-bold text-purple-400">24.5 kW (9.2%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-purple-400 h-full" style={{ width: '9.2%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Load Trend Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <p className="text-xs font-mono text-slate-300 font-bold">Live Grid Power Demand Trend (kW)</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', color: '#fff' }} />
                  <Area type="monotone" dataKey={activeStation === 'bharati' ? 'bharatiLoad' : 'maitriLoad'} stroke="#f59e0b" fillOpacity={1} fill="url(#loadGrad)" name="Total Load (kW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Fuel Reserve & Consumption Analytics */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Fuel className="w-4 h-4 text-cyan-400" /> 3. Fuel Reserve & Burn Rate Analytics
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            Fuel Type: {fuel.fuelType || 'Polar Grade ATF / Jet A-1'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
          {/* Burn Rate Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-slate-400 font-bold uppercase">Burn Rate Analytics</span>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Normal Burn Rate:</span>
                <span className="text-emerald-400 font-extrabold text-sm">{fuel.currentBurnRateLh || 24.5} L/hr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Blizzard Burn Rate:</span>
                <span className="text-rose-400 font-extrabold text-sm">{fuel.blizzardBurnRateLh || 42.1} L/hr</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Daily Normal Consumption:</span>
                <span>{+((fuel.currentBurnRateLh || 24.5) * 24).toFixed(0)} Liters/Day</span>
              </div>
            </div>
          </div>

          {/* Tank Quality & Status */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-slate-400 font-bold uppercase">Storage Tank Health</span>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Fuel Quality Purity:</span>
                <span className="text-cyan-300 font-extrabold text-sm">{fuel.fuelQualityPurityPct || 99.4}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Water Contamination:</span>
                <span className="text-emerald-400 font-extrabold text-sm">0.02% (Passed)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Fuel Heater Temp:</span>
                <span>+12.4°C (Anti-gelling active)</span>
              </div>
            </div>
          </div>

          {/* Autonomy Forecast Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-slate-400 font-bold uppercase">Replenishment Countdown</span>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Expedition Ship ETA:</span>
                <span className="text-amber-400 font-extrabold text-sm">34 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Autonomy Margin:</span>
                <span className="text-emerald-400 font-extrabold text-sm">+48.5 Days Buffer</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Refuel Vessel:</span>
                <span>MV Vasiliy Golovnin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
