import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { DECK_Y } from './bridgeFrame';
import { FlowArc } from './FlowArc';
import type { Vec3 } from './shots';

/**
 * Lab 1's first three pages on the real bridge (owner, 2 Nov: "use the same bridge", the storyboard's slides 1 to 3):
 * the project manager walks the deck to the crack, the repair is planned (a delivery route lights from the steel supplier
 * to the work, the engineer's office joins), the technician frames one photo of the steel and it travels to the bridge.
 * Drawn in HarborBridge's structure units, on its deck. The people are icon markers anchored in 3D (they stay on the
 * bridge when the camera moves); every beat is 2.3 s, the same clock the page's step card runs on (Lab1Story.tsx in the overlay).
 */
export type Lab1Kind = 'crack' | 'plan' | 'capture';
export const BEAT_MS = 2300;

const TEAL = '#1B8A9C';
const GREY = '#8a919c';
const AMBER = '#e0a21b';
const RED = '#e2604c';
const ICONS: Record<string, string> = {
  hat: '<path d="M-15 4a15 13 0 0 1 30 0v3h-30z" fill="C"/><rect x="-18" y="6" width="36" height="5" rx="2" fill="C"/>',
  steel: '<path d="M-14 -6h28M-14 2h28M-14 10h28M-8 -12v28M8 -12v28" stroke="C" stroke-width="2.4" fill="none"/>',
  cam: '<rect x="-13" y="-8" width="26" height="18" rx="3" fill="none" stroke="C" stroke-width="2.4"/><circle cx="0" cy="1" r="5" fill="none" stroke="C" stroke-width="2.4"/><path d="M-6 -8l2-4h8l2 4" fill="none" stroke="C" stroke-width="2.4"/>',
  shield: '<path d="M0 -14l12 4v9c0 8-6 12-12 15-6-3-12-7-12-15v-9z M-5 1l4 4 7-8" fill="none" stroke="C" stroke-width="2.4"/>',
};

/** a round icon marker, anchored at a point on the bridge (screen-sized, so it reads at the wide view) */
function Chip({ kind, color = TEAL, label, sub, labelSide = 'right' }: { kind: keyof typeof ICONS; color?: string; label?: string; sub?: string; labelSide?: 'left' | 'right' }) {
  return (
    <div className="l1-chip" data-l1-chip={kind} style={{ borderColor: color }}>
      <svg viewBox="-30 -30 60 60" width={56} height={56} aria-hidden dangerouslySetInnerHTML={{ __html: ICONS[kind].replace(/"C"/g, `"${color}"`) }} />
      {label && (
        <div className={`marker-label l1-chip__tag l1-chip__tag--${labelSide}`} style={{ borderColor: color }}>
          <div className="marker-label__pier mono" style={{ color }}>{label}</div>
          {sub && <div className="marker-label__sub">{sub}</div>}
        </div>
      )}
    </div>
  );
}

const ease = (k: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 3);

/** a marker that walks along the deck from `from` to `to` (x only), then stays; `appearMs` hides it before that */
function Walker({ kind, color, from, to, y, z, startMs = 0, walkMs, appearMs = 0, label, sub, labelSide }: { kind: keyof typeof ICONS; color?: string; from: number; to: number; y: number; z: number; startMs?: number; walkMs: number; appearMs?: number; label?: string; sub?: string; labelSide?: 'left' | 'right' }) {
  const g = useRef<THREE.Group>(null);
  const t0 = useRef(performance.now());
  useFrame(() => {
    const t = performance.now() - t0.current;
    if (!g.current) return;
    g.current.visible = t >= appearMs;
    g.current.position.set(from + (to - from) * ease((t - startMs) / walkMs), y, z);
  });
  return (
    <group ref={g} position={[from, y, z]} visible={appearMs === 0}>
      <Html center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <Chip kind={kind} color={color} label={label} sub={sub} labelSide={labelSide} />
      </Html>
    </group>
  );
}

