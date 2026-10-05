# Glaciera — Antarctic Station Telemetry & 3D Digital Twin Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Repository](https://img.shields.io/badge/GitHub-RadhaDintyala%2FGlaciera-181717?logo=github)](https://github.com/RadhaDintyala/Glaciera)

**Glaciera** is an advanced 3D WebGL Digital Twin and real-time operational telemetry monitoring platform built for Indian Antarctic Research Stations (**Bharati Station** & **Maitri Station**), designed for **NCPOR** (National Centre for Polar and Ocean Research, MoES, Government of India).

---

## 🎯 Project Objective & Summary

Operating scientific research bases in the extreme Antarctic wilderness (temperatures plunging below $-40^\circ\text{C}$, wind gusts exceeding $150\text{ km/h}$, severe blizzards, and communication blackouts) requires mission-critical situational awareness and rapid fault diagnosis.

**The Objective of Glaciera is to:**
1. **Provide Real-Time Situational Awareness**: Deliver full-fidelity 3D WebGL digital twins of India's Antarctic bases—allowing remote commanders at NCPOR (Goa) and on-station team leads to inspect structural health, thermal dynamics, and subsystem performance in real time.
2. **Ensure Polar Survivability & Energy Resilience**: Monitor combined heat and power (CHP) cogeneration microgrids, vertical-axis wind turbines, solar PV arrays, and fuel burn rates to prevent catastrophic power failures during polar nights.
3. **Overcome Extreme Bandwidth Constraints**: Employ on-station edge gateways with Google Protocol Buffers (Protobuf) binary serialization and store-and-forward caching to stream telemetry over intermittent ISRO polar satellite links (Cartosat/Oceansat) and VSAT channels.
4. **Safeguard Antarctic Environmental Compliance**: Monitor life support systems, Lake Priyadarshini freshwater extraction, reverse osmosis desalination, and membrane bioreactor (MBR) effluent purity to strictly satisfy the **Madrid Protocol** on Environmental Protection to the Antarctic Treaty.
5. **Track Space Weather & Telecommunications**: Analyze cosmic noise absorption via ionospheric riometers (38.2 MHz) to detect solar flares and geomagnetic storms that degrade satellite connectivity.

---

## 🌟 Key Features & Station Digital Twins

### 1. 🏢 Bharati Station 3D Digital Twin (Larsemann Hills)
Located at Larsemann Hills, Prydz Bay, East Antarctica ($69^\circ24'\text{S}, 76^\circ11'\text{E}$):
- **Aerodynamic 3-Tier Superstructure**: Modeled from 134 ISO shipping containers wrapped in an insulated aerodynamic aluminum cladding supported on heavy steel stilts.
  - **Level 1 (Ground Floor)**: Double rollup vehicle garage doors, 3 $\times$ Volvo Penta 280 kW CHP cogeneration gensets, MBR sewage treatment, and Reverse Osmosis seawater desalination plant.
  - **Level 2 (First Floor)**: 24 crew accommodation cabins (*camarotes*), earth science & glaciology laboratories, medical clinic, and a panoramic double-glazed observation lounge.
  - **Level 3 (Roof Penthouse)**: Station Commander operations desk, conference facility, rooftop solar PV array, and Automatic Weather Station (AWS) mast.
  - **Hilltop ISRO SATCOM Radome**: White translucent geodesic sphere perched on the ridge with dual-axis satellite dish tracking Cartosat-3 and Oceansat-2 passes at 1.24 Gbps.
  - **Site & Logistics Yard**: Multi-color shipping containers (Hapag-Lloyd orange, Maersk blue, Evergreen green, EXIM red), trace-heated pipeline chase, and Lake Astrid freshwater intake.

---

### 2. ❄️ Maitri Station 3D Digital Twin & Operation Hub (Schirmacher Oasis)
Located at Schirmacher Oasis, Queen Maud Land, East Antarctica ($70^\circ45'\text{S}, 11^\circ44'\text{E}$, elevation 117m):
- **Dual-Tier Parallel Aerodynamic Modules**: Modern stilt-supported aerodynamic architecture engineered over rocky Oasis permafrost.
  - **Block A (Upper Tier Living & Command)**: Modular living quarters, galley kitchen, dining mess hall, station commander control station, medical trauma suite, and panoramic observation lounge overlooking the permafrost landscape.
  - **Block B (Lower Tier Science Superstructure)**: 18 dedicated science laboratories (geomagnetism, meteorology, atmospheric physics, environmental chemistry) with telemetry server racks and external access ramp.
  - **Interconnecting Glazed Skywalk**: Enclosed, heated steel-and-glass passageway connecting Block A and Block B.
  - **Block C (Service Core & Microgrid Spine)**: Cummins 250 kW diesel gensets, twin thermal exhaust stacks with animated heat-haze particle simulation, heat recovery exchangers, and twin rotating vertical-axis wind turbines.
  - **High-Strength V-Truss Steel Stilts**: Elevated V-leg structural frames with concrete foundation footings preventing permafrost thaw and snowdrift buildup.
  - **Lake Priyadarshini Sub-Ice Freshwater Intake**: Pumping station circulating fresh water through 380m of insulated trace-heated conduits into central filtration and RO systems.
  - **Oasis Logistics Depot**: Polar container pods, tracked snow vehicle spares, scientific drill rigs, and 48,500 L Jet A-1 fuel depot.
