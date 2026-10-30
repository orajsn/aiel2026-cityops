import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import { CURATION } from './Glass';
import { LineIcon } from './icons';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './Fill';

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

const label = { fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: GREY, textTransform: 'uppercase' as const, marginBottom: 18 };

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
  return <span style={{ display: 'inline-block', lineHeight: 1.35, fontFamily: MONO, fontSize: 18, padding: '5px 12px', borderRadius: 7, border: '1.5px solid var(--teal)', background: TEAL_TINT, color: 'var(--ink)' }}>{text}</span>;
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

const SKIN = '#c98e6b';
const SKIN2 = '#8d5a3b';
const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const T_SOFT = 'rgba(27, 138, 156, 0.28)';
const T_MID = 'rgba(27, 138, 156, 0.6)';

const MERCER_TOP = '#6f6a8f';
const VANCE_SUIT = '#2f3640';
const VANCE_HAIR = '#a8643f';
const MERCER_HAIR = '#2b2f36';

/** a drawn flat head with ears, hair and a friendly face; `who` picks Mercer or Vance */
function Head({ who, cx, cy, r = 20 }: { who: 'mercer' | 'vance'; cx: number; cy: number; r?: number }) {
  const skin = who === 'mercer' ? SKIN2 : SKIN;
  const k = r / 20;
  return (
    <g data-head={who}>
      <circle cx={cx - r} cy={cy + 2 * k} r={4 * k} fill={skin} />
      <circle cx={cx + r} cy={cy + 2 * k} r={4 * k} fill={skin} />
      <circle cx={cx} cy={cy} r={r} fill={skin} />
      {who === 'mercer' ? (
        <>
          <circle cx={cx} cy={cy - r - 1 * k} r={7 * k} fill={MERCER_HAIR} />
          <path d={`M${cx - r - 1} ${cy - 2 * k}A${r + 1} ${r + 1} 0 0 1 ${cx + r + 1} ${cy - 2 * k}L${cx + r * 0.75} ${cy - 8 * k}H${cx - r * 0.75}Z`} fill={MERCER_HAIR} />
        </>
      ) : (
        <path d={`M${cx - r - 1} ${cy - 2 * k}L${cx - r - 1} ${cy - 12 * k}L${cx - 11 * k} ${cy - r - 5 * k}L${cx - 4 * k} ${cy - r + 2 * k}L${cx} ${cy - r - 7 * k}L${cx + 5 * k} ${cy - r + 2 * k}L${cx + 11 * k} ${cy - r - 5 * k}L${cx + r + 1} ${cy - 12 * k}L${cx + r + 1} ${cy - 2 * k}L${cx + r * 0.75} ${cy - 8 * k}H${cx - r * 0.75}Z`} fill={VANCE_HAIR} />
      )}
      <g stroke="var(--ink)" strokeLinecap="round" fill="none" strokeWidth={2.2 * k}>
        <path d={`M${cx - 7 * k} ${cy + 1 * k}v${3 * k}M${cx + 7 * k} ${cy + 1 * k}v${3 * k}`} />
        <path d={`M${cx - 5 * k} ${cy + 9 * k}q${5 * k} ${4 * k} ${10 * k} 0`} strokeWidth={1.8 * k} />
      </g>
    </g>
  );
}

function Name({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" fill="var(--ink)">
      {text}
    </text>
  );
}

