import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { WidePanel } from '../WidePanel';
import { Avatar, BridgeSide, CARD, Chip, DbIcon, DIM, Fill, Flow, HandsOn, Net, PdfIcon, SOFT, SteelPhoto, Shield, TEAL, TEAL_D, TINT, cap, capTeal, card, fade, fadeUp } from './parts';
import type { Lab1Props } from './parts';

/**
 * Lab 1 · AI Economics, the opening and the problem (V2, from the real workshop guide). No red on these pages.
 *   L1Opening   1.0  three questions, one AI assistant (Seer Construction Intelligence), the engineer decides, five hands-on steps
 *   L1Damage    1.1  what the inspection found on Harbor Bridge, and the facts the project manager gathers
 *   L1Scattered 1.2  three questions, three places, three ways by hand
 */

export const QUESTIONS = ['What does the specification require?', 'Which supplier is ready?', 'What does this delivery photo show?'] as const;

/** a small steel-delivery thumbnail for the third question */
function PhotoThumb({ w = 44 }: { w?: number }) {
  return <SteelPhoto w={w} label={false} />;
}
const Q_ICON: ReactNode[] = [<PdfIcon key="p" size={34} />, <DbIcon key="d" size={32} />, <PhotoThumb key="s" />];

/* ---------- 1.0 · today's assistant ---------- */

const JOBS = [
  { title: 'Searches the specification', sub: 'finds the passage and cites it', n: 1 },
  { title: 'Looks up governed project data', sub: 'suppliers, scoped to one project', n: 2 },
  { title: 'Reads a site photo', sub: 'says what it sees, and what it cannot tell', n: 3 },
];
export const HANDS_ON_STEPS = ['Unstructured RAG', 'Semantic Store', 'Run the app · 3A Build or 3B Launch', 'Model routing', 'Guardrails'];

function RouteIcon() {
  return (
    <svg width="34" height="28" viewBox="0 0 34 28" fill="none" stroke={TEAL} strokeWidth={2.6} strokeLinecap="round" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx="6" cy="14" r="4" fill={TEAL} />
      <path d="M10 14h6l8-9h6M16 14l8 9h6" />
    </svg>
  );
}

