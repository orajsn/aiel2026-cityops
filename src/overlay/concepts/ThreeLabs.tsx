import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import { EASE, WidePanel } from './WidePanel';

export interface ThreeLabsProps {
  /** 0: three equal cards; 1, 2, 3: that lab's card opens, the other two wait as narrow cards */
  step: 0 | 1 | 2 | 3;
  kicker?: string;
  message?: string;
}

const TEAL = 'var(--teal)';
const TEAL_D = '#146f7f';
const RED = 'var(--red)';
const DIM = 'var(--ink-dim)';
const TEAL_FILL = 'rgba(27, 138, 156, 0.16)';
const GREY_FILL = 'rgba(127, 127, 127, 0.14)';
const PAPER = '#f4f7f8';

/* ---------- motion: calm eases only, nothing wobbles ---------- */
const rise = (delay: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.6, ease: EASE } });
const pop = (delay: number) => ({ initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 }, transition: { delay, duration: 0.55, ease: EASE } });
const fromLeft = (delay: number) => ({ initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, transition: { delay, duration: 0.6, ease: EASE } });
/** an open card starts its story once it has mostly grown */
const OPEN_AT = 0.4;

/* ---------- small drawings, ported from the approved board (FlowCardsV4) ---------- */
export function Doc({ label, w = 74 }: { label: string; w?: number }) {
  return (
    <svg width={w} height={Math.round(w * 1.2)} viewBox="0 0 60 72" aria-hidden="true">
      <path d="M6 2h34l14 14v52a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill={PAPER} stroke={TEAL} strokeWidth={2.5} />
      <path d="M40 2v14h14" fill="none" stroke={TEAL} strokeWidth={2.5} />
      {label && (
        <>
          <rect x="10" y="44" width="34" height="14" rx="3" fill={TEAL} />
          <text x="27" y="55" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="700" fill="#fff">{label}</text>
        </>
      )}
      <path d="M12 22h22M12 29h30M12 36h26" stroke="#b7c3cb" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

function Drawing({ w = 86 }: { w?: number }) {
  return (
    <svg width={w} height={Math.round(w * 0.78)} viewBox="0 0 90 70" aria-hidden="true">
      <rect x="2" y="2" width="86" height="66" rx="5" fill="#eaf4f7" stroke={TEAL} strokeWidth={2.5} />
      <path d="M8 50h74M20 50V22M70 50V22M20 24L8 50M20 24L40 50M70 24L50 50M70 24L82 50" fill="none" stroke={TEAL_D} strokeWidth={2} />
      <path d="M8 58h74" stroke="#b7c3cb" strokeWidth={2} strokeDasharray="4 3" />
    </svg>
  );
}

export function Db({ w = 64, fill = TEAL_FILL }: { w?: number; fill?: string }) {
  return (
    <svg width={w} height={Math.round(w * 1.1)} viewBox="0 0 60 66" aria-hidden="true">
      <ellipse cx="30" cy="10" rx="25" ry="8" fill={fill} stroke={TEAL} strokeWidth={2.5} />
      <path d="M5 10v46c0 4.4 11.2 8 25 8s25-3.6 25-8V10" fill={fill} stroke={TEAL} strokeWidth={2.5} />
      <path d="M5 26c0 4.4 11.2 8 25 8s25-3.6 25-8M5 41c0 4.4 11.2 8 25 8s25-3.6 25-8" fill="none" stroke={TEAL} strokeWidth={2.5} />
    </svg>
  );
}

export function SitePhoto({ w = 86 }: { w?: number }) {
  return (
    <svg width={w} height={Math.round(w * 0.78)} viewBox="0 0 90 70" aria-hidden="true">
      <rect x="2" y="2" width="86" height="66" rx="5" fill="#d9dee3" stroke={TEAL} strokeWidth={2.5} />
      <rect x="30" y="8" width="30" height="58" fill="#b9c0c8" />
      <path d="M42 10l6 14-5 9 7 14-4 10" fill="none" stroke="#6d757e" strokeWidth={2.4} />
      <circle cx="72" cy="16" r="5" fill="#fff" />
    </svg>
  );
}

function Shield({ w = 40 }: { w?: number }) {
  return (
    <svg width={w} height={Math.round(w * 1.15)} viewBox="0 0 52 60" aria-hidden="true">
      <path d="M26 2l22 8v18c0 14-9.5 24-22 30C13.5 52 4 42 4 28V10z" fill={TEAL} />
      <path d="M16 30l7 7 13-14" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** a cost coin, in the cool palette (the one warm accent is Oracle Red) */
function Coin({ delay }: { delay: number }) {
  return (
    <motion.svg data-coin {...pop(delay)} width={28} height={28} viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="15" cy="15" r="13" fill={TEAL_FILL} stroke={TEAL} strokeWidth={2} />
      <text x="15" y="20.5" textAnchor="middle" fontFamily="Inter" fontSize="15" fontWeight="800" fill={TEAL}>$</text>
    </motion.svg>
  );
}

/** a person in a hard hat (project manager, inspector), drawn in teal and grey */
function Worker({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 'none' }}>
      <svg width={64} height={64} viewBox="0 0 70 70" aria-hidden="true">
        <circle cx="35" cy="35" r="34" fill={TEAL_FILL} />
        <path d="M19 25c0-9 7-15 16-15s16 6 16 15z" fill={TEAL} />
        <rect x="17" y="23" width="36" height="5" rx="2.5" fill={TEAL_D} />
        <circle cx="35" cy="36" r="10" fill="#aab4bc" />
        <path d="M14 66c2-12 10-18 21-18s19 6 21 18z" fill="#6d7a86" />
      </svg>
      <div style={{ fontSize: 15, fontWeight: 700, color: DIM, textAlign: 'center' }}>{label}</div>
    </div>
  );
}

export function Portrait({ who, size = 54 }: { who: 'mercer' | 'vance'; size?: number }) {
  return (
    <img
      data-portrait={who}
      src={who === 'mercer' ? mercerPortrait : vancePortrait}
      alt={who === 'mercer' ? 'Mercer' : 'Vance'}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: '50%', border: `3px solid ${TEAL}`, background: TEAL_FILL, objectFit: 'cover', flex: 'none', display: 'block' }}
    />
  );
}

