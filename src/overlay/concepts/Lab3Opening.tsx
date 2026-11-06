import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { Rich } from '../Rich';
import { useScriptClear } from '../scriptClear';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './Fill';
import { MiniGlass, CURATION } from './Glass';
import { Logbook } from './lab2/Lab2Agent';
import { SOLVED, SOLVED_GLASS } from './Ending';
import { LineIcon } from './icons';
import { useDrawerStore } from '../../engine/presentation';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import adbLogo from '../../assets/oracle/autonomous-ai-database.png';

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

/** the right-hand panel of the chat pages, so the camera at the rust stays on the left half; the content shares out all the height */
function HalfPanel({ kicker, message, testId, children }: { kicker: string; message: string; testId: string; children: ReactNode }) {
  const clear = useScriptClear();
  const free = clear === null;
  return (
    <div className="beat">
      <motion.div className={`beat__panel beat__panel--tall${free ? ' is-free' : ''}`} style={free ? undefined : { bottom: Math.max(96, clear) }} data-testid={testId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">{kicker}</div>
        <div className="beat__headline">
          <Rich text={message} />
        </div>
        {/* Fill scales the content down when it is taller than the panel (nothing is ever cut off), at any screen size or text size */}
        <Fill gap={18} style={{ marginTop: 14 }}>{children}</Fill>
      </motion.div>
    </div>
  );
}

const card = (tone: 'teal' | 'grey'): CSSProperties => ({
  boxSizing: 'border-box',
  background: 'var(--panel-strong)',
  border: `2px solid ${tone === 'teal' ? 'var(--teal)' : 'var(--line)'}`,
  borderRadius: 18,
  padding: '16px 22px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

const bubble = (person: boolean): CSSProperties => ({
  alignSelf: person ? 'flex-end' : 'flex-start',
  padding: '10px 20px',
  borderRadius: person ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: person ? 'var(--teal)' : 'rgba(138, 145, 156, 0.18)',
  color: person ? '#ffffff' : 'var(--ink)',
  fontSize: 44,
  lineHeight: 1.35,
});

/**
 * The database shelf (Lab 2's "both memories on one shelf" bar): a teal bar the memory stands on, the Oracle Autonomous AI Database
 * logo in a white badge on its left end, so the logo is part of the picture and never floats alone.
 */
function DbShelf({ height = 84, badge = 112, size = 30, children }: { height?: number; badge?: number; size?: number; children: ReactNode }) {
  return (
    <div data-db-shelf style={{ position: 'relative', height, borderRadius: 18, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', paddingLeft: badge + 30, paddingRight: 24, fontSize: size, fontWeight: 700, lineHeight: 1.15, boxShadow: '0 6px 0 rgba(15,85,98,0.35)' }}>
      <div style={{ position: 'absolute', left: 14, top: (height - badge) / 2, width: badge, height: badge, borderRadius: badge / 2, background: '#fff', border: '4px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(11,14,20,0.25)' }}>
        <img data-logo="adb" src={adbLogo} alt="Oracle Autonomous AI Database" style={{ width: badge * 0.82, height: badge * 0.82, objectFit: 'contain' }} />
      </div>
      <div>{children}</div>
    </div>
  );
}

/** a highlighted word: teal marker behind it */
const Hl = ({ children, strong = false }: { children: ReactNode; strong?: boolean }) => (
  <span style={{ background: strong ? 'var(--teal)' : 'rgba(27,138,156,0.28)', color: strong ? '#fff' : 'inherit', borderRadius: 8, padding: '0 9px', fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</span>
);

const cap = (label: string, teal = false): ReactNode => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', color: teal ? 'var(--teal)' : 'var(--ink-dim)' }}>
    <span style={{ width: 14, height: 14, borderRadius: 7, background: teal ? 'var(--teal)' : G_MID }} />
    <span style={{ color: 'var(--ink)', letterSpacing: 0, fontSize: 26, fontWeight: 600 }}>AI Agent</span>
    <span style={{ marginLeft: 'auto' }}>{label}</span>
  </div>
);

/* ---------------------------------------------------------------- 1 · the hook */

export interface HookProps {
  kicker: string;
  message: string;
}

/**
 * Same question, two answers, one page that builds on every Next (owner, 6 Nov): Vance asks; the answer without memory;
 * the answer with memory, behind a lock; the lock opens; what that answer used.
 */
export function Hook({ kicker, message }: HookProps) {
  const L = useBuild();
  const revealed = L >= 3;
  return (
    <HalfPanel kicker={kicker} message={message} testId="hook">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={vancePortrait} alt="Vance" style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', border: '4px solid #fff', flex: 'none' }} />
        <div data-question style={{ ...bubble(true), alignSelf: 'center', padding: '14px 26px' }}>“What happened at this rust?”</div>
      </div>
      <Reveal show={L >= 1} testId="without" style={{ flex: 1, display: 'flex' }}>
        <div data-hook="without" style={{ ...card('grey'), flex: 1, justifyContent: 'space-between' }}>
          {cap('WITHOUT MEMORY')}
          <div style={bubble(false)}>I have no earlier information. What do you see?</div>
          <div style={{ fontSize: 30, color: 'var(--ink-dim)' }}>Every chat starts from zero.</div>
        </div>
      </Reveal>
      <Reveal show={L >= 2} testId="with" style={{ flex: 1, display: 'flex' }}>
        <div data-hook="with" style={{ ...card('teal'), flex: 1, justifyContent: 'space-between' }}>
          {cap('WITH MEMORY', true)}
          {!revealed ? (
            <div style={{ position: 'relative' }}>
              <div style={{ ...bubble(false), filter: 'blur(8px)' }}>Mercer logged corrosion on Day 1: about 25 percent section loss, grade C, repair within 60 days.</div>
              <div data-lock style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 84, height: 84, borderRadius: 42, background: 'var(--panel-strong)', border: '4px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </div>
            </div>
          ) : (
            <div style={bubble(false)}>
              Mercer logged <b>corrosion</b> on Day 1: <b>about 25 percent section loss</b>, grade C, repair within <b>60 days</b>.
            </div>
          )}
          <div style={{ fontSize: 30, color: L >= 4 ? 'var(--teal)' : 'var(--ink-dim)', fontWeight: L >= 4 ? 700 : 400 }}>{L >= 4 ? 'her finding · the guideline · her notes' : 'Same question. What is different?'}</div>
        </div>
      </Reveal>
    </HalfPanel>
  );
}

/* ---------------------------------------------------------------- pictures */

const TEAL_FILL_SOFT = 'rgba(27,138,156,0.16)';

/**
 * Lab 2's visit notebook (lab2/Lab2Agent.tsx PocketNotebook, the same pad): a small spiral pad. `lines` of this visit's notes are
 * written on it (teal); when the visit is over (`cleared`) the lines are gone and the pad is faded, and what it held is not kept.
 */
export function VisitNotebook({ lines, cleared, width = 260 }: { lines: number; cleared: boolean; width?: number }) {
  return (
    <svg data-art="visit-notebook" data-lines={lines} data-cleared={cleared} width={width} height={(width * 264) / 230} viewBox="0 0 230 264" style={{ opacity: cleared ? 0.5 : 1, transition: 'opacity 0.8s' }} aria-hidden="true">
      <ellipse cx="115" cy="256" rx="100" ry="7" fill="rgba(127,127,127,0.2)" />
      <rect x="24" y="30" width="182" height="222" rx="10" fill="var(--panel-strong)" stroke={G_DARK} strokeWidth="3" strokeDasharray={cleared ? '9 7' : undefined} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={40 + i * 24} y="18" width="10" height="26" rx="5" fill="none" stroke={G_DARK} strokeWidth="3" />
      ))}
      {[78, 110, 142].map((y, i) => (
        <motion.path key={y} d={`M46 ${y}h136`} stroke="#1B8A9C" strokeWidth="5" strokeLinecap="round" initial={false} animate={{ pathLength: lines > i && !cleared ? 1 : 0, opacity: lines > i && !cleared ? 1 : 0 }} transition={{ duration: 0.7, ease: EASE }} />
      ))}
      {[174, 206].map((y, i) => (
        <path key={y} d={`M46 ${y}h${i === 1 ? 80 : 136}`} stroke={G_LIGHT} strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10" />
      ))}
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
  message: string;
}

const MERCER_SAYS = ['Corrosion on the bearing assemblies', 'About 25 percent section loss', 'Repair within 60 days'];

/**
 * Why the first one forgot, one page that builds on every Next (owner, 6 Nov): the memory analogy of Lab 2 (the visit notebook is
 * short-term memory). Mercer's three messages arrive one by one and the AI agent writes each in its notebook; the chat closes; the
 * notebook is cleared: it only held this visit.
 */
export function WhyForgot({ kicker, message }: WhyForgotProps) {
  const L = useBuild();
  const closed = L >= 4;
  return (
    <HalfPanel kicker={kicker} message={message} testId="why-forgot">
      <div data-forgot="chat" style={{ ...card(closed ? 'grey' : 'teal'), flex: 'none' }}>
        {cap('DAY 1', !closed)}
        {MERCER_SAYS.map((t, i) => (
          <Reveal key={t} show={L > i} testId={`say-${i}`} style={{ alignSelf: 'flex-end' }}>
            <div style={{ ...bubble(true), fontSize: 27, padding: '8px 18px', opacity: closed ? 0.45 : 1, transition: 'opacity 0.6s' }}>{t}</div>
          </Reveal>
        ))}
        <Reveal show={closed} style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-dim)', borderTop: '2px dashed var(--line)', paddingTop: 10 }}>
          SESSION CLOSED · Mercer goes home
        </Reveal>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
        <VisitNotebook lines={L} cleared={closed} width={270} />
        <div style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15 }}>Visit notebook</div>
          <div style={{ marginTop: 10, fontSize: 26 }}><Hl strong>short-term memory</Hl></div>
          <Reveal show={L >= 3}>
            <div style={{ fontSize: 26, color: 'var(--ink-dim)', lineHeight: 1.35, marginTop: 10 }}>{closed ? 'The visit is over, so the notebook is cleared. Nothing Mercer said is kept.' : 'This visit’s scribbles: this chat and its context window.'}</div>
          </Reveal>
        </div>
      </div>
    </HalfPanel>
  );
}

/* ---------------------------------------------------------------- 3 · where it goes */

export interface WhereItGoesProps {
  kicker: string;
  /** 1: the notes go in the filing cabinet; 2: one report becomes three cards, then Vance's three questions pull them back */
  step: 1 | 2;
  message: string;
}

const KINDS = [
  { name: 'What happened', term: 'episodic', say: 'Found corrosion at the bearings.', hl: 'corrosion', like: 'like last summer’s trip', ask: '“What happened here?”', icon: 'pin' as const },
  { name: 'What is true', term: 'semantic', say: 'About 25% section loss.', hl: '25%', like: 'like what you learned at school', ask: '“How bad is it?”', icon: 'cap' as const },
  { name: 'How we work', term: 'procedural', say: 'Remove loose rust before the primer.', hl: 'loose rust', like: 'like riding a bike', ask: '“What do we do?”', icon: 'bike' as const },
];
/** the card's sentence with its key words highlighted */
const marked = (say: string, hl: string): ReactNode => {
  const i = say.indexOf(hl);
  return i < 0 ? say : <>{say.slice(0, i)}<Hl>{hl}</Hl>{say.slice(i + hl.length)}</>;
};

export function WhereItGoes({ kicker, step, message }: WhereItGoesProps) {
  return (
    <WidePanel kicker={kicker} message={message} testId="where-it-goes" step={step}>
      <Fill>{step === 1 ? <CabinetStep /> : <CardsStep />}</Fill>
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
    <div data-where="logbook" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '0 10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: 560 }}>
          <div style={{ display: 'flex', gap: 22 }}>{[-5, 3, -2].map(note)}</div>
          <div style={{ fontSize: 38, color: 'var(--ink-dim)', fontWeight: 600 }}>Mercer’s notes</div>
        </div>
        <Reveal show={L >= 1} testId="logbook" style={{ display: 'flex', alignItems: 'center', gap: 30, flex: 1, justifyContent: 'flex-end' }}>
          <svg width="130" height="70" viewBox="0 0 130 60" aria-hidden="true"><path d="M8 30h104M88 8l24 22-24 22" stroke="var(--teal)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{ width: 340, height: 390, flex: 'none' }}>{L >= 1 && <Logbook />}</div>
          <div style={{ maxWidth: 400 }}>
            <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>Bridge logbook</div>
            <div style={{ marginTop: 10, fontSize: 27 }}><Hl strong>long-term memory</Hl></div>
            <div style={{ fontSize: 29, color: 'var(--ink)', lineHeight: 1.7, marginTop: 10 }}><Hl strong>permanent</Hl>, found by <Hl>name</Hl> or by <Hl>meaning</Hl></div>
          </div>
        </Reveal>
      </div>
      <Reveal show={L >= 2} testId="database" style={{ flex: 'none', paddingTop: 10 }}>
        <DbShelf height={96} badge={132} size={36}>Oracle Autonomous AI Database 26ai · <span style={{ opacity: 0.9, fontWeight: 600 }}>the logbook lives here</span></DbShelf>
      </Reveal>
    </div>
  );
}

function CardsStep() {
  const L = useBuild();
  // one report becomes three cards, one per click; then Vance's three questions, one per click, then the line under them
  const pull = L >= 1;
  const cardShown = (i: number) => L > i;
  const askShown = (i: number) => L > i;
  return (
    <div data-where={pull ? 'pull' : 'cards'} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 26px', borderRadius: 18, background: 'var(--panel-strong)', border: '2px solid var(--line)', fontSize: 31, lineHeight: 1.5 }}>
        <img src={mercerPortrait} alt="Mercer" style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', flex: 'none' }} />
        <div style={{ flex: 1 }}>{KINDS.map((k, i) => <span key={k.say} style={{ background: cardShown(i) ? 'rgba(27,138,156,0.28)' : 'rgba(27,138,156,0.1)', borderRadius: 8, padding: '0 8px', marginRight: 12, transition: 'background 0.5s' }}>{k.say}</span>)}</div>
        <div data-logbook-mini style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 96, height: 110 }}><Logbook /></div>
          <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.15 }}>in the<br /><span style={{ color: 'var(--teal)' }}>bridge logbook</span></div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 26 }}>
        {KINDS.map((k, i) => (
          <div key={k.term} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <Reveal show={askShown(i)} testId={`ask-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 84 }}>
              <img src={vancePortrait} alt="Vance" style={{ width: 66, height: 66, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 15%', border: '3px solid #fff', flex: 'none' }} />
              <div data-question style={{ ...bubble(true), fontSize: 34, lineHeight: 1.2, padding: '10px 20px', whiteSpace: 'nowrap' }}>{k.ask}</div>
            </Reveal>
            <Reveal show={cardShown(i)} testId={`card-${i}`} style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <div style={{ ...card('teal'), flex: 1, gap: 14, padding: '26px 30px', boxShadow: askShown(i) ? '0 0 0 5px rgba(27,138,156,0.25)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 70, height: 70, borderRadius: 20, background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <LineIcon name={k.icon} size={46} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>{k.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--teal)' }}>{k.term}</div>
                  </div>
                </div>
                <div style={{ fontSize: 38, lineHeight: 1.45, flex: 1, display: 'flex', alignItems: 'center' }}><span>{marked(k.say, k.hl)}</span></div>
                <div style={{ borderTop: '2px dashed var(--line)', paddingTop: 14, fontSize: 28, color: 'var(--ink-dim)' }}>{k.like}</div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      <Reveal show={L >= 3} style={{ textAlign: 'center', fontSize: 38, fontWeight: 700 }}>
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
      <div style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div data-pour="logbook" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 18 }}>
          <div style={{ width: 200, height: 230, marginBottom: -26, position: 'relative', zIndex: 1 }}><Logbook /></div>
          <div style={{ width: '100%' }}>
            <DbShelf height={84} badge={104} size={26}>Oracle Autonomous<br />AI Database 26ai</DbShelf>
          </div>
        </div>
      <div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.25 }}>The logbook keeps it all.</div>
        <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.25, color: 'var(--teal)' }}>The model reads only what is in the glass.</div>
        <div style={{ fontSize: 30, color: 'var(--ink-dim)', marginTop: 18 }}>So what we pour in, this turn, is what matters.</div>
      </div>
      </div>
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
            <div data-db-row>
              <DbShelf height={124} badge={104} size={32}>
                <div>Oracle Autonomous AI Database 26ai</div>
                <div style={{ fontSize: 22, fontWeight: 600, opacity: 0.92, marginTop: 4 }}>Parts 1 and 2: the store and the embedder</div>
              </DbShelf>
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
