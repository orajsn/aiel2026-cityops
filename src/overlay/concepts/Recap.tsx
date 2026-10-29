import { motion } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Rich } from '../Rich';
import { EASE, WidePanel } from './WidePanel';
import { Db, Doc, GraphIcon, JsonIcon, Portrait, TableIcon } from './ThreeLabs';
import { FlowDown, Net } from './lab1/parts';

/**
 * Each lab ends on its own recap (owner approved the round-3 boards, 29 Oct: Flow110V2, Flow29V3, Flow317V2):
 * "LAB n · WHAT WE BUILT", a headline, three boxes each with an animated picture, then a NEXT band with an
 * animated graphic. The points play one after another (one every STEP seconds), the NEXT band last; calm eases,
 * no overshoot. Teal for data; Oracle Red only where the page passes its one red thing (Lab 1's crack).
 */

export const TEAL = 'var(--teal)';
export const TEAL_D = '#146f7f';
export const DIM = 'var(--ink-dim)';
export const INK = 'var(--ink)';
export const CARD = 'var(--panel-strong)';
export const TINT = 'rgba(27, 138, 156, 0.12)';
export const TINT2 = 'rgba(27, 138, 156, 0.22)';
export const MONO = 'JetBrains Mono, monospace';
/** the rust: a muted brown, never a second warm accent */
export const RUST = '#9a5a34';

/** when each point starts, and the NEXT band after the third */
export const OPEN = 0.5;
export const STEP = 3.4;
export const pointAt = (i: number) => OPEN + i * STEP;
export const NEXT_AT = OPEN + 3 * STEP - 0.2;
export const PIC_H = 300;

export const fadeUp = (delay: number, y = 10) => ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: EASE } });
export const fadeIn = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.5, ease: EASE } });
export const pop = (delay: number) => ({ initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay, duration: 0.55, ease: EASE } });
export const glide = (delay: number, x = -50) => ({ initial: { opacity: 0, x }, animate: { opacity: 1, x: 0 }, transition: { delay, duration: 0.9, ease: EASE } });

export interface RecapProps {
  kicker: string;
  /** the headline; **teal** marks as in Rich.tsx */
  message: string;
  notebook?: string;
  /** exactly three: what this lab built */
  points: { title: string; text: string }[];
  /** the NEXT band's line */
  next: string;
}

