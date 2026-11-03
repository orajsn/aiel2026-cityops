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

const G = '#8a97a3';

/* ---------------- 0.5 · the workbench ---------------- */

const T = 'var(--teal)';

/**
 * 0.5 · The workbench (owner, 3 Nov, handoff page 6): the database with its embedding model | the Jupyter notebook that runs it all, with
 * its settings | the language model. Three labelled arrows say what travels: the query, the retrieved context, the prompt with context.
 * The embedding model sits inside the database; the language model is a different thing that only writes the answer.
 */
const SETTINGS: [string, string][] = [
  ['DB_USER', 'prism'],
  ['ONNX_MODEL', 'ALL_MINILM_L12_V2'],
  ['THREAD_ID', 'prism-agent-demo-001'],
  ['DEMO_ASSET', 'Harbor Bridge'],
];

/** a labelled arrow between two cards: `dir` is where it points */
function Flow({ dir, label, sub, delay }: { dir: 'left' | 'right'; label: string; sub?: string; delay: number }) {
  return (
    <motion.div data-flow={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: INK, lineHeight: 1.15 }}>{label}</div>
      {sub && <div style={{ fontSize: 17, color: DIM, lineHeight: 1.15 }}>{sub}</div>}
      <svg width="130" height="26" viewBox="0 0 130 26" aria-hidden="true" style={{ display: 'block' }}>
        <path d={dir === 'right' ? 'M4 13H118' : 'M126 13H12'} stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
        <path d={dir === 'right' ? 'M104 3l20 10-20 10z' : 'M26 3L6 13l20 10z'} fill={TEAL} />
      </svg>
    </motion.div>
  );
}

