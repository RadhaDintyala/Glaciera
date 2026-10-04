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
      className={`absolute z-40 shadow-2xl rounded-2xl bg-[#12161D]/95 border border-[#202632] backdrop-blur-md text-white font-sans transition-all duration-200 select-none ${
        isCompressed ? 'w-auto max-w-xs' : 'max-w-md w-full'
      }`}
    >
      
      {/* Movable Drag Handle & Header */}
      <div 
        onMouseDown={handleMouseDown}
        className="p-3 sm:p-4 border-b border-[#202632] flex items-center justify-between gap-2 cursor-move bg-[#181D26]/90 rounded-t-2xl hover:bg-[#181D26] transition-colors"
        title="Click and drag to move HUD anywhere on screen"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Move className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="p-2 rounded-xl bg-[#0B0D11] text-sky-400 border border-[#202632] shrink-0">
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400 block">
              STATION AREA CONTROL HUD
            </span>
            
            {!isCompressed ? (
              <div className="relative no-drag">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-sky-400 transition-colors text-left gap-1 py-0.5"
                >
                  <span className="truncate">{currentArea.title}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-sky-400' : 'text-slate-400'}`} />
                </button>

                {/* Dropdown Options List */}
                {isOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#12161D] border border-[#202632] rounded-xl shadow-2xl py-1.5 z-50 max-h-64 overflow-y-auto divide-y divide-[#202632]">
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
                          className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 hover:bg-[#181D26] transition-colors ${
                            isSelected ? 'bg-[#181D26] font-semibold text-white' : 'text-slate-300 font-normal'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-[#0B0D11] text-slate-400 border border-[#202632] shrink-0">
                            <AreaIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate font-medium">{area.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{area.metrics[0].label}: {area.metrics[0].value}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-white truncate block">
                {currentArea.title}
              </span>
            )}
          </div>
        </div>

        {/* Live Metrics Badge & Compress/Expand Control */}
        <div className="flex items-center gap-1.5 no-drag shrink-0">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#181D26] text-emerald-400 border border-[#202632] hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            LIVE METRICS
          </span>

          <button
            onClick={() => setIsCompressed(!isCompressed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181D26] transition-colors"
            title={isCompressed ? 'Expand HUD Card' : 'Compress / Minimize HUD Card'}
          >
            {isCompressed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Body */}
      {!isCompressed && (
        <div className="p-3 sm:p-4 space-y-3 bg-[#12161D] rounded-b-2xl no-drag">
          <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
            {currentArea.description}
          </p>

          {/* Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentArea.metrics.map((m, idx) => (
              <div key={idx} className="bg-[#181D26] p-2.5 rounded-xl border border-[#202632] flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-medium truncate block">
                  {m.label}
                </span>
                <span className="text-xs font-bold font-mono text-white mt-1 block truncate">
                  {m.value}
                </span>
                <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded mt-1 inline-block w-fit ${
                  m.status === 'WARNING' || m.status === 'FAULT' || m.status === 'TRIPPED' || m.status === 'EXTREME' || m.status === 'HIGH HEAT'
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                    : m.status === 'DE-ICING' || m.status === 'DEGRADED'
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                    : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          {/* Dynamic Sensor Heat Presentation Matrix overlay ONLY visible when Heatmap mode is ON */}
          {isHeatmapActive && (
            <div className="p-3 rounded-xl bg-[#0B0D11] text-white space-y-2 border border-[#202632] animate-fade-in font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300 border-b border-[#202632] pb-1.5">
                <div className="flex items-center gap-1.5">
                  <HeatIcon className="w-4 h-4 text-rose-400" />
                  <span className="font-semibold text-white">SENSOR THERMAL HEATMAP PRESENTATION</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-medium">
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
                      className={`p-2 rounded-lg font-mono border ${
                        s.isHot
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                          : s.label === 'WARM' || s.label === 'HEATED'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                          : s.label === 'COLD' || s.label === 'COOL'
                          ? 'bg-sky-950/40 text-sky-300 border-sky-800/60'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                      }`}
                    >
                      <span className="block truncate text-slate-400">{s.name}</span>
                      <strong className="block text-white text-xs mt-0.5">{s.temp}</strong>
                      <span className="text-[8px] font-medium block mt-0.5 opacity-90">
                        {s.label}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Area Actions Bar */}
          <div className="pt-2 border-t border-[#202632] flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">
              AREA ACTIONS:
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  if (onFocusCamera) onFocusCamera(activeAreaKey);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white text-neutral-950 hover:bg-neutral-200 transition-all flex items-center gap-1 shadow-sm"
                title="Focus 3D View on this Area"
              >
                <Eye className="w-3.5 h-3.5" />
                Focus 3D View
              </button>

              <button
                onClick={() => setIsCutawayView(!isCutawayView)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  isCutawayView ? 'bg-[#181D26] text-white border border-[#202632]' : 'bg-[#0B0D11] text-slate-400 hover:text-white border border-[#202632]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Cutaway
              </button>

              <button
                onClick={() => setIsHeatmapActive(!isHeatmapActive)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                  isHeatmapActive ? 'bg-[#181D26] text-rose-400 border border-rose-800/60' : 'bg-[#0B0D11] text-slate-400 hover:text-white border border-[#202632]'
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                    isGridFaultActive ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60' : 'bg-[#181D26] text-slate-300 hover:text-white border border-[#202632]'
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                    isStormActive ? 'bg-sky-950/60 text-sky-400 border border-sky-800/60' : 'bg-[#181D26] text-slate-300 hover:text-white border border-[#202632]'
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

