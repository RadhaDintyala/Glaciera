import React, { useState } from 'react';
import { AlertCircle, Info, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

/**
 * 2D Risk Heat Map Chart Component
 * Exact visual match to the user's reference image:
 * - Gradient background from Green (Low) -> Yellow (Moderate) -> Orange -> Red (High/Critical)
 * - Y-Axis: Impact | X-Axis: Activity
 * - Plotted blue circular nodes: R1, R2, R3, R4, R5, R6
 */
export function RiskHeatMap2DChart() {
  const [selectedNode, setSelectedNode] = useState(null);

  const riskNodes = [
    { id: 'R3', name: 'R3: Hydraulic Stilts Settlement', x: 22, y: 52, impact: 'Low (2.4)', activity: 'Moderate (3.1)', desc: 'Permafrost stilt load sensors detecting minor seasonal ground heave.' },
    { id: 'R2', name: 'R2: Desalination Intake Flow', x: 42, y: 32, impact: 'Low (1.8)', activity: 'Moderate (4.2)', desc: 'Prydz Bay trace-heated pipe intake operating at normal pressure.' },
    { id: 'R1', name: 'R1: Fuel Depot Buffer Reserve', x: 42, y: 52, impact: 'Moderate (3.5)', activity: 'Moderate (4.2)', desc: '184,200 L Arctic fuel reserve status normal.' },
    { id: 'R4', name: 'R4: CHP Generator Exhaust Core', x: 62, y: 72, impact: 'High (4.8)', activity: 'High (6.5)', desc: 'Volvo Penta 280kW generator heat recovery loop at 84.5°C.' },
    { id: 'R5', name: 'R5: ISRO SATCOM Radome Pass', x: 80, y: 72, impact: 'High (4.9)', activity: 'High (8.2)', desc: 'Cartosat-3 downlink tracking during active polar wind gusting.' },
    { id: 'R6', name: 'R6: Ice Margin Crevassing', x: 92, y: 88, impact: 'Critical (5.8)', activity: 'High (9.4)', desc: 'Fast-ice edge fracture risk during katabatic wind storms.' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Chart Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white font-sans tracking-wide">
              Risk Heat Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Station Subsystem Impact vs. Activity Matrix (Real-Time Sensor Risk Plot)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            Low Risk (Green)
          </span>
          <span className="px-2.5 py-1 rounded bg-yellow-950 text-yellow-300 border border-yellow-500/30">
            Moderate (Yellow)
          </span>
          <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
            Critical (Red)
          </span>
        </div>
      </div>

      {/* Main Heat Map Canvas Container */}
      <div className="relative w-full max-w-4xl mx-auto space-y-2">
        {/* Y-Axis Label */}
        <div className="flex items-center gap-4">
          <div className="-rotate-90 text-sm font-bold font-mono text-slate-300 tracking-wider shrink-0 uppercase">
            Impact
          </div>

          {/* Heat Map Gradient Box (Matches Image Palette) */}
          <div className="relative flex-1 h-[420px] rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden bg-gradient-to-tr from-lime-500 via-yellow-400 via-40% via-orange-500 to-red-600">
            
            {/* Soft grid lines overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Plotted Blue Data Nodes (Matching image circular dots with R1, R2, R3 labels) */}
            {riskNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x}%`, bottom: `${node.y}%` }}
                className="absolute -translate-x-1/2 translate-y-1/2 cursor-pointer group z-10"
              >
                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-blue-400 shadow-xl group-hover:scale-110 transition-transform">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md animate-pulse" />
                  <span className="text-xs font-bold font-mono text-white whitespace-nowrap">
                    {node.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* X-Axis Label */}
        <div className="text-center text-sm font-bold font-mono text-slate-300 tracking-wider pl-12 uppercase">
          Activity
        </div>
      </div>

      {/* Selected Node Details Box */}
      {selectedNode ? (
        <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
            </div>
            <p className="text-slate-300 font-sans text-xs">{selectedNode.desc}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Impact Level</span>
              <span className="text-amber-300 font-bold">{selectedNode.impact}</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Activity Score</span>
              <span className="text-cyan-300 font-bold">{selectedNode.activity}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center text-xs font-mono text-slate-400">
          Click any blue node (R1, R2, R3...) on the Risk Heat Map chart to view subsystem impact details.
        </div>
      )}
    </div>
  );
}
