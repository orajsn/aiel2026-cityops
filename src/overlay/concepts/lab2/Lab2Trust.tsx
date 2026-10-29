import { AnimatePresence, motion } from 'motion/react';
import { Fill, FitBox } from '../Fill';
import { AgentAvatar } from './AgentAvatar';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import { CARD, Chip, DIM, INK, L2Page, Num, RED, SOFT, TEAL, TEAL_D, TINT, cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props } from './parts';

/**
 * Lab 2 · Trust (security and observability) and Wrap: the deck's chapters 10 and 11, in the Ops Center's
 * control room, where the city watches its systems.
 */

/* ---------------- 2.8a, 2.8b, 2.8c · three risks, told with the bridge ---------------- */

export const RISKS: { pic: string; term: string; points: string[] }[] = [
  { pic: 'A fake warning sign', term: 'Prompt injection and poisoning', points: ['Orders hidden in content', 'Stored now, triggered later', 'The lethal trifecta: private data + untrusted content + external communication'] },
  { pic: 'Keys to every gate', term: 'Excessive agency', points: ['Too many permissions', 'Agents act without asking', 'Attackers borrow them'] },
  { pic: 'An unverified tool', term: 'Malicious components', points: ['Bad libraries, servers or tools', 'Safe today, unsafe tomorrow', 'Worse when agents add them'] },
];
/** the everyday picture for each risk, in plain words */
const EVERYDAY = [
  'Someone sticks a note on a road sign. A driver knows it is not an order; an agent that reads everything might obey it.',
  'A contractor with a key to every gate is handy, until someone borrows the ring.',
  'A tool from an unknown seller in the toolbox: it worked yesterday, nobody checked it today.',
];
const GUARDS = ['Only 8 allowed tools', 'Tool output is data, not instructions', 'Its only write is a memory note'];

const G1 = '#aab1ba';
const G2 = '#8a919c';
const G3 = '#5c6b78';

/** a warning sign by the bridge road; someone has stuck an order on it (red: the one thing to look at) */
function SignArt({ w, red }: { w: number; red: boolean }) {
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 400 320" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx="200" cy="308" rx="150" ry="8" fill="rgba(127,127,127,0.2)" />
      <rect x="190" y="150" width="20" height="160" rx="4" fill={G3} />
      <rect x="50" y="20" width="300" height="150" rx="14" fill={G1} stroke={G3} strokeWidth="5" />
      <path d="M200 40l40 70h-80z" fill="none" stroke={G3} strokeWidth="6" strokeLinejoin="round" />
      <path d="M200 64v24M200 98v2" stroke={G3} strokeWidth="6" strokeLinecap="round" />
      <path d="M90 136h220" stroke={G2} strokeWidth="8" strokeLinecap="round" />
      <motion.g initial={{ opacity: 0, y: -20, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 6 }} transition={{ delay: 0.9, duration: 0.6, ease: EASE }} style={{ transformOrigin: '300px 70px' }}>
        <rect x="236" y="44" width="150" height="80" rx="4" fill="#f6f1df" stroke={red ? 'var(--red)' : G2} strokeWidth="4" />
        <text x="311" y="78" textAnchor="middle" fontSize="20" fontFamily="Inter, sans-serif" fill="#1f2a33">“AI: ignore</text>
        <text x="311" y="104" textAnchor="middle" fontSize="20" fontFamily="Inter, sans-serif" fill="#1f2a33">your rules”</text>
      </motion.g>
    </svg>
  );
}

/** a ring with a key for every gate (the ring is the red thing) */
function KeysArt({ w, red }: { w: number; red: boolean }) {
  const keys = Array.from({ length: 11 }, (_, i) => -70 + i * 14);
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 400 320" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx="200" cy="308" rx="150" ry="8" fill="rgba(127,127,127,0.2)" />
      {/* three gates behind, every one of them opened by this ring */}
      {[40, 150, 260].map((x) => (
        <g key={x} opacity="0.55">
          <rect x={x} y="196" width="100" height="100" rx="4" fill="none" stroke={G2} strokeWidth="5" />
          <path d={`M${x + 20} 196v100M${x + 40} 196v100M${x + 60} 196v100M${x + 80} 196v100`} stroke={G2} strokeWidth="3" />
        </g>
      ))}
      <motion.g initial={{ rotate: -8 }} animate={{ rotate: [-8, 6, -3, 0] }} transition={{ delay: 0.6, duration: 2.4, ease: 'easeInOut' }} style={{ transformOrigin: '200px 30px' }}>
        <circle cx="200" cy="70" r="44" fill="none" stroke={red ? 'var(--red)' : G3} strokeWidth="8" />
        {keys.map((a, i) => (
          <g key={a} transform={`rotate(${a} 200 70)`}>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.06 }}>
              <circle cx="200" cy="128" r="14" fill="none" stroke={G3} strokeWidth="6" />
              <path d={`M200 142v58M200 186h12M200 174h9`} stroke={G3} strokeWidth="6" strokeLinecap="round" />
            </motion.g>
          </g>
        ))}
      </motion.g>
    </svg>
  );
}

