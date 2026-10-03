/**
 * In-Situ Dataset Streaming & Physics Generator
 * SIH26060: Digital Platform for Remote Management of Indian Antarctic Research Stations (Maitri & Bharati)
 * 
 * Core Modules Covered:
 * 1. 3D Digital Twin & Station Telemetry (Spatial models, sensors, air quality, structural vibration, snow load)
 * 2. Energy & Microgrid Management (DG sets, Solar PV, Wind turbines, Load forecasting, Fuel reserves & burn rate analytics)
 * 3. Inventory, Supply Chain & Life Support Logistics (Rations, medical, spares, expedition resupply, snow melting, waste)
 * 4. Low-Bandwidth Synchronization & Predictive Maintenance (Store-and-forward VSAT, Protobuf, anomaly detection RUL, RBAC)
 */

export const INITIAL_TELEMETRY = {
  activeRole: 'COMMANDER', // COMMANDER | TECHNICIAN | SCIENTIST | MINISTRY

  maitri: {
    stationName: 'Maitri Research Station',
    location: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: "70°45'57\"S, 11°44'09\"E",
    elevationMeters: 117,
    establishedYear: 1989,

    // Module 1: Physical Sensors & Environmental Telemetry
    gpsSurface: {
      driftX: 2.14, // mm/yr
      driftY: -0.85, // mm/yr
      settlementZ: 1.12, // mm
      snowDepth: 142.5, // cm
      snowLoadKgM2: 245.8, // kg/m² structural load
      foundationTilt: 0.18, // deg
      pillarStrain: 42.8, // % rating
      structuralVibrationRms: 1.42, // mm/s
      lastUpdated: new Date().toLocaleTimeString()
    },
    atmospheric: {
      ambientTemp: -24.5, // °C
      outdoorHumidity: 62.0, // %
      windSpeedKnots: 28.4,
      windSpeedKmh: 52.6,
      windDirectionDeg: 140,
      solarIrradiance: 340.0, // W/m²
      livingTemp: 21.2, // °C
      labTemp: 19.8, // °C
      utilityTemp: 14.5, // °C
      airQuality: {
        co2Ppm: 412,
        pm25: 2.1, // µg/m³
        vocIndex: 14 // index 0-500
      }
    },

    // Module 2: Microgrid & Energy Management
    electricCircuits: {
      gen1Output: 145.2, // kW (Primary Cummins DG-1)
      gen2Output: 120.0, // kW (Secondary DG-2)
      gen3Output: 0.0, // kW (Standby DG-3)
      solarPvOutputKw: 38.5, // Solar array
      windTurbineOutputKw: 24.8, // Wind turbine system
      totalLoadKw: 265.2,
      maxCapacityKw: 550.0,
      phaseVoltageA: 230.4,
      phaseVoltageB: 229.8,
      phaseVoltageC: 231.1,
      gridFrequencyHz: 50.02,
      breakers: {
        livingQuarters: 'NOMINAL', // NOMINAL, TRIPPED, WARNING
        labs: 'NOMINAL',
        hvacPrimary: 'NOMINAL',
        generatorShed: 'NOMINAL',
        commsTower: 'NOMINAL'
      },
      smartLoadSheddingActive: false
    },
    fuelStorage: {
      totalReserveLiters: 48500,
      maxCapacityLiters: 65000,
      currentBurnRateLh: 24.5, // L/hour normal
      blizzardBurnRateLh: 42.1, // L/hour blizzard
      remainingDaysNormal: 82.5,
      remainingDaysBlizzard: 47.9,
      fuelQualityPurityPct: 99.4,
      fuelType: 'Polar Grade ATF / Jet A-1'
    },

    // Module 3: Inventory & Life Support Logistics
    inventory: {
      rationsDays: 168,
      freezeDriedKg: 3850,
      dryGrainsKg: 2900,
      frozenMeatKg: 1450,
      freshHydroponicKg: 62,
      medicalDays: 210,
      traumaKits: 18,
      oxygenCylinders: 38,
      antibioticCourses: 150,
      scientificHeliumTanks: 14,
      liquidNitrogenLiters: 380,
      spareDgFilters: 12,
      sparePumpImpellers: 6
    },
    lifeSupport: {
      snowMelterLitersDay: 7200,
      roDesalinationLitersDay: 11500,
      waterTankLevelPct: 84.0,
      waterPurityPpm: 14,
      incineratorState: 'ACTIVE_CYCLE',
      greywaterTreatmentLh: 380,
      primaryHeatingLoopTempC: 82.4,
      secondaryHeatingLoopTempC: 74.8,
      emergencyOxygenBar: 180
    },

    // Module 4: Space Weather & Telemetry
    riometer: {
      absorptionDb: 1.84, // dB cosmic noise absorption
      solarParticleFlux: 12.4, // pfu
      solarFlareState: 'QUIET', // QUIET, MODERATE, CRITICAL
      satcomSignalStrength: 88, // %
      satcomDegradationDb: 0.8
    }
  },

  bharati: {
    stationName: 'Bharati Research Station',
    location: 'Larsemann Hills, Prydz Bay',
    coordinates: "69°24'28\"S, 76°11'14\"E",
    elevationMeters: 35,
    establishedYear: 2012,

    // Module 1: Physical Sensors & Environmental Telemetry
    aws: {
      windSpeedKnots: 34.2,
      windSpeedKmh: 63.3,
      windDirectionDeg: 125, // ° ESE
      barometricPressureHpa: 978.4,
      gustSpeedKnots: 48.5,
      blizzardSeverity: 'MODERATE', // LOW, MODERATE, HIGH, EXTREME
      surfaceTemp: -18.2, // °C
      relativeHumidity: 74.0,
      snowDepthCm: 188.4,
      snowLoadKgM2: 310.2,
      structuralVibrationRms: 0.98,
      foundationTiltDeg: 0.08,
      airQuality: {
        co2Ppm: 398,
        pm25: 1.4,
        vocIndex: 8
      }
    },

    // Module 2: Microgrid & Energy Management
    electricCircuits: {
      gen1Output: 210.0,
      gen2Output: 180.0,
      gen3Output: 0.0,
      solarPvOutputKw: 58.0,
      windTurbineOutputKw: 42.0,
      totalLoadKw: 490.0,
      maxCapacityKw: 750.0,
      phaseVoltageA: 231.0,
      phaseVoltageB: 230.5,
      phaseVoltageC: 230.8,
      gridFrequencyHz: 50.01,
      breakers: {
        aerodynamicHull: 'NOMINAL',
        radomes: 'NOMINAL',
        lifeSupport: 'NOMINAL',
        labs: 'NOMINAL',
        helinode: 'NOMINAL'
      },
      smartLoadSheddingActive: false
    },
    fuelStorage: {
      totalReserveLiters: 92000,
      maxCapacityLiters: 120000,
      currentBurnRateLh: 38.2,
      blizzardBurnRateLh: 64.5,
      remainingDaysNormal: 100.3,
      remainingDaysBlizzard: 59.4,
      fuelQualityPurityPct: 99.8,
      fuelType: 'Polar Grade ATF / Jet A-1'
    },

    // Module 3: Inventory & Life Support Logistics
    inventory: {
      rationsDays: 210,
      freezeDriedKg: 6200,
      dryGrainsKg: 4800,
      frozenMeatKg: 2800,
      freshHydroponicKg: 110,
      medicalDays: 240,
      traumaKits: 28,
      oxygenCylinders: 60,
      antibioticCourses: 240,
      scientificHeliumTanks: 22,
      liquidNitrogenLiters: 650,
      spareDgFilters: 20,
      sparePumpImpellers: 10
    },
    lifeSupport: {
      snowMelterLitersDay: 12500,
      roDesalinationLitersDay: 18400,
      waterTankLevelPct: 91.5,
      waterPurityPpm: 9,
      incineratorState: 'OPTIMAL_RECYCLED',
      greywaterTreatmentLh: 620,
      primaryHeatingLoopTempC: 84.5,
      secondaryHeatingLoopTempC: 78.0,
      emergencyOxygenBar: 200
    },

    // Module 4: Space Weather & Telemetry
    riometer: {
      absorptionDb: 1.12,
      solarParticleFlux: 8.2,
      solarFlareState: 'QUIET',
      satcomSignalStrength: 94,
      satcomDegradationDb: 0.4
    }
  },

  // Shared Logistics & Resupply Ship Data (SIH26060 Module 3)
  expeditionResupply: {
    vesselName: 'MV Vasiliy Golovnin (Indian Antarctic Expedition 44)',
    departurePort: 'Mormugao Port Trust, Goa',
    currentLocation: "Southern Ocean (48°12'S, 52°30'E)",
    etaDays: 34,
    progressPct: 58,
    cargoLoadedTons: 680,
    cargoCapacityTons: 1200,
    nextPort: 'Larsemann Hills (Bharati Station)',
    priorityOrdersCount: 8
  },

  // Module 4: Predictive Equipment Anomaly Detection Engine Data
  predictiveAnomalies: [
    {
      id: 'ANOM-401',
      station: 'maitri',
      equipment: 'DG Set 2 Hydraulic Fuel Injection Pump',
      sector: 'Generator Shed',
      metric: 'Bearing Vibration RMS',
      currentVal: '4.85 mm/s',
      thresholdVal: '3.20 mm/s',
      severity: 'WARNING', // HEALTHY | WARNING | CRITICAL
      rulPct: 62,
      failureRiskScore: '38%',
      suggestedAction: 'Inspect pump shaft alignment and replace secondary oil seal within 72 hours.'
    },
    {
      id: 'ANOM-402',
      station: 'bharati',
      equipment: 'Primary HVAC CHP Heat Exchanger Pump 1',
      sector: 'Level 1 Utility Core',
      metric: 'Coolant Flow Rate & Thermal Delta',
      currentVal: '31.2 L/min (Delta 14°C)',
      thresholdVal: '45.0 L/min (Delta 22°C)',
      severity: 'CRITICAL',
      rulPct: 24,
      failureRiskScore: '78%',
      suggestedAction: 'Cavitation detected in impeller chamber. Switch to Backup Loop B and flush intake filter immediately.'
    },
    {
      id: 'ANOM-403',
      station: 'maitri',
      equipment: 'RO Desalination High-Pressure Membrane Pump',
      sector: 'Life Support Module',
      metric: 'System Pressure Loss',
      currentVal: '48.2 bar',
      thresholdVal: '58.0 bar',
      severity: 'WARNING',
      rulPct: 71,
      failureRiskScore: '29%',
      suggestedAction: 'Membrane fouling buildup. Schedule chemical CIP (Clean-In-Place) wash cycle.'
    },
    {
      id: 'ANOM-404',
      station: 'bharati',
      equipment: 'ISRO Downlink Radome Servo Drive',
      sector: 'Radome Dome 2',
      metric: 'Azimuth Motor Current Draw',
      currentVal: '18.4 A',
      thresholdVal: '14.0 A',
      severity: 'WARNING',
      rulPct: 81,
      failureRiskScore: '19%',
      suggestedAction: 'De-icing heater output insufficient during gust. Increase radome thermal shroud power.'
    }
  ]
};

