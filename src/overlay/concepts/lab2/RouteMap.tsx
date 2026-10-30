import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { FitBox } from '../Fill';
import { CARD, DIM, INK, TEAL, TEAL_D, TINT2 } from './parts';

/**
 * 0.4b · The route for today, drawn as a road (owner, 29 Oct: "bad space usage, icon should be better, generate by
 * yourself"). The eleven stops sit on one winding road across the panel, each with its own drawing; a teal line
 * drives the road from the first stop to the last while the stops come up one after another.
 */

export interface RouteStop {
  n: number;
  ch: string;
  name: string;
  kinds: ('idea' | 'notebook')[];
}

const T = 'var(--teal)';
const F = 'rgba(27, 138, 156, 0.16)';
const G = '#8a97a3';
const sw = { fill: 'none', stroke: T, strokeWidth: 3.2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** one drawing per stop, 80 × 80, teal line on a light teal fill */
const ART: ReactNode[] = [
  // 1 · one crack: a steel plate with a jagged crack, a magnifier over it
  <g key="1">
    <rect x="6" y="34" width="56" height="30" rx="3" fill={F} stroke={T} strokeWidth={3} />
    <path d="M12 50l8-3 6 4 7-4 6 3 8-3" {...sw} stroke={INK} strokeWidth={2.4} />
    <circle cx="52" cy="28" r="15" {...sw} fill="var(--panel-strong)" />
    <path d="M44 28l6-3 5 3 5-2" {...sw} stroke={INK} strokeWidth={2.2} />
    <path d="M63 39l11 11" {...sw} strokeWidth={5} />
  </g>,
  // 2 · why AI needs your data: your records flow into the model
  <g key="2">
    <ellipse cx="22" cy="20" rx="15" ry="5.5" fill={F} stroke={T} strokeWidth={3} />
    <path d="M7 20v34c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5V20M7 31.5c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5M7 43c0 3 6.7 5.5 15 5.5s15-2.5 15-5.5" {...sw} strokeWidth={3} />
    <path d="M41 38h10" {...sw} strokeDasharray="3 4" />
    <path d="M48 33l5 5-5 5" {...sw} />
    {[[60, 24], [60, 52], [72, 38]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="5.5" fill={F} stroke={T} strokeWidth={2.6} />)}
    <path d="M64 27l4 7M64 49l4-7M60 30v16" stroke={T} strokeWidth={2} opacity={0.6} />
  </g>,
  // 3 · the workbench: a table with the database, a laptop and a clipboard on it
  <g key="3">
    <path d="M4 54h72M12 54v20M68 54v20" {...sw} />
    <rect x="10" y="26" width="28" height="19" rx="2" fill={F} stroke={T} strokeWidth={3} />
    <path d="M6 50h36" {...sw} />
    <path d="M16 33h10M16 38h16" stroke={T} strokeWidth={2} strokeLinecap="round" />
    <ellipse cx="58" cy="30" rx="11" ry="4" fill={F} stroke={T} strokeWidth={2.8} />
    <path d="M47 30v16c0 2.2 5 4 11 4s11-1.8 11-4V30M47 38c0 2.2 5 4 11 4s11-1.8 11-4" {...sw} strokeWidth={2.8} />
  </g>,
  // 4 · the filing cabinet: three drawers, the middle one pulled out with folders in it
  <g key="4">
    <rect x="16" y="6" width="44" height="68" rx="3" fill={F} stroke={T} strokeWidth={3} />
    <path d="M16 28h44M16 52h44" {...sw} />
    <path d="M32 17h12M32 63h12" {...sw} />
    <rect x="24" y="31" width="44" height="18" rx="2" fill="var(--panel-strong)" stroke={T} strokeWidth={3} />
    <path d="M32 31v-7h9l2 3h8v4M46 31v-5h12v5" fill={F} stroke={T} strokeWidth={2.4} strokeLinejoin="round" />
    <path d="M40 40h12" {...sw} />
  </g>,
  // 5 · the fixed checklist: a clipboard, three ticked lines, always in the same order
  <g key="5">
    <rect x="14" y="10" width="52" height="64" rx="5" fill={F} stroke={T} strokeWidth={3} />
    <rect x="28" y="5" width="24" height="10" rx="3" fill="var(--panel-strong)" stroke={T} strokeWidth={3} />
    {[28, 44, 60].map((y) => (
      <g key={y}>
        <path d={`M22 ${y}l4 4 7-8`} {...sw} />
        <path d={`M40 ${y}h18`} {...sw} stroke={G} />
      </g>
    ))}
  </g>,
  // 6 · the chief inspector: a hard hat
  <g key="6">
    <path d="M14 52c0-22 12-36 26-36s26 14 26 36z" fill={F} stroke={T} strokeWidth={3} strokeLinejoin="round" />
    <path d="M36 16h8v36h-8z" fill="var(--panel-strong)" stroke={T} strokeWidth={2.6} />
    <path d="M6 54h68a2 2 0 0 1 0 4H10a6 6 0 0 1-4-4z" fill={T} stroke={T} strokeWidth={2} strokeLinejoin="round" />
    <path d="M28 66h24" {...sw} stroke={G} />
  </g>,
  // 7 · tools, skills, MCP: a toolbox with a wrench sticking out
  <g key="7">
    <path d="M52 30l14-14a8 8 0 0 0 8 8l-14 14" fill="var(--panel-strong)" stroke={T} strokeWidth={3} strokeLinejoin="round" />
    <rect x="6" y="34" width="68" height="36" rx="4" fill={F} stroke={T} strokeWidth={3} />
    <path d="M28 34v-8h24v8" {...sw} />
    <path d="M6 48h68" {...sw} />
    <rect x="34" y="44" width="12" height="9" rx="2" fill="var(--panel-strong)" stroke={T} strokeWidth={2.6} />
  </g>,
  // 8 · one query, four lenses: one question splits into four ways of looking
  <g key="8">
    <circle cx="12" cy="40" r="7" fill={T} />
    <path d="M19 40c14 0 18-27 34-27M19 40c14 0 18-9 34-9M19 40c14 0 18 9 34 9M19 40c14 0 18 27 34 27" {...sw} strokeWidth={2.6} />
    {[13, 31, 49, 67].map((y) => <circle key={y} cx="64" cy={y} r="7.5" fill={F} stroke={T} strokeWidth={3} />)}
  </g>,
  // 9 · build the agent: the reason–act loop around a hard hat
  <g key="9">
    <path d="M40 8a32 32 0 0 1 30 22" {...sw} />
    <path d="M72 22l-1 9-8-4" {...sw} />
    <path d="M40 72a32 32 0 0 1-30-22" {...sw} />
    <path d="M8 58l1-9 8 4" {...sw} />
    <path d="M70 46a32 32 0 0 1-18 23M10 34A32 32 0 0 1 28 11" {...sw} stroke={G} strokeDasharray="2 6" />
    <path d="M24 48c0-12 7-20 16-20s16 8 16 20z" fill={F} stroke={T} strokeWidth={3} strokeLinejoin="round" />
    <path d="M18 49h44" {...sw} strokeWidth={4} />
  </g>,
  // 10 · security and observability: a shield with an open eye
  <g key="10">
    <path d="M40 6l28 10v20c0 18-12 30-28 38C24 66 12 54 12 36V16z" fill={F} stroke={T} strokeWidth={3} strokeLinejoin="round" />
    <path d="M22 40c5-8 11-12 18-12s13 4 18 12c-5 8-11 12-18 12s-13-4-18-12z" fill="var(--panel-strong)" stroke={T} strokeWidth={2.8} strokeLinejoin="round" />
    <circle cx="40" cy="40" r="6" fill={T} />
  </g>,
  // 11 · wrap-up: the finish flag
  <g key="11">
    <path d="M18 74V8" {...sw} strokeWidth={3.6} />
    <path d="M18 10h50v34H18" fill={F} stroke={T} strokeWidth={3} strokeLinejoin="round" />
    {[0, 1, 2, 3, 4].map((c) => [0, 1, 2].map((r) => ((c + r) % 2 ? null : <rect key={`${c}${r}`} x={18 + c * 10} y={10 + r * 11.33} width="10" height="11.33" fill={T} />)))}
    <path d="M10 74h18" {...sw} />
  </g>,
];

/** the road's geometry, in the FitBox's own pixels */
const W = 1420;
const H = 560;
const colX = (i: number) => 110 + i * 230;
const Y1 = 64;
const Y2 = 344;
/** top row 1 to 6 left to right, a bend, then 7 to 11 back right to left */
const at = (n: number) => (n <= 6 ? { x: colX(n - 1), y: Y1 } : { x: colX(6 - (n - 6)), y: Y2 });
const ROAD = `M-20 ${Y1}H${colX(5)}C${colX(5) + 150} ${Y1} ${colX(5) + 150} ${Y2} ${colX(5)} ${Y2}H${colX(1)}`;
const DRIVE = 4.2;

function Kind({ k }: { k: 'idea' | 'notebook' }) {
  return <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 16, fontWeight: 700, background: k === 'idea' ? TINT2 : 'rgba(31,42,51,0.88)', color: k === 'idea' ? TEAL_D : '#fff' }}>{k}</span>;
}

