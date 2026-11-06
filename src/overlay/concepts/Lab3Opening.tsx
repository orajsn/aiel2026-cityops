import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { Rich } from '../Rich';
import { useScriptClear } from '../scriptClear';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './Fill';
import { MiniGlass, CURATION } from './Glass';
import { SOLVED, SOLVED_GLASS } from './Ending';
import { LineIcon } from './icons';
import { useDrawerStore } from '../../engine/presentation';
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
/** how far this page has built up: 0 at once, then +1 for every Next (the page's PAGE_STEPS in engine/presentation.ts) */
export const useBuild = () => useDrawerStore((s) => (s.open ? s.focus : 0));

/** a part of the picture that comes in on its click; it keeps its place, so nothing jumps */
function Reveal({ show, children, style, testId }: { show: boolean; children: ReactNode; style?: CSSProperties; testId?: string }) {
  return (
    <motion.div data-reveal={testId} data-shown={show} initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} style={{ ...style, pointerEvents: show ? undefined : 'none' }}>
      {children}
    </motion.div>
  );
}

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
  const L = useBuild();
  // 3.1h: Vance asks, then the answer without memory, then the answer with memory behind its lock; 3.1i: the reveal, then what it used
  const showWithout = step === 2 || L >= 1;
  const showWith = step === 2 || L >= 2;
  const revealed = step === 2 && L >= 1;
  return (
    <HalfPanel kicker={kicker} message={message} testId="hook" step={step}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={vancePortrait} alt="Vance" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', border: '2px solid #fff' }} />
        <div style={{ ...bubble(true), alignSelf: 'center' }}>“What happened at this rust?”</div>
      </div>
      <Reveal show={showWithout} testId="without">
        <div data-hook="without" style={card('grey')}>
          {cap('WITHOUT MEMORY')}
          <div style={bubble(false)}>I have no earlier information. What do you see?</div>
          <div style={{ fontSize: 22, color: 'var(--ink-dim)' }}>Every chat starts from zero.</div>
        </div>
      </Reveal>
      <Reveal show={showWith} testId="with">
        <div data-hook="with" style={card('teal')}>
          {cap('WITH MEMORY', true)}
          {!revealed ? (
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
          <div style={{ fontSize: 22, color: revealed && L >= 2 ? 'var(--teal)' : 'var(--ink-dim)', fontWeight: revealed && L >= 2 ? 700 : 400 }}>{revealed && L >= 2 ? 'her finding · the guideline · her notes' : 'Same question. What is different?'}</div>
        </div>
      </Reveal>
    </HalfPanel>
  );
}

/* ---------------------------------------------------------------- pictures */

const SKIN = '#9a6040';
const SKIN_D = '#7f4c31';
const SHIRT = '#6f6a8f';
const SHIRT_D = '#5d5879';
const DESK_TOP = '#8a919c';
const DESK_BODY = '#5c6b78';

/** Mercer's head: her portrait in a white ring, on a neck */
function MercerHead({ cx, cy, r, id }: { cx: number; cy: number; r: number; id: string }) {
  return (
    <g>
      <rect x={cx - r * 0.3} y={cy + r * 0.6} width={r * 0.6} height={r * 0.9} rx={r * 0.2} fill={SKIN_D} />
      <clipPath id={`${id}-clip`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <image href={mercerPortrait} x={cx - r * 1.12} y={cy - r * 1.12} width={r * 2.24} height={r * 2.24} preserveAspectRatio="xMidYMin slice" clipPath={`url(#${id}-clip)`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth={r * 0.07} />
    </g>
  );
}

/** Mercer seated behind a desk, both hands on the book (Lab 2's flat style: two greys, teal for the one thing that matters) */
export function BookDesk({ open, width = 400 }: { open: boolean; width?: number }) {
  return (
    <svg data-art={open ? 'book-open' : 'book-shut'} width={width} height={(width * 420) / 640} viewBox="0 0 640 420" aria-hidden="true">
      <ellipse cx="320" cy="408" rx="300" ry="9" fill="rgba(127,127,127,0.2)" />
      {/* the back wall's lamp, a small second light */}
      <g>
        <path d="M92 300V236l44-34" stroke={DESK_BODY} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M118 196l34 18-12 20z" fill={DESK_BODY} />
        <rect x="74" y="296" width="40" height="8" rx="4" fill={DESK_BODY} />
        {open && <path d="M146 232l-10 46h56z" fill="rgba(27,138,156,0.12)" />}
      </g>
      {/* Mercer: shoulders, neck, head */}
      <path d="M196 312c0-62 40-96 124-96s124 34 124 96z" fill={SHIRT} />
      <path d="M296 218l24 34 24-34z" fill="rgba(255,255,255,0.8)" />
      <path d="M196 312c0-30 8-52 22-68" stroke={SHIRT_D} strokeWidth="3" fill="none" strokeLinecap="round" />
      <MercerHead cx={320} cy={138} r={64} id="bd" />
      {/* the desk: top, front panel with a drawer, legs */}
      <rect x="40" y="304" width="560" height="28" rx="9" fill={DESK_TOP} />
      <rect x="40" y="304" width="560" height="7" rx="3.5" fill="rgba(255,255,255,0.35)" />
      <rect x="70" y="332" width="500" height="66" rx="5" fill={DESK_BODY} />
      <rect x="92" y="344" width="210" height="42" rx="5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" />
      <rect x="178" y="360" width="38" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
      <rect x="338" y="344" width="210" height="42" rx="5" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" />
      <rect x="424" y="360" width="38" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
      <rect x="84" y="396" width="14" height="12" fill={DESK_BODY} />
      <rect x="542" y="396" width="14" height="12" fill={DESK_BODY} />
      {/* a mug, so the desk looks lived in */}
      <g>
        <rect x="520" y="272" width="34" height="32" rx="6" fill="#fff" stroke={DESK_BODY} strokeWidth="3.5" />
        <path d="M554 280h8a8 8 0 0 1 0 16h-8" stroke={DESK_BODY} strokeWidth="3.5" fill="none" />
      </g>
      {open ? (
        <g>
          {/* the open book: two pages, a ribbon in the spine, one line lit in teal */}
          <path d="M150 304c60-20 120-26 170-12v16c-50-14-110-8-170 12z" fill="#e4e7eb" />
          <path d="M150 300V262c60-20 120-26 170-12v54c-50-14-110-8-170 8z" fill="#fff" stroke={DESK_BODY} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M490 300V262c-60-20-120-26-170-12v54c50-14 110-8 170 8z" fill="#fff" stroke={DESK_BODY} strokeWidth="3.5" strokeLinejoin="round" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M172 ${274 + i * 5 + i * 5}q50-14 118-4`} stroke={G_MID} strokeWidth="5" fill="none" strokeLinecap="round" transform={`translate(0 ${-6 + i * 0})`} />
              <path d={`M346 ${266 + i * 10}q58-10 118 4`} stroke={i === 1 ? '#1B8A9C' : G_MID} strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
          ))}
          <path d="M318 252v58l9-8 9 8v-58z" fill="#1B8A9C" />
        </g>
      ) : (
        <g>
          <rect x="226" y="270" width="190" height="36" rx="6" fill="#fff" stroke={DESK_BODY} strokeWidth="3.5" />
          <rect x="226" y="270" width="26" height="36" rx="6" fill={G_MID} />
          <path d="M276 288h104" stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
        </g>
      )}
      {/* her arms and hands on the book */}
      <path d="M214 270c-14 28-8 48 24 52l44 2 6-16-40-6c-8-12-8-22-8-34z" fill={SHIRT} />
      <path d="M426 270c14 28 8 48-24 52l-44 2-6-16 40-6c8-12 8-22 8-34z" fill={SHIRT} />
      <ellipse cx="286" cy="316" rx="20" ry="10" fill={SKIN} transform="rotate(-8 286 316)" />
      <ellipse cx="354" cy="316" rx="20" ry="10" fill={SKIN} transform="rotate(8 354 316)" />
    </svg>
  );
}