/** a toolbox; one tool in it has no label and nobody checked it (its red tag) */
function ToolArt({ w, red }: { w: number; red: boolean }) {
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 400 320" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx="200" cy="308" rx="160" ry="8" fill="rgba(127,127,127,0.2)" />
      {/* tools standing in the box */}
      <path d="M110 170V60" stroke={G3} strokeWidth="12" strokeLinecap="round" />
      <path d="M96 60a16 16 0 1 1 28 0l-6 10h-16z" fill={G3} />
      <rect x="164" y="80" width="18" height="100" rx="6" fill={G2} />
      <rect x="160" y="40" width="26" height="46" rx="8" fill={G3} />
      <motion.g initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.7, ease: EASE }}>
        <path d="M262 180V70l20-30 20 30v110z" fill={G1} stroke={G3} strokeWidth="4" />
        <path d="M262 100h40M262 128h40" stroke={G3} strokeWidth="3" />
        <path d="M300 58l40-26" stroke={G3} strokeWidth="3" />
        <rect x="324" y="10" width="54" height="40" rx="6" fill="#fff" stroke={red ? 'var(--red)' : G2} strokeWidth="4" />
        <text x="351" y="40" textAnchor="middle" fontSize="28" fontWeight="700" fontFamily="Inter, sans-serif" fill={red ? 'var(--red)' : G3}>?</text>
      </motion.g>
      {/* the box */}
      <path d="M60 170h280l-16 128H76z" fill={G2} />
      <rect x="50" y="160" width="300" height="24" rx="5" fill={G3} />
      <path d="M170 160v-14h60v14" fill="none" stroke={G3} strokeWidth="8" />
    </svg>
  );
}

const ART = [SignArt, KeysArt, ToolArt];