/** the small uppercase caption at the top left of a picture */
export function PicLabel({ at, children }: { at: number; children: ReactNode }) {
  return (
    <motion.div {...fadeIn(at)} style={{ position: 'absolute', left: 14, top: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: DIM, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {children}
    </motion.div>
  );
}

/** a teal arrow pointing right */
export function ArrowRight({ w = 30, at }: { w?: number; at?: number }) {
  const svg = (
    <svg width={w} height={18} viewBox={`0 0 ${w} 18`} aria-hidden="true" style={{ flex: 'none', display: 'block' }}>
      <path d={`M2 9h${w - 8}M${w - 13} 3l7 6-7 6`} fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return at === undefined ? svg : <motion.div {...fadeIn(at)} style={{ flex: 'none' }}>{svg}</motion.div>;
}

/** a chip with a tick: a source the answer came from */
export function SourceChip({ at, children }: { at: number; children: ReactNode }) {
  return (
    <motion.span {...fadeIn(at)} style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: TEAL_D, whiteSpace: 'nowrap', border: `1.5px solid ${TEAL}`, borderRadius: 999, padding: '2px 8px', background: CARD }}>
      {children} ✓
    </motion.span>
  );
}

/** the four shapes of data, one icon each (as on the bridge cards) */
export function VectorIcon() {
  return (
    <svg width={34} height={30} viewBox="0 0 34 30" aria-hidden="true">
      <g fill={TEAL}>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="4" r="3" />
        <circle cx="12" cy="15" r="3" />
      </g>
      <g fill="#8fc3cc">
        <circle cx="26" cy="21" r="3" />
        <circle cx="21" cy="26" r="3" />
        <circle cx="28" cy="13" r="3" />
      </g>
    </svg>
  );
}
export const SHAPES: { title: string; icon: ReactNode }[] = [
  { title: 'Documents', icon: <VectorIcon /> },
  { title: 'Tables', icon: <TableIcon /> },
  { title: 'Readings', icon: <JsonIcon /> },
  { title: 'Connected parts', icon: <GraphIcon /> },
];

/* ---------- the NEXT bands' small graphics ---------- */

/** the crack drawing itself down a concrete pier face, again every few seconds (the one red thing) */
export function CrackBand({ at }: { at: number }) {
  const loop = (d: number, len: number) => ({
    initial: { pathLength: 0, opacity: 1 },
    animate: { pathLength: [0, 1, 1, 1], opacity: [1, 1, 1, 0] },
    transition: { delay: d, duration: len, times: [0, 0.35, 0.85, 1], ease: 'easeOut' as const, repeat: Infinity },
  });
  return (
    <svg data-band="crack" width={180} height={91} viewBox="0 0 300 152" role="img" aria-label="The crack on the bridge pier" style={{ flex: 'none', borderRadius: 8, display: 'block' }}>
      <rect width="300" height="152" rx="12" fill="#bfc5cc" />
      <g fill="#a7aeb7" opacity={0.7}>
        <circle cx="40" cy="34" r="4" />
        <circle cx="240" cy="40" r="3" />
        <circle cx="70" cy="120" r="3" />
        <circle cx="250" cy="118" r="4" />
      </g>
      <g data-red="crack">
        <motion.path d="M150 0 L138 34 L160 60 L132 92 L156 120 L146 152" fill="none" stroke="var(--red)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...loop(at, 4.5)} />
        <motion.path d="M160 60 L198 74 M132 92 L100 102" fill="none" stroke="var(--red)" strokeWidth={4} strokeLinecap="round" {...loop(at + 0.9, 4.5)} />
      </g>
    </svg>
  );
}

const RUST_SPOTS: [number, number, number, number, number][] = [
  [118, 76, 46, 24, 0.85],
  [176, 66, 32, 17, 0.7],
  [212, 88, 24, 11, 0.8],
  [84, 92, 11, 9, 0.9],
  [148, 94, 20, 8, 0.75],
];

/** rust spreading on a steel bearing plate, patch by patch, then breathing slowly (a muted brown, not red) */
export function RustBand({ at, w = 180 }: { at: number; w?: number }) {
  return (
    <svg data-band="rust" width={w} height={Math.round(w * 0.507)} viewBox="0 0 300 152" role="img" aria-label="Rust spreading on a steel bearing plate" style={{ flex: 'none', borderRadius: 8, display: 'block' }}>
      <rect width="300" height="152" rx="12" fill="#c3c8ce" />
      <rect x="24" y="36" width="252" height="84" rx="8" fill="#8e969f" />
      <rect x="24" y="36" width="252" height="16" rx="6" fill="#a2a9b1" />
      {RUST_SPOTS.map(([x, y, rx, ry, o], i) => (
        // the patch spreads once, then breathes slowly
        <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} initial={{ scale: 0.15, opacity: 0 }} animate={{ scale: 1, opacity: o }} transition={{ delay: at + i * 0.35, duration: 1.6, ease: [0.3, 0.7, 0.2, 1] }}>
          <motion.ellipse cx={x} cy={y} rx={rx} ry={ry} fill={RUST} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scale: [1, 1.06, 1] }} transition={{ delay: at + 2 + i * 0.4, duration: 4, ease: 'easeInOut', repeat: Infinity }} />
        </motion.g>
      ))}
      <g fill="#6e7680">
        <circle cx="46" cy="78" r="8" />
        <circle cx="254" cy="78" r="8" />
      </g>
    </svg>
  );
}