function Clerk() {
  return (
    <svg data-everyday="clerk" width="320" height="230" viewBox="0 0 320 230">
      {/* floor shadow */}
      <ellipse cx="160" cy="222" rx="150" ry="6" fill="rgba(127,127,127,0.18)" />
      {/* filing cabinet: body, side in a darker tone, four drawers */}
      <rect x="190" y="12" width="110" height="206" rx="8" fill={G_DARK} />
      <rect x="190" y="12" width="104" height="206" rx="8" fill={G_MID} opacity={0.9} />
      {[20, 72, 124, 176].map((y, i) => (
        <g key={y}>
          <rect x="198" y={y} width="88" height="36" rx="5" fill={i === 1 ? T_MID : G_LIGHT} stroke={i === 1 ? 'var(--teal)' : G_DARK} strokeWidth={2} />
          <rect x="226" y={y + 7} width="32" height="9" rx="2.5" fill="rgba(255,255,255,0.7)" />
          <path d={`M232 ${y + 11.5}h20`} stroke={G_DARK} strokeWidth={2} strokeLinecap="round" />
          <rect x="228" y={y + 22} width="28" height="7" rx="3.5" fill={i === 1 ? 'var(--teal)' : G_DARK} />
        </g>
      ))}
      {/* the teal drawer, pulled open a little */}
      <path d="M198 74l-10 7v26l10-2z" fill="var(--teal)" opacity={0.85} />
      {/* desk: top, front, legs in two tones */}
      <rect x="6" y="128" width="136" height="12" rx="4" fill={G_MID} />
      <rect x="10" y="140" width="128" height="14" rx="2" fill={G_DARK} />
      <rect x="16" y="154" width="12" height="64" rx="3" fill={G_DARK} />
      <rect x="120" y="154" width="12" height="64" rx="3" fill={G_DARK} />
      <rect x="104" y="154" width="14" height="40" rx="3" fill={G_MID} opacity={0.7} />
      {/* papers on the desk */}
      <rect x="24" y="118" width="40" height="10" rx="2" fill="rgba(138,145,156,0.55)" />
      <rect x="28" y="110" width="34" height="9" rx="2" fill={T_SOFT} />
      {/* the clerk */}
      <path d="M52 132c0-34 6-56 30-56s30 22 30 56z" fill={MERCER_TOP} />
      <path d="M72 78l10 16 10-16z" fill="rgba(255,255,255,0.75)" />
      <path d="M82 94v38" stroke="var(--teal)" strokeWidth={3} />
      <rect x="76" y="68" width="12" height="12" rx="5" fill={SKIN2} />
      <Head who="mercer" cx={82} cy={50} r={20} />
      {/* arm reaching to the folder: it lets go once the folder is in the drawer and draws back (the hand never rides along) */}
      <motion.g initial={{ x: 0 }} animate={{ x: [0, 0, -34] }} transition={{ delay: 0.6, duration: 2.2, times: [0, 0.55, 1], ease: EASE }}>
        <path d="M100 92c12 2 26 -2 46 -12" stroke={MERCER_TOP} strokeWidth={13} strokeLinecap="round" fill="none" />
        <circle cx="148" cy="78" r="7" fill={SKIN2} />
      </motion.g>
      {/* the folder slides into the open teal drawer */}
      <motion.g initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 0, 38], y: [0, 0, 12], opacity: [0, 1, 1] }} transition={{ delay: 0.6, duration: 1.4, ease: EASE }}>
        <g transform="rotate(8 169 71)">
          <rect x="150" y="48" width="38" height="46" rx="4" fill="var(--teal)" />
          <path d="M150 54a4 4 0 0 1 4-4h12l4 5h14a4 4 0 0 1 4 4v-5a4 4 0 0 0-4-4h-14l-4-5h-12a4 4 0 0 0-4 4z" fill="var(--teal)" opacity={0.7} />
          <rect x="158" y="64" width="22" height="3.5" rx="1.7" fill="rgba(255,255,255,0.85)" />
          <rect x="158" y="73" width="22" height="3.5" rx="1.7" fill="rgba(255,255,255,0.85)" />
          <rect x="158" y="82" width="14" height="3.5" rx="1.7" fill="rgba(255,255,255,0.85)" />
        </g>
      </motion.g>
    </svg>
  );
}

