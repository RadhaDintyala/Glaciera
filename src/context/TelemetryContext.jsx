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
        const next = generateNextTick(prev, isStormActive, isGridFaultActive);
        
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

        // Edge queue handling during blackout
        if (isManualBlackout || next.maitri.riometer.solarFlareState === 'CRITICAL') {
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
  }, [isStormActive, isGridFaultActive, isManualBlackout]);

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
        alerts,
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
