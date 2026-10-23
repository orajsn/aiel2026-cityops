import { useMemo } from 'react';
import * as THREE from 'three';
import { Grid } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { CITY_BOUNDS } from './cityLayout';

export const SLAB_THICKNESS = 16;
const MARGIN = 24;

/** The slab the city stands on: top face is the ground, the sides show when the camera drops below it. */
export const SLAB = {
  w: CITY_BOUNDS.maxX - CITY_BOUNDS.minX + MARGIN * 2,
  d: CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ + MARGIN * 2,
  cx: (CITY_BOUNDS.maxX + CITY_BOUNDS.minX) / 2,
  cz: (CITY_BOUNDS.maxZ + CITY_BOUNDS.minZ) / 2,
};

export function Ground() {
  const theme = useUiStore((s) => s.theme);
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ color: theme.slabEdge, roughness: 1 });
    const top = new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 1 });
    const bottom = new THREE.MeshStandardMaterial({ color: theme.slabEdge, roughness: 1 });
    return [side, side, top, bottom, side, side];
  }, [theme.slabEdge, theme.ground]);
  return (
    <>
      <mesh position={[SLAB.cx, -SLAB_THICKNESS / 2 - 0.05, SLAB.cz]} material={materials} receiveShadow name="slab">
        <boxGeometry args={[SLAB.w, SLAB_THICKNESS, SLAB.d]} />
      </mesh>
      {theme.grid && (
        <Grid
          position={[0, 0.02, 0]}
          args={[1600, 1600]}
          cellSize={10}
          sectionSize={50}
          cellColor="#172431"
          sectionColor="#1c3440"
          cellThickness={0.6}
          sectionThickness={1}
          fadeDistance={520}
          fadeStrength={1.6}
          infiniteGrid
        />
      )}
    </>
  );
}
