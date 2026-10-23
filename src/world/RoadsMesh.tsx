import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useUiStore } from '../engine/ui';
import { HALF_WIDTH, ELEVATION, ribbonGeometry, roadRibbons, type RoadClass } from './roads';

const ROAD_CLASSES: RoadClass[] = ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'link'];
const BRIDGE_LIFT = 1.4;

/**
 * Real Bangkok streets as flat ribbons: a lighter kerb under a darker carriageway.
 * Elevated runs (expressways, bridges, the skytrain) sit on piers.
 */
export function Roads() {
  const theme = useUiStore((s) => s.theme);
  const built = useMemo(() => {
    const ribbons = roadRibbons();
    const kerb: THREE.BufferGeometry[] = [];
    const road: THREE.BufferGeometry[] = [];
    const rail: THREE.BufferGeometry[] = [];
    const piers: THREE.Matrix4[] = [];
    const tmp = new THREE.Object3D();
    for (const r of ribbons) {
      const half = HALF_WIDTH[r.c];
      const lift = r.elevated ? Math.max(BRIDGE_LIFT, ELEVATION[r.c]) : 0;
      const y = 0.06 + lift;
      if (r.c === 'rail' || r.c === 'skytrain') {
        rail.push(ribbonGeometry(r.pts, half, y + 0.02));
      } else {
        kerb.push(ribbonGeometry(r.pts, half + 0.22, y));
        road.push(ribbonGeometry(r.pts, half, y + 0.02));
      }
      if (lift > 0) {
        // piers along the run every ~5 units
        let acc = 0;
        for (let i = 0; i < r.pts.length - 1; i++) {
          const a = r.pts[i];
          const b = r.pts[i + 1];
          const len = a.distanceTo(b);
          for (let d = acc; d < len; d += 8) {
            const k = d / len;
            tmp.position.set(a.x + (b.x - a.x) * k, lift / 2, a.z + (b.z - a.z) * k);
            tmp.scale.set(half * 0.5, lift, half * 0.5);
            tmp.updateMatrix();
            piers.push(tmp.matrix.clone());
          }
          acc = (acc + Math.ceil((len - acc) / 8) * 8 - len) % 8;
        }
      }
    }
    const merge = (list: THREE.BufferGeometry[]) => (list.length ? mergeGeometries(list, false) : null);
    return { kerb: merge(kerb), road: merge(road), rail: merge(rail), piers };
  }, []);

  const pierMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#b9bcc4', roughness: 1 }), built.piers.length);
    built.piers.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.instanceMatrix.needsUpdate = true;
    m.castShadow = true;
    return m;
  }, [built]);

  const light = theme.name === 'light';
  return (
    <group name="roads">
      {built.kerb && (
        <mesh geometry={built.kerb} receiveShadow>
          <meshStandardMaterial color={light ? '#e6e1d6' : '#1a2230'} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      )}
      {built.road && (
        <mesh geometry={built.road} receiveShadow>
          <meshStandardMaterial color={light ? '#9ea4ae' : '#2a3442'} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      )}
      {built.rail && (
        <mesh geometry={built.rail}>
          <meshStandardMaterial color={light ? '#b4b8c0' : '#3a4656'} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      )}
      <primitive object={pierMesh} />
    </group>
  );
}
