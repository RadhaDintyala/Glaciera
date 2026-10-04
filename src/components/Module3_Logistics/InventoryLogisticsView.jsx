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
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans bg-[#0B0D11] min-h-screen text-[#F8FAFC]">
      
      {/* Title Header Banner */}
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-6 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Inventory, Supply Chain & Life Support Logistics
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#181D26] text-slate-300 border border-[#202632] tracking-wider uppercase">
                SIH26060 Module 3
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Consumables & Rations Tracking, Annual Expedition Resupply Scheduling, and Critical Life Support Auditing for {stationData.stationName}
            </p>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center bg-[#0B0D11] p-1 rounded-xl border border-[#202632] shrink-0 font-sans text-xs">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeStation === 'bharati'
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bharati Station
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              activeStation === 'maitri'
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maitri Station
          </button>
        </div>
      </div>

      {/* Top Level Logistics Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Ration Stock Days */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Ration Stock Autonomy</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-sky-400 border border-[#202632]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {inventory.rationsDays || 180} <span className="text-sm font-medium text-slate-400">Days</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: '75%' }} />
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ration Supply Status: OPTIMAL
          </span>
        </div>

        {/* Medical Stock Days */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Medical Autonomy</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-slate-400 border border-[#202632]">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {inventory.medicalDays || 210} <span className="text-sm font-medium text-slate-400">Days</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Trauma Kits & Oxygen: FULL
          </span>
        </div>

        {/* Fresh Water Generation */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Fresh Water Output</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-sky-400 border border-[#202632]">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white font-mono tracking-tight">
            {lifeSupport.roDesalinationLitersDay ? lifeSupport.roDesalinationLitersDay.toLocaleString() : '12,450'} <span className="text-sm font-medium text-slate-400">L/Day</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${lifeSupport.waterTankLevelPct || 88}%` }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Tank Level: {lifeSupport.waterTankLevelPct || 88}% ({lifeSupport.waterPurityPpm || 12} ppm purity)
          </span>
        </div>

        {/* Expedition Resupply Vessel ETA */}
        <div className="bg-[#12161D] border border-[#202632] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">Ship Arrival ETA</span>
            <div className="p-1.5 rounded-lg bg-[#181D26] text-slate-400 border border-[#202632]">
              <Anchor className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-400 font-mono tracking-tight">
            {resupply.etaDays || 34} <span className="text-sm font-medium text-slate-400">Days</span>
          </div>
          <div className="mt-3 w-full bg-[#181D26] rounded-full h-2 overflow-hidden border border-[#202632]">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${resupply.progressPct || 58}%` }} />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2 block">
            Vessel: {resupply.vesselName || 'MV Vasiliy Golovnin'}
          </span>
        </div>
      </div>

      {/* Section 1 & 2: Consumables Tracker & Resupply Voyage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Consumables Inventory Categories */}
        <div className="lg:col-span-7 bg-[#12161D] border border-[#202632] rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#202632] pb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632]">
                <Box className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white font-sans tracking-tight">
                1. Consumables & Ration Inventory Tracker
              </h2>
            </div>

            {/* Subtab Controls */}
            <div className="flex items-center bg-[#0B0D11] p-1 rounded-xl border border-[#202632] text-xs font-medium">
              <button
                onClick={() => setActiveSubTab('rations')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSubTab === 'rations' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rations
              </button>
              <button
                onClick={() => setActiveSubTab('medical')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSubTab === 'medical' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => setActiveSubTab('scientific')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSubTab === 'scientific' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scientific
              </button>
              <button
                onClick={() => setActiveSubTab('spares')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeSubTab === 'spares' ? 'bg-[#181D26] text-white font-semibold border border-[#202632]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spares
              </button>
            </div>
          </div>

          {/* Rations Category Details */}
          {activeSubTab === 'rations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Freeze-Dried Meals</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.freezeDriedKg || 3850} kg</p>
                <p className="text-[11px] text-slate-400">Expedition Grade 5000 kcal/pack</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Dry Grains & Legumes</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.dryGrainsKg || 2900} kg</p>
                <p className="text-[11px] text-slate-400">Rice, Wheat Flour, Pulses</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Deep-Frozen Meats & Proteins</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.frozenMeatKg || 1450} kg</p>
                <p className="text-[11px] text-slate-400">Stored at -35°C cold storage module</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Fresh Hydroponic Veggies</span>
                <p className="text-2xl font-bold text-sky-400 font-mono tracking-tight">{inventory.freshHydroponicKg || 62} kg</p>
                <p className="text-[11px] text-slate-400">Station Greenhouse Yield (Lettuce/Tomatoes)</p>
              </div>
            </div>
          )}

          {/* Medical Category Details */}
          {activeSubTab === 'medical' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Trauma & Emergency Kits</span>
                <p className="text-2xl font-bold text-rose-400 font-mono tracking-tight">{inventory.traumaKits || 24} Kits</p>
                <p className="text-[11px] text-slate-400">Hypothermia & Surgical Field Ready</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Medical Oxygen Cylinders</span>
                <p className="text-2xl font-bold text-rose-400 font-mono tracking-tight">{inventory.oxygenCylinders || 45} Cylinders</p>
                <p className="text-[11px] text-slate-400">200 bar high-pressure cylinders</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Antibiotics & Broad-Spectrum</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.antibioticCourses || 180} Courses</p>
                <p className="text-[11px] text-slate-400">Sealed climate-controlled storage</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Emergency Surgical Packs</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">12 Sealed Packs</p>
                <p className="text-[11px] text-slate-400">Full autoclave sterilized</p>
              </div>
            </div>
          )}

          {/* Scientific Category Details */}
          {activeSubTab === 'scientific' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Helium 5.0 Gas Tanks</span>
                <p className="text-2xl font-bold text-sky-400 font-mono tracking-tight">{inventory.scientificHeliumTanks || 16} Tanks</p>
                <p className="text-[11px] text-slate-400">Mass Spectrometer Carrier Gas</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Liquid Nitrogen Cryo Storage</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.liquidNitrogenLiters || 450} Liters</p>
                <p className="text-[11px] text-slate-400">Ice core & biological sample preservation</p>
              </div>
            </div>
          )}

          {/* Spares Category Details */}
          {activeSubTab === 'spares' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Generator Air Filters</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.spareDgFilters || 12} Units</p>
                <p className="text-[11px] text-slate-400">250 kW DG maintenance replacements</p>
              </div>

              <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-1">
                <span className="text-slate-400 font-medium">Pump Shaft Seals & Impellers</span>
                <p className="text-2xl font-bold text-white font-mono tracking-tight">{inventory.sparePumpImpellers || 6} Impellers</p>
                <p className="text-[11px] text-slate-400">RO Desalination Unit spares</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Expedition Resupply Voyage */}
        <div className="lg:col-span-5 bg-[#12161D] border border-[#202632] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#202632] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#181D26] text-slate-400 border border-[#202632]">
                <Anchor className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white font-sans tracking-tight">
                2. Annual Expedition Resupply Voyage
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#181D26] text-slate-300 font-medium border border-[#202632]">
              Expedition 44
            </span>
          </div>

          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white text-sm">{resupply.vesselName}</span>
              <span className="text-amber-400 font-bold font-mono bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-800/60">
                ETA {resupply.etaDays} Days
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Voyage Progress ({resupply.departurePort})</span>
                <span className="font-bold text-white">{resupply.progressPct}%</span>
              </div>
              <div className="w-full bg-[#0B0D11] rounded-full h-2 overflow-hidden border border-[#202632]">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${resupply.progressPct}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-[#202632] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Coordinates:</span>
                <span className="text-white font-medium">{resupply.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Destination Port:</span>
                <span className="text-white font-medium">{resupply.nextPort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cargo Allocation:</span>
                <span className="text-sky-400 font-medium">{resupply.cargoLoadedTons} Tons loaded ({resupply.cargoCapacityTons} T max)</span>
              </div>
            </div>
          </div>

          {/* Priority Replenishment Manifest Action */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-xs font-sans text-slate-300 font-medium">Pending Priority Orders</span>
              <button
                onClick={handleSubmitManifest}
                disabled={manifestStatus === 'submitting'}
                className={`px-3.5 py-1.5 font-sans text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  manifestStatus === 'success'
                    ? 'bg-emerald-600 text-white'
                    : manifestStatus === 'submitting'
                    ? 'bg-neutral-700 text-neutral-400 cursor-wait'
                    : 'bg-white text-neutral-950 hover:bg-neutral-200'
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
            <p className="text-[11px] text-slate-400 font-sans">
              {manifestStatus === 'success' ? (
                <span className="text-emerald-400 font-medium font-sans">
                  ✓ Priority replenishment manifest successfully dispatched to {stationData.stationName} expedition queue.
                </span>
              ) : (
                '8 priority replenishment orders queued for the next expedition vessel call at Larsemann Hills & Schirmacher Oasis.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Critical Life Support Auditing */}
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#202632] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#181D26] text-sky-400 border border-[#202632]">
              <Droplets className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white font-sans tracking-tight">
              3. Critical Life Support Systems Auditing
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#181D26] text-slate-300 font-medium border border-[#202632] uppercase">
            Station Vital Systems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
          
          {/* Fresh Water Generation */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium uppercase text-[11px] tracking-wider">Snow Melting & RO Plant</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-semibold border border-emerald-800/60">NOMINAL</span>
            </div>
            <div className="space-y-1.5 text-slate-400 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Snow Melter Output:</span>
                <span className="text-white font-bold">{lifeSupport.snowMelterLitersDay || 12500} L/Day</span>
              </div>
              <div className="flex justify-between">
                <span>RO Desalination:</span>
                <span className="text-white font-bold">{lifeSupport.roDesalinationLitersDay || 18400} L/Day</span>
              </div>
              <div className="flex justify-between">
                <span>Water Purity Index:</span>
                <span className="text-sky-400 font-bold">{lifeSupport.waterPurityPpm || 9} ppm TDS</span>
              </div>
            </div>
          </div>

          {/* Waste Management */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium uppercase text-[11px] tracking-wider">Waste Management Pipeline</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-semibold border border-emerald-800/60">ACTIVE</span>
            </div>
            <div className="space-y-1.5 text-slate-400 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Incinerator State:</span>
                <span className="text-white font-bold">{lifeSupport.incineratorState || 'OPTIMAL'}</span>
              </div>
              <div className="flex justify-between">
                <span>Greywater Treatment:</span>
                <span className="text-white font-bold">{lifeSupport.greywaterTreatmentLh || 620} L/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Eco Recycling Rate:</span>
                <span className="text-emerald-400 font-bold">96.8% Zero-Impact</span>
              </div>
            </div>
          </div>

          {/* Vital Reserves & Heating */}
          <div className="bg-[#181D26] p-4 rounded-xl border border-[#202632] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium uppercase text-[11px] tracking-wider">Vital Heating & Oxygen</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-semibold border border-emerald-800/60">OPTIMAL</span>
            </div>
            <div className="space-y-1.5 text-slate-400 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Primary Heating Loop:</span>
                <span className="text-amber-400 font-bold">+{lifeSupport.primaryHeatingLoopTempC || 84.5}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Secondary Loop:</span>
                <span className="text-amber-400 font-bold">+{lifeSupport.secondaryHeatingLoopTempC || 78.0}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency O2 Reserve:</span>
                <span className="text-rose-400 font-bold">{lifeSupport.emergencyOxygenBar || 200} bar</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