const roleCap = (text: string, dark = false) => (
  <span style={{ alignSelf: 'center', padding: '6px 20px', borderRadius: 999, background: dark ? TEAL : TINT2_, color: dark ? '#fff' : INK, fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center', maxWidth: '100%' }}>{text}</span>
);
const TINT2_ = 'rgba(27, 138, 156, 0.18)';

export function Bench({ focusN }: { focusN: number | null }) {
  const on = (n: number) => focusN === null || focusN === n;
  const card = (n: number): React.CSSProperties => ({ borderRadius: 22, border: `3px solid ${TEAL}`, background: 'rgba(27,138,156,0.07)', opacity: on(n) ? 1 : 0.4, transition: 'opacity 300ms' });
  return (
    <Fill gap={18}>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.12fr) 150px minmax(0, 1.8fr) 150px minmax(0, 1fr)', alignItems: 'center', columnGap: 6 }}>
        {/* 1 · the database, with the embedding model inside it */}
        <motion.div data-bench={1} initial={{ opacity: 0, y: 14 }} animate={{ opacity: on(1) ? 1 : 0.4, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: EASE }} style={{ ...card(1), padding: '20px 18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', paddingRight: 36 }}>
            <Db size={150} />
            <svg width={64} height={64} viewBox="0 0 84 84" aria-hidden style={{ position: 'absolute', right: -6, bottom: 0 }}>
              <circle cx="42" cy="42" r="38" fill={CARD} stroke={T} strokeWidth={3} />
              <g transform="translate(14 22) scale(0.52)">
                {[[10, 30], [10, 60], [55, 15], [55, 45], [55, 75], [100, 30], [100, 60]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill={TINT} stroke={T} strokeWidth="4" />)}
                <path d="M18 30l29-15M18 30l29 15M18 60l29-15M18 60l29 15M63 15l29 15M63 45l29-15M63 45l29 15M63 75l29-15" stroke={T} strokeWidth="2.5" opacity="0.6" />
              </g>
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: INK, textAlign: 'center', lineHeight: 1.15 }}>Oracle AI Database 26ai</div>
          <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14, background: CARD, border: `2px solid ${TEAL}` }}>
            <Net w={64} />
            <div>
              <div style={{ fontSize: 23, fontWeight: 700, color: TEAL_D }}>Embedding model</div>
              <div style={{ fontSize: 19, color: DIM, lineHeight: 1.2 }}>PRISM data + embedding model</div>
            </div>
          </div>
        </motion.div>
        {/* the two arrows between the database and the notebook */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Flow dir="left" label="Query" sub="(SQL + similarity)" delay={1.2} />
          <Flow dir="right" label="Context" sub="(retrieved records)" delay={1.6} />
        </div>
        {/* 2 · the notebook: the orchestration hub, with the settings */}
        <motion.div data-bench={3} initial={{ opacity: 0, y: 14 }} animate={{ opacity: on(3) ? 1 : 0.4, y: 0 }} transition={{ delay: 0.5, duration: 0.5, ease: EASE }} style={{ ...card(3), background: CARD, overflow: 'hidden' }}>
          <div style={{ background: TEAL, color: '#fff', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <svg width="74" height="62" viewBox="0 0 74 62" aria-hidden="true" style={{ flex: 'none' }}>
              <circle cx="37" cy="31" r="18" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="70 30" />
              <circle cx="12" cy="10" r="4" fill="#fff" />
              <circle cx="62" cy="52" r="4" fill="#fff" />
              <circle cx="64" cy="12" r="2.6" fill="#fff" />
            </svg>
            <div>
              <div style={{ fontSize: 31, fontWeight: 700, lineHeight: 1.1 }}>Jupyter notebook</div>
              <div style={{ fontSize: 24, opacity: 0.92 }}>Orchestration hub</div>
            </div>
          </div>
          <div style={{ padding: '14px 22px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(27,138,156,0.16)', color: TEAL_D, fontSize: 24, fontWeight: 600, textAlign: 'center' }}>Configuration + SQL + Python</div>
            <div data-settings style={{ border: '1.5px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '6px 14px', background: 'rgba(27,138,156,0.12)', fontSize: 20, fontWeight: 700, color: INK }}>Settings</div>
              {SETTINGS.map(([k, v], i) => (
                <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.2, duration: 0.3 }} style={{ display: 'grid', gridTemplateColumns: '150px 24px 1fr', alignItems: 'center', padding: '6px 14px', borderTop: '1px solid var(--line)', fontFamily: MONO, fontSize: 20, whiteSpace: 'nowrap' }}>
                  <span style={{ color: INK }}>{k}</span>
                  <span style={{ color: DIM }}>=</span>
                  <span style={{ color: TEAL_D, fontWeight: 700 }}>{v}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Flow dir="right" label="Prompt +" sub="context" delay={2.1} />
        </div>
        {/* 3 · the language model, a different thing from the embedding model: it only writes the answer */}
        <motion.div data-bench={2} initial={{ opacity: 0, y: 14 }} animate={{ opacity: on(2) ? 1 : 0.4, y: 0 }} transition={{ delay: 0.8, duration: 0.5, ease: EASE }} style={{ ...card(2), padding: '20px 18px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            <ChiefInspector size={140} grey label="the language model" />
            <div style={{ marginBottom: 14, padding: '8px 10px', borderRadius: 12, background: CARD, border: `2px solid ${TEAL}` }}>
              <Net w={78} live />
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: INK, textAlign: 'center', lineHeight: 1.15 }}>Language model</div>
          <div style={{ fontSize: 22, color: DIM, textAlign: 'center', lineHeight: 1.25 }}>A local 3B model<br />for this lab</div>
        </motion.div>
      </div>
      {/* what each one does */}
      <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'minmax(0, 1.12fr) 150px minmax(0, 1.8fr) 150px minmax(0, 1fr)', columnGap: 6 }}>
        {[
          { c: 1, cap: 'Database (with embedding model)', dark: false, text: 'Stores PRISM data and the embedding model (vector search)' },
          { c: 3, cap: 'Jupyter notebook (orchestration)', dark: true, text: 'Runs the workflow: query data, retrieve context, and call the language model' },
          { c: 5, cap: 'Language model', dark: false, text: 'Generates the response from the provided context' },
        ].map((r) => (
          <motion.div key={r.c} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 0.5 }} style={{ gridColumn: r.c, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roleCap(r.cap, r.dark)}
            <div style={{ fontSize: 22, color: INK, textAlign: 'center', lineHeight: 1.3 }}>{r.text}</div>
          </motion.div>
        ))}
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