export function L1Opening({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-opening" kickerColor="var(--teal)">
      <Fill max={1.1}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 340fr) 46px minmax(0, 660fr) 46px minmax(0, 290fr)', alignItems: 'stretch', columnGap: 6, marginTop: 6, flex: 1 }}>
        {/* the three questions; each one's arrow sits in the gap beside it */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div {...fadeUp(0.2)} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar who="project manager" size={60} />
            <div>
              <div style={cap}>The project manager asks</div>
              <div style={{ fontSize: 19, color: 'var(--ink)' }}>three questions before the repair</div>
            </div>
          </motion.div>
          {QUESTIONS.map((q, i) => (
            <motion.div key={q} data-question={['spec', 'supplier', 'photo'][i]} {...fadeUp(0.4 + i * 0.3)} style={{ ...card(), position: 'relative', flex: 1, minHeight: 84, maxHeight: 130, display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', fontSize: 21, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>
              {Q_ICON[i]}
              <span>“{q}”</span>
              <span style={{ position: 'absolute', left: 'calc(100% + 8px)', top: '50%', marginTop: -10, display: 'flex' }}>
                <Flow w={42} delay={1.2 + i * 1.3} loop={i === 1} />
              </span>
            </motion.div>
          ))}
          <motion.div {...fade(1.6)} style={{ fontSize: 17, color: DIM, lineHeight: 1.4, marginTop: 'auto' }}>
            Each answer lives in a different place. One assistant reaches all three.
          </motion.div>
        </div>

        <div />

        {/* the one AI assistant */}
        <motion.div data-assistant {...fadeUp(0.8)} style={{ ...card(true), background: TINT, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Net w={84} live />
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>One AI assistant</div>
              <div style={{ fontSize: 18, color: DIM }}>
                you run it as <b style={{ color: TEAL_D }}>Seer Construction Intelligence</b>
              </div>
            </div>
          </div>
          {JOBS.map((j, i) => (
            <motion.div key={j.title} data-job={j.n} {...fadeUp(1.2 + i * 0.3)} style={{ ...card(), background: CARD, flex: 1, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 38, height: 38, borderRadius: '50%', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{j.n}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{j.title}</div>
                <div style={{ fontSize: 17, color: DIM }}>{j.sub}</div>
              </div>
              <HandsOn n={j.n} />
            </motion.div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 0.8 }}>
            <motion.div data-control="routing" {...fadeUp(2.2)} style={{ borderRadius: 10, background: SOFT, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <RouteIcon />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>The right model for each question</span>
                <HandsOn n={4} />
              </div>
            </motion.div>
            <motion.div data-control="guardrails" {...fadeUp(2.4)} style={{ borderRadius: 10, background: SOFT, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={32} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>Guardrails check every request first</span>
                <HandsOn n={5} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* the answer goes out */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={42} delay={2.8} />
        </div>

        {/* Harbor Bridge and the engineer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <motion.div {...fade(0.3)} style={{ borderRadius: 12, overflow: 'hidden' }}>
            <BridgeSide fluid />
          </motion.div>
          <motion.div data-engineer {...fadeUp(2.9)} style={{ ...card(), flex: 1, padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar who="engineer" size={60} />
              <div style={{ fontSize: 16, fontWeight: 600, color: DIM }}>the engineer</div>
            </div>
            <div style={{ fontSize: 21, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
              Answers with sources. <span style={{ color: TEAL_D }}>The engineer decides</span> on safety.
            </div>
          </motion.div>
          <div style={{ fontSize: 16, color: DIM, lineHeight: 1.4 }}>Harbor Bridge, Bangkok: the repair project the whole lab works on.</div>
        </div>
      </div>

      {/* the five hands-on steps */}
      <div style={{ ...cap, marginTop: 22, marginBottom: 10 }}>Your five hands-on steps</div>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 8 }}>
        {HANDS_ON_STEPS.map((h, i) => (
          <div key={h} style={{ display: 'contents' }}>
            {i > 0 && <span style={{ color: TEAL, fontSize: 24, flex: 'none', alignSelf: 'center' }}>→</span>}
            <motion.div data-hands-on={i + 1} {...fadeUp(3.2 + i * 0.12)} style={{ flex: i === 2 ? 1.6 : 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `2px solid rgba(27,138,156,0.35)`, background: CARD }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{i + 1}</span>
              <div style={{ lineHeight: 1.2, minWidth: 0 }}>
                <div style={{ ...cap, fontSize: 12 }}>Hands-on {i + 1}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{h}</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 1.1 · the bridge needs repair ---------- */

function Slab({ children }: { children: ReactNode }) {
  return (
    <svg width="210" height="123" viewBox="0 0 300 176" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none', borderRadius: 8 }}>
      <rect width="300" height="176" fill="#aab2bd" />
      <path d="M0 58h300M0 116h300" stroke="#8a919c" strokeWidth={1.5} opacity={0.6} />
      {children}
    </svg>
  );
}

const DAMAGE: { key: string; name: string; sub: string; art: ReactNode }[] = [
  {
    key: 'cracks',
    name: 'Cracks',
    sub: 'lines running through the concrete',
    art: (
      <Slab>
        <motion.path d="M110 0l14 38-18 30 22 34-12 74M124 38l34 14M112 68l-34 16" stroke="#3b4350" strokeWidth={5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.4 }} />
        <motion.path d="M214 10l-12 30 20 24-10 30" stroke="#3b4350" strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 1 }} />
      </Slab>
    ),
  },
  {
    key: 'spalling',
    name: 'Spalling concrete',
    sub: 'pieces of concrete breaking away',
    art: (
      <Slab>
        <path d="M100 40l50-16 46 18 18 40-16 42-50 12-42-22-8-44z" fill="#5d6772" stroke="#3b4350" strokeWidth={3} />
        <path d="M118 62l28-10 30 10 10 22-10 20-32 8-22-14z" fill="#7a838e" />
        <rect x="226" y="120" width="12" height="10" fill="#5d6772" />
        <rect x="244" y="136" width="9" height="8" fill="#5d6772" />
      </Slab>
    ),
  },
  {
    key: 'rebar',
    name: 'Exposed reinforcing steel',
    sub: 'rusty bars showing through',
    art: (
      <Slab>
        <path d="M60 36h170l30 30v50l-30 30H60l-26-30V66z" fill="#4c5560" stroke="#3b4350" strokeWidth={3} />
        {[56, 80, 104, 128].map((y) => (
          <rect key={y} x="44" y={y} width="210" height="8" rx="4" fill="#7d6e62" />
        ))}
        {[90, 130, 170, 210].map((x) => (
          <rect key={x} x={x} y="44" width="8" height="100" rx="4" fill="#7d6e62" />
        ))}
      </Slab>
    ),
  },
];

/** where each finding sits on the drawing (viewBox 700 x 434) */
const MARKS = [
  { key: 'cracks', x: 168, y: 280, label: 'Cracks' },
  { key: 'spalling', x: 350, y: 168, label: 'Spalling concrete' },
  { key: 'rebar', x: 532, y: 350, label: 'Exposed reinforcing steel' },
];

export function L1Damage({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-damage" kickerColor="var(--teal)">
      <Fill max={1.12}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 24, marginTop: 6, flex: 1 }}>
        <motion.div {...fade(0.2)} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', alignSelf: 'center' }}>
          <BridgeSide fluid>
            {MARKS.map((m, i) => (
              <g key={m.key} data-mark={m.key}>
                <motion.circle cx={m.x} cy={m.y} r={10} fill="none" stroke={TEAL} strokeWidth={3} initial={{ r: 10, opacity: 0.9 }} animate={{ r: [10, 26], opacity: [0.9, 0] }} transition={{ delay: 1.2 + i * 1.4, duration: 2.2, repeat: Infinity, repeatDelay: 2.4, ease: 'easeOut' }} />
                <circle cx={m.x} cy={m.y} r={9} fill={TEAL} stroke="#fff" strokeWidth={3} />
              </g>
            ))}
          </BridgeSide>
          <div style={{ position: 'absolute', left: 12, top: 12, padding: '4px 10px', borderRadius: 6, background: '#1f2a33', color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: 1.6 }}>HARBOR BRIDGE · WHAT THE INSPECTION FOUND</div>
          {MARKS.map((m, i) => (
            <motion.div key={m.key} {...fade(0.6 + i * 0.4)} style={{ position: 'absolute', left: `${(m.x / 700) * 100}%`, top: `calc(${(m.y / 434) * 100}% + 20px)`, transform: 'translateX(-50%)', padding: '4px 10px', borderRadius: 6, background: '#1f2a33', color: '#fff', fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>
              {m.label}
            </motion.div>
          ))}
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {DAMAGE.map((d, i) => (
            <motion.div key={d.key} data-damage={d.key} {...fadeUp(0.5 + i * 0.4)} style={{ ...card(), flex: 1, display: 'flex', alignItems: 'center', gap: 22, padding: '12px 18px' }}>
              {d.art}
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>{d.name}</div>
                <div style={{ fontSize: 19, color: DIM, marginTop: 2 }}>{d.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div data-handover {...fadeUp(2)} style={{ ...card(true), background: TINT, marginTop: 20, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div data-who="project manager" style={{ textAlign: 'center', flex: 'none' }}>
          <Avatar who="project manager" size={60} />
          <div style={{ fontSize: 14, fontWeight: 600, color: DIM, lineHeight: 1.1 }}>project manager</div>
        </div>
        <Flow w={40} delay={2.4} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...capTeal, marginBottom: 8 }}>Gathers the facts</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              [<PdfIcon key="p" size={30} />, 'what the specification requires'],
              [<DbIcon key="d" size={28} />, 'which supplier can deliver'],
              [<SteelPhoto key="s" w={40} label={false} />, 'what the site photos show'],
            ].map(([icon, t], i) => (
              <motion.span key={String(t)} data-fact={i} {...fadeUp(2.4 + i * 0.25)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, background: CARD, border: '1.5px solid var(--line)', fontSize: 18, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                {icon}
                {t}
              </motion.span>
            ))}
          </div>
        </div>
        <Flow w={40} delay={3.4} />
        <div data-who="engineer" style={{ textAlign: 'center', flex: 'none' }}>
          <Avatar who="engineer" size={60} />
          <div style={{ fontSize: 14, fontWeight: 600, color: DIM, lineHeight: 1.1 }}>engineer</div>
        </div>
        <div style={{ fontSize: 21, fontWeight: 700, color: 'var(--ink)', width: 210, lineHeight: 1.25 }}>assesses the damage and plans the repair</div>
      </motion.div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 1.2 · the data is in different places ---------- */

const PLACES = [
  { key: 'spec', icon: <PdfIcon size={76} />, title: 'The specification', sub: 'a long PDF in an Object Storage bucket', by: 'Read it page by page' },
  { key: 'data', icon: <DbIcon size={70} />, title: 'Governed project data', sub: 'tables in the Autonomous AI Database', by: 'Ask someone to write a query', fields: ['supplier', 'recommendation status', 'fit score', 'risk level', 'purchase orders'] },
  { key: 'photos', icon: <SteelPhoto w={110} label={false} />, title: 'Site photos', sub: 'a structural-steel delivery, from the site', by: 'Open each photo and look' },
];

function ByHandIcon({ i }: { i: number }) {
  const s = { width: 40, height: 40, viewBox: '0 0 34 34', fill: 'none', stroke: DIM, strokeWidth: 2.2, strokeLinecap: 'round' as const, 'aria-hidden': true, style: { flex: 'none' } };
  if (i === 0)
    return (
      <svg {...s}>
        <rect x="8" y="4" width="20" height="26" rx="2" />
        <path d="M5 8v24h19M12 11h12M12 16h12M12 21h8" />
      </svg>
    );
  if (i === 1)
    return (
      <svg {...s} width={50} viewBox="0 0 42 34">
        <rect x="2" y="5" width="38" height="24" rx="4" />
        <text x="21" y="22" textAnchor="middle" fontSize="12" fontFamily="JetBrains Mono, monospace" fill={DIM} stroke="none">SQL</text>
      </svg>
    );
  return (
    <svg {...s}>
      <path d="M2 17s6-9 15-9 15 9 15 9-6 9-15 9S2 17 2 17z" />
      <circle cx="17" cy="17" r="4.5" />
    </svg>
  );
}

export function L1Scattered({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-scattered" kickerColor="var(--teal)">
      <Fill max={1.1}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 380fr) 50px minmax(0, 560fr) 50px minmax(0, 370fr)', gridTemplateRows: 'auto repeat(3, minmax(0, 1fr))', columnGap: 6, rowGap: 18, alignItems: 'center', marginTop: 6, flex: 1 }}>
        <div style={cap}>The project manager asks</div>
        <div />
        <div style={cap}>Where the answer is</div>
        <div />
        <div style={cap}>How you find it</div>
        {PLACES.map((p, i) => (
          <div key={p.key} style={{ display: 'contents' }}>
            <motion.div data-question={p.key} {...fadeUp(0.3 + i * 0.5)} style={{ ...card(), border: 'none', padding: '20px 22px', fontSize: 24, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
              “{QUESTIONS[i]}”
            </motion.div>
            <Flow w={44} delay={0.6 + i * 0.5} />
            <motion.div data-place={p.key} {...fadeUp(0.5 + i * 0.5)} style={{ ...card(), borderColor: 'rgba(27,138,156,0.35)', background: CARD, alignSelf: 'stretch', minHeight: 136, display: 'flex', alignItems: 'center', gap: 26, padding: '12px 28px' }}>
              <div style={{ width: 110, flex: 'none', display: 'flex', justifyContent: 'center' }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>{p.title}</div>
                <div style={{ fontSize: 18, color: DIM, marginTop: 2 }}>{p.sub}</div>
                {p.fields && (
                  <div data-fields style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10, maxWidth: 420 }}>
                    {p.fields.map((f) => (
                      <Chip key={f} style={{ fontSize: 14, padding: '3px 8px' }}>{f}</Chip>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            <Flow w={44} delay={0.9 + i * 0.5} />
            <motion.div data-by-hand={p.key} {...fadeUp(0.8 + i * 0.5)} style={{ borderRadius: 12, border: '2px dashed rgba(138,151,163,0.6)', padding: '22px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
              <ByHandIcon i={i} />
              <div>
                <div style={{ ...cap, fontSize: 13 }}>Today, by hand</div>
                <div style={{ fontSize: 23, fontWeight: 600, color: 'var(--ink)' }}>{p.by}</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div data-question="all" {...fadeUp(2.6)} style={{ marginTop: 24, borderRadius: 12, background: TEAL, color: '#fff', padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 20, fontSize: 27, fontWeight: 700 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', color: TEAL_D, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, flex: 'none' }}>?</span>
        What if one question, in one app, could reach all three?
      </motion.div>
      </Fill>
    </WidePanel>
  );
}
