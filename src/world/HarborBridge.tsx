import { useCallback, useEffect, useMemo, useRef, type ReactElement } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { ReadyHtml as Html } from './ReadyHtml';
import { useUiStore } from '../engine/ui';
import { BRIDGE, BRIDGE_S, DECK_T, DECK_Y, harborBridgeFrame } from './bridgeFrame';
import { Person, type Who } from './Person';
import type { Vec3 } from './shots';

/** Structure units scale the accepted Senayan training crossing. */
const S = BRIDGE_S;
/** Legacy compatibility value; the Senayan crossing renders no pylons. */
export const PYLON_H = 2.6;

type BridgeSurface = 'concrete' | 'asphalt' | 'steel' | 'rubber' | 'paint';

/** Subtle local surface grain; no remote textures or geometry displacement. */
function surfaceGrain(kind: 'concrete' | 'asphalt'): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const pixels = context.createImageData(128, 128);
  let seed = kind === 'concrete' ? 14397 : 7139;
  for (let i = 0; i < pixels.data.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const grain = seed / 4294967296;
    const value = kind === 'concrete' ? 220 + Math.floor(grain * 28) : 187 + Math.floor(grain * 62);
    pixels.data[i] = value;
    pixels.data[i + 1] = value;
    pixels.data[i + 2] = value;
    pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const SURFACE: Record<BridgeSurface, { roughness: number; metalness: number }> = {
  concrete: { roughness: 0.94, metalness: 0 },
  asphalt: { roughness: 0.98, metalness: 0 },
  steel: { roughness: 0.42, metalness: 0.66 },
  rubber: { roughness: 0.98, metalness: 0 },
  paint: { roughness: 0.62, metalness: 0.32 },
};

export function HarborBridge({ inspect, markers = false }: { inspect?: { pier: 'pier3' | 'pier2'; who: Who; leave?: boolean }; markers?: boolean | 'pier2' }) {
  const theme = useUiStore((state) => state.theme);
  const f = harborBridgeFrame();
  const textures = useMemo(() => ({ concrete: surfaceGrain('concrete'), asphalt: surfaceGrain('asphalt') }), []);
  useEffect(() => () => { textures.concrete?.dispose(); textures.asphalt?.dispose(); }, [textures]);
  const kindFor = (key: string): BridgeSurface => /^(deck|approach)/.test(key) ? 'asphalt' : /^bearing/.test(key) ? 'rubber' : /^(rail|post|rung|bolt|base)/.test(key) ? 'steel' : /^platform/.test(key) || /^training-platform/.test(key) ? 'paint' : 'concrete';
  const box = (key: string, x: number, y: number, z: number, w: number, h: number, d: number, color: string, rotation?: Vec3): ReactElement => (
    <mesh key={key} position={[x / S, y / S, z / S]} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[w / S, h / S, d / S]} />
      <meshStandardMaterial color={color} {...SURFACE[kindFor(key)]}
        map={kindFor(key) === 'concrete' ? textures.concrete : kindFor(key) === 'asphalt' ? textures.asphalt : null}
        bumpMap={kindFor(key) === 'concrete' ? textures.concrete : kindFor(key) === 'asphalt' ? textures.asphalt : null}
        bumpScale={(kindFor(key) === 'asphalt' ? 0.00035 : 0.00016) / S} />
    </mesh>
  );
  const pieces: ReactElement[] = [];
  const top = (DECK_Y + DECK_T / 2) * S;
  pieces.push(box('deck', 0, DECK_Y * S, 0, f.water * 2, DECK_T * S, 0.4, '#666e70'));
  // The mapped plan is represented by a slab and two bank abutments; elevation is illustrative.
  for (const side of [-1, 1]) {
    const x = side * 0.61;
    pieces.push(box(`abut${side}`, x, -0.015, 0, 0.24, 0.39, 0.5, '#b8b8ae'));
    pieces.push(box(`cap${side}`, x, 0.18, 0, 0.28, 0.026, 0.48, '#d0d0c5'));
    pieces.push(box(`bearing${side}`, x, 0.192, 0, 0.15, 0.014, 0.3, '#495357'));
    const drop = top - 0.04;
    const len = Math.hypot(f.ramp, drop);
    pieces.push(box(`approach${side}`, side * (f.water + f.ramp / 2), (top + 0.04) / 2 - 0.014, 0, len, 0.028, 0.4, '#777d7b', [0, 0, -side * Math.atan2(drop, f.ramp)]));
    for (const edge of [-1, 1]) pieces.push(box(`wing${side}${edge}`, side * 0.86, -0.03, edge * 0.235, 0.28, 0.22, 0.05, '#aeb4a8'));
  }
  for (const edge of [-1, 1]) {
    pieces.push(box(`kerb${edge}`, 0, top + 0.014, edge * 0.185, f.water * 2, 0.028, 0.03, '#d4d0be'));
    pieces.push(box(`rail${edge}`, 0, top + 0.12, edge * 0.19, f.water * 2, 0.012, 0.012, '#7a8c89'));
    for (let i = 0; i <= 9; i++) pieces.push(box(`post${edge}${i}`, -0.70 + i * 0.1555, top + 0.072, edge * 0.19, 0.012, 0.115, 0.012, '#7a8c89'));
  }
  for (const [i, p] of BRIDGE.platforms.entries()) {
    pieces.push(box(`training-platform${i}`, p.x, p.y - 0.006, p.z, p.w, 0.012, p.d, '#7f9294'));
    // Open guardrails preserve the existing platform envelope while revealing the inspector's footing.
    for (const side of [-1, 1]) {
      pieces.push(box(`platform-side${i}${side}`, p.x + side * p.w / 2, p.y + 0.086, p.z, 0.008, 0.008, p.d, '#c5a35c'));
      pieces.push(box(`platform-mid${i}${side}`, p.x + side * p.w / 2, p.y + 0.047, p.z, 0.006, 0.006, p.d, '#c5a35c'));
      for (const end of [-1, 1]) pieces.push(box(`platform-upright${i}${side}${end}`, p.x + side * p.w / 2, p.y + 0.045, p.z + end * (p.d / 2 - .004), .008, .09, .008, '#c5a35c'));
    }
    pieces.push(box(`platform-front${i}`, p.x, p.y + 0.09, p.z + p.d / 2, p.w, 0.008, 0.008, '#d4aa4d'));
    for (let rung = 0; rung < 4; rung++) pieces.push(box(`rung${i}${rung}`, p.x + 0.15, 0.045 + rung * 0.045, 0.255, 0.055, 0.006, 0.012, '#7e8c89'));
  }
  // Concrete pour joints, deck expansion joints and hardware stay within the original extents.
  for (const side of [-1, 1]) {
    const x = side * .61;
    for (const y of [-.09, .035]) pieces.push(box(`form-joint${side}${y}`, x, y, .2504, .238, .001, .0008, '#9baba3'));
    for (const dx of [-.075, .075]) for (const y of [-.12, .10]) {
      pieces.push(<mesh key={`tie${side}${dx}${y}`} position={[(x + dx) / S, y / S, .2508 / S]}>
        <circleGeometry args={[.0025 / S, 10]} /><meshStandardMaterial color="#89958f" roughness={1} />
      </mesh>);
    }
    pieces.push(box(`expansion-joint${side}`, side * (f.water - .003), top + .0004, 0, .002, .0008, .338, '#364347'));
  }
  for (const edge of [-1, 1]) for (let i = 0; i <= 9; i++) {
    const x = -.70 + i * .1555;
    pieces.push(box(`baseplate${edge}${i}`, x, top + .030, edge * .19, .018, .004, .018, '#738782'));
  }
  pieces.push(<Crack key="crack" alert={markers === true || inspect?.pier === 'pier3'} />);
  pieces.push(<Corrosion key="rust" alert={!!markers || inspect?.pier === 'pier2'} />);
  if (inspect) pieces.push(<Inspection key={`${inspect.pier}-${inspect.who}-${!!inspect.leave}`} {...inspect} />);
  if (markers === true) pieces.push(<Marker key="crack-marker" x={BRIDGE.damage.crack.x / S} y={top / S} label="Training crack" sub="Fictional inspection · Lab 2" color={theme.red} delayMs={900} labelY={2.8} />);
  if (markers) pieces.push(<Marker key="rust-marker" x={BRIDGE.damage.corrosion.x / S} y={top / S} label="Training corrosion" sub="Fictional inspection · Lab 3" color={theme.data} delayMs={1300} labelY={2.4} />);
  return <group position={[f.x, 0, f.z]} rotation={[0, f.yaw, 0]} scale={S} name="senayan-training-crossing">{pieces}</group>;
}

