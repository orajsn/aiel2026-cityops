import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Line } from '@react-three/drei';
import assetsJson from '../content/assets.json';
import connectionsJson from '../content/connections.json';
import type { Vec3 } from './shots';

/**
 * The four shapes of city data, as real 3D objects with no backing card, filled with the lab's own data:
 *  - table:   rows of CITY_ASSET floating in space (asset, type, district, criticality)
 *  - json:    Harbor Bridge's spec sheet, one floating key/value per line
 *  - graph:   the knowledge graph from ASSET_CONNECTIONS around Harbor Bridge, edges named (powers, monitors…)
 *  - vectors: a 3D vector space of report text; the question flies in and its nearest neighbours light up
 * Each shape fits in a box about 2 units wide, centred on its group; `lit` plays its animation.
 */
import type { DataKind } from './shapeBoxes';
export type { DataKind };

type Asset = { id: string; type: string; district: string; criticality: number; specs: Record<string, number | string> };
const ASSETS = assetsJson as unknown as Asset[];
const CONNECTIONS = connectionsJson as { from: string; to: string; type: string }[];
const HB = 'Harbor Bridge';

const TEAL = '#2bb3c8';
const DEEP = '#1B8A9C';
const RED = '#e2604c';
const INK = '#1f2a33';
const DIM = '#5d6b78';

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};

/** smallest and largest text on the 1920 x 1080 stage */
export const MIN_LABEL_PX = 20;
export const MAX_LABEL_PX = 48;
/** a label may grow up to this many times the space it was designed for to reach 20 px; any more and it hides */
const ROOM = 1.9;
const STAGE_H = 1080;

/**
 * How tall a label is: it fills the space its shape gives it (`designSize` x the shape's scale), held
 * between 20 and 48 px on the stage. If reaching 20 px needs much more than that space, it hides, so it
 * never piles onto its neighbours.
 */
export function labelLayout({ designSize, parentScale, distance, fovDeg }: { designSize: number; parentScale: number; distance: number; fovDeg: number }) {
  const worldPerPx = (2 * distance * Math.tan(((fovDeg / 2) * Math.PI) / 180)) / STAGE_H;
  const room = designSize * parentScale;
  const px = Math.min(MAX_LABEL_PX, Math.max(MIN_LABEL_PX, room / worldPerPx));
  const worldHeight = px * worldPerPx;
  return { worldHeight, visible: room > 0 && worldHeight <= room * ROOM };
}

/**
 * A short line of text: always faces the camera, sized to its shape but never below 20 px or above 48 px,
 * with a white outline so it reads on any background. Hidden while its shape is too small to give it
 * room, so it never piles onto its neighbours. `size` is the space the shape gives it, in its own units.
 */
/** `accent`: the words after the last " · " are drawn in this colour (the name stays in `color`) */
export function Label({ text, position, size = 0.16, color = INK, weight = 500, mono = false, plate = false, halo = false, accent }: { text: string; position: Vec3; size?: number; color?: string; weight?: number; mono?: boolean; plate?: boolean; halo?: boolean; accent?: string }) {
  const { tex, aspect } = useMemo(() => {
    const px = 64;
    const font = `${weight} ${px}px ${mono ? '"JetBrains Mono", monospace' : 'Inter, sans-serif'}`;
    const probe = document.createElement('canvas').getContext('2d')!;
    probe.font = font;
    const pad = plate ? 48 : 28;
    const w = Math.ceil(probe.measureText(text).width) + pad;
    const h = px + (plate ? 30 : 24);
    const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
    const g = c.getContext('2d')!;
    if (plate) {
      g.fillStyle = 'rgba(255,255,255,0.92)';
      g.beginPath();
      g.roundRect(0, 0, w, h, h / 2);
      g.fill();
    }
    g.font = font;
    g.textBaseline = 'middle';
    if (!plate && halo) {
      // a white halo keeps the words readable over the city photo or a busy shape
      g.lineJoin = 'round';
      g.lineWidth = 14;
      g.strokeStyle = 'rgba(255,255,255,0.92)';
      g.strokeText(text, pad / 2, h / 2 + 2);
    }
    const cut = accent ? text.lastIndexOf(' · ') : -1;
    const head = cut >= 0 ? text.slice(0, cut + 3) : text;
    g.fillStyle = color;
    g.fillText(head, pad / 2, h / 2 + 2);
    if (cut >= 0) {
      g.fillStyle = accent!;
      g.fillText(text.slice(cut + 3), pad / 2 + g.measureText(head).width, h / 2 + 2);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { tex: t, aspect: w / h };
  }, [text, color, weight, mono, plate, halo, accent]);
  useEffect(() => () => tex.dispose(), [tex]);
  const mesh = useRef<THREE.Mesh>(null);
  const world = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const m = mesh.current;
    if (!m || !m.parent) return;
    m.parent.getWorldPosition(world);
    m.parent.getWorldScale(scale);
    const cam = camera as THREE.PerspectiveCamera;
    const l = labelLayout({ designSize: size, parentScale: scale.y, distance: world.distanceTo(camera.position), fovDeg: cam.fov ?? 45 });
    m.visible = l.visible;
    // the mesh is 1 unit tall; undo the parents' scale so the label keeps its screen size
    const s = l.worldHeight / (scale.y || 1);
    m.scale.set(s * aspect, s, 1);
  });
  return (
    // drawn over its own shape (no depth test), so a neighbouring cell or node never cuts the words
    <Billboard position={position}>
      <mesh ref={mesh} renderOrder={20}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}

