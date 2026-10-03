import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShoppingBag, Anchor, Droplets, HeartPulse, Sparkles, AlertTriangle, ShieldCheck, Truck, Flame, Box, Calendar, Clock, ArrowRight } from 'lucide-react';

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

  return (
    <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6 animate-fade-in font-sans">
      
      {/* Title Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/20">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Inventory, Supply Chain & Life Support Logistics <span className="text-emerald-400 font-mono text-lg font-normal">| Module 3</span>
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 tracking-wide uppercase">
                SIH26060 Requirement 3
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Consumables & Rations Tracking, Annual Expedition Resupply Scheduling, and Critical Life Support Auditing for {stationData.stationName}
            </p>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 font-mono text-xs">
          <button
            onClick={() => setActiveStation('bharati')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeStation === 'bharati'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bharati Station
          </button>
          <button
            onClick={() => setActiveStation('maitri')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeStation === 'maitri'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Maitri Station
          </button>
        </div>
      </div>

      {/* Top Level Logistics Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* Ration Stock Days */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Ration Stock Autonomy</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {inventory.rationsDays || 180} <span className="text-sm font-normal text-emerald-400">Days</span>
          </div>
          <div className="mt-2 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-emerald-400 h-full" style={{ width: '75%' }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Ration Supply Status: OPTIMAL</span>
        </div>

        {/* Medical Stock Days */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Medical Supply Autonomy</span>
            <HeartPulse className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {inventory.medicalDays || 210} <span className="text-sm font-normal text-rose-400">Days</span>
          </div>
          <div className="mt-2 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-rose-400 h-full" style={{ width: '85%' }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Trauma Kits & Oxygen: FULL</span>
        </div>

        {/* Fresh Water Generation */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Fresh Water Production</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">
            {lifeSupport.roDesalinationLitersDay ? lifeSupport.roDesalinationLitersDay.toLocaleString() : '12,450'} <span className="text-sm font-normal text-slate-400">L/Day</span>
          </div>
          <div className="mt-2 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-cyan-400 h-full" style={{ width: `${lifeSupport.waterTankLevelPct || 88}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Storage Tank Level: {lifeSupport.waterTankLevelPct || 88}% ({lifeSupport.waterPurityPpm || 12} ppm purity)</span>
        </div>

        {/* Expedition Resupply Vessel ETA */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Expedition Ship Arrival</span>
            <Anchor className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {resupply.etaDays || 34} <span className="text-sm font-normal text-slate-300">Days</span>
          </div>
          <div className="mt-2 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-amber-400 h-full" style={{ width: `${resupply.progressPct || 58}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Vessel: {resupply.vesselName || 'MV Vasiliy Golovnin'}</span>
        </div>
      </div>

      {/* Section 1 & 2: Consumables & Resupply Voyage Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Subsystem Inventory Categories */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Box className="w-4 h-4 text-emerald-400" /> 1. Consumables & Ration Inventory Tracker
            </div>

            {/* Category Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveSubTab('rations')}
                className={`px-3 py-1 rounded transition-all ${
                  activeSubTab === 'rations' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rations
              </button>
              <button
                onClick={() => setActiveSubTab('medical')}
                className={`px-3 py-1 rounded transition-all ${
                  activeSubTab === 'medical' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => setActiveSubTab('scientific')}
                className={`px-3 py-1 rounded transition-all ${
                  activeSubTab === 'scientific' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scientific
              </button>
              <button
                onClick={() => setActiveSubTab('spares')}
                className={`px-3 py-1 rounded transition-all ${
                  activeSubTab === 'spares' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Spare Parts
              </button>
            </div>
          </div>

          {/* Rations SubTab */}
          {activeSubTab === 'rations' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Freeze-Dried Meals</span>
                <p className="text-xl font-extrabold text-emerald-400">{inventory.freezeDriedKg || 3850} kg</p>
                <p className="text-[10px] text-slate-400">Expedition Grade 5000 kcal/pack</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Dry Grains & Legumes</span>
                <p className="text-xl font-extrabold text-emerald-400">{inventory.dryGrainsKg || 2900} kg</p>
                <p className="text-[10px] text-slate-400">Rice, Wheat Flour, Pulses</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Deep-Frozen Meats & Proteins</span>
                <p className="text-xl font-extrabold text-emerald-400">{inventory.frozenMeatKg || 1450} kg</p>
                <p className="text-[10px] text-slate-400">Stored at -35°C cold storage module</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Fresh Hydroponic Veggies</span>
                <p className="text-xl font-extrabold text-cyan-300">{inventory.freshHydroponicKg || 62} kg</p>
                <p className="text-[10px] text-slate-400">Station Greenhouse Yield (Lettuce/Tomatoes)</p>
              </div>
            </div>
          )}

          {/* Medical SubTab */}
          {activeSubTab === 'medical' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Trauma & Emergency Kits</span>
                <p className="text-xl font-extrabold text-rose-400">{inventory.traumaKits || 24} Kits</p>
                <p className="text-[10px] text-slate-400">Hypothermia & Surgical Field Ready</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Medical Oxygen Cylinders</span>
                <p className="text-xl font-extrabold text-rose-400">{inventory.oxygenCylinders || 45} Cylinders</p>
                <p className="text-[10px] text-slate-400">200 bar high-pressure cylinders</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Antibiotics & Broad-Spectrum</span>
                <p className="text-xl font-extrabold text-rose-400">{inventory.antibioticCourses || 180} Courses</p>
                <p className="text-[10px] text-slate-400">Sealed climate-controlled storage</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Emergency Surgical Packs</span>
                <p className="text-xl font-extrabold text-rose-400">12 Sealed Packs</p>
                <p className="text-[10px] text-slate-400">Full autoclave sterilized</p>
              </div>
            </div>
          )}

          {/* Scientific SubTab */}
          {activeSubTab === 'scientific' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Helium 5.0 Gas Tanks</span>
                <p className="text-xl font-extrabold text-purple-400">{inventory.scientificHeliumTanks || 16} Tanks</p>
                <p className="text-[10px] text-slate-400">Mass Spectrometer Carrier Gas</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Liquid Nitrogen Cryo Storage</span>
                <p className="text-xl font-extrabold text-purple-400">{inventory.liquidNitrogenLiters || 450} Liters</p>
                <p className="text-[10px] text-slate-400">Ice core & biological sample preservation</p>
              </div>
            </div>
          )}

          {/* Mechanical Spares SubTab */}
          {activeSubTab === 'spares' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Cummins Generator Air Filters</span>
                <p className="text-xl font-extrabold text-teal-300">{inventory.spareDgFilters || 12} Units</p>
                <p className="text-[10px] text-slate-400">250 kW DG maintenance replacements</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">Water Pump Shaft Seals & Impellers</span>
                <p className="text-xl font-extrabold text-teal-300">{inventory.sparePumpImpellers || 6} Impellers</p>
                <p className="text-[10px] text-slate-400">RO Desalination Unit spares</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Resupply & Expedition Voyage Modeling */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Anchor className="w-4 h-4 text-amber-400" /> 2. Annual Expedition Resupply Voyage
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
              Expedition 44
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-bold text-white">{resupply.vesselName}</span>
              <span className="text-amber-400 font-bold">ETA {resupply.etaDays} Days</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Voyage Progress ({resupply.departurePort})</span>
                <span>{resupply.progressPct}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-400 h-full" style={{ width: `${resupply.progressPct}%` }} />
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Current Coordinates:</span>
                <span className="text-slate-200">{resupply.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>Next Destination Port:</span>
                <span className="text-slate-200">{resupply.nextPort}</span>
              </div>
              <div className="flex justify-between">
                <span>Cargo Allocation:</span>
                <span className="text-emerald-400 font-bold">{resupply.cargoLoadedTons} Tons loaded ({resupply.cargoCapacityTons} T max)</span>
              </div>
            </div>
          </div>

          {/* Action Order Prompt */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-white font-bold">Pending Priority Orders</span>
              <button
                onClick={() => triggerEdgeAction('SUBMIT_RESUPPLY_ORDER', 'Priority ration and spare parts manifest submitted to NCPOR Goa Logistics Portal')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold rounded transition-all"
              >
                SUBMIT REPLENISHMENT MANIFEST
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              8 priority replenishment orders queued for the next expedition vessel call at Larsemann Hills & Schirmacher Oasis.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Critical Life Support Auditing */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Droplets className="w-4 h-4 text-cyan-400" /> 3. Critical Life Support Systems Auditing
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
            Station Vital Systems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
          
          {/* Fresh Water Generation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase">Snow Melting & RO Plant</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">NOMINAL</span>
            </div>
            <div className="space-y-1 text-slate-400">
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
                <span className="text-cyan-300 font-bold">{lifeSupport.waterPurityPpm || 9} ppm TDS</span>
              </div>
            </div>
          </div>

          {/* Waste Management */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase">Waste Management Pipeline</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">ACTIVE</span>
            </div>
            <div className="space-y-1 text-slate-400">
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
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase">Vital Heating & Oxygen</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">OPTIMAL</span>
            </div>
            <div className="space-y-1 text-slate-400">
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