/**
 * Generate next telemetry tick with dynamic physics variation
 */
export function generateNextTick(currentData, isStormActive = false, isGridFaultActive = false) {
  const data = JSON.parse(JSON.stringify(currentData));
  const timestamp = new Date().toLocaleTimeString();

  // 1. Maitri Physical & Environmental
  const driftNoiseX = (Math.random() - 0.48) * 0.05;
  const driftNoiseY = (Math.random() - 0.52) * 0.05;
  data.maitri.gpsSurface.driftX = +(data.maitri.gpsSurface.driftX + driftNoiseX).toFixed(3);
  data.maitri.gpsSurface.driftY = +(data.maitri.gpsSurface.driftY + driftNoiseY).toFixed(3);
  data.maitri.gpsSurface.settlementZ = +(1.12 + Math.sin(Date.now() / 10000) * 0.15).toFixed(2);
  data.maitri.gpsSurface.snowDepth = +(142.5 + (isStormActive ? Math.random() * 0.8 : 0.02)).toFixed(1);
  data.maitri.gpsSurface.snowLoadKgM2 = +(245.8 + (isStormActive ? Math.random() * 3.5 : 0.1)).toFixed(1);
  data.maitri.gpsSurface.structuralVibrationRms = +(1.42 + (isStormActive ? Math.random() * 0.8 : 0.05)).toFixed(2);
  data.maitri.gpsSurface.lastUpdated = timestamp;

  // 2. Maitri Electric Circuits & Fuel
  const loadFluctuation = (Math.random() - 0.5) * 4.0;
  let targetLoad = 265.2 + loadFluctuation;
  if (isGridFaultActive) {
    targetLoad += 95.0; // Power spike
  }
  data.maitri.electricCircuits.totalLoadKw = +Math.max(100, Math.min(520, targetLoad)).toFixed(1);
  data.maitri.electricCircuits.gen1Output = +(data.maitri.electricCircuits.totalLoadKw * 0.55).toFixed(1);
  data.maitri.electricCircuits.gen2Output = +(data.maitri.electricCircuits.totalLoadKw * 0.35).toFixed(1);
  data.maitri.electricCircuits.solarPvOutputKw = +Math.max(5, 38.5 + (Math.random() - 0.5) * 2.0).toFixed(1);
  data.maitri.electricCircuits.windTurbineOutputKw = +Math.max(8, 24.8 + (isStormActive ? 15.0 : 0) + (Math.random() - 0.5) * 3.0).toFixed(1);

  data.maitri.electricCircuits.phaseVoltageA = +(230.0 + (Math.random() - 0.5) * 1.5).toFixed(1);
  data.maitri.electricCircuits.phaseVoltageB = +(230.0 + (Math.random() - 0.5) * 1.8).toFixed(1);
  data.maitri.electricCircuits.phaseVoltageC = +(230.0 + (Math.random() - 0.5) * 1.4).toFixed(1);
  
  const currentBurn = isStormActive ? 42.1 : 24.5;
  data.maitri.fuelStorage.currentBurnRateLh = currentBurn;
  data.maitri.fuelStorage.totalReserveLiters = +Math.max(1000, data.maitri.fuelStorage.totalReserveLiters - (currentBurn / 3600) * 1.5).toFixed(2);
  data.maitri.fuelStorage.remainingDaysNormal = +(data.maitri.fuelStorage.totalReserveLiters / (24.5 * 24)).toFixed(1);
  data.maitri.fuelStorage.remainingDaysBlizzard = +(data.maitri.fuelStorage.totalReserveLiters / (42.1 * 24)).toFixed(1);

  if (isGridFaultActive) {
    data.maitri.electricCircuits.breakers.generatorShed = 'WARNING';
    data.maitri.electricCircuits.breakers.hvacPrimary = 'TRIPPED';
  } else {
    data.maitri.electricCircuits.breakers.generatorShed = 'NOMINAL';
    data.maitri.electricCircuits.breakers.hvacPrimary = 'NOMINAL';
  }

  // 3. Maitri Space Weather
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

  // 5. Bharati AWS Weather & Microgrid
  let baseWind = isStormActive ? 58.0 : 34.2;
  const windGust = (Math.random() - 0.5) * 5.0;
  data.bharati.aws.windSpeedKnots = +Math.max(5, baseWind + windGust).toFixed(1);
  data.bharati.aws.windSpeedKmh = +(data.bharati.aws.windSpeedKnots * 1.852).toFixed(1);
  data.bharati.aws.gustSpeedKnots = +(data.bharati.aws.windSpeedKnots * 1.35).toFixed(1);
  data.bharati.aws.windDirectionDeg = Math.round((125 + Math.sin(Date.now() / 15000) * 15) % 360);
  data.bharati.aws.barometricPressureHpa = +(978.4 + (Math.random() - 0.5) * 0.8).toFixed(1);
  data.bharati.aws.snowLoadKgM2 = +(310.2 + (isStormActive ? Math.random() * 5.0 : 0.2)).toFixed(1);
  data.bharati.aws.structuralVibrationRms = +(0.98 + (isStormActive ? Math.random() * 1.2 : 0.02)).toFixed(2);
  
  if (data.bharati.aws.windSpeedKnots > 50) {
    data.bharati.aws.blizzardSeverity = 'EXTREME';
  } else if (data.bharati.aws.windSpeedKnots > 40) {
    data.bharati.aws.blizzardSeverity = 'HIGH';
  } else if (data.bharati.aws.windSpeedKnots > 25) {
    data.bharati.aws.blizzardSeverity = 'MODERATE';
  } else {
    data.bharati.aws.blizzardSeverity = 'LOW';
  }

  const bharatiBurn = isStormActive ? 64.5 : 38.2;
  data.bharati.fuelStorage.currentBurnRateLh = bharatiBurn;
  data.bharati.fuelStorage.totalReserveLiters = +Math.max(2000, data.bharati.fuelStorage.totalReserveLiters - (bharatiBurn / 3600) * 1.5).toFixed(2);
  data.bharati.fuelStorage.remainingDaysNormal = +(data.bharati.fuelStorage.totalReserveLiters / (38.2 * 24)).toFixed(1);
  data.bharati.fuelStorage.remainingDaysBlizzard = +(data.bharati.fuelStorage.totalReserveLiters / (64.5 * 24)).toFixed(1);

  return data;
}