/** the three labs as cards, lighting up in turn, one at a time */
export function LabsBand({ at }: { at: number }) {
  const labs: [string, string][] = [
    ['Lab 1', 'the repair plan'],
    ['Lab 2', 'the crack'],
    ['Lab 3', 'the rust'],
  ];
  return (
    <div data-band="labs" style={{ display: 'flex', gap: 10, flex: 'none' }}>
      {labs.map(([a, t], i) => (
        <motion.div
          key={a}
          style={{ padding: '9px 16px', borderRadius: 10, border: '2px solid rgba(27,138,156,0.35)' }}
          initial={{ backgroundColor: 'rgba(255,255,255,0)', color: 'var(--ink)' }}
          animate={{ backgroundColor: ['rgba(27,138,156,0)', 'rgba(27,138,156,1)', 'rgba(27,138,156,1)', 'rgba(27,138,156,0)', 'rgba(27,138,156,0)'], color: ['#1f2a33', '#ffffff', '#ffffff', '#1f2a33', '#1f2a33'] }}
          transition={{ delay: at + 0.6 + i * 1.5, duration: 4.5, times: [0, 0.1, 0.28, 0.4, 1], ease: 'easeInOut', repeat: Infinity }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>{a}</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{t}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- the shared recap ---------- */

const BOX: CSSProperties = { minWidth: 0, borderRadius: 16, border: '2px solid rgba(27,138,156,0.35)', background: 'rgba(127,127,127,0.06)', padding: 16, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' };
const PIC: CSSProperties = { position: 'relative', flex: 1, minHeight: PIC_H, borderRadius: 12, background: CARD, border: '1px solid var(--line)', overflow: 'hidden', boxSizing: 'border-box' };

/** a picture is drawn on a PIC_W x PIC_H stage; the stage sits in the middle of its box and grows with it */
const PIC_W = 420;
function Stage({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const b = box.current;
    const st = stage.current;
    if (!b || !st) return;
    const fit = () => {
      const k = Math.max(0.6, Math.min(1.3, b.clientWidth / PIC_W, b.clientHeight / PIC_H));
      if (!b.clientWidth) return;
      st.style.transform = `translate(-50%, -50%) scale(${k})`;
    };
    fit();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    ro?.observe(b);
    return () => ro?.disconnect();
  }, []);
  return (
    <div ref={box} style={{ position: 'absolute', inset: 0 }}>
      <div ref={stage} style={{ position: 'absolute', left: '50%', top: '50%', width: PIC_W, height: PIC_H, transform: 'translate(-50%, -50%)', transformOrigin: 'center' }}>
        {children}
      </div>
    </div>
  );
}

export function Recap({ kicker, message, notebook, points, next, pictures, band, bandLast = false, testId }: RecapProps & { pictures: ReactNode[]; band: ReactNode; /** the band's graphic after the line, not before */ bandLast?: boolean; testId: string }) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId={testId} kickerColor="var(--teal)">
      <div data-recap style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, minHeight: 0, marginTop: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18, flex: 1, minHeight: 0 }}>
          {points.map((p, i) => (
            <motion.div key={p.title} data-point={i + 1} style={BOX} {...fadeUp(pointAt(i), 14)}>
              <div data-picture={i + 1} style={PIC}>
                <Stage>{pictures[i]}</Stage>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
                <span style={{ flex: 'none', width: 38, height: 38, borderRadius: '50%', background: TEAL, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ fontSize: 27, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{p.title}</span>
              </div>
              <div style={{ fontSize: 20, lineHeight: 1.4, color: DIM, marginTop: 8, minHeight: '2.8em' }}>{p.text}</div>
            </motion.div>
          ))}
        </div>
        <motion.div data-next style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 22px', borderRadius: 14, background: 'rgba(27,138,156,0.10)', border: `2px solid ${TEAL}` }} {...fadeUp(NEXT_AT, 10)}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: TEAL_D, flex: 'none' }}>NEXT</div>
          {!bandLast && band}
          <div style={{ fontSize: 25, lineHeight: 1.35, color: INK, flex: 1, minWidth: 0 }}>
            <Rich text={next} />
          </div>
          {bandLast && band}
        </motion.div>
      </div>
    </WidePanel>
  );
}

/* ---------- 2.9 · Lab 2 recap ---------- */

/** evidence in, answer out: three documents slide into the language model, the answer comes back with its source */
function GroundPicture({ t }: { t: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 20 }}>
      <PicLabel at={t + 0.2}>Evidence in · answer out</PicLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} {...glide(t + 0.5 + i * 0.25, -50)}>
              <Doc label="PDF" w={30} />
            </motion.div>
          ))}
        </div>
        <ArrowRight w={40} at={t + 1.3} />
        <motion.div {...fadeIn(t + 0.3)}>
          <Net w={150} live who="language-model" />
        </motion.div>
      </div>
      <motion.div {...fadeUp(t + 2.2)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: TINT, borderLeft: `5px solid ${TEAL}`, fontSize: 17, color: INK, maxWidth: 360 }}>
        “Cracks of this kind need …”
        <SourceChip at={t + 2.7}>source</SourceChip>
      </motion.div>
    </div>
  );
}

const AGENT_STEPS: [string, string][] = [
  ['recall', 'look in memory'],
  ['get_asset_incident_brief', 'fetch the bridge data'],
  ['remember', 'write it down'],
  ['final', 'say what to do'],
];

