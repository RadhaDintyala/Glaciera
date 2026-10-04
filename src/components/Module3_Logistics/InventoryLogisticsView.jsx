import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShoppingBag, Anchor, Droplets, HeartPulse, Sparkles, AlertTriangle, ShieldCheck, Truck, Flame, Box, Calendar, Clock, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export function InventoryLogisticsView() {
  const {
    activeStation,
    setActiveStation,
    telemetry,
    triggerEdgeAction
  } = useTelemetry();

  const stationData = telemetry[activeStation] || telemetry.bharati;
  const inventory = stationData.inventory || {};
  const lifeSupport = stationData.lifeSupport || {};
  const resupply = telemetry.expeditionResupply || {};

  const [activeSubTab, setActiveSubTab] = useState('rations'); // 'rations' | 'medical' | 'scientific' | 'spares'
  const [manifestStatus, setManifestStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'

  const handleSubmitManifest = () => {
    setManifestStatus('submitting');
    triggerEdgeAction('SUBMIT_RESUPPLY_ORDER', `Priority ration and spare parts manifest submitted to ${stationData.stationName}`);
    setTimeout(() => {
      setManifestStatus('success');
      setTimeout(() => {
        setManifestStatus('idle');
      }, 4500);
    }, 600);
  };

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans bg-slate-50 min-h-screen text-slate-800">
      
      {/* Title Header Banner - Glossy Sky Blue Finish */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 border border-sky-400/40 rounded-3xl p-6 text-white shadow-xl shadow-sky-500/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                Inventory, Supply Chain & Life Support Logistics
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white border border-white/40 tracking-wider uppercase backdrop-blur-sm">
                SIH26060 Module 3
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 font-sans mt-1 opacity-95">
              Consumables & Rations Tracking, Annual Expedition Resupply Scheduling, and Critical Life Support Auditing for {stationData.stationName}
            </p>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center bg-white/20 p-1.5 rounded-2xl border border-white/30 shrink-0 font-sans text-xs backdrop-blur-md shadow-inner">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
              activeStation === 'bharati'
                ? 'bg-white text-sky-700 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Bharati Station
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 ${
              activeStation === 'maitri'
                ? 'bg-white text-sky-700 shadow-md scale-105'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Maitri Station
          </button>
        </div>
      </div>

      {/* Top Level Logistics Status Grid - Clean White Cards with Sky Blue Gloss */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ration Stock Days */}
        <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Ration Stock Autonomy</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {inventory.rationsDays || 180} <span className="text-sm font-semibold text-sky-600">Days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-cyan-500 h-full rounded-full" style={{ width: '75%' }} />
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ration Supply Status: OPTIMAL
          </span>
        </div>

        {/* Medical Stock Days */}
        <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/50 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Medical Autonomy</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {inventory.medicalDays || 210} <span className="text-sm font-semibold text-rose-500">Days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Trauma Kits & Oxygen: FULL
          </span>
        </div>

        {/* Fresh Water Generation */}
        <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Fresh Water Output</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-700 font-mono">
            {lifeSupport.roDesalinationLitersDay ? lifeSupport.roDesalinationLitersDay.toLocaleString() : '12,450'} <span className="text-sm font-semibold text-slate-500">L/Day</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-sky-500 h-full rounded-full" style={{ width: `${lifeSupport.waterTankLevelPct || 88}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Tank Level: {lifeSupport.waterTankLevelPct || 88}% ({lifeSupport.waterPurityPpm || 12} ppm purity)
          </span>
        </div>

        {/* Expedition Resupply Vessel ETA */}
        <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/60 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Ship Arrival ETA</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Anchor className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono">
            {resupply.etaDays || 34} <span className="text-sm font-semibold text-slate-500">Days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full" style={{ width: `${resupply.progressPct || 58}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-2 block">
            Vessel: {resupply.vesselName || 'MV Vasiliy Golovnin'}
          </span>
        </div>
      </div>

      {/* Section 1 & 2: Consumables Tracker & Resupply Voyage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Consumables Inventory Categories - White Card with Glossy Sky Blue Tabs */}
        <div className="lg:col-span-7 bg-white border border-sky-100 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Box className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                1. Consumables & Ration Inventory Tracker
              </h2>
            </div>

            {/* Glossy Sky Blue Subtab Controls */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setActiveSubTab('rations')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  activeSubTab === 'rations' ? 'bg-[#0284c7] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rations
              </button>
              <button
                onClick={() => setActiveSubTab('medical')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  activeSubTab === 'medical' ? 'bg-[#0284c7] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => setActiveSubTab('scientific')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  activeSubTab === 'scientific' ? 'bg-[#0284c7] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Scientific
              </button>
              <button
                onClick={() => setActiveSubTab('spares')}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                  activeSubTab === 'spares' ? 'bg-[#0284c7] text-white font-bold shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spares
              </button>
            </div>
          </div>

          {/* Rations Category Details */}
          {activeSubTab === 'rations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Freeze-Dried Meals</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.freezeDriedKg || 3850} kg</p>
                <p className="text-[11px] text-slate-500">Expedition Grade 5000 kcal/pack</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Dry Grains & Legumes</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.dryGrainsKg || 2900} kg</p>
                <p className="text-[11px] text-slate-500">Rice, Wheat Flour, Pulses</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Deep-Frozen Meats & Proteins</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.frozenMeatKg || 1450} kg</p>
                <p className="text-[11px] text-slate-500">Stored at -35°C cold storage module</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Fresh Hydroponic Veggies</span>
                <p className="text-2xl font-extrabold text-cyan-600 font-mono">{inventory.freshHydroponicKg || 62} kg</p>
                <p className="text-[11px] text-slate-500">Station Greenhouse Yield (Lettuce/Tomatoes)</p>
              </div>
            </div>
          )}

          {/* Medical Category Details */}
          {activeSubTab === 'medical' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-slate-500 font-medium">Trauma & Emergency Kits</span>
                <p className="text-2xl font-extrabold text-rose-600 font-mono">{inventory.traumaKits || 24} Kits</p>
                <p className="text-[11px] text-slate-500">Hypothermia & Surgical Field Ready</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-slate-500 font-medium">Medical Oxygen Cylinders</span>
                <p className="text-2xl font-extrabold text-rose-600 font-mono">{inventory.oxygenCylinders || 45} Cylinders</p>
                <p className="text-[11px] text-slate-500">200 bar high-pressure cylinders</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-slate-500 font-medium">Antibiotics & Broad-Spectrum</span>
                <p className="text-2xl font-extrabold text-rose-600 font-mono">{inventory.antibioticCourses || 180} Courses</p>
                <p className="text-[11px] text-slate-500">Sealed climate-controlled storage</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-1">
                <span className="text-slate-500 font-medium">Emergency Surgical Packs</span>
                <p className="text-2xl font-extrabold text-rose-600 font-mono">12 Sealed Packs</p>
                <p className="text-[11px] text-slate-500">Full autoclave sterilized</p>
              </div>
            </div>
          )}

          {/* Scientific Category Details */}
          {activeSubTab === 'scientific' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Helium 5.0 Gas Tanks</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.scientificHeliumTanks || 16} Tanks</p>
                <p className="text-[11px] text-slate-500">Mass Spectrometer Carrier Gas</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Liquid Nitrogen Cryo Storage</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.liquidNitrogenLiters || 450} Liters</p>
                <p className="text-[11px] text-slate-500">Ice core & biological sample preservation</p>
              </div>
            </div>
          )}

          {/* Spares Category Details */}
          {activeSubTab === 'spares' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Generator Air Filters</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.spareDgFilters || 12} Units</p>
                <p className="text-[11px] text-slate-500">250 kW DG maintenance replacements</p>
              </div>

              <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-1">
                <span className="text-slate-500 font-medium">Pump Shaft Seals & Impellers</span>
                <p className="text-2xl font-extrabold text-sky-700 font-mono">{inventory.sparePumpImpellers || 6} Impellers</p>
                <p className="text-[11px] text-slate-500">RO Desalination Unit spares</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Expedition Resupply Voyage */}
        <div className="lg:col-span-5 bg-white border border-sky-100 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Anchor className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                2. Annual Expedition Resupply Voyage
              </h2>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
              Expedition 44
            </span>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">{resupply.vesselName}</span>
              <span className="text-amber-700 font-extrabold font-mono bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                ETA {resupply.etaDays} Days
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Voyage Progress ({resupply.departurePort})</span>
                <span className="font-bold text-sky-700">{resupply.progressPct}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-400 to-cyan-500 h-full rounded-full" style={{ width: `${resupply.progressPct}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 font-mono">
              <div className="flex justify-between">
                <span>Current Coordinates:</span>
                <span className="text-slate-900 font-semibold">{resupply.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>Next Destination Port:</span>
                <span className="text-slate-900 font-semibold">{resupply.nextPort}</span>
              </div>
              <div className="flex justify-between">
                <span>Cargo Allocation:</span>
                <span className="text-sky-700 font-bold">{resupply.cargoLoadedTons} Tons loaded ({resupply.cargoCapacityTons} T max)</span>
              </div>
            </div>
          </div>

          {/* Priority Replenishment Manifest Action */}
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-sans text-slate-900 font-bold">Pending Priority Orders</span>
              <button
                onClick={handleSubmitManifest}
                disabled={manifestStatus === 'submitting'}
                className={`px-3.5 py-1.5 font-sans text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  manifestStatus === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : manifestStatus === 'submitting'
                    ? 'bg-sky-400 text-white cursor-wait'
                    : 'bg-[#0284c7] hover:bg-sky-700 text-white shadow-sky-500/20'
                }`}
              >
                {manifestStatus === 'submitting' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting Manifest...</span>
                  </>
                ) : manifestStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Request sent successfully!</span>
                  </>
                ) : (
                  <span>Submit Replenishment Manifest</span>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 font-sans">
              {manifestStatus === 'success' ? (
                <span className="text-emerald-700 font-medium font-sans">
                  ✓ Priority replenishment manifest successfully dispatched to {stationData.stationName} expedition queue.
                </span>
              ) : (
                '8 priority replenishment orders queued for the next expedition vessel call at Larsemann Hills & Schirmacher Oasis.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Critical Life Support Auditing - White Card with Sky Blue Badges */}
      <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Droplets className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              3. Critical Life Support Systems Auditing
            </h2>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200 uppercase">
            Station Vital Systems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
          
          {/* Fresh Water Generation */}
          <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold uppercase text-[11px] tracking-wider">Snow Melting & RO Plant</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">NOMINAL</span>
            </div>
            <div className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Snow Melter Output:</span>
                <span className="text-slate-900 font-bold">{lifeSupport.snowMelterLitersDay || 12500} L/Day</span>
              </div>
              <div className="flex justify-between">
                <span>RO Desalination:</span>
                <span className="text-slate-900 font-bold">{lifeSupport.roDesalinationLitersDay || 18400} L/Day</span>
              </div>
              <div className="flex justify-between">
                <span>Water Purity Index:</span>
                <span className="text-sky-700 font-bold">{lifeSupport.waterPurityPpm || 9} ppm TDS</span>
              </div>
            </div>
          </div>

          {/* Waste Management */}
          <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold uppercase text-[11px] tracking-wider">Waste Management Pipeline</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">ACTIVE</span>
            </div>
            <div className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Incinerator State:</span>
                <span className="text-slate-900 font-bold">{lifeSupport.incineratorState || 'OPTIMAL'}</span>
              </div>
              <div className="flex justify-between">
                <span>Greywater Treatment:</span>
                <span className="text-slate-900 font-bold">{lifeSupport.greywaterTreatmentLh || 620} L/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Eco Recycling Rate:</span>
                <span className="text-emerald-700 font-bold">96.8% Zero-Impact</span>
              </div>
            </div>
          </div>

          {/* Vital Reserves & Heating */}
          <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-bold uppercase text-[11px] tracking-wider">Vital Heating & Oxygen</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">OPTIMAL</span>
            </div>
            <div className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Primary Heating Loop:</span>
                <span className="text-amber-700 font-bold">+{lifeSupport.primaryHeatingLoopTempC || 84.5}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Secondary Loop:</span>
                <span className="text-amber-700 font-bold">+{lifeSupport.secondaryHeatingLoopTempC || 78.0}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency O2 Reserve:</span>
                <span className="text-rose-600 font-bold">{lifeSupport.emergencyOxygenBar || 200} bar</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

