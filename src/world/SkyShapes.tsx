import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { DataShape, Label, type DataKind } from './DataShapes';
import type { Vec3 } from './shots';

export type Face = 'tables' | 'json' | 'graph' | 'vectors';


/** where each shape floats around the database (overview), and the data kind it shows */
const SLOTS: Record<Face, { at: Vec3; kind: DataKind }> = {
  tables: { at: [-5.6, 0.9, 0], kind: 'table' },
  json: { at: [-2.8, 3.6, -0.4], kind: 'json' },
  graph: { at: [2.8, 3.6, -0.4], kind: 'graph' },
  vectors: { at: [5.6, 0.9, 0], kind: 'vectors' },
};
const FACES = Object.keys(SLOTS) as Face[];
/** where the lit shape comes to, in front of the database */
const FRONT: Vec3 = [0, 2.6, 2.4];

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};

/**
 * One Oracle AI Database in the sky with its four shapes around it, each a real 3D object filled with
 * the lab's data (DataShapes.tsx), each wired to the same red stack. `face` brings one forward and plays
 * it (0.5a to 0.5d); none = the overview (0.5). All local units around `center`.
 */
export function SkyShapes({ center, face, t, red }: { center: Vec3; face: Face | null; t: number; red: string }) {
  return (
    <group position={center} name="sky-shapes">
      <Stack red={red} t={face ? 9999 : t} />
      {FACES.map((f, i) => (
        <Slot key={f} f={f} i={i} face={face} t={t} />
      ))}
      <Label text="Oracle AI Database" position={[0, -1.75, 0.6]} size={0.26} color={red} weight={700} plate />
    </group>
  );
}

function Slot({ f, i, face, t }: { f: Face; i: number; face: Face | null; t: number }) {
  const g = useRef<THREE.Group>(null);
  const cur = useRef({ p: SLOTS[f].at as Vec3, s: 0.001 });
  useFrame((_, dt) => {
    const lit = face === f;
    const appear = face ? 1 : ease((t - 900 - i * 250) / 600);
    const goal: Vec3 = lit ? FRONT : SLOTS[f].at;
    const goalS = (lit ? 2.6 : face ? 0.7 : 1.15) * appear;
    const k = Math.min(1, dt * 3.5);
    cur.current.p = [cur.current.p[0] + (goal[0] - cur.current.p[0]) * k, cur.current.p[1] + (goal[1] - cur.current.p[1]) * k, cur.current.p[2] + (goal[2] - cur.current.p[2]) * k];
    cur.current.s += (goalS - cur.current.s) * k;
    if (g.current) {
      g.current.position.set(...cur.current.p);
      g.current.scale.setScalar(Math.max(0.001, cur.current.s));
    }
  });
  const lit = face === f;
  return (
    <group>
      <Line points={[[0, 0.3, 0], SLOTS[f].at]} color={lit ? '#2bb3c8' : '#1B8A9C'} lineWidth={lit ? 2.5 : 1.5} transparent opacity={face && !lit ? 0.25 : 0.7} />
      <group ref={g}>
        <DataShape kind={SLOTS[f].kind} lit={lit} />
      </group>
    </group>
  );
}

/** the red stack: three discs rising one after another */
export function Stack({ red, t }: { red: string; t: number }) {
  return (
    <group position={[0, -1.1, 0]}>
      {[0, 1, 2].map((i) => {
        const k = ease((t - i * 180) / 700);
        return (
          <mesh key={i} position={[0, i * 0.5 - (1 - k) * 0.6, 0]} scale={[1, Math.max(0.001, k), 1]} castShadow>
            <cylinderGeometry args={[1.15, 1.15, 0.4, 48]} />
            <meshStandardMaterial color={red} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}
