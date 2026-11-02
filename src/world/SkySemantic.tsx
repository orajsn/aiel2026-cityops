import type * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { FlowArc } from './FlowArc';
import { CLOUD, DB, OPS_TOP } from './skyPlaces';
import type { Vec3 } from './shots';

/**
 * 1.3s · the semantic store on the sky stage (owner, 2 Nov). The Oracle database stands where it does on the vector page;
 * above it three governed views stand as small tables (supplier, delivery, project). The question comes up from the Ops
 * Center, the SQL check frames the rows of this one project (the others dim: they cannot be reached), and the rows come
 * back down to the Ops Center. Nothing here is text: the words are in the page's panel.
 */
type Quat = THREE.Quaternion;
const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

const mix = (k: number) => {
  const a = [0xaa, 0xb4, 0xbd];
  const b = [0x1b, 0x8a, 0x9c];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
};
const COLS = 3;
const ROWS = 5;
const W = 2.7;
const H = 1.05;
/** the rows that belong to this project, the same in every table */
const MINE = [1, 3];
/** click 1 raises the tables; clicks 2 to 4 (the question, the SQL check, the rows back) are the stage prop */
export const SEMANTIC_MS = { tables: 300 };

const TABLES: { y: number; mine: number }[] = [
  { y: 2.45, mine: 0 },
  { y: 1.25, mine: 1 },
  { y: 0.05, mine: 2 },
];

function Table({ y, t, index, facing, stage }: { y: number; t: number; index: number; facing: Quat; stage: number }) {
  const k = stage > 1 ? 1 : ease((t - SEMANTIC_MS.tables - index * 260) / 700);
  const checked = stage > 3 ? 1 : stage === 3 ? ease((t - 300) / 600) : 0;
  const cw = (W - 0.2) / COLS;
  const rh = (H - 0.28) / ROWS;
  return (
    <group position={[CLOUD[0], CLOUD[1] + y - 2.2, CLOUD[2]]} quaternion={facing} scale={[Math.max(0.001, k), Math.max(0.001, k), 1]}>
      <mesh>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial color="#f7f5f1" transparent opacity={0.94} toneMapped={false} />
      </mesh>
      <mesh position={[0, H / 2 - 0.1, 0.01]}>
        <planeGeometry args={[W - 0.12, 0.14]} />
        <meshBasicMaterial color="#1B8A9C" toneMapped={false} />
      </mesh>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const mine = MINE.includes(r);
          // before the check every row reads the same; after it, this project's rows turn teal and the rest dim
          const lit = mine ? checked : 0;
          const color = mix(lit);
          return (
            <mesh key={`${r}-${c}`} position={[-W / 2 + 0.1 + cw * (c + 0.5), H / 2 - 0.26 - rh * (r + 0.5), 0.01]}>
              <planeGeometry args={[cw - 0.08, rh - 0.05]} />
              <meshBasicMaterial color={color} transparent opacity={mine ? 1 : 1 - 0.55 * checked} toneMapped={false} />
            </mesh>
          );
        }),
      )}
    </group>
  );
}

export function SkySemantic({ t, stage, visible }: { t: number; stage: number; visible: boolean }) {
  const facing = useThree((s) => s.camera).quaternion;
  const top: Vec3 = [DB[0], DB[1] + 1.0, DB[2]];
  const mid: Vec3 = [CLOUD[0], CLOUD[1] + TABLES[1].y - 2.2, CLOUD[2]];
  // the SQL check: a teal frame round this project's rows of the middle table
  const frameY = mid[1] + H / 2 - 0.26 - ((H - 0.28) / ROWS) * 2;
  const fw = W / 2 + 0.08;
  const fh = ((H - 0.28) / ROWS) * 2.5;
  const show = stage > 3 ? 1 : stage === 3 ? ease((t - 300) / 500) : 0;
  return (
    <>
      {TABLES.map((tb, i) => (
        <Table key={i} y={tb.y} t={t} index={i} facing={facing} stage={stage} />
      ))}
      {show > 0.01 && (
        <group position={[mid[0], frameY, mid[2] + 0.02]} quaternion={facing} scale={[show, show, 1]}>
          <Line points={[[-fw, fh, 0], [fw, fh, 0], [fw, -fh, 0], [-fw, -fh, 0], [-fw, fh, 0]]} color="#1B8A9C" lineWidth={3} />
        </group>
      )}
      {/* click 2: the question comes up from the Ops Center to the database and on to the tables */}
      {visible && stage === 2 && <FlowArc key="semantic-q" from={OPS_TOP} to={top} lift={1.4} radius={0.05} durationMs={1300} delayMs={300} fadeMs={800} color="#ffffff" />}
      {visible && stage === 2 && <FlowArc key="semantic-up" from={top} to={mid} lift={0.3} radius={0.04} durationMs={900} delayMs={1600} persist color="#1B8A9C" />}
      {/* click 4: the rows come back down to the Ops Center */}
      {visible && stage === 4 && <FlowArc key="semantic-back" from={mid} to={OPS_TOP} lift={1.6} radius={0.05} durationMs={1500} delayMs={300} persist color="#1B8A9C" />}
    </>
  );
}
