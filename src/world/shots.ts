import type { ShotId } from '../engine/types';
import { assetPosition } from '../content/geo';
import { BRIDGE, fromBridgeLocal } from './bridgeFrame';

export type Vec3 = [number, number, number];

export interface Shot {
  position: Vec3;
  target: Vec3;
  durationMs: number;
  ease?: 'inOut' | 'out';
  /** the place this shot is about; tests check it stays on screen, left of the panel */
  subject?: Vec3;
  /** after arriving, wait `delayMs` and then ease in slowly to this closer view (e.g. once the inspector reaches the damage) */
  push?: { position: Vec3; target: Vec3; delayMs: number; durationMs: number };
}

/**
 * A camera that looks at `subject` from the south (north is always up the screen, so moving between
 * places reads as travelling across one map), `pitchDeg` below level, `dist` away, turned `headingDeg`
 * east of north. `screenX` slides the subject left (negative) to keep it clear of the right-hand panel;
 * `lead` aims that far beyond the subject, which drops it lower in the frame (the city rises behind it).
 */
export function northShot(subject: Vec3, dist: number, pitchDeg: number, screenX: number, durationMs: number, headingDeg = 0, lead = 0): Shot {
  const p = (pitchDeg * Math.PI) / 180;
  const hd = (headingDeg * Math.PI) / 180;
  const f = [Math.sin(hd), -Math.cos(hd)];
  const r = [Math.cos(hd), Math.sin(hd)];
  const tanX = Math.tan((22.5 * Math.PI) / 180) * (16 / 9);
  const ox = screenX * dist * tanX;
  const target: Vec3 = [subject[0] - r[0] * ox + f[0] * lead, subject[1], subject[2] - r[1] * ox + f[1] * lead];
  const back = dist * Math.cos(p);
  const position: Vec3 = [target[0] - f[0] * back, target[1] + dist * Math.sin(p), target[2] - f[1] * back];
  return { position, target, durationMs, ease: 'inOut', subject };
}

// The five places of the story (and the opening). Every city camera looks roughly north, and every frame
// shows only city:
// tests/world/frame.test.ts checks all four corners of every page and every move between pages.
const OPS = assetPosition('City Operations Control Center');
const HB = fromBridgeLocal(0, 0);
const PIER3 = fromBridgeLocal(BRIDGE.platform.x, BRIDGE.platform.z);
const PIER2 = fromBridgeLocal(BRIDGE.piers[1], 0);
const CRACK = fromBridgeLocal(BRIDGE.damage.crack.x, BRIDGE.damage.crack.z);
const RUST = fromBridgeLocal(BRIDGE.damage.corrosion.x, BRIDGE.damage.corrosion.z);

/** a shot that, once there, pushes in slowly to `close` */
function withPush(shot: Shot, close: Shot, delayMs: number, durationMs = 2600): Shot {
  return { ...shot, push: { position: close.position, target: close.target, delayMs, durationMs } };
}

