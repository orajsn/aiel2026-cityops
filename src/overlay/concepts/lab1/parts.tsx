import { motion } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE } from '../WidePanel';
import mercerPortrait from '../../../assets/portraits/mercer.png';
import vancePortrait from '../../../assets/portraits/vance.png';
import steelDelivery from '../../../assets/photos/steel-delivery.webp';

/**
 * Lab 1's shared drawings and pieces (V2 pages, from the real workshop guide): teal for data, cool greys for
 * everything else, Oracle Red only where a page passes it for its one element. Calm motion only: things fade
 * up once, and one light moves along one path at a walking pace.
 */

export const TEAL = 'var(--teal)';
export const TEAL_D = '#146f7f';
export const TINT = 'rgba(27, 138, 156, 0.10)';
export const TINT2 = 'rgba(27, 138, 156, 0.18)';
export const SOFT = 'rgba(127, 127, 127, 0.08)';
export const GREY = '#8a97a3';
export const DIM = 'var(--ink-dim)';
export const CARD = 'var(--panel-strong)';
export const MONO = 'JetBrains Mono, monospace';

export interface Lab1Props {
  /** a click-by-click page (4a, 4b): which step the presenter is on, 1-based */
  step?: number;
  kicker: string;
  message: string;
  notebook?: string;
}

export const fadeUp = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5, ease: EASE } });
export const fade = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.5, ease: EASE } });

/**
 * Fills the panel's body with a page's content (owner, 29 Oct: use the whole stage, as if the caption were off;
 * grow the content, do not just add space): the content is laid out at a width of W / k and scaled by k, the
 * largest k (up to `max`) at which it still fits the height, so type, cards and pictures all grow together and
 * the page keeps its proportions. The content box is at least the full height, so rows with flex: 1 take what
 * is left. With a large Settings › Text size it shrinks to `min` and then scrolls rather than clips.
 */
export function Fill({ children, max = 1.25, min = 0.8, refit, style }: { children: ReactNode; max?: number; min?: number; /** fit again when this changes (a page whose content changes between clicks) */ refit?: unknown; style?: CSSProperties }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    let last = '';
    const fit = () => {
      const W = o.clientWidth;
      const H = o.clientHeight;
      if (!W || !H) return;
      const key = `${W}x${H}`;
      i.style.minHeight = '0px';
      const over = (k: number) => {
        i.style.width = `${W / k}px`;
        return i.offsetHeight * k > H + 0.5 || i.scrollWidth > i.clientWidth + 2;
      };
      let lo = min;
      let hi = max;
      if (!over(hi)) lo = hi;
      else if (over(lo)) hi = lo;
      else for (let n = 0; n < 10; n++) {
        const m = (lo + hi) / 2;
        if (over(m)) hi = m;
        else lo = m;
      }
      const k = Math.floor(lo * 1000) / 1000;
      const scrolls = over(k);
      i.style.width = `${W / k}px`;
      i.style.minHeight = `${H / k}px`;
      i.style.transform = `scale(${k})`;
      i.dataset.fit = String(k);
      o.style.overflowY = scrolls ? 'auto' : 'hidden';
      last = key;
    };
    fit();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
      if (`${o.clientWidth}x${o.clientHeight}` !== last) fit();
    });
    ro?.observe(o);
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
      ro?.disconnect();
    };
  }, [max, min, refit]);
  return (
    <div ref={outer} data-fill style={{ position: 'relative', flex: 1, minHeight: 0, overflowX: 'hidden', overflowY: 'hidden' }}>
      <div ref={inner} style={{ position: 'absolute', left: 0, top: 0, width: '100%', transformOrigin: '0 0', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', ...style }}>
        {children}
      </div>
    </div>
  );
}

/** the small uppercase label over a block */
export const cap: CSSProperties = { fontSize: 13, fontWeight: 700, letterSpacing: 2, color: DIM, textTransform: 'uppercase' };
export const capTeal: CSSProperties = { ...cap, color: TEAL };
/** a card: soft grey, or white with a teal edge */
export const card = (teal = false): CSSProperties => ({ borderRadius: 12, border: `2px solid ${teal ? TEAL : 'var(--line)'}`, background: teal ? CARD : SOFT, boxSizing: 'border-box' });
export const mono = (size = 15, color: string = TEAL_D): CSSProperties => ({ fontFamily: MONO, fontSize: size, color });

/** a "Hands-on n" pill: outlined, or solid teal */
export function HandsOn({ n, solid = false, label }: { n: number | string; solid?: boolean; label?: string }) {
  return (
    <span data-ho={n} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, border: `1.5px solid ${TEAL}`, background: solid ? TEAL : CARD, color: solid ? '#fff' : TEAL_D, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', flex: 'none' }}>
      {label ?? `Hands-on ${n}`}
    </span>
  );
}

/** a chip of mono text on a teal tint */
export function Chip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 6, background: TINT, ...mono(14), whiteSpace: 'nowrap', ...style }}>{children}</span>;
}

