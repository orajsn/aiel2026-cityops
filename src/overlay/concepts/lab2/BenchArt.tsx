import { motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Fill } from '../Fill';
import { CARD, ChiefInspector, DIM, Db, INK, MONO, Net, Num, TEAL, TEAL_D, TINT, cap } from './parts';

/**
 * 0.5 · The workbench, drawn as one bench (owner, 29 Oct: "bad space usage, follow how 3.2 to 3.4 build their
 * flow"). The bench goes down first; then the records room, the engineer on call and the clipboard of settings are
 * set on it one after another, each with what the notebook says about it underneath.
 * 0.5a · Check the site first: the readiness probe's 25 checks tick one by one while a gauge counts them up.
 */

const T = 'var(--teal)';
const G = '#8a97a3';

/* ---------------- 0.5 · the bench ---------------- */

/** the clipboard of settings: the one configuration cell, as lines on a clipboard */
function Clipboard() {
  const lines = [
    ['DB_USER', '"prism"'],
    ['ONNX_MODEL', '"ALL_MINILM_L12_V2"'],
    ['THREAD_ID', '"prism-agent-demo-001"'],
    ['ACTIVE_SCENARIO', 'SCENARIOS[0]'],
    ['DEMO_ASSET', 'Harbor Bridge'],
  ];
  return (
    <div style={{ position: 'relative', width: 390, padding: '34px 18px 16px', borderRadius: 12, background: CARD, border: `3px solid ${TEAL}`, boxShadow: '0 6px 16px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <span style={{ position: 'absolute', left: '50%', top: -14, transform: 'translateX(-50%)', width: 110, height: 30, borderRadius: 8, background: TEAL }} />
      {lines.map(([k, v], i) => (
        <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 + i * 0.18, duration: 0.3 }} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontFamily: MONO, fontSize: 15, borderBottom: '1.5px dashed rgba(127,127,127,0.3)', paddingBottom: 6 }}>
          <span style={{ color: DIM }}>{k}</span>
          <span style={{ color: k === 'DEMO_ASSET' ? TEAL_D : INK, fontWeight: k === 'DEMO_ASSET' ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
        </motion.div>
      ))}
    </div>
  );
}

/** the records room: a big database cylinder with filing drawers on its front */
function RecordsRoom() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingRight: 30 }}>
      <Db size={220} />
      <svg width={84} height={84} viewBox="0 0 84 84" aria-hidden style={{ position: 'absolute', right: 0, bottom: 8 }}>
        <circle cx="42" cy="42" r="38" fill={CARD} stroke={T} strokeWidth={3} />
        {/* the embedding model that lives inside the database: a small net */}
        <g transform="translate(14 22) scale(0.52)">
          {[[10, 30], [10, 60], [55, 15], [55, 45], [55, 75], [100, 30], [100, 60]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill={TINT} stroke={T} strokeWidth="4" />)}
          <path d="M18 30l29-15M18 30l29 15M18 60l29-15M18 60l29 15M63 15l29 15M63 45l29-15M63 45l29 15M63 75l29-15" stroke={T} strokeWidth="2.5" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

/** the engineer on call: the grey engineer with the language model working beside it */
function OnCall() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
      <ChiefInspector size={170} grey label="the language model" />
      <div style={{ marginBottom: 20, padding: '10px 12px', borderRadius: 14, background: CARD, border: `2px solid ${TEAL}` }}>
        <Net w={110} live />
      </div>
    </div>
  );
}

const BENCH: { n: number; pic: string; title: string; art: ReactNode; lines: string[]; code: string }[] = [
  { n: 1, pic: 'The records room', title: 'Oracle AI Database 26ai', art: <RecordsRoom />, lines: ['the PRISM data', 'and the embedding model inside it'], code: 'Oracle AI Database 26ai Free Release 23.26.2.0.0' },
  { n: 2, pic: 'The engineer on call', title: 'The language model', art: <OnCall />, lines: ['a 3B model, chosen for small size', 'a GPU or hosted model is faster'], code: 'Reply: ’READY’' },
  { n: 3, pic: 'The clipboard of settings', title: 'Jupyter notebook', art: <Clipboard />, lines: ['all settings in one cell', 'active case: Harbor Bridge'], code: 'THREAD_ID = "prism-agent-demo-001"' },
];

/** when each object is set on the bench */
const putAt = (i: number) => 0.8 + i * 0.7;

