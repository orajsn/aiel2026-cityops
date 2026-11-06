import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { Rich } from '../Rich';
import { useScriptClear } from '../scriptClear';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './Fill';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';

/**
 * Lab 3's compressed opening (owner, 6 Nov, drafted on the canvas "Lab 3 Opening, Compressed"): the hook (same
 * question, two answers), why the first one forgot, where it goes instead, the cards dropping into the glass, the fix
 * for each of the four problems, and the handover to the notebook. Everyday pictures in Lab 2's flat style: greys,
 * teal for the one thing that matters. Every click is its own scene; `step` cross-fades inside one panel.
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const TEAL = 'var(--teal)';
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35, ease: EASE } } as const;

/** the right-hand panel of the chat pages, so the camera at the rust stays on the left half */
function HalfPanel({ kicker, message, testId, step, children }: { kicker: string; message: string; testId: string; step: number; children: ReactNode }) {
  const clear = useScriptClear();
  const free = clear === null;
  return (
    <div className="beat">
      <motion.div className={`beat__panel beat__panel--tall${free ? ' is-free' : ''}`} style={free ? undefined : { bottom: Math.max(96, clear) }} data-testid={testId} data-step={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">{kicker}</div>
        <AnimatePresence mode="wait">
          <motion.div key={message} className="beat__headline" {...fade}>
            <Rich text={message} />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div key={step} {...fade} style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: 18, marginTop: 12 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const card = (tone: 'teal' | 'grey'): CSSProperties => ({
  boxSizing: 'border-box',
  background: 'var(--panel-strong)',
  border: `2px solid ${tone === 'teal' ? 'var(--teal)' : 'var(--line)'}`,
  borderRadius: 18,
  padding: '18px 22px',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

const bubble = (person: boolean): CSSProperties => ({
  alignSelf: person ? 'flex-end' : 'flex-start',
  padding: '10px 16px',
  borderRadius: person ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: person ? 'var(--teal)' : 'rgba(138, 145, 156, 0.18)',
  color: person ? '#ffffff' : 'var(--ink)',
  fontSize: 21,
  lineHeight: 1.35,
});

const cap = (label: string, teal = false): ReactNode => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', color: teal ? 'var(--teal)' : 'var(--ink-dim)' }}>
    <span style={{ width: 10, height: 10, borderRadius: 5, background: teal ? 'var(--teal)' : G_MID }} />
    <span style={{ color: 'var(--ink)', letterSpacing: 0, fontSize: 17, fontWeight: 600 }}>AI Agent</span>
    <span style={{ marginLeft: 'auto' }}>{label}</span>
  </div>
);

/* ---------------------------------------------------------------- 1 · the hook */

export interface HookProps {
  kicker: string;
  /** 1: two answers, the second one hidden behind a lock; 2: the reveal, only the memory differs */
  step: 1 | 2;
  message: string;
}

/** same question, two answers: without memory the AI agent has nothing, with memory it answers with Mercer's finding */
export function Hook({ kicker, step, message }: HookProps) {
  return (
    <HalfPanel kicker={kicker} message={message} testId="hook" step={step}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={vancePortrait} alt="Vance" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', border: '2px solid #fff' }} />
        <div style={{ ...bubble(true), alignSelf: 'center' }}>“What happened at this rust?”</div>
      </div>
      <div data-hook="without" style={card('grey')}>
        {cap('WITHOUT MEMORY')}
        <div style={bubble(false)}>I have no earlier information. What do you see?</div>
        <div style={{ fontSize: 22, color: 'var(--ink-dim)' }}>Every chat starts from zero.</div>
      </div>
      <div data-hook="with" style={card('teal')}>
        {cap('WITH MEMORY', true)}
        {step === 1 ? (
          <div style={{ position: 'relative' }}>
            <div style={{ ...bubble(false), filter: 'blur(7px)' }}>Mercer logged corrosion on Day 1: about 25 percent section loss, grade C, repair within 60 days.</div>
            <div data-lock style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 64, height: 64, borderRadius: 32, background: 'var(--panel-strong)', border: '3px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3" /></svg>
            </div>
          </div>
        ) : (
          <div style={bubble(false)}>
            Mercer logged <b>corrosion</b> on Day 1: <b>about 25 percent section loss</b>, grade C, repair within <b>60 days</b>.
          </div>
        )}
        <div style={{ fontSize: 22, color: step === 1 ? 'var(--ink-dim)' : 'var(--teal)', fontWeight: step === 1 ? 400 : 700 }}>{step === 1 ? 'Same question. What is different?' : 'her finding · the guideline · her notes'}</div>
      </div>
    </HalfPanel>
  );
}

/* ---------------------------------------------------------------- pictures */

/** Mercer behind a desk, in Lab 2's flat style; the book is open (short-term memory) or shut */
export function BookDesk({ open, width = 400 }: { open: boolean; width?: number }) {
  return (
    <svg data-art={open ? 'book-open' : 'book-shut'} width={width} height={(width * 420) / 640} viewBox="0 0 640 420" aria-hidden="true">
      <ellipse cx="320" cy="410" rx="290" ry="8" fill="rgba(127,127,127,0.18)" />
      <MercerFigure x={320} y={10} scale={1.5} id="bd" />
      <rect x="40" y="272" width="560" height="26" rx="8" fill={G_MID} />
      <rect x="70" y="298" width="500" height="104" rx="6" fill={G_DARK} />
      {open ? (
        <g>
          <path d="M120 300q90-30 180 0v86q-90-30-180 0z" fill="#fff" stroke={G_DARK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M300 300q90-30 180 0v86q-90-30-180 0z" fill="#fff" stroke={G_DARK} strokeWidth="4" strokeLinejoin="round" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M144 ${322 + i * 16}h132M324 ${322 + i * 16}h${[132, 110, 132, 70][i]}`} stroke={G_MID} strokeWidth="6" strokeLinecap="round" />
          ))}
          <rect x="318" y="354" width="120" height="14" rx="4" fill="rgba(27,138,156,0.4)" />
          <path d="M286 296v66l10-9 10 9v-66z" fill="#1B8A9C" />
        </g>
      ) : (
        <g>
          <rect x="250" y="236" width="140" height="36" rx="5" fill="#fff" stroke={G_DARK} strokeWidth="4" />
          <rect x="250" y="236" width="18" height="36" rx="5" fill={G_MID} />
          <path d="M286 254h74" stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

/** Mercer: her portrait on the librarian's shoulders (owner, 6 Nov: the character is Mercer) */
function MercerFigure({ x, y, scale, id }: { x: number; y: number; scale: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-34 150c0-44 8-84 34-84s34 40 34 84z" fill="#6f6a8f" />
      <clipPath id={`${id}-clip`}>
        <circle cx="0" cy="40" r="34" />
      </clipPath>
      <image href={mercerPortrait} x="-38" y="2" width="76" height="76" preserveAspectRatio="xMidYMin slice" clipPath={`url(#${id}-clip)`} />
      <circle cx="0" cy="40" r="34" fill="none" stroke="#fff" strokeWidth="3" />
    </g>
  );
}

/** a filing cabinet with Mercer beside it and one index card sticking out */
export function FilingCabinet({ width = 480 }: { width?: number }) {
  return (
    <svg data-art="cabinet" width={width} height={(width * 400) / 560} viewBox="0 0 560 400" aria-hidden="true">
      <ellipse cx="280" cy="392" rx="260" ry="7" fill="rgba(127,127,127,0.18)" />
      <MercerFigure x={110} y={120} scale={1.25} id="fc" />
      <rect x="230" y="40" width="290" height="340" rx="12" fill={G_LIGHT} stroke={G_DARK} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="250" y={60 + i * 96} width="250" height="84" rx="8" fill="#e4e7eb" stroke={G_DARK} strokeWidth="3" />
          <rect x="330" y={92 + i * 96} width="90" height="14" rx="7" fill={G_DARK} />
          <rect x="296" y={70 + i * 96} width="158" height="18" rx="3" fill="#fff" stroke={G_MID} strokeWidth="2" />
        </g>
      ))}
      <g transform="rotate(-4 400 40)">
        <rect x="330" y="10" width="120" height="70" rx="5" fill="#fff" stroke="#1B8A9C" strokeWidth="3" />
        <path d="M344 32h92M344 50h92M344 66h56" stroke="#1B8A9C" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** a glass for the context window: outline, liquid up to `fill`, and what is drawn inside */
export function GlassArt({ fill, id, children, size = 200 }: { fill: number; id: string; children?: ReactNode; size?: number }) {
  const h = 150 * fill;
  return (
    <svg data-art="glass" width={size} height={size} viewBox="0 0 200 200" aria-hidden="true">
      <path d="M40 20h120l-14 164H54z" fill="#fff" stroke={G_DARK} strokeWidth="5" strokeLinejoin="round" />
      <clipPath id={id}>
        <path d="M40 20h120l-14 164H54z" />
      </clipPath>
      <rect x="30" y={184 - h} width="140" height={h} fill="rgba(27,138,156,0.35)" clipPath={`url(#${id})`} />
      {children}
    </svg>
  );
}

const lines = (
  <g>
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={66 + (i % 2) * 8} y={50 + i * 26} width={70 - (i % 3) * 8} height="14" rx="4" fill={i === 3 ? '#1B8A9C' : G_MID} />
    ))}
  </g>
);

const PROBLEMS: { word: string; title: string; text: string; art: ReactNode; part: string; fix: string }[] = [
  {
    word: 'Volume',
    title: 'The window fills up',
    text: 'By turn 15 the window is full. One more tool call and it breaks.',
    art: (
      <GlassArt fill={1} id="gv">
        <path d="M60 20c-6-14 4-22 12-14M140 20c8-14-2-22-12-14" stroke="#1B8A9C" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M168 38v30M160 60l8 10 8-10" stroke="#1B8A9C" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </GlassArt>
    ),
    part: 'Part 3',
    fix: 'the extractor keeps small records',
  },
  { word: 'Relevance', title: 'Wrong data is in it', text: 'Mercer’s finding is there, but buried under search results Vance never asked for.', art: <GlassArt fill={0.7} id="gr">{lines}</GlassArt>, part: 'Part 4', fix: 'search with walls' },
  {
    word: 'Accuracy',
    title: 'Summaries lose details',
    text: 'The summary says “rust on the pier” but lost the 25%.',
    art: (
      <GlassArt fill={0.45} id="ga">
        <path d="M70 110h60M70 130h42" stroke={G_MID} strokeWidth="7" strokeLinecap="round" />
        <text x="100" y="86" textAnchor="middle" fontSize="26" fontWeight="700" fill="#C74634" fontFamily="Inter, sans-serif">25%</text>
        <path d="M72 76l56 18" stroke="#C74634" strokeWidth="4" strokeLinecap="round" />
      </GlassArt>
    ),
    part: 'Part 4',
    fix: 'the signed finding keeps the 25%',
  },
  {
    word: 'Timing',
    title: 'The right memory, at the wrong moment',
    text: 'Her finding was loaded at the start, not fetched again when Vance asked.',
    art: (
      <GlassArt fill={0.3} id="gt">
        <circle cx="150" cy="56" r="34" fill="#fff" stroke="#1B8A9C" strokeWidth="6" />
        <path d="M150 36v22l14 10" stroke="#1B8A9C" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </GlassArt>
    ),
    part: 'Part 6',
    fix: 'read again on every turn',
  },
];


/* ---------------------------------------------------------------- 2 · why it forgot */

export interface WhyForgotProps {
  kicker: string;
  /** 1: Mercer talks, the book is open on the desk; 2: the chat closes, the book is shut and the desk clear */
  step: 1 | 2;
  message: string;
}

const MERCER_SAYS = ['Corrosion on the bearing assemblies', 'About 25 percent section loss', 'Repair within 60 days'];

export function WhyForgot({ kicker, step, message }: WhyForgotProps) {
  const closed = step === 2;
  return (
    <HalfPanel kicker={kicker} message={message} testId="why-forgot" step={step}>
      <div data-forgot="chat" style={card(closed ? 'grey' : 'teal')}>
        {cap('DAY 1', !closed)}
        {MERCER_SAYS.map((t) => (
          <div key={t} style={{ ...bubble(true), opacity: closed ? 0.45 : 1 }}>{t}</div>
        ))}
        {closed && <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-dim)', borderTop: '2px dashed var(--line)', paddingTop: 8 }}>SESSION CLOSED · Mercer goes home</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <BookDesk open={!closed} width={440} />
        <div style={{ fontSize: 27, fontWeight: 700, textAlign: 'center' }}>{closed ? 'The book is shut. The desk is clear.' : 'Short-term memory is the open book on the desk.'}</div>
        <div style={{ fontSize: 21, color: 'var(--ink-dim)', textAlign: 'center' }}>{closed ? 'Like a librarian closing the book: nothing Mercer said stays on the desk.' : 'Like a librarian with one book open: the pages in front of you right now. This chat and its context window.'}</div>
      </div>
    </HalfPanel>
  );
}

/* ---------------------------------------------------------------- 3 · where it goes */

export interface WhereItGoesProps {
  kicker: string;
  /** 1: the notes go in the filing cabinet; 2: one report becomes three cards; 3: Vance's three questions pull them back */
  step: 1 | 2 | 3;
  message: string;
}

const KINDS = [
  { name: 'What happened', term: 'episodic', say: 'Found corrosion at the bearings.', like: 'like last summer’s trip', ask: '“What happened here?”' },
  { name: 'What is true', term: 'semantic', say: 'About 25% section loss.', like: 'like what you learned at school', ask: '“How bad is it?”' },
  { name: 'How we work', term: 'procedural', say: 'Remove loose rust before the primer.', like: 'like riding a bike', ask: '“What do we do?”' },
];

export function WhereItGoes({ kicker, step, message }: WhereItGoesProps) {
  return (
    <WidePanel kicker={kicker} message={message} testId="where-it-goes" step={step}>
      <AnimatePresence mode="wait">
        <motion.div key={step === 1 ? 'a' : 'b'} {...fade} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Fill>{step === 1 ? <CabinetStep /> : <CardsStep pull={step === 3} />}</Fill>
        </motion.div>
      </AnimatePresence>
    </WidePanel>
  );
}

function CabinetStep() {
  const note = (r: number) => (
    <div key={r} style={{ width: 84, height: 108, boxSizing: 'border-box', background: 'var(--panel-strong)', border: '2px solid var(--line)', borderRadius: 8, padding: '14px 10px', transform: `rotate(${r}deg)` }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 6, width: i === 2 ? '60%' : '100%', borderRadius: 3, background: G_MID, marginBottom: 12 }} />
      ))}
    </div>
  );
  return (
    <div data-where="cabinet" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 14 }}>{[-5, 3, -2].map(note)}</div>
        <div style={{ fontSize: 26, color: 'var(--ink-dim)' }}>Mercer’s notes</div>
      </div>
      <svg width="110" height="56" viewBox="0 0 130 60" aria-hidden="true"><path d="M8 30h104M88 8l24 22-24 22" stroke="var(--teal)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <FilingCabinet />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 14, background: 'var(--panel-strong)', border: '2.5px solid var(--teal)', fontSize: 24, fontWeight: 700 }}>Oracle AI Database</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>Long-term memory is the filing cabinet.</div>
        <div style={{ fontSize: 22, color: 'var(--ink-dim)' }}>Like the librarian’s index cards: one card per fact, kept for the next visit.</div>
      </div>
    </div>
  );
}

