import React from 'react';
import heroImg from '../assets/hero.jpg';
import { useTelemetry } from '../context/TelemetryContext';
import { Thermometer, Wind, MapPin, ArrowUpRight } from 'lucide-react';

export function LandingHeroContent() {
  const { telemetry } = useTelemetry();

  const temp = telemetry?.maitri?.atmospheric?.ambientTemp !== undefined 
    ? `${Math.round(telemetry.maitri.atmospheric.ambientTemp)}°C` 
    : '-32°C';
    
  const windSpeed = telemetry?.bharati?.aws?.windSpeedKmh !== undefined 
    ? `${Math.round(telemetry.bharati.aws.windSpeedKmh / 3.6)}m/s` 
    : '18m/s';

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex flex-col justify-between overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* Background Image with Dark Vignette/Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Glaciera Antarctic Station Hero"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Ambient Overlay Gradients matching design */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/30 to-slate-950/90" />
        <div className="absolute inset-0 bg-radial-vignette opacity-60" />
      </div>

      {/* Main Hero Typography */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center my-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
          Monitor the Extreme.
        </h1>
        <p className="text-slate-200/90 text-base sm:text-lg md:text-xl font-normal max-w-2xl leading-relaxed drop-shadow">
          Real-time intelligence to remote the research
          <br className="hidden sm:inline" />
          monitoring station in its environments.
        </p>
      </main>

      {/* Bottom Telemetry Bar Overlay */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-300/80 font-medium tracking-wide font-mono uppercase">
            Glaciera Telemetry Live Stream
          </span>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {/* Coordinate Metric */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                78°13'S
              </span>
            </div>

            {/* Temperature Metric */}
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                {temp}
              </span>
            </div>

            {/* Wind Speed Metric */}
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                {windSpeed}
              </span>
            </div>

            {/* Distance / Elevation Metric */}
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                4.2km
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