/** the agent chooses its tools; the skill's steps light one at a time */
function ToolsPicture({ t }: { t: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
      <motion.div {...fadeIn(t + 0.3)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <svg width={28} height={28} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" aria-hidden="true">
            <rect x="9" y="12" width="30" height="24" rx="6" />
            <circle cx="18" cy="24" r="3" />
            <circle cx="30" cy="24" r="3" />
            <path d="M24 4v8" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>The AI agent chooses its tools</div>
          <div style={{ fontSize: 14, color: DIM }}>the skill is the procedure it follows</div>
        </div>
      </motion.div>
      {AGENT_STEPS.map(([n, d], i) => (
        <motion.div
          key={n}
          data-tool={n}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8 }}
          initial={{ opacity: 0, backgroundColor: TINT, color: '#1f2a33' }}
          animate={{ opacity: 1, backgroundColor: [TINT, 'rgba(27,138,156,1)', 'rgba(27,138,156,1)', TINT, TINT], color: ['#1f2a33', '#ffffff', '#ffffff', '#1f2a33', '#1f2a33'] }}
          transition={{ opacity: { delay: t + 0.6 + i * 0.15, duration: 0.5 }, default: { delay: t + 1 + i * 1.2, duration: 4.8, times: [0, 0.06, 0.2, 0.25, 1], ease: 'easeInOut', repeat: Infinity } }}
        >
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', border: `2px solid ${TEAL}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: TEAL_D, flex: 'none' }}>{i + 1}</span>
          <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</span>
          <span style={{ fontSize: 13, opacity: 0.8, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{d}</span>
        </motion.div>
      ))}
    </div>
  );
}

/** four shapes drop into one SQL statement, into one database */
function OneQueryPicture({ t }: { t: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {SHAPES.map((s, i) => (
          <motion.div key={s.title} data-shape={s.title} {...fadeUp(t + 0.4 + i * 0.25, -30)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 4px', borderRadius: 9, background: TINT, width: 82 }}>
            {s.icon}
            <div style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: INK }}>{s.title}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeIn(t + 1.5)}>
        <FlowDown h={30} delay={t + 1.5} />
      </motion.div>
      <motion.div {...pop(t + 1.8)} style={{ padding: '8px 14px', borderRadius: 8, background: '#1f2a33', color: '#e3f1f4', fontFamily: MONO, fontSize: 15 }}>
        SELECT … <span style={{ color: '#5fd0df' }}>one statement</span>
      </motion.div>
      <motion.div {...fadeIn(t + 2.2)}>
        <FlowDown h={30} delay={t + 2.2} />
      </motion.div>
      <motion.div {...pop(t + 2.5)} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 700, color: TEAL_D }}>
        <Db w={34} />
        one Oracle AI Database
      </motion.div>
    </div>
  );
}

export function Lab2Recap(props: RecapProps) {
  return (
    <Recap
      {...props}
      testId="recap-lab2"
      pictures={[<GroundPicture key="1" t={pointAt(0)} />, <ToolsPicture key="2" t={pointAt(1)} />, <OneQueryPicture key="3" t={pointAt(2)} />]}
      band={<RustBand at={NEXT_AT + 0.4} />}
    />
  );
}

/* ---------- 3.17 · Lab 3 recap ---------- */

const DRAWERS = ['Episodic', 'Semantic', 'Procedural'];

