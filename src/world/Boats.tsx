import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RIVER_CURVE } from './river';
import { BRIDGE, fromBridgeLocal, toBridgeLocal } from './bridgeFrame';
import { terrainHeight } from './terrain';

export interface BoatSpec {
  t: number;
  speed: number;
  side: number;
  kind: 'ferry' | 'barge';
  /** footprint in world units */
  width: number;
  length: number;
}

/** boat model scale: a ferry comes out ~6 m by ~19 m, a barge ~8 m by ~30 m */
const BOAT_SCALE = 0.05;
const FERRY = { w: 1.1, l: 3.6 };
const BARGE = { w: 1.4, l: 5.5 };
/** tallest part of a boat (barge wheelhouse) above the water */
export const BOAT_TOP_Y = 1.4 * BOAT_SCALE;
const FLOAT = 0.004;

function spec(t: number, speed: number, side: number, kind: 'ferry' | 'barge'): BoatSpec {
  const d = kind === 'ferry' ? FERRY : BARGE;
  return { t, speed, side, kind, width: d.w * BOAT_SCALE, length: d.l * BOAT_SCALE };
}

export const BOATS: BoatSpec[] = [
  spec(0.3, 0.0035, -0.4, 'ferry'),
  spec(0.42, -0.0028, 0.35, 'barge'),
  spec(0.55, 0.003, -0.3, 'ferry'),
  spec(0.66, -0.0025, 0.4, 'barge'),
  spec(0.74, 0.0032, -0.35, 'ferry'),
];

const tmp = new THREE.Vector3();
function smooth(e0: number, e1: number, x: number) {
  const k = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return k * k * (3 - 2 * k);
}

/**
 * Where a boat is at river position t: off the centreline by its side, and near Harbor Bridge
 * steered into its lane through the main span (between Pier 3 and Pier 4), clear of every pier,
 * tower leg and the Pier 3 platform.
 */
export function boatXZ(t: number, b: BoatSpec): { x: number; z: number } {
  const p = RIVER_CURVE.getPointAt(t, tmp);
  const tan = RIVER_CURVE.getTangentAt(t);
  const x = p.x - tan.z * 0.3 * b.side;
  const z = p.z + tan.x * 0.3 * b.side;
  const { lx, lz } = toBridgeLocal(x, z);
  const w = 1 - smooth(0.7, 1.6, Math.abs(lz));
  if (w <= 0) return { x, z };
  const lane = b.speed > 0 ? BRIDGE.lanes[0] : BRIDGE.lanes[1];
  return fromBridgeLocal(lx + (lane - lx) * w, lz);
}

/** A few boats on the real river: the city's slow ambient motion. */
export function Boats() {
  return (
    <group name="boats">
      {BOATS.map((b, i) => (
        <Boat key={i} spec={b} />
      ))}
    </group>
  );
}

function Boat({ spec: b }: { spec: BoatSpec }) {
  const g = useRef<THREE.Group>(null);
  const t = useRef(b.t);
  const prev = useMemo(() => new THREE.Vector2(), []);
  useFrame((_, dt) => {
    t.current += b.speed * dt;
    if (t.current > 0.9) t.current = 0.25;
    if (t.current < 0.25) t.current = 0.9;
    const { x, z } = boatXZ(t.current, b);
    if (g.current) {
      // float on the map's water surface; face the way it is moving
      g.current.position.set(x, terrainHeight(x, z) + FLOAT, z);
      const mx = x - prev.x;
      const mz = z - prev.y;
      if (mx * mx + mz * mz > 1e-10) g.current.rotation.y = Math.atan2(mx, mz);
      prev.set(x, z);
    }
  });
  const ferry = b.kind === 'ferry';
  const d = ferry ? FERRY : BARGE;
  return (
    <group ref={g} scale={BOAT_SCALE}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[d.w, 0.6, d.l]} />
        <meshStandardMaterial color={ferry ? '#f4f1ea' : '#4d5f73'} roughness={0.9} />
      </mesh>
      {ferry ? (
        <mesh position={[0, 0.85, -0.3]} castShadow>
          <boxGeometry args={[0.8, 0.5, 2.0]} />
          <meshStandardMaterial color="#1B8A9C" roughness={0.9} />
        </mesh>
      ) : (
        <>
          <mesh position={[0, 0.8, 0.4]} castShadow>
            <boxGeometry args={[1.2, 0.45, 3]} />
            <meshStandardMaterial color="#c9a37a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.0, -2]} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color="#f4f1ea" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}
