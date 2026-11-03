import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line, useGLTF } from '@react-three/drei';
import { ReadyHtml as Html } from './ReadyHtml';
import { ASSETS, assetPosition, project } from '../content/geo';
import riverJson from '../content/river.json';
import { Person, type Who } from './Person';
import type { Vec3 } from './shots';
import { at } from '../engine/base';

/**
 * City Operations Control Center, close up: a cut-away control room floating over its site, drawn in
 * metres (Kenney furniture and people, CC0) and scaled into the city. A video wall shows the city map,
 * the incidents and today's numbers; operators work at their desks. Grows in on Ops Center pages.
 */
const OPS = assetPosition('City Operations Control Center');
/** world units per metre of room */
export const ROOM_SCALE = 0.55;
/** height of the room floor above the street, clear of the towers around the site */
export const ROOM_Y = 2.6;
export const ROOM_ANCHOR: Vec3 = [OPS.x, ROOM_Y, OPS.z];
const FLOOR = { w: 10, d: 6.6 };
/** desk top height for a 1.7 m Kenney desk */
const DESK_TOP = 0.76;

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export function OpsRoom({ show }: { show: boolean }) {
  const root = useRef<THREE.Group>(null);
  const k = useRef(0);
  const [visible, setVisible] = useState(false);
  useFrame((_, dt) => {
    k.current += ((show ? 1 : 0) - k.current) * Math.min(1, dt * 3);
    const s = ease(k.current);
    if (root.current) root.current.scale.setScalar(Math.max(0.0001, s * ROOM_SCALE));
    const v = k.current > 0.01;
    if (v !== visible) setVisible(v);
  });
  return (
    <group name="ops-room" position={ROOM_ANCHOR} visible={visible}>
      <group ref={root}>{visible && <Room />}</group>
      {visible && (
        <Line points={[[0, -0.15, 0], [0, -ROOM_Y + 0.8, 0]]} color="#1B8A9C" lineWidth={1} transparent opacity={0.45} dashed dashSize={0.2} gapSize={0.15} />
      )}
    </group>
  );
}

/**
 * A Kenney furniture piece scaled so its width (x) is `width` metres, centred on x/z and standing on
 * y = 0 (Kenney pieces have their origin at a corner). `screen` puts a glowing display on its +z face.
 */
