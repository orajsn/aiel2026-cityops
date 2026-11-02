import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { Billboard, Html, Line } from '@react-three/drei';
import { OPS_TOP } from './skyPlaces';
import { layoutCloud, nearestK } from './vectorLayout';
import { NeuralNet } from './NeuralNet';
import { ReferenceFolder } from './ReferenceFolder';
import { PDFS, vectorNumbers } from './SkyVectorize';
import { STAGE4, type Vec3 } from './shots';

/**
 * Lab 1's 4a (Vector Store) and 4b (Semantic Store) on the sky stage, built from the two approved drafts (owner, 2 Nov).
 * Everything stands in one fixed frame in the sky over the Ops Center (shots.ts STAGE4: 16 x 9 units of 1.2 m), and each click
 * has its own camera (shots 'sky-v1' to 'sky-s4'), so the camera moves through the steps. Inside the frame the pieces are real 3D (the
 * database, the PDF books, the cloud of points, the language model); the cards are HTML on 3D anchors that grow and shrink with
 * the camera's distance. The page's panel covers x from 2.3 up, so everything keeps left of x = 2. `t` is ms since the camera arrived.
 */
/** the camera distance at which one unit is 120 px: the HTML cards are sized for it (drei's distanceFactor) */
const CARD_SCALE = 0.8284 * 13;
const ease = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
const lerp = (a: Vec3, b: Vec3, k: number): Vec3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
/** 1 while t is inside [from, to], easing in and out over `fade` ms */
const win = (t: number, from: number, to: number, fade = 350) => Math.min(ease((t - from) / fade), 1 - ease((t - to) / fade));

function StageFrame({ children }: { children: ReactNode }) {
  return (
    <group position={STAGE4.center} rotation={[0, (-STAGE4.heading * Math.PI) / 180, 0]} scale={STAGE4.unit}>
      {children}
    </group>
  );
}

/** a world point as a stage-frame position (the frame is turned to the camera's heading and scaled; see StageFrame) */
const toFrame = (w: Vec3): Vec3 => {
  const v = [(w[0] - STAGE4.center[0]) / STAGE4.unit, (w[1] - STAGE4.center[1]) / STAGE4.unit, (w[2] - STAGE4.center[2]) / STAGE4.unit];
  const f = (STAGE4.heading * Math.PI) / 180;
  return [v[0] * Math.cos(f) + v[2] * Math.sin(f), v[1], -v[0] * Math.sin(f) + v[2] * Math.cos(f)];
};

/** a calm board behind the cards, always square to the screen, so the busy city does not fight the words (drawn first) */
function Backdrop({ show = 1 }: { show?: number }) {
  return (
    <Billboard position={[-2.95, 0.15, -1.5]}>
      <mesh renderOrder={-10}>
        <planeGeometry args={[10.3, 8.7]} />
        <meshBasicMaterial color="#eef3f7" transparent opacity={0.84 * show} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}

const cardStyle = { pointerEvents: 'none' as const, whiteSpace: 'nowrap' as const, fontFamily: 'var(--font-body, Inter, sans-serif)' };
const Card = ({ at, children, show = 1, z = 0 }: { at: Vec3 | [number, number]; children: ReactNode; show?: number; z?: number }) =>
  show > 0.01 ? (
    <Html position={[at[0], at[1], z]} center distanceFactor={CARD_SCALE} zIndexRange={[16, 0]} style={{ ...cardStyle, opacity: show }}>
      {children}
    </Html>
  ) : null;

/** a dashed line with an arrow head, drawn from the first point to the last as `k` goes 0 to 1 */
function Arrow({ pts, color = '#1B8A9C', k = 1, dashed = true }: { pts: Vec3[]; color?: string; k?: number; dashed?: boolean }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), [pts]);
  const upTo = Math.max(0.001, Math.min(1, k));
  const line = useMemo(() => curve.getPoints(40).map((v) => [v.x, v.y, v.z] as Vec3), [curve]);
  const shown = line.slice(0, Math.max(2, Math.round(line.length * upTo)));
  const tip = shown[shown.length - 1];
  const prev = shown[shown.length - 2] ?? tip;
  const dir = new THREE.Vector3(tip[0] - prev[0], tip[1] - prev[1], 0).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.lengthSq() ? dir : new THREE.Vector3(0, 1, 0));
  if (k <= 0.01) return null;
  return (
    <>
      <Line points={shown} color={color} lineWidth={3.2} dashed={dashed} dashSize={0.16} gapSize={0.12} transparent opacity={0.95} />
      {upTo > 0.97 && (
        <mesh position={tip} quaternion={q}>
          <coneGeometry args={[0.1, 0.24, 14]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      )}
    </>
  );
}

