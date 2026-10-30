import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE, WidePanel } from '../WidePanel';
import { Rich } from '../../Rich';
import { useDrawerStore } from '../../../engine/presentation';
import { LAB2_FOCUS } from '../../../content/lab2Focus';
import mercerPortrait from '../../../assets/portraits/mercer.png';
import vancePortrait from '../../../assets/portraits/vance.png';

/**
 * Lab 2's shared pieces (owner, 29 Oct: the Harbor Bridge deck's storyline in the Lab 3 design language). White
 * WidePanel, flat drawings, teal for data and the database, Oracle Red only for the one thing to look at (a page
 * passes `red` to the one element that may use it). Every page ends in a footer: the one-line takeaway, the
 * "picture → technical term" chip, and on a chapter's last page the "Next in the notebook → §x" band.
 */

export const TEAL = 'var(--teal)';
export const TEAL_D = '#146f7f';
export const TINT = 'rgba(27, 138, 156, 0.10)';
export const TINT2 = 'rgba(27, 138, 156, 0.20)';
export const SOFT = 'rgba(127, 127, 127, 0.08)';
export const GREY = '#8a97a3';
export const DIM = 'var(--ink-dim)';
export const INK = 'var(--ink)';
export const CARD = 'var(--panel-strong)';
export const RED = 'var(--red)';
export const MONO = 'JetBrains Mono, monospace';

export const fadeUp = (delay: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5, ease: EASE } });
export const fade = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.5, ease: EASE } });

/** the small uppercase label over a block */
export const cap: CSSProperties = { fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', color: DIM, textTransform: 'uppercase' };
export const capTeal: CSSProperties = { ...cap, color: TEAL_D };
/** a card: soft grey, or white with a teal edge */
export const card = (teal = false): CSSProperties => ({ borderRadius: 14, border: `2px solid ${teal ? TEAL : 'var(--line)'}`, background: teal ? CARD : SOFT, boxSizing: 'border-box' });
export const mono = (size = 18, color: string = TEAL_D): CSSProperties => ({ fontFamily: MONO, fontSize: size, color });

/** the props every Lab 2 page takes from its scene (src/scenes/chapter1.ts) */
export interface L2Props {
  kicker: string;
  /** the headline; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** which click of the page's group this is (1-based); the infographic builds up to it */
  step?: number;
  /** the one-line takeaway under the picture */
  takeaway?: string;
  /** "picture → technical term" pairs */
  terms?: [string, string][];
  /** the chapter's last page: "Next in the notebook → …" */
  next?: string;
  /** the notebook reference, e.g. "cell 21" */
  notebook?: string;
  /** the scene id, so a notebook page can follow the drawer's focus steps (LAB2_FOCUS) */
  focusId?: string;
}

/** a mono chip on a teal tint (a table, a function, a value the notebook prints) */
export function Chip({ children, style, dim = false }: { children: ReactNode; style?: CSSProperties; dim?: boolean }) {
  return <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 7, background: dim ? SOFT : TINT, ...mono(17, dim ? DIM : TEAL_D), whiteSpace: 'nowrap', ...style }}>{children}</span>;
}

