import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { drivableRoutes, useTrafficStore } from '../engine/traffic';
import { roadHeight } from './roadHeight';
import { makePath, placeVehicles, travel } from './trafficPaths';

/** a car in metres (body 1.8 x 4.4, cabin on top); 1 map unit is about 108 m */
const M = 1 / 108;
/** Traffic mode's size 1..8: 1 = true scale (invisible from city height), each step adds four times that */
export const carScale = (size: number) => M * (1 + (size - 1) * 4);
/** cool body colours, the Oracle palette's greys and whites with a little teal (no red: red is for alerts) */
const COLOURS = ['#e9edf1', '#c9d1d9', '#8b96a3', '#5d6a78', '#f4f1ea', '#1B8A9C'].map((c) => new THREE.Color(c));

/**
 * Cars on the routes drawn in Traffic mode (none until a car route is drawn). All of them are one instanced
 * body and one instanced cabin, so even 300 cars cost about as much as one.
 */
export function Cars() {
  const fleet = useTrafficStore((s) => s.config.cars);
  const routes = useMemo(() => drivableRoutes(fleet), [fleet]);
  const paths = useMemo(() => routes.map((r) => makePath(r.points)), [routes]);
  const cars = useMemo(() => placeVehicles(paths, fleet.count, fleet.speedMin, fleet.speedMax, 41), [paths, fleet.count, fleet.speedMin, fleet.speedMax]);
  const body = useRef<THREE.InstancedMesh>(null);
  const cabin = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => ({ body: new THREE.BoxGeometry(1.8, 0.7, 4.4), cabin: new THREE.BoxGeometry(1.6, 0.6, 2.2) }), []);
  useEffect(() => () => (geo.body.dispose(), geo.cabin.dispose()), [geo]);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), p: new THREE.Vector3(), s: new THREE.Vector3(), y: new THREE.Vector3(0, 1, 0), c: new THREE.Vector3() }), []);

  // colours: set once per fleet (instanceColor)
  useEffect(() => {
    for (const mesh of [body.current, cabin.current]) {
      if (!mesh) continue;
      cars.forEach((v, i) => mesh.setColorAt(i, mesh === cabin.current ? COLOURS[0] : COLOURS[Math.floor(v.tint * COLOURS.length) % COLOURS.length]));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [cars]);

  useFrame(({ clock }) => {
    if (!body.current || !cabin.current || !cars.length) return;
    const k = carScale(fleet.size);
    tmp.s.set(k, k, k);
    cars.forEach((v, i) => {
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
        <meshStandardMaterial roughness={0.3} metalness={0.2} color="#2a3440" />
      </instancedMesh>
    </group>
  );
}
