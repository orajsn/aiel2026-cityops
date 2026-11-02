import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { useUiStore } from '../engine/ui';
import { useGraphicsStore } from '../engine/graphics';
import { BRIDGE, BRIDGE_S, DECK_T, DECK_W, DECK_Y, harborBridgeFrame } from './bridgeFrame';
import { Person, type Who } from './Person';
import type { Vec3 } from './shots';
import { Lab1Story, type Lab1Kind } from './Lab1Story';

/** structure scale: the map is real scale (1 unit ~ 108 m); the bridge is drawn a few times larger than life so it reads */
const S = BRIDGE_S;
/**
 * Pylon height above the deck, structure units (owner, 29 Oct: the pylons stood ~300 m tall, twice the tallest
 * tower beside the bridge). Now the tops are ~0.92 world units (~100 m) above the water: under the riverside
 * condos (0.3 to 1.4 units on the city model within 4 units of the bridge), so the city still reads taller.
 */
export const PYLON_H = 2.6;

const CONCRETE = '#d9d4c9';
const DECK = '#8d93a0';
const RAIL = '#f1ece2';
const STEEL = '#e9e2d2';

/**
 * Harbor Bridge, built for close-ups: a straight deck between the banks with ramps down to the
 * streets, kerbs and railings, lamp posts, two pylons with cable fans, piers with caps in the water,
 * inspection platforms on Pier 3 and Pier 2 with the damage on the pier faces, the inspector, and
 * the two incident markers. Always part of the city; `inspect` and `markers` only add the story props.
 */