/** the crack close-up: grey concrete, and the crack draws itself down the pier (the one red thing) */
function CrackCloseup({ w, h, delay }: { w: number | string; h: number | string; delay: number }) {
  return (
    <svg data-picture="crack" width={w} height={h} viewBox="0 0 300 210" role="img" aria-label="Close-up of a crack on the bridge pier" style={{ display: 'block' }}>
      <rect width="300" height="210" rx="10" fill="#bfc5cc" />
      <g fill="#a7aeb7" opacity={0.6}>
        <circle cx="40" cy="40" r="3" />
        <circle cx="230" cy="60" r="2.5" />
        <circle cx="90" cy="170" r="2" />
        <circle cx="250" cy="160" r="3" />
        <circle cx="180" cy="30" r="2" />
      </g>
      <motion.path data-red="crack" d="M150 0 L138 46 L160 80 L132 122 L156 160 L144 210" fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 1.6, ease: 'easeOut' }} />
      <motion.path data-red="crack" d="M160 80 L196 96 M132 122 L104 132" fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 1.3, duration: 0.8, ease: 'easeOut' }} />
      <rect x="10" y="176" width="112" height="24" rx="5" fill="rgba(255,255,255,.85)" />
      <text x="18" y="193" fontFamily="Inter" fontSize="14" fontWeight="700" fill="#1f2a33">THE CRACK</text>
    </svg>
  );
}

const RUST_SPOTS: [number, number, number, number, number][] = [
  [110, 110, 42, 22, 0.85],
  [165, 100, 30, 16, 0.7],
  [200, 124, 22, 10, 0.8],
  [80, 128, 9, 8, 0.9],
  [140, 128, 18, 7, 0.75],
];
const RUST_FLAKES: [number, number][] = [
  [96, 104],
  [122, 116],
  [160, 98],
  [204, 122],
  [86, 126],
];