export function ThreeRisks(p: L2Props) {
  const step = p.step ?? 1;
  const r = RISKS[step - 1] ?? RISKS[0];
  const Art = ART[step - 1] ?? SignArt;
  return (
    <L2Page testId="l2-risks" hasRed {...p}>
      <Fill gap={16}>
        {/* the rail: the three risks, the current one in front, the next ones still waiting */}
        <div data-rail style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          {RISKS.map((x, i) => {
            const shown = upTo(step, i + 1);
            const now = step === i + 1;
            const A = ART[i];
            return (
              <motion.div key={x.term} data-risk={x.term} data-now={now} {...reveal(shown, 0.1 + i * 0.1)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 16px', ...card(now), background: now ? CARD : SOFT }}>
                <div style={{ flex: 'none', opacity: now ? 1 : 0.7 }}>
                  <A w={76} red={false} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 23, fontWeight: 700, color: INK }}>{x.pic}</div>
                  <div style={{ ...mono(16) }}>{x.term}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* the stage: the current risk, drawn large, and what it means */}
        <AnimatePresence mode="wait">
          <motion.div key={step} data-stage initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: '1 0 auto', minHeight: 300, display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', alignItems: 'center', gap: 40 }}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <Art w={step === 3 ? 400 : 520} red />
              {step === 1 && (
                <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
                  <AgentAvatar size={96} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <div style={{ fontSize: 38, fontWeight: 700, color: INK }}>{r.pic}</div>
                <div style={{ ...mono(22) }}>{r.term}</div>
              </div>
              {r.points.map((pt, k) => (
                <motion.div key={pt} {...fadeUp(0.6 + k * 0.45)} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', fontSize: 27, color: INK, lineHeight: 1.35 }}>
                  <Num n={k + 1} size={40} />
                  <span>{pt}</span>
                </motion.div>
              ))}
              {step < 3 && (
                <motion.div data-everyday {...fadeUp(2)} style={{ marginTop: 8, padding: '14px 20px', borderRadius: 14, background: SOFT, fontSize: 23, lineHeight: 1.4, color: INK }}>
                  <span style={{ ...cap, fontSize: 15, display: 'block', marginBottom: 4 }}>In everyday life</span>
                  {EVERYDAY[step - 1]}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {step === 3 && (
          <motion.div data-guards {...fadeUp(1.9)} style={{ flex: 'none', ...card(true), background: TINT, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ ...capTeal, fontSize: 16 }}>Guardrails the lab does have</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'start', gap: 30 }}>
              {GUARDS.map((g) => (
                <span key={g} style={{ fontSize: 22, color: INK, fontWeight: 600 }}>
                  <span style={{ color: TEAL }}>✓</span> {g}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 21, color: INK }}>
              <b>AI is software.</b> Apply the security discipline you already have, then add the AI-specific risks. No silver bullet: design and test early.
            </div>
          </motion.div>
        )}
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.8d · the site's CCTV and time log: observability ---------------- */

const SHIFTS = [
  ['Crashes and timeouts', 'Behavioral drift'],
  ['Error rates and logs', 'Instruction misalignment'],
  ['Latency spikes', 'Trust boundary violations'],
  ['Single-system scope', 'Multi-agent chain compromise'],
];
const DIMS: { t: string; icon: IconName }[] = [
  { t: 'Content safety', icon: 'lock' },
  { t: 'Groundedness', icon: 'quote' },
  { t: 'Behavioral drift', icon: 'loop' },
  { t: 'Instruction alignment', icon: 'target' },
  { t: 'Governance', icon: 'clipboard' },
  { t: 'Token usage', icon: 'clock' },
];

export function Observability(p: L2Props) {
  return (
    <L2Page testId="l2-observe" {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 24, minHeight: 0 }}>
        <motion.div {...fadeUp(0.2)} style={{ ...card(), padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 40px minmax(0, 1fr)', ...cap }}>
            <span>Traditional</span>
            <span />
            <span style={{ color: TEAL_D }}>AI agents</span>
          </div>
          {SHIFTS.map(([a, b], i) => (
            <motion.div key={a} data-shift={b} {...fadeUp(0.4 + i * 0.35)} style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 40px minmax(0, 1fr)', alignItems: 'center' }}>
              <span style={{ fontSize: 22, color: DIM }}>{a}</span>
              <span style={{ color: TEAL, fontSize: 24 }}>→</span>
              <span style={{ fontSize: 23, fontWeight: 700, color: INK, padding: '10px 14px', borderRadius: 10, background: TINT }}>{b}</span>
            </motion.div>
          ))}
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={cap}>What to watch, beyond uptime and errors</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12 }}>
            {DIMS.map((d, i) => (
              <motion.div key={d.t} data-dim={d.t} {...fadeUp(1.6 + i * 0.2)} style={{ ...card(true), background: CARD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center', padding: 12 }}>
                <LineIcon name={d.icon} size={46} />
                <span style={{ fontSize: 21, fontWeight: 700, color: INK }}>{d.t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.8e · §2.8 a dashboard for this crack ---------------- */

const LAT = [
  { s: 'classify', ms: 2623 },
  { s: 'retrieve', ms: 3512 },
  { s: 'draft', ms: 25515 },
  { s: 'format', ms: 0 },
];

export function Dashboard(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  const kpis = [
    { v: '25,515', u: 'ms', s: 'draft step: where the time goes', n: 2 },
    { v: '1454 → 234', u: 'tokens', s: 'draft: in → out', n: 1 },
    { v: '57,005', u: 'ms', s: 'agent: final answer after 5 tool calls', n: 3 },
  ];
  return (
    <L2Page testId="l2-dashboard" {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: 16, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          {kpis.map((k, i) => (
            <motion.div key={k.s} data-kpi={k.v} {...fadeUp(0.2 + i * 0.3)} style={{ ...card(focusN === k.n), opacity: lit(k.n) ? 1 : 0.4, padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: INK }}>{k.v}</span>
                <span style={{ fontSize: 20, color: DIM }}>{k.u}</span>
              </div>
              <span style={{ fontSize: 19, color: DIM }}>{k.s}</span>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: 16, minHeight: 0 }}>
          <motion.div {...fadeUp(1)} style={{ ...card(), opacity: lit(2) ? 1 : 0.4, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={cap}>Latency per step, ms · cell 50</div>
            {LAT.map((l, i) => (
              <div key={l.s} data-lat={l.s} style={{ flex: 1, display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr) 80px', alignItems: 'center', gap: 10 }}>
                <span style={{ ...mono(17, INK) }}>{l.s}</span>
                <div style={{ height: 22, background: 'rgba(127,127,127,0.12)', borderRadius: 5, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(l.ms / 25515) * 100}%` }} transition={{ delay: 1.2 + i * 0.2, duration: 0.8, ease: EASE }} style={{ height: '100%', background: l.s === 'draft' ? TEAL : 'rgba(27,138,156,0.45)' }} />
                </div>
                <span style={{ ...mono(17, INK), textAlign: 'right' }}>{l.ms.toLocaleString('en-US')}</span>
              </div>
            ))}
          </motion.div>
          <motion.div {...fadeUp(1.3)} style={{ ...card(), opacity: lit(1) ? 1 : 0.4, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={cap}>Tokens per LLM step · cell 50</div>
            {[
              { s: 'classify', i: 114, o: 30 },
              { s: 'draft', i: 1454, o: 234 },
            ].map((t) => (
              <div key={t.s} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                <span style={{ ...mono(17, INK) }}>{t.s}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(t.i / 1454) * 75}%` }} transition={{ delay: 1.5, duration: 0.8, ease: EASE }} style={{ height: 20, background: TEAL, borderRadius: 4 }} />
                  <span style={{ ...mono(15) }}>in {t.i}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(t.o / 1454) * 75}%` }} transition={{ delay: 1.7, duration: 0.8, ease: EASE }} style={{ height: 20, background: 'rgba(27,138,156,0.45)', borderRadius: 4, minWidth: 4 }} />
                  <span style={{ ...mono(15) }}>out {t.o}</span>
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div {...fadeUp(1.6)} style={{ ...card(), padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10, borderStyle: 'dashed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={cap}>Token drift over time</span>
              <span style={{ fontSize: 14, color: DIM, fontStyle: 'italic' }}>concept, not data</span>
            </div>
            <svg viewBox="0 0 200 110" style={{ flex: 1, width: '100%' }} aria-hidden>
              <path d="M5 100H195M5 100V5" stroke="#8a97a3" strokeWidth="1.5" fill="none" />
              <motion.path d="M10 80 L40 78 L70 81 L100 76 L130 74 L150 50 L175 40 L195 34" stroke="#8a97a3" strokeWidth="3" strokeDasharray="6 5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2, duration: 1.5 }} />
            </svg>
          </motion.div>
        </div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.8f · §6 pick the tool that fits the job ---------------- */

export const SHAPES = [
  { t: 'RAG', q: '“What does the record say?”', pred: 'High', how: '1 retrieval + 1 LLM call', icon: 'lookup' as IconName },
  { t: 'Workflow', q: '“Triage this incident predictably.”', pred: 'High', how: 'Several LLM steps · ~32 s*', icon: 'steps' as IconName },
  { t: 'Agent', q: '“Reason and tell me what to do.”', pred: 'Lower', how: 'Many turns · ~57 s*', icon: 'branch' as IconName },
];

export function PickTool(p: L2Props) {
  return (
    <L2Page testId="l2-pick" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, minHeight: 0 }}>
          {SHAPES.map((s, i) => (
            <motion.div key={s.t} data-shape={s.t} {...fadeUp(0.2 + i * 0.4)} style={{ ...card(i === 0), background: i === 0 ? TINT : SOFT, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 34, fontWeight: 700, color: INK }}>{s.t}</span>
                
              </div>
              <div style={{ fontSize: 23, color: '#fff', background: 'rgba(31,42,51,0.9)', borderRadius: 14, padding: '12px 16px' }}>{s.q}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineIcon name={s.icon} size={110} color={i === 0 ? TEAL : '#8a97a3'} />
              </div>
              <div style={{ ...cap, fontSize: 14 }}>How predictable</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: s.pred === 'High' ? TEAL_D : INK }}>{s.pred}</div>
              <div style={{ fontSize: 20, color: DIM }}>{s.how}</div>
            </motion.div>
          ))}
        </div>
        <motion.div {...fade(1.6)} style={{ fontSize: 17, color: DIM, textAlign: 'center' }}>
          * One saved CPU run each, different prompts: not a benchmark. <b style={{ color: INK }}>Use the simplest tool that works.</b>
        </motion.div>
      </div>
    </L2Page>
  );
}