/** a filing cabinet with Mercer standing beside it, pulling a card out of the middle drawer (Lab 2's flat style) */
export function FilingCabinet({ width = 480 }: { width?: number }) {
  return (
    <svg data-art="cabinet" width={width} height={(width * 400) / 560} viewBox="0 0 560 400" aria-hidden="true">
      <ellipse cx="290" cy="392" rx="270" ry="8" fill="rgba(127,127,127,0.2)" />
      <rect x="250" y="20" width="290" height="360" rx="12" fill={G_LIGHT} stroke={G_DARK} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="270" y={40 + i * 112} width="250" height="94" rx="8" fill="#e4e7eb" stroke={G_DARK} strokeWidth="3" />
          <rect x="350" y={90 + i * 112} width="90" height="14" rx="7" fill={G_DARK} />
          <rect x="316" y={52 + i * 112} width="158" height="22" rx="3" fill="#fff" stroke={G_MID} strokeWidth="2" />
          <path d="M330 63h70" stroke={G_MID} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      ))}
      <rect x="86" y="296" width="22" height="86" rx="6" fill="#4b5563" />
      <rect x="120" y="296" width="22" height="86" rx="6" fill="#3f4854" />
      <rect x="78" y="374" width="36" height="12" rx="6" fill="#2f3842" />
      <rect x="116" y="374" width="36" height="12" rx="6" fill="#2f3842" />
      <path d="M62 306c-4-60 14-100 52-100s56 40 52 100z" fill={SHIRT} />
      <path d="M100 208l14 24 14-24z" fill="rgba(255,255,255,0.8)" />
      <MercerHead cx={114} cy={150} r={42} id="fc" />
      <path d="M148 232L246 176" stroke={SHIRT} strokeWidth="24" strokeLinecap="round" />
      <path d="M64 240c-10 22-12 46-6 64" stroke={SHIRT_D} strokeWidth="18" strokeLinecap="round" fill="none" />
      <g transform="rotate(-5 300 190)">
        <rect x="244" y="150" width="130" height="78" rx="6" fill="#fff" stroke="#1B8A9C" strokeWidth="4" />
        <path d="M262 176h94M262 194h94M262 212h58" stroke="#1B8A9C" strokeWidth="5.5" strokeLinecap="round" />
      </g>
      <circle cx="248" cy="176" r="12" fill={SKIN} />
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
  const L = useBuild();
  // 3.2f: Mercer's three messages arrive one per click; 3.2g: the chat closes, then the book shuts
  const said = step === 1 ? L : 3;
  const closed = step === 2 && L >= 1;
  const shut = step === 2 && L >= 2;
  const note = step === 1 ? L >= 3 : L >= 2;
  return (
    <HalfPanel kicker={kicker} message={message} testId="why-forgot" step={step}>
      <div data-forgot="chat" style={{ ...card(closed ? 'grey' : 'teal'), minHeight: 250 }}>
        {cap('DAY 1', !closed)}
        {MERCER_SAYS.map((t, i) => (
          <Reveal key={t} show={said > i} testId={`say-${i}`} style={{ alignSelf: 'flex-end' }}>
            <div style={{ ...bubble(true), opacity: closed ? 0.45 : 1, transition: 'opacity 0.6s' }}>{t}</div>
          </Reveal>
        ))}
        <Reveal show={closed} style={{ marginTop: 'auto' }}>
          <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-dim)', borderTop: '2px dashed var(--line)', paddingTop: 8 }}>SESSION CLOSED · Mercer goes home</div>
        </Reveal>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <BookDesk open={!shut} width={440} />
        <Reveal show={note} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 27, fontWeight: 700 }}>{shut ? 'The book is shut. The desk is clear.' : 'Short-term memory is the open book on the desk.'}</div>
          <div style={{ fontSize: 21, color: 'var(--ink-dim)' }}>{shut ? 'Like a librarian closing the book: nothing Mercer said stays on the desk.' : 'Like a librarian with one book open: the pages in front of you right now. This chat and its context window.'}</div>
        </Reveal>
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
      <Fill>{step === 1 ? <CabinetStep /> : <CardsStep pull={step === 3} />}</Fill>
    </WidePanel>
  );
}