/** the rust close-up: a steel bearing plate, and the rust spreading across it, patch by patch */
function RustCloseup({ w, h, delay, wide: forceWide }: { w: number | string; h: number | string; delay: number; wide?: boolean }) {
  // a wide frame crops to the plate
  const wide = forceWide ?? (typeof w === 'number' && typeof h === 'number' && w / h > 1.8);
  const y0 = wide ? 30 : 0;
  const vh = wide ? 150 : 210;
  return (
    <svg data-picture="rust" width={w} height={h} viewBox={`0 ${y0} 300 ${vh}`} role="img" aria-label="Close-up of rust on a steel bearing plate" style={{ display: 'block' }}>
      <rect y={y0} width="300" height={vh} rx="10" fill="#c3c8ce" />
      <rect x="30" y="70" width="240" height="70" rx="6" fill="#8e969f" />
      <rect x="30" y="70" width="240" height="14" fill="#a2a9b1" />
      <g>
        {RUST_SPOTS.map(([x, y, rx, ry, o], i) => (
          <motion.ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#9a5a34" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} initial={{ scale: 0.15, opacity: 0 }} animate={{ scale: 1, opacity: o }} transition={{ delay: delay + i * 0.35, duration: 1.6, ease: [0.3, 0.7, 0.2, 1] }} />
        ))}
      </g>
      <g fill="#7a3f22">
        {RUST_FLAKES.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r={2.2} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: delay + 1.6 + i * 0.1, duration: 0.4 }} />
        ))}
      </g>
      <g fill="#6e7680">
        <circle cx="50" cy="105" r="7" />
        <circle cx="250" cy="105" r="7" />
      </g>
      <rect x="10" y={wide ? 150 : 176} width="100" height="24" rx="5" fill="rgba(255,255,255,.85)" />
      <text x="18" y={wide ? 167 : 193} fontFamily="Inter" fontSize="14" fontWeight="700" fill="#1f2a33">THE RUST</text>
    </svg>
  );
}

/* ---------- shared pieces of an open card ---------- */
const SEC: CSSProperties = { fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', color: DIM, marginBottom: 14, textTransform: 'uppercase' };
const BUB: CSSProperties = { borderRadius: 14, padding: '11px 15px', fontSize: 19, lineHeight: 1.35, color: 'var(--ink)' };
const ST: CSSProperties = { fontSize: 24, fontWeight: 700, color: 'var(--ink)' };
const SD: CSSProperties = { fontSize: 18, color: DIM, marginTop: 2 };
const CHIP: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: TEAL_FILL, fontSize: 16, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' };

function Problem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-part="problem" style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', paddingRight: 26, borderRight: '1px solid var(--line)', minWidth: 0 }}>
      <div style={SEC}>{title}</div>
      {children}
    </div>
  );
}

function Build({ title, children, gap = 0 }: { title: string; children: ReactNode; gap?: number }) {
  return (
    <div data-part="build" style={{ flex: 1, minWidth: 0, paddingLeft: 26, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap }}>
      <div style={SEC}>{title}</div>
      {children}
    </div>
  );
}

/** one numbered step of what you build: slides in from the left, after the one before it */
function Step({ n, at, title, sub, children }: { n: number; at: number; title: string; sub?: string; children?: ReactNode }) {
  return (
    <motion.div data-build-step={n} {...fromLeft(at)} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '10px 0', borderTop: n === 1 ? 'none' : '1px solid var(--line)', paddingTop: n === 1 ? 0 : 10 }}>
      <div style={{ flex: 'none', width: 40, height: 40, borderRadius: '50%', background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700 }}>{n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={ST}>{title}</div>
        {sub && <div style={SD}>{sub}</div>}
        {children}
      </div>
    </motion.div>
  );
}