- **Interactive 3D Viewport Controls**:
  - **Cutaway Floor Inspector**: Toggle transparent outer hull shells to reveal internal modular shipping container layouts.
  - **Ground Thermal Heatmap Overlay**: Live surface temperature gradients displaying building thermal footprints and heat dissipation.
  - **Blizzard Particle Physics**: Dynamic snowfall driven by live wind speed and blizzard toggle.
  - **Subsystem Zonal Inspector**: Instant inspection switches across Block A, Block B, Block C, Lake Priyadarshini, and the Oasis Depot.
- **Telemetry Operational Suites**:
  - **Microgrid & Wind Spine**: Real-time electrical load monitoring, wind turbine generation (24.8 kW), and fuel reserves / runtime projections.
  - **Cosmic Noise Riometer**: 38.2 MHz ionospheric absorption (dB), solar flare space weather classification, and 480 Mbps polar VSAT link telemetry.
  - **Priyadarshini Hydronics**: Sub-ice intake water temperature (+3.8°C), daily potable water yield (11,500 L/day), and ambient oasis meteorology.
  - **Habitat & Madrid Compliance**: 99.4% MBR wastewater purification, V-stilt structural strain telemetry, and bio-waste incinerator cycle monitoring.

---

### 3. 📊 Subsystem Risk Heat Map Matrix (2D & 3D)
- **Impact vs. Probability Risk Matrix**: Continuous color-gradient heat map ($G \rightarrow Y \rightarrow O \rightarrow R$) calibrated to polar mission safety standards.
- **Interactive Subsystem Nodes**: Active tracking of critical nodes ($R_1$ Microgrid, $R_2$ Thermal Heating, $R_3$ Water Intake, $R_4$ SATCOM Link, $R_5$ Structural Drift, $R_6$ Life Support) plotted on both the 2D mission control dashboard and the 3D terrain canvas.
- **Depth-Offset Rendering**: Zero z-fighting visual artifacts on terrain textures through custom polygon depth offsets and canvas textures.

---

### 4. ⚡ 5-Layer End-to-End System Architecture

```text
┌────────────────────────────────────────────────────────┐
│  Layer 1: In-Situ Sensors & Scientific Datasets        │
│  • AWS Meteorology (Wind, Temp, Pressure, Humidity)    │
│  • Microgrid Cogeneration & Genset Sensors             │
│  • 38.2 MHz Cosmic Noise Riometer Absorption           │
│  • Priyadarshini & Astrid Sub-Ice Hydronic Intakes     │
└──────────────────────────┬─────────────────────────────┘
                           │ Raw Sensor Feeds
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 2: Edge Processing Gateway (On-Station Daemon)  │
│  • Protobuf Binary Encoding (82.4% Payload Reduction)  │
│  • Outage Buffer & Store-and-Forward Memory Queue      │
│  • Local Edge Fault Detection & Microgrid Automation   │
└──────────────────────────┬─────────────────────────────┘
                           │ Compressed Binary Stream
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 3: SATCOM & Polar Network Transport             │
│  • ISRO Satellite Pass Tracking (Cartosat-3, Oceansat) │
│  • Dual-Axis Polar Radome Ground Station Downlink      │
│  • High-Reliability Polar VSAT Uplink (480 Mbps)       │
└──────────────────────────┬─────────────────────────────┘
                           │ Decrypted Stream
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 4: NCPOR Cloud Gateway (Goa HQ)                 │
│  • Scalable Ingestion Pipeline & Protobuf Parser       │
│  • WebSocket Broadcast Engine to Mission Desks         │
│  • Bidirectional Level 2 Command & Telemetry Loop      │
└──────────────────────────┬─────────────────────────────┘
                           │ Live WebSocket Feed
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 5: Commander 3D Digital Twin & Mission Control  │
│  • Full CAD 3D WebGL Canvas (Bharati & Maitri Bases)   │
│  • Cutaway Inspector, Blizzard Physics & Thermal Maps  │
│  • 2D Operational Mission Control & Risk Matrix        │
└────────────────────────────────────────────────────────┘
```

---

### 5. 📦 Logistics, Inventory & Predictive Maintenance
- **Expedition Vessel Tracking**: MV *Vasiliy Golovnin* resupply voyage ETA countdown, cargo manifesto, and container allocation.
- **Low-Bandwidth Predictive Maintenance**: Vibrational FFT spectral analysis on generator bearings, automated anomaly flagging, and remote diagnostic presets.

---

## 🛠️ Technology Stack

- **Frontend & UI**: React 19, JavaScript ES6+, TailwindCSS, Lucide Icons
- **3D Graphics & WebGL**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Charts & Data Visualization**: Recharts, Canvas 2D API
- **Build & Development**: Vite 8
- **Data Protocols**: Google Protocol Buffers (Protobuf) schema patterns, WebSocket event loops

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js v18.0 or higher
- npm v9.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/RadhaDintyala/Glaciera.git
cd Glaciera
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to access the Glaciera mission console.

### 4. Build for Production
```bash
npm run build
```

---

## 📜 License & Acknowledgments
Designed for **NCPOR** (National Centre for Polar and Ocean Research, Ministry of Earth Sciences, Government of India) in support of the Indian Antarctic Programme. All Antarctic Treaty and Madrid Protocol environmental safeguards respected.
