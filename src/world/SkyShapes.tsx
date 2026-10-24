import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { DataShape } from './DataShapes';
import { SILO_LAYOUT, cardGeometry } from './BridgeQuestion';
import { BOARD, BOARD_DEPTH, STACK_AT, boardPoint, fitShape, type Panel } from './answerBoard';
import { useSceneStore } from '../engine/store';
import { SHOTS } from './shots';
import type { Vec3 } from './shots';

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};
const slide = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** when each piece lands in its panel, ms after the camera settles (the panel names in CoreCaption follow it) */
export const LAND_MS = (i: number) => 2100 + i * 350;

/**
 * 0.5 · the answer. Four panels around one Oracle AI Database, framed from the sky camera: each piece of
 * data the inspector's question needs flies up from its separate place by the bridge (0.4) into its own
 * panel, where it plays. Everything stays inside its panel; the words are drawn over the shapes, never
 * behind a panel. Drawn outside the sky stage's grow-in, in world units: each piece starts exactly where and
 * how 0.4 left it (same size, same angle), and 0.4's panels fade rather than vanish, so the hand-over does not blink.
 */
export function SkyShapes({ red }: { red: string }) {
  const settled = useSceneStore((s) => s.settled);
  const t0 = useRef<number | null>(null);
  const clock = useRef(0);
  const cam = SHOTS.sky;
  // every shape faces the sky camera, square to the screen
  const facing = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(new THREE.Vector3(...cam.position), new THREE.Vector3(...cam.target), new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, [cam]);
  const stack = boardPoint(STACK_AT.x, STACK_AT.y);
  const [dbT, setDbT] = useState(0);
  const mounted = useRef(performance.now());
  const leaving = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const oldCards = useMemo(() => SILO_LAYOUT().cards.map(cardGeometry), []);
  useFrame(() => {
    if (settled && t0.current === null) t0.current = performance.now();
    clock.current = t0.current === null ? 0 : performance.now() - t0.current;
    if (clock.current < 1200) setDbT(clock.current);
    // 0.4's panels fade out as the camera leaves the bridge
    const fade = 0.93 * (1 - ease((performance.now() - mounted.current) / 700));
    leaving.current.forEach((m) => m && (m.opacity = fade));
  });
  return (
    <group name="answer-board">
      {oldCards.map((g, i) => (
        <mesh key={i} geometry={g} renderOrder={5}>
          <meshBasicMaterial ref={(m) => (leaving.current[i] = m)} color="#f7f5f1" transparent opacity={0.93} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      <group position={stack} quaternion={facing} scale={0.62}>
        <Stack red={red} t={settled ? dbT : 0} />
      </group>
      {BOARD.map((p, i) => (
        <PanelPiece key={p.kind} p={p} i={i} clock={clock} facing={facing} stack={stack} />
      ))}
    </group>
  );
}

function PanelPiece({ p, i, clock, facing, stack }: { p: Panel; i: number; clock: { current: number }; facing: THREE.Quaternion; stack: Vec3 }) {
  const fit = useMemo(() => fitShape(p.kind, p), [p]);
  // exactly how the piece sat on 0.4, in its own panel beside the bridge
  const from = useMemo(() => {
    const l = SILO_LAYOUT();
    return { at: l.fits[i].origin, scale: l.fits[i].scale, q: l.facing };
  }, [i]);
  // the panel: a solid card behind the shape (deeper than any part of it), the same rectangle on screen
  const card = useMemo(() => {
    const d = BOARD_DEPTH + 1.2;
    const c = [boardPoint(p.x0, p.y1, d), boardPoint(p.x1, p.y1, d), boardPoint(p.x1, p.y0, d), boardPoint(p.x0, p.y0, d)];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(c.flat(), 3));
    g.setIndex([0, 3, 1, 1, 3, 2]);
    return g;
  }, [p]);
  // the link from the database to the panel's inner edge
  const link = useMemo<[Vec3, Vec3]>(() => {
    const inner = p.x0 > 0 ? p.x0 : p.x1;
    return [stack, boardPoint(inner, (p.y0 + p.y1) / 2)];
  }, [p, stack]);
  const g = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const linkRef = useRef<THREE.Group>(null);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const [landed, setLanded] = useState(false);
  useFrame(() => {
    const t = clock.current;
    const k = slide((t - 300 - i * 350) / 1800);
    const o = fit.origin;
    const f = from.at;
    if (g.current) {
      g.current.position.set(f[0] + (o[0] - f[0]) * k, f[1] + (o[1] - f[1]) * k + Math.sin(Math.PI * k) * 1.5, f[2] + (o[2] - f[2]) * k);
      g.current.scale.setScalar(Math.max(0.001, from.scale + (fit.scale - from.scale) * k));
      g.current.quaternion.copy(q.copy(from.q).slerp(facing, k));
    }
    if (mat.current) mat.current.opacity = 0.96 * ease((t - LAND_MS(i) + 500) / 500);
    if (linkRef.current) linkRef.current.visible = t > LAND_MS(i);
    // the vectors start their search once they have landed (the other shapes play from the start, never restart)
    const on = t > LAND_MS(i);
    if (on !== landed) setLanded(on);
  });
  return (
    <group>
      <mesh geometry={card} renderOrder={1}>
        <meshBasicMaterial ref={mat} color="#f7f5f1" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={linkRef} visible={false}>
        <Line points={link} color="#1B8A9C" lineWidth={1.6} transparent opacity={0.75} />
      </group>
      <group ref={g} position={from.at} quaternion={from.q} scale={from.scale}>
        <DataShape kind={p.kind} lit={p.kind !== 'vectors'} title={false} story search={landed} />
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