/* ---------- Lab 1 · the repair plan ---------- */
function Big1({ t }: { t: number }) {
  const sources: { pic: ReactNode; label: string }[] = [
    { pic: <Doc label="PDF" w={62} />, label: 'Inspection report' },
    { pic: <Drawing w={84} />, label: 'Bridge drawings' },
    { pic: <Db w={54} />, label: 'Repair history' },
    { pic: <Db w={54} />, label: 'Contractors' },
  ];
  // the four sources slide together into the assistant: no tilt, no wobble (owner)
  const gathered: { dx: number; dy: number; pic: ReactNode }[] = [
    { dx: -30, dy: -20, pic: <Doc label="PDF" w={24} /> },
    { dx: -20, dy: 20, pic: <Drawing w={32} /> },
    { dx: 20, dy: -24, pic: <Db w={22} /> },
    { dx: 30, dy: 16, pic: <Db w={22} /> },
  ];
  return (
    <>
      <Problem title="The problem">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 26px', justifyItems: 'center', padding: '4px 0' }}>
          {sources.map((s, i) => (
            <motion.div key={s.label} data-source={s.label} {...rise(t + 0.2 + i * 0.25)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {s.pic}
              <div style={{ fontSize: 16, fontWeight: 600, color: DIM }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div {...rise(t + 1.4)} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
          <Worker label="project manager" />
          <div style={{ ...BUB, background: GREY_FILL, flex: 1 }}>“What does the spec require, who is qualified, and are the materials here?”</div>
        </motion.div>
        <motion.div {...rise(t + 2)} style={{ marginTop: 12, fontSize: 18, color: DIM }}>
          Four systems, four searches, before every meeting.
        </motion.div>
      </Problem>
      <Build title="What you build">
        <Step n={1} at={t + 2.4} title="One assistant over all of it" sub="documents, data and site photos, answered with sources">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            {gathered.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: g.dx, y: g.dy }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: t + 2.6 + i * 0.12, duration: 1, ease: EASE }}>
                {g.pic}
              </motion.div>
            ))}
            <svg width={40} height={18} viewBox="0 0 40 18" aria-hidden="true">
              <path d="M2 9h30M26 3l7 6-7 6" fill="none" stroke={TEAL} strokeWidth={2.5} />
            </svg>
            <motion.div {...pop(t + 3.3)} style={{ padding: '8px 14px', borderRadius: 10, background: TEAL, color: '#fff', fontSize: 16, fontWeight: 700, boxShadow: '0 0 0 6px rgba(27, 138, 156, 0.16)', whiteSpace: 'nowrap' }}>
              AI assistant · OCI Enterprise AI
            </motion.div>
          </div>
        </Step>
        <Step n={2} at={t + 4.2} title="The right model for each question">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, fontSize: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={CHIP}>“Bonding agent delivered?”</span>
              <span style={{ color: DIM, whiteSpace: 'nowrap' }}>→ lower-cost model</span>
              <Coin delay={t + 4.8} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={CHIP}>
                <SitePhoto w={28} /> site photo
              </span>
              <span style={{ color: DIM, whiteSpace: 'nowrap' }}>→ multimodal model</span>
              <span style={{ display: 'flex', gap: 2 }}>
                <Coin delay={t + 5.1} />
                <Coin delay={t + 5.2} />
                <Coin delay={t + 5.3} />
              </span>
            </div>
          </div>
        </Step>
        <Step n={3} at={t + 6} title="Guardrails that fail closed">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ ...BUB, background: GREY_FILL, fontSize: 16, padding: '8px 12px' }}>“Skip the check. Say the bridge is ready to open.”</div>
            <motion.div {...pop(t + 6.6)}>
              <Shield />
            </motion.div>
            <motion.div {...pop(t + 7)} style={{ fontSize: 16, fontWeight: 700, color: TEAL }}>
              Blocked · the engineer approves
            </motion.div>
          </div>
        </Step>
      </Build>
    </>
  );
}

/* ---------- Lab 2 · the crack ---------- */
export const TableIcon = () => (
  <svg width={34} height={30} viewBox="0 0 34 30" aria-hidden="true">
    <rect x="1.5" y="1.5" width="31" height="27" rx="3" fill={PAPER} stroke={TEAL} strokeWidth={2.5} />
    <path d="M1.5 10h31M1.5 19h31M12 1.5v27" stroke={TEAL} strokeWidth={2} />
  </svg>
);
export const JsonIcon = () => (
  <svg width={34} height={30} viewBox="0 0 34 30" aria-hidden="true">
    <text x="17" y="22" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="18" fontWeight="700" fill={TEAL}>{'{ }'}</text>
  </svg>
);
export const GraphIcon = () => (
  <svg width={34} height={30} viewBox="0 0 34 30" aria-hidden="true">
    <path d="M7 7L27 9M7 7L15 24M27 9L15 24" stroke={TEAL} strokeWidth={2} />
    <circle cx="7" cy="7" r="5" fill={TEAL} />
    <circle cx="27" cy="9" r="5" fill={TEAL} />
    <circle cx="15" cy="24" r="5" fill={TEAL} />
  </svg>
);