export function HarborBridge({ inspect, markers = false, lab1 }: { inspect?: { pier: 'pier3' | 'pier2'; who: Who; leave?: boolean }; markers?: boolean | 'pier2'; lab1?: Lab1Kind }) {
  const f0 = useMemo(() => harborBridgeFrame(), []);
  // work in structure units inside a group scaled by S, so spans still match the world
  const f = useMemo(() => ({ ...f0, water: f0.water / S, ramp: f0.ramp / S }), [f0]);
  const theme = useUiStore((s) => s.theme);
  // Bhumibol preview (Settings): its own deck, towers and cables stand here; Pier 3 and Pier 2 keep the story
  const preview = useGraphicsStore((s) => s.bridge === 'bhumibol');

  // six piers across the water, numbered 1..6 from the west bank; Pier 3 and Pier 2 carry the story.
  // Layout (world units) lives in BRIDGE so the boats can keep to the open channel.
  const piers = BRIDGE.piers.map((x) => x / S);
  const pier3 = piers[2];
  const pier2 = piers[1];
  const pylons = BRIDGE.pylonPiers.map((i) => piers[i]);

  const cables = useMemo(() => {
    const out: [number, number, number][][] = [];
    for (const px of pylons) {
      for (let i = 1; i <= 7; i++) {
        const dx = 0.5 + i * ((f.water * 0.3) / 7);
        for (const sgn of [-1, 1]) {
          out.push([
            // anchors spread down the pylon's upper part: the outermost cable from the top
            [px, DECK_Y + PYLON_H - 0.25 - (7 - i) * ((PYLON_H * 0.55) / 7), 0],
            [px + sgn * dx, DECK_Y + DECK_T / 2, 0],
          ]);
        }
      }
    }
    return out;
  }, [f.water]);

  const lamps = useMemo(() => {
    const out: number[] = [];
    for (let x = -f.water + 1.5; x < f.water; x += 2.6) out.push(x);
    return out;
  }, [f.water]);

  const rampLen = f.ramp;
  // each ramp's top surface runs from the deck down to the map's ground at its foot
  const deckTop = DECK_Y + DECK_T / 2;
  const ramps = ([-1, 1] as const).map((s) => {
    // flush with the map's road at the foot (a hair above it, so the photo road does not show through)
    const footTop = (s < 0 ? BRIDGE.footY.west : BRIDGE.footY.east) / S + 0.005;
    const drop = deckTop - footTop;
    // two columns carry each ramp where it is still well above the street
    const columns = [0.3, 0.62].map((k) => ({ x: s * (f.water + k * rampLen), top: deckTop - k * drop - DECK_T, bottom: footTop - 1.2 }));
    return { s, len: Math.hypot(rampLen, drop), angle: Math.atan2(drop, rampLen), midTop: (deckTop + footTop) / 2, columns };
  });

  return (
    <group position={[f.x, 0, f.z]} rotation={[0, f.yaw, 0]} scale={S} name="harbor-bridge">
      {!preview && (
        <>
      {/* deck over water */}
      <mesh position={[0, DECK_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[f.water * 2, DECK_T, DECK_W]} />
        <meshStandardMaterial color={DECK} roughness={1} />
      </mesh>
      {/* kerbs and railings */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[0, DECK_Y + DECK_T / 2 + 0.06, s * (DECK_W / 2 - 0.14)]}>
            <boxGeometry args={[f.water * 2, 0.12, 0.28]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
          <mesh position={[0, DECK_Y + DECK_T / 2 + 0.5, s * (DECK_W / 2 - 0.08)]}>
            <boxGeometry args={[f.water * 2, 0.05, 0.05]} />
            <meshStandardMaterial color={RAIL} roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* ramps on both banks, descending to street level */}
      {ramps.flatMap(({ s, columns }) =>
        columns.map((c, i) => (
          <mesh key={`rc${s}${i}`} position={[c.x, (c.top + c.bottom) / 2, 0]} castShadow>
            <boxGeometry args={[0.5, c.top - c.bottom, DECK_W * 0.55]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
        )),
      )}
      {ramps.map(({ s, len, angle, midTop }) => (
        <group key={`r${s}`} position={[s * (f.water + rampLen / 2), midTop - DECK_T / 2, 0]} rotation={[0, 0, -s * angle]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[len, DECK_T, DECK_W]} />
            <meshStandardMaterial color={DECK} roughness={1} />
          </mesh>
          {/* kerbs stop short of the foot so the ramp runs out flat onto the street */}
          {[-1, 1].map((k) => (
            <mesh key={k} position={[-s * len * 0.12, DECK_T / 2 + 0.06, k * (DECK_W / 2 - 0.14)]}>
              <boxGeometry args={[len * 0.76, 0.12, 0.28]} />
              <meshStandardMaterial color={CONCRETE} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {/* lamp posts */}
      {lamps.map((x, i) => (
        <group key={i} position={[x, DECK_Y + DECK_T / 2, (i % 2 ? 1 : -1) * (DECK_W / 2 - 0.3)]}>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.1, 6]} />
            <meshStandardMaterial color={RAIL} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#fff2c8" toneMapped={false} />
          </mesh>
        </group>
      ))}
        </>
      )}
      {/* piers: shaft in the water with a cap under the deck */}
      {piers.map((x, i) => (preview && x !== pier3 && x !== pier2 ? null : (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, (DECK_Y - 0.3) / 2 - 0.4, 0]} castShadow>
            <boxGeometry args={[BRIDGE.pierW / S, DECK_Y - 0.3 + 0.8, BRIDGE.pierD / S]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
          <mesh position={[0, DECK_Y - 0.3, 0]} castShadow>
            <boxGeometry args={[1.1, 0.24, DECK_W + 0.2]} />
            <meshStandardMaterial color={CONCRETE} roughness={1} />
          </mesh>
        </group>
      )))}
      {!preview && (
        <>
      {/* pylons: two legs each side of the deck, joined above */}
      {pylons.map((x, i) => (
        <group key={`p${i}`} position={[x, 0, 0]}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0, (DECK_Y + PYLON_H) / 2 - 0.4, s * (DECK_W / 2 + 0.25)]} castShadow>
              <boxGeometry args={[0.5, DECK_Y + PYLON_H + 0.8, 0.36]} />
              <meshStandardMaterial color={STEEL} roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, DECK_Y + PYLON_H - 0.2, 0]} castShadow>
            <boxGeometry args={[0.55, 0.5, DECK_W + 0.9]} />
            <meshStandardMaterial color={STEEL} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {cables.map((pts, i) => (
        <Line key={i} points={pts} color="#f3ead6" lineWidth={1} />
      ))}
        </>
      )}
      {/* inspection platforms bolted to the camera-side faces of Pier 3 and Pier 2, railing on three open sides */}
      {BRIDGE.platforms.map((p, i) => (
        <group key={i} position={[p.x / S, p.y / S, p.z / S]}>
          <mesh castShadow>
            <boxGeometry args={[p.w / S, 0.08, p.d / S]} />
            <meshStandardMaterial color="#b9bcc4" roughness={1} />
          </mesh>
          {/* an open hip-height rail (posts and a top bar), so the pier face behind stays in view */}
          {[[-1, 0], [1, 0], [0, 1]].map(([sx, sz], j) => (
            <mesh key={j} position={[(sx * p.w) / S / 2, 0.27, (sz * p.d) / S / 2]}>
              <boxGeometry args={[sx === 0 ? p.w / S : 0.025, 0.025, sz === 0 ? p.d / S : 0.025]} />
              <meshStandardMaterial color="#e2b23a" roughness={0.8} />
            </mesh>
          ))}
          {[[-1, -1], [-1, 1], [1, -1], [1, 1], [0, 1]].map(([sx, sz], j) => (
            <mesh key={`post${j}`} position={[(sx * p.w) / S / 2, 0.14, (sz * p.d) / S / 2]}>
              <boxGeometry args={[0.025, 0.27, 0.025]} />
              <meshStandardMaterial color="#e2b23a" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      {/* the damage is always there; it glows when the story is about it */}
      <Crack alert={markers === true || inspect?.pier === 'pier3' || lab1 === 'crack'} />
      <Corrosion alert={!!markers || inspect?.pier === 'pier2'} />
      {lab1 && <Lab1Story kind={lab1} pier3={pier3} />}
      {inspect && <Inspection key={`${inspect.pier}-${inspect.who}${inspect.leave ? '-leave' : ''}`} pier={inspect.pier} who={inspect.who} leave={!!inspect.leave} />}
      {markers === true && (
        <>
          <Marker x={pier3} y={DECK_Y} label="The crack" sub="Lab 2 · this afternoon" color={theme.red} delayMs={1800} labelY={10} />
          <Marker x={pier2} y={DECK_Y} label="The rust" sub="Lab 3 · next session" color={theme.data} delayMs={3000} labelY={3.2} />
        </>
      )}
      {/* 2.0: only the problem Lab 3 comes back for */}
      {markers === 'pier2' && <Marker x={pier2} y={DECK_Y} label="The rust" sub="Lab 3 · still open" color={theme.data} delayMs={900} labelY={3.2} />}
    </group>
  );
}

/** structure-unit position of a piece of damage, a hair in front of the pier face */
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
    <group name={`inspection-${pier}`}>
      <group ref={walker}>
        {leave ? (
          <Person who={who} from={to} position={from} walkMs={WALK} delayMs={LEAVE_DELAY} pose="idle" facing={Math.atan2(from[0] - to[0], from[2] - to[2])} height={0.48} />
        ) : (
          <Person who={who} from={from} position={to} walkMs={WALK} delayMs={300} pose="interact-right" facing={facing} height={0.48} />
        )}
      </group>
      <mesh position={beamPose.mid} quaternion={beamPose.q}>
        <coneGeometry args={[0.12, beamPose.len, 20, 1, true]} />
        <meshBasicMaterial ref={beam} color="#fff0c0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* the finding's name, to the left of the damage (the right of the screen belongs to the panels) */}
      <Html position={[d.x / S + DAMAGE_SHIFT - 0.45, d.y / S + 0.2, d.z / S]} zIndexRange={[30, 0]} style={{ pointerEvents: 'none', transform: 'translate(-100%, -50%)' }}>
        <div ref={label} className="marker-label" style={{ borderColor: red ? '#e2604c' : '#2bb3c8', opacity: 0 }}>
          <div className="marker-label__pier mono" style={{ color: red ? '#e2604c' : '#2bb3c8' }}>
            {red ? 'The crack' : 'The rust'}
          </div>
          <div className="marker-label__sub">{red ? 'hairline crack · 0.12 mm' : 'surface corrosion · ~25% section loss'}</div>
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
