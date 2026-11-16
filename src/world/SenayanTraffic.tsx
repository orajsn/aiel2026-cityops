import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import DATA from './senayanData';
import { bridgeDeckHeight } from './bridgeFrame';
import type { Point, SenayanRoad } from './senayanTypes';

export interface SenayanTrafficPath extends SenayanRoad {
  cumulative: number[];
  length: number;
}

interface Vehicle {
  path: SenayanTrafficPath;
  phase: number;
  reverse: boolean;
  speed: number;
}

const last = <T,>(values: T[]): T => values[values.length - 1];
const near = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.002;
const DRIVEABLE = new Set(['primary', 'secondary', 'tertiary', 'residential', 'service', 'unclassified']);

/** Join matching mapped road segments without changing their geographic alignment. */
export function buildSenayanTrafficPaths(roads: SenayanRoad[]): SenayanTrafficPath[] {
  const paths: SenayanTrafficPath[] = [];
  const groups = new Map<string, SenayanRoad[]>();
  for (const road of roads) {
    if (!DRIVEABLE.has(road.kind) || road.layer < 0 || road.line.length < 2) continue;
    if (road.line.some(([x, z]) => x < -160 || x > 110 || z < -220 || z > 30)) continue;
    const key = `${road.name}|${road.oneway}|${road.kind}`;
    const group = groups.get(key) ?? [];
    group.push({ ...road, line: road.line.slice() });
    groups.set(key, group);
  }

  for (const group of groups.values()) {
    while (group.length) {
      const road = group.shift()!;
      let changed = true;
      while (changed) {
        changed = false;
        for (let i = 0; i < group.length; i++) {
          const other = group[i];
          if (near(last(road.line), other.line[0])) road.line.push(...other.line.slice(1));
          else if (!road.oneway && near(last(road.line), last(other.line))) road.line.push(...other.line.slice(0, -1).reverse());
          else if (near(road.line[0], last(other.line))) road.line.unshift(...other.line.slice(0, -1));
          else continue;
          group.splice(i, 1);
          changed = true;
          break;
        }
      }
      const cumulative = [0];
      for (let i = 1; i < road.line.length; i++) {
        cumulative.push(last(cumulative) + Math.hypot(road.line[i][0] - road.line[i - 1][0], road.line[i][1] - road.line[i - 1][1]));
      }
      const length = last(cumulative);
      if (length > 1.5) paths.push({ ...road, cumulative, length });
    }
  }
  return paths.sort((a, b) => b.length - a.length);
}

export function sampleSenayanTrafficPath(path: SenayanTrafficPath, distance: number): { x: number; z: number } {
  let i = 1;
  while (i < path.cumulative.length - 1 && distance > path.cumulative[i]) i++;
  const a = path.line[i - 1];
  const b = path.line[i];
  const k = Math.max(0, Math.min(1, (distance - path.cumulative[i - 1]) / (path.cumulative[i] - path.cumulative[i - 1] || 1)));
  return { x: a[0] + (b[0] - a[0]) * k, z: a[1] + (b[1] - a[1]) * k };
}

const fleet: Vehicle[] = [];
for (const path of buildSenayanTrafficPaths(DATA.roads).slice(0, 90)) {
  const count = Math.min(5, Math.max(1, Math.floor(path.length / 18)));
  for (let i = 0; i < count; i++) {
    fleet.push({ path, phase: (i + 0.37) / (count + 0.3), reverse: !path.oneway && i % 2 === 1, speed: 0.65 + (i % 3) * 0.12 });
  }
}

/** The accepted Senayan animation: three instanced meshes, mapped roads, no canal boats. */
export function SenayanTraffic() {
  const body = useRef<THREE.InstancedMesh>(null);
  const cabin = useRef<THREE.InstancedMesh>(null);
  const wheels = useRef<THREE.InstancedMesh>(null);
  const tmp = useMemo(() => ({
    object: new THREE.Object3D(),
    rotation: new THREE.Quaternion(),
    up: new THREE.Vector3(0, 1, 0),
    rotations: fleet.map(() => new THREE.Quaternion()),
    booted: false,
  }), []);

  useEffect(() => {
    const colors = ['#d4d6ce', '#606a6c', '#a84538', '#698493', '#e6dfc9'];
    fleet.forEach((_, i) => body.current?.setColorAt(i, new THREE.Color(colors[i % colors.length])));
    if (body.current?.instanceColor) body.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(({ clock }, dt) => {
    fleet.forEach((vehicle, i) => {
      const phase = (vehicle.phase + clock.elapsedTime * vehicle.speed / vehicle.path.length) % 1;
      const distance = (vehicle.reverse ? 1 - phase : phase) * vehicle.path.length;
      const point = sampleSenayanTrafficPath(vehicle.path, distance);
      const ahead = sampleSenayanTrafficPath(vehicle.path, Math.max(0, Math.min(vehicle.path.length, distance + (vehicle.reverse ? -0.30 : 0.30))));
      const yaw = Math.atan2(ahead.x - point.x, ahead.z - point.z);
      tmp.rotation.setFromAxisAngle(tmp.up, yaw);
      if (!tmp.booted) tmp.rotations[i].copy(tmp.rotation);
      else tmp.rotations[i].slerp(tmp.rotation, 1 - Math.exp(-dt * 8));

      const lane = vehicle.path.oneway ? 0 : Math.min(0.10, vehicle.path.width * 0.2);
      const x = point.x + Math.cos(yaw) * lane;
      const z = point.z - Math.sin(yaw) * lane;
      const y = bridgeDeckHeight(x, z) ?? 0.04;

      tmp.object.position.set(x, y + 0.055, z);
      tmp.object.quaternion.copy(tmp.rotations[i]);
      tmp.object.scale.set(0.17, 0.10, 0.40);
      tmp.object.updateMatrix();
      body.current?.setMatrixAt(i, tmp.object.matrix);
      tmp.object.position.y = y + 0.135;
      tmp.object.scale.set(0.145, 0.07, 0.21);
      tmp.object.updateMatrix();
      cabin.current?.setMatrixAt(i, tmp.object.matrix);
      tmp.object.position.y = y + 0.024;
      tmp.object.scale.set(0.19, 0.048, 0.30);
      tmp.object.updateMatrix();
      wheels.current?.setMatrixAt(i, tmp.object.matrix);
    });
    tmp.booted = true;
    for (const ref of [body, cabin, wheels]) if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group name="SenayanTraffic">
      <instancedMesh ref={body} args={[undefined, undefined, fleet.length]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#ffffff" roughness={0.48} metalness={0.14} />
      </instancedMesh>
      <instancedMesh ref={cabin} args={[undefined, undefined, fleet.length]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#263a42" roughness={0.48} metalness={0.14} />
      </instancedMesh>
      <instancedMesh ref={wheels} args={[undefined, undefined, fleet.length]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#282d2c" roughness={0.48} metalness={0.14} />
      </instancedMesh>
    </group>
  );
}