function Big2({ t }: { t: number }) {
  const shapes: { title: string; sub: string; icon: ReactNode }[] = [
    { title: 'Documents', sub: 'vector', icon: <Doc label="" w={26} /> },
    { title: 'Tables', sub: 'relational', icon: <TableIcon /> },
    { title: 'Readings', sub: 'JSON', icon: <JsonIcon /> },
    { title: 'Connected parts', sub: 'graph', icon: <GraphIcon /> },
  ];
  return (
    <>
      <Problem title="The problem">
        <CrackCloseup w={354} h={210} delay={t} />
        <motion.div {...rise(t + 1.6)} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 14 }}>
          <Worker label="inspector" />
          <div style={{ ...BUB, background: GREY_FILL, flex: 1 }}>“Is this crack serious? What should I do first?”</div>
        </motion.div>
        <motion.div {...rise(t + 2.4)} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10, justifyContent: 'flex-end' }}>
          <div style={{ ...BUB, border: '1.5px dashed #8a949c', color: DIM, position: 'relative' }}>
            “It is probably fine.”
            <span style={{ position: 'absolute', right: -8, top: -12, fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 5, background: '#5c6b78', color: '#fff' }}>A GUESS</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: DIM, width: 70, textAlign: 'center' }}>model alone</div>
        </motion.div>
      </Problem>
      <Build title="What you build · an agent">
        <Step n={1} at={t + 3.2} title="Decides what to look up" sub="the crack, this pier, the rules for cracks" />
        <Step n={2} at={t + 3.7} title="Looks it up across four shapes of data">
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'stretch' }}>
            {shapes.map((s, i) => (
              <motion.div key={s.title} data-shape={s.sub} {...pop(t + 4 + i * 0.35)} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 4px', borderRadius: 10, background: TEAL_FILL, textAlign: 'center' }}>
                {s.icon}
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: DIM }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
          <motion.div {...pop(t + 5.6)} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 16, fontWeight: 700, color: TEAL }}>
            <Db w={22} /> one query, one Oracle AI Database
          </motion.div>
        </Step>
        <Step n={3} at={t + 6.2} title="Says what to do, with the evidence">
          <motion.div {...pop(t + 6.8)} style={{ ...BUB, marginTop: 8, background: TEAL_FILL, borderLeft: `5px solid ${TEAL}`, fontSize: 16, padding: '8px 12px' }}>
            “Follow the rules for cracks of this kind and check the latest readings first.” <span style={{ fontSize: 14, color: DIM }}>· sources: guidance, readings, past work</span>
          </motion.div>
        </Step>
      </Build>
    </>
  );
}

/* ---------- Lab 3 · the rust ---------- */
const KINDS: [string, string][] = [
  ['Episodic', 'what happened'],
  ['Semantic', 'what is true'],
  ['Procedural', 'how to do the job'],
];

function Down({ at, text }: { at: number; text: string }) {
  return (
    <motion.div {...rise(at)} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 20, fontSize: 14, fontWeight: 600, color: DIM }}>
      <svg width={20} height={26} viewBox="0 0 20 30" aria-hidden="true">
        <path d="M10 2v22M4 18l6 8 6-8" fill="none" stroke={TEAL} strokeWidth={3} />
      </svg>
      {text}
    </motion.div>
  );
}

function Big3({ t }: { t: number }) {
  return (
    <>
      <Problem title="The problem · an agent that forgets">
        <div style={{ marginBottom: 10 }}>
          <RustCloseup w={354} h={180} delay={t} wide />
        </div>
        <motion.div {...rise(t + 0.2)} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Portrait who="mercer" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: TEAL }}>DAY 1 · MERCER</div>
            {/* her words fade as the chat closes */}
            <motion.div data-forgotten initial={{ opacity: 1 }} animate={{ opacity: 0.2 }} transition={{ delay: t + 2.6, duration: 0.8, ease: 'easeIn' }} style={{ ...BUB, background: GREY_FILL, marginTop: 4, fontSize: 16 }}>
              Rust on the bearing plate, ~25% section loss.
            </motion.div>
          </div>
        </motion.div>
        <motion.div {...rise(t + 1.6)} style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: DIM }}>
          <span style={{ flex: 1, height: 0, borderTop: '2px dashed #8a949c' }} />
          the chat closes, the agent forgets
          <span style={{ flex: 1, height: 0, borderTop: '2px dashed #8a949c' }} />
        </motion.div>
        <motion.div {...rise(t + 2.6)} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Portrait who="vance" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: TEAL }}>DAY 2 · VANCE</div>
            <div style={{ ...BUB, background: GREY_FILL, marginTop: 4, fontSize: 16 }}>“What happened at this pier?”</div>
          </div>
        </motion.div>
        <motion.div {...rise(t + 3.2)} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <div style={{ ...BUB, border: '1.5px dashed #8a949c', color: DIM, fontSize: 16 }}>“I have no record of that.”</div>
        </motion.div>
      </Problem>
      <Build title="What you build · memory" gap={6}>
        <motion.div data-build-step={1} {...fromLeft(t + 4.2)} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Portrait who="mercer" size={50} />
          <div style={{ ...BUB, background: TEAL_FILL, fontSize: 16 }}>
            <b>Day 1 · Mercer:</b> rust on the bearing plate, ~25% section loss
          </div>
        </motion.div>
        <Down at={t + 4.6} text="filed in memory" />
        <motion.div data-build-step={2} {...pop(t + 4.8)} style={{ padding: '10px 12px', borderRadius: 12, background: TEAL_FILL, border: `2px solid ${TEAL}`, boxShadow: '0 0 0 6px rgba(27, 138, 156, 0.10)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: TEAL, marginBottom: 8 }}>MEMORY · ORACLE AI DATABASE</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {KINDS.map(([k, d]) => (
              <div key={k} data-kind={k} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 10px', borderRadius: 8, background: 'var(--panel-strong)', border: `1.5px solid ${TEAL}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                  <span style={{ width: 20, height: 6, borderRadius: 3, background: TEAL, flex: 'none' }} />
                  {k}
                </div>
                <div style={{ fontSize: 13, color: DIM }}>{d}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <Down at={t + 5.9} text="found again on Day 2" />
        <motion.div data-build-step={3} {...fromLeft(t + 6.2)} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Portrait who="vance" size={50} />
          <div style={{ ...BUB, border: `2px solid ${TEAL}`, fontSize: 16 }}>“Mercer found ~25% section loss here yesterday. Repair within 60 days.”</div>
        </motion.div>
        <motion.div {...rise(t + 7)} style={{ marginTop: 'auto', fontSize: 18, color: 'var(--ink)' }}>
          Filed once, found again: <b>the next inspector starts where the last one stopped.</b>
        </motion.div>
      </Build>
    </>
  );
}

