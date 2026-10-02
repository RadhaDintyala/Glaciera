/**
 * Central 3D GLB Model Configuration Registry for SIH 2026 Digital Twin Architecture
 */
export const MODEL_CONFIGS = {
  crewQuarters: {
    id: 'crewQuarters',
    name: 'Arctic Crew Quarters',
    subtitle: 'Polar Expedition Living Quarters & Environmental Command Unit',
    path: '/models/arctic_crew_quaters.glb',
    targetSize: 18.0, // Normalized bounding diameter in scene units
    initialPosition: [0, 0.5, 0],
    initialRotation: [0, Math.PI / 4, 0],
    shadows: true,
    meshes: {
      'Object_2': {
        label: 'Primary Reinforced Facade & Insulation Hull',
        type: 'Exterior Structural Shell',
        system: 'Thermal Enclosure',
        material: 'Cold-Rolled Weathering Alloy',
        status: 'Nominal',
        efficiency: '99.4%'
      },
      'Object_3': {
        label: 'Interior Habitat Frame & Sub-Deck Infrastructure',
        type: 'Habitation Architecture',
        system: 'Internal Life Support & Crew Quarters',
        material: 'Composite Polymer & Steel Ribbing',
        status: 'Active',
        efficiency: '98.8%'
      }
    }
  }
};

/**
 * Helper to retrieve model metadata by key or custom path
 */
export function getModelConfig(keyOrPath) {
  if (MODEL_CONFIGS[keyOrPath]) {
    return MODEL_CONFIGS[keyOrPath];
  }
  
  // Return dynamic fallback config for external models added in public/models/
  const fileName = keyOrPath.split('/').pop().replace(/\.[^/.]+$/, '');
  return {
    id: keyOrPath,
    name: fileName.replace(/_/g, ' ').toUpperCase(),
    subtitle: 'Externally Sourced GLB Asset',
    path: keyOrPath.startsWith('/') ? keyOrPath : `/models/${keyOrPath}`,
    targetSize: 18.0,
    initialPosition: [0, 0.5, 0],
    initialRotation: [0, 0, 0],
    shadows: true,
    meshes: {}
  };
}