export function Bench({ focusN }: { focusN: number | null }) {
  return (
    <Fill gap={14}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} style={{ flex: 'none', fontSize: 24, color: DIM, lineHeight: 1.35 }}>
        Like a site office before the shift: <b style={{ color: INK }}>the records, the engineer on call, one clipboard</b>.
      </motion.div>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: 'minmax(250px, 1fr) auto auto', columnGap: 24 }}>
        {BENCH.map((b, i) => {
          const on = focusN === null || focusN === b.n;
          return (
            <motion.div key={b.n} data-bench={b.n} initial={{ opacity: 0, y: -40 }} animate={{ opacity: on ? 1 : 0.35, y: 0 }} transition={{ delay: putAt(i), duration: 0.6, ease: EASE }} style={{ gridColumn: i + 1, gridRow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 2 }}>
              {b.art}
            </motion.div>
          );
        })}
        {/* the bench: a long top and two legs, under all three */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.7, ease: EASE }} style={{ gridColumn: '1 / 4', gridRow: 2, transformOrigin: 'left center', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 20, borderRadius: '8px 8px 2px 2px', background: '#7f8a95' }} />
          <div style={{ height: 8, background: '#5c6b78' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 60px' }}>
            <div style={{ width: 20, height: 26, background: '#5c6b78' }} />
            <div style={{ width: 20, height: 26, background: '#5c6b78' }} />
          </div>
        </motion.div>
        {BENCH.map((b, i) => {
          const on = focusN === null || focusN === b.n;
          return (
            <motion.div key={b.n} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.35 }} transition={{ delay: putAt(i) + 0.4, duration: 0.5 }} style={{ gridColumn: i + 1, gridRow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4, paddingTop: 6 }}>
              <div style={{ ...cap, fontSize: 17, color: TEAL_D }}>{b.pic}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Num n={b.n} size={36} on={on} />
                <span style={{ fontSize: 28, fontWeight: 700, color: INK }}>{b.title}</span>
              </div>
              {b.lines.map((l) => (
                <div key={l} style={{ fontSize: 22, color: DIM, lineHeight: 1.3 }}>{l}</div>
              ))}
              <div style={{ fontFamily: MONO, fontSize: 15, color: TEAL_D, marginTop: 4, whiteSpace: 'nowrap' }}>{b.code}</div>
            </motion.div>
          );
        })}
      </div>
    </Fill>
  );
}

/* ---------------- 0.5a · check the site first ---------------- */

export interface CheckGroup {
  n: number;
  group: string;
  items: string[];
}

const TICK0 = 0.8;
const TICK_GAP = 0.13;

function Gauge({ total }: { total: number }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    let i = 0;
    let t: ReturnType<typeof setInterval> | undefined;
    const s = setTimeout(() => {
      t = setInterval(() => {
        i += 1;
        setK(i);
        if (i >= total && t) clearInterval(t);
      }, TICK_GAP * 1000);
    }, TICK0 * 1000);
    return () => {
      clearTimeout(s);
      if (t) clearInterval(t);
    };
  }, [total]);
  const r = 108;
  const c = 2 * Math.PI * r;
  return (
    <div data-tally style={{ position: 'relative', width: 260, height: 260 }}>
      <svg width={260} height={260} viewBox="0 0 260 260" aria-hidden style={{ display: 'block' }}>
        <circle cx="130" cy="130" r={r} fill="none" stroke="rgba(127,127,127,0.18)" strokeWidth={20} />
        <circle cx="130" cy="130" r={r} fill="none" stroke={T} strokeWidth={20} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - k / total)} transform="rotate(-90 130 130)" style={{ transition: `stroke-dashoffset ${TICK_GAP}s linear` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
        <div style={{ fontSize: 68, fontWeight: 700, color: TEAL_D, lineHeight: 1.15, fontVariantNumeric: 'tabular-nums', minWidth: '4.6ch', textAlign: 'center', whiteSpace: 'nowrap' }}>
          {k}
          <span style={{ fontSize: 34, color: DIM }}>/{total}</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: INK, marginTop: 6 }}>checks OK</div>
      </div>
    </div>
  );
}

export function SiteCheck({ groups, focusN }: { groups: CheckGroup[]; focusN: number | null }) {
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const cols = [groups.slice(0, 4), groups.slice(4)];
  let k = 0;
  const startOf = new Map<number, number>();
  for (const g of groups) {
    startOf.set(g.n, k);
    k += g.items.length;
  }
  const readyAt = TICK0 + total * TICK_GAP + 0.3;
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '330px minmax(0, 1fr) minmax(0, 1fr)', gap: 26 }}>
        {/* the gauge and the everyday picture */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center', paddingRight: 22, borderRight: '1px solid var(--line)' }}>
          <div style={{ fontSize: 23, color: DIM, lineHeight: 1.4 }}>
            Like walking the site before work starts: <b style={{ color: INK }}>every check must pass</b> before any AI runs.
          </div>
          <Gauge total={total} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: readyAt, duration: 0.4, ease: EASE }} style={{ padding: '8px 26px', borderRadius: 999, background: TEAL, color: '#fff', fontSize: 26, fontWeight: 700, letterSpacing: '0.08em' }}>
            READY
          </motion.div>
        </div>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {col.map((g) => {
              const lit = focusN === null || focusN === g.n;
              const s0 = startOf.get(g.n) ?? 0;
              return (
                <div key={g.n} data-check-group={g.n} style={{ flex: `${g.items.length + 1} 0 auto`, borderRadius: 14, border: `2px solid ${focusN === g.n ? TEAL : 'var(--line)'}`, background: focusN === g.n ? TINT : 'rgba(127,127,127,0.06)', padding: '10px 16px', opacity: lit ? 1 : 0.35, transition: 'opacity 300ms', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <Num n={g.n} size={30} on={lit} />
                    <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>{g.group}</span>
                  </div>
                  {g.items.map((it, j) => (
                    <div key={it} data-check={it} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 19, color: INK, lineHeight: 1.35 }}>
                      <svg width={20} height={20} viewBox="0 0 20 20" aria-hidden style={{ flex: 'none' }}>
                        <circle cx="10" cy="10" r="9" fill="none" stroke={G} strokeWidth={1.6} />
                        <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: TICK0 + (s0 + j + 1) * TICK_GAP, duration: 0.25 }} style={{ transformOrigin: '10px 10px' }}>
                          <circle cx="10" cy="10" r="10" fill={T} />
                          <path d="M5.5 10.5l3 3 6-7" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.g>
                      </svg>
                      <span style={{ overflowWrap: 'anywhere', minWidth: 0 }}>{it}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Fill>
  );
}