/* ---------- the three cards ---------- */
export const LABS: { tag: string; title: string; question: string; build: string; short: string }[] = [
  { tag: 'Lab 1 · AI Economics', title: 'The repair plan', question: 'The repair plan needs data from four places. Which model, and who checks it?', build: 'one assistant, the right model, guardrails', short: 'the repair plan' },
  { tag: 'Lab 2 · RAG to Agents', title: 'The crack', question: 'A crack on the pier. Is it serious, and what should the inspector do?', build: 'an agent that looks things up', short: 'the crack' },
  { tag: 'Lab 3 · Agent Memory', title: 'The rust', question: 'Rust found on Day 1. Will the Day 2 inspector know about it?', build: 'memory for the agent', short: 'the rust' },
];

/** step 0: the card's problem as a picture, and one question */
function Mini({ n }: { n: 1 | 2 | 3 }) {
  const lab = LABS[n - 1];
  const picture =
    n === 1 ? (
      <div data-picture="sources" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 18px', justifyItems: 'center', alignContent: 'space-evenly', alignItems: 'end', flex: 1, minHeight: 230, padding: '14px 0', boxSizing: 'border-box', borderRadius: 12, background: GREY_FILL }}>
        <Doc label="PDF" w={78} />
        <Drawing w={122} />
        <Db w={72} />
        <SitePhoto w={122} />
      </div>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center', flex: 1, minHeight: 230 }}>{n === 2 ? <CrackCloseup w="100%" h="100%" delay={0.6} /> : <RustCloseup w="100%" h="100%" delay={0.3} />}</div>
    );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 18, flex: 1, minHeight: 0 }}>
      {picture}
      <div data-question style={{ fontSize: 24, lineHeight: 1.4, color: 'var(--ink)', minHeight: '4.2em' }}>{lab.question}</div>
      <div style={{ fontSize: 20, color: DIM, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
        You build: <b style={{ color: TEAL }}>{lab.build}</b>
      </div>
    </div>
  );
}

/** a shrunk card's three steps, as small chips (V5) */
const STEPS_SHORT: Record<1 | 2 | 3, string[]> = {
  1: ['One assistant, with sources', 'The right model for each question', 'Guardrails that fail closed'],
  2: ['Decides what to look up', 'Looks it up, four shapes', 'Says what to do'],
  3: ['Day 1: Mercer files it', 'Memory in the database', 'Day 2: Vance finds it'],
};
const QUESTION_SHORT: Record<1 | 2 | 3, string> = {
  1: 'The data is in four places. Which model, and who checks?',
  2: 'Is this crack serious, and what to do?',
  3: 'Will Day 2 know what Day 1 found?',
};

