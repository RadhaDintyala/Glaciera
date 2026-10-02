/**
 * In-Situ Dataset Streaming & Physics Generator
 * Covers PS SIH26060 Datasets:
 * 1. Maitri: GPS & Surface Data
 * 2. Maitri: Electric Circuits
 * 3. Maitri: Riometer Data
 * 4. Maitri: Atmospheric Datasets
 * 5. Bharati: AWS (Automatic Weather Station)
 */

export const INITIAL_TELEMETRY = {
  maitri: {
    gpsSurface: {
      driftX: 2.14, // mm/yr
      driftY: -0.85, // mm/yr
      settlementZ: 1.12, // mm
      snowDepth: 142.5, // cm
      foundationTilt: 0.18, // deg
      pillarStrain: 42.8, // % rating
      lastUpdated: new Date().toLocaleTimeString()
    },
    electricCircuits: {
      gen1Output: 145.2, // kW
      gen2Output: 120.0, // kW
      gen3Output: 0.0, // kW (Standby)
      totalLoadKw: 265.2,
      maxCapacityKw: 450.0,
      phaseVoltageA: 230.4,
      phaseVoltageB: 229.8,
      phaseVoltageC: 231.1,
      breakers: {
        livingQuarters: 'NOMINAL', // NOMINAL, TRIPPED, WARNING
        labs: 'NOMINAL',
        hvacPrimary: 'NOMINAL',
        generatorShed: 'NOMINAL',
        commsTower: 'NOMINAL'
      },
      fuelReserveLiters: 14850,
      fuelMaxLiters: 20000,
      fuelBurnRateLh: 24.5
    },
    riometer: {
      absorptionDb: 1.84, // dB cosmic noise absorption
      solarParticleFlux: 12.4, // pfu
      solarFlareState: 'QUIET', // QUIET, MODERATE, CRITICAL
      satcomSignalStrength: 88, // %
      satcomDegradationDb: 0.8
    },
    atmospheric: {
      ambientTemp: -24.5, // °C
      humidity: 62.0, // %
      solarIrradiance: 340.0, // W/m²
      livingTemp: 21.2, // °C
      labTemp: 19.8, // °C
      utilityTemp: 14.5 // °C
    }
  },
  bharati: {
    aws: {
      windSpeedKnots: 34.2, // knots
      windSpeedKmh: 63.3,
      windDirectionDeg: 125, // ° ESE
      barometricPressureHpa: 978.4,
      gustSpeedKnots: 48.5,
      blizzardSeverity: 'MODERATE', // LOW, MODERATE, HIGH, EXTREME
      surfaceTemp: -18.2, // °C
      relativeHumidity: 74.0 // %
    },
    electricCircuits: {
      gen1Output: 210.0,
      totalLoadKw: 210.0,
      maxCapacityKw: 600.0,
      breakers: {
        aerodynamicHull: 'NOMINAL',
        radomes: 'NOMINAL',
        lifeSupport: 'NOMINAL'
      },
      fuelReserveLiters: 32000,
      fuelBurnRateLh: 18.2
    }
  }
};

/**
 * Generate next telemetry tick with dynamic physics variation
 */
