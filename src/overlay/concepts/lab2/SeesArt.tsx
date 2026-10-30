import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Fill } from '../Fill';
import { CARD, Chip, DIM, INK, MONO, Num, SOFT, TEAL, TEAL_D, TINT, cap } from './parts';

/**
 * 0.3 · What the agent can see, as the bridge's case file (owner, 29 Oct: "follow how 3.2 to 3.4 build their
 * flow"). The bridge's own card comes first in the middle; then the latest reports slide in on its left, newest at
 * the top; then the graph draws its edges out to the five things connected to it on the right.
 * 0.3a · Three known-good cases: three drills, each with its own asset drawn, and one dial that picks the case.
 */

const T = 'var(--teal)';
const G = '#8a97a3';

/* ---------------- the three assets, drawn ---------------- */

export function BridgeArt({ on = true, w = 220 }: { on?: boolean; w?: number }) {
  const c = on ? T : G;
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" aria-label="Harbor Bridge" role="img" style={{ display: 'block' }}>
      <path d="M0 96h200" stroke={on ? 'rgba(27,138,156,0.35)' : 'rgba(127,127,127,0.3)'} strokeWidth={3} strokeDasharray="10 8" />
      <path d="M6 58h188" stroke={c} strokeWidth={7} strokeLinecap="round" />
      <path d="M16 58C56 6 144 6 184 58" fill="none" stroke={c} strokeWidth={4.5} />
      {[46, 72, 100, 128, 154].map((x) => (
        <path key={x} d={`M${x} ${58 - Math.sin(((x - 16) / 168) * Math.PI) * 38}V58`} stroke={c} strokeWidth={2} opacity={0.7} />
      ))}
      {[30, 100, 170].map((x) => <rect key={x} x={x - 7} y={58} width={14} height={40} rx={2} fill={c} />)}
    </svg>
  );
}