/**
 * `story`: the panel form (0.4, 0.5): the vectors centred, and `search` runs one similarity search on them.
 * `compact` (0.4's small panels): the graph shows only the bridge's own links.
 */
export function DataShape({ kind, lit = false, title = true, caption, story = false, search = false, compact = false }: { kind: DataKind; lit?: boolean; title?: boolean; caption?: string; story?: boolean; search?: boolean; compact?: boolean }) {
  return (
    <group>
      {kind === 'table' && <TableShape lit={lit} />}
      {kind === 'json' && <JsonShape lit={lit} />}
      {kind === 'graph' && <GraphShape lit={lit} compact={compact} />}
      {kind === 'vectors' && (story ? <VectorSearch search={search} /> : <VectorShape lit={lit} />)}
      {title && <Label text={caption ?? TITLES[kind]} position={[0, -1.35, 0]} size={0.24} weight={700} color={INK} accent={DEEP} plate />}
    </group>
  );
}

export const TITLES: Record<DataKind, string> = {
  table: 'Asset records · table',
  json: 'Spec sheet · JSON',
  graph: 'Who depends on what · graph',
  vectors: 'Report meaning · vectors',
};

/* ---------- table: CITY_ASSET rows as floating cell slabs ---------- */

const TABLE_ROWS = ['Harbor Bridge', 'Substation Gamma', 'Pipeline North-7'].map((id) => ASSETS.find((a) => a.id === id)!);