function Librarian() {
  const spines = ['rgba(27,138,156,0.65)', G_MID, 'rgba(27,138,156,0.35)', G_DARK, 'rgba(138,145,156,0.55)', 'rgba(27,138,156,0.5)'];
  const shelf = (y: number, seed: number) =>
    Array.from({ length: 17 }).map((_, i) => {
      const h = 34 - ((i + seed) % 4) * 4;
      return <rect key={i} x={8 + i * 18} y={y + 34 - h} width={14} height={h} rx={2} fill={spines[(i * 5 + seed) % spines.length]} />;
    });
  return (
    <svg data-everyday="librarian" width="320" height="230" viewBox="0 0 320 230">
      {/* back wall + bookshelves */}
      <rect x="0" y="0" width="320" height="100" rx="8" fill="rgba(138,145,156,0.16)" />
      {shelf(4, 0)}
      <rect x="0" y="38" width="320" height="6" rx="2" fill={G_DARK} />
      {shelf(48, 2)}
      <rect x="0" y="82" width="320" height="6" rx="2" fill={G_DARK} />
      
      {/* Mercer behind the counter */}
      <path d="M44 176c0-34 6-48 26-48s26 14 26 48z" fill={MERCER_TOP} />
      <path d="M62 130l8 14 8-14z" fill="rgba(255,255,255,0.75)" />
      <rect x="64" y="116" width="12" height="14" rx="5" fill={SKIN2} />
      <Head who="mercer" cx={70} cy={102} r={19} />
      {/* counter */}
      <rect x="4" y="166" width="168" height="12" rx="4" fill={G_MID} />
      <rect x="8" y="178" width="160" height="36" rx="3" fill={G_DARK} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={16 + i * 50} y="184" width="42" height="24" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      ))}
      {/* Vance receives */}
      <path d="M244 206v-38c0-22 12-32 28-32s28 10 28 32v38z" fill={VANCE_SUIT} />
      <path d="M262 136l10 16 10-16z" fill="rgba(255,255,255,0.85)" />
      <path d="M270 142h4l2 20-4 4-4-4z" fill="var(--teal)" />
      <rect x="264" y="120" width="12" height="14" rx="5" fill={SKIN} />
      <Head who="vance" cx={270} cy={106} r={19} />
      <Name x={70} y={226} text="Mercer" />
      <Name x={270} y={226} text="Vance" />
      {/* arms and the three pages passing across */}
      <path d="M92 150c28 2 50 -10 74 -14" stroke={MERCER_TOP} strokeWidth={12} strokeLinecap="round" fill="none" />
      <path d="M252 152c-12 0 -24 -6 -36 -14" stroke={VANCE_SUIT} strokeWidth={12} strokeLinecap="round" fill="none" />
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={172 + i * 8} y={104 + i * 5} width="38" height="46" rx="4" transform={`rotate(${-6 + i * 5} ${192 + i * 8} ${128 + i * 5})`} fill={i === 2 ? 'var(--teal)' : T_MID} stroke="var(--teal)" strokeWidth={1.5} />
        ))}
        <path d="M188 140h20M188 148h20" stroke="rgba(255,255,255,0.85)" strokeWidth={3} strokeLinecap="round" />
        <circle cx="170" cy="136" r="7" fill={SKIN2} />
        <circle cx="214" cy="140" r="7" fill={SKIN} />
      </motion.g>
    </svg>
  );
}