/** Mercer files her finding on Day 1; it waits in the agent's memory; Vance finds it on Day 2 */
function MemoryPicture({ t }: { t: number }) {
  const note: CSSProperties = { position: 'absolute', left: 0, top: 0, width: 112, boxSizing: 'border-box', padding: '6px 8px', borderRadius: 7, background: CARD, border: `1.5px solid ${TEAL}`, boxShadow: '0 4px 12px rgba(20,111,127,0.2)', fontSize: 12, lineHeight: 1.25, fontWeight: 600, color: INK };
  const person = (who: 'mercer' | 'vance', label: string, at: number, side: CSSProperties) => (
    <motion.div {...fadeIn(at)} style={{ position: 'absolute', top: 44, width: 112, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, ...side }}>
      <Portrait who={who} size={60} />
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: TEAL_D, whiteSpace: 'nowrap' }}>{label}</div>
    </motion.div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <PicLabel at={t + 0.2}>Filed on Day 1 · found on Day 2</PicLabel>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 420, marginLeft: -210 }}>
        {person('mercer', 'DAY 1 · MERCER', t + 0.4, { left: 0 })}
        <motion.div {...pop(t + 0.8)} style={{ position: 'absolute', left: 125, top: 38, width: 170, padding: 10, borderRadius: 12, background: TINT, border: `2px solid ${TEAL}`, display: 'flex', flexDirection: 'column', gap: 6, boxSizing: 'border-box' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: TEAL_D }}>AGENT MEMORY</div>
          {DRAWERS.map((k, i) => (
            <motion.div
              key={k}
              data-drawer={k}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7, border: `1.5px solid ${TEAL}` }}
              initial={{ backgroundColor: 'rgba(255,255,255,1)' }}
              animate={i === 0 ? { backgroundColor: ['rgba(255,255,255,1)', 'rgba(191,225,231,1)', 'rgba(255,255,255,1)', 'rgba(191,225,231,1)', 'rgba(255,255,255,1)'] } : undefined}
              transition={i === 0 ? { delay: t + 2.2, duration: 2, ease: 'easeInOut' } : undefined}
            >
              <span style={{ width: 20, height: 6, borderRadius: 3, background: TEAL, flex: 'none' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1f2a33' }}>{k}</span>
            </motion.div>
          ))}
        </motion.div>
        {person('vance', 'DAY 2 · VANCE', t + 2.6, { right: 0 })}
        {/* the finding: from Mercer into the memory, then out to Vance */}
        <motion.div data-note="in" style={note} initial={{ x: 0, y: 150, opacity: 0, scale: 1 }} animate={{ x: [0, 0, 154, 154], y: [150, 150, 80, 80], opacity: [0, 1, 1, 0], scale: [1, 1, 0.8, 0.5] }} transition={{ delay: t + 1.2, duration: 1.4, times: [0, 0.15, 0.8, 1], ease: 'easeInOut' }}>
          Rust on the bearing plate
        </motion.div>
        <motion.div data-note="out" style={note} initial={{ x: 154, y: 80, opacity: 0, scale: 0.5 }} animate={{ x: [154, 154, 308], y: [80, 80, 150], opacity: [0, 1, 1], scale: [0.5, 0.8, 1] }} transition={{ delay: t + 2.9, duration: 1.3, times: [0, 0.2, 1], ease: 'easeInOut' }}>
          Rust on the bearing plate
        </motion.div>
      </div>
      <motion.div {...fadeUp(t + 4)} style={{ position: 'absolute', left: 16, right: 16, bottom: 14, padding: '9px 12px', borderRadius: 10, background: CARD, border: `2px solid ${TEAL}`, fontSize: 15, lineHeight: 1.35, color: INK }}>
        “Mercer found rust on the bearing plate yesterday.” <span style={{ fontSize: 13, color: DIM }}>· from memory</span>
      </motion.div>
    </div>
  );
}

