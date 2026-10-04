import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, ChevronDown, Activity, Thermometer, Zap, ShieldCheck, 
  Eye, Sliders, RadioReceiver, Truck, Server, Database, Waves, Flame, RefreshCw,
  Move, Minimize2, Maximize2, AlertTriangle, Flame as HeatIcon
} from 'lucide-react';

export function StationAreaDropdownCard({
  activeAreaKey,
  setActiveAreaKey,
  onFocusCamera,
  telemetry,
  isCutawayView,
  setIsCutawayView,
  isHeatmapActive,
  setIsHeatmapActive,
  isStormActive,
  setIsStormActive,
  isGridFaultActive,
  setIsGridFaultActive,
  triggerEdgeAction
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);

  // Dragging state for making the card movable anywhere on screen
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 16, y: 16 });

  const handleMouseDown = (e) => {
    // Only trigger drag when clicking header / drag handle bar, not dropdown elements
    if (e.target.closest('.no-drag')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: Math.max(0, posStartRef.current.x + dx),
        y: Math.max(0, posStartRef.current.y + dy)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Sensor mock telemetry values with mock high heat detection
  const chpTemp = isGridFaultActive ? '108.4°C (HIGH HEAT DETECTED!)' : '84.5°C';
  const livingTemp = '+21.5°C';
  const radomeStatus = isStormActive ? 'DE-ICING ACTIVE (480 Mbps)' : 'OPTIMAL TRACKING (1.24 Gbps)';
  const fuelReserve = '184,200 L (287 Days)';
  const lakeIntake = '+3.8°C (12,450 L/day)';
  const gridLoad = isGridFaultActive ? '142 kW (FAULT TRIPPED)' : '280 kW (NOMINAL)';

  const stationAreas = [
    {
      id: 'level1',
      title: 'Level 1: Ground Garage & CHP Power Plant',
      icon: Truck,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      metrics: [
        { label: 'CHP Coolant Temp', value: chpTemp, status: isGridFaultActive ? 'HIGH HEAT' : 'NORMAL' },
        { label: 'Cogeneration Efficiency', value: isGridFaultActive ? '68.4%' : '94.2%', status: isGridFaultActive ? 'DEGRADED' : 'OPTIMAL' },
        { label: 'PistenBully Snowcats', value: '2 Units Ready', status: 'READY' }
      ],
      description: 'Houses 3x Volvo Penta 280kW diesel generators, reverse osmosis desalination, and snowcat garage.'
    },
    {
      id: 'level2',
      title: 'Level 2: Science Labs & Living Quarters',
      icon: Building2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      metrics: [
        { label: 'Indoor Ambient Temp', value: livingTemp, status: 'NORMAL' },
        { label: 'Cabin Occupancy', value: '24 / 24 Cabins', status: 'FULL' },
        { label: 'Air Quality Index', value: '99.2% Pure', status: 'OPTIMAL' }
      ],
      description: '24 crew cabins, earth science & glaciology labs, kitchen, dining hall, and panoramic glass lounge.'
    },
    {
      id: 'level3',
      title: 'Level 3: Operations Command & Solar Array',
      icon: Server,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      metrics: [
        { label: 'Roof Solar Array', value: '42.8 kW Gen', status: 'ACTIVE' },
        { label: 'AWS Wind Speed', value: `${telemetry?.bharati?.aws?.windSpeedKnots || 34.2} knots`, status: isStormActive ? 'EXTREME' : 'NORMAL' },
        { label: 'Barometric Pressure', value: '978.4 hPa', status: 'STABLE' }
      ],
      description: 'Station Commander console, Building Management System (BMS), weather mast, and PV array.'
    },
    {
      id: 'radome',
      title: 'ISRO SATCOM Ground Station (Hilltop Radome)',
      icon: RadioReceiver,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      metrics: [
        { label: 'Track Target', value: 'Cartosat-3 / Oceansat-2', status: 'TRACKING' },
        { label: 'Downlink Throughput', value: radomeStatus, status: isStormActive ? 'DE-ICING' : 'OPTIMAL' },
        { label: 'Antenna Elevation', value: '48.2° Az / 142.8° El', status: 'ALIGNED' }
      ],
      description: '3.5m geodesic fiberglass sphere housing automated dual-axis satellite tracking dish.'
    },
    {
      id: 'fuel',
      title: 'Fuel Storage & Logistics Container Yard',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      metrics: [
        { label: 'Arctic Fuel Reserve', value: fuelReserve, status: 'ADEQUATE' },
        { label: 'Container Depot', value: '18 ISO Shipping Pods', status: 'SECURE' },
        { label: 'Pipeline Pressure', value: '4.2 Bar Trace-Heated', status: 'NORMAL' }
      ],
      description: 'Cold-resistant fuel tanks, EXIM/Maersk shipping container pods, and trace-heated pipelines.'
    },
    {
      id: 'lake',
      title: 'Lake Astrid Freshwater Intake & Desalination',
      icon: Waves,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      metrics: [
        { label: 'Water Temp', value: lakeIntake, status: 'HEATED' },
        { label: 'RO Output', value: '12,450 L / Day', status: 'OPTIMAL' },
        { label: 'MBR Effluent Purity', value: '99.4% Zero-Discharge', status: 'PASSED' }
      ],
      description: 'Sub-ice freshwater intake pump house connected via insulated trace-heated conduits.'
    },
    {
      id: 'grid',
      title: 'Central Station Electrical Microgrid',
      icon: Zap,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      metrics: [
        { label: 'Total Grid Load', value: gridLoad, status: isGridFaultActive ? 'FAULT' : 'OPTIMAL' },
        { label: 'Frequency / Voltage', value: '50.0 Hz / 415 V AC', status: 'STABLE' },
        { label: 'HVAC Breaker State', value: isGridFaultActive ? 'TRIPPED' : 'CLOSED', status: isGridFaultActive ? 'TRIPPED' : 'NOMINAL' }
      ],
      description: 'Central microgrid power distribution grid supplying stilts, HVAC, and life-support systems.'
    }
  ];

  const currentArea = stationAreas.find((a) => a.id === activeAreaKey) || stationAreas[0];
  const IconComponent = currentArea.icon;

  return (
    <div 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className={`absolute z-40 shadow-2xl rounded-2xl bg-white border border-slate-200 text-slate-900 font-sans transition-all duration-200 select-none ${
        isCompressed ? 'w-auto max-w-xs' : 'max-w-md w-full'
      }`}
    >
      
      {/* Movable Drag Handle & Header */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-2 cursor-move bg-slate-50/80 rounded-t-2xl border-b hover:bg-slate-100/80 transition-colors"
        title="Click and drag to move HUD anywhere on screen"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Move className="w-4 h-4 text-slate-400 shrink-0" />
          <div className={`p-2 rounded-xl ${currentArea.bgColor} ${currentArea.color} shrink-0`}>
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              STATION AREA CONTROL HUD
            </span>
            
            {!isCompressed ? (
              <div className="relative no-drag">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-[#1A5F5C] transition-colors text-left gap-1 py-0.5"
                >
                  <span className="truncate">{currentArea.title}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#1A5F5C]' : 'text-slate-400'}`} />
                </button>

                {/* Dropdown Options List */}
                {isOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {stationAreas.map((area) => {
                      const AreaIcon = area.icon;
                      const isSelected = area.id === activeAreaKey;
                      return (
                        <button
                          key={area.id}
                          onClick={() => {
                            setActiveAreaKey(area.id);
                            if (onFocusCamera) onFocusCamera(area.id);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-teal-50 font-bold text-[#1A5F5C]' : 'text-slate-700 font-medium'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg ${area.bgColor} ${area.color} shrink-0`}>
                            <AreaIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate font-semibold">{area.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{area.metrics[0].label}: {area.metrics[0].value}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-800 truncate block">
                {currentArea.title}
              </span>
            )}
          </div>
        </div>

        {/* Live Metrics Badge & Compress/Expand Control */}
        <div className="flex items-center gap-1.5 no-drag shrink-0">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE METRICS
          </span>

          <button
            onClick={() => setIsCompressed(!isCompressed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            title={isCompressed ? 'Expand HUD Card' : 'Compress / Minimize HUD Card'}
          >
            {isCompressed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Body */}
      {!isCompressed && (
        <div className="p-3 sm:p-4 space-y-3 bg-slate-50/70 rounded-b-2xl no-drag">
          <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal">
            {currentArea.description}
          </p>

          {/* Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentArea.metrics.map((m, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-medium truncate block">
                  {m.label}
                </span>
                <span className="text-xs font-bold font-mono text-slate-900 mt-1 block truncate">
                  {m.value}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded mt-1 inline-block w-fit ${
                  m.status === 'WARNING' || m.status === 'FAULT' || m.status === 'TRIPPED' || m.status === 'EXTREME' || m.status === 'HIGH HEAT'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : m.status === 'DE-ICING' || m.status === 'DEGRADED'
                    ? 'bg-amber-100 text-amber-700 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          {/* Dynamic Sensor Heat Presentation Matrix overlay ONLY visible when Heatmap mode is ON */}
          {isHeatmapActive && (
            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2 border border-rose-500/40 animate-fade-in font-mono text-xs shadow-lg">
              <div className="flex items-center justify-between text-amber-400 border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <HeatIcon className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span className="font-bold">SENSOR THERMAL HEATMAP PRESENTATION</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 font-bold">
                  HEATMAP ON
                </span>
              </div>

              {/* Dynamic sensor thermal grid matching current area metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px]">
                {(() => {
                  let sensors = [];
                  if (activeAreaKey === 'level1') {
                    sensors = [
                      { name: 'CHP Engine Core', temp: isGridFaultActive ? '108.4°C' : '84.5°C', isHot: true, label: isGridFaultActive ? 'HIGH HEAT' : 'HEATED' },
                      { name: 'RO Water Intake', temp: '+3.8°C', isHot: false, label: 'COOL' },
                      { name: 'Genset Exhaust', temp: isGridFaultActive ? '114.2°C' : '78.0°C', isHot: true, label: isGridFaultActive ? 'CRITICAL HEAT' : 'WARM' },
                      { name: 'Garage Ambient', temp: '-18.2°C', isHot: false, label: 'COLD' }
                    ];
                  } else if (activeAreaKey === 'level2') {
                    sensors = [
                      { name: 'Living Quarters HVAC', temp: '+21.5°C', isHot: false, label: 'NORMAL' },
                      { name: 'Galley Oven Core', temp: '68.5°C', isHot: false, label: 'WARM' },
                      { name: 'Science Lab Incubator', temp: '37.0°C', isHot: false, label: 'NORMAL' },
                      { name: 'Glass Lounge', temp: '+19.8°C', isHot: false, label: 'NORMAL' }
                    ];
                  } else if (activeAreaKey === 'level3') {
                    sensors = [
                      { name: 'PV Inverter Core', temp: '58.4°C', isHot: false, label: 'WARM' },
                      { name: 'AWS Weather Mast', temp: `${telemetry?.bharati?.aws?.windSpeedKnots || 34.2} kts`, isHot: false, label: 'NORMAL' },
                      { name: 'BMS Control Rack', temp: '32.1°C', isHot: false, label: 'NORMAL' },
                      { name: 'Roof Solar Panel', temp: '-14.2°C', isHot: false, label: 'COLD' }
                    ];
                  } else if (activeAreaKey === 'radome') {
                    sensors = [
                      { name: 'Radome De-Icer Heater', temp: isStormActive ? '88.5°C' : '42.0°C', isHot: isStormActive, label: isStormActive ? 'HIGH HEAT' : 'WARM' },
                      { name: 'Az/El Motor Drive', temp: '46.2°C', isHot: false, label: 'WARM' },
                      { name: 'VSAT Transceiver', temp: '38.5°C', isHot: false, label: 'NORMAL' },
                      { name: 'Outer Radome Shell', temp: '-28.4°C', isHot: false, label: 'COLD' }
                    ];
                  } else if (activeAreaKey === 'fuel') {
                    sensors = [
                      { name: 'Trace-Heated Pipeline', temp: '+14.5°C', isHot: false, label: 'NORMAL' },
                      { name: 'Fuel Tank Heater Core', temp: '35.0°C', isHot: false, label: 'NORMAL' },
                      { name: 'Container Pod 12', temp: '-12.4°C', isHot: false, label: 'COLD' },
                      { name: 'Depot Transfer Pump', temp: '24.8°C', isHot: false, label: 'NORMAL' }
                    ];
                  } else if (activeAreaKey === 'lake') {
                    sensors = [
                      { name: 'Sub-Ice Water Pump', temp: '+3.8°C', isHot: false, label: 'COOL' },
                      { name: 'Desalination Membrane', temp: '28.5°C', isHot: false, label: 'NORMAL' },
                      { name: 'Conduit Trace Heater', temp: '18.2°C', isHot: false, label: 'NORMAL' },
                      { name: 'Incinerator Core', temp: '89.4°C', isHot: true, label: 'HIGH HEAT' }
                    ];
                  } else {
                    sensors = [
                      { name: 'Main Power Breaker', temp: isGridFaultActive ? '118.5°C' : '42.5°C', isHot: isGridFaultActive, label: isGridFaultActive ? 'CRITICAL HEAT' : 'NORMAL' },
                      { name: 'Transformer Core', temp: isGridFaultActive ? '94.2°C' : '65.0°C', isHot: isGridFaultActive, label: isGridFaultActive ? 'HIGH HEAT' : 'WARM' },
                      { name: 'Substation Busbar', temp: '34.0°C', isHot: false, label: 'NORMAL' },
                      { name: 'HVAC Air Intake', temp: '-24.8°C', isHot: false, label: 'COLD' }
                    ];
                  }

                  return sensors.map((s, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded font-mono transition-all ${
                        s.isHot
                          ? 'bg-gradient-to-t from-rose-950 via-rose-800 to-red-600 text-white border border-rose-400 shadow-lg animate-pulse'
                          : s.label === 'WARM' || s.label === 'HEATED'
                          ? 'bg-gradient-to-t from-amber-950 to-amber-800 text-amber-100 border border-amber-500/40'
                          : s.label === 'COLD' || s.label === 'COOL'
                          ? 'bg-gradient-to-t from-sky-950 to-blue-900 text-cyan-100 border border-cyan-500/30'
                          : 'bg-gradient-to-t from-emerald-950 to-emerald-800 text-emerald-100 border border-emerald-500/30'
                      }`}
                    >
                      <span className="block truncate opacity-90">{s.name}</span>
                      <strong className="block text-white text-xs mt-0.5">{s.temp}</strong>
                      <span className={`text-[8px] font-bold block mt-0.5 ${s.isHot ? 'text-rose-200' : 'opacity-80'}`}>
                        {s.label}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Area Actions Bar */}
          <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
              AREA ACTIONS:
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  if (onFocusCamera) onFocusCamera(activeAreaKey);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#1A5F5C] text-white hover:bg-[#134947] transition-all flex items-center gap-1 shadow-sm"
                title="Focus 3D View on this Area"
              >
                <Eye className="w-3.5 h-3.5 text-teal-200" />
                Focus 3D View
              </button>

              <button
                onClick={() => setIsCutawayView(!isCutawayView)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                  isCutawayView ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Cutaway
              </button>

              <button
                onClick={() => setIsHeatmapActive(!isHeatmapActive)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                  isHeatmapActive ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                Heatmap
              </button>

              {activeAreaKey === 'grid' && (
                <button
                  onClick={() => {
                    setIsGridFaultActive(!isGridFaultActive);
                    if (triggerEdgeAction) {
                      triggerEdgeAction(isGridFaultActive ? 'RESET_GRID' : 'TRIP_GRID', 'Grid breaker toggled from Area Card');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                    isGridFaultActive ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {isGridFaultActive ? 'Reset Grid' : 'Trip Grid'}
                </button>
              )}

              {activeAreaKey === 'radome' && (
                <button
                  onClick={() => {
                    setIsStormActive(!isStormActive);
                    if (triggerEdgeAction) {
                      triggerEdgeAction('DE_ICE_RADOME', 'Radome de-icing system toggled');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                    isStormActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isStormActive ? 'De-Ice Storm' : 'Test Storm'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