function CabinetStep() {
  const L = useBuild();
  const note = (r: number) => (
    <div key={r} style={{ width: 150, height: 190, boxSizing: 'border-box', background: 'var(--panel-strong)', border: '2px solid var(--line)', borderRadius: 10, padding: '24px 18px', transform: `rotate(${r}deg)`, boxShadow: '0 4px 12px rgba(31,42,51,0.1)' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 9, width: i === 2 ? '60%' : '100%', borderRadius: 5, background: G_MID, marginBottom: 20 }} />
      ))}
    </div>
  );
  return (
    <div data-where="cabinet" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '0 10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: 560 }}>
        <div style={{ display: 'flex', gap: 22 }}>{[-5, 3, -2].map(note)}</div>
        <div style={{ fontSize: 38, color: 'var(--ink-dim)', fontWeight: 600 }}>Mercer’s notes</div>
      </div>
      <Reveal show={L >= 1} testId="cabinet" style={{ display: 'flex', alignItems: 'center', gap: 30, flex: 1, justifyContent: 'flex-end' }}>
        <svg width="130" height="70" viewBox="0 0 130 60" aria-hidden="true"><path d="M8 30h104M88 8l24 22-24 22" stroke="var(--teal)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <FilingCabinet width={640} />
          <Reveal show={L >= 2} testId="database" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '10px 26px', borderRadius: 16, background: 'var(--panel-strong)', border: '3px solid var(--teal)', fontSize: 34, fontWeight: 700 }}>Oracle AI Database</div>
            <div style={{ fontSize: 33, fontWeight: 700 }}>Long-term memory is the filing cabinet.</div>
            <div style={{ fontSize: 24, color: 'var(--ink-dim)', textAlign: 'center' }}>Like the librarian’s index cards: one card per fact, kept for the next visit.</div>
          </Reveal>
        </div>
      </Reveal>
    </div>
  );
}