function CardsStep({ pull }: { pull: boolean }) {
  return (
    <div data-where={pull ? 'pull' : 'cards'} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 22px', borderRadius: 16, background: 'var(--panel-strong)', border: '2px solid var(--line)', fontSize: 25, lineHeight: 1.5 }}>
        <img src={mercerPortrait} alt="Mercer" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%' }} />
        <div>{KINDS.map((k) => <span key={k.say} style={{ background: 'rgba(27,138,156,0.18)', borderRadius: 6, padding: '0 6px', marginRight: 10 }}>{k.say}</span>)}</div>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {KINDS.map((k) => (
          <div key={k.term} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pull && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={vancePortrait} alt="Vance" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%' }} />
                <div style={{ ...bubble(true), fontSize: 20, padding: '6px 14px' }}>{k.ask}</div>
              </motion.div>
            )}
            <div style={{ ...card('teal'), minHeight: 250, gap: 12, padding: '18px 22px' }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{k.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, color: 'var(--teal)' }}>{k.term}</div>
              <div style={{ fontSize: 28, lineHeight: 1.3 }}>{k.say}</div>
              <div style={{ marginTop: 'auto', borderTop: '2px dashed var(--line)', paddingTop: 10, fontSize: 20, color: 'var(--ink-dim)' }}>{k.like}</div>
            </div>
          </div>
        ))}
      </div>
      {pull && <div style={{ textAlign: 'center', fontSize: 28, fontWeight: 700 }}>So Vance starts with the <span style={{ color: 'var(--teal)' }}>whole history</span>, not from zero.</div>}
    </div>
  );
}

