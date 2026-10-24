import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Line } from '@react-three/drei';
import { DataShape, Label, type DataKind } from './DataShapes';
import { SILOS } from './BridgeQuestion';
import { screenPoint } from './frame';
import { SHOTS } from './shots';
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
const FRONT: Vec3 = [0, 1.9, 3.8];

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
  // where each piece was on 0.4 (its separate place beside the bridge), in this group's own units
  const from = (f: Face): Vec3 => {
    const kind = SLOTS[f].kind;
    const s = SILOS.find((x) => x.kind === kind)!;
    const cam = SHOTS.pier3.push ?? SHOTS.pier3;
    const w = screenPoint(cam.position, cam.target, (s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2, 0.34);
    return [w[0] - center[0], w[1] - center[1], w[2] - center[2]];
  };
  return (
    <group position={center} name="sky-shapes">
      <Stack red={red} t={face ? 9999 : t} />
      {FACES.map((f, i) => (
        <Slot key={f} f={f} i={i} face={face} t={t} from={from(f)} />
      ))}
      {!face && <Label text="Oracle AI Database" position={[0, -1.75, 0.6]} size={0.26} color={red} weight={700} plate />}
    </group>
  );
}

function Slot({ f, i, face, t, from }: { f: Face; i: number; face: Face | null; t: number; from: Vec3 }) {
  const g = useRef<THREE.Group>(null);
  const cur = useRef({ p: from, s: 0.03 });
  // 0.5 opens with the pieces flying up from their separate places by the bridge and docking here
  const docking = useRef(face === null);
  useFrame((_, dt) => {
    const lit = face === f;
    if (docking.current && face === null) {
      // starts once the camera has risen to the stage (~5 s from the pier), so the docking is seen
      const k = ease((t - 5200 - i * 450) / 2200);
      const to = SLOTS[f].at;
      const arc = Math.sin(Math.PI * k) * 3;
      cur.current.p = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k + arc, from[2] + (to[2] - from[2]) * k];
      cur.current.s = 0.03 + (1.15 - 0.03) * k;
      if (g.current) {
        g.current.position.set(...cur.current.p);
        g.current.scale.setScalar(cur.current.s);
      }
      if (k >= 1) docking.current = false;
      return;
    }
    docking.current = false;
    const appear = 1;
    const goal: Vec3 = lit ? FRONT : SLOTS[f].at;
    // on a shape's own page the other three step away entirely: one thing to read
    const goalS = (lit ? 2.6 : face ? 0 : 1.15) * appear;
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
      {!face && t > 7400 + i * 450 && <Line points={[[0, 0.3, 0], SLOTS[f].at]} color="#1B8A9C" lineWidth={1.5} transparent opacity={0.7} />}
      <group ref={g}>
        {/* the shape in focus gets a solid backing so the city photo does not show through its words */}
        {lit && (
          <Billboard position={[0, -0.15, -0.9]}>
            <mesh renderOrder={1}>
              <planeGeometry args={[3.4, 3.1]} />
              <meshBasicMaterial color="#f7f5f1" transparent opacity={0.97} depthWrite={false} toneMapped={false} />
            </mesh>
          </Billboard>
        )}
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
