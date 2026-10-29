import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Fill, FitBox } from '../Fill';
import { AgentAvatar } from './AgentAvatar';
import { Clipboard } from './Lab2Rag';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import { CARD, Chip, DIM, Folder, TINT2, INK, L2Page, Num, RED, SOFT, TEAL, TEAL_D, TINT, cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props } from './parts';

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
        <text x="351" y="40" textAnchor="middle" fontSize="28" fontWeight="700" fontFamily="Inter, sans-serif" fill={G3}>?</text>
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
/** the agent's day on site, as the camera sees it (illustration: no times are claimed) */
const WORK = ['reads the report', 'looks up history', 'checks work orders', 'decides', 'writes a note'];

/** a CCTV camera on a wall bracket, with its small light */
function Cctv() {
  return (
    <svg width="190" height="150" viewBox="0 0 190 150" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <rect x="4" y="10" width="16" height="130" rx="4" fill="#5c6b78" />
      <path d="M20 40h40v14H20z" fill="#5c6b78" />
      <g transform="rotate(14 60 47)">
        <rect x="56" y="26" width="110" height="46" rx="10" fill="#aab1ba" stroke="#5c6b78" strokeWidth="4" />
        <rect x="160" y="34" width="22" height="30" rx="4" fill="#5c6b78" />
        <rect x="56" y="18" width="116" height="10" rx="4" fill="#8a919c" />
        <motion.circle cx="76" cy="49" r="6" fill={TEAL} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </g>
    </svg>
  );
}

export function Observability(p: L2Props) {
  return (
    <L2Page testId="l2-observe" {...p}>
      <Fill gap={16}>
        {/* the site, under the camera: the agent's steps, and the time log under them */}
        <FitBox w={1400} h={230} max={1.05}>
          <div data-site style={{ position: 'relative', width: 1400, height: 230 }}>
            <motion.div {...fade(0.2)} style={{ position: 'absolute', left: 0, top: 0 }}>
              <Cctv />
            </motion.div>
            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} width="1400" height="230" viewBox="0 0 1400 230" aria-hidden style={{ position: 'absolute', left: 0, top: 0 }}>
              <path d="M186 60 L1400 0 L1400 176 L186 96 Z" fill="rgba(27,138,156,0.10)" />
            </motion.svg>
            <motion.div {...fadeUp(0.8)} style={{ position: 'absolute', left: 230, top: 30 }}>
              <AgentAvatar size={84} live />
            </motion.div>
            {WORK.map((w, i) => (
              <motion.div key={w} data-work={w} {...fadeUp(1 + i * 0.3)} style={{ position: 'absolute', left: 340 + i * 212, top: 44, width: 196, boxSizing: 'border-box', padding: '12px 10px', borderRadius: 12, background: CARD, border: `2px solid ${TEAL}`, textAlign: 'center', fontSize: 21, fontWeight: 600, color: INK }}>
                {w}
              </motion.div>
            ))}
            {/* the time log: a ruler under the steps, a light walking it */}
            <motion.div {...fade(2.4)} style={{ position: 'absolute', left: 340, right: 0, top: 150, height: 34, borderTop: `3px solid ${'#5c6b78'}`, backgroundImage: 'repeating-linear-gradient(90deg, #8a919c 0 2px, transparent 2px 53px)', backgroundSize: '100% 14px', backgroundRepeat: 'no-repeat' }}>
              <motion.span aria-hidden initial={{ left: '0%' }} animate={{ left: ['0%', '98%'] }} transition={{ delay: 2.8, duration: 6, ease: 'linear', repeat: Infinity, repeatDelay: 1.5 }} style={{ position: 'absolute', top: -9, width: 14, height: 14, borderRadius: '50%', background: TEAL }} />
            </motion.div>
            <motion.div {...fade(2.6)} style={{ position: 'absolute', left: 0, top: 168, width: 330, fontSize: 21, lineHeight: 1.3, color: INK }}>
              <b>CCTV</b>: what it did
              <br />
              <b>Time log</b>: how long, how much
            </motion.div>
            <motion.div {...fade(2.6)} style={{ position: 'absolute', left: 340, top: 192, fontSize: 17, color: DIM }}>steps: illustration</motion.div>
          </div>
        </FitBox>
        <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 24 }}>
          {/* what changes: the old failures cross out, the agent's ones arrive */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>Agents rarely crash. They drift.</div>
            {SHIFTS.map(([a, b], i) => (
              <motion.div key={a} data-shift={b} {...fadeUp(3 + i * 0.35)} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.85fr) 34px minmax(0, 1fr)', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 21, color: DIM, textDecoration: 'line-through', textDecorationColor: 'rgba(127,127,127,0.6)' }}>{a}</span>
                <span style={{ color: TEAL, fontSize: 24 }}>→</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: INK, padding: '6px 12px', borderRadius: 10, background: TINT }}>{b}</span>
              </motion.div>
            ))}
          </div>
          {/* what the camera and the log watch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>What to watch, beyond uptime</div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 10 }}>
              {DIMS.map((d, i) => (
                <motion.div key={d.t} data-dim={d.t} {...fadeUp(4.4 + i * 0.2)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, border: `2px solid ${TEAL}`, background: CARD }}>
                  <LineIcon name={d.icon} size={34} />
                  <span style={{ fontSize: 21, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{d.t}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Fill>
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

/** a car-dashboard dial: the needle swings up to `v` (0..1) */
function Dial({ v, delay }: { v: number; delay: number }) {
  return (
    <svg width="96" height="58" viewBox="0 0 96 58" aria-hidden style={{ flex: 'none', overflow: 'visible' }}>
      <path d="M8 52a40 40 0 0 1 80 0" fill="none" stroke="rgba(127,127,127,0.25)" strokeWidth="9" strokeLinecap="round" />
      <motion.path d="M8 52a40 40 0 0 1 80 0" fill="none" stroke={TEAL} strokeWidth="9" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: v }} transition={{ delay, duration: 1, ease: EASE }} />
      <motion.g initial={{ rotate: -90 }} animate={{ rotate: -90 + 180 * v }} transition={{ delay, duration: 1, ease: EASE }} style={{ transformOrigin: '48px 52px' }}>
        <path d="M48 52V20" stroke="#1f2a33" strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <circle cx="48" cy="52" r="6" fill="#1f2a33" />
    </svg>
  );
}