/** the context window as a glass: it fills with only what this question needs; the rest stays out */
function CurationPicture({ t }: { t: number }) {
  const ins = ['the question', 'Mercer’s finding', 'the rust procedure'];
  const outs = ['the whole chat history', 'every past report', 'tools it will not use'];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, paddingTop: 22 }}>
      <PicLabel at={t + 0.2}>Only what this question needs</PicLabel>
      <motion.div {...fadeIn(t + 0.4)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div data-glass style={{ position: 'relative', width: 160, height: 200, border: `3px solid ${TEAL}`, borderTop: 0, borderRadius: '0 0 24px 24px', boxSizing: 'border-box', overflow: 'hidden', background: 'rgba(27,138,156,0.05)' }}>
          <motion.div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(27,138,156,0.16), rgba(27,138,156,0.30))' }} initial={{ height: '0%' }} animate={{ height: '72%' }} transition={{ delay: t + 0.9, duration: 2, ease: EASE }} />
          <div style={{ position: 'absolute', left: 9, right: 9, bottom: 9, display: 'flex', flexDirection: 'column-reverse', gap: 6 }}>
            {ins.map((s, i) => (
              <motion.div key={s} data-in={s} {...fadeUp(t + 0.8 + i * 0.6, -120)} style={{ padding: '6px 6px', borderRadius: 7, background: CARD, border: `1.5px solid ${TEAL}`, fontSize: 13, fontWeight: 700, textAlign: 'center', color: INK }}>
                {s}
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: TEAL_D }}>CONTEXT WINDOW</div>
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 196 }}>
        <motion.div {...fadeIn(t + 2.6)} style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: DIM }}>
          STAYS OUT
        </motion.div>
        {outs.map((s, i) => (
          <motion.div key={s} data-out={s} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 0.75, x: 0 }} transition={{ delay: t + 2.8 + i * 0.25, duration: 0.7, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 7, border: '1.5px dashed #aab4bc', color: DIM, fontSize: 13, fontWeight: 600 }}>
            <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden="true" style={{ flex: 'none' }}>
              <path d="M2 2l8 8M10 2l-8 8" stroke="#8a96a1" strokeWidth={2} />
            </svg>
            {s}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** four services kept in sync fold into one Oracle AI Database */
function ConvergePicture({ t }: { t: number }) {
  const stores: [string, number, number][] = [
    ['Vectors', 22, 44],
    ['SQL', 302, 44],
    ['JSON', 22, 186],
    ['Graph', 302, 186],
  ];
  const cx = 210 - 48;
  const cy = 150 - 36;
  const merge = t + 2.8;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <PicLabel at={t + 0.2}>Four services → one store</PicLabel>
      <div style={{ position: 'absolute', left: '50%', top: 0, width: 420, height: PIC_H, marginLeft: -210 }}>
        <motion.svg width={420} height={PIC_H} viewBox={`0 0 420 ${PIC_H}`} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0 }} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: t + 1.1, duration: merge + 0.6 - (t + 1.1), times: [0, 0.2, 0.8, 1] }}>
          <g fill="none" stroke="#8a96a1" strokeWidth={2.5} strokeDasharray="7 7">
            {['M124 80H300', 'M124 222H300', 'M70 118V178', 'M350 118V178', 'M120 112L304 196'].map((d) => (
              <motion.path key={d} d={d} animate={{ strokeDashoffset: [0, -28] }} transition={{ duration: 1.4, ease: 'linear', repeat: Infinity }} />
            ))}
          </g>
          <rect x="175" y="62" width="70" height="22" rx="11" fill="#fff" stroke="#aab4bc" />
          <text x="210" y="77" textAnchor="middle" fontFamily="Inter" fontSize="12" fontWeight="700" fill="#5b6873">sync</text>
          <rect x="175" y="211" width="70" height="22" rx="11" fill="#fff" stroke="#aab4bc" />
          <text x="210" y="226" textAnchor="middle" fontFamily="Inter" fontSize="12" fontWeight="700" fill="#5b6873">sync</text>
        </motion.svg>
        {stores.map(([name, x, y], i) => (
          <motion.div
            key={name}
            data-store={name}
            style={{ position: 'absolute', left: 0, top: 0, width: 96, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            initial={{ x, y, opacity: 0, scale: 1 }}
            animate={{ x: [x, x, cx], y: [y, y, cy], opacity: [0, 1, 1, 0], scale: [1, 1, 0.3] }}
            transition={{ delay: t + 0.4 + i * 0.15, duration: merge + 1 - (t + 0.4 + i * 0.15), times: [0, 0.1, 1], opacity: { delay: t + 0.4 + i * 0.15, duration: merge + 1 - (t + 0.4 + i * 0.15), times: [0, 0.1, 0.8, 1] }, ease: [0.5, 0, 0.3, 1] }}
          >
            <Db w={40} fill="rgba(127,127,127,0.12)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: DIM, whiteSpace: 'nowrap' }}>{name} store</span>
          </motion.div>
        ))}
      </div>
      <motion.div data-one-store {...pop(merge + 0.7)} style={{ position: 'absolute', left: 0, right: 0, top: 34, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <motion.div style={{ borderRadius: 20, padding: 6 }} animate={{ boxShadow: ['0 0 0 0 rgba(27,138,156,0)', '0 0 0 10px rgba(27,138,156,0.16)', '0 0 0 0 rgba(27,138,156,0)'] }} transition={{ delay: merge + 1.4, duration: 2.4, ease: 'easeInOut', repeat: Infinity }}>
          <Db w={74} />
        </motion.div>
        <div style={{ fontSize: 19, fontWeight: 700, color: TEAL_D }}>one Oracle AI Database</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {SHAPES.map((s) => (
            <div key={s.title} style={{ background: TINT, borderRadius: 7, padding: 3, display: 'flex' }}>
              {s.icon}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, color: DIM }}>vectors · SQL · JSON · graph, one transaction</div>
      </motion.div>
    </div>
  );
}

export function Lab3Recap(props: RecapProps) {
  return (
    <Recap
      {...props}
      testId="recap-lab3"
      pictures={[<MemoryPicture key="1" t={pointAt(0)} />, <CurationPicture key="2" t={pointAt(1)} />, <ConvergePicture key="3" t={pointAt(2)} />]}
      band={<LabsBand at={NEXT_AT} />}
      bandLast
    />
  );
}