function ShiftRoutine() {
  const inspector = (x: number, who: 'mercer' | 'vance', name: string) => (
    <g>
      <rect x={x - 14} y={118} width={11} height={36} rx={4} fill={G_DARK} />
      <rect x={x + 3} y={118} width={11} height={36} rx={4} fill={G_DARK} />
      <path d={`M${x - 24} 124V90c0-12 8-18 24-18s24 6 24 18v34z`} fill={who === 'mercer' ? MERCER_TOP : VANCE_SUIT} />
      <rect x={x - 31} y={86} width={12} height={34} rx={6} fill={who === 'mercer' ? MERCER_TOP : VANCE_SUIT} />
      <rect x={x + 19} y={86} width={12} height={34} rx={6} fill={who === 'mercer' ? MERCER_TOP : VANCE_SUIT} />
      <circle cx={x - 25} cy={122} r={5.5} fill={who === 'mercer' ? SKIN2 : SKIN} />
      <circle cx={x + 25} cy={122} r={5.5} fill={who === 'mercer' ? SKIN2 : SKIN} />
      <path d={`M${x - 20} 124V88c0-6 6-10 12-10l8 12 8-12c6 0 12 4 12 10v36z`} fill="var(--teal)" />
      <rect x={x - 20} y={106} width={40} height={5} fill="rgba(255,255,255,0.8)" />
      <rect x={x - 20} y={116} width={40} height={4} fill="rgba(255,255,255,0.8)" />
      <rect x={x - 5} y={68} width={10} height={10} rx={4} fill={who === 'mercer' ? SKIN2 : SKIN} />
      <Head who={who} cx={x} cy={54} r={17} />
      {/* teal hard hat drawn over the top of the portrait */}
      <path d={`M${x - 19} 40a19 16 0 0 1 38 0z`} fill="var(--teal)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      <rect x={x - 23} y={38} width={46} height={6} rx={3} fill="var(--teal)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      <rect x={x - 3.5} y={26} width={7} height={11} rx={3} fill="rgba(255,255,255,0.45)" />
      <Name x={x} y={176} text={name} />
    </g>
  );
  return (
    <div data-everyday="shift" style={{ width: 320 }}>
      <div style={{ border: `3px solid ${G_DARK}`, background: 'rgba(138, 145, 156, 0.14)', boxShadow: '0 4px 0 rgba(127,127,127,0.25)', borderRadius: 10, padding: '16px 18px', width: 230, margin: '0 auto 8px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: -7, left: '50%', width: 14, height: 14, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 2px 0 rgba(0,0,0,0.25)', transform: 'translateX(-50%)' }} />
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: GREY, margin: '8px 0 12px' }}>SHIFT ROUTINE</div>
        {['Read the log first', 'Write the log last'].map((t, i) => (
          <motion.div key={t} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.7, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, color: 'var(--ink)', marginBottom: 8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="4" fill={TEAL_TINT} />
              <path d="M6.5 12.5l4 4 7-8" />
            </svg>
            {t}
          </motion.div>
        ))}
      </div>
      <svg width="320" height="164" viewBox="0 8 320 168">
        <ellipse cx="160" cy="157" rx="120" ry="4" fill="rgba(127,127,127,0.2)" />
        {inspector(100, 'mercer', 'Mercer')}
        {inspector(220, 'vance', 'Vance')}
      </svg>
    </div>
  );
}

const EVERYDAY: Record<Which, { art: ReactNode; caption: string }> = {
  memory: { art: <Clerk />, caption: 'Mercer files the report in labelled folders instead of piling it on the desk.' },
  context: { art: <Librarian />, caption: 'Mercer hears the question and hands Vance just the pages he needs, not the whole library.' },
  harness: { art: <ShiftRoutine />, caption: 'A shift routine pinned on the wall that every inspector follows: check the log before starting, write in the log before leaving.' },
};

/* ---------- column 2: at Harbor Bridge ---------- */

/** a numbered step: its number sits in the rail, with a dot travelling down the connector to the next */
function Step({ n, last, children }: { n: number; last?: boolean; children: ReactNode }) {
  return (
    <motion.div data-step={n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepAt(n - 1), duration: 0.5, ease: EASE }} style={{ flex: last ? 'none' : '1 0 auto', display: 'grid', gridTemplateColumns: '50px 1fr', columnGap: 20, position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
        {!last && (
          <>
            <span style={{ position: 'absolute', left: 24, top: 56, bottom: 6, borderLeft: '2.5px dotted var(--teal)' }} />
            <motion.span data-connector-dot style={{ position: 'absolute', left: 19, width: 12, height: 12, borderRadius: '50%', background: 'var(--teal)' }} initial={{ top: '0%', opacity: 0 }} animate={{ top: ['0%', '90%'], opacity: [0, 1, 1, 0] }} transition={{ delay: stepAt(n - 1) + 0.5, duration: 0.9, ease: EASE }} />
          </>
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : 24 }}>{children}</div>
    </motion.div>
  );
}

const stepTitle = { fontSize: 26, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 12 } as const;
const bubble = { fontSize: 22, fontStyle: 'italic', padding: '12px 20px', borderRadius: 14, background: 'rgba(127, 127, 127, 0.14)', color: 'var(--ink)' } as const;

function MemorySteps() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Step n={1}>
        <div style={stepTitle}>Mercer finishes her Day 1 turn.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Portrait src={mercerPortrait} alt="Mercer" size={96} />
          <div style={bubble}>“…about 25% section loss at the bearing plate edges.”</div>
          <MiniGlass w={52} layers={1} />
        </div>
      </Step>
      <Step n={2}>
        <div style={stepTitle}>
          We file the turn in <span style={{ color: 'var(--teal)' }}>Oracle AI Database</span> as separate records.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MiniGlass w={50} layers={1} />
          <Arrow delay={stepAt(1) + 0.5} w={64} />
          <Cylinder w={56} />
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
          <MiniGlass w={64} layers={0} />
          <Arrow delay={stepAt(2) + 0.5} w={64} />
          <Cylinder w={64} />
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)', lineHeight: 1.35, marginLeft: 12 }}>The 25% is its own record,<br />so a summary can’t drop it.</div>
        </div>
      </Step>
    </div>
  );
}

