import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ASSETS, project } from '../content/geo';
import { FlowArc } from './FlowArc';
import { Stack } from './SkyShapes';
import type { Vec3 } from './shots';

/** Lab 2 ideas on the sky stage after RAG (1.4 to 1.8). All positions are relative to the stage centre. */
export type Lab2Act = 'overflow' | 'note';

const ease = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
};
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const INK = '#e9eef2';
const TEAL = '#2bb3c8';
const RED = '#e2604c';
const AMBER = '#e2b23a';

/** a flat card with a title and lines, drawn on a canvas (crisp, lit like a screen) */
export function TextCard({ title, lines = [], tone = TEAL, width = 1.9, sticky = false, position, scale = 1 }: { title: string; lines?: string[]; tone?: string; width?: number; sticky?: boolean; position: Vec3; scale?: number }) {
  const W = 520;
  const H = 120 + lines.length * 54;
  const tex = useMemo(() => {
    const c = Object.assign(document.createElement('canvas'), { width: W, height: H });
    const g = c.getContext('2d')!;
    g.fillStyle = sticky ? '#f6e27a' : '#0f1823';
    g.fillRect(0, 0, W, H);
    g.fillStyle = tone;
    g.fillRect(0, 0, W, 10);
    g.fillStyle = sticky ? '#3a2f10' : INK;
    g.font = '600 38px "JetBrains Mono", monospace';
    g.fillText(title, 28, 74);
    g.font = '30px Inter, sans-serif';
    lines.forEach((l, i) => {
      const red = l.startsWith('!');
      g.fillStyle = red ? RED : sticky ? '#5a4a1a' : '#9fb0bf';
      const text = red ? l.slice(1) : l;
      g.fillText(text, 28, 126 + i * 54);
      if (red) {
        g.fillRect(28, 136 + i * 54, g.measureText(text).width, 4);
      }
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, lines.join('|'), tone, sticky]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[width, (width * H) / W]} />
      <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

const LAB2_SCALE = 1.5;
const O: Vec3 = [0, 0, 0];
/** a world point in the scaled stage's own units */
const local = (p: Vec3, center: Vec3): Vec3 => [(p[0] - center[0]) / LAB2_SCALE, (p[1] - center[1]) / LAB2_SCALE, (p[2] - center[2]) / LAB2_SCALE];

export function SkyLab2({ act, center, t, red, opsTop }: { act: Lab2Act; center: Vec3; t: number; red: string; opsTop: Vec3 }) {
  return (
    // drawn around the origin, then placed at the stage centre one and a half times larger so the cards read
    <group name={`sky-${act}`} position={center} scale={LAB2_SCALE}>
      {act === 'overflow' && <Overflow c={O} t={t} opsTop={local(opsTop, center)} />}
      {act === 'note' && <Note c={O} t={t} red={red} center={center} />}
    </group>
  );
}

/* 1.4 · one envelope is not enough: three questions at once overflow it; the ladder from chatbot to agent */
function Overflow({ c, t, opsTop }: { c: Vec3; t: number; opsTop: Vec3 }) {
  const env = add(c, [-1.6, 0.6, 0]);
  const qs = ['What is this asset?', 'What is connected to it?', 'What happened before?'];
  // the envelope swells and shakes as the questions pile in (1.2 s - 2.6 s)
  const strain = ease((t - 1200) / 1400);
  const shake = t > 1600 && t < 3200 ? Math.sin(t / 40) * 0.04 * strain : 0;
  return (
    <group>
      {qs.map((q, i) => {
        const k = ease((t - 300 - i * 350) / 900);
        // each question rises from the Ops Center and stops around the envelope, unable to fit in
        const stop = add(env, [(i - 1) * 1.3, 1.3 + (i % 2) * 0.4, 0.1]);
        const p: Vec3 = [opsTop[0] + (stop[0] - opsTop[0]) * k, opsTop[1] + (stop[1] - opsTop[1]) * k, opsTop[2] + (stop[2] - opsTop[2]) * k];
        return <TextCard key={q} title={q} tone={RED} width={1.9} position={p} scale={Math.max(0.001, k)} />;
      })}
      <group position={[env[0] + shake, env[1], env[2]]} scale={[1 + strain * 0.25, 1 + strain * 0.18, 1]}>
        <mesh>
          <boxGeometry args={[1.15, 0.78, 0.08]} />
          <meshStandardMaterial color="#f4f1ea" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.1, 0.05]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.62, 0.62, 0.01]} />
          <meshStandardMaterial color="#e6dfd0" roughness={0.8} />
        </mesh>
      </group>
      <TextCard title="one envelope · one question" tone={TEAL} width={1.6} position={add(env, [0, -0.85, 0])} scale={ease((t - 2200) / 600) || 0.001} />
      {/* the ladder: four steps rising to the right, the agent at the top */}
      {['Chatbot', 'RAG', 'Workflow', 'Agent'].map((s, i) => {
        const k = ease((t - 2800 - i * 300) / 600);
        const h = 0.45 + i * 0.55;
        return (
          <group key={s} position={add(c, [1.0 + i * 0.95, -1.6 + h / 2, 0])} scale={[1, Math.max(0.001, k), 1]}>
            <mesh>
              <boxGeometry args={[0.85, h, 0.5]} />
              <meshStandardMaterial color={i === 3 ? RED : i === 0 ? '#9aa1aa' : '#1B8A9C'} roughness={0.6} />
            </mesh>
            <TextCard title={s} tone={i === 3 ? RED : TEAL} width={0.85} position={[0, h / 2 + 0.22, 0.26]} />
          </group>
        );
      })}
    </group>
  );
}

/* 1.8 · a sticky note: one row in store_incident, keyed to Harbor Bridge, embedded on write */
function Note({ c, t, red, center }: { c: Vec3; t: number; red: string; center: Vec3 }) {
  const db = add(c, [0.6, -1.2, 0]);
  const k = ease((t - 500) / 1600);
  const from = add(c, [-1.6, 2.2, 0.3]);
  const at = add(db, [0, 1.25, 0.2]);
  const p: Vec3 = [from[0] + (at[0] - from[0]) * k, from[1] + (at[1] - from[1]) * k, from[2] + (at[2] - from[2]) * k];
  const hb = ASSETS.find((a) => a.id === 'Harbor Bridge')!;
  const hbp = project(hb.lat, hb.lon);
  return (
    <group>
      <group position={db}>
        <Stack red={red} t={9999} />
      </group>
      <group position={p} rotation={[0, 0, (1 - k) * 0.3]}>
        <TextCard title="store_incident" lines={['Harbor Bridge · the crack', 'one row · embedded on write']} sticky tone={AMBER} width={1.8} position={[0, 0, 0]} />
      </group>
      {/* the note's only link: a thin line to Harbor Bridge */}
      {t > 2300 && <FlowArc from={add(db, [0, 0.3, 0])} to={local([hbp.x, 1.1, hbp.z], center)} lift={1} radius={0.02} durationMs={1500} persist color={TEAL} />}
      <TextCard title="a thin memory" lines={['one sentence per incident']} tone={TEAL} width={1.6} position={add(c, [-2.6, -0.6, 0])} scale={ease((t - 3000) / 600) || 0.001} />
    </group>
  );
}
