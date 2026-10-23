import { useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { CITY_BOUNDS } from './cityLayout';

/**
 * "Bangkok" by TerraMesh (Sketchfab, CC-BY-4.0): real building footprints extruded from GIS data.
 * Textures and terrain are stripped (tools: see public/models/city/bangkok); blocks are flat-coloured
 * here by height so they sit in the kit palette. Units in the file are centimetres.
 */
const URL = '/models/city/bangkok/scene.gltf';

/** Georeference: model centimetres -> scene units (1 unit ~ 108 m), plus offset and yaw. Tuned by eye against the river. */
export const BKK = {
  /** model units -> scene units, fitted on Lumphini Park and Sanam Luang in the model's own aerial texture */
  scale: 1 / 54,
  /** vertical exaggeration so real-metre buildings read at the toy scale */
  heightScale: 1.6,
  x: -56.6,
  z: -57.3,
  yaw: 0,
  /** the model's north axis runs opposite to the scene's (+z is south here) */
  mirrorZ: true,
};

/** Model extent in scene units (half sizes from the file, through scale). */
const HALF_X = 71.9 * 2;
const HALF_Z = 39.9 * 2;
/** True when (x, z) is inside the area the model covers. */
export function bangkokCovers(x: number, z: number, margin = 0): boolean {
  return Math.abs(x - BKK.x) < HALF_X - margin && Math.abs(z - BKK.z) < HALF_Z - margin;
}

const PALETTE = {
  low: new THREE.Color('#E9E1D0'),
  mid: new THREE.Color('#D8D2C6'),
  tall: new THREE.Color('#9FB1C4'),
  tower: new THREE.Color('#7F95AE'),
  roof: new THREE.Color('#F0E9DA'),
};

export function BangkokCity() {
  const gltf = useGLTF(URL);
  const theme = useUiStore((s) => s.theme);
  const clip = useMemo(
    () => [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -CITY_BOUNDS.minX),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), CITY_BOUNDS.maxX),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), -CITY_BOUNDS.minZ),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), CITY_BOUNDS.maxZ),
    ],
    [],
  );

  const scene = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const geo = m.geometry;
      geo.computeBoundingBox();
      const isRoof = m.name.startsWith('Roof');
      // vertex colours by height band so one draw call still shows variety
      const pos = geo.getAttribute('position');
      const colors = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const h = pos.getY(i); // centimetres in mesh space (root nodes scale to metres)
        const c = isRoof ? PALETTE.roof : h > 4500 ? PALETTE.tower : h > 2000 ? PALETTE.tall : h > 800 ? PALETTE.mid : PALETTE.low;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const calib = typeof location !== 'undefined' && location.hash.includes('calib');
      m.material = calib
        ? new THREE.MeshBasicMaterial({ color: '#000000', side: THREE.DoubleSide, clippingPlanes: clip })
        : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, flatShading: true, side: THREE.DoubleSide, clippingPlanes: clip });
      m.castShadow = true;
      m.receiveShadow = true;
    });
    return root;
  }, [gltf, clip]);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && (m.material as THREE.MeshStandardMaterial).vertexColors) (m.material as THREE.MeshStandardMaterial).color.set(theme.buildingTint);
    });
  }, [scene, theme.buildingTint]);

  return (
    <group name="bangkok-city" position={[BKK.x, 0, BKK.z]} rotation={[0, BKK.yaw, 0]} scale={[BKK.scale, BKK.scale * BKK.heightScale, BKK.mirrorZ ? -BKK.scale : BKK.scale]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload?.(URL);
