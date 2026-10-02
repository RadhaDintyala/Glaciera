import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { getModelConfig } from '../../config/modelConfig';

/**
 * Reusable Native GLB 3D Model Viewer Component for Three.js / R3F
 * Handles automatic normalization, mesh traversal, material preservation,
 * animations, hover effects, and click callbacks for object inspection.
 */
export function GLBModelViewer({
  modelKey = 'crewQuarters',
  customPath = null,
  position = null,
  rotation = null,
  scale = null,
  onObjectClick = null,
  onObjectHover = null,
  isHeatmapActive = false,
  isFaultActive = false,
  autoRotate = false
}) {
  const groupRef = useRef();
  const [hoveredMeshName, setHoveredMeshName] = useState(null);

  // Resolve model configuration
  const config = useMemo(() => {
    return getModelConfig(customPath || modelKey);
  }, [modelKey, customPath]);

  // Load GLB asset via Drei / R3F GLTFLoader pipeline
  const { scene, animations } = useGLTF(config.path);

  // Attach animations if model contains clip tracks
  const { actions, names } = useAnimations(animations, groupRef);

  // Automatically start default animation clip if present
  useEffect(() => {
    if (names && names.length > 0 && actions[names[0]]) {
      actions[names[0]].reset().fadeIn(0.5).play();
      return () => {
        if (actions[names[0]]) actions[names[0]].fadeOut(0.5);
      };
    }
  }, [actions, names]);

  // Process scene hierarchy, calculate bounding box, scale, and center alignment
  const { clonedScene, boundingInfo } = useMemo(() => {
    // Clone scene to avoid mutating globally cached model instances
    const cloned = scene.clone(true);

    // Compute bounding box before transformation
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    // Calculate normalization scale factor
    const maxDim = Math.max(size.x, size.y, size.z);
    const normalizedScale = config.targetSize ? (config.targetSize / (maxDim || 1)) : 1.0;

    // Reposition scene geometry relative to root origin: center X and Z, align Y bottom to 0
    cloned.position.x = -center.x * normalizedScale;
    cloned.position.y = -box.min.y * normalizedScale;
    cloned.position.z = -center.z * normalizedScale;
    cloned.scale.set(normalizedScale, normalizedScale, normalizedScale);

    // Traverse all meshes to configure shadows and material properties
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = config.shadows ?? true;
        child.receiveShadow = config.shadows ?? true;

        // Ensure materials display clean shading
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;
        }
      }
    });

    return {
      clonedScene: cloned,
      boundingInfo: {
        dimensions: {
          width: (size.x * normalizedScale).toFixed(2),
          height: (size.y * normalizedScale).toFixed(2),
          depth: (size.z * normalizedScale).toFixed(2)
        },
        scaleFactor: normalizedScale.toFixed(3)
      }
    };
  }, [scene, config]);

  // Optional subtle rotation animation for showcase view
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Handle pointer hover over individual meshes
  const handlePointerOver = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    const meshName = mesh.name || 'Unnamed Mesh';
    setHoveredMeshName(meshName);

    // Highlight hovered mesh with subtle emissive tint
    if (mesh.material && mesh.material.emissive) {
      mesh.userData.origEmissive = mesh.material.emissive.getHex();
      mesh.material.emissive.setHex(0x06b6d4); // Cyan highlight glow
    }

    if (onObjectHover) {
      const meta = config.meshes[meshName] || {
        label: meshName,
        type: 'Sub-Component Mesh',
        system: 'Integrated Geometry',
        material: mesh.material?.name || 'Standard PBR',
        status: 'Nominal'
      };
      onObjectHover({ meshName, mesh, meta, boundingInfo });
    }
  };

  // Handle pointer out to restore original mesh state
  const handlePointerOut = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    setHoveredMeshName(null);

    if (mesh.material && mesh.material.emissive && mesh.userData.origEmissive !== undefined) {
      mesh.material.emissive.setHex(mesh.userData.origEmissive);
    }

    if (onObjectHover) {
      onObjectHover(null);
    }
  };

  // Handle click on specific object/mesh in model
  const handleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    const meshName = mesh.name || 'Unnamed Mesh';
    const point = e.point;

    const meta = config.meshes[meshName] || {
      label: meshName,
      type: 'Structural Component',
      system: 'GLB Mesh Node',
      material: mesh.material?.name || 'Standard PBR Material',
      status: 'Nominal',
      efficiency: '100%'
    };

    if (onObjectClick) {
      onObjectClick({
        meshName,
        mesh,
        meta,
        point: [point.x.toFixed(2), point.y.toFixed(2), point.z.toFixed(2)],
        boundingInfo,
        hasAnimations: names.length > 0,
        availableAnimations: names
      });
    }
  };

  const finalPos = position || config.initialPosition;
  const finalRot = rotation || config.initialRotation;
  const finalScale = scale || [1, 1, 1];

  return (
    <group
      ref={groupRef}
      position={finalPos}
      rotation={finalRot}
      scale={finalScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={clonedScene} />

      {/* Optional Heatmap Overlay Glow if activated */}
      {isHeatmapActive && (
        <pointLight position={[0, 4, 0]} intensity={2.5} color="#06b6d4" distance={15} />
      )}

      {/* Grid Fault Alert Glow if activated */}
      {isFaultActive && (
        <pointLight position={[0, 3, 0]} intensity={4.0} color="#ef4444" distance={20} />
      )}
    </group>
  );
}

// Preload model asset to prevent runtime hitching
useGLTF.preload('/models/arctic_crew_quaters.glb');