/** the Oracle database: three red discs, tilted so the tops show */
function DB3D({ at, s = 0.8, pulse = 0 }: { at: [number, number]; s?: number; pulse?: number }) {
  return (
    <group position={[at[0], at[1], 0]} scale={s * (1 + 0.06 * pulse)}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.5 - 0.5, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.38, 44]} />
          <meshStandardMaterial color="#c74634" emissive="#5a1d14" emissiveIntensity={0.55 + 0.8 * pulse} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
const DBLabel = ({ at, s = 0.8 }: { at: [number, number]; s?: number }) => (
  <Card at={[at[0], at[1] - 1.45 * s]}>
    <div style={{ fontSize: 22, fontWeight: 700, color: '#1d2733', background: 'rgba(255,255,255,0.9)', padding: '2px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>Oracle AI Database</div>
  </Card>
);

/** a PDF as a small 3D book: cover, a block of pages, a spine */
function Book3D({ at, s = 1, rot = 0.12, lay = 0 }: { at: Vec3; s?: number; rot?: number; lay?: number }) {
  return (
    <group position={at} scale={s} rotation={[0.05 + lay * 0.9, rot, 0]}>
      <mesh position={[0, 0, -0.09]}>
        <boxGeometry args={[0.9, 1.2, 0.05]} />
        <meshStandardMaterial color="#1b8a9c" roughness={0.5} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.84, 1.14, 0.14]} />
        <meshStandardMaterial color="#f4f6f8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.9, 1.2, 0.05]} />
        <meshStandardMaterial color="#1b8a9c" roughness={0.5} />
      </mesh>
      <mesh position={[-0.44, 0, 0]}>
        <boxGeometry args={[0.08, 1.2, 0.26]} />
        <meshStandardMaterial color="#146f7f" roughness={0.5} />
      </mesh>
      {[0.36, 0.2, 0.04, -0.12, -0.28].map((y, i) => (
        <mesh key={i} position={[0.02, y, 0.131]}>
          <boxGeometry args={[0.5 - (i % 3) * 0.08, 0.05, 0.01]} />
          <meshBasicMaterial color={i === 0 ? '#1f2a33' : '#9fb0bb'} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ the vector space */

const CL: [number, number, number, number][] = [
  [-13, 7, -8, 8],
  [14, -3, 7, 9],
  [-1, -11, 15, 7],
];
const GROUP_NAMES = ['surface preparation', 'steel · materials', 'inspection · acceptance'];
export const QUERY_STEEL: Vec3 = [12.5, -2, 5];
const CS = 1.5 / 30;
const CLOUD_AT: Vec3 = [-0.6, 0.5, 0];
const EULER = new THREE.Euler(0.12, 0.35, 0);
/** a point of the cloud (cloud space) as a stage position */
const place = (p: Vec3): Vec3 => {
  const v = new THREE.Vector3(p[0] * CS, p[1] * CS, p[2] * CS).applyEuler(EULER);
  return [CLOUD_AT[0] + v.x, CLOUD_AT[1] + v.y, CLOUD_AT[2] + v.z];
};

function Cloud3D({ show, groups, ask, pick, flyTo, fly }: { show: number; groups: number; ask: number; pick: number; flyTo: Vec3; fly: number }) {
  const pts = useMemo(() => layoutCloud(600, 7), []);
  const near = useMemo(() => nearestK(pts, QUERY_STEEL, 5), [pts]);
  const member = useMemo(
    () =>
      pts.map((p) => {
        let best = -1;
        let bd = 1e9;
        CL.forEach((c, i) => {
          const d = Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]);
          if (d < c[3] * 1.15 && d < bd) {
            bd = d;
            best = i;
          }
        });
        return best;
      }),
    [pts],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    pts.forEach((p, i) => {
      const isNear = ask > 0.5 && near.includes(i);
      const at = place(p);
      // the five nearest fly out to the book (click 4)
      const pos = isNear && fly > 0 ? lerp(at, flyTo, ease(fly)) : at;
      dummy.position.set(...pos);
      dummy.scale.setScalar(isNear ? (pick > 0 ? 2.4 + Math.sin(pick * 6) * 0.2 : 1.8) : 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      const c = member[i];
      col.set(isNear ? '#c74634' : c === 1 ? '#1b8a9c' : c >= 0 ? '#7c8f9b' : '#a9b6c0');
      m.setColorAt(i, col);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [pts, near, member, ask, pick, fly, flyTo, dummy, col]);
  const q = place(QUERY_STEEL);
  return (
    <group scale={show}>
      <instancedMesh ref={mesh} args={[undefined, undefined, pts.length]} frustumCulled={false}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {groups > 0.01 &&
        CL.map((c, i) => {
          const at = place([c[0], c[1], c[2]]);
          const hot = i === 1;
          return (
            <group key={i}>
              <mesh position={at}>
                <sphereGeometry args={[c[3] * CS * 1.12, 28, 20]} />
                <meshBasicMaterial color={hot ? '#1b8a9c' : '#8a97a3'} transparent opacity={groups * (hot && ask > 0.5 ? 0.22 : 0.1)} depthWrite={false} toneMapped={false} />
              </mesh>
              <Card at={[at[0], at[1] + c[3] * CS * 1.12 + 0.2]} show={groups}>
                <div style={{ fontSize: 20, fontWeight: 700, color: hot ? '#146f7f' : '#4a5966', background: 'rgba(255,255,255,0.94)', padding: '3px 12px', borderRadius: 8, whiteSpace: 'nowrap', border: hot ? '2px solid #1b8a9c' : '1px solid #b9c4cc' }}>{GROUP_NAMES[i]}</div>
              </Card>
            </group>
          );
        })}
      {ask > 0.01 && (
        <group position={q}>
          <mesh scale={ask}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <meshBasicMaterial color="#c74634" toneMapped={false} />
          </mesh>
          <mesh scale={ask}>
            <ringGeometry args={[0.24, 0.29, 36]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <Card at={[0, -0.55]} show={ask}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#c74634', background: 'rgba(255,255,255,0.95)', padding: '2px 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>the question</div>
          </Card>
        </group>
      )}
      {ask > 0.5 && fly <= 0 &&
        near.map((i) => <Line key={i} points={[q, place(pts[i])]} color="#c74634" lineWidth={2.2} transparent opacity={0.85} />)}
    </group>
  );
}

/** a row of numbers scrolling past, with its "384 numbers" tag: a text turned into its vector */
function NumRow({ t, seed, tone, width }: { t: number; seed: number; tone: 'teal' | 'red'; width: number }) {
  const col = tone === 'red' ? '#C74634' : '#146f7f';
  const shift = -((t * 0.09) % 1400);
  return (
    <div style={{ width, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#fff', borderRadius: 12, border: `2px solid ${col}`, boxShadow: '0 6px 16px rgba(20,40,60,0.25)' }}>
      <div style={{ flex: 1, overflow: 'hidden', fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', fontSize: 24, fontWeight: 600, color: '#1d2733', maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 90%, transparent)' }}>
        <span style={{ display: 'inline-block', transform: `translateX(${shift}px)` }}>( {vectorNumbers(seed)}, … )</span>
      </div>
      <span style={{ flex: 'none', fontSize: 20, fontWeight: 700, color: col, background: tone === 'red' ? 'rgba(199,70,52,0.1)' : 'rgba(27,138,156,0.12)', padding: '3px 10px', borderRadius: 999 }}>384 numbers</span>
    </div>
  );
}
/** where each PDF stands: the same three places in click 1 (they arrive) and click 2 (each becomes a row of numbers beside it) */
const SLOT = (i: number): Vec3 => [-6.6, 3.0 - i * 1.25, 0];

const BOOK_AT: Vec3 = [-6.0, 1.0, 0];
const NET_AT: Vec3 = [-3.2, 1.2, 0];
/** 4a keeps the database higher (nothing stands over it); 4b has the Project view above, so it sits lower */
const DB_AT: [number, number] = [-5.0, -2.2];
const DB_SEM: [number, number] = [-5.0, -3.6];

export function Vector4({ act, t }: { act: 'vector' | 'vector2' | 'vector3' | 'retrieve'; t: number }) {
  let cloudShow = 1;
  let groups = 1;
  let ask = 0;
  let pick = 0;
  let fly = 0;
  if (act === 'vector') {
    cloudShow = 0;
    groups = 0;
  } else if (act === 'vector2') {
    cloudShow = ease((t - 2600) / 900);
    groups = ease((t - 4200) / 600);
  } else if (act === 'vector3') {
    ask = ease((t - 2700) / 500);
  } else {
    ask = 1;
    pick = t < 1500 ? Math.min(1, t / 400) : 0;
    fly = ease((t - 1500) / 1400);
  }
  return (
    <StageFrame>
      <DB3D at={DB_AT} pulse={act === 'vector' ? Math.sin(Math.PI * Math.max(0, Math.min(1, (t - 7500) / 900))) : 0} />
      <DBLabel at={DB_AT} />
      {/* click 1: three PDFs arrive one after another and stay; then an arrow takes them into the database, which glows once */}
      {act === 'vector' &&
        PDFS.map((name, i) => {
          const start = 600 + i * 2200;
          const k = ease((t - start) / 1800);
          const appear = ease((t - start + 400) / 700);
          if (appear <= 0.01) return null;
          const from: Vec3 = [-6.6, 4.4, 0];
          const slot = SLOT(i);
          const pos: Vec3 = [slot[0] + (1 - k) * 0.3, from[1] + (slot[1] - from[1]) * k, 0];
          return (
            <group key={name}>
              <group scale={appear}>
                <Book3D at={pos} s={0.8} lay={0} />
              </group>
              <Card at={[-4.9, slot[1]]} show={ease((t - start - 1500) / 600)}>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#1d2733', background: 'rgba(255,255,255,0.94)', padding: '3px 12px', borderRadius: 8, textAlign: 'left' }}>{name}</div>
              </Card>
            </group>
          );
        })}
      {act === 'vector' && <Arrow k={ease((t - 6900) / 800)} pts={[[-6.0, -0.3, 0], [-5.6, -0.8, 0], [DB_AT[0] - 0.3, DB_AT[1] + 1.1, 0]]} />}
      {/* click 2: each PDF stays where it stood, and a long row of numbers comes out beside it; then the points appear */}
      {act === 'vector2' &&
        PDFS.map((name, i) => {
          const s = SLOT(i);
          const rowShow = win(t, 500 + i * 900, 4000);
          return (
            <group key={name}>
              <Book3D at={s} s={0.8} lay={0} />
              <Arrow k={ease((t - 500 - i * 900) / 500)} pts={[[s[0] + 0.55, s[1], 0], [s[0] + 0.8, s[1], 0]]} />
              <Card at={[-3.9, s[1]]} show={rowShow}>
                <NumRow t={t} seed={i + 3} tone="teal" width={420} />
              </Card>
              <Arrow k={win(t, 1800 + i * 300, 3400)} pts={[[-2.1, s[1], 0], [-1.8, 2.4 - i * 0.9, 0], place(CL[i][0] === -13 ? [-13, 7, -8] : i === 1 ? [14, -3, 7] : [-1, -11, 15])]} />
            </group>
          );
        })}
      {/* click 3: the question turns into numbers the same way: the question, an arrow, its row of numbers */}
      {act === 'vector3' && (
        <>
          <Card at={[-5.3, 3.4]} show={win(t, 200, 3200)}>
            <div style={{ width: 340, padding: '12px 18px', background: '#fff', border: '3px solid #c74634', borderRadius: 12, fontSize: 26, fontWeight: 600, color: '#1d2733', boxShadow: '0 6px 16px rgba(20,40,60,0.25)', whiteSpace: 'normal', lineHeight: 1.25 }}>“Which supplier is ready?”</div>
          </Card>
          <Arrow color="#c74634" dashed={false} k={win(t, 800, 3200)} pts={[[-3.8, 3.4, 0], [-3.55, 3.4, 0]]} />
          <Card at={[-1.8, 3.4]} show={win(t, 1000, 3200)}>
            <NumRow t={t} seed={11} tone="red" width={420} />
          </Card>
        </>
      )}
      {act === 'vector3' && <Arrow color="#c74634" dashed={false} k={win(t, 2000, 12000, 500)} pts={[[0.1, 3.3, 0], [0.5, 3.0, 0], place(QUERY_STEEL)]} />}
      {act === 'retrieve' && (
        <Card at={[-4.4, 3.4]} show={ease((t - 200) / 500)}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#c74634', background: 'rgba(255,255,255,0.94)', padding: '4px 14px', borderRadius: 8, whiteSpace: 'nowrap' }}>the five nearest points = the retrieved passages</div>
        </Card>
      )}
      <Cloud3D show={cloudShow} groups={groups} ask={ask} pick={pick} fly={act === 'retrieve' ? fly : 0} flyTo={BOOK_AT} />
      {/* click 4 (the Lab 2 envelope): the five nearest points fly into a folder with the question; the folder goes into the model */}
      {act === 'retrieve' && (
        <>
          {(() => {
            const arrive = ease((t - 1700) / 500);
            const go = ease((t - 3400) / 1100);
            const taken = 1 - ease((t - 4500) / 500);
            const folderAt: Vec3 = lerp(BOOK_AT, [NET_AT[0] - 1.7, NET_AT[1], 0], go);
            return (
              <>
                <group position={folderAt} scale={1.7 * arrive * taken}>
                  <ReferenceFolder sheets={[0, 1, 2, 3, 4].map((i) => t > 2000 + i * 220)} opacity={arrive * taken} />
                </group>
                <Card at={[BOOK_AT[0], BOOK_AT[1] + 1.35]} show={ease((t - 2900) / 500) * (1 - go)}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1d2733', background: 'rgba(255,255,255,0.95)', padding: '3px 12px', borderRadius: 8, boxShadow: '0 3px 10px rgba(20,40,60,.2)' }}>5 references + the question</div>
                </Card>
              </>
            );
          })()}
          <group position={NET_AT} scale={ease((t - 3000) / 700) * 0.95}>
            <NeuralNet producing={t > 3800} doubt={false} />
          </group>
          <Card at={[NET_AT[0], NET_AT[1] - 1.2]} show={ease((t - 3300) / 500)}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1d2733', background: 'rgba(255,255,255,0.92)', padding: '2px 10px', borderRadius: 6 }}>the language model</div>
          </Card>
          <Arrow k={ease((t - 4300) / 600)} pts={[[NET_AT[0], NET_AT[1] - 1.5, 0], [-3.4, 0.0, 0], [-4.0, -0.3, 0]]} />
          <Card at={[-4.2, -0.9]} show={ease((t - 4800) / 600)}>
            <div style={{ width: 600, padding: '14px 20px', background: '#fff', border: '3px solid #1b8a9c', borderRadius: 14, boxShadow: '0 6px 16px rgba(20,40,60,.25)' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1d2733' }}>the answer cites the specification</div>
              <div style={{ fontSize: 19, color: '#5c6b78', marginTop: 4 }}>written only from the five passages</div>
            </div>
          </Card>
        </>
      )}
    </StageFrame>
  );
}

/* ------------------------------------------------------------------ the semantic store */

const VIEWS: { raw: string; rawCols: string[]; name: string; cols: string[]; at: [number, number] }[] = [
  { raw: 'SUP_MST', rawCols: ['SUP_ID', 'SUP_NM_TH', 'RDY_FLG', 'FIT_SC', 'RSK_CD'], name: 'Supplier', cols: ['supplier', 'recommendation status', 'fit score', 'risk level'], at: [-5.3, 1.95] },
  { raw: 'DLV_TXN', rawCols: ['DLV_ID', 'SUP_ID', 'DLV_ST', 'EVT_CD', 'PRJ_ID'], name: 'Delivery', cols: ['delivery', 'status', 'event', 'supplier'], at: [-1.9, 1.95] },
  { raw: 'PRJ_REF', rawCols: ['PRJ_ID', 'PRJ_CD', 'OWN_ID', 'CRT_DT', 'ST_CD'], name: 'Project', cols: ['project code', 'name', 'owner', 'dates'], at: [-5.3, -1.05] },
];
/** a path between the real Ops Center pin (in the city) and a point in the frame */
const opsArrow = (x: number, y: number): Vec3[] => {
  const o = toFrame([OPS_TOP[0], OPS_TOP[1] + 0.6, OPS_TOP[2]]);
  return [[o[0], o[1], 0], [(o[0] + x) / 2, (o[1] + y) / 2 - 0.4, 0], [x, y, 0]];
};

function ViewCard({ v, show, hot, dim, rawShow }: { v: (typeof VIEWS)[number]; show: number; hot: number[]; dim: boolean; rawShow: number }) {
  return (
    <>
      <Card at={[v.at[0] - 0.14, v.at[1] + 0.14]} show={show * rawShow * (dim ? 0.4 : 1)} z={-0.2}>
        <div style={{ width: 380, height: 250, borderRadius: 10, background: '#d3dae0', border: '1px solid #aeb9c2', fontFamily: 'var(--font-mono, monospace)', color: '#7b8996', padding: '10px 14px' }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{v.raw}</div>
          {v.rawCols.map((c) => (
            <div key={c} style={{ fontSize: 15, marginTop: 4 }}>{c}</div>
          ))}
        </div>
      </Card>
      <Card at={v.at} show={show * (dim ? 0.38 : 1)} z={0.08}>
        <div style={{ width: 392, height: 250, background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 6px 14px rgba(20,40,60,.25)' }}>
          <div style={{ background: '#1b8a9c', color: '#fff', fontSize: 26, fontWeight: 700, padding: '8px 16px' }}>{v.name}</div>
          <div style={{ padding: '10px 14px', display: 'grid', gap: 7 }}>
            {v.cols.map((c, i) => (
              <div key={c} style={{ padding: '4px 10px', borderRadius: 7, fontSize: 20, fontWeight: hot.includes(i) ? 700 : 600, color: '#1d2733', background: hot.includes(i) ? 'rgba(27,138,156,.2)' : 'rgba(27,138,156,.07)', border: hot.includes(i) ? '2px solid #1b8a9c' : '2px solid transparent' }}>{c}</div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

const pillStyle = { fontSize: 20, fontWeight: 700, color: '#146f7f', background: 'rgba(255,255,255,0.95)', border: '2px solid #1b8a9c', padding: '6px 16px', borderRadius: 999, whiteSpace: 'nowrap' as const };

export function Semantic4({ act, t }: { act: 'semantic' | 'semantic2' | 'semantic3' | 'semantic4'; t: number }) {
  const stage = Number(act.slice(-1)) || 1;
  const rise = (i: number) => (stage > 1 ? 1 : ease((t - 300 - i * 300) / 700));
  const hot = (i: number) => (stage === 2 ? (i === 0 ? [0, 1] : i === 1 ? [1] : [0]) : stage === 3 ? (i === 0 ? [0, 1, 2, 3] : i === 2 ? [0] : []) : []);
  return (
    <StageFrame>
      <Backdrop show={ease(t / 800)} />
      <DB3D at={DB_SEM} />
      <DBLabel at={DB_SEM} />
      <Card at={[-3.9, 3.5]} show={ease((t - 200) / 500)}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#146f7f', background: 'rgba(255,255,255,0.92)', padding: '2px 12px', borderRadius: 8, whiteSpace: 'nowrap' }}>Governed views · business words over the raw tables</div>
      </Card>
      {VIEWS.map((v, i) => (
        <ViewCard key={v.name} v={v} show={rise(i)} hot={hot(i)} dim={stage === 4 && i === 2} rawShow={1} />
      ))}
      {stage === 1 && (
        <Card at={[-0.4, -0.1]} show={ease((t - 1800) / 600)}>
          <div style={{ width: 470, padding: '12px 18px', background: '#fff', borderRadius: 12, border: '1px solid #cfd8df', boxShadow: '0 6px 14px rgba(20,40,60,.2)' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1d2733' }}>Under the glass</div>
            <div style={{ fontSize: 18, color: '#5c6b78', marginTop: 4 }}>SUP_ID, RDY_FLG, FIT_SC: raw names nobody speaks</div>
          </div>
        </Card>
      )}
      {/* click 2: the question rises from the Ops Center; its words match the views */}
      {stage >= 2 && stage <= 3 && (
        <>
          <Arrow k={stage === 2 ? ease((t - 200) / 900) : 1} pts={opsArrow(-2.7, -1.6)} />
          <Card at={[-0.5, -1.6]} show={stage === 2 ? ease((t - 900) / 500) : 1}>
            <div style={{ width: 520, padding: '14px 22px', background: '#fff', border: '3px solid #1b8a9c', borderRadius: 14, fontSize: 28, fontWeight: 600, color: '#1d2733', boxShadow: '0 6px 14px rgba(20,40,60,.25)' }}>
              “Which <span style={{ color: '#146f7f', fontWeight: 700 }}>supplier</span> is <span style={{ color: '#146f7f', fontWeight: 700 }}>ready</span>?”
            </div>
          </Card>
        </>
      )}
      {stage === 2 && (
        <>
          <Arrow k={ease((t - 1500) / 800)} pts={[[-2.2, -1.1, 0], [-3.4, -0.4, 0], [-3.7, 0.9, 0]]} />
          <Arrow k={ease((t - 1800) / 800)} pts={[[-1.2, -1.1, 0], [-1.5, -0.2, 0], [-1.9, 0.8, 0]]} />
          <Card at={[-0.5, -2.6]} show={ease((t - 2400) / 500)}>
            <div style={{ fontSize: 19, color: '#33414d', background: 'rgba(255,255,255,0.92)', padding: '4px 12px', borderRadius: 8, lineHeight: 1.4 }}>“supplier” is the Supplier view<br />“ready” is Delivery · status</div>
          </Card>
        </>
      )}
      {/* click 3: the SQL it wrote, and the check that keeps it to this project */}
      {stage === 3 && (
        <>
          <Card at={[-0.5, 0.5]} show={ease((t - 300) / 600)}>
            <div style={{ width: 520, padding: '14px 20px', background: '#1f2a33', borderRadius: 12, fontFamily: 'var(--font-mono, monospace)', boxShadow: '0 6px 14px rgba(20,40,60,.3)' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#7fd3e0' }}>NL2SQL · the SQL it wrote</div>
              <div style={{ fontSize: 20, color: '#e6e9ef', marginTop: 8 }}>SELECT … FROM <span style={{ color: '#7fd3e0' }}>governed views</span></div>
              <div style={{ fontSize: 20, color: '#e6e9ef' }}>WHERE project = <span style={{ color: '#7fd3e0' }}>this project</span></div>
            </div>
          </Card>
          <Line points={[[-7.1, -2.3, 0.2], [-3.5, -2.3, 0.2], [-3.5, 0.2, 0.2], [-7.1, 0.2, 0.2], [-7.1, -2.3, 0.2]]} color="#1b8a9c" lineWidth={4} dashed dashSize={0.22} gapSize={0.14} transparent opacity={ease((t - 800) / 500)} />
          <Card at={[-0.5, -2.8]} show={ease((t - 1400) / 600)}>
            <div style={{ ...pillStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#1b8a9c', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
              SQL checked: other projects stay out
            </div>
          </Card>
          <Card at={[-0.5, -3.5]} show={ease((t - 2000) / 600)}>
            <div style={{ fontSize: 19, color: '#5c6b78', background: 'rgba(255,255,255,0.9)', padding: '3px 12px', borderRadius: 8 }}>🔒 other projects and suppliers: locked</div>
          </Card>
        </>
      )}
      {/* click 4: the rows come back down to the Ops Center */}
      {stage === 4 && (
        <>
          <Card at={[-0.5, 0.2]} show={ease((t - 300) / 600)}>
            <div style={{ width: 540, padding: '14px 22px', background: '#fff', border: '3px solid #1b8a9c', borderRadius: 14, boxShadow: '0 6px 14px rgba(20,40,60,.25)' }}>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.2, color: '#146f7f' }}>ROWS FOR THIS PROJECT</div>
              {['supplier', 'recommendation status', 'fit score', 'risk level', 'explanation'].map((f, i) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7 }}>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 18, fontWeight: 500, color: '#1d2733', width: 250 }}>{f}</span>
                  <span style={{ height: 12, borderRadius: 6, background: 'rgba(27,138,156,.4)', width: [200, 150, 90, 90, 200][i] }} />
                </div>
              ))}
            </div>
          </Card>
          <Arrow k={ease((t - 900) / 900)} pts={opsArrow(-1.4, -1.0).reverse()} />
          <Card at={[-0.3, -1.9]} show={ease((t - 1500) / 500)}>
            <div style={{ ...pillStyle, background: '#1b8a9c', color: '#fff' }}>governed data · this project only</div>
          </Card>
        </>
      )}
    </StageFrame>
  );
}