/**
 * A card waiting while another one is open (owner, V5): no empty gap, it still says something. Its problem
 * picture, its question, and what you build as three small numbered chips.
 */
function Closed({ n }: { n: 1 | 2 | 3 }) {
  const picture =
    n === 1 ? (
      <div data-picture="sources" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, justifyItems: 'center', alignItems: 'end', padding: '12px 0', borderRadius: 10, background: GREY_FILL }}>
        <Doc label="PDF" w={36} />
        <Drawing w={56} />
        <Db w={34} />
        <SitePhoto w={56} />
      </div>
    ) : n === 2 ? (
      <CrackCloseup w="100%" h={130} delay={0.3} />
    ) : (
      <RustCloseup w="100%" h={130} delay={0.3} />
    );
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
      {picture}
      <div data-question style={{ fontSize: 17, lineHeight: 1.35, color: 'var(--ink)' }}>{QUESTION_SHORT[n]}</div>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: DIM, marginTop: 'auto' }}>YOU BUILD</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS_SHORT[n].map((text, i) => (
          <div key={text} data-chip={i + 1} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 9px', borderRadius: 8, background: TEAL_FILL, fontSize: 14, fontWeight: 600, lineHeight: 1.25, color: 'var(--ink)' }}>
            <span style={{ flex: 'none', width: 20, height: 20, borderRadius: '50%', background: TEAL, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

const BIG = { 1: Big1, 2: Big2, 3: Big3 } as const;

function Card({ n, step }: { n: 1 | 2 | 3; step: ThreeLabsProps['step'] }) {
  const mode = step === 0 ? 'mini' : step === n ? 'open' : 'closed';
  const open = mode === 'open';
  const Big = BIG[n];
  return (
    <motion.div
      data-lab={n}
      data-mode={mode}
      initial={false}
      animate={{ flexGrow: open ? 5.2 : 1, opacity: mode === 'closed' ? 0.8 : 1 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flexGrow: open ? 5.2 : 1,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        boxSizing: 'border-box',
        borderRadius: 16,
        border: `2px solid ${open ? 'var(--teal)' : 'rgba(27, 138, 156, 0.35)'}`,
        background: open ? 'rgba(27, 138, 156, 0.07)' : 'rgba(127, 127, 127, 0.06)',
        boxShadow: open ? '0 8px 30px rgba(20, 111, 127, 0.18)' : 'none',
        padding: mode === 'closed' ? '16px 16px' : '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.1em', color: TEAL, textTransform: 'uppercase', whiteSpace: mode === 'closed' ? 'normal' : 'nowrap' }}>{LABS[n - 1].tag}</div>
      <div style={{ fontSize: mode === 'closed' ? 24 : 30, fontWeight: 700, marginTop: 4, color: 'var(--ink)', whiteSpace: mode === 'closed' ? 'normal' : 'nowrap', transition: 'font-size 0.5s' }}>{LABS[n - 1].title}</div>
      {/* each mode is its own element: a new mode fades in and runs its own story */}
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: open ? OPEN_AT : 0.25, duration: 0.5, ease: EASE }}
          style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: open ? 'row' : 'column', marginTop: open ? 14 : 0 }}
        >
          {mode === 'mini' ? <Mini n={n} /> : open ? <Big t={OPEN_AT + 0.2} /> : <Closed n={n} />}
        </motion.div>

    </motion.div>
  );
}

/**
 * 0.7 · One bridge, three labs (owner, 29 Oct; the approved FlowCardsV4 board). One panel across four clicks
 * (overlayGroup): step 0 shows three equal cards, each with a picture of its problem and one question; on each
 * click the next lab's card opens, THE PROBLEM as a picture on the left and WHAT YOU BUILD as three numbered
 * steps coming in one after another on the right, while the other two cards wait narrow and dimmed. The crack
 * is the one red thing; everything else is teal and grey.
 */
interface LearningLab {
  n: 1 | 2 | 3;
  name: string;
  topic: string;
  question: string;
  context: string;
  steps: string[];
  proof: string;
  flow: string[];
}

