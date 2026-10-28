import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import { CURATION } from './Glass';
import { LineIcon } from './icons';
import { EASE, WidePanel } from './WidePanel';

export type Which = 'memory' | 'context' | 'harness';

/** which of the four problems each discipline fixes, and the words for how (the owner's mocks, 28 Oct) */
export const FIXES: Record<Which, Record<string, string>> = {
  memory: { Volume: 'offload to the store', Accuracy: 'the fact kept on its own' },
  context: { Volume: 'compress', Relevance: 'retrieve + filter', Timing: 'built for this turn' },
  harness: { Volume: 'write + compact every turn', Timing: 'read on every call' },
};

const GREY = 'var(--ink-dim)';
const MONO = 'JetBrains Mono, monospace';
const TEAL_TINT = 'rgba(27, 138, 156, 0.12)';

const label = { fontSize: 15, fontWeight: 700, letterSpacing: 2.4, color: GREY, textTransform: 'uppercase' as const, marginBottom: 14 };

/** step timing: 1, 2, 3 arrive about a second apart, the ticks follow */
const stepAt = (i: number) => 0.5 + i * 0.9;
const TICKS_AT = 3.4;

function Tick({ size = 34 }: { size?: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: '50%', background: 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10.5l4 4 8-9" />
      </svg>
    </span>
  );
}

/** a small tumbler; `layers` filled bands from the bottom */
function MiniGlass({ w = 54, layers = 1, teal = true }: { w?: number; layers?: number; teal?: boolean }) {
  return (
    <svg data-icon="mini-glass" width={w} height={w * 1.2} viewBox="0 0 50 60" fill="none" stroke="var(--ink-dim)" strokeWidth={2} strokeLinejoin="round">
      <path d="M6 4h38l-4 52H10z" />
      {Array.from({ length: layers }).map((_, i) => (
        <rect key={i} x={13 - 0} y={47 - i * 9} width={24} height={6} rx={1.5} fill={teal ? 'rgba(27, 138, 156, 0.35)' : 'rgba(127,127,127,0.3)'} stroke={teal ? 'var(--teal)' : 'var(--ink-dim)'} strokeWidth={1.5} />
      ))}
    </svg>
  );
}

/** the Oracle AI Database cylinder */
function Cylinder({ w = 52 }: { w?: number }) {
  return (
    <span data-icon="store" style={{ display: 'inline-flex' }}>
      <LineIcon name="database" size={w} />
    </span>
  );
}

function Portrait({ src, alt, size = 84 }: { src: string; alt: string; size?: number }) {
  return <img src={src} alt={alt} width={size} height={size} style={{ borderRadius: '50%', border: '3px solid var(--teal)', objectFit: 'cover', flex: 'none' }} />;
}

function Chip({ text }: { text: string }) {
  return <span style={{ fontFamily: MONO, fontSize: 16, padding: '4px 12px', borderRadius: 7, border: '1.5px solid var(--teal)', background: TEAL_TINT, color: 'var(--ink)' }}>{text}</span>;
}