function ContextSteps() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Step n={1}>
        <div style={stepTitle}>Vance asks a question.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Portrait src={vancePortrait} alt="Vance" size={96} />
          <div style={bubble}>“What happened at this pier?”</div>
        </div>
      </Step>
      <Step n={2}>
        <div style={stepTitle}>Search the store and keep only what matches.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cylinder w={64} />
          <Arrow delay={stepAt(1) + 0.5} w={60} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Mercer’s finding', 'her guideline'].map((t, i) => (
              <motion.div key={t} data-record={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stepAt(1) + 0.8 + i * 0.2, duration: 0.4, ease: EASE }}>
                <Chip text={t} />
              </motion.div>
            ))}
          </div>
          <span style={{ fontSize: 22, color: GREY, marginLeft: 16, maxWidth: 170, lineHeight: 1.3 }}>the rest stays in the store</span>
        </div>
      </Step>
      <Step n={3} last>
        <div style={stepTitle}>Old chat turns become a one-line summary. The glass is poured fresh.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MiniGlass w={76} layers={4} />
          <div style={{ fontSize: 22, lineHeight: 1.45 }}>
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
    <div data-harness-loop style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 20, lineHeight: 1.4, color: GREY }}>
        The <b style={{ color: 'var(--ink)' }}>harness</b> is the loop code your agent already runs in: LangGraph, Claude Agent SDK, OpenAI Agents SDK, or your own Python.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '10px 0 12px' }}>
        <span data-turn={turn} style={{ fontSize: 23, fontWeight: 700, color: 'var(--ink)', marginRight: 6, minWidth: 110 }}>turn 1 → {turn}</span>
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} data-turn-dot={i + 1} style={{ width: i === 0 || i === 14 ? 24 : 12, height: i === 0 || i === 14 ? 24 : 12, borderRadius: '50%', background: i < turn ? 'var(--teal)' : 'rgba(27, 138, 156, 0.22)', transition: 'background 0.2s' }} />
        ))}
      </div>
      <div style={{ flex: '1 0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gridTemplateRows: 'minmax(min-content, 1fr) 54px minmax(min-content, 1fr)' }}>
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
              style={{ gridRow: r, gridColumn: c, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '2px solid var(--teal)', borderRadius: 12, padding: '10px 18px', background: on ? TEAL_TINT : 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 27, fontWeight: 700, color: 'var(--ink)' }}>
                <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontSize: 21, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</span>
                {s.name}
              </div>
              <div style={{ fontSize: 19, lineHeight: 1.3, color: 'var(--ink)', marginTop: 4 }}>{s.text}</div>
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
          <MiniGlass w={54} layers={3} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
        <Cylinder w={44} />
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--teal)' }}>Oracle AI Database</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)', marginTop: 10 }}>Nobody has to remember to look. The loop does it every time.</div>
    </div>
  );
}

/* ---------- column 3: problems it fixes ---------- */