const dmg = (d: { x: number; y: number; z: number }, dz = 0.006): Vec3 => [d.x / S + DAMAGE_SHIFT, d.y / S, d.z / S + dz];
/** the damage sits a little to the west of the pier's centre line, the inspector stands to the east of it */
const DAMAGE_SHIFT = -0.1;

/** Pier 3: a jagged hairline crack running down the shaft, glowing red and pulsing when it is the story */
function Crack({ alert }: { alert: boolean }) {
  const [cx, cy, cz] = dmg(BRIDGE.damage.crack);
  const main: Vec3[] = [
    [-0.16, 0.3], [-0.1, 0.22], [-0.12, 0.13], [-0.03, 0.05], [-0.06, -0.04],
    [0.03, -0.12], [0.0, -0.2], [0.09, -0.28], [0.07, -0.36],
  ].map(([x, y]) => [cx + x, cy + y, cz] as Vec3);
  const branch: Vec3[] = [[-0.03, 0.05], [0.06, 0.09], [0.12, 0.06], [0.18, 0.11]].map(([x, y]) => [cx + x, cy + y, cz] as Vec3);
  const glow = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!glow.current) return;
    glow.current.visible = alert;
    const k = 0.55 + 0.45 * Math.sin(clock.elapsedTime * 3);
    glow.current.children.forEach((c) => {
      const m = (c as unknown as { material?: { opacity: number } }).material;
      if (m) m.opacity = k;
    });
  });
  return (
    <group name="pier3-crack">
      <Line points={main} color="#2a1a14" lineWidth={2.5} />
      <Line points={branch} color="#2a1a14" lineWidth={1.8} />
      <group ref={glow}>
        <Line points={main} color="#ff5a3c" lineWidth={7} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
        <Line points={branch} color="#ff5a3c" lineWidth={5} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
      </group>
      <AlertRing position={[cx, cy, cz]} radius={0.2} color="#e2604c" show={alert} />
    </group>
  );
}

