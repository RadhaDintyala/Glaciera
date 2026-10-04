import React from 'react';

export function Navbar({ activePage, setActivePage }) {
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A5F5C] text-white border-b border-[#247571] shadow-md">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Platform Name */}
        <div 
          onClick={() => handleNavClick('overview')}
          className="flex flex-col cursor-pointer group"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans leading-tight">
            Glaciera
          </span>
          <p className="text-xs sm:text-sm font-sans text-teal-100/90 font-normal">
            Indian Antarctic Remote Operations Platform
          </p>
        </div>

        {/* Navigation Bar Links (Exact items from image) */}
        <nav className="flex items-center gap-2 sm:gap-4 font-sans text-sm sm:text-base font-medium">
          {/* Overview */}
          <button
            onClick={() => handleNavClick('overview')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activePage === 'overview'
                ? 'bg-white text-[#1A5F5C] font-bold shadow-sm'
                : 'text-white hover:text-white/90 hover:bg-white/10'
            }`}
          >
            Overview
          </button>

          {/* 3D twin */}
          <button
            onClick={() => handleNavClick('3d-twin')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              (activePage === '3d-twin' || activePage === 'bharati')
                ? 'bg-white text-[#1A5F5C] font-bold shadow-sm'
                : 'text-white hover:text-white/90 hover:bg-white/10'
            }`}
          >
            3D twin
          </button>

          {/* Logistics */}
          <button
            onClick={() => handleNavClick('logistics')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activePage === 'logistics'
                ? 'bg-white text-[#1A5F5C] font-bold shadow-sm'
                : 'text-white hover:text-white/90 hover:bg-white/10'
            }`}
          >
            Logistics
          </button>

          {/* In-Situ streams */}
          <button
            onClick={() => handleNavClick('insitu')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              (activePage === 'insitu' || activePage === 'data')
                ? 'bg-white text-[#1A5F5C] font-bold shadow-sm'
                : 'text-white hover:text-white/90 hover:bg-white/10'
            }`}
          >
            In-Situ streams
          </button>
        </nav>

      </div>
    </header>
  );
}

