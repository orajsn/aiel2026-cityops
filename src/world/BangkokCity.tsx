import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

/**
 * "Bangkok" by TerraMesh (Sketchfab, CC-BY-4.0), used as delivered: terrain with its aerial
 * texture and the extruded buildings with their wall textures. Only the heavy roughness and
 * specular maps were dropped. Georeferenced so the pins and the river centreline land on it.
 */
const URL = '/models/city/bangkok-full/scene.gltf';

/** Model units -> scene units, fitted on Lumphini Park and Sanam Luang in the model's own aerial texture. */
export const BKK = {
  scale: 1 / 54,
  x: -56.6,
  z: -57.3,
  /** the model's north axis runs opposite to the scene's (+z is south here) */
  mirrorZ: true,
};

const HALF_X = 71.9 * 2;
const HALF_Z = 39.9 * 2;
/** True when (x, z) is inside the area the model covers. */
export function bangkokCovers(x: number, z: number, margin = 0): boolean {
  return Math.abs(x - BKK.x) < HALF_X - margin && Math.abs(z - BKK.z) < HALF_Z - margin;
}

export function BangkokCity() {
  const gltf = useGLTF(URL);
  const scene = useMemo(() => {
    const root = gltf.scene;
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.side = THREE.DoubleSide; // mirrored on z: both faces must draw
      m.castShadow = !m.name.startsWith('Map');
      m.receiveShadow = true;
    });
    return root;
  }, [gltf]);
  return (
    <group name="bangkok-city" position={[BKK.x, 0, BKK.z]} scale={[BKK.scale, BKK.scale, BKK.mirrorZ ? -BKK.scale : BKK.scale]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload?.(URL);
