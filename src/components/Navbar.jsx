import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';

export function Navbar({ activePage, setActivePage }) {
  const { activeStation, setActiveStation } = useTelemetry();

  const handleNavClick = (pageId, stationKey = null) => {
    if (stationKey) {
      setActiveStation(stationKey);
    }
    setActivePage(pageId);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', station: null },
    { id: 'bharati', label: 'Bharati 3D Twin', station: 'bharati' },
    { id: 'maitri', label: 'Maitri 3D Twin', station: 'maitri' },
    { id: 'logistics', label: 'Logistics', station: null },
    { id: 'insitu', label: 'In-Situ Streams', station: null },
    { id: 'crisis-management', label: 'Remote Access', station: null },
  ];

  const isItemActive = (item) => {
    if (item.id === 'bharati') {
      return activePage === 'bharati' || activePage === '3d-twin';
    }
    if (item.id === 'insitu') {
      return activePage === 'insitu' || activePage === 'data';
    }
    return activePage === item.id;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0D11]/90 backdrop-blur-md text-slate-100 border-b border-[#202632] shadow-sm transition-colors duration-100">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Platform Name */}
        <div 
          onClick={() => handleNavClick('overview')}
          className="flex flex-col cursor-pointer group select-none transition-transform duration-100 active:scale-95"
        >
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans leading-tight group-hover:text-sky-300 transition-colors duration-100">
            Glaciera
          </span>
          <p className="text-xs sm:text-sm font-sans text-slate-400 font-normal tracking-wide">
            Indian Antarctic Remote Operations Platform
          </p>
        </div>

        {/* Navigation Bar Links with Ultra-Fast, Responsive Hover */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 font-sans text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.station)}
                className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-100 ease-out select-none active:scale-95 ${
                  active
                    ? 'bg-white text-slate-950 font-semibold shadow-sm shadow-black/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
