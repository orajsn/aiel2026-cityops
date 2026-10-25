import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RIVER_CURVE } from './river';
import { BRIDGE, fromBridgeLocal, toBridgeLocal } from './bridgeFrame';
import { terrainHeight } from './terrain';
import { speedUnits } from '../content/traffic';
import { drivableRoutes, useTrafficStore } from '../engine/traffic';
import { makePath, placeVehicles, travel, type Path, type Vehicle } from './trafficPaths';

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

/** the river centreline's length (map units); river boats move in t (0..1) along it */
const RIVER_LENGTH = RIVER_CURVE.getLength();
/** lanes off the centreline, alternating banks; near the bridge every boat is steered into its span lane */
const SIDES = [-0.4, 0.35, -0.3, 0.4, -0.35];

/**
 * River boats from Traffic mode's settings (how many, speed 1..10): spread along the river between t 0.3 and 0.75,
 * ferries and barges in turn, every other one going upstream. Speeds come out the same every time.
 */
export function riverBoats(count: number, speedMin: number, speedMax: number): BoatSpec[] {
  const out: BoatSpec[] = [];
  for (let i = 0; i < count; i++) {
    const f = (i * 0.6180339887) % 1;
    const s = speedMin + (speedMax - speedMin) * f;
    const dir = i % 2 === 0 ? 1 : -1;
    out.push(spec(0.3 + (0.45 * (i + 0.5)) / Math.max(1, count), (dir * speedUnits(s)) / RIVER_LENGTH, SIDES[i % SIDES.length], i % 2 === 0 ? 'ferry' : 'barge'));
  }
  return out;
}

/** today's boats (Traffic mode defaults: five, speed 9 to 10) */
export const BOATS: BoatSpec[] = riverBoats(5, 9, 10);

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

/**
 * Boats: the city's slow ambient motion. With no boat route drawn in Traffic mode they sail the real river;
 * with routes, they go back and forth along those instead. How many and how fast come from Traffic mode.
 */
export function Boats() {
  const fleet = useTrafficStore((s) => s.config.boats);
  const routes = useMemo(() => drivableRoutes(fleet), [fleet]);
  const river = useMemo(() => riverBoats(fleet.count, fleet.speedMin, fleet.speedMax), [fleet.count, fleet.speedMin, fleet.speedMax]);
  const paths = useMemo(() => routes.map((r) => makePath(r.points)), [routes]);
  const onRoutes = useMemo(() => placeVehicles(paths, fleet.count, fleet.speedMin, fleet.speedMax, 23), [paths, fleet.count, fleet.speedMin, fleet.speedMax]);
  return (
    <group name="boats">
      {routes.length
        ? onRoutes.map((v, i) => <RouteBoat key={`r${i}`} vehicle={v} path={paths[v.route]} kind={i % 2 === 0 ? 'ferry' : 'barge'} />)
        : river.map((b, i) => <Boat key={i} spec={b} />)}
    </group>
  );
}

/** a boat on a drawn route */
function RouteBoat({ vehicle, path, kind }: { vehicle: Vehicle; path: Path; kind: 'ferry' | 'barge' }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const p = travel(path, vehicle, clock.elapsedTime);
    if (g.current) {
      g.current.position.set(p.x, terrainHeight(p.x, p.z) + FLOAT, p.z);
      g.current.rotation.y = p.angle;
    }
  });
  return (
    <group ref={g}>
      <BoatBody kind={kind} />
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
  return (
    <group ref={g}>
      <BoatBody kind={b.kind} />
    </group>
  );
}

function BoatBody({ kind }: { kind: 'ferry' | 'barge' }) {
  const ferry = kind === 'ferry';
  const d = ferry ? FERRY : BARGE;
  return (
    <group scale={BOAT_SCALE}>
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