function CardsStep({ pull }: { pull: boolean }) {
  const L = useBuild();
  // one report becomes three cards, one per click; then Vance's three questions, one per click
  const cardShown = (i: number) => pull || L > i;
  const askShown = (i: number) => pull && L > i;
  return (
    <div data-where={pull ? 'pull' : 'cards'} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 26px', borderRadius: 18, background: 'var(--panel-strong)', border: '2px solid var(--line)', fontSize: 31, lineHeight: 1.5 }}>
        <img src={mercerPortrait} alt="Mercer" style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', flex: 'none' }} />
        <div>{KINDS.map((k, i) => <span key={k.say} style={{ background: cardShown(i) ? 'rgba(27,138,156,0.28)' : 'rgba(27,138,156,0.1)', borderRadius: 8, padding: '0 8px', marginRight: 12, transition: 'background 0.5s' }}>{k.say}</span>)}</div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 26 }}>
        {KINDS.map((k, i) => (
          <div key={k.term} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <Reveal show={askShown(i)} testId={`ask-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 60 }}>
              <img src={vancePortrait} alt="Vance" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%' }} />
              <div style={{ ...bubble(true), fontSize: 27, padding: '8px 18px' }}>{k.ask}</div>
            </Reveal>
            <Reveal show={cardShown(i)} testId={`card-${i}`} style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <div style={{ ...card('teal'), flex: 1, gap: 14, padding: '26px 30px', boxShadow: askShown(i) ? '0 0 0 5px rgba(27,138,156,0.25)' : undefined }}>
                <div style={{ fontSize: 40, fontWeight: 700 }}>{k.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--teal)' }}>{k.term}</div>
                <div style={{ fontSize: 38, lineHeight: 1.25, flex: 1, display: 'flex', alignItems: 'center' }}>{k.say}</div>
                <div style={{ borderTop: '2px dashed var(--line)', paddingTop: 14, fontSize: 28, color: 'var(--ink-dim)' }}>{k.like}</div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      <Reveal show={pull && L >= 3} style={{ textAlign: 'center', fontSize: 38, fontWeight: 700 }}>
        So Vance starts with the <span style={{ color: 'var(--teal)' }}>whole history</span>, not from zero.
      </Reveal>
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
  const L = useBuild();
  // each click drops one card into the glass, the glass fills; the last click says what that means
  const level = [0.12, 0.38, 0.6, 0.82][Math.min(L, 3)];
  return (
    <div data-glass="pour" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, padding: '0 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ display: 'flex', gap: 30 }}>
          {KINDS.map((k, i) => (
            <motion.div key={k.term} initial={false} animate={{ opacity: L > i ? 0.45 : 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ width: 250, ...card('teal'), padding: '16px 20px', gap: 6, transform: `rotate(${[-4, 2, -2][i]}deg)` }}>
              <div style={{ fontSize: 17, letterSpacing: '0.08em', fontWeight: 700, color: 'var(--teal)' }}>{k.name.toUpperCase()}</div>
              <div style={{ fontSize: 27, lineHeight: 1.3, fontWeight: 600 }}>{k.say}</div>
            </motion.div>
          ))}
        </div>
        <svg width="810" height="110" viewBox="0 -14 810 110" aria-hidden="true" style={{ marginTop: 10, fill: 'none', stroke: 'var(--teal)', strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <g key="0" transform="translate(125 6) rotate(20.3)" opacity={L >= 1 ? 1 : 0.2}>
              <path d="M0 0H208" />
              <path d="M186 -13L208 0L186 13" />
            </g>
            <g key="1" transform="translate(405 6) rotate(90.0)" opacity={L >= 2 ? 1 : 0.2}>
              <path d="M0 0H74" />
              <path d="M52 -13L74 0L52 13" />
            </g>
            <g key="2" transform="translate(685 6) rotate(159.7)" opacity={L >= 3 ? 1 : 0.2}>
              <path d="M0 0H208" />
              <path d="M186 -13L208 0L186 13" />
            </g>
        </svg>
        <GlassArt fill={level} id="gp" size={380} />
      </div>
      <Reveal show={L >= 3} style={{ width: 600 }}>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.25 }}>The cabinet keeps it all.</div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.25, color: 'var(--teal)' }}>The model reads only what is in the glass.</div>
        <div style={{ fontSize: 30, color: 'var(--ink-dim)', marginTop: 18 }}>So what we pour in, this turn, is what matters.</div>
      </Reveal>
    </div>
  );
}

/** the four glasses of page 11 (3.3b), solved one per click with the drawings of 3.15b, each tagged with the notebook Part that does it */
function Fixes() {
  const L = useBuild();
  return (
    <div data-glass="fixes" style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, alignContent: 'center', paddingTop: 12 }}>
      {SOLVED.map((sv, i) => {
        const solved = L > i;
        const pr = PROBLEMS[i];
        return (
          <div key={sv.word} data-fixed={solved || undefined} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '14px 8px 18px', borderRadius: 22, background: solved ? 'rgba(27,138,156,0.1)' : 'transparent', border: `2px solid ${solved ? 'var(--teal)' : 'transparent'}`, transition: 'background 0.5s, border-color 0.5s' }}>
            {solved && (
              <motion.span initial={{ opacity: 0, scale: 1.6, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ delay: 1.4, duration: 0.35, ease: EASE }} style={{ position: 'absolute', top: 8, right: 8, padding: '3px 12px', borderRadius: 7, border: '3px solid var(--teal)', color: 'var(--teal)', fontWeight: 800, fontSize: 17, letterSpacing: '0.12em', background: 'var(--panel-strong)' }}>
                SOLVED
              </motion.span>
            )}
            {/* the glass is rebuilt on its click: empty before it, the solved drawing of 3.15b after */}
            <MiniGlass key={String(solved)} word={sv.word} t0={0.2}>
              {solved ? SOLVED_GLASS[i] : () => null}
            </MiniGlass>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 33, fontWeight: 700, color: solved ? 'var(--teal)' : 'var(--ink-dim)', marginTop: 14, transition: 'color 0.5s' }}>
              <LineIcon name={CURATION[i].icon} size={40} />
              {sv.word}
            </div>
            <div style={{ fontSize: 23, lineHeight: 1.4, color: 'var(--ink)', marginTop: 8, maxWidth: 320, minHeight: 100, opacity: solved ? 1 : 0.35, transition: 'opacity 0.5s' }}>{solved ? sv.text : CURATION[i].text}</div>
            <div data-fix={pr.part} style={{ marginTop: 14, padding: '9px 16px', borderRadius: 12, background: 'var(--panel-strong)', border: `2.5px solid ${solved ? 'var(--teal)' : 'var(--line)'}`, opacity: solved ? 1 : 0.35, transition: 'opacity 0.5s' }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--teal)' }}>NOTEBOOK · {pr.part.toUpperCase()}</div>
              <div style={{ fontSize: 21, fontWeight: 600 }}>{pr.fix}</div>
            </div>
          </div>
        );
      })}
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
  const L = useBuild();
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="handover">
      <Fill>
        <div data-handover style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 30 }}>
          <div style={{ width: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px', borderRadius: 20, background: 'rgba(27,138,156,0.12)', border: '3px solid var(--teal)' }}>
              <div style={{ fontSize: 36, fontWeight: 700 }}>Oracle AI Database</div>
              <div style={{ marginLeft: 'auto', fontSize: 24, color: 'var(--ink-dim)', textAlign: 'right' }}>Parts 1 and 2: the store<br />and the embedder</div>
            </div>
            {WATCH.map((w, i) => (
              <Reveal key={w.n} show={L > i} testId={`watch-${i}`} style={{ flex: 1, display: 'flex' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', borderRadius: 20, background: 'var(--panel-strong)', border: '3px solid var(--teal)' }}>
                  <div style={{ flex: 'none', width: 60, height: 60, borderRadius: 30, background: 'var(--teal)', color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{w.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 38, fontWeight: 700 }}>{w.t}</div>
                    <div style={{ fontSize: 25, color: 'var(--ink-dim)' }}>{w.s}</div>
                  </div>
                  <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--teal)', textAlign: 'right' }}>{w.where}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal show={L >= 4} testId="notebook" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ flex: 1, padding: '28px 34px', borderRadius: 22, background: 'var(--panel-strong)', border: '2px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 23, color: 'var(--teal)' }}>notebook_complete_ollama.ipynb</div>
              {PARTS.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 8, background: 'var(--teal)', flex: 'none' }} />
                  {p}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 31, fontWeight: 700, lineHeight: 1.3 }}>Now we open the notebook and watch each one happen, in this order.</div>
          </Reveal>
        </div>
      </Fill>
    </WidePanel>
  );
}
