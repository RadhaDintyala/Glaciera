# Glaciera — Antarctic Station Telemetry & 3D Digital Twin Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Repository](https://img.shields.io/badge/GitHub-RadhaDintyala%2FGlaciera-181717?logo=github)](https://github.com/RadhaDintyala/Glaciera)

**Glaciera** is an advanced 3D WebGL Digital Twin and real-time operational telemetry monitoring platform built for Indian Antarctic Research Bases (**Bharati Station** & **Maitri Station**), designed for **NCPOR** (National Centre for Polar and Ocean Research, MoES, Government of India).

---

## 🌟 Key Features

### 1. 🏢 Bharati Station 3D Digital Twin Engine
- **Accurate Superstructure Geometry**: Built with Three.js (`@react-three/fiber`) to match official photographs of Bharati Station at Larsemann Hills, Prydz Bay.
  - **Level 1 (Ground Floor)**: Double rollup vehicle garage doors, Caterpillar/Volvo Penta CHP cogeneration power plant, MBR waste treatment, and Reverse Osmosis desalination plant.
  - **Level 2 (First Floor)**: 24 crew cabins (*camarotes*), earth science & glaciology labs, and double-glazed panoramic observation lounge.
  - **Level 3 (Roof Penthouse)**: Station Commander operations desk, rooftop solar PV array, and Automatic Weather Station (AWS) mast.
  - **Hilltop ISRO SATCOM Radome**: White translucent geodesic sphere perched on the ridge with an automated satellite tracking dish antenna.
  - **Site & Logistics Yard**: Colorful ISO shipping containers (Hapag-Lloyd orange, Maersk blue, Evergreen green, EXIM red), trace-heated pipeline chase, and Lake Astrid freshwater intake.

### 2. 📊 Risk Heat Map Matrix (2D & 3D)
- **Impact vs. Activity Heatmap**: Replicates continuous gradient risk matrices (Green $\rightarrow$ Yellow $\rightarrow$ Orange $\rightarrow$ Red).
- **Subsystem Risk Nodes**: Interactive $R_1, R_2, R_3, R_4, R_5, R_6$ nodes plotted across both the 2D dashboard matrix and the 3D ground plane.
- **Flicker-Free Rendering**: Uses depth offset and procedural canvas textures to prevent z-fighting visual artifacts.

### 3. ❄️ Maitri Station Phase 2 View
- Sleek **"Digital Twin Coming Soon (Phase 2 Integration)"** view for the Schirmacher Oasis station, outlining bandwidth optimization and upcoming telemetry node releases.

### 4. ⚡ 5-Layer End-to-End System Architecture
- **Layer 1**: In-Situ Sensors (AWS Meteorology, Riometer Absorption, Microgrid Gensets, Lake Priyadarshini Intake).
- **Layer 2**: Edge Processing Gateway (Protobuf binary streaming, store-and-forward buffer).
- **Layer 3**: SATCOM Network Transport (ISRO Satellite Pass Downlink, Cartosat-3 / Oceansat-2 tracking).
- **Layer 4**: NCPOR Cloud Gateway (WebSocket telemetry broadcast & Level 2 command loop).
- **Layer 5**: Station Commander 3D Digital Twin & 2D Mission Control Console.

---

## 🛠️ Technology Stack

- **Core**: React 19, JavaScript ES6+
- **3D Graphics & WebGL**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Build Tool**: Vite 8
- **UI Components & Icons**: TailwindCSS, Lucide-React
- **Data Charts**: Recharts

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
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for Production
```bash
npm run build
```

---

