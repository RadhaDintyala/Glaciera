import React, { useState } from 'react';
import { TelemetryProvider } from './context/TelemetryContext';
import { Navbar } from './components/Navbar';
import { LandingHeroContent } from './components/LandingPage';
import { BharatiStationView } from './components/BharatiStationView';
import { MaitriStationView } from './components/MaitriStationView';
import { EnergyMicrogridView } from './components/Module2_Energy/EnergyMicrogridView';
import { InventoryLogisticsView } from './components/Module3_Logistics/InventoryLogisticsView';
import { LowBandwidthPredictiveView } from './components/Module4_Maintenance/LowBandwidthPredictiveView';
import { InSituDatasetsBar } from './components/Layer1_InSituDatasets/InSituDatasetsBar';
import { EdgeGatewayPanel } from './components/Layer2_EdgeGateway/EdgeGatewayPanel';
import { SatcomControlPanel } from './components/Layer3_SatcomNetwork/SatcomControlPanel';
import { CloudGatewayPanel } from './components/Layer4_CloudGateway/CloudGatewayPanel';
import { TwinViewportCanvas } from './components/Layer5_DigitalTwin/TwinViewportCanvas';
import { MissionControl2D } from './components/MissionControl2D/MissionControl2D';
import { Layers, ArrowDown, Monitor, Box, LayoutGrid } from 'lucide-react';

function MonitoringPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-white font-sans">Edge Processing & SATCOM Telemetry Monitoring</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Real-time telemetry buffering, Protobuf compression, and satellite transport status</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EdgeGatewayPanel />
        <SatcomControlPanel />
      </div>
    </div>
  );
}

function DataPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-white font-sans">In-Situ Datasets & Cloud Ingestion Server</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Raw sensor telemetry streams and NCPOR cloud gateway logs</p>
      </div>
      <InSituDatasetsBar />
      <CloudGatewayPanel />
    </div>
  );
}

function FullConsoleView() {
  const [hubViewMode, setHubViewMode] = useState('split');

  return (
    <main className="max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-4 animate-fade-in">
      {/* Layer 1 */}
      <section className="relative">
        <InSituDatasetsBar />
      </section>

      <div className="flex justify-center items-center gap-2 text-slate-500 text-[11px] font-mono my-1">
        <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        <span>In-Situ Sensors Stream to Edge Ingestion Agent</span>
        <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
      </div>

      {/* Layer 2 & 3 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EdgeGatewayPanel />
        <SatcomControlPanel />
      </section>

      <div className="flex justify-center items-center gap-2 text-slate-500 text-[11px] font-mono my-1">
        <ArrowDown className="w-4 h-4 text-teal-400 animate-bounce" />
        <span>Decrypted Binary Stream to NCPOR Cloud Ingestion Gateway</span>
        <ArrowDown className="w-4 h-4 text-teal-400 animate-bounce" />
      </div>

      {/* Layer 4 */}
      <section>
        <CloudGatewayPanel />
      </section>

      <div className="flex justify-center items-center gap-2 text-slate-500 text-[11px] font-mono my-1">
        <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce" />
        <span>WebSocket Real-Time Broadcast & Level 2 Command Loop</span>
        <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce" />
      </div>

      {/* Layer 5 */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Station Commander & Remote Operations Hub (Layer 5)
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Integrated 3D WebGL Digital Twin & 2D Operational Mission Control
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setHubViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                hubViewMode === 'split' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Split Dashboard
            </button>
            <button
              onClick={() => setHubViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                hubViewMode === '3d' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3D Digital Twin Focus
            </button>
            <button
              onClick={() => setHubViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                hubViewMode === '2d' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              2D Mission Control Focus
            </button>
          </div>
        </div>

        {hubViewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6 xl:col-span-6">
              <TwinViewportCanvas />
            </div>
            <div className="lg:col-span-6 xl:col-span-6">
              <MissionControl2D />
            </div>
          </div>
        )}

        {hubViewMode === '3d' && (
          <div className="w-full">
            <TwinViewportCanvas />
          </div>
        )}

        {hubViewMode === '2d' && (
          <div className="w-full">
            <MissionControl2D />
          </div>
        )}
      </section>
    </main>
  );
}

function MainAppContent() {
  const [activePage, setActivePage] = useState('overview'); // 'overview' | 'bharati' | 'maitri' | 'energy' | 'logistics' | 'maintenance' | 'monitoring' | 'data' | 'console'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Unified Minimalist Navbar visible on EVERY page */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Page Routing Container */}
      <div className="flex-1 w-full">
        {activePage === 'overview' && <LandingHeroContent />}
        {(activePage === '3d-twin' || activePage === 'bharati') && <BharatiStationView />}
        {activePage === 'logistics' && <InventoryLogisticsView />}
        {(activePage === 'insitu' || activePage === 'data') && <DataPage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TelemetryProvider>
      <MainAppContent />
    </TelemetryProvider>
  );
}