/** a flat person in a round badge (the project manager, the engineer); a hard hat for both */
export function Avatar({ who, size = 60 }: { who: string; size?: number }) {
  // the same 3D portraits as the other labs (owner, 2 Nov): the engineer is Mercer, the project manager Vance
  const src = who === 'engineer' ? mercerPortrait : vancePortrait;
  return (
    <img
      data-person={who}
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      style={{ width: size, height: size, borderRadius: '50%', border: '3px solid rgba(27, 138, 156, 0.85)', background: 'rgba(127,127,127,0.15)', objectFit: 'cover', flex: 'none', display: 'block' }}
    />
  );
}

/** the AI assistant: a teal rounded square with a spark */
export function Spark({ size = 40 }: { size?: number }) {
  return (
    <svg data-ai="assistant" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flex: 'none' }}>
      <rect x="1" y="1" width="38" height="38" rx="8" fill={TEAL} />
      <path d="M20 8l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#fff" />
    </svg>
  );
}

/** a small neural network: the language model, drawn as layers of nodes; a soft light runs through it when `live` */
export function Net({ w = 120, live = false, dim = false, who = 'model' }: { w?: number; live?: boolean; dim?: boolean; who?: string }) {
  const cols = [[30, 50], [16, 36, 56], [16, 36, 56], [26, 46]];
  const xs = [10, 40, 70, 100];
  const nodes = cols.flatMap((ys, c) => ys.map((y) => ({ x: xs[c], y, c })));
  return (
    <svg data-net={who} width={w} height={w * 0.6} viewBox="0 0 110 66" aria-hidden="true" style={{ flex: 'none', opacity: dim ? 0.4 : 1 }}>
      <g stroke={TEAL} strokeOpacity={0.35} strokeWidth={1.4}>
        {nodes.flatMap((a) => nodes.filter((b) => b.c === a.c + 1).map((b) => <line key={`${a.x}${a.y}-${b.x}${b.y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />))}
      </g>
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={6}
          stroke={TEAL}
          strokeWidth={2}
          initial={{ fill: 'rgba(27,138,156,0.18)' }}
          animate={live ? { fill: ['rgba(27,138,156,0.18)', 'rgba(27,138,156,0.95)', 'rgba(27,138,156,0.18)'] } : undefined}
          transition={live ? { delay: 1 + n.c * 0.45, duration: 1.4, repeat: Infinity, repeatDelay: 3.4, ease: 'easeInOut' } : undefined}
        />
      ))}
    </svg>
  );
}

/**
 * A model drawn at its own size (owner, 2 Nov): `small` is the lower-cost model (3 layers, a few nodes), `large` the expensive
 * multimodal one (7 layers, many nodes). When data reaches it a wave of light runs through its layers, once per `period`
 * seconds starting at `start`; `netWaveEnd` says when the wave has left, so the coins can breathe right after it.
 */
const NET_SHAPES = {
  small: { layers: [2, 3, 2], w: 110, h: 66 },
  large: { layers: [3, 5, 6, 6, 6, 5, 3], w: 220, h: 100 },
} as const;
export type NetShape = keyof typeof NET_SHAPES;
const WAVE_STEP = 0.32;
const WAVE_LIT = 0.7;
export const netWaveEnd = (shape: NetShape, start: number) => start + (NET_SHAPES[shape].layers.length - 1) * WAVE_STEP + WAVE_LIT;

export function ModelNet({ w, shape, who, period, start }: { w: number; shape: NetShape; who: string; period: number; start: number | number[] }) {
  const starts = ([] as number[]).concat(start);
  const { layers, w: vw, h: vh } = NET_SHAPES[shape];
  const pad = 12;
  const gx = (vw - 2 * pad) / (layers.length - 1);
  const nodes = layers.flatMap((n, c) => Array.from({ length: n }, (_, k) => ({ c, x: pad + c * gx, y: 10 + (k * (vh - 20)) / (n - 1) })));
  const r = shape === 'large' ? 5 : 6;
  return (
    <svg data-net={who} data-layers={layers.length} data-nodes={nodes.length} width={w} height={(w * vh) / vw} viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true" style={{ flex: 'none' }}>
      <g stroke={TEAL} strokeOpacity={shape === 'large' ? 0.28 : 0.35} strokeWidth={shape === 'large' ? 1 : 1.4}>
        {nodes.flatMap((a) => nodes.filter((b) => b.c === a.c + 1).map((b) => <line key={`${a.x}${a.y}-${b.x}${b.y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />))}
      </g>
      {nodes.map((n, i) => {
        const at = (x: number) => Math.min(1, Math.max(0, x / period));
        const lo = 'rgba(27,138,156,0.18)';
        const hi = 'rgba(27,138,156,0.95)';
        const times = [0, ...starts.flatMap((s0) => {
          const s = s0 + n.c * WAVE_STEP;
          return [at(s), at(s + WAVE_LIT / 2), at(s + WAVE_LIT)];
        }), 1];
        const fills = [lo, ...starts.flatMap(() => [lo, hi, lo]), lo];
        return (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={r}
            stroke={TEAL}
            strokeWidth={shape === 'large' ? 1.6 : 2}
            initial={{ fill: lo }}
            animate={{ fill: fills }}
            transition={{ duration: period, repeat: Infinity, ease: 'linear', times }}
          />
        );
      })}
    </svg>
  );
}

/**
 * a coin that breathes once per `period`, from `start`: the cheap one softly in pale teal, the expensive one deeper, bigger and
 * with a glow, so the two read as different at a glance (never red)
 */
export function BreathingCoin({ size = 30, period, start, strong = false }: { size?: number; period: number; start: number | number[]; strong?: boolean }) {
  const starts = ([] as number[]).concat(start);
  const at = (x: number) => Math.min(1, Math.max(0, x / period));
  const lo = TINT2;
  const hi = strong ? 'rgba(20,111,127,1)' : 'rgba(27,138,156,0.4)';
  const times = [0, ...starts.flatMap((s) => [at(s), at(s + 0.9), at(s + 1.8)]), 1];
  const rep = <T,>(a: T, b: T, c: T): T[] => [a, ...starts.flatMap(() => [a, b, c]), a];
  const peak = strong ? 1.22 : 1.08;
  return (
    <motion.svg
      data-coin
      data-breath={strong ? 'strong' : 'soft'}
      width={size}
      height={size}
      viewBox="0 0 26 26"
      aria-hidden="true"
      animate={{ scale: rep(1, peak, 1), filter: rep('drop-shadow(0 0 0 rgba(27,138,156,0))', `drop-shadow(0 0 ${strong ? 9 : 4}px rgba(27,138,156,${strong ? 0.85 : 0.45}))`, 'drop-shadow(0 0 0 rgba(27,138,156,0))') }}
      transition={{ duration: period, repeat: Infinity, ease: 'linear', times }}
      style={{ flex: 'none', overflow: 'visible' }}
    >
      <motion.circle cx="13" cy="13" r="11.5" stroke={TEAL} strokeWidth={2} initial={{ fill: lo }} animate={{ fill: rep(lo, hi, lo) }} transition={{ duration: period, repeat: Infinity, ease: 'linear', times }} />
      <motion.text x="13" y="17.6" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif" initial={{ fill: TEAL_D }} animate={{ fill: rep(TEAL_D, strong ? '#ffffff' : TEAL_D, TEAL_D) }} transition={{ duration: period, repeat: Infinity, ease: 'linear', times }}>$</motion.text>
    </motion.svg>
  );
}

/** a coin for relative cost: a teal ring with a dollar sign, never a number */
export function Coin({ delay = 0, size = 26 }: { delay?: number; size?: number }) {
  return (
    <motion.svg data-coin width={size} height={size} viewBox="0 0 26 26" aria-hidden="true" {...fadeUp(delay)} style={{ flex: 'none' }}>
      <circle cx="13" cy="13" r="11.5" fill={TINT2} stroke={TEAL} strokeWidth={2} />
      <text x="13" y="17.6" textAnchor="middle" fontSize="13" fontWeight="700" fill={TEAL_D} fontFamily="Inter, sans-serif">$</text>
    </motion.svg>
  );
}

/**
 * a dashed connector with an arrow head; a teal dot walks along it once (or slowly, again and again, when `loop`)
 */
export function Flow({ w = 60, delay = 0, loop = false, head = true, dashed = true }: { w?: number; delay?: number; loop?: boolean; head?: boolean; dashed?: boolean }) {
  return (
    <svg data-flow width={w} height={20} viewBox={`0 0 ${w} 20`} fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', overflow: 'visible' }}>
      <path d={`M2 10H${w - (head ? 6 : 2)}`} strokeDasharray={dashed ? '4 6' : undefined} />
      {head && <path d={`M${w - 12} 4l7 6-7 6`} />}
      <motion.circle
        cy={10}
        r={5}
        fill={TEAL}
        stroke="none"
        initial={{ cx: 4, opacity: 0 }}
        animate={{ cx: [4, w - 14], opacity: [0, 1, 1, 0] }}
        transition={{ delay, duration: Math.max(1.2, w / 60), ease: 'easeInOut', repeat: loop ? Infinity : 0, repeatDelay: 2.6 }}
      />
    </svg>
  );
}

/** a vertical dashed connector with a walking dot */
export function FlowDown({ h = 40, delay = 0, loop = false }: { h?: number; delay?: number; loop?: boolean }) {
  return (
    <svg data-flow width={20} height={h} viewBox={`0 0 20 ${h}`} fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" style={{ flex: 'none', overflow: 'visible' }}>
      <path d={`M10 2V${h - 2}`} strokeDasharray="4 6" />
      <motion.circle cx={10} r={5} fill={TEAL} stroke="none" initial={{ cy: 4, opacity: 0 }} animate={{ cy: [4, h - 6], opacity: [0, 1, 1, 0] }} transition={{ delay, duration: 1.2, ease: 'easeInOut', repeat: loop ? Infinity : 0, repeatDelay: 2.6 }} />
    </svg>
  );
}

/** a switch in the app's Runtime configuration; turns on after `delay` when `on` */
export function Switch({ on, delay = 0, w = 46 }: { on: boolean; delay?: number; w?: number }) {
  const h = Math.round(w * 0.54);
  return (
    <motion.span data-switch={on ? 'on' : 'off'} initial={{ background: '#c9d1d8' }} animate={{ background: on ? '#1b8a9c' : '#c9d1d8' }} transition={{ delay, duration: 0.4 }} style={{ position: 'relative', display: 'inline-block', width: w, height: h, borderRadius: h, flex: 'none' }}>
      <motion.span initial={{ x: 0 }} animate={{ x: on ? w - h : 0 }} transition={{ delay, duration: 0.4, ease: EASE }} style={{ position: 'absolute', top: 3, left: 3, width: h - 6, height: h - 6, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </motion.span>
  );
}

/** the app's runtime bar: which model answered, and whether routing is on */
export function RuntimeBar({ model, routing, size = 16 }: { model: string; routing: 'enabled' | 'disabled'; size?: number }) {
  return (
    <span data-runtime={model} style={{ display: 'inline-flex', alignItems: 'stretch', borderRadius: 7, overflow: 'hidden', background: '#1f2a33', fontSize: size, whiteSpace: 'nowrap', flex: 'none' }}>
      <span style={{ padding: '6px 12px', color: '#7fd3e0', fontWeight: 700 }}>model · {model}</span>
      <span style={{ padding: '6px 12px', color: '#e6e9ef', borderLeft: '1px solid rgba(255,255,255,0.18)' }}>Routing {routing}</span>
    </span>
  );
}

/* ---------- icons ---------- */

/** a paperclip: an attached photo */
export function Clip() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M11 5v7a3 3 0 0 1-6 0V4a2 2 0 0 1 4 0v7a1 1 0 0 1-2 0V5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}


export function PdfIcon({ size = 44 }: { size?: number }) {
  return (
    <svg data-icon="pdf" width={size * 0.8} height={size} viewBox="0 0 32 40" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M3 1h18l9 9v27a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" fill={CARD} stroke={TEAL_D} strokeWidth={2} />
      <path d="M21 1v9h9" fill="none" stroke={TEAL_D} strokeWidth={2} />
      <path d="M6 13h12M6 18h16M6 23h14" stroke={GREY} strokeWidth={2} strokeLinecap="round" />
      <rect x="5" y="27" width="20" height="8" rx="2" fill={TEAL} />
      <text x="15" y="33.6" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">PDF</text>
    </svg>
  );
}

export function DbIcon({ size = 40 }: { size?: number }) {
  return (
    <svg data-icon="database" width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={TEAL} strokeWidth={2.4} aria-hidden="true" style={{ flex: 'none' }}>
      <ellipse cx="20" cy="8" rx="14" ry="5" />
      <path d="M6 8v24c0 2.8 6.3 5 14 5s14-2.2 14-5V8M6 16c0 2.8 6.3 5 14 5s14-2.2 14-5M6 24c0 2.8 6.3 5 14 5s14-2.2 14-5" />
    </svg>
  );
}

export function TextIcon({ size = 36 }: { size?: number }) {
  return (
    <svg data-icon="text" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ flex: 'none' }}>
      <rect x="4" y="6" width="32" height="28" rx="5" fill={CARD} stroke={GREY} strokeWidth={2.5} />
      <path d="M11 15h18M11 21h14M11 27h16" stroke={GREY} strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

export function Shield({ mark = 'check', size = 48, color = TEAL }: { mark?: 'check' | 'x'; size?: number; color?: string }) {
  return (
    <svg data-shield={mark} width={size * 0.87} height={size} viewBox="0 0 52 60" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M26 2l22 8v18c0 14-9.5 24-22 30C13.5 52 4 42 4 28V10z" fill={color} />
      {mark === 'check' ? <path d="M15 30l8 8 15-17" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M17 21l18 18M35 21L17 39" stroke="#fff" strokeWidth={5} strokeLinecap="round" />}
    </svg>
  );
}

export function LockIcon({ size = 26, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg data-icon="lock" width={size} height={size} viewBox="0 0 26 26" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M8 11V8a5 5 0 0 1 10 0v3" fill="none" stroke={color} strokeWidth={2.6} />
      <rect x="4" y="11" width="18" height="13" rx="3" fill={color} />
    </svg>
  );
}

/** the synthetic structural-steel delivery photo: I-beams stacked on timber, a project placard beside the stack */
/**
 * the delivery photo of the workshop guide (the exact image, owner 2 Nov). Small copies show its middle (the placard and the
 * stacked steel); `full` shows all of it, square, as the guide does.
 */
export function SteelPhoto({ w = 300, label = true, fluid = false, full = false, children }: { w?: number; label?: boolean; /** as wide as its box */ fluid?: boolean; /** the whole square picture */ full?: boolean; children?: ReactNode }) {
  void label;
  const ratio = full ? 1 : 0.66;
  return (
    <div data-photo="steel-delivery" style={{ position: 'relative', overflow: 'hidden', borderRadius: 10, flex: 'none', background: '#d3dae0', ...(fluid ? { width: '100%', aspectRatio: full ? '1 / 1' : '3 / 2' } : { width: w, height: w * ratio }) }}>
      <img src={steelDelivery} alt="" draggable={false} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: full ? 'center' : '42% 66%' }} />
      {children}
    </div>
  );
}

/** Harbor Bridge from the side: deck, three piers, the city behind, the river under it */
export function BridgeSide({ w = 300, fluid = false, children }: { w?: number; /** as wide as its box */ fluid?: boolean; children?: ReactNode }) {
  return (
    <svg data-bridge width={fluid ? '100%' : w} height={fluid ? undefined : w * 0.62} viewBox="0 0 700 434" aria-hidden="true" style={{ display: 'block', flex: 'none', ...(fluid ? { height: 'auto', aspectRatio: '700 / 434' } : null) }}>
      <rect width="700" height="434" fill="rgba(138,151,163,0.12)" />
      <g fill="rgba(138,151,163,0.28)">
        {[[0, 100, 30], [36, 50, 22], [74, 110, 26], [102, 74, 24], [176, 92, 38], [244, 66, 34], [282, 40, 22], [312, 100, 26], [378, 88, 46], [430, 56, 22], [458, 90, 42], [548, 84, 40], [594, 30, 30], [664, 30, 36]].map(([x, h, wd], i) => (
          <rect key={i} x={x} y={130 - h} width={wd} height={h} />
        ))}
      </g>
      <path d="M0 128h700" stroke="#8a97a3" strokeWidth={3} />
      {Array.from({ length: 17 }, (_, i) => (
        <path key={i} d={`M${20 + i * 40} 118v10`} stroke="#8a97a3" strokeWidth={2} />
      ))}
      <rect y="136" width="700" height="30" fill="#9aa3ad" />
      {[168, 350, 532].map((x) => (
        <g key={x}>
          <rect x={x - 38} y="166" width="76" height="14" fill="#aab2bd" />
          <path d={`M${x - 26} 180h52l-8 236h-36z`} fill="#c3c9d0" stroke="#9aa3ad" strokeWidth={2} />
        </g>
      ))}
      <path d="M0 180c40 0 60 30 60 80v156H0zM700 180c-40 0-60 30-60 80v156h60z" fill="#c3c9d0" />
      <rect y="416" width="700" height="18" fill="rgba(27,138,156,0.22)" />
      <path d="M20 426q14-6 28 0M300 426q14-6 28 0M560 426q14-6 28 0" stroke="#fff" strokeWidth={2} fill="none" />
      {children}
    </svg>
  );
}