/** Pier 2: rust patches and rust bleeding down the shaft; ringed in teal when it is the story */
function Corrosion({ alert }: { alert: boolean }) {
  const [cx, cy, cz] = dmg(BRIDGE.damage.corrosion, 0.005);
  const blobs: [number, number, number, string][] = [
    [0, 0, 0.16, '#8a4a22'], [0.12, 0.07, 0.1, '#a95a28'], [-0.13, -0.04, 0.11, '#6b3a1c'],
    [0.05, -0.11, 0.08, '#b5652d'], [-0.06, 0.12, 0.07, '#7b4220'],
  ];
  return (
    <group name="pier2-corrosion">
      {blobs.map(([x, y, r, c], i) => (
        <mesh key={i} position={[cx + x, cy + y, cz + i * 0.0005]} scale={[1, 0.75 + (i % 3) * 0.15, 1]}>
          <circleGeometry args={[r, 9]} />
          <meshStandardMaterial color={c} roughness={1} />
        </mesh>
      ))}
      {[-0.08, 0.02, 0.1].map((x, i) => (
        <mesh key={`b${i}`} position={[cx + x, cy - 0.28 - i * 0.04, cz]}>
          <planeGeometry args={[0.025, 0.36 + i * 0.08]} />
          <meshStandardMaterial color="#8a4a22" roughness={1} transparent opacity={0.7} />
        </mesh>
      ))}
      <AlertRing position={[cx, cy, cz]} radius={0.2} color="#2bb3c8" show={alert} />
    </group>
  );
}