function Problems({ which }: { which: Which }) {
  const fixes = FIXES[which];
  let k = 0;
  // every box starts grey (owner, 30 Oct); the ones this discipline fixes then tick and turn teal, one after another
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
      {CURATION.map((c) => {
        const how = fixes[c.word];
        const delay = how ? TICKS_AT + k++ * 0.4 : 0;
        return (
          <motion.div
            key={c.word}
            data-fix={how ? c.word : undefined}
            data-unfixed={how ? undefined : c.word}
            initial={{ borderColor: 'rgba(127,127,127,0.35)', backgroundColor: 'rgba(127,127,127,0.06)' }}
            animate={how ? { borderColor: 'rgba(27,138,156,1)', backgroundColor: TEAL_TINT } : {}}
            transition={{ delay, duration: 0.5, ease: EASE }}
            style={{ flex: '1 1 0', minHeight: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px', borderRadius: 12, borderWidth: 2, borderStyle: how ? 'solid' : 'dashed' }}
          >
            <span style={{ position: 'relative', width: 38, height: 38, flex: 'none' }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(127,127,127,0.4)', boxSizing: 'border-box' }} />
              {how && (
                <motion.span style={{ position: 'absolute', inset: 0 }} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.4, ease: EASE }}>
                  <Tick size={38} />
                </motion.span>
              )}
            </span>
            <div>
              <motion.div initial={{ color: 'var(--ink-dim)' }} animate={how ? { color: 'var(--ink)' } : {}} transition={{ delay, duration: 0.4 }} style={{ fontSize: 27, fontWeight: 700 }}>{c.word}</motion.div>
              {how && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.2, duration: 0.4 }} style={{ fontSize: 21, color: 'var(--teal)', fontWeight: 500, lineHeight: 1.25 }}>{how}</motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
      <div style={{ fontSize: 18, color: GREY }}>the four problems in the glass</div>
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
    <WidePanel wide kicker={kicker} message={message} notebook={notebook} testId="discipline">
      <Fill>
      <div data-which={which} style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '440px minmax(0, 1fr) 560px', gap: 0, marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <div style={{ paddingRight: 26, borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={label}>In everyday life</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* the drawings are laid out at 320 px wide: shown larger, the column has the room */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ zoom: 1.2 }}>{e.art}</motion.div>
            <div data-caption style={{ fontSize: 23, lineHeight: 1.45, color: 'var(--ink)', marginTop: 18 }}>{e.caption}</div>
          </div>
        </div>
        <div style={{ padding: '0 30px', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={label}>At Harbor Bridge</div>
          {which === 'memory' && <MemorySteps />}
          {which === 'context' && <ContextSteps />}
          {which === 'harness' && <HarnessLoop />}
        </div>
        <div style={{ paddingLeft: 26, display: 'flex', flexDirection: 'column' }}>
          <div style={label}>Problems it fixes</div>
          <Problems which={which} />
        </div>
      </div>
      </Fill>
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
    <WidePanel wide kicker={kicker} message={message} notebook={notebook} testId="who-fixes-what">
      <Fill>
      <div data-grid style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '320px repeat(3, 1fr)', gridTemplateRows: 'auto repeat(4, minmax(96px, 1fr))', columnGap: 14, rowGap: 14, marginTop: 16, alignItems: 'stretch' }}>
        <div />
        {DISCIPLINES.map((d, i) => (
          <motion.div key={d.key} data-column={d.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 33, fontWeight: 700, color: 'var(--ink)', paddingBottom: 6 }}>
            <LineIcon name={d.icon} size={46} />
            {d.n} {d.name}
          </motion.div>
        ))}
        {ROWS.flatMap((r) => [
          <div key={r.word} data-row={r.word} style={{ alignSelf: 'center' }}>
            <div style={{ fontSize: 31, fontWeight: 700, color: 'var(--ink)' }}>{r.shown}</div>
            <div style={{ fontSize: 22, color: GREY, marginTop: 2 }}>{r.sub}</div>
          </div>,
          ...DISCIPLINES.map((d) => {
            const how = FIXES[d.key][r.word];
            if (!how) return <div key={d.key + r.word} data-empty-cell={`${d.name}>${r.word}`} style={{ borderRadius: 12, background: 'rgba(127, 127, 127, 0.12)' }} />;
            const delay = 1 + k++ * 0.3;
            return (
              <motion.div key={d.key + r.word} data-cell={`${d.name}>${r.word}`} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.5, ease: EASE }} style={{ borderRadius: 12, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 26, fontWeight: 600, padding: '0 14px', textAlign: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                  <path d="M4 10.5l4 4 8-9" />
                </svg>
                {how}
              </motion.div>
            );
          }),
        ])}
      </div>
      </Fill>
    </WidePanel>
  );
}