function Arrow({ delay = 0, w = 70 }: { delay?: number; w?: number }) {
  return (
    <svg width={w} height={22} viewBox={`0 0 ${w} 22`} fill="none" stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M2 11H${w - 6}`} strokeDasharray="2 7" />
      <path d={`M${w - 14} 3l9 8-9 8`} />
      <motion.circle cx={6} cy={11} r={4} fill="var(--teal)" stroke="none" initial={{ cx: 6, opacity: 0 }} animate={{ cx: w - 16, opacity: [0, 1, 1, 0] }} transition={{ delay, duration: 0.9, ease: EASE }} />
    </svg>
  );
}

/* ---------- column 1: everyday life ---------- */

const draw = { stroke: 'var(--ink-dim)', strokeWidth: 2.2, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Clerk() {
  return (
    <svg data-everyday="clerk" width="320" height="230" viewBox="0 0 320 230">
      <g {...draw}>
        <path d="M10 130h120M30 130v90M110 130v90" />
        <path d="M30 118h70M34 110h62M30 102h68" />
        <circle cx="82" cy="52" r="17" />
        <path d="M54 130c0-36 8-60 28-60s28 24 28 60" />
        <path d="M110 92l60-14" />
        <rect x="190" y="12" width="110" height="206" rx="6" />
        {[22, 76, 130, 184].map((y, i) => (
          <g key={y}>
            <rect x="198" y={y} width="94" height="40" rx="4" stroke={i === 1 ? 'var(--teal)' : undefined} fill={i === 1 ? TEAL_TINT : 'none'} />
            <path d={`M232 ${y + 20}h26`} stroke={i === 1 ? 'var(--teal)' : undefined} />
          </g>
        ))}
      </g>
      <motion.g initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 0, 22], y: [0, 0, 20], opacity: [0, 1, 1] }} transition={{ delay: 0.6, duration: 1.4, ease: EASE }}>
        <rect x="150" y="48" width="38" height="46" rx="3" transform="rotate(8 169 71)" stroke="var(--teal)" strokeWidth={2.2} fill="rgba(27,138,156,0.1)" />
        <path d="M158 62h22M158 72h22M158 82h14" stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function Librarian() {
  const shelf = (y: number) =>
    Array.from({ length: 17 }).map((_, i) => <rect key={i} x={8 + i * 18} y={y + (i % 3) * 4} width={13} height={34 - (i % 3) * 4} rx={1.5} />);
  return (
    <svg data-everyday="librarian" width="320" height="230" viewBox="0 0 320 230">
      <g {...draw}>
        <path d="M4 40h312M4 90h312" />
        {shelf(6)}
        {shelf(56)}
        <circle cx="70" cy="120" r="16" />
        <path d="M44 170c0-30 8-40 26-40s26 10 26 40" />
        <rect x="14" y="170" width="150" height="48" />
        <circle cx="270" cy="130" r="16" />
        <path d="M250 218v-46c0-24 40-24 40 0v46" />
      </g>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }}>
        <path d="M96 150c30-14 50-22 76-24" {...draw} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={172 + i * 8} y={104 + i * 5} width="40" height="48" rx="3" transform={`rotate(${-6 + i * 5} ${192 + i * 8} ${128 + i * 5})`} stroke="var(--teal)" strokeWidth={2.2} fill="rgba(27,138,156,0.1)" />
        ))}
      </motion.g>
    </svg>
  );
}

function ShiftRoutine() {
  const inspector = (x: number) => (
    <g {...draw}>
      <path d={`M${x - 14} 70a14 12 0 0 1 28 0z`} stroke="var(--teal)" fill={TEAL_TINT} />
      <rect x={x - 17} y={70} width={34} height={5} rx={2} stroke="var(--teal)" />
      <path d={`M${x - 18} 150V92c0-12 36-12 36 0v58`} />
    </g>
  );
  return (
    <div data-everyday="shift" style={{ width: 320 }}>
      <div style={{ border: '2.5px solid var(--ink-dim)', borderRadius: 10, padding: '16px 18px', width: 220, margin: '0 auto 10px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: 8, left: '50%', width: 11, height: 11, borderRadius: '50%', background: 'var(--teal)', transform: 'translateX(-50%)' }} />
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: GREY, margin: '10px 0 12px' }}>SHIFT ROUTINE</div>
        {['Read the log first', 'Write the log last'].map((t, i) => (
          <motion.div key={t} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.7, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: 'var(--ink)', marginBottom: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="4" />
              <path d="M6.5 12.5l4 4 7-8" />
            </svg>
            {t}
          </motion.div>
        ))}
      </div>
      <svg width="320" height="150" viewBox="0 0 320 160">
        {inspector(110)}
        {inspector(210)}
        <path d="M130 118l32-8" {...draw} />
      </svg>
    </div>
  );
}

const EVERYDAY: Record<Which, { art: ReactNode; caption: string }> = {
  memory: { art: <Clerk />, caption: 'A clerk files the report in labelled folders instead of piling it on the desk.' },
  context: { art: <Librarian />, caption: 'A librarian hears your question and hands you the three pages you need, not the whole library.' },
  harness: { art: <ShiftRoutine />, caption: 'A shift routine pinned on the wall that every inspector follows: check the log before starting, write in the log before leaving.' },
};

/* ---------- column 2: at Harbor Bridge ---------- */

/** a numbered step: its number sits in the rail, with a dot travelling down the connector to the next */
function Step({ n, last, children }: { n: number; last?: boolean; children: ReactNode }) {
  return (
    <motion.div data-step={n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepAt(n - 1), duration: 0.5, ease: EASE }} style={{ display: 'grid', gridTemplateColumns: '46px 1fr', columnGap: 18, position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
        {!last && (
          <>
            <span style={{ position: 'absolute', left: 22, top: 50, bottom: -14, borderLeft: '2.5px dotted var(--teal)' }} />
            <motion.span data-connector-dot style={{ position: 'absolute', left: 17, width: 12, height: 12, borderRadius: '50%', background: 'var(--teal)' }} initial={{ top: 50, opacity: 0 }} animate={{ top: [50, 110], opacity: [0, 1, 1, 0] }} transition={{ delay: stepAt(n - 1) + 0.5, duration: 0.9, ease: EASE }} />
          </>
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : 14 }}>{children}</div>
    </motion.div>
  );
}

const stepTitle = { fontSize: 23, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 8 } as const;
const bubble = { fontSize: 19, fontStyle: 'italic', padding: '10px 18px', borderRadius: 14, background: 'rgba(127, 127, 127, 0.14)', color: 'var(--ink)' } as const;

function MemorySteps() {
  return (
    <div>
      <Step n={1}>
        <div style={stepTitle}>Mercer finishes her Day 1 turn.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Portrait src={mercerPortrait} alt="Evelyn_H_Mercer" size={78} />
          <div style={bubble}>“…about 25% section loss at the bearing plate edges.”</div>
          <MiniGlass w={44} layers={1} />
        </div>
      </Step>
      <Step n={2}>
        <div style={stepTitle}>
          We file the turn in <span style={{ color: 'var(--teal)' }}>Oracle AI Database</span> as separate records.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MiniGlass w={42} layers={1} />
          <Arrow delay={stepAt(1) + 0.5} w={64} />
          <Cylinder w={48} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 10 }}>
            {['conversation', 'fact: ~25% section loss', 'guideline: remove loose corrosion before coating'].map((t, i) => (
              <motion.div key={t} data-record={t.split(':')[0]} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stepAt(1) + 0.8 + i * 0.2, duration: 0.4, ease: EASE }}>
                <Chip text={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </Step>
      <Step n={3} last>
        <div style={stepTitle}>The glass empties for the next turn. Nothing is lost.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MiniGlass w={56} layers={0} />
          <Arrow delay={stepAt(2) + 0.5} w={64} />
          <Cylinder w={56} />
          <div style={{ fontSize: 21, fontWeight: 700, color: 'var(--teal)', lineHeight: 1.35, marginLeft: 12 }}>The 25% is its own record,<br />so a summary can’t drop it.</div>
        </div>
      </Step>
    </div>
  );
}

function ContextSteps() {
  return (
    <div>
      <Step n={1}>
        <div style={stepTitle}>Vance asks a question.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Portrait src={vancePortrait} alt="Jordan_Vance" size={78} />
          <div style={bubble}>“What happened at this pier?”</div>
        </div>
      </Step>
      <Step n={2}>
        <div style={stepTitle}>Search the store and keep only what matches.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cylinder w={56} />
          <Arrow delay={stepAt(1) + 0.5} w={60} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Mercer’s finding', 'her guideline'].map((t, i) => (
              <motion.div key={t} data-record={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stepAt(1) + 0.8 + i * 0.2, duration: 0.4, ease: EASE }}>
                <Chip text={t} />
              </motion.div>
            ))}
          </div>
          <span style={{ fontSize: 19, color: GREY, marginLeft: 14, maxWidth: 150, lineHeight: 1.3 }}>the rest stays in the store</span>
        </div>
      </Step>
      <Step n={3} last>
        <div style={stepTitle}>Old chat turns become a one-line summary. The glass is poured fresh.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MiniGlass w={64} layers={4} />
          <div style={{ fontSize: 19, lineHeight: 1.45 }}>
            <div style={{ color: 'var(--ink)' }}>Vance’s question</div>
            <div style={{ color: GREY }}>summary of old turns</div>
            <div style={{ color: 'var(--teal)', fontWeight: 700 }}>her guideline</div>
            <div style={{ color: 'var(--teal)', fontWeight: 700 }}>Mercer’s finding</div>
          </div>
        </div>
      </Step>
    </div>
  );
}

const STATIONS = [
  { n: 1, name: 'Read', text: 'before the model answers, load memory into the glass' },
  { n: 2, name: 'Act', text: 'the model reasons and calls tools' },
  { n: 3, name: 'Write', text: 'save what happened to the store' },
  { n: 4, name: 'Summarize', text: 'when the thread gets long, roll old turns into a summary' },
];
/** grid cell for each station, clockwise: Read top left, Act top right, Write bottom right, Summarize bottom left */
const CELL = ['1 / 1', '1 / 3', '3 / 3', '3 / 1'];
/** the arrow out of each station, in the gaps between them; it lights while its station is lit */
const LOOP_ARROWS = [
  { from: 0, to: 'Act', row: 1, col: 2, glyph: '→' },
  { from: 1, to: 'Write', row: 2, col: 3, glyph: '↓' },
  { from: 2, to: 'Summarize', row: 3, col: 2, glyph: '←' },
  { from: 3, to: 'Read', row: 2, col: 1, glyph: '↑' },
];
const WALK_MS = 1400;
const TURN_MS = 240;

function HarnessLoop() {
  const [lit, setLit] = useState(-1);
  const [turn, setTurn] = useState(1);
  useEffect(() => {
    const start = setTimeout(() => setLit(0), 1200);
    const walk = setInterval(() => setLit((l) => (l < 0 ? l : (l + 1) % 4)), WALK_MS);
    const count = setInterval(() => setTurn((t) => Math.min(15, t + 1)), TURN_MS);
    return () => {
      clearTimeout(start);
      clearInterval(walk);
      clearInterval(count);
    };
  }, []);
  return (
    <div data-harness-loop>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: GREY }}>
        The <b style={{ color: 'var(--ink)' }}>harness</b> is the loop code your agent already runs in: LangGraph, Claude Agent SDK, OpenAI Agents SDK, or your own Python.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 10px' }}>
        <span data-turn={turn} style={{ fontSize: 21, fontWeight: 700, color: 'var(--ink)', marginRight: 6, minWidth: 110 }}>turn 1 → {turn}</span>
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} data-turn-dot={i + 1} style={{ width: i === 0 || i === 14 ? 24 : 12, height: i === 0 || i === 14 ? 24 : 12, borderRadius: '50%', background: i < turn ? 'var(--teal)' : 'rgba(27, 138, 156, 0.22)', transition: 'background 0.2s' }} />
        ))}
      </div>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 70px 1fr', gridTemplateRows: 'auto 64px auto' }}>
        {STATIONS.map((s, i) => {
          const [r, c] = CELL[i].split(' / ').map(Number);
          const on = lit === i;
          return (
            <motion.div
              key={s.name}
              data-station={s.name}
              data-lit={on ? 'true' : 'false'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, boxShadow: on ? '0 0 0 3px rgba(27, 138, 156, 0.35)' : '0 0 0 0px rgba(27, 138, 156, 0)' }}
              transition={{ opacity: { delay: 0.3 + i * 0.2, duration: 0.5 }, y: { delay: 0.3 + i * 0.2, duration: 0.5, ease: EASE }, boxShadow: { duration: 0.5, ease: EASE } }}
              style={{ gridRow: r, gridColumn: c, border: '2px solid var(--teal)', borderRadius: 12, padding: '10px 16px', background: on ? TEAL_TINT : 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
                <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 19, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</span>
                {s.name}
              </div>
              <div style={{ fontSize: 17, lineHeight: 1.3, color: 'var(--ink)', marginTop: 4 }}>{s.text}</div>
            </motion.div>
          );
        })}
        {/* the way round: 1 → 2 across the top, down to 3, back to 4, up to 1; the glass in the middle */}
        {LOOP_ARROWS.map((a) => (
          <div key={a.to} data-loop-arrow={a.to} style={{ gridRow: a.row, gridColumn: a.col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: lit === a.from ? 'var(--teal)' : 'var(--ink-dim)', transition: 'color 0.4s' }}>
            {a.glyph}
          </div>
        ))}
        <div style={{ gridRow: 2, gridColumn: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MiniGlass w={46} layers={3} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 2 }}>
        <Cylinder w={44} />
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--teal)' }}>Oracle AI Database</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)', marginTop: 10 }}>Nobody has to remember to look. The loop does it every time.</div>
    </div>
  );
}

/* ---------- column 3: problems it fixes ---------- */

function Problems({ which }: { which: Which }) {
  const fixes = FIXES[which];
  let k = 0;
  return (
    <div>
      {CURATION.map((c) => {
        const how = fixes[c.word];
        const delay = how ? TICKS_AT + k++ * 0.4 : TICKS_AT;
        return how ? (
          <motion.div key={c.word} data-fix={c.word} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', marginBottom: 12, borderRadius: 12, border: '2px solid var(--teal)', background: TEAL_TINT }}>
            <Tick />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{c.word}</div>
              <div style={{ fontSize: 19, color: 'var(--teal)', fontWeight: 500, lineHeight: 1.25 }}>{how}</div>
            </div>
          </motion.div>
        ) : (
          <div key={c.word} data-unfixed={c.word} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', marginBottom: 12, borderRadius: 12, border: '2px dashed var(--line)', opacity: 0.6 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--line)', flex: 'none' }} />
            <div style={{ fontSize: 24, fontWeight: 700, color: GREY }}>{c.word}</div>
          </div>
        );
      })}
      <div style={{ fontSize: 16, color: GREY, marginTop: 4 }}>the four problems in the glass</div>
    </div>
  );
}

/**
 * 3.13 to 3.15 · One discipline, three columns: the everyday picture, what it does at Harbor Bridge, and
 * which of the four problems it fixes. Steps 1, 2, 3 arrive in turn with a dot along each connector, then
 * the ticks; for the harness a light walks the loop while the turn counter runs to 15.
 */
export interface DisciplineProps {
  kicker: string;
  /** the one line the presenter lands; **teal** marks as in Rich.tsx */
  message: string;
  which: Which;
  notebook?: string;
}

export function Discipline({ kicker, message, which, notebook }: DisciplineProps) {
  const e = EVERYDAY[which];
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="discipline">
      <div data-which={which} style={{ display: 'grid', gridTemplateColumns: '340px 1fr 270px', gap: 0, marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
        <div style={{ paddingRight: 24, borderRight: '1px solid var(--line)' }}>
          <div style={label}>In everyday life</div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>{e.art}</motion.div>
          <div data-caption style={{ fontSize: 20, lineHeight: 1.45, color: 'var(--ink)', marginTop: 14 }}>{e.caption}</div>
        </div>
        <div style={{ padding: '0 28px', borderRight: '1px solid var(--line)' }}>
          <div style={label}>At Harbor Bridge</div>
          {which === 'memory' && <MemorySteps />}
          {which === 'context' && <ContextSteps />}
          {which === 'harness' && <HarnessLoop />}
        </div>
        <div style={{ paddingLeft: 24 }}>
          <div style={label}>Problems it fixes</div>
          <Problems which={which} />
        </div>
      </div>
    </WidePanel>
  );
}

/* ---------- 3.16 who fixes what ---------- */

const DISCIPLINES: { key: Which; name: string; n: string; icon: 'database' | 'funnel' | 'loop' }[] = [
  { key: 'memory', name: 'Memory', n: '①', icon: 'database' },
  { key: 'context', name: 'Context', n: '②', icon: 'funnel' },
  { key: 'harness', name: 'Harness', n: '③', icon: 'loop' },
];
const ROWS: { word: string; shown: string; sub: string }[] = [
  { word: 'Volume', shown: 'Volume', sub: 'it overflows' },
  { word: 'Relevance', shown: 'Relevance', sub: 'the finding is buried' },
  { word: 'Accuracy', shown: 'Accuracy / Fidelity', sub: 'a summary loses the 25%' },
  { word: 'Timing', shown: 'Timing', sub: 'gone when Vance asks' },
];

/** 3.16 · The grid: three disciplines by four problems; the filled cells light one by one, row by row. */
export interface WhoFixesWhatProps {
  kicker: string;
  message: string;
  notebook?: string;
}

export function WhoFixesWhat({ kicker, message, notebook }: WhoFixesWhatProps) {
  let k = 0;
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="who-fixes-what">
      <div data-grid style={{ display: 'grid', gridTemplateColumns: '300px repeat(3, 1fr)', columnGap: 12, rowGap: 12, marginTop: 16, alignItems: 'stretch' }}>
        <div />
        {DISCIPLINES.map((d, i) => (
          <motion.div key={d.key} data-column={d.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>
            <LineIcon name={d.icon} size={40} />
            {d.n} {d.name}
          </motion.div>
        ))}
        {ROWS.flatMap((r) => [
          <div key={r.word} data-row={r.word} style={{ alignSelf: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>{r.shown}</div>
            <div style={{ fontSize: 19, color: GREY }}>{r.sub}</div>
          </div>,
          ...DISCIPLINES.map((d) => {
            const how = FIXES[d.key][r.word];
            if (!how) return <div key={d.key + r.word} data-empty-cell={`${d.name}>${r.word}`} style={{ minHeight: 84, borderRadius: 10, background: 'rgba(127, 127, 127, 0.12)' }} />;
            const delay = 1 + k++ * 0.3;
            return (
              <motion.div key={d.key + r.word} data-cell={`${d.name}>${r.word}`} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.5, ease: EASE }} style={{ minHeight: 84, borderRadius: 10, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 23, fontWeight: 600, padding: '0 12px', textAlign: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                  <path d="M4 10.5l4 4 8-9" />
                </svg>
                {how}
              </motion.div>
            );
          }),
        ])}
      </div>
    </WidePanel>
  );
}
