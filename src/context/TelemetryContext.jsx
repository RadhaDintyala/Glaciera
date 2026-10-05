import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TELEMETRY, generateNextTick } from '../utils/datasetGenerators';
import { calculatePayloadMetrics } from '../utils/compressionSimulator';

const TelemetryContext = createContext();

export function TelemetryProvider({ children }) {
  const [activeStation, setActiveStation] = useState('bharati'); // 'bharati' | 'maitri'
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [history, setHistory] = useState([]);
  
  // RBAC Access Control Role
  const [activeRole, setActiveRole] = useState('COMMANDER'); // 'COMMANDER' | 'TECHNICIAN' | 'SCIENTIST' | 'MINISTRY'

  // 3D Viewport Controls
  const [viewPreset, setViewPreset] = useState('overview'); // 'overview', 'generators', 'radomes', 'living', 'stilts'
  const [isCutawayView, setIsCutawayView] = useState(false);
  const [isHeatmapActive, setIsHeatmapActive] = useState(true);
  const [isAuroraVisible, setIsAuroraVisible] = useState(true);
  const [isPowerConduitActive, setIsPowerConduitActive] = useState(true);

  // Layer 2: Edge Gateway State
  const [compressionMode, setCompressionMode] = useState('PROTOBUF');
  const [localBufferCount, setLocalBufferCount] = useState(1420);
  const [queueBacklog, setQueueBacklog] = useState(0);

  // Layer 3: SATCOM Gateway Network State
  const [satcomStatus, setSatcomStatus] = useState('ONLINE'); // 'ONLINE' | 'DEGRADED' | 'BLACKOUT'
  const [simulatedLagMs, setSimulatedLagMs] = useState(750);
  const [packetLossPct, setPacketLossPct] = useState(1.2);
  const [isManualBlackout, setIsManualBlackout] = useState(false);

  // Simulation Triggers
  const [isStormActive, setIsStormActive] = useState(false);
  const [isGridFaultActive, setIsGridFaultActive] = useState(false);

  // Crisis Management & Safety Overrides (synced with CrisisManagement panel + remote_Access.html)
  const [isBaseShutdown, setIsBaseShutdown] = useState(false);
  const [isolatedCircuits, setIsolatedCircuits] = useState({ alpha: false, bravo: false, charlie: false });
  const [activeMacros, setActiveMacros] = useState({ blizzard: false, breach: false, gas: false });

  // Incident Alert Logs
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'INFO', title: 'System Initialized', desc: 'Connected to NCPOR Telemetry API via SATCOM Uplink', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'WARNING', title: 'AWS Wind Shear Alert', desc: 'Bharati gust speed exceeds 48 knots ESE', time: new Date().toLocaleTimeString() },
    { id: 3, type: 'CRITICAL', title: 'Predictive Anomaly ANOM-402', desc: 'CHP Pump 1 Cavitation detected at Bharati Level 1 Core', time: new Date().toLocaleTimeString() }
  ]);

  // Real-time telemetry tick loop (1.5s interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const next = generateNextTick(prev, isStormActive, isGridFaultActive || isBaseShutdown);

        // --- Crisis overrides: isolation trims load + trips breakers ---
        try {
          const iso = isolatedCircuits || {};
          let loadTrim = 0;
          if (iso.alpha) {
            loadTrim += 60;
            if (next.maitri?.electricCircuits?.breakers) next.maitri.electricCircuits.breakers.labs = 'TRIPPED';
            if (next.bharati?.electricCircuits?.breakers) next.bharati.electricCircuits.breakers.labs = 'TRIPPED';
          }
          if (iso.bravo) {
            loadTrim += 45;
            if (next.maitri?.electricCircuits?.breakers) next.maitri.electricCircuits.breakers.livingQuarters = 'TRIPPED';
            if (next.bharati?.electricCircuits?.breakers) next.bharati.electricCircuits.breakers.livingQuarters = 'TRIPPED';
          }
          if (iso.charlie) {
            loadTrim += 85;
            if (next.maitri?.electricCircuits?.breakers) next.maitri.electricCircuits.breakers.generatorShed = 'TRIPPED';
            if (next.bharati?.electricCircuits?.breakers) next.bharati.electricCircuits.breakers.generatorShed = 'TRIPPED';
          }
          if (loadTrim > 0 && !isBaseShutdown) {
            const cur = next.maitri?.electricCircuits?.totalLoadKw ?? 265;
            const trimmed = Math.max(40, cur - loadTrim);
            next.maitri.electricCircuits.totalLoadKw = +trimmed.toFixed(1);
            next.maitri.electricCircuits.gen1Output = +(trimmed * 0.55).toFixed(1);
            next.maitri.electricCircuits.gen2Output = +(trimmed * 0.35).toFixed(1);
          }

          // --- Macro effects ---
          if (activeMacros?.blizzard && next.maitri?.atmospheric) {
            next.maitri.atmospheric.livingTemp = +Math.min(28, (next.maitri.atmospheric.livingTemp || 21) + 0.6).toFixed(1);
            next.maitri.atmospheric.labTemp = +Math.min(26, (next.maitri.atmospheric.labTemp || 19.8) + 0.4).toFixed(1);
          }

          // --- Base grid shutdown: collapse everything, visible on main dashboard ---
          if (isBaseShutdown) {
            if (next.maitri?.electricCircuits) {
              next.maitri.electricCircuits.totalLoadKw = 0;
              next.maitri.electricCircuits.gen1Output = 0;
              next.maitri.electricCircuits.gen2Output = 0;
              next.maitri.electricCircuits.gen3Output = 0;
              next.maitri.electricCircuits.solarPvOutputKw = 0;
              next.maitri.electricCircuits.windTurbineOutputKw = 0;
              next.maitri.electricCircuits.phaseVoltageA = 0;
              next.maitri.electricCircuits.phaseVoltageB = 0;
              next.maitri.electricCircuits.phaseVoltageC = 0;
              next.maitri.electricCircuits.gridFrequencyHz = 0;
              Object.keys(next.maitri.electricCircuits.breakers || {}).forEach((k) => {
                next.maitri.electricCircuits.breakers[k] = 'TRIPPED';
              });
            }
            if (next.bharati?.electricCircuits) {
              if (typeof next.bharati.electricCircuits.totalLoadKw !== 'undefined') next.bharati.electricCircuits.totalLoadKw = 0;
              if (next.bharati.electricCircuits.breakers) {
                Object.keys(next.bharati.electricCircuits.breakers).forEach((k) => {
                  next.bharati.electricCircuits.breakers[k] = 'TRIPPED';
                });
              }
            }
            if (next.maitri?.atmospheric) {
              next.maitri.atmospheric.livingTemp = +Math.max(4, (next.maitri.atmospheric.livingTemp || 21) - 0.8).toFixed(1);
              next.maitri.atmospheric.labTemp = +Math.max(2, (next.maitri.atmospheric.labTemp || 19.8) - 0.8).toFixed(1);
            }
            if (next.maitri?.lifeSupport) {
              next.maitri.lifeSupport.primaryHeatingLoopTempC = +Math.max(8, (next.maitri.lifeSupport.primaryHeatingLoopTempC || 82) - 2.5).toFixed(1);
            }
          }
        } catch (e) {
          // never break tick loop on override errors
        }
        
        // Push historical record for charts (max 20 points)
        setHistory((hPrev) => {
          const newPoint = {
            time: new Date().toLocaleTimeString().slice(0, 8),
            windKmh: next.bharati.aws.windSpeedKmh,
            maitriLoad: next.maitri.electricCircuits.totalLoadKw,
            bharatiLoad: next.bharati.electricCircuits.totalLoadKw,
            riometerDb: next.maitri.riometer.absorptionDb,
            driftX: next.maitri.gpsSurface.driftX,
            ambientTemp: next.maitri.atmospheric.ambientTemp
          };
          const updated = [...hPrev, newPoint];
          if (updated.length > 20) updated.shift();
          return updated;
        });

        // Edge queue handling during blackout / shutdown
        if (isBaseShutdown) {
          setQueueBacklog((q) => q + 4);
          setSatcomStatus('BLACKOUT');
        } else if (isManualBlackout || next.maitri.riometer.solarFlareState === 'CRITICAL') {
          setQueueBacklog((q) => q + 1);
          setSatcomStatus('BLACKOUT');
        } else if (next.maitri.riometer.solarFlareState === 'MODERATE') {
          setSatcomStatus('DEGRADED');
          setQueueBacklog((q) => Math.max(0, q - 1));
        } else {
          setSatcomStatus('ONLINE');
          setQueueBacklog((q) => Math.max(0, q - 3));
        }

        setLocalBufferCount((b) => b + 1);

        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStormActive, isGridFaultActive, isManualBlackout, isBaseShutdown, isolatedCircuits, activeMacros]);

  // Payload Compression Calculation
  const payloadMetrics = calculatePayloadMetrics(telemetry, compressionMode);

  // Trigger Remote Edge Command
  const triggerEdgeAction = (actionName, details) => {
    const newAlert = {
      id: Date.now(),
      type: 'COMMAND',
      title: `Edge Action: ${actionName}`,
      desc: details || 'Command dispatched to Antarctic station gateway',
      time: new Date().toLocaleTimeString()
    };
    setAlerts((prev) => [newAlert, ...prev]);

    if (actionName === 'RESET_HEATERS') {
      setIsGridFaultActive(false);
    }
    if (actionName === 'ISOLATE_ALPHA') {
      setIsolatedCircuits((p) => ({ ...p, alpha: !p.alpha }));
    }
    if (actionName === 'ISOLATE_BRAVO') {
      setIsolatedCircuits((p) => ({ ...p, bravo: !p.bravo }));
    }
    if (actionName === 'ISOLATE_CHARLIE') {
      setIsolatedCircuits((p) => ({ ...p, charlie: !p.charlie }));
    }
    if (actionName === 'MACRO_BLIZZARD') {
      setActiveMacros((p) => ({ ...p, blizzard: true }));
    }
    if (actionName === 'MACRO_BREACH') {
      setActiveMacros((p) => ({ ...p, breach: true }));
    }
    if (actionName === 'MACRO_GAS') {
      setActiveMacros((p) => ({ ...p, gas: true }));
    }
    if (actionName === 'BASE_GRID_SHUTDOWN') {
      setIsBaseShutdown(true);
      setIsGridFaultActive(true);
      setIsManualBlackout(true);
    }
    if (actionName === 'REENERGIZE_GRID') {
      setIsBaseShutdown(false);
      setIsGridFaultActive(false);
      setIsManualBlackout(false);
      setIsolatedCircuits({ alpha: false, bravo: false, charlie: false });
    }
  };

  const executeBaseShutdown = (reason) => {
    setIsBaseShutdown(true);
    setIsGridFaultActive(true);
    setIsManualBlackout(true);
    setAlerts((prev) => [{
      id: Date.now(),
      type: 'CRITICAL',
      title: 'BASE GRID SHUTDOWN EXECUTED',
      desc: reason || 'Main 11kV bus tripped - hydraulic prime movers severed. Dashboard metrics collapsed to zero.',
      time: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const resetBaseShutdown = () => {
    setIsBaseShutdown(false);
    setIsGridFaultActive(false);
    setIsManualBlackout(false);
    setIsolatedCircuits({ alpha: false, bravo: false, charlie: false });
    setActiveMacros({ blizzard: false, breach: false, gas: false });
    setAlerts((prev) => [{
      id: Date.now(),
      type: 'INFO',
      title: 'GRID RE-ENERGIZED',
      desc: 'Base grid restored. Telemetry recovering on main dashboard.',
      time: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const addAlert = (type, title, desc) => {
    setAlerts((prev) => [{ id: Date.now(), type, title, desc, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const toggleSmartLoadShedding = (stationKey) => {
    setTelemetry((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[stationKey]) {
        const curr = next[stationKey].electricCircuits.smartLoadSheddingActive;
        next[stationKey].electricCircuits.smartLoadSheddingActive = !curr;
        triggerEdgeAction('SMART_LOAD_SHEDDING', `Smart Load Shedding on ${stationKey.toUpperCase()} set to ${!curr ? 'ENABLED' : 'DISABLED'}`);
      }
      return next;
    });
  };

  return (
    <TelemetryContext.Provider
      value={{
        activeStation,
        setActiveStation,
        activeRole,
        setActiveRole,
        telemetry,
        history,
        viewPreset,
        setViewPreset,
        isCutawayView,
        setIsCutawayView,
        isHeatmapActive,
        setIsHeatmapActive,
        isAuroraVisible,
        setIsAuroraVisible,
        isPowerConduitActive,
        setIsPowerConduitActive,
        compressionMode,
        setCompressionMode,
        localBufferCount,
        queueBacklog,
        satcomStatus,
        setSatcomStatus,
        simulatedLagMs,
        setSimulatedLagMs,
        packetLossPct,
        setPacketLossPct,
        isManualBlackout,
        setIsManualBlackout,
        isStormActive,
        setIsStormActive,
        isGridFaultActive,
        setIsGridFaultActive,
        isBaseShutdown,
        setIsBaseShutdown,
        isolatedCircuits,
        setIsolatedCircuits,
        activeMacros,
        setActiveMacros,
        executeBaseShutdown,
        resetBaseShutdown,
        alerts,
        setAlerts,
        addAlert,
        payloadMetrics,
        triggerEdgeAction,
        toggleSmartLoadShedding
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  return useContext(TelemetryContext);
}