function TableShape({ lit }: { lit: boolean }) {
  const rows = useRef<THREE.Group>(null);
  const start = useRef(performance.now());
  useEffect(() => void (start.current = performance.now()), [lit]);
  useFrame(() => {
    rows.current?.children.forEach((r, i) => {
      const k = lit ? ease((performance.now() - start.current - 200 - i * 260) / 500) : 1;
      r.scale.set(1, Math.max(0.001, k), 1);
      r.position.z = (1 - k) * 0.6;
    });
  });
  const cols = [1.4, 0.8, 0.45];
  const xs = cols.map((_, i) => -1.2 + cols.slice(0, i).reduce((a, b) => a + b + 0.06, 0) + cols[i] / 2);
  const header = ['asset', 'type', 'crit.'];
  const cell = (r: Asset) => [r.id, r.type, String(r.criticality)];
  return (
    <group>
      <group position={[0, 0.75, 0]}>
        {header.map((h, c) => (
          <group key={h} position={[xs[c], 0, 0]}>
            <mesh>
              <boxGeometry args={[cols[c], 0.24, 0.06]} />
              <meshBasicMaterial color={DEEP} toneMapped={false} />
            </mesh>
            <Label text={h} position={[0, 0, 0.05]} size={0.14} color="#ffffff" weight={700} />
          </group>
        ))}
      </group>
      <group ref={rows}>
        {TABLE_ROWS.map((r, i) => (
          <group key={r.id} position={[0, 0.38 - i * 0.36, 0]}>
            {cell(r).map((v, c) => (
              <group key={c} position={[xs[c], 0, 0]}>
                <mesh>
                  <boxGeometry args={[cols[c], 0.29, 0.05]} />
                  {/* flat colours: the sky light turned lit cells muddy brown */}
                  <meshBasicMaterial color={r.id === HB && lit ? '#fbe3de' : '#e9eef2'} toneMapped={false} />
                </mesh>
                <Label text={v} position={[0, 0, 0.045]} size={0.115} color={r.id === HB ? RED : INK} weight={r.id === HB ? 600 : 400} halo={false} />
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---------- json: the Harbor Bridge spec sheet, one floating line per key ---------- */

function JsonShape({ lit }: { lit: boolean }) {
  const hb = ASSETS.find((a) => a.id === HB)!;
  const entries = Object.entries(hb.specs);
  const lines = useRef<THREE.Group>(null);
  const start = useRef(performance.now());
  useEffect(() => void (start.current = performance.now()), [lit]);
  useFrame(({ clock }) => {
    lines.current?.children.forEach((l, i) => {
      const k = lit ? ease((performance.now() - start.current - 200 - i * 200) / 450) : 1;
      l.scale.setScalar(Math.max(0.001, k));
      l.position.z = Math.sin(clock.elapsedTime * 0.8 + i) * 0.04; // a gentle float
    });
  });
  return (
    <group>
      <Label text={`"${HB}" .specs`} position={[-0.25, 0.95, 0]} size={0.17} color={DIM} mono weight={600} />
      <Label text="{" position={[-1.05, 0.62, 0]} size={0.34} color={DEEP} mono weight={600} />
      <group ref={lines}>
        {entries.map(([k, v], i) => (
          <group key={k} position={[-0.1, 0.42 - i * 0.27, 0]}>
            <Label text={`"${k}":`} position={[-0.45, 0, 0]} size={0.17} color={DEEP} mono weight={600} />
            <Label text={JSON.stringify(v)} position={[0.85, 0, 0]} size={0.17} color={k === 'piers' && lit ? RED : INK} mono weight={700} />
          </group>
        ))}
      </group>
      <Label text="}" position={[-1.05, 0.42 - entries.length * 0.27 + 0.05, 0]} size={0.34} color={DEEP} mono weight={600} />
      {lit && <Label text="a.specs.span_length_m → 485" position={[0.1, -1.12, 0]} size={0.15} color={RED} weight={600} mono />}
    </group>
  );
}

/* ---------- graph: ASSET_CONNECTIONS around Harbor Bridge, two hops, in 3D ---------- */

const SHORT: Record<string, string> = {
  'City Operations Control Center': 'Ops Control Center',
  'Harbor Bridge Sensor Array A': 'Sensor Array A',
  'Harbor Bridge Sensor Array B': 'Sensor Array B',
  'Emergency Operations Center': 'Emergency Ops Center',
};
const short = (id: string) => SHORT[id] ?? id;

/**
 * Harbor Bridge's knowledge graph, laid out by hand so every name and every link reads: the five things
 * joined to the bridge (ASSET_CONNECTIONS), and one hop further the Emergency Operations Center, which
 * Substation Gamma also powers and the Ops Center also coordinates. Wide and flat, to fill a landscape panel.
 */
const GRAPH_AT: Record<string, Vec3> = {
  [HB]: [0, 0, 0],
  'Substation Gamma': [-1.5, 0.85, 0.1],
  'City Operations Control Center': [-1.5, -0.85, 0.1],
  'Emergency Operations Center': [-2.9, 0, -0.1],
  'Harbor Bridge Sensor Array A': [1.8, 0.85, 0.1],
  'Harbor Bridge Sensor Array B': [2.3, -0.15, 0.1],
  'Harbor Seawall East': [1.1, -1.0, 0.1],
};

/** 0.4's small panel: only the four links that say what the bridge depends on */
const GRAPH_COMPACT: Record<string, Vec3> = {
  [HB]: [0, 0, 0],
  'Substation Gamma': [-1.1, 0.6, 0.1],
  'Harbor Bridge Sensor Array A': [1.1, 0.6, 0.1],
  'City Operations Control Center': [-1.1, -0.65, 0.1],
  'Harbor Seawall East': [1.1, -0.65, 0.1],
};

function useGraph(compact: boolean) {
  return useMemo(() => {
    const pos = new Map<string, Vec3>(Object.entries(compact ? GRAPH_COMPACT : GRAPH_AT));
    const edges = CONNECTIONS.filter((c) => pos.has(c.from) && pos.has(c.to));
    const ring = [...new Set(edges.filter((c) => c.to === HB || c.from === HB).map((c) => (c.to === HB ? c.from : c.to)))];
    return { edges, pos, ring };
  }, [compact]);
}

function GraphShape({ lit, compact = false }: { lit: boolean; compact?: boolean }) {
  const { edges, pos, ring } = useGraph(compact);
  const pulses = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (spin.current) spin.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.1;
    // a query runs along the edges: hop 1 from Harbor Bridge, then hop 2
    pulses.current?.children.forEach((p, i) => {
      const e = edges[i];
      const a = pos.get(e.from)!;
      const b = pos.get(e.to)!;
      const hop = e.from === HB || e.to === HB ? 0 : 1;
      const k = ((clock.elapsedTime * 0.6 - hop * 0.5) % 1.6) / 1;
      p.visible = lit && k >= 0 && k <= 1;
      const kk = Math.max(0, Math.min(1, k));
      p.position.set(a[0] + (b[0] - a[0]) * kk, a[1] + (b[1] - a[1]) * kk, a[2] + (b[2] - a[2]) * kk);
    });
    void dt;
  });
  return (
    <group ref={spin}>
      {edges.map((e, i) => {
        const a = pos.get(e.from)!;
        const b = pos.get(e.to)!;
        const first = e.from === HB || e.to === HB;
        // a link's name sits halfway along it, on the outer side (the bridge's own links: one hop out the names would crowd)
        const my = (a[1] + b[1]) / 2;
        const mid: Vec3 = [(a[0] + b[0]) / 2, my + (my >= 0 ? 0.14 : -0.14), (a[2] + b[2]) / 2 + 0.05];
        return (
          <group key={i}>
            <Line points={[a, b]} color={first ? TEAL : '#8fbfca'} lineWidth={first ? 2.2 : 1.4} />
            {first && <Label text={e.type} position={mid} size={0.17} color={DEEP} weight={700} />}
          </group>
        );
      })}
      {[...pos.entries()].map(([id, p]) => {
        const hb = id === HB;
        const near = ring.includes(id);
        return (
          <group key={id} position={p}>
            <mesh>
              <sphereGeometry args={[hb ? 0.15 : near ? 0.09 : 0.065, 24, 24]} />
              <meshStandardMaterial color={hb ? RED : near ? DEEP : '#7fb3bf'} emissive={hb ? RED : DEEP} emissiveIntensity={hb ? 0.35 : 0.15} />
            </mesh>
            {/* the bridge is the hub: its name sits on it, on a pill, so no link crosses the words */}
            <Label text={short(id)} position={[0, hb ? 0 : id === 'Emergency Operations Center' || p[1] > 0.1 ? 0.26 : -0.26, 0.1]} size={hb ? 0.21 : near ? 0.18 : 0.16} color={hb ? RED : INK} weight={hb ? 700 : 600} plate={hb} />
          </group>
        );
      })}
      <group ref={pulses}>
        {edges.map((_, i) => (
          <mesh key={i} visible={false}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- vectors: report text as points in a 3D space; a similarity search ---------- */

/** report text from the lab notebooks, grouped by what it is about; the bridge-bearing ones sit together */
const DOCS: { text: string; topic: 'bridge' | 'power' | 'water' | 'other'; at: Vec3 }[] = [
  { text: 'Pier 3 · crack 0.12 mm', topic: 'bridge', at: [0.5, 0.5, 0.2] },
  { text: 'Pier 2 · ~25% section loss', topic: 'bridge', at: [0.85, 0.12, 0.35] },
  { text: 'Pier 2 · rust bleed', topic: 'bridge', at: [0.35, -0.05, 0.45] },
  { text: 'substation reports', topic: 'power', at: [-0.75, 0.6, -0.3] },
  { text: 'pipeline reports', topic: 'water', at: [-0.45, -0.7, 0.25] },
];
const QUERY_TEXT = 'cracks or corrosion on bridge bearings';
const QUERY_AT: Vec3 = [0.6, 0.22, 0.32];
const CENTRES: Record<string, Vec3> = { bridge: [0.6, 0.2, 0.3], power: [-0.7, 0.45, -0.25], water: [-0.4, -0.55, 0.2], other: [0.1, -0.2, -0.6] };

function VectorShape({ lit }: { lit: boolean }) {
  // ~180 background points in four clusters (the corpus), plus the labelled documents
  const cloud = useMemo(() => {
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const g = () => (r() + r() + r() - 1.5) * 0.45;
    const topics = Object.keys(CENTRES);
    return Array.from({ length: 180 }, (_, i) => {
      const c = CENTRES[topics[i % topics.length]];
      return { p: [c[0] + g() * 0.6, c[1] + g() * 0.55, c[2] + g() * 0.55] as Vec3, topic: topics[i % topics.length] };
    });
  }, []);
  // the closest unlabelled points (drawn larger and red once found)
  const near = useMemo(() => {
    const d = (p: Vec3) => Math.hypot(p[0] - QUERY_AT[0], p[1] - QUERY_AT[1], p[2] - QUERY_AT[2]);
    return cloud.map((c, i) => ({ i, d: d(c.p) })).sort((a, b) => a.d - b.d).slice(0, 5).map((x) => x.i);
  }, [cloud]);
  const pts = useRef<THREE.InstancedMesh>(null);
  const q = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const lines = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const LOOP = 6.5;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (spin.current) spin.current.rotation.y = t * 0.12;
    // the search, on a loop: the question flies in (0-1.4 s), the radius grows (1.4-2.6 s), neighbours light (2.6 s on)
    const k = lit ? t % LOOP : LOOP;
    const fly = ease(k / 1.4);
    const grow = ease((k - 1.4) / 1.2);
    const found = k > 2.6;
    if (q.current) {
      q.current.visible = lit;
      q.current.position.set(QUERY_AT[0] + (1 - fly) * 1.6, QUERY_AT[1] + (1 - fly) * 1.2, QUERY_AT[2] + (1 - fly) * 0.8);
    }
    if (ring.current) {
      ring.current.visible = lit && k > 1.4;
      ring.current.scale.setScalar(0.02 + grow * 0.32);
    }
    if (lines.current) lines.current.visible = lit && found;
    const m = pts.current;
    if (!m) return;
    cloud.forEach((c, i) => {
      const hit = lit && found && near.includes(i);
      dummy.position.set(...c.p);
      dummy.scale.setScalar(hit ? 1.9 : 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, col.set(hit ? RED : c.topic === 'bridge' ? TEAL : c.topic === 'power' ? '#7fa6d6' : c.topic === 'water' ? '#8bc4a5' : '#b9c3cc'));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  const axis = (to: Vec3) => <Line points={[[-1, -0.9, -0.8], to]} color="#9aa6b2" lineWidth={1} transparent opacity={0.6} />;
  return (
    <group ref={spin}>
      {/* the space itself: three faint axes ("384 dimensions, shown in 3") */}
      {axis([1.1, -0.9, -0.8])}
      {axis([-1, 1.05, -0.8])}
      {axis([-1, -0.9, 0.9])}
      <instancedMesh ref={pts} args={[undefined, undefined, cloud.length]} frustumCulled={false}>
        <octahedronGeometry args={[0.03, 0]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {DOCS.map((d) => (
        <group key={d.text}>
          <mesh position={d.at}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color={d.topic === 'bridge' ? RED : DEEP} toneMapped={false} />
          </mesh>
          <Label text={d.text} position={[d.at[0], d.at[1] + 0.12, d.at[2]]} size={d.topic === 'bridge' ? 0.11 : 0.08} color={d.topic === 'bridge' ? RED : DIM} weight={d.topic === 'bridge' ? 600 : 500} />
        </group>
      ))}
      <group ref={q} visible={false}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <Label text={`“${QUERY_TEXT}”`} position={[0, -0.15, 0]} size={0.12} color={INK} weight={600} plate />
      </group>
      <mesh ref={ring} position={QUERY_AT} visible={false}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <group ref={lines} visible={false}>
        {/* the nearest: the three bridge-bearing reports, then the closest unlabelled points */}
        {DOCS.filter((d) => d.topic === 'bridge').map((d) => (
          <Line key={d.text} points={[QUERY_AT, d.at]} color={RED} lineWidth={2.2} />
        ))}
        {near.slice(0, 2).map((i) => (
          <Line key={i} points={[QUERY_AT, cloud[i].p]} color={RED} lineWidth={1.2} transparent opacity={0.6} />
        ))}
      </group>
      <Label text="384 numbers per text · shown in 3" position={[0.1, 1.15, -0.8]} size={0.075} color={DIM} mono />
    </group>
  );
}

/* ---------- vectors in a panel (0.4, 0.5): reports stored by meaning; on 0.5 one search runs ---------- */

const CLUSTERS: { name: string; at: Vec3; color: string; label: number }[] = [
  { name: 'bridge reports', at: [0.45, 0.35, 0.1], color: TEAL, label: 0.42 },
  { name: 'substation reports', at: [-0.7, 0.32, -0.2], color: '#7fa6d6', label: -0.42 },
  { name: 'pipeline reports', at: [-0.2, -0.62, 0.15], color: '#8bc4a5', label: -0.42 },
  { name: '', at: [0.8, -0.55, -0.3], color: '#b9c3cc', label: 0 },
];
/** the bridge reports nearest the question: what the search finds */
const NEAREST: Vec3[] = [
  [0.36, 0.5, 0.15],
  [0.66, 0.28, 0.05],
  [0.24, 0.24, 0.25],
];
const QUERY: Vec3 = [0.45, 0.36, 0.14];
const SEARCH_MS = 7000;

/**
 * The reports as points in a space of meaning, similar reports close together. With `search` (0.5) one
 * similarity search loops: the question drops in as a point, a sphere grows around it, and the nearest
 * reports light up. Centred on its group, like every shape.
 */
function VectorSearch({ search }: { search: boolean }) {
  const cloud = useMemo(() => {
    let s = 11;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const g = () => (r() + r() + r() - 1.5) * 0.34;
    return Array.from({ length: 120 }, (_, i) => {
      const c = CLUSTERS[i % CLUSTERS.length];
      return { p: [c.at[0] + g(), c.at[1] + g() * 0.8, c.at[2] + g()] as Vec3, color: c.color };
    });
  }, []);
  const start = useRef(performance.now());
  useEffect(() => void (start.current = performance.now()), [search]);
  const question = useRef<THREE.Group>(null);
  const ask = useRef<THREE.Mesh>(null);
  const reach = useRef<THREE.Mesh>(null);
  const found = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = search ? (performance.now() - start.current) % SEARCH_MS : 0;
    // the question appears, drops into the space (0-1.1 s), the sphere grows (1.1-2.1 s), the nearest light (2.1 s), all fade at the end
    const out = 1 - ease((t - SEARCH_MS + 700) / 500);
    if (question.current) {
      const k = ease(t / 400) * out;
      question.current.visible = search && k > 0.01;
      question.current.scale.setScalar(Math.max(0.001, k));
    }
    if (ask.current) {
      const drop = ease((t - 300) / 800);
      ask.current.visible = search && t > 300 && out > 0.01;
      ask.current.position.set(QUERY[0], QUERY[1] + (1 - drop) * 0.55, QUERY[2]);
    }
    if (reach.current) {
      const k = ease((t - 1100) / 1000) * out;
      reach.current.visible = search && k > 0.01;
      reach.current.scale.setScalar(0.02 + k * 0.34);
    }
    if (found.current) found.current.visible = search && t > 2100 && out > 0.5;
  });
  return (
    <group>
      {cloud.map((c, i) => (
        <mesh key={i} position={c.p}>
          <octahedronGeometry args={[0.045, 0]} />
          <meshBasicMaterial color={c.color} toneMapped={false} />
        </mesh>
      ))}
      {CLUSTERS.filter((c) => c.name).map((c) => (
        <Label key={c.name} text={c.name} position={[c.at[0], c.at[1] + c.label, c.at[2]]} size={0.19} color={DIM} weight={600} />
      ))}
      <group ref={question} position={[0, 0.98, 0.2]} visible={false}>
        <Label text="“cracks or corrosion on bridge bearings”" position={[0, 0, 0]} size={0.17} color={DEEP} weight={700} plate />
      </group>
      <mesh ref={ask} visible={false}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh ref={reach} position={QUERY} visible={false}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <group ref={found} visible={false}>
        {NEAREST.map((p, i) => (
          <group key={i}>
            <mesh position={p}>
              <octahedronGeometry args={[0.08, 0]} />
              <meshBasicMaterial color={RED} toneMapped={false} />
            </mesh>
            <Line points={[QUERY, p]} color={RED} lineWidth={2} />
          </group>
        ))}
      </group>
    </group>
  );
}
