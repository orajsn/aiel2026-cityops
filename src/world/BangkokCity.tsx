import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

/**
 * "Bangkok" by TerraMesh (Sketchfab, CC-BY-4.0), used as delivered: terrain with its aerial
 * texture and the extruded buildings with their wall textures. Only the heavy roughness and
 * specular maps were dropped. Georeferenced so the pins and the river centreline land on it.
 */
const URL = '/models/city/bangkok-full/scene.gltf';

/**
 * Model units -> scene units. Fitted on Sanam Luang and Lumphini Park in the model's aerial texture,
 * then checked top-down against the OSM river and main roads (within ~100 m across the model).
 * The model covers about 15 x 8 km: Bang Sue edge to just south of Taksin, Thonburi to Asok.
 */
export const BKK = {
  scale: 1 / 110,
  x: -57.11,
  z: -54.04,
};

/** half extents of the model in its own units */
const MODEL_HALF_X = 7765;
const MODEL_HALF_Z = 4309;
/** True when (x, z) is inside the area the model covers. */
export function bangkokCovers(x: number, z: number, margin = 0): boolean {
  return (
    Math.abs(x - BKK.x) < MODEL_HALF_X * BKK.scale - margin && Math.abs(z - BKK.z) < MODEL_HALF_Z * BKK.scale - margin
  );
}

export function BangkokCity() {
  const gltf = useGLTF(URL);
  const scene = useMemo(() => {
    const root = gltf.scene;
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = !m.name.startsWith('Map');
      m.receiveShadow = true;
    });
    return root;
  }, [gltf]);
  return (
    <group name="bangkok-city" position={[BKK.x, 0, BKK.z]} scale={BKK.scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload?.(URL);