export const SHOTS: Record<ShotId, Shot> = {
  /** the opening: low over the river by the bridge, before rising over the city */
  arrive: northShot([HB.x, 0.3, HB.z], 10, 36, 0, 0, 0, 2),
  /** the city: ICONSIAM across the river, the Silom and Sathorn towers, the Ops Center; low enough that the towers show their sides */
  city: northShot([-26, 0, -36], 30, 44, 0, 2600, -15),
  /** the sky stage over the Ops Center, where the AI ideas are explained (SkyStage.tsx), the Ops Center below */
  // lower and more forward than the city cameras so the stage is seen from the side; the haze shows at the top
  sky: northShot([OPS.x, 9, OPS.z], 17, 22, -0.18, 2200, -20, -1),
  /** close on the control room over the Ops Center (OpsRoom.tsx, floor at y 2.6): over the operators' shoulders to the video wall */
  ops: northShot([OPS.x, 3.3, OPS.z - 0.4], 9, 36, -0.38, 2200, -8),
  /** Harbor Bridge whole, low in the frame, the city behind it */
  bridge: northShot([HB.x, 0.3, HB.z], 14, 42, -0.1, 2200, 0, 2.8),
  /** Pier 3 and its maintenance platform: the inspector, the crack (Lab 2); left of the question bubble */
  // arrive on Pier 3, then close in on the crack once the inspector has walked up to it
  pier3: withPush(northShot([PIER3.x, BRIDGE.platform.y, PIER3.z], 3.8, 42, -0.4, 2200), northShot([CRACK.x - 0.02, BRIDGE.damage.crack.y, CRACK.z], 0.75, 24, -0.32, 0, 10), 900),
  /** Pier 2: the corrosion, Mercer and Vance (Lab 3) */
  pier2: northShot([PIER2.x, 0.2, PIER2.z], 3.8, 42, -0.1, 1800),
  /** Pier 2 when someone inspects it: arrive, then close in on the corrosion */
  'pier2-inspect': withPush(northShot([PIER2.x, 0.2, PIER2.z], 3.8, 42, -0.1, 1800), northShot([RUST.x - 0.02, BRIDGE.damage.corrosion.y, RUST.z], 0.75, 24, -0.32, 0, 10), 1200),
  /** Pier 2 already closed in on the corrosion (where 'pier2-inspect' ends): the pages after it hold here, no pull-back */
  'pier2-close': northShot([RUST.x - 0.02, BRIDGE.damage.corrosion.y, RUST.z], 0.75, 24, -0.32, 1400, 10),
  'core-dive': { position: [30, 60, 560], target: [-20, -96, -10], durationMs: 2500, ease: 'inOut' },
  'core-face-tables': { position: [-250, -120, 270], target: [-270, -180, 0], durationMs: 1400, ease: 'inOut' },
  'core-face-json': { position: [-125, -120, 270], target: [-145, -180, 0], durationMs: 1400, ease: 'inOut' },
  'core-face-graph': { position: [150, -40, 430], target: [80, -125, -20], durationMs: 1400, ease: 'inOut' },
  'core-face-vectors': { position: [250, -120, 270], target: [230, -178, 0], durationMs: 1400, ease: 'inOut' },
  'vector-field': { position: [185, -130, 230], target: [170, -180, 0], durationMs: 1600, ease: 'inOut' },
};

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** a camera pose as orbit parameters about its target: distance, compass yaw, pitch above the target */
function orbit(s: { position: Vec3; target: Vec3 }) {
  const o = [s.position[0] - s.target[0], s.position[1] - s.target[1], s.position[2] - s.target[2]];
  const d = Math.max(1e-6, Math.hypot(o[0], o[1], o[2]));
  return { d, yaw: Math.atan2(o[0], o[2]), pitch: Math.asin(Math.max(-1, Math.min(1, o[1] / d))) };
}

/**
 * How far a move must rise mid-way: when the targets are far apart compared with how close the camera
 * is, it climbs (like a map app's fly-to) so the ground never streams past faster than it can be read.
 */
function climb(a: { d: number }, b: { d: number }, travel: number): number {
  const base = Math.sqrt(a.d * b.d);
  const want = travel * 0.4;
  return want > base ? Math.log(want / base) : 0;
}

/** fraction of the integral of f over [0, 1] reached at x (trapezoid, 48 steps) */
function sweep(f: (x: number) => number, x: number): number {
  const N = 48;
  let total = 0;
  let upto = 0;
  let prev = f(0);
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    const cur = f(u);
    const area = ((prev + cur) / 2) / N;
    if (u <= x) upto += area;
    else if (u - 1 / N < x) upto += area * ((x - (u - 1 / N)) * N);
    total += area;
    prev = cur;
  }
  return total > 0 ? upto / total : x;
}

/**
 * Camera between two poses. Interpolates in orbit space around a moving target (target eased, distance
 * on a log scale with a climb for long trips, yaw the short way round, pitch tilting down while high),
 * so zooms feel even and the view never whips round.
 */