/* ---------------------------------------------------------------- 4 · the glass, before and after */

export interface GlassBridgeProps {
  kicker: string;
  message: string;
  /** pour: the three cards drop toward an empty glass; fixes: each of the four problems names the notebook Part that fixes it */
  mode: 'pour' | 'fixes';
}

export function GlassBridge({ kicker, message, mode }: GlassBridgeProps) {
  return (
    <WidePanel kicker={kicker} message={message} testId={mode === 'pour' ? 'glass-pour' : 'glass-fixes'}>
      <Fill>{mode === 'pour' ? <Pour /> : <Fixes />}</Fill>
    </WidePanel>
  );
}

function Pour() {
  return (
    <div data-glass="pour" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 28 }}>
          {KINDS.map((k, i) => (
            <motion.div key={k.term} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.25, duration: 0.5, ease: EASE }} style={{ width: 210, ...card('teal'), padding: '12px 16px', gap: 4, transform: `rotate(${[-4, 2, -2][i]}deg)` }}>
              <div style={{ fontSize: 14, letterSpacing: '0.08em', fontWeight: 700, color: 'var(--teal)' }}>{k.name.toUpperCase()}</div>
              <div style={{ fontSize: 21, lineHeight: 1.3, fontWeight: 600 }}>{k.say}</div>
            </motion.div>
          ))}
        </div>
        <svg width="620" height="70" viewBox="0 0 620 70" aria-hidden="true">
          <path d="M110 6l110 56M200 46l22 18-30 4M310 6v52M296 46l14 16 14-16M510 6l-110 56M420 48l-22 16 30 6" stroke="var(--teal)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <GlassArt fill={0.2} id="gp" size={300} />
      </div>
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.25 }}>The cabinet keeps it all.</div>
        <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.25, color: 'var(--teal)' }}>The model reads only what is in the glass.</div>
        <div style={{ fontSize: 25, color: 'var(--ink-dim)', marginTop: 14 }}>So what we pour in, this turn, is what matters.</div>
      </div>
    </div>
  );
}