export function RouteMap({ stops }: { stops: RouteStop[] }) {
  return (
    <FitBox w={W} h={H} max={1.3}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden>
        <path d={ROAD} fill="none" stroke="rgba(127,127,127,0.2)" strokeWidth={34} strokeLinecap="round" />
        <path d={ROAD} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} strokeDasharray="14 14" />
        <motion.path d={ROAD} fill="none" stroke={TEAL} strokeWidth={6} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: DRIVE, ease: 'easeInOut' }} />
      </svg>
      {stops.map((s, i) => {
        const p = at(s.n);
        const when = 0.3 + (i / (stops.length - 1)) * DRIVE * 0.92;
        return (
          <motion.div key={s.n} data-stop={s.ch} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: when, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: p.x - 112, top: p.y - 58, width: 224, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 116, height: 116, borderRadius: '50%', background: CARD, border: `3px solid ${TEAL}`, boxShadow: '0 4px 14px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={80} height={80} viewBox="0 0 80 80" aria-hidden>
                {ART[s.n - 1]}
              </svg>
              <span style={{ position: 'absolute', left: -8, top: -6, width: 40, height: 40, borderRadius: '50%', background: TEAL, color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--panel-strong)' }}>{s.n}</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: TEAL_D, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 10 }}>{s.ch}</span>
            <div style={{ fontSize: 25, fontWeight: 700, color: INK, lineHeight: 1.2, marginTop: 2 }}>{s.name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {s.kinds.map((k) => <Kind key={k} k={k} />)}
            </div>
          </motion.div>
        );
      })}
      {/* the empty corner of the bottom row explains the two chips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: DRIVE + 0.5, duration: 0.6 }} style={{ position: 'absolute', left: colX(0) - 110, top: Y2 - 80, width: 250, display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 18px', borderRadius: 14, border: '2px solid rgba(127,127,127,0.25)', background: 'var(--panel-strong)', boxSizing: 'border-box' }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', color: DIM, textTransform: 'uppercase' }}>Each stop</span>
        {([['idea', 'the idea, explained first'], ['notebook', 'then the notebook section that shows it']] as const).map(([k, t]) => (
          <span key={k} style={{ display: 'grid', gridTemplateColumns: '104px 1fr', alignItems: 'center', columnGap: 10, fontSize: 19, color: INK, lineHeight: 1.3 }}>
            <span><Kind k={k} /></span>
            {t}
          </span>
        ))}
      </motion.div>
    </FitBox>
  );
}