export function interpolateShot(a: Shot, b: Shot, t: number): { position: Vec3; target: Vec3 } {
  if (t <= 0) return { position: [...a.position] as Vec3, target: [...a.target] as Vec3 };
  if (t >= 1) return { position: [...b.position] as Vec3, target: [...b.target] as Vec3 };
  // sine in-out: its fastest moment is ~1.6x the average speed (the cubic's is 3x), so nothing lurches
  const k = b.ease === 'out' ? easeOut(t) : 0.5 - 0.5 * Math.cos(Math.PI * t);
  const A = orbit(a);
  const B = orbit(b);
  const travel = Math.hypot(b.target[0] - a.target[0], b.target[2] - a.target[2]);
  const up = climb(A, B, travel);
  const bump = Math.sin(Math.PI * k);
  const distAt = (kk: number) => Math.exp(Math.log(A.d) + (Math.log(B.d) - Math.log(A.d)) * kk + up * Math.sin(Math.PI * kk));
  const d = distAt(k);
  let dy = B.yaw - A.yaw;
  if (dy > Math.PI) dy -= 2 * Math.PI;
  if (dy < -Math.PI) dy += 2 * Math.PI;
  const yaw = A.yaw + dy * k;
  // while high up, tilt towards looking down so the frame stays on the city
  const lerpPitch = A.pitch + (B.pitch - A.pitch) * k;
  const highPitch = (62 * Math.PI) / 180;
  const tilt = up > 0 ? Math.min(1, up / 1.5) * bump : 0;
  const pitch = lerpPitch + Math.max(0, highPitch - lerpPitch) * tilt;
  // the target slides in proportion to how far away the camera is (slow while close, fast while high),
  // so the scene's apparent speed stays even: integral of distance over the eased progress
  const kt = travel > 1e-6 ? sweep(distAt, k) : k;
  const target: Vec3 = [
    a.target[0] + (b.target[0] - a.target[0]) * kt,
    a.target[1] + (b.target[1] - a.target[1]) * kt,
    a.target[2] + (b.target[2] - a.target[2]) * kt,
  ];
  const cp = Math.cos(pitch);
  return {
    position: [target[0] + Math.sin(yaw) * cp * d, target[1] + Math.sin(pitch) * d, target[2] + Math.cos(yaw) * cp * d],
    target,
  };
}

/** limits for a calm move (owner, 24 Oct: the bridge <-> Ops Center moves were dizzying) */
export const CALM = { flow: 0.8, zoom: 1.0, turnDeg: 40 };

/**
 * How long a move takes: long enough that the ground never slides sideways faster than CALM.flow
 * (radians per second, as seen from the camera), the zoom never runs faster than CALM.zoom (e-folds per
 * second) and the view never turns faster than CALM.turnDeg. Measured on the path itself; never less
 * than the page's own time or 1.4 s, never more than 6 s.
 */
export function moveDuration(a: { position: Vec3; target: Vec3 }, b: Shot): number {
  const A: Shot = { position: a.position, target: a.target, durationMs: 0 };
  const N = 80;
  let flow = 0;
  let zoom = 0;
  let turn = 0;
  let p = interpolateShot(A, b, 0);
  for (let i = 1; i <= N; i++) {
    const q = interpolateShot(A, b, i / N);
    const dv = [q.target[0] - q.position[0], q.target[1] - q.position[1], q.target[2] - q.position[2]];
    const d = Math.hypot(dv[0], dv[1], dv[2]) || 1e-6;
    const pv = [p.target[0] - p.position[0], p.target[1] - p.position[1], p.target[2] - p.position[2]];
    const pd = Math.hypot(pv[0], pv[1], pv[2]) || 1e-6;
    const mv = [q.position[0] - p.position[0], q.position[1] - p.position[1], q.position[2] - p.position[2]];
    const along = (mv[0] * dv[0] + mv[1] * dv[1] + mv[2] * dv[2]) / d;
    const lat = Math.hypot(mv[0] - (dv[0] / d) * along, mv[1] - (dv[1] / d) * along, mv[2] - (dv[2] / d) * along);
    // per unit of t; divided by the duration later
    flow = Math.max(flow, (lat / d) * N);
    zoom = Math.max(zoom, Math.abs(Math.log(d / pd)) * N);
    turn = Math.max(turn, Math.acos(Math.max(-1, Math.min(1, (dv[0] * pv[0] + dv[1] * pv[1] + dv[2] * pv[2]) / (d * pd)))) * N);
    p = q;
  }
  const need = Math.max(flow / CALM.flow, zoom / CALM.zoom, turn / ((CALM.turnDeg * Math.PI) / 180)) * 1000;
  return Math.round(Math.min(6000, Math.max(1400, b.durationMs, need)));
}