function Prop({ name, width, position, rotation = 0, screen }: { name: string; width: number; position: Vec3; rotation?: number; screen?: THREE.Texture }) {
  const gltf = useGLTF(at(`models/kenney/furniture/${name}.glb`));
  const { obj, scale, offset, size } = useMemo(() => {
    const o = gltf.scene.clone(true);
    o.traverse((m) => {
      // the room floats above the street: its shadows would never reach anything, and drawing them is not free
      if ((m as THREE.Mesh).isMesh) (m as THREE.Mesh).castShadow = (m as THREE.Mesh).receiveShadow = false;
    });
    const b = new THREE.Box3().setFromObject(o);
    const s = width / Math.max(1e-6, b.max.x - b.min.x);
    const c = b.getCenter(new THREE.Vector3());
    const sz = b.getSize(new THREE.Vector3()).multiplyScalar(s);
    return { obj: o, scale: s, offset: [-c.x * s, -b.min.y * s, -c.z * s] as Vec3, size: sz };
  }, [gltf, width]);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <primitive object={obj} scale={scale} position={offset} />
      {screen && (
        <mesh position={[0, size.y * 0.62, size.z / 2 + 0.004]}>
          <planeGeometry args={[size.x * 0.86, size.y * 0.55]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function Room() {
  const wall = useWallTextures();
  const desk = useDeskTexture();
  // desks face the video wall (north, -z); operators sit facing it
  const desks: { x: number; z: number; who: Who }[] = [
    { x: -2.6, z: -0.5, who: 'character-female-b' },
    { x: 0, z: -0.5, who: 'character-male-a' },
    { x: 2.6, z: -0.5, who: 'character-male-c' },
    { x: -1.3, z: 1.7, who: 'character-male-e' },
    { x: 1.3, z: 1.7, who: 'character-female-d' },
  ];
  return (
    <group>
      {/* floor slab with a teal edge */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[FLOOR.w, 0.3, FLOOR.d]} />
        <meshStandardMaterial color="#e9e6df" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.31, 0]}>
        <boxGeometry args={[FLOOR.w + 0.1, 0.04, FLOOR.d + 0.1]} />
        <meshBasicMaterial color="#1B8A9C" />
      </mesh>
      {/* back wall carrying the video wall */}
      <mesh position={[0, 1.6, -FLOOR.d / 2 + 0.1]}>
        <boxGeometry args={[FLOOR.w, 3.2, 0.2]} />
        <meshStandardMaterial color="#2a313c" roughness={0.8} />
      </mesh>
      {wall.map((tex, i) => {
        const x = (i - 1) * 3.15;
        return (
          <mesh key={i} position={[x, 1.75, -FLOOR.d / 2 + 0.22 + Math.abs(i - 1) * 0.35]} rotation={[0, -(i - 1) * 0.22, 0]}>
            <planeGeometry args={[3.0, 1.7]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
            {/* what moves on the wall is drawn as two small meshes: the screens themselves are drawn once */}
            {i === 0 && <PulseRing />}
            {i === 1 && <BlinkingCursor />}
          </mesh>
        );
      })}
      {desks.map((d, i) => (
        <group key={i} position={[d.x, 0, d.z]}>
          <Prop name="desk" width={1.7} position={[0, 0, 0]} />
          <Prop name="computerScreen" width={0.62} position={[-0.38, DESK_TOP, -0.15]} screen={desk} />
          <Prop name="computerScreen" width={0.62} position={[0.38, DESK_TOP, -0.15]} screen={desk} />
          <Prop name="chairDesk" width={0.62} position={[0, 0, 0.75]} rotation={Math.PI} />
          <Person who={d.who} position={[0, 0.05, 0.75]} pose="sit" facing={Math.PI} height={1.15} shadow={false} />
        </group>
      ))}
      {/* the shift lead at the video wall */}
      <Person who="character-female-f" position={[3.9, 0, -2.2]} pose="interact-right" facing={Math.PI * 0.85} height={1.3} shadow={false} />
      <Prop name="pottedPlant" width={0.6} position={[-4.4, 0, 2.6]} />
      <Prop name="pottedPlant" width={0.6} position={[4.4, 0, 2.6]} />
      <Html position={[0, 3.6, -FLOOR.d / 2]} center zIndexRange={[15, 0]} style={{ pointerEvents: 'none' }}>
        <div className="place-label mono">City Operations Control Center</div>
      </Html>
    </group>
  );
}

/** what the operators' own monitors show: a small dashboard, drawn once */
function useDeskTexture(): THREE.CanvasTexture {
  const tex = useMemo(() => {
    const c = Object.assign(document.createElement('canvas'), { width: 256, height: 150 });
    const g = c.getContext('2d')!;
    g.fillStyle = '#0f1823';
    g.fillRect(0, 0, 256, 150);
    g.fillStyle = '#2bb3c8';
    [0.8, 0.55, 0.7, 0.4].forEach((w, i) => g.fillRect(16, 22 + i * 26, 150 * w, 10));
    g.fillStyle = '#e2604c';
    g.fillRect(16, 126, 70, 10);
    g.strokeStyle = '#2bb3c8';
    g.lineWidth = 3;
    g.beginPath();
    [0, 0.3, 0.2, 0.6, 0.45, 0.8].forEach((v, i) => (i ? g.lineTo(186 + i * 12, 120 - v * 80) : g.moveTo(186, 120 - v * 80)));
    g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/* ---------- video wall: three screens drawn on canvases ---------- */

const W = 1200;
const H = 680;
const NAVY = '#0f1823';
const TEAL = '#2bb3c8';
const RED = '#e2604c';
const INK = '#e9eef2';
const DIM = '#7f8e9b';

function useWallTextures(): THREE.CanvasTexture[] {
  const canvases = useMemo(() => [0, 1, 2].map(() => Object.assign(document.createElement('canvas'), { width: W, height: H })), []);
  const textures = useMemo(
    () =>
      canvases.map((c) => {
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      }),
    [canvases],
  );
  // drawn once (and again when the bundled fonts are ready): redrawing three 1200 x 680 canvases and sending them to
  // the graphics card several times a second was what made the Ops pages stutter (owner, 31 Oct)
  const draw = () => {
    drawMap(canvases[0].getContext('2d')!);
    drawIncidents(canvases[1].getContext('2d')!);
    drawToday(canvases[2].getContext('2d')!);
    textures.forEach((t) => (t.needsUpdate = true));
  };
  useEffect(() => {
    draw();
    // redraw once the bundled fonts are ready
    document.fonts?.ready.then(draw);
    return () => textures.forEach((t) => t.dispose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return textures;
}

/** one canvas pixel in the wall's plane units (a screen is 3.0 wide for 1200 px) */
const PX = 3.0 / W;
const planeX = (cx: number) => (cx / W - 0.5) * 3.0;
const planeY = (cy: number) => (0.5 - cy / H) * 1.7;

/** the map's alert ring around Harbor Bridge: it widens and fades about once every 1.4 s */
function PulseRing() {
  const ring = useRef<THREE.Mesh>(null);
  const hb = PINS.find((p) => p.id === 'Harbor Bridge')!;
  useFrame(({ clock }) => {
    const m = ring.current;
    if (!m) return;
    const ph = (clock.elapsedTime * 0.7) % 1;
    const r = (14 + ph * 46) * PX;
    m.scale.set(r, r, 1);
    (m.material as THREE.MeshBasicMaterial).opacity = 1 - ph;
  });
  return (
    <mesh ref={ring} position={[planeX(mx(hb.x)), planeY(mz(hb.z)), 0.004]}>
      <ringGeometry args={[0.92, 1, 40]} />
      <meshBasicMaterial color={RED} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** the cursor blinking on the open incident */
function BlinkingCursor() {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (m.current) m.current.visible = Math.floor(clock.elapsedTime * 2) % 2 === 0;
  });
  return (
    <mesh ref={m} position={[planeX(W - 81), planeY(124), 0.004]}>
      <planeGeometry args={[18 * PX, 18 * PX]} />
      <meshBasicMaterial color={RED} toneMapped={false} />
    </mesh>
  );
}

function frame(ctx: CanvasRenderingContext2D, title: string) {
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(43,179,200,0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);
  ctx.fillStyle = TEAL;
  ctx.font = '600 34px "JetBrains Mono", monospace';
  ctx.fillText(title, 40, 66);
}

const RIVER = (riverJson as [number, number][]).map(([la, lo]) => project(la, lo));
const PINS = ASSETS.map((a) => ({ id: a.id, ...project(a.lat, a.lon) }));
// map window over the story area (world x, z)
const MAP = { x0: -78, x1: 8, z0: -82, z1: -14 };
const mx = (x: number) => 40 + ((x - MAP.x0) / (MAP.x1 - MAP.x0)) * (W - 80);
const mz = (z: number) => 100 + ((z - MAP.z0) / (MAP.z1 - MAP.z0)) * (H - 140);

function drawMap(ctx: CanvasRenderingContext2D) {
  frame(ctx, 'CITY MAP · 28 ASSETS');
  ctx.save();
  ctx.beginPath();
  ctx.rect(20, 90, W - 40, H - 110);
  ctx.clip();
  ctx.strokeStyle = '#2b4a63';
  ctx.lineWidth = 22;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  RIVER.forEach((p, i) => (i ? ctx.lineTo(mx(p.x), mz(p.z)) : ctx.moveTo(mx(p.x), mz(p.z))));
  ctx.stroke();
  for (const p of PINS) {
    const hb = p.id === 'Harbor Bridge';
    ctx.fillStyle = hb ? RED : TEAL;
    ctx.beginPath();
    ctx.arc(mx(p.x), mz(p.z), hb ? 11 : 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const hb = PINS.find((p) => p.id === 'Harbor Bridge')!;
  ctx.fillStyle = INK;
  ctx.font = '28px Inter, sans-serif';
  ctx.fillText('Harbor Bridge', mx(hb.x) + 22, mz(hb.z) - 18);
  ctx.restore();
}

function drawIncidents(ctx: CanvasRenderingContext2D) {
  frame(ctx, 'INCIDENTS');
  const rows: [string, string, string][] = [
    [RED, 'Harbor Bridge · the crack', 'hairline crack · 0.12 mm · Lab 2'],
    [TEAL, 'Harbor Bridge · the rust', 'surface corrosion · ~25% section loss · Lab 3'],
  ];
  rows.forEach(([c, a, b], i) => {
    const y = 150 + i * 170;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(40, y - 50, W - 80, 140);
    ctx.fillStyle = c;
    ctx.fillRect(40, y - 50, 10, 140);
    ctx.fillStyle = INK;
    ctx.font = '600 40px Inter, sans-serif';
    ctx.fillText(a, 80, y + 6);
    ctx.fillStyle = DIM;
    ctx.font = '30px Inter, sans-serif';
    ctx.fillText(b, 80, y + 56);
  });
  ctx.fillStyle = DIM;
  ctx.font = '28px "JetBrains Mono", monospace';
  ctx.fillText('AI agent · language model · ready', 40, H - 46);
}

function drawToday(ctx: CanvasRenderingContext2D) {
  frame(ctx, 'TODAY · 24 HOURS');
  const kpis: [string, string][] = [
    ['308', 'maintenance logs'],
    ['60', 'inspection reports'],
    ['220', 'findings'],
  ];
  kpis.forEach(([n, l], i) => {
    const x = 60 + i * 370;
    ctx.fillStyle = INK;
    ctx.font = '600 120px "JetBrains Mono", monospace';
    ctx.fillText(n, x, 300);
    ctx.fillStyle = DIM;
    ctx.font = '30px Inter, sans-serif';
    ctx.fillText(l, x, 350);
    ctx.fillStyle = TEAL;
    ctx.fillRect(x, 380, 300, 6);
  });
  ctx.fillStyle = DIM;
  ctx.font = '28px "JetBrains Mono", monospace';
  ctx.fillText('ALL_MINILM_L12_V2 · 384 numbers per text', 60, H - 46);
}

for (const n of ['desk', 'computerScreen', 'chairDesk', 'pottedPlant']) useGLTF.preload?.(at(`models/kenney/furniture/${n}.glb`));