/** one column of the dashboard: its dial and number on top, its chart under it, in one box so the rows line up */
function Gauge({ n, focusN, delay, v, unit, sub, chartTitle, dial, children }: { n: number; focusN: number | null; delay: number; v: string; unit: string; sub: string; chartTitle: string; dial: number; children: ReactNode }) {
  const on = focusN === null || focusN === n;
  return (
    <motion.div data-kpi={v} data-step={n} data-on={on} {...fadeUp(delay)} style={{ ...card(focusN === n), background: CARD, opacity: on ? 1 : 0.4, transition: 'opacity 300ms', display: 'grid', gridTemplateRows: 'auto 1fr', minWidth: 0 }}>
      <div style={{ height: 122, boxSizing: 'border-box', padding: '14px 20px', borderBottom: '2px solid var(--line)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Dial v={dial} delay={delay + 0.3} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: INK, whiteSpace: 'nowrap' }}>{v}</span>
            <span style={{ fontSize: 20, color: DIM }}>{unit}</span>
          </div>
          <div style={{ fontSize: 19, color: DIM, lineHeight: 1.3 }}>{sub}</div>
        </div>
      </div>
      <div style={{ padding: '12px 20px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ ...cap, fontSize: 14 }}>{chartTitle}</div>
        {children}
      </div>
    </motion.div>
  );
}

export function Dashboard(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-dashboard" {...p}>
      <Fill gap={14}>
        {/* three columns, each a dial and its chart in one box: the upper and lower parts line up */}
        <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
          <Gauge n={2} focusN={focusN} delay={0.2} v="25,515" unit="ms" sub="draft step: where the time goes" chartTitle="Latency per step, ms · cell 50" dial={0.82}>
            {LAT.map((l, i) => (
              <div key={l.s} data-lat={l.s} style={{ flex: 1, display: 'grid', gridTemplateColumns: '92px minmax(0, 1fr) 76px', alignItems: 'center', gap: 10 }}>
                <span style={mono(18, INK)}>{l.s}</span>
                <div style={{ height: 22, background: 'rgba(127,127,127,0.12)', borderRadius: 5, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(l.ms / 25515) * 100}%` }} transition={{ delay: 0.8 + i * 0.2, duration: 0.8, ease: EASE }} style={{ height: '100%', background: l.s === 'draft' ? TEAL : 'rgba(27,138,156,0.45)' }} />
                </div>
                <span style={{ ...mono(18, INK), textAlign: 'right' }}>{l.ms.toLocaleString('en-US')}</span>
              </div>
            ))}
          </Gauge>
          <Gauge n={2} focusN={focusN} delay={0.5} v="1454 → 234" unit="tokens" sub="draft: words read in → written out" chartTitle="Tokens per LLM step · cell 50" dial={0.6}>
            {[
              { s: 'classify', i: 114, o: 30 },
              { s: 'draft', i: 1454, o: 234 },
            ].map((t) => (
              <div key={t.s} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                <span style={mono(18, INK)}>{t.s}</span>
                {[
                  { k: 'in', v: t.i, c: TEAL },
                  { k: 'out', v: t.o, c: 'rgba(27,138,156,0.45)' },
                ].map((b) => (
                  <div key={b.k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(b.v / 1454) * 72}%` }} transition={{ delay: 1.1, duration: 0.8, ease: EASE }} style={{ height: 20, background: b.c, borderRadius: 4, minWidth: 4 }} />
                    <span style={mono(16)}>
                      {b.k} {b.v}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </Gauge>
          <Gauge n={3} focusN={focusN} delay={0.8} v="57,005" unit="ms" sub="the agent, end to end" chartTitle="The agent’s trace · cell 79" dial={0.95}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AgentAvatar size={58} />
              {[1, 2, 3, 4, 5].map((k) => (
                <motion.span key={k} {...fadeUp(1.3 + k * 0.2)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 18, height: 2, background: TEAL }} />
                  <span style={{ width: 34, height: 34, borderRadius: '50%', border: `2px solid ${TEAL}`, background: TINT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...mono(15), fontWeight: 700 }}>{k}</span>
                </motion.span>
              ))}
            </div>
            <div style={{ fontSize: 19, color: DIM }}>5 tool calls, then the final answer</div>
          </Gauge>
        </div>
        {/* the drift line: a concept, not data */}
        <motion.div {...fadeUp(1.8)} style={{ flex: 'none', ...card(), borderStyle: 'dashed', display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', alignItems: 'center', gap: 20, padding: '10px 20px' }}>
          <div>
            <div style={{ fontSize: 23, fontWeight: 700, color: INK }}>Token drift over time</div>
            <div style={{ fontSize: 18, color: DIM, fontStyle: 'italic' }}>concept, not data</div>
          </div>
          <svg viewBox="0 0 600 70" preserveAspectRatio="none" style={{ width: '100%', height: 70 }} aria-hidden>
            <path d="M2 66H598" stroke="#8a97a3" strokeWidth="1.5" />
            <motion.path d="M4 54 L90 52 L180 55 L270 50 L360 48 L430 32 L510 22 L596 14" stroke="#8a97a3" strokeWidth="3" strokeDasharray="8 6" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.2, duration: 1.5 }} />
          </svg>
        </motion.div>
      </Fill>
    </L2Page>
  );
}


/* ---------------- 2.8f · §6 pick the tool that fits the job ---------------- */

export const SHAPES = [
  { t: 'RAG', q: '“What does the record say?”', pred: 'High', how: '1 retrieval + 1 LLM call' },
  { t: 'Workflow', q: '“Triage this incident predictably.”', pred: 'High', how: 'Several LLM steps · ~32 s*' },
  { t: 'Agent', q: '“Reason and tell me what to do.”', pred: 'Lower', how: 'Many turns · ~57 s*' },
];
/** how high each stair stands: one step up for each tool */
const STAIR = [0, 80, 160];

export function PickTool(p: L2Props) {
  const pics = [<Folder key="f" size={84} />, <Clipboard key="c" w={70} />, <AgentAvatar key="a" size={96} />];
  return (
    <L2Page testId="l2-pick" {...p}>
      <Fill gap={12}>
        <div data-stairs style={{ position: 'relative', flex: '1 0 auto', minHeight: 400, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'end' }}>
          {SHAPES.map((s, i) => (
            <motion.div key={s.t} data-shape={s.t} {...fadeUp(0.2 + i * 0.5)} style={{ position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              {/* what the tool is for, standing on its stair */}
              <div style={{ margin: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {pics[i]}
                  <span style={{ fontSize: 36, fontWeight: 700, color: INK }}>{s.t}</span>
                </div>
                <div style={{ fontSize: 23, color: '#fff', background: 'rgba(31,42,51,0.9)', borderRadius: 14, padding: '12px 16px' }}>{s.q}</div>
              </div>
              {/* the stair itself, with the facts written on it */}
              <motion.div initial={{ height: 0 }} animate={{ height: STAIR[i] + 130 }} transition={{ delay: 0.1 + i * 0.5, duration: 0.6, ease: EASE }} style={{ overflow: 'hidden', background: i === 0 ? TINT2 : 'rgba(127,127,127,0.16)', borderTop: `5px solid ${i === 0 ? TEAL : '#8a97a3'}`, padding: '12px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ ...cap, fontSize: 14 }}>How predictable</span>
                <span style={{ fontSize: 30, fontWeight: 700, color: s.pred === 'High' ? TEAL_D : INK }}>{s.pred}</span>
                <span style={{ fontSize: 21, color: DIM }}>{s.how}</span>
              </motion.div>
            </motion.div>
          ))}
          <motion.div {...fade(2.2)} style={{ position: 'absolute', left: 14, top: 0, fontSize: 24, color: TEAL_D, fontWeight: 600 }}>
            each stair up: more freedom, less predictable ↗
          </motion.div>
        </div>
        <motion.div {...fade(2.4)} style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
          <span style={{ fontSize: 23, color: INK }}>
            Start on the lowest stair that reaches the job: <b style={{ color: TEAL_D }}>use the simplest tool that works.</b>
          </span>
          <span style={{ fontSize: 16, color: DIM, flex: 'none' }}>* One saved CPU run each, different prompts: not a benchmark.</span>
        </motion.div>
      </Fill>
    </L2Page>
  );
}