export function generateNextTick(currentData, isStormActive = false, isGridFaultActive = false) {
  const data = JSON.parse(JSON.stringify(currentData));
  const timestamp = new Date().toLocaleTimeString();

  // 1. Maitri GPS & Surface
  const driftNoiseX = (Math.random() - 0.48) * 0.05;
  const driftNoiseY = (Math.random() - 0.52) * 0.05;
  data.maitri.gpsSurface.driftX = +(data.maitri.gpsSurface.driftX + driftNoiseX).toFixed(3);
  data.maitri.gpsSurface.driftY = +(data.maitri.gpsSurface.driftY + driftNoiseY).toFixed(3);
  data.maitri.gpsSurface.settlementZ = +(1.12 + Math.sin(Date.now() / 10000) * 0.15).toFixed(2);
  data.maitri.gpsSurface.snowDepth = +(142.5 + (isStormActive ? Math.random() * 0.8 : 0.02)).toFixed(1);
  data.maitri.gpsSurface.lastUpdated = timestamp;

  // 2. Maitri Electric Circuits
  const loadFluctuation = (Math.random() - 0.5) * 4.0;
  let targetLoad = 265.2 + loadFluctuation;
  if (isGridFaultActive) {
    targetLoad += 95.0; // Power spike
  }
  data.maitri.electricCircuits.totalLoadKw = +Math.max(100, Math.min(420, targetLoad)).toFixed(1);
  data.maitri.electricCircuits.gen1Output = +(data.maitri.electricCircuits.totalLoadKw * 0.6).toFixed(1);
  data.maitri.electricCircuits.gen2Output = +(data.maitri.electricCircuits.totalLoadKw * 0.4).toFixed(1);
  data.maitri.electricCircuits.phaseVoltageA = +(230.0 + (Math.random() - 0.5) * 1.5).toFixed(1);
  data.maitri.electricCircuits.phaseVoltageB = +(230.0 + (Math.random() - 0.5) * 1.8).toFixed(1);
  data.maitri.electricCircuits.phaseVoltageC = +(230.0 + (Math.random() - 0.5) * 1.4).toFixed(1);
  data.maitri.electricCircuits.fuelReserveLiters = +Math.max(1000, data.maitri.electricCircuits.fuelReserveLiters - 0.005).toFixed(1);

  if (isGridFaultActive) {
    data.maitri.electricCircuits.breakers.generatorShed = 'WARNING';
    data.maitri.electricCircuits.breakers.hvacPrimary = 'TRIPPED';
  } else {
    data.maitri.electricCircuits.breakers.generatorShed = 'NOMINAL';
    data.maitri.electricCircuits.breakers.hvacPrimary = 'NOMINAL';
  }

  // 3. Maitri Riometer & Space Weather
  let riometerNoise = (Math.random() - 0.48) * 0.2;
  if (isStormActive) riometerNoise += 1.5;
  data.maitri.riometer.absorptionDb = +Math.max(0.2, Math.min(8.5, data.maitri.riometer.absorptionDb + riometerNoise)).toFixed(2);
  
  if (data.maitri.riometer.absorptionDb > 4.5) {
    data.maitri.riometer.solarFlareState = 'CRITICAL';
    data.maitri.riometer.satcomSignalStrength = Math.round(Math.max(22, 90 - data.maitri.riometer.absorptionDb * 12));
    data.maitri.riometer.satcomDegradationDb = +(data.maitri.riometer.absorptionDb * 1.1).toFixed(1);
  } else if (data.maitri.riometer.absorptionDb > 2.5) {
    data.maitri.riometer.solarFlareState = 'MODERATE';
    data.maitri.riometer.satcomSignalStrength = 65;
    data.maitri.riometer.satcomDegradationDb = 1.8;
  } else {
    data.maitri.riometer.solarFlareState = 'QUIET';
    data.maitri.riometer.satcomSignalStrength = 88;
    data.maitri.riometer.satcomDegradationDb = 0.8;
  }

  // 4. Maitri Atmospheric
  const tempDelta = (Math.random() - 0.5) * 0.3;
  data.maitri.atmospheric.ambientTemp = +(data.maitri.atmospheric.ambientTemp + tempDelta).toFixed(1);
  data.maitri.atmospheric.solarIrradiance = +Math.max(0, 340 + Math.sin(Date.now() / 20000) * 80).toFixed(0);

  // 5. Bharati AWS
  let baseWind = isStormActive ? 58.0 : 34.2;
  const windGust = (Math.random() - 0.5) * 5.0;
  data.bharati.aws.windSpeedKnots = +Math.max(5, baseWind + windGust).toFixed(1);
  data.bharati.aws.windSpeedKmh = +(data.bharati.aws.windSpeedKnots * 1.852).toFixed(1);
  data.bharati.aws.gustSpeedKnots = +(data.bharati.aws.windSpeedKnots * 1.35).toFixed(1);
  data.bharati.aws.windDirectionDeg = Math.round((125 + Math.sin(Date.now() / 15000) * 15) % 360);
  data.bharati.aws.barometricPressureHpa = +(978.4 + (Math.random() - 0.5) * 0.8).toFixed(1);
  
  if (data.bharati.aws.windSpeedKnots > 50) {
    data.bharati.aws.blizzardSeverity = 'EXTREME';
  } else if (data.bharati.aws.windSpeedKnots > 40) {
    data.bharati.aws.blizzardSeverity = 'HIGH';
  } else if (data.bharati.aws.windSpeedKnots > 25) {
    data.bharati.aws.blizzardSeverity = 'MODERATE';
  } else {
    data.bharati.aws.blizzardSeverity = 'LOW';
  }

  return data;
}