const LEARNING_PATH: LearningLab[] = [
  { n: 1, name: 'Choose the model', topic: 'AI economics', question: 'Which model should answer this request?', context: 'The repair team has specifications, supplier records and a delivery photo.', steps: ['Retrieve the project evidence', 'Route text and image requests', 'Check the answer and guardrails'], proof: 'Explain the selected model. Check answer quality before comparing cost.', flow: ['Request', 'Routing rule', 'Model + evidence'] },
  { n: 2, name: 'Build the agent', topic: 'RAG to agents', question: 'What evidence does this crack need?', context: 'A useful recommendation draws on more than one lookup.', steps: ['Retrieve relevant records', 'Let the agent choose allowed tools', 'Inspect the trace and recommendation'], proof: 'Trace an answer to its source records and tool calls.', flow: ['Question', 'Tools + retrieval', 'Evidence brief'] },
  { n: 3, name: 'Add useful memory', topic: 'Agent memory', question: 'What should the next inspector know?', context: 'Mercer records a finding. Vance returns to the same bridge later.', steps: ['Keep the original finding', 'Retrieve within the intended scope', 'Check what reaches the next prompt'], proof: 'Verify recall, provenance and private-versus-shared scope.', flow: ['Finding', 'Scoped memory', 'Next visit'] },
];

function LearningFlow({ lab }: { lab: LearningLab }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', alignItems: 'stretch', padding: '20px 32px', borderRadius: 20, background: 'rgba(27,138,156,.07)', border: '1px solid var(--line)' }}>
    {lab.flow.map((text, i) => <div key={text}>
      <div style={{ background: i === 1 ? 'var(--teal)' : 'var(--panel-strong)', color: i === 1 ? 'white' : 'var(--ink)', border: '1.5px solid var(--line)', borderRadius: 12, padding: '22px 24px', fontSize: 30, fontWeight: 650, textAlign: 'center' }}>{text}</div>
      {i < 2 && <div aria-hidden style={{ textAlign: 'center', color: 'var(--teal)', fontSize: 30, lineHeight: 1, marginTop: 16 }}>↓</div>}
    </div>)}
  </div>;
}

/** Senayan edition: one readable detail pane, with the three-lab route always visible. */
export function ThreeLabs({ step = 0, kicker = 'One bridge · three capabilities', message = 'Build an assistant. Add tools. **Make evidence available next time.**' }: ThreeLabsProps) {
  const active = LEARNING_PATH[Math.max(0, Math.min(2, step - 1))];
  return <WidePanel kicker={kicker} message={message} testId="three-labs" step={step} kickerColor="var(--teal)">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16, flex: 'none', margin: '6px 0 26px' }}>
      {LEARNING_PATH.map(lab => <div key={lab.n} data-lab={lab.n} data-mode={step === 0 ? 'mini' : step === lab.n ? 'open' : 'closed'} style={{ padding: '14px 20px', borderRadius: 12, background: step === lab.n ? 'var(--teal)' : 'rgba(127,127,127,.08)', color: step === lab.n ? 'white' : 'var(--ink-dim)', display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, fontWeight: 600 }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', opacity: .7, fontSize: 21 }}>0{lab.n}</span>{lab.name}
      </div>)}
    </div>
    {step === 0 ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 24, flex: 1, minHeight: 0 }}>
      {LEARNING_PATH.map(lab => <section key={lab.n} style={{ borderTop: '3px solid var(--teal)', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 18, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2 }}>{lab.topic}</div>
        <h2 style={{ fontSize: 36, lineHeight: 1.18, margin: 0, fontWeight: 650 }}>{lab.question}</h2>
        <p style={{ fontSize: 26, lineHeight: 1.45, margin: 0, color: 'var(--ink-dim)' }}>{lab.context}</p>
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--line)', fontSize: 25, lineHeight: 1.4, color: 'var(--teal)', fontWeight: 600 }}>{lab.proof}</div>
      </section>)}
    </div> : <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 45, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <h2 style={{ fontSize: 42, lineHeight: 1.15, margin: 0, fontWeight: 650 }}>{active.question}</h2>
        <p style={{ fontSize: 27, lineHeight: 1.4, color: 'var(--ink-dim)', margin: 0 }}>{active.context}</p>
        <ol style={{ paddingLeft: 32, margin: '0 0 0 4px', fontSize: 29, lineHeight: 1.55 }}>{active.steps.map(text => <li key={text} style={{ padding: '4px 0 4px 8px' }}>{text}</li>)}</ol>
        <div style={{ borderLeft: '4px solid var(--teal)', paddingLeft: 20, fontSize: 26, lineHeight: 1.4, color: 'var(--teal)', fontWeight: 600 }}>{active.proof}</div>
      </div>
      <LearningFlow lab={active} />
    </div>}
  </WidePanel>;
}