/** the footer of every Lab 2 page: takeaway on the left, the glossary chip on the right, the next band under both */
function Footer({ takeaway, terms, next }: Pick<L2Props, 'takeaway' | 'terms' | 'next'>) {
  if (!takeaway && !terms?.length && !next) return null;
  return (
    <div data-footer style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: terms?.length ? 'minmax(0, 1fr) minmax(0, 0.95fr)' : 'minmax(0, 1fr)', gap: 18, alignItems: 'stretch' }}>
        <AnimatePresence mode="popLayout">
          {takeaway && (
            <motion.div key={takeaway} data-takeaway initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }} transition={{ duration: 0.5, ease: EASE, delay: 3.4 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 20px', borderLeft: `5px solid ${TEAL}`, background: TINT, borderRadius: '0 10px 10px 0' }}>
              <div style={{ ...capTeal, fontSize: 13 }}>Takeaway</div>
              <div style={{ fontSize: 22, lineHeight: 1.35, color: INK, fontWeight: 500 }}>
                <Rich text={takeaway} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {!!terms?.length && (
            <motion.div key={terms.map((t) => t.join()).join('|')} data-terms initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }} transition={{ duration: 0.5, ease: EASE, delay: 3.6 }} style={{ padding: '10px 18px', borderTop: `4px solid ${TEAL}`, borderRadius: 10, background: CARD, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ ...cap, fontSize: 13 }}>Picture → technical term</div>
              {terms.map(([pic, term]) => (
                <div key={pic} data-term={term} style={{ fontSize: 19, lineHeight: 1.35, color: INK }}>
                  {pic} <span style={{ color: TEAL }}>→</span> <b style={{ ...mono(18, TEAL_D), fontWeight: 700 }}>{term}</b>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {next && (
        <motion.div data-next {...fade(3.8)} style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px', borderRadius: 999, background: TEAL, color: '#fff', fontSize: 19, fontWeight: 600 }}>
          <span style={{ opacity: 0.85, fontWeight: 500 }}>Next in the notebook</span>
          <span aria-hidden>→</span>
          <span>{next}</span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * One Lab 2 page: the WidePanel with its kicker and headline, the page's picture in the middle (it takes all the
 * height that is left), and the footer. The kicker is red unless the page has its own red element (`hasRed`).
 */
export function L2Page({ testId, hasRed = false, children, ...p }: L2Props & { testId: string; hasRed?: boolean; children: ReactNode }) {
  return (
    <WidePanel kicker={p.kicker} message={p.message} notebook={p.notebook} testId={testId} step={p.step} kickerColor={hasRed ? TEAL : undefined}>
      <div data-picture style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {/* a takeaway only where the chapter ends, on the page with the Next band (owner, 29 Oct: not on every page) */}
      <Footer takeaway={p.next ? p.takeaway : undefined} terms={p.terms} next={p.next} />
    </WidePanel>
  );
}

/** a round step number, teal when its step is the one being talked about */
export function Num({ n, on = true, size = 40 }: { n: number | string; on?: boolean; size?: number }) {
  return (
    <span data-num={n} style={{ width: size, height: size, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.48, fontWeight: 700, background: on ? TEAL : 'rgba(127,127,127,0.18)', color: on ? '#fff' : DIM, transition: 'background 300ms, color 300ms' }}>
      {n}
    </span>
  );
}

/** a horizontal arrow with a teal dot that walks it once (or slowly again and again with `loop`) */
export function Arrow({ w = 54, delay = 0, loop = false, color = TEAL }: { w?: number; delay?: number; loop?: boolean; color?: string }) {
  return (
    <svg data-arrow width={w} height={22} viewBox={`0 0 ${w} 22`} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', overflow: 'visible' }} aria-hidden>
      <path d={`M2 11H${w - 5}`} strokeDasharray="4 6" />
      <path d={`M${w - 12} 4l7 7-7 7`} />
      <motion.circle cy={11} r={5} fill={color} stroke="none" initial={{ cx: 4, opacity: 0 }} animate={{ cx: [4, w - 14], opacity: [0, 1, 1, 0] }} transition={{ delay, duration: Math.max(1.1, w / 55), ease: 'easeInOut', repeat: loop ? Infinity : 0, repeatDelay: 3 }} />
    </svg>
  );
}

/** the same, pointing down */
export function ArrowDown({ h = 34, delay = 0 }: { h?: number; delay?: number }) {
  return (
    <svg data-arrow width={22} height={h} viewBox={`0 0 22 ${h}`} fill="none" stroke={TEAL} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', overflow: 'visible', alignSelf: 'center' }} aria-hidden>
      <path d={`M11 2V${h - 5}`} strokeDasharray="4 6" />
      <path d={`M4 ${h - 12}l7 7 7-7`} />
    </svg>
  );
}

/** Mercer or Vance, the flat portraits Lab 3 uses */
export function Portrait({ who, size = 72 }: { who: 'mercer' | 'vance'; size?: number }) {
  return (
    <img
      data-portrait={who}
      src={who === 'mercer' ? mercerPortrait : vancePortrait}
      alt={who === 'mercer' ? 'Mercer' : 'Vance'}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: '50%', border: '3px solid rgba(27, 138, 156, 0.85)', background: 'rgba(127,127,127,0.15)', objectFit: 'cover', flex: 'none', display: 'block' }}
    />
  );
}

/**
 * The chief inspector: the deck's picture of the AI agent, drawn in the portraits' blocky low-poly style (a square
 * head with a darker side facet, a teal hard hat, a teal vest). Never a third named person: it is "the AI agent".
 * `grey` draws the same figure as the well-read engineer (the language model before it looks anything up).
 */
export function ChiefInspector({ size = 96, grey = false, label = 'AI Agent' }: { size?: number; grey?: boolean; label?: string }) {
  const hat = grey ? '#9aa4ae' : '#1b8a9c';
  const hatSide = grey ? '#7d8791' : '#146f7f';
  const vest = grey ? '#aab2bc' : '#1b8a9c';
  return (
    <svg data-figure={grey ? 'engineer' : 'chief-inspector'} role="img" aria-label={label} width={size} height={size} viewBox="0 0 120 120" style={{ flex: 'none' }}>
      <circle cx="60" cy="60" r="58" fill="rgba(127,127,127,0.13)" stroke={grey ? '#aab2bc' : 'rgba(27,138,156,0.85)'} strokeWidth="3" />
      <clipPath id={`clip-${grey ? 'e' : 'c'}`}>
        <circle cx="60" cy="60" r="56" />
      </clipPath>
      <g clipPath={`url(#clip-${grey ? 'e' : 'c'})`}>
        {/* shoulders and vest */}
        <path d="M14 122l6-24 22-10h36l22 10 6 24z" fill="#4a5560" />
        <path d="M40 88h40l6 34H34z" fill={vest} />
        <path d="M52 88l8 12 8-12" fill="#e9edf1" />
        <rect x="42" y="104" width="12" height="3" rx="1" fill="#e9edf1" opacity="0.8" />
        <rect x="66" y="104" width="12" height="3" rx="1" fill="#e9edf1" opacity="0.8" />
        {/* neck and the blocky head, with a darker right facet */}
        <rect x="52" y="78" width="16" height="12" fill="#a8714f" />
        <path d="M33 40h54v36l-6 8H39l-6-8z" fill="#c98e6b" />
        <path d="M76 40h11v36l-6 8h-5z" fill="#b07a58" />
        <rect x="28" y="52" width="6" height="12" rx="2" fill="#b07a58" />
        <rect x="86" y="52" width="6" height="12" rx="2" fill="#a06c4c" />
        {/* eyes and smile, as the portraits have them */}
        <path d="M45 56l8-2 1 5-8 1z" fill="#2c3036" />
        <path d="M66 54l8 2-1 4-8-1z" fill="#2c3036" />
        <path d="M51 68h18l-3 5h-12z" fill="#2c3036" />
        {/* the hard hat: a dome and a brim */}
        <path d="M34 42c0-16 12-25 26-25s26 9 26 25z" fill={hat} />
        <path d="M70 19c9 4 16 12 16 23h-10c0-10-2-17-6-23z" fill={hatSide} />
        <rect x="26" y="40" width="68" height="7" rx="3" fill={hatSide} />
        <rect x="57" y="17" width="6" height="25" rx="2" fill={grey ? '#b7c0c9' : '#5fb3c1'} />
      </g>
    </svg>
  );
}

/** the language model as a small neural network; a soft light runs through its layers when `live` */
export function Net({ w = 120, live = false, dim = false }: { w?: number; live?: boolean; dim?: boolean }) {
  const cols = [[30, 50], [16, 36, 56], [16, 36, 56], [26, 46]];
  const xs = [10, 40, 70, 100];
  const nodes = cols.flatMap((ys, c) => ys.map((y) => ({ x: xs[c], y, c })));
  return (
    <svg data-net width={w} height={w * 0.6} viewBox="0 0 110 66" aria-label="the language model" role="img" style={{ flex: 'none', opacity: dim ? 0.4 : 1 }}>
      <g stroke={TEAL} strokeOpacity={0.35} strokeWidth={1.4}>
        {nodes.flatMap((a) => nodes.filter((b) => b.c === a.c + 1).map((b) => <line key={`${a.x}${a.y}-${b.x}${b.y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />))}
      </g>
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={6}
          stroke={TEAL}
          strokeWidth={2}
          initial={{ fill: 'rgba(27,138,156,0.18)' }}
          animate={live ? { fill: ['rgba(27,138,156,0.18)', 'rgba(27,138,156,0.95)', 'rgba(27,138,156,0.18)'] } : undefined}
          transition={live ? { delay: 1 + n.c * 0.45, duration: 1.4, repeat: Infinity, repeatDelay: 3.4, ease: 'easeInOut' } : undefined}
        />
      ))}
    </svg>
  );
}

/** the database: a teal cylinder */
export function Db({ size = 56, color = TEAL }: { size?: number; color?: string }) {
  return (
    <svg data-db width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" aria-hidden style={{ flex: 'none' }}>
      <ellipse cx="24" cy="10" rx="15" ry="5" />
      <path d="M9 10v28c0 2.8 6.7 5 15 5s15-2.2 15-5V10M9 19c0 2.8 6.7 5 15 5s15-2.2 15-5M9 28.5c0 2.8 6.7 5 15 5s15-2.2 15-5" />
    </svg>
  );
}

/** a manila folder: one retrieved chunk ("a labelled folder" in the filing cabinet) */
export function Folder({ size = 44, on = true }: { size?: number; on?: boolean }) {
  return (
    <svg data-folder width={size} height={size * 0.8} viewBox="0 0 50 40" aria-hidden style={{ flex: 'none' }}>
      <path d="M2 8a3 3 0 0 1 3-3h13l5 5h22a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill={on ? TINT2 : 'rgba(127,127,127,0.12)'} stroke={on ? TEAL : GREY} strokeWidth={2.2} />
      <path d="M2 15h46" stroke={on ? TEAL : GREY} strokeWidth={1.6} opacity={0.6} />
    </svg>
  );
}

/** the hairline crack, drawn: a grey plate with one jagged line (red only where the page allows it) */
export function CrackPlate({ w = 300, red = false }: { w?: number; red?: boolean }) {
  return (
    <svg data-crack width={w} height={w * 0.5} viewBox="0 0 300 150" aria-label="the crack" role="img" style={{ flex: 'none', maxWidth: '100%', height: 'auto' }}>
      {/* girder above, bearing plate below, the weld seam between */}
      <rect x="10" y="12" width="280" height="56" rx="4" fill="#b8c0c8" />
      <rect x="10" y="12" width="280" height="10" rx="3" fill="#a3acb5" />
      <rect x="40" y="76" width="220" height="44" rx="4" fill="#9aa4ae" />
      <rect x="20" y="68" width="260" height="8" fill="#7f8a95" />
      <motion.path
        d="M78 72l14-3 10 4 12-4 9 3 14-3 11 4 12-3 10 2"
        fill="none"
        stroke={red ? RED : '#3d4651'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 1.4, ease: EASE }}
      />
      <text x="150" y="142" textAnchor="middle" fontSize="13" fill="#5c6b78" fontFamily="Inter, sans-serif">weld seam · girder to bearing plate</text>
    </svg>
  );
}

/**
 * A notebook page's picture: the numbered steps 1..n building one after another. While the Jupyter drawer walks the
 * page's focus steps (LAB2_FOCUS), the step with the same callout number lights up and the others wait in grey.
 */
export function useFocusN(focusId?: string): number | null {
  const open = useDrawerStore((s) => s.open);
  const focus = useDrawerStore((s) => s.focus);
  if (!focusId || !open) return null;
  const steps = LAB2_FOCUS[focusId];
  if (!steps?.length) return null;
  if (focus < 1) return null;
  return steps[Math.min(focus, steps.length) - 1]?.n ?? null;
}

export interface PicStep {
  title: string;
  body: ReactNode;
  /** grid share (fr) of the row */
  grow?: number;
}

/** steps across the panel, arrows between; each builds in turn, the drawer's current one stands out */
export function StepRow({ steps, focusN, start = 0.3, gap = 0.55, arrows = true }: { steps: PicStep[]; focusN: number | null; start?: number; gap?: number; arrows?: boolean }) {
  const cols = steps.flatMap((s, i) => (i === 0 || !arrows ? [`minmax(0, ${s.grow ?? 1}fr)`] : ['54px', `minmax(0, ${s.grow ?? 1}fr)`])).join(' ');
  return (
    <div data-steps style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: cols, alignItems: 'stretch', columnGap: arrows ? 8 : 18 }}>
      {steps.map((s, i) => {
        const on = focusN === null || focusN === i + 1;
        return [
          i > 0 && arrows ? (
            <div key={`a${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Arrow w={50} delay={start + i * gap - 0.2} />
            </div>
          ) : null,
          <motion.div key={i} data-step={i + 1} data-on={on} {...fadeUp(start + i * gap)} style={{ ...card(focusN === i + 1), background: focusN === i + 1 ? CARD : SOFT, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0, opacity: on ? 1 : 0.4, transition: 'opacity 300ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Num n={i + 1} on={on} />
              <div style={{ fontSize: 24, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{s.title}</div>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, fontSize: 22, color: INK, lineHeight: 1.4 }}>{s.body}</div>
          </motion.div>,
        ];
      })}
    </div>
  );
}

/** a block of code-ish text the picture quotes (never the whole cell: the drawer shows the cell) */
export function Quote({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(31, 42, 51, 0.92)', color: '#e6e9ef', fontFamily: MONO, fontSize: 17, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word', ...style }}>{children}</div>;
}

/** a "saved output" line: what the notebook printed on the recorded run */
export function Saved({ children, label = 'Saved output' }: { children: ReactNode; label?: string }) {
  return (
    <div data-saved style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 14px', borderRadius: 10, border: '1.5px dashed rgba(27,138,156,0.6)', background: TINT }}>
      <span style={{ ...cap, fontSize: 12, color: TEAL_D, flex: 'none' }}>{label}</span>
      <span style={{ ...mono(17, INK), lineHeight: 1.4 }}>{children}</span>
    </div>
  );
}

/** a column of the build: shown from `from` on, faint before it (one panel, several clicks) */
export const upTo = (step: number | undefined, from: number) => (step ?? 99) >= from;
/** a part still to come waits faint and grey, as Lab 3's waiting columns do (LikeAPerson), so no band sits empty */
export const reveal = (shown: boolean, delay = 0.15) => ({
  initial: { opacity: 0, y: 10, filter: 'grayscale(1)' },
  animate: { opacity: shown ? 1 : 0.16, y: 0, filter: shown ? 'grayscale(0)' : 'grayscale(1)' },
  transition: { delay: shown ? delay : 0, duration: 0.5, ease: EASE },
});