/** a marker that changes colour at `atMs` (the engineer's office joins the plan) */
function Switch({ kind, x, y, z, atMs, label, sub, labelSide }: { kind: keyof typeof ICONS; x: number; y: number; z: number; atMs: number; label: string; sub: string; labelSide?: 'left' | 'right' }) {
  const wrap = useRef<HTMLDivElement>(null);
  const t0 = useRef(performance.now());
  useFrame(() => {
    const on = performance.now() - t0.current >= atMs;
    const el = wrap.current;
    if (el && el.dataset.on !== String(on)) {
      el.dataset.on = String(on);
      el.style.setProperty('--l1', on ? TEAL : GREY);
    }
  });
  return (
    <group position={[x, y, z]}>
      <Html center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={wrap} className="l1-switch" data-on="false" style={{ ['--l1' as string]: GREY }}>
          <div className="l1-chip l1-chip--var" data-l1-chip={kind}>
            <svg viewBox="-30 -30 60 60" width={56} height={56} aria-hidden dangerouslySetInnerHTML={{ __html: ICONS[kind].replace(/"C"/g, '"var(--l1)"') }} />
            <div className={`marker-label l1-chip__tag l1-chip__tag--${labelSide ?? 'right'} l1-chip__tag--var`}>
              <div className="marker-label__pier mono">{label}</div>
              <div className="marker-label__sub">{sub}</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export function Lab1Story({ kind, pier3 }: { kind: Lab1Kind; pier3: number }) {
  const top = DECK_Y + 0.7;
  const WEST = -4.3;
  const EAST = 3.5;
  const site: Vec3 = [pier3, DECK_Y + 0.3, 0];
  return (
    <group name={`lab1-${kind}`} key={kind}>
      {kind === 'crack' && (
        <>
          <Walker kind="hat" from={WEST} to={pier3 - 0.8} y={top} z={0.3} walkMs={BEAT_MS} />
          <Chip2 x={pier3} y={DECK_Y + 2.6} appearMs={BEAT_MS}>
            <div className="marker-label" style={{ borderColor: RED, whiteSpace: 'nowrap' }}>
              <div className="marker-label__pier mono" style={{ color: RED }}>The crack</div>
              <div className="marker-label__sub">hairline crack · 0.12 mm</div>
            </div>
          </Chip2>
        </>
      )}
      {kind === 'plan' && (
        <>
          <Walker kind="hat" from={pier3 - 0.8} to={pier3 - 0.8} y={top} z={0.3} walkMs={1} />
          <Walker kind="steel" color={TEAL} from={WEST} to={WEST} y={DECK_Y + 0.5} z={0} walkMs={1} label="Steel supplier" sub="delivery by road" />
          <Switch kind="shield" x={EAST} y={DECK_Y + 0.5} z={0} atMs={BEAT_MS * 3} label="Engineer’s office" sub="reviews the plan" labelSide="left" />
          <FlowArc from={[WEST, DECK_Y + 0.3, 0]} to={site} color={TEAL} lift={1.6} radius={0.05} durationMs={BEAT_MS} delayMs={BEAT_MS * 2} persist />
          <FlowArc from={[EAST, DECK_Y + 0.3, 0]} to={site} color={TEAL} lift={1.6} radius={0.05} durationMs={1600} delayMs={BEAT_MS * 3} persist />
        </>
      )}
      {kind === 'capture' && (
        <>
          <Walker kind="steel" color={TEAL} from={EAST - 1.1} to={EAST - 1.1} y={DECK_Y + 0.5} z={0} walkMs={1} />
          <Walker kind="hat" color={AMBER} from={EAST + 0.6} to={EAST - 1.7} y={top} z={0.3} walkMs={1800} label="Steel delivery" sub="the technician frames one photo" labelSide="left" />
          <Walker kind="cam" from={EAST - 2.3} to={EAST - 2.3} y={top + 0.9} z={0.3} walkMs={1} appearMs={1800} />
          <FlowArc from={[EAST - 2.3, top + 0.9, 0.3]} to={[pier3, DECK_Y + 3.2, 0]} color={TEAL} lift={1.8} radius={0.05} durationMs={2200} delayMs={3400} persist />
        </>
      )}
    </group>
  );
}

/** an HTML label anchored at a point on the bridge that fades in at `appearMs` */
function Chip2({ x, y, appearMs, children }: { x: number; y: number; appearMs: number; children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  const t0 = useRef(performance.now());
  useFrame(() => {
    if (el.current) el.current.style.opacity = String(Math.max(0, Math.min(1, (performance.now() - t0.current - appearMs) / 500)));
  });
  return (
    <group position={[x, y, 0]}>
      <Html center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={el} style={{ opacity: 0 }}>{children}</div>
      </Html>
    </group>
  );
}