/** a ring on the pier face that ripples outwards from the damage */
function AlertRing({ position, radius, color, show }: { position: Vec3; radius: number; color: string; show: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (!ring.current || !mat.current) return;
    ring.current.visible = show;
    const ph = (clock.elapsedTime * 0.6) % 1;
    const s = 1 + ph * 0.45;
    ring.current.scale.set(s, s, 1);
    mat.current.opacity = (1 - ph) * 0.9;
  });
  return (
    <mesh ref={ring} position={[position[0], position[1], position[2] + 0.004]}>
      <ringGeometry args={[radius, radius + 0.02, 48]} />
      <meshBasicMaterial ref={mat} color={color} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/**
 * An inspector walks along the platform to the damage, turns to the pier and shines a torch on it;
 * once they are there, the finding is named next to it. With `leave` (2.1b) they start at the damage
 * and walk back off the platform instead, torch off, and are gone once out of the shot.
 */
function Inspection({ pier, who, leave = false }: { pier: 'pier3' | 'pier2'; who: Who; leave?: boolean }) {
  const p = BRIDGE.platforms[pier === 'pier3' ? 0 : 1];
  const d = pier === 'pier3' ? BRIDGE.damage.crack : BRIDGE.damage.corrosion;
  const floor = p.y / S + 0.04;
  // walk in from the far end of the platform and stop beside the damage (not in front of it, so it stays in view)
  const from: Vec3 = [p.x / S - 0.36, floor, p.z / S + 0.3];
  const to: Vec3 = [d.x / S + 0.36, floor, d.z / S + 0.22];
  const spot: Vec3 = [d.x / S + DAMAGE_SHIFT, d.y / S, d.z / S];
  const facing = Math.atan2(spot[0] - to[0], spot[2] - to[2]);
  const WALK = 2600;
  const LEAVE_DELAY = 700;
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  const beamMesh = useRef<THREE.Mesh>(null);
  const inspectionRoot = useRef<THREE.Group>(null);
  const torchWorld = useRef<THREE.Vector3 | null>(null);
  const beamWork = useMemo(() => ({ hand: new THREE.Vector3(), targetWorld: new THREE.Vector3(), target: new THREE.Vector3(...spot), direction: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }), [pier]);
  const trackTorch = useCallback((world: THREE.Vector3, torch: THREE.Object3D) => {
    if (!inspectionRoot.current) return;
    inspectionRoot.current.updateWorldMatrix(true, false);
    inspectionRoot.current.localToWorld(beamWork.targetWorld.copy(beamWork.target));
    torch.lookAt(beamWork.targetWorld);
    torch.updateWorldMatrix(true, true);
    torch.getObjectByName('inspection-torch-emitter')?.getWorldPosition(world);
    if (!torchWorld.current) torchWorld.current = new THREE.Vector3();
    torchWorld.current.copy(world);
  }, [beamWork]);
  const label = useRef<HTMLDivElement>(null);
  const walker = useRef<THREE.Group>(null);
  const start = useRef(performance.now());
  useFrame(() => {
    const t = performance.now() - start.current;
    if (leave) {
      if (beam.current) beam.current.opacity = 0;
      if (label.current) label.current.style.opacity = '1';
      if (walker.current) walker.current.visible = t < LEAVE_DELAY + WALK;
      return;
    }
    if (inspectionRoot.current && torchWorld.current && beamMesh.current) {
      inspectionRoot.current.updateWorldMatrix(true, false);
      const hand = inspectionRoot.current.worldToLocal(beamWork.hand.copy(torchWorld.current));
      beamWork.direction.copy(hand).sub(beamWork.target);
      beamMesh.current.position.copy(hand).add(beamWork.target).multiplyScalar(.5);
      beamMesh.current.quaternion.setFromUnitVectors(beamWork.up, beamWork.direction.clone().normalize());
      beamMesh.current.scale.y = beamWork.direction.length();
    }
    const k = Math.max(0, Math.min(1, (t - WALK - 300) / 600));
    if (beam.current) beam.current.opacity = 0.22 * k;
    if (label.current) label.current.style.opacity = String(k);
  });
  // the torch beam: a cone from the hand, opening onto the damage
  const beamPose = useMemo(() => {
    const hand = new THREE.Vector3(to[0] - 0.06, floor + 0.3, to[2] - 0.05);
    const at = new THREE.Vector3(...spot);
    const dir = hand.clone().sub(at);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { mid: hand.clone().add(at).multiplyScalar(0.5), q, len: dir.length() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pier]);
  const red = pier === 'pier3';
  return (
    <group ref={inspectionRoot} name={`inspection-${pier}`}>
      <group ref={walker}>
        {leave ? (
          <Person inspection onInspectionTorchPosition={trackTorch} who={who} from={to} position={from} walkMs={WALK} delayMs={LEAVE_DELAY} pose="idle" facing={Math.atan2(from[0] - to[0], from[2] - to[2])} height={0.78} />
        ) : (
          <Person inspection onInspectionTorchPosition={trackTorch} who={who} from={from} position={to} walkMs={WALK} delayMs={300} pose="interact-right" facing={facing} height={0.78} />
        )}
      </group>
      <mesh ref={beamMesh} position={beamPose.mid} quaternion={beamPose.q} scale={[1, beamPose.len, 1]}>
        <coneGeometry args={[0.12, 1, 20, 1, true]} />
        <meshBasicMaterial ref={beam} color="#fff0c0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* the finding's name, to the left of the damage (the right of the screen belongs to the panels) */}
      <Html position={[d.x / S + DAMAGE_SHIFT - 0.45, d.y / S + 0.2, d.z / S]} zIndexRange={[30, 0]} style={{ pointerEvents: 'none', transform: 'translate(-100%, -50%)' }}>
        <div ref={label} className="marker-label" style={{ borderColor: red ? '#e2604c' : '#2bb3c8', opacity: 0 }}>
          <div className="marker-label__pier mono" style={{ color: red ? '#e2604c' : '#2bb3c8' }}>
            {red ? 'The crack' : 'The rust'}
          </div>
          <div className="marker-label__sub">{red ? 'Training crack · 0.12 mm' : 'Training corrosion · ~25% section loss'}</div>
        </div>
      </Html>
    </group>
  );
}

function Marker({ x, y, label, sub, color, delayMs, labelY = 5 }: { x: number; y: number; label: string; sub: string; color: string; delayMs: number; labelY?: number }) {
  const beam = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const start = useRef(performance.now() + delayMs);
  const html = useRef<HTMLDivElement>(null);
  useFrame(({ clock }) => {
    const k = Math.max(0, Math.min(1, (performance.now() - start.current) / 700));
    const e = 1 - Math.pow(1 - k, 3);
    if (beam.current) {
      beam.current.scale.set(1, e, 1);
      beam.current.visible = e > 0.001;
    }
    const phase = (clock.elapsedTime * 0.6) % 1;
    if (ring.current && ringMat.current) {
      ring.current.visible = k >= 1;
      const s = 1 + phase * 1.2;
      ring.current.scale.set(s, s, 1);
      ringMat.current.opacity = (1 - phase) * 0.8;
    }
    if (html.current) html.current.style.opacity = String(k);
  });
  return (
    <group position={[x, y, 0]}>
      <mesh ref={beam} visible={false} scale={[1, 0, 1]}>
        <cylinderGeometry args={[0.06, 0.06, 9, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]} visible={false}>
        <ringGeometry args={[0.3, 0.38, 40]} />
        <meshBasicMaterial ref={ringMat} color={color} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
      </mesh>
      <Html position={[0, labelY, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={html} className="marker-label" style={{ borderColor: color, opacity: 0 }}>
          <div className="marker-label__pier mono" style={{ color }}>{label}</div>
          <div className="marker-label__sub">{sub}</div>
        </div>
      </Html>
    </group>
  );
}
