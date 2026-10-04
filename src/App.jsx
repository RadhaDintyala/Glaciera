import React, { useState } from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Navbar } from './components/Navbar';
import { LandingHeroContent } from './components/LandingPage';
import { BharatiStationView } from './components/BharatiStationView';
import { MaitriStationView } from './components/MaitriStationView';
import { EnergyMicrogridView } from './components/Module2_Energy/EnergyMicrogridView';
import { InventoryLogisticsView } from './components/Module3_Logistics/InventoryLogisticsView';
import { LowBandwidthPredictiveView } from './components/Module4_Maintenance/LowBandwidthPredictiveView';
import { InSituDatasetsBar } from './components/Layer1_InSituDatasets/InSituDatasetsBar';
import { InSituStreamsView } from './components/Layer1_InSituDatasets/InSituStreamsView';
import { EdgeGatewayPanel } from './components/Layer2_EdgeGateway/EdgeGatewayPanel';
import { SatcomControlPanel } from './components/Layer3_SatcomNetwork/SatcomControlPanel';
import { CloudGatewayPanel } from './components/Layer4_CloudGateway/CloudGatewayPanel';
import { TwinViewportCanvas } from './components/Layer5_DigitalTwin/TwinViewportCanvas';
import { MissionControl2D } from './components/MissionControl2D/MissionControl2D';
import { Layers, ArrowDown, Monitor, Box, LayoutGrid } from 'lucide-react';

function MonitoringPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 backdrop-blur-xl">
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
      <div className="bg-[#12161D] border border-[#202632] rounded-2xl p-5 backdrop-blur-xl">
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
        <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
        <span>In-Situ Sensors Stream to Edge Ingestion Agent</span>
        <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
      </div>

      {/* Layer 2 & 3 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EdgeGatewayPanel />
        <SatcomControlPanel />
      </section>

      <div className="flex justify-center items-center gap-2 text-slate-500 text-[11px] font-mono my-1">
        <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
        <span>Decrypted Binary Stream to NCPOR Cloud Ingestion Gateway</span>
        <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
      </div>

      {/* Layer 4 */}
      <section>
        <CloudGatewayPanel />
      </section>

      <div className="flex justify-center items-center gap-2 text-slate-500 text-[11px] font-mono my-1">
        <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
        <span>WebSocket Real-Time Broadcast & Level 2 Command Loop</span>
        <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
      </div>

      {/* Layer 5 */}
      <section className="bg-[#12161D] border border-[#202632] rounded-xl p-4 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#202632] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

          <div className="flex items-center bg-[#0B0D11] p-1 rounded-lg border border-[#202632]">
            <button
              onClick={() => setHubViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                hubViewMode === 'split' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Split Dashboard
            </button>
            <button
              onClick={() => setHubViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                hubViewMode === '3d' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3D Digital Twin Focus
            </button>
            <button
              onClick={() => setHubViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                hubViewMode === '2d' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-white'
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
  const { activeStation, setActiveStation } = useTelemetry();
  const [activePage, setActivePage] = useState('overview'); // 'overview' | 'bharati' | 'maitri' | 'energy' | 'logistics' | 'maintenance' | 'monitoring' | 'data' | 'console'

  const handleStationSwitch = (stationKey) => {
    setActiveStation(stationKey);
    setActivePage(stationKey);
  };

  const handleNavigate = (pageId) => {
    if (pageId === 'bharati' || pageId === 'maitri') {
      handleStationSwitch(pageId);
    } else {
      setActivePage(pageId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F8FAFC] flex flex-col font-sans">
      {/* Global Unified Minimalist Navbar visible on EVERY page */}
      <Navbar activePage={activePage} setActivePage={handleNavigate} />

      {/* Page Routing Container */}
      <div className="flex-1 w-full">
        {activePage === 'overview' && <LandingHeroContent onNavigate={handleNavigate} />}
        {(activePage === '3d-twin' || activePage === 'bharati') && <BharatiStationView onSwitchStation={handleStationSwitch} />}
        {activePage === 'maitri' && <MaitriStationView onSwitchStation={handleStationSwitch} />}
        {activePage === 'logistics' && <InventoryLogisticsView />}
        {(activePage === 'insitu' || activePage === 'data') && <InSituStreamsView />}
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

