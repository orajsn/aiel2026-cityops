import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { drivableRoutes, useTrafficStore } from '../engine/traffic';
import { roadHeight } from './roadHeight';
import { CITY_DIM } from './BangkokCity';
import { makePath, placeOnRoutes, travel } from './trafficPaths';

/** a car in metres (body 1.8 x 4.4, cabin on top); 1 map unit is about 108 m; each route sets its cars' size */
const M = 1 / 108;
/** Traffic mode's size 1..8: 1 = true scale (invisible from city height), each step adds four times that */
export const carScale = (size: number) => M * (1 + (size - 1) * 4);
/**
 * Body colours as a real street has them (owner, 25 Oct: more variety): mostly white, silver, grey and black,
 * then muted blues, greens, a taxi green-yellow, sand and brown. No red, pink or orange: red is for alerts.
 * `weight` is how often each comes up.
 */
const MIX: [string, number][] = [
  ['#f4f5f6', 5], // white
  ['#e9e4da', 2], // pearl
  ['#c3c9cf', 4], // silver
  ['#8b96a3', 3], // grey
  ['#4d5662', 3], // dark grey
  ['#1e2024', 4], // black
  ['#25395c', 2], // navy
  ['#3f6fb0', 2], // blue
  ['#1B8A9C', 1], // teal
  ['#2f5d4a', 1], // dark green
  ['#b8cc3a', 1], // taxi green-yellow
  ['#e2c044', 1], // yellow
  ['#c8bb96', 1], // sand
  ['#6b5644', 1], // brown
];
export const CAR_COLOURS = MIX.map(([c]) => c);
const WEIGHTS = MIX.reduce((a, [, w]) => a + w, 0);
/** the colour for a car's tint (0..1, from its seeded random) */
export function carColour(tint: number): string {
  let left = Math.min(0.999999, Math.max(0, tint)) * WEIGHTS;
  for (const [c, w] of MIX) if ((left -= w) < 0) return c;
  return MIX[0][0];
}
const WHITE = new THREE.Color('#ffffff');
const CABIN = new THREE.Color('#2a3440');

/**
 * Cars on the routes drawn in Traffic mode (none until a car route is drawn). All of them are one instanced
 * body and one instanced cabin, so even 300 cars cost about as much as one.
 */
export function Cars() {
  const fleet = useTrafficStore((s) => s.config.cars);
  const routes = useMemo(() => drivableRoutes(fleet), [fleet]);
  const paths = useMemo(() => routes.map((r) => makePath(r.points)), [routes]);
  // each route has its own count, speed range and size
  const cars = useMemo(() => placeOnRoutes(paths, routes, 41), [paths, routes]);
  const body = useRef<THREE.InstancedMesh>(null);
  const cabin = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => ({ body: new THREE.BoxGeometry(1.8, 0.7, 4.4), cabin: new THREE.BoxGeometry(1.6, 0.6, 2.2) }), []);
  useEffect(() => () => (geo.body.dispose(), geo.cabin.dispose()), [geo]);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), y: new THREE.Vector3(0, 1, 0), c: new THREE.Vector3() }), []);

  const scene = useThree((s) => s.scene);
  // the cars fade into the haze with the city on the Ops pages (CITY_DIM), by their colours: no shader is touched
  const shown = useRef(-1);
  const paint = (dim: number) => {
    const haze = scene.fog?.color ?? WHITE;
    const tmp = new THREE.Color();
    cars.forEach((v, i) => {
      body.current?.setColorAt(i, tmp.set(carColour(v.tint)).lerp(haze, dim));
      cabin.current?.setColorAt(i, tmp.copy(WHITE).lerp(haze, dim));
    });
    for (const mesh of [body.current, cabin.current]) if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (cabin.current) (cabin.current.material as THREE.MeshStandardMaterial).color.copy(CABIN).lerp(haze, dim);
    shown.current = dim;
  };
  // colours: set once per fleet (instanceColor)
  useEffect(() => paint(CITY_DIM.value), [cars]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock }) => {
    if (!body.current || !cabin.current || !cars.length) return;
    if (Math.abs(CITY_DIM.value - shown.current) > 0.01) paint(CITY_DIM.value);
    cars.forEach((v, i) => {
      const k = carScale(v.size ?? 1);
      tmp.s.set(k, k, k);
      const at = travel(paths[v.route], v, clock.elapsedTime);
      // on Harbor Bridge the deck, anywhere else the ground
      const y = roadHeight(at.x, at.z);
      tmp.q.setFromAxisAngle(tmp.y, at.angle);
      tmp.p.set(at.x, y + 0.35 * k + 0.002, at.z);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      body.current!.setMatrixAt(i, tmp.m);
      tmp.c.set(0, 0.65 * k, -0.2 * k).applyQuaternion(tmp.q);
      tmp.p.add(tmp.c);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      cabin.current!.setMatrixAt(i, tmp.m);
    });
    body.current.instanceMatrix.needsUpdate = true;
    cabin.current.instanceMatrix.needsUpdate = true;
  });

  if (!cars.length) return null;
  return (
    <group name="cars">
      {/* keyed on the count: an InstancedMesh cannot grow after it is made */}
      <instancedMesh key={`b${cars.length}`} ref={body} args={[geo.body, undefined, cars.length]} frustumCulled={false} castShadow>
        <meshStandardMaterial roughness={0.6} metalness={0.1} />
      </instancedMesh>
      <instancedMesh key={`c${cars.length}`} ref={cabin} args={[geo.cabin, undefined, cars.length]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.3} metalness={0.2} color={CABIN} />
      </instancedMesh>
    </group>
  );
}