function Fixes() {
  return (
    <div data-glass="fixes" style={{ flex: 1, display: 'flex', gap: 22, alignItems: 'stretch' }}>
      {PROBLEMS.map((p, i) => (
        <motion.div key={p.word} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15, duration: 0.45, ease: EASE }} style={{ flex: 1, ...card('grey'), padding: '16px 20px', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 29, fontWeight: 700 }}>
            <span style={{ width: 34, height: 34, borderRadius: 17, background: 'var(--teal)', color: '#fff', fontSize: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            {p.word}
          </div>
          <div style={{ alignSelf: 'center', margin: '8px 0', zoom: 1.4 }}>{p.art}</div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>{p.title}</div>
          <div style={{ fontSize: 18, lineHeight: 1.35, color: 'var(--ink-dim)' }}>{p.text}</div>
          <div data-fix={p.part} style={{ marginTop: 'auto', padding: '10px 14px', borderRadius: 12, background: 'rgba(27,138,156,0.1)', border: '2px solid var(--teal)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--teal)' }}>NOTEBOOK · {p.part.toUpperCase()}</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{p.fix}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- 5 · the handover to the notebook */

export interface HandoverProps {
  kicker: string;
  message: string;
  notebook?: string;
}

const WATCH = [
  { n: '1', t: 'What to keep', s: 'small records, and the signed finding', where: 'Parts 3 and 4' },
  { n: '2', t: 'What to bring in', s: 'only what this question needs', where: 'Part 6' },
  { n: '3', t: 'What to do every turn', s: 'read, think, act, save', where: 'Part 6, then the two days' },
];
const PARTS = ['Part 1 · Oracle setup', 'Part 2 · the embedder', 'Part 3 · assets, extraction, memory', 'Part 4 · the findings', 'Part 5 · who sees what', 'Part 6 · one whole turn'];

export function Handover({ kicker, message, notebook }: HandoverProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="handover">
      <Fill>
        <div data-handover style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ width: 760, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', borderRadius: 18, background: 'rgba(27,138,156,0.1)', border: '2.5px solid var(--teal)' }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>Oracle AI Database</div>
              <div style={{ marginLeft: 'auto', fontSize: 20, color: 'var(--ink-dim)' }}>Parts 1 and 2: the store and the embedder</div>
            </div>
            {WATCH.map((w) => (
              <div key={w.n} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px', borderRadius: 18, background: 'var(--panel-strong)', border: '2.5px solid var(--teal)' }}>
                <div style={{ flex: 'none', width: 44, height: 44, borderRadius: 22, background: 'var(--teal)', color: '#fff', fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{w.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{w.t}</div>
                  <div style={{ fontSize: 20, color: 'var(--ink-dim)' }}>{w.s}</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal)' }}>{w.where}</div>
              </div>
            ))}
          </div>
          <svg width="90" height="56" viewBox="0 0 130 60" aria-hidden="true"><path d="M8 30h104M88 8l24 22-24 22" stroke="var(--teal)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ padding: '22px 28px', borderRadius: 20, background: 'var(--panel-strong)', border: '2px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 19, color: 'var(--teal)' }}>notebook_complete_ollama.ipynb</div>
              {PARTS.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 23 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--teal)' }} />
                  {p}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>Now we open the notebook and watch each one happen, in this order.</div>
          </div>
        </div>
      </Fill>
    </WidePanel>
  );
}
