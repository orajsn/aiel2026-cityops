import { motion } from 'motion/react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import { CARD, Chip, DIM, INK, L2Page, Num, RED, SOFT, TEAL, TEAL_D, TINT, cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props } from './parts';

/**
 * Lab 2 · Trust (security and observability) and §6 Wrap: the deck's chapters 10 and 11, in the Ops Center's
 * control room, where the city watches its systems.
 */

/* ---------------- 2.8a, 2.8b, 2.8c · three risks, told with the bridge ---------------- */

export const RISKS: { pic: string; term: string; icon: IconName; points: string[] }[] = [
  { pic: 'A fake warning sign', term: 'Prompt injection and poisoning', icon: 'speech', points: ['Orders hidden in content', 'Stored now, triggered later', 'The lethal trifecta: private data + untrusted content + external communication'] },
  { pic: 'Keys to every gate', term: 'Excessive agency', icon: 'lock', points: ['Too many permissions', 'Agents act without asking', 'Attackers borrow them'] },
  { pic: 'An unverified tool', term: 'Malicious components', icon: 'wrench', points: ['Bad libraries, servers or tools', 'Safe today, unsafe tomorrow', 'Worse when agents add them'] },
];
const GUARDS = ['Only 8 allowed tools', 'Tool output is data, not instructions', 'Its only write is a memory note'];

export function ThreeRisks(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-risks" hasRed {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, minHeight: 0 }}>
          {RISKS.map((r, i) => {
            const shown = upTo(step, i + 1);
            const now = step === i + 1;
            return (
              <motion.div key={r.term} data-risk={r.term} data-now={now} {...reveal(shown, 0.2)} style={{ ...card(), background: now ? CARD : SOFT, borderTop: `6px solid ${now ? RED : '#8a97a3'}`, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <LineIcon name={r.icon} size={52} color={now ? RED : '#8a97a3'} />
                  <div>
                    <div style={{ fontSize: 27, fontWeight: 700, color: INK }}>{r.pic}</div>
                    <div style={{ ...mono(18) }}>{r.term}</div>
                  </div>
                </div>
                {r.points.map((pt, k) => (
                  <motion.div key={pt} {...reveal(shown, 0.5 + k * 0.3)} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 21, color: INK, lineHeight: 1.35 }}>
                    <Num n={k + 1} size={30} on={now} />
                    <span>{pt}</span>
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </div>
        <motion.div data-guards {...reveal(upTo(step, 3), 1.6)} style={{ ...card(true), background: TINT, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={capTeal}>Guardrails the lab does have</span>
          {GUARDS.map((g) => (
            <span key={g} style={{ fontSize: 20, color: INK, fontWeight: 600 }}>
              <span style={{ color: TEAL }}>✓</span> {g}
            </span>
          ))}
        </motion.div>
        <motion.div {...reveal(upTo(step, 3), 2)} style={{ alignSelf: 'center', fontSize: 21, color: INK }}>
          <b>AI is software.</b> Apply the security discipline you already have, then add the AI-specific risks. No silver bullet: design and test early.
        </motion.div>
      </div>
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
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, minHeight: 0 }}>
        <motion.div {...fadeUp(0.2)} style={{ ...card(), padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', ...cap }}>
            <span>Traditional</span>
            <span />
            <span style={{ color: TEAL_D }}>AI agents</span>
          </div>
          {SHIFTS.map(([a, b], i) => (
            <motion.div key={a} data-shift={b} {...fadeUp(0.4 + i * 0.35)} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 40px 1fr', alignItems: 'center' }}>
              <span style={{ fontSize: 22, color: DIM }}>{a}</span>
              <span style={{ color: TEAL, fontSize: 24 }}>→</span>
              <span style={{ fontSize: 23, fontWeight: 700, color: INK, padding: '10px 14px', borderRadius: 10, background: TINT }}>{b}</span>
            </motion.div>
          ))}
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={cap}>What to watch, beyond uptime and errors</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16, minHeight: 0 }}>
          <motion.div {...fadeUp(1)} style={{ ...card(), opacity: lit(2) ? 1 : 0.4, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={cap}>Latency per step, ms · cell 50</div>
            {LAT.map((l, i) => (
              <div key={l.s} data-lat={l.s} style={{ flex: 1, display: 'grid', gridTemplateColumns: '100px 1fr 80px', alignItems: 'center', gap: 10 }}>
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
  { t: 'RAG', sec: '§1', q: '“What does the record say?”', pred: 'High', how: '1 retrieval + 1 LLM call', icon: 'lookup' as IconName },
  { t: 'Workflow', sec: '§2', q: '“Triage this incident predictably.”', pred: 'High', how: 'Several LLM steps · ~32 s*', icon: 'steps' as IconName },
  { t: 'Agent', sec: '§3–§5', q: '“Reason and tell me what to do.”', pred: 'Lower', how: 'Many turns · ~57 s*', icon: 'branch' as IconName },
];

export function PickTool(p: L2Props) {
  return (
    <L2Page testId="l2-pick" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, minHeight: 0 }}>
          {SHAPES.map((s, i) => (
            <motion.div key={s.t} data-shape={s.t} {...fadeUp(0.2 + i * 0.4)} style={{ ...card(i === 0), background: i === 0 ? TINT : SOFT, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <LineIcon name={s.icon} size={56} />
                <span style={{ fontSize: 34, fontWeight: 700, color: INK }}>{s.t}</span>
                <Chip style={{ marginLeft: 'auto' }}>{s.sec}</Chip>
              </div>
              <div style={{ fontSize: 23, color: '#fff', background: 'rgba(31,42,51,0.9)', borderRadius: 14, padding: '12px 16px' }}>{s.q}</div>
              <div style={{ marginTop: 'auto', ...cap, fontSize: 14 }}>How predictable</div>
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