function SubstationArt({ on = true, w = 220 }: { on?: boolean; w?: number }) {
  const c = on ? T : G;
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" aria-label="Substation Gamma" role="img" style={{ display: 'block' }}>
      <path d="M0 100h200" stroke="rgba(127,127,127,0.3)" strokeWidth={3} />
      {/* a pylon */}
      <path d="M150 100l14-82 14 82M154 76h20M158 52h12M146 34h36" fill="none" stroke={c} strokeWidth={3.2} strokeLinejoin="round" />
      {/* two transformers with their fins and insulators */}
      {[14, 74].map((x) => (
        <g key={x}>
          <rect x={x} y={52} width={50} height={46} rx={4} fill={on ? TINT : SOFT} stroke={c} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${x + 10 + i * 10} 60v30`} stroke={c} strokeWidth={2} opacity={0.6} />)}
          {[12, 25, 38].map((d) => <path key={d} d={`M${x + d} 52v-14M${x + d - 4} 42h8M${x + d - 4} 47h8`} stroke={c} strokeWidth={2.4} strokeLinecap="round" />)}
        </g>
      ))}
      <path d="M26 38C70 20 120 20 164 18M50 38C90 26 130 30 178 34" fill="none" stroke={c} strokeWidth={1.8} opacity={0.7} />
    </svg>
  );
}

function PipelineArt({ on = true, w = 220 }: { on?: boolean; w?: number }) {
  const c = on ? T : G;
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 200 110" aria-label="Pipeline North-7" role="img" style={{ display: 'block' }}>
      <path d="M0 100h200" stroke="rgba(127,127,127,0.3)" strokeWidth={3} />
      {/* the pipe on its supports, with a valve wheel and a pressure gauge */}
      <rect x={4} y={60} width={192} height={22} rx={11} fill={on ? TINT : SOFT} stroke={c} strokeWidth={3} />
      {[40, 160].map((x) => <path key={x} d={`M${x} 82v18M${x - 10} 100h20`} stroke={c} strokeWidth={3} />)}
      {[24, 70, 130, 176].map((x) => <path key={x} d={`M${x} 60v22`} stroke={c} strokeWidth={2} opacity={0.6} />)}
      <path d="M100 60V40" stroke={c} strokeWidth={3} />
      <circle cx={100} cy={30} r={13} fill="none" stroke={c} strokeWidth={3} />
      <path d="M87 30h26M100 17v26" stroke={c} strokeWidth={2} />
      <path d="M140 60V48" stroke={c} strokeWidth={3} />
      <circle cx={140} cy={36} r={13} fill={CARD} stroke={c} strokeWidth={3} />
      <path d="M140 36l7-6" stroke={c} strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- 0.3 · the case file ---------------- */

export interface Recent {
  d: string;
  sev: string;
  t: string;
}

const lbl = { ...cap, fontSize: 17, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 } as const;

export function CaseFile({ recent, edges, focusN }: { recent: Recent[]; edges: string[][]; focusN: number | null }) {
  const lit = (n: number) => focusN === null || focusN === n;
  const dim = (n: number) => ({ opacity: lit(n) ? 1 : 0.35, transition: 'opacity 300ms' });
  /** where the five neighbours sit, as fractions of the graph column's height */
  const ys = edges.map((_, i) => 0.1 + i * 0.2);
  return (
    <Fill gap={14}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} style={{ flex: 'none', fontSize: 24, color: DIM, lineHeight: 1.35 }}>
        Like the case file you read before visiting the site: <b style={{ color: INK }}>its ID card, the latest reports, and what it is connected to</b>.
      </motion.div>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) 380px minmax(0, 1fr)', gap: 0, minHeight: 520 }}>
        {/* 2 · the latest reports, a timeline, newest on top */}
        <div data-part={2} style={{ ...dim(2), display: 'flex', flexDirection: 'column', paddingRight: 24 }}>
          <div style={lbl}>
            <Num n={2} on={lit(2)} size={32} />
            Most recent evidence
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 30 }}>
            <span style={{ position: 'absolute', left: 8, top: 10, bottom: 10, borderLeft: '2.5px dotted var(--teal)' }} />
            {recent.map((r, i) => (
              <motion.div key={r.d} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + i * 0.35, duration: 0.5, ease: EASE }} style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: -29, top: 6, width: 16, height: 16, borderRadius: '50%', background: r.sev === 'critical' ? '#4a5560' : CARD, border: `3px solid ${r.sev === 'critical' ? '#4a5560' : G}` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: MONO, fontSize: 17, color: DIM }}>{r.d}</span>
                  <span style={{ fontFamily: MONO, fontSize: 15, color: r.sev === 'critical' ? '#fff' : DIM, background: r.sev === 'critical' ? '#4a5560' : 'rgba(127,127,127,0.15)', borderRadius: 5, padding: '1px 8px' }}>{r.sev}</span>
                </div>
                <div style={{ fontSize: 21, color: INK, lineHeight: 1.35, marginTop: 2 }}>{r.t}</div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* 1 · the bridge's own card, in the middle */}
        <motion.div data-part={1} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: lit(1) ? 1 : 0.35, scale: 1 }} transition={{ delay: 0.3, duration: 0.6, ease: EASE }} style={{ alignSelf: 'center', borderRadius: 18, border: `3px solid ${TEAL}`, background: CARD, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', padding: '22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <div style={{ ...lbl, marginBottom: 0, color: TEAL_D }}>
            <Num n={1} on={lit(1)} size={32} />
            Asset row + JSON specs
          </div>
          <BridgeArt w={300} />
          <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: INK }}>Harbor Bridge</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {['bridge', 'criticality 5', 'Harbor District', 'span 485 m'].map((c) => (
              <Chip key={c} style={{ fontSize: 19 }}>{c}</Chip>
            ))}
          </div>
        </motion.div>
        {/* 3 · the graph: five edges drawn into the bridge */}
        <div data-part={3} style={{ ...dim(3), display: 'flex', flexDirection: 'column', paddingLeft: 0 }}>
          <div style={{ ...lbl, paddingLeft: 24 }}>
            <Num n={3} on={lit(3)} size={32} />
            Graph edges into the bridge
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              {ys.map((y, i) => (
                <motion.path key={i} d={`M0 50 C 14 50, 12 ${y * 100}, 26 ${y * 100}`} fill="none" stroke={T} strokeWidth={2.6} vectorEffect="non-scaling-stroke" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 + i * 0.3, duration: 0.6, ease: EASE }} />
              ))}
            </svg>
            {edges.map(([from, rel], i) => (
              <motion.div key={from} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 + i * 0.3, duration: 0.4 }} style={{ position: 'absolute', left: '27%', right: 0, top: `${ys[i] * 100}%`, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 6, borderLeft: `4px solid ${TEAL}` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, fontWeight: 600, color: INK, lineHeight: 1.2 }}>{from}</span>
                  <Chip style={{ fontSize: 16 }}>{rel} →</Chip>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Fill>
  );
}

/* ---------------- 0.3a · three drills, one dial ---------------- */

export interface Case {
  name: string;
  asset: string;
  q: string;
  /** the words of the question that say what this case is about */
  key?: string;
}

const ART: ((p: { on?: boolean; w?: number }) => ReactNode)[] = [BridgeArt, SubstationArt, PipelineArt];
const DIAL_AT = 2.0;

/** the pointer sweeps over the three positions and settles on the first; once a case is being talked about it points at that case */
function Dial({ at, sweep }: { at: number; sweep: boolean }) {
  const angles = [-50, 0, 50];
  return (
    <svg width={190} height={150} viewBox="0 0 190 150" aria-hidden style={{ display: 'block', flex: 'none' }}>
      <path d="M25 120A70 70 0 0 1 165 120" fill="none" stroke="rgba(127,127,127,0.25)" strokeWidth={14} strokeLinecap="round" />
      {angles.map((a, i) => {
        const r = (a - 90) * (Math.PI / 180);
        return (
          <g key={a}>
            <circle cx={95 + Math.cos(r) * 86} cy={120 + Math.sin(r) * 86} r={14} fill={i === at ? T : CARD} stroke={i === at ? T : G} strokeWidth={2.6} />
            <text x={95 + Math.cos(r) * 86} y={126 + Math.sin(r) * 86} textAnchor="middle" fontSize="16" fontWeight="700" fill={i === at ? '#fff' : G} fontFamily="Inter, sans-serif">
              {i + 1}
            </text>
          </g>
        );
      })}
      <g transform="translate(95 120)">
        <motion.path d="M0 0V-68" stroke={T} strokeWidth={7} strokeLinecap="round" initial={{ rotate: 50 }} animate={{ rotate: sweep ? [50, 0, -50] : angles[at] }} transition={sweep ? { delay: DIAL_AT, duration: 1.4, times: [0, 0.45, 1], ease: 'easeInOut' } : { duration: 0.45, ease: 'easeInOut' }} style={{ originX: 0.5, originY: 1 }} />
      </g>
      <circle cx={95} cy={120} r={20} fill={TEAL} />
      <circle cx={95} cy={120} r={7} fill="#fff" />
    </svg>
  );
}

export function ThreeDrills({ cases, focusN }: { cases: Case[]; focusN: number | null }) {
  const lit = (n: number) => focusN === null || focusN === n;
  // the case in use follows the one being talked about; the dial and the setting under it follow too
  const at = focusN !== null && focusN >= 1 && focusN <= 3 ? focusN - 1 : 0;
  const chosen = focusN === null ? DIAL_AT + 1.4 : 0.1;
  return (
    <Fill gap={14}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} style={{ flex: 'none', fontSize: 24, color: DIM, lineHeight: 1.35 }}>
        Like three rehearsed drills on a training ground: <b style={{ color: INK }}>the same crew, one dial picks today’s drill</b>.
      </motion.div>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
        {cases.map((c, i) => {
          const Art = ART[i];
          const active = i === at;
          return (
            <motion.div key={c.name} data-case={c.asset} data-active={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: lit(i + 1) ? 1 : 0.35, y: 0 }} transition={{ delay: 0.3 + i * 0.45, duration: 0.5, ease: EASE }} style={{ borderRadius: 16, border: `${active ? 3 : 2}px solid ${active ? TEAL : 'var(--line)'}`, background: active ? CARD : SOFT, padding: '18px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 12, textAlign: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Num n={i + 1} on={lit(i + 1)} size={34} />
                {active && (
                  <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: chosen, duration: 0.35 }} style={{ padding: '3px 12px', borderRadius: 999, fontSize: 16, fontWeight: 700, background: TEAL, color: '#fff' }}>
                    active
                  </motion.span>
                )}
              </div>
              <Art on={active} w={260} />
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: INK }}>{c.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 21, color: active ? TEAL_D : DIM, marginTop: 4 }}>{c.asset}</div>
              </div>
              <div style={{ fontSize: 22, color: '#fff', background: 'rgba(31,42,51,0.9)', borderRadius: 14, padding: '12px 16px', lineHeight: 1.35 }}>
                “{c.key && c.q.includes(c.key) ? (
                  <>
                    {c.q.slice(0, c.q.indexOf(c.key))}
                    <b style={{ color: '#7fd3df' }}>{c.key}</b>
                    {c.q.slice(c.q.indexOf(c.key) + c.key.length)}
                  </>
                ) : (
                  c.q
                )}”
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* the dial: one setting picks the case */}
      <motion.div data-switch initial={{ opacity: 0 }} animate={{ opacity: lit(4) ? 1 : 0.35 }} transition={{ delay: 1.6, duration: 0.5 }} style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '6px 0 0', borderTop: '1px solid var(--line)' }}>
        <Dial at={at} sweep={focusN === null} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 24, color: INK, fontWeight: 600 }}>One setting picks the case:</span>
          <Chip style={{ fontSize: 22, alignSelf: 'flex-start' }}>ACTIVE_SCENARIO = SCENARIOS[{at}]</Chip>
          <span style={{ fontSize: 20, color: DIM }}>the same code runs any of the three</span>
        </div>
      </motion.div>
    </Fill>
  );
}
