import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon } from './icons';
import { Fill, FitBox } from './Fill';

/** Mercer's three notes, exactly as the notebook has them */
export const MERCER_NOTES = [
  'Corrosion on the bearing assemblies, with about 25% section loss at the bearing plate edges.',
  'My advice: repair within 60 days.',
  'Follow-up: work to plan.',
];
/** how long the desk keeps its cards before the chat closes (step 1), in ms */
export const WIPE_DELAY = 2800;

const MONO: CSSProperties = { fontFamily: 'JetBrains Mono, monospace' };
const TEAL_LINE = 'rgba(27, 138, 156, 0.85)';
const TEAL_FILL = 'rgba(27, 138, 156, 0.10)';
const GREY_FILL = 'rgba(127, 127, 127, 0.12)';

function Portrait({ who, size = 64 }: { who: 'mercer' | 'vance'; size?: number }) {
  return (
    <img
      data-portrait={who}
      src={who === 'mercer' ? mercerPortrait : vancePortrait}
      alt={who === 'mercer' ? 'Mercer' : 'Vance'}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: '50%', border: `3px solid ${TEAL_LINE}`, background: 'rgba(127,127,127,0.15)', objectFit: 'cover', flex: 'none', display: 'block' }}
    />
  );
}

function Arrow({ d, delay, w = 90, h = 30 }: { d: string; delay: number; w?: number; h?: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', display: 'block' }} aria-hidden>
      <motion.path d={d} fill="none" stroke={TEAL_LINE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 0.55, ease: EASE }} />
    </svg>
  );
}

/** one of Mercer's notes: her name in mono, then the words */
function NoteCard({ text, i, style, children }: { text?: string; i: number; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div data-note={i} style={{ border: '2px solid var(--line)', borderRadius: 12, padding: '10px 16px', background: 'var(--card-bg, rgba(127,127,127,0.08))', ...style }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-dim)', marginBottom: 4 }}>Mercer</div>
      <div style={{ fontSize: 20, lineHeight: 1.35, color: 'var(--ink)' }}>{text}</div>
      {children}
    </div>
  );
}

export interface DeskCabinetProps {
  kicker: string;
  message: string;
  /** 1: the desk, then the chat closes and it is wiped; 2: the three notes go into the cabinet, then Day 2 */
  step: 1 | 2;
  notebook?: string;
}

/**
 * 3.5/3.6 · Short-term memory is the desk, long-term memory is the cabinet (Rev05, Rev06). One panel across
 * both clicks: only `step` changes, and the content cross-fades inside the same WidePanel.
 */
export function DeskCabinet({ kicker, message, step, notebook }: DeskCabinetProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="desk-cabinet" step={step}>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Fill>{step === 1 ? <Desk /> : <Cabinet />}</Fill>
        </motion.div>
      </AnimatePresence>
    </WidePanel>
  );
}

/** how long the sweep takes to clear the table (ms) */
const SWEEP_MS = 1300;

/** the desk is a wooden table (owner, 29 Oct: "context window is like table so brown"); muted wood, never orange */
const WOOD = { top: '#a47b55', edge: '#7d5a3c', leg: '#6b4c33' };

/** a wooden table seen a little from above: the top (where the cards lie), its front edge, two legs */
function Table({ width, children, label, top }: { width: number; children: ReactNode; label: ReactNode; /** a fixed height for the top; by default it takes its column's height */ top?: number }) {
  return (
    <div style={{ width: '100%', maxWidth: width, alignSelf: top ? 'center' : 'stretch', display: 'flex', flexDirection: 'column' }}>
      <div
        data-desk="session"
        style={{
          position: 'relative',
          flex: top ? 'none' : 1,
          height: top,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '14px 14px 4px 4px',
          background: WOOD.top,
          padding: '20px 22px 22px',
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.18)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      {/* the front edge, and the legs under it */}
      <div style={{ height: 16, background: WOOD.edge, borderRadius: '0 0 6px 6px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 34px' }}>
        <div style={{ width: 26, height: 78, background: WOOD.leg, borderRadius: '0 0 4px 4px' }} />
        <div style={{ width: 26, height: 78, background: WOOD.leg, borderRadius: '0 0 4px 4px' }} />
      </div>
      <div style={{ textAlign: 'center', fontSize: 25, fontWeight: 600, color: 'var(--ink-dim)', marginTop: -54 }}>{label}</div>
    </div>
  );
}

/** a card lying on the table: solid, so it reads on the wood */
const CARD: CSSProperties = { background: 'var(--panel-strong)', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 3px 8px rgba(0,0,0,0.18)', borderRadius: 10 };

function Desk() {
  const [wiped, setWiped] = useState(false);
  const [swept, setSwept] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWiped(true), WIPE_DELAY);
    const u = setTimeout(() => setSwept(true), WIPE_DELAY + SWEEP_MS);
    return () => (clearTimeout(t), clearTimeout(u));
  }, []);
  const tilt = [-1.6, 1.1, 0.8, -0.9];
  const cards: { text: string; who: 'mercer' | 'copilot' }[] = [...MERCER_NOTES.map((text) => ({ text, who: 'mercer' as const })), { text: 'Noted.', who: 'copilot' }];
  return (
    <div style={{ flex: '1 0 auto', minHeight: 520, display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
      <Table
        width={1300}
        label={
          <span data-desk="wiped" data-wiped={swept} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
            <Portrait who="mercer" size={60} />
            {swept ? 'the chat closes: the desk is swept clean' : 'the context window · the session'}
          </span>
        }
      >
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '36px 30px', alignContent: 'space-evenly', padding: '10px 18px' }}>
          {cards.map((c, i) => (
            <motion.div
              key={c.text}
              data-card={c.who}
              initial={{ opacity: 0, y: -24, rotate: tilt[i] }}
              // the sweep passes left to right: each card goes as it reaches it, off the table's right edge
              animate={wiped ? { opacity: 0, x: 1200 - (i % 2) * 560, y: 30 + i * 6, rotate: tilt[i] * 14 } : { opacity: 1, x: 0, y: 0, rotate: tilt[i] }}
              transition={wiped ? { delay: 0.15 + (i % 2) * 0.28 + Math.floor(i / 2) * 0.06, duration: 0.85, ease: [0.5, 0, 0.75, 0] } : { delay: 0.3 + i * 0.35, duration: 0.6, ease: EASE }}
              style={{ ...CARD, padding: '20px 26px', minHeight: 150 }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: c.who === 'mercer' ? 'var(--ink-dim)' : 'var(--teal)', marginBottom: 8 }}>{c.who === 'mercer' ? 'Mercer' : 'AI Agent'}</div>
              <div style={{ fontSize: 27, lineHeight: 1.35, color: 'var(--ink)' }}>{c.text}</div>
            </motion.div>
          ))}
        </div>
        {/* the sweep: a broad soft band crossing the table, left to right, as the chat closes */}
        {wiped && (
          <motion.div
            aria-hidden
            initial={{ x: '-40%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.6, 1], times: [0, 0.15, 0.8, 1] }}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '35%', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 70%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }}
          />
        )}
      </Table>
    </div>
  );
}

/** when Vance's question has appeared, the middle drawer slides out (s); then her notes come out to answer him */
const DRAWER_AT = 3.5;
const ANSWER_AT = 4.4;
const CAB_GREY = '#8a919c';
const CAB_DARK = '#5c6b78';
const CAB_LIGHT = '#aab1ba';

/**
 * The cabinet in a three-quarter view (owner, 29 Oct: "it should tilt a bit, so it can see the opening"): its
 * front, its top and its right side; each drawer lights teal as a note goes in, and when Vance asks, the middle
 * drawer slides out towards us and its open top shows the teal folders inside.
 */
const CW = 250; // front width
const CH = 300; // front height
const DX = 46; // depth, drawn up and to the right
const DY = -30;
const X0 = 10;
const Y0 = 40;
const DRAWER_H = 86;
const drawerY = (i: number) => Y0 + 14 + i * 95;
/** how far the open drawer comes out, in depth units (1 = the cabinet's whole depth) */
const PULL = 1.3;

function FilingCabinet({ scale = 1 }: { scale?: number }) {
  const k = useMotionValue(0);
  useEffect(() => {
    const c = animate(k, PULL, { delay: DRAWER_AT, duration: 0.9, ease: EASE });
    return () => c.stop();
  }, [k]);
  // the open drawer: its front moves out by k depth units (down and to the left)
  const fx = X0 + 12;
  const fy = drawerY(1);
  const fw = CW - 24;
  const frontX = useTransform(k, (v) => -DX * v);
  const frontY = useTransform(k, (v) => -DY * v);
  // its open top: from the moved front's top edge back to where the front was
  const topFace = useTransform(k, (v) => {
    const x = fx - DX * v;
    const y = fy - DY * v;
    return `M${x} ${y} L${x + fw} ${y} L${fx + fw} ${fy} L${fx} ${fy} Z`;
  });
  const sideFace = useTransform(k, (v) => {
    const x = fx + fw - DX * v;
    const y = fy - DY * v;
    return `M${x} ${y} L${fx + fw} ${fy} L${fx + fw} ${fy + DRAWER_H} L${x} ${y + DRAWER_H} Z`;
  });
  const foldersX = useTransform(k, (v) => -DX * v * 0.55);
  const foldersY = useTransform(k, (v) => -DY * v * 0.55);
  const folderOpacity = useTransform(k, [0, 0.3], [0, 1]);
  return (
    <svg width={(CW + DX + 20) * scale} height={(CH + Y0 + 60) * scale} viewBox={`0 0 ${CW + DX + 20} ${CH + Y0 + 60}`} style={{ overflow: 'visible', display: 'block' }} aria-hidden>
      <ellipse cx={X0 + CW / 2 + 10} cy={Y0 + CH + 6} rx={CW / 2 + 30} ry={8} fill="rgba(127,127,127,0.22)" />
      {/* top and right side, then the front */}
      <path d={`M${X0} ${Y0} L${X0 + DX} ${Y0 + DY} L${X0 + CW + DX} ${Y0 + DY} L${X0 + CW} ${Y0} Z`} fill={CAB_LIGHT} />
      <path d={`M${X0 + CW} ${Y0} L${X0 + CW + DX} ${Y0 + DY} L${X0 + CW + DX} ${Y0 + CH + DY} L${X0 + CW} ${Y0 + CH} Z`} fill={CAB_DARK} />
      <rect x={X0} y={Y0} width={CW} height={CH} rx={6} fill={CAB_GREY} />
      {/* the gap the open drawer leaves */}
      <rect x={fx} y={fy} width={fw} height={DRAWER_H} rx={5} fill="rgba(20, 26, 34, 0.55)" />
      {/* the open drawer is drawn last, so as it slides out it sits in front of the drawer below it */}
      {[0, 2, 1].map((i) => {
        const open = i === 1;
        const y = drawerY(i);
        const face = (
          <>
            <motion.rect
              x={fx}
              y={y}
              width={fw}
              height={DRAWER_H}
              rx={5}
              stroke={CAB_DARK}
              strokeWidth={2.5}
              initial={{ fill: 'rgb(150, 157, 167)' }}
              animate={{ fill: 'rgb(104, 166, 178)' }}
              transition={{ delay: 0.9 + i * 0.7, duration: 0.6, ease: EASE }}
            />
            <rect x={fx + fw / 2 - 46} y={y + 13} width={92} height={20} rx={4} fill="rgba(255,255,255,0.8)" />
            <motion.path d={`M${fx + fw / 2 - 36} ${y + 23}h72`} stroke={CAB_DARK} strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.7, duration: 0.5, ease: EASE }} />
            <rect x={fx + fw / 2 - 32} y={y + 52} width={64} height={14} rx={7} fill={CAB_DARK} />
          </>
        );
        return open ? (
          <g key={i} data-drawer={i} data-open>
            {/* inside the open drawer: its side, its open top with the folders standing in it */}
            <motion.path d={sideFace} fill={CAB_DARK} />
            <motion.path d={topFace} fill="rgba(20, 26, 34, 0.7)" />
            <motion.g style={{ x: foldersX, y: foldersY, opacity: folderOpacity }}>
              {[0, 1, 2, 3, 4].map((f) => (
                <rect key={f} data-folder={f} x={fx + 18 + f * 40} y={fy - 16 - (f % 2) * 4} width={30} height={24} rx={3} fill="var(--teal)" opacity={0.65 + (f % 3) * 0.12} />
              ))}
            </motion.g>
            <motion.g style={{ x: frontX, y: frontY }}>{face}</motion.g>
          </g>
        ) : (
          <g key={i} data-drawer={i}>
            {face}
          </g>
        );
      })}
    </svg>
  );
}

function Cabinet() {
  return (
    // laid out at a fixed size, scaled to the room it has (a large text size leaves less)
    <FitBox w={1420} h={660} max={1}>
    <div style={{ width: 1420, height: 660, display: 'grid', gridTemplateColumns: '470px 80px 400px 1fr', alignItems: 'center', columnGap: 18 }}>
      {/* the desk, the same table as the page before */}
      <Table
        width={470}
        top={540}
        label={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <Portrait who="mercer" size={56} />
            the desk
          </span>
        }
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: 16 }}>
          {MERCER_NOTES.map((t, i) => (
            <motion.div key={t} data-note={i} initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0.4] }} transition={{ duration: 1, delay: 0.5 + i * 0.7, times: [0, 0.4, 1] }} style={{ ...CARD, padding: '14px 18px' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink-dim)', marginBottom: 4 }}>Mercer</div>
              <div style={{ fontSize: 24, lineHeight: 1.3, color: 'var(--ink)' }}>{t}</div>
            </motion.div>
          ))}
        </div>
      </Table>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 120, alignItems: 'center', paddingBottom: 70 }}>
        {[0, 1, 2].map((i) => (
          <Arrow key={i} d="M2 15 H70 M56 4 L72 15 L56 26" delay={0.5 + i * 0.7} w={76} />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div data-cabinet="drawers" style={{ display: 'flex', justifyContent: 'center' }}>
          <FilingCabinet scale={1.25} />
        </div>
        <div style={{ marginTop: -44, fontSize: 25, fontWeight: 700, color: 'var(--teal)' }}>kept in Oracle AI Database</div>
      </div>
      {/* Day 2: Vance asks, the drawer opens, and her notes come out to answer him */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignSelf: 'center' }}>
        <motion.div data-day2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9, duration: 0.6, ease: EASE }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <Portrait who="vance" size={120} />
          <div style={{ fontSize: 22, color: 'var(--ink-dim)' }}>
            Day 2 · <b>Vance</b> asks
          </div>
          <div data-question style={{ border: `2px solid ${TEAL_LINE}`, borderRadius: 999, background: TEAL_FILL, padding: '10px 24px', fontSize: 25, color: 'var(--ink)' }}>What happened at this pier?</div>
        </motion.div>
        <motion.div data-answer initial={{ opacity: 0, x: -70, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: ANSWER_AT, duration: 0.8, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, border: `2px solid ${TEAL_LINE}`, background: 'rgba(27, 138, 156, 0.16)' }}>
          <LineIcon name="database" size={40} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--teal)', marginBottom: 4 }}>AI AGENT · FROM THE CABINET</div>
            <div style={{ fontSize: 22, lineHeight: 1.35, color: 'var(--ink)' }}>Mercer logged corrosion here on Day 1: about 25% section loss, repair within 60 days.</div>
          </div>
        </motion.div>
      </div>
    </div>
    </FitBox>
  );
}

/* ------------------------------------------------------------------------------------------------ */

export interface ThreeKindsProps {
  kicker: string;
  message: string;
  notebook?: string;
}

const KINDS = [
  { kind: 'Episodic', title: 'What happened', icon: 'book', lead: 'DAY 1', body: 'Mercer inspected the rust', like: 'like a diary entry. Dated. It is about one day.', foot: 'EPISODIC MEMORY', question: 'What happened here?' },
  { kind: 'Semantic', title: 'What is true', icon: 'nodes', lead: 'SECTION LOSS', body: '~25%', like: 'like a fact sheet. Stays true until someone changes it.', foot: 'SEMANTIC MEMORY', question: 'How bad is it?' },
  { kind: 'Procedural', title: 'How to do the job', icon: 'clipboard', lead: '', body: 'remove loose corrosion before coating', like: 'like a checklist. Applies next time, on any bridge.', foot: 'PROCEDURAL MEMORY', question: 'What do I do first?' },
] as const;
const FRAG_AT = [0.4, 1.05, 1.7];
const CARD_AT = [0.8, 1.45, 2.1];
const Q_AT = [2.8, 3.1, 3.4];

function Fragment({ i, icon, children }: { i: number; icon: 'book' | 'nodes' | 'clipboard'; children: ReactNode }) {
  return (
    <motion.span
      data-fragment={KINDS[i].kind}
      initial={{ backgroundColor: 'rgba(27, 138, 156, 0)', boxShadow: 'inset 0 -3px 0 rgba(27, 138, 156, 0)' }}
      animate={{ backgroundColor: 'rgba(27, 138, 156, 0.20)', boxShadow: 'inset 0 -3px 0 rgba(27, 138, 156, 0.85)' }}
      transition={{ delay: FRAG_AT[i], duration: 0.5, ease: EASE }}
      style={{ borderRadius: 6, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: 8, margin: '2px 0' }}
    >
      <LineIcon name={icon} size={24} />
      {children}
    </motion.span>
  );
}

/**
 * 3.8 · One report, three cards (V2_08): Mercer's sentence with three highlighted fragments, each lifting into
 * its card (episodic, semantic, procedural); then Vance's three Day 2 questions, each drawing a line to its card.
 */
export function ThreeKinds({ kicker, message, notebook }: ThreeKindsProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="three-kinds">
      <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '190px repeat(3, 1fr)', gridTemplateRows: 'auto 56px minmax(min-content, 1fr) 64px auto', columnGap: 28, rowGap: 0, marginTop: 8, alignItems: 'start' }}>
        {/* the two people, big enough to read from the back of the hall (owner); each spans rows so the cards keep their place */}
        <div style={{ gridColumn: 1, gridRow: '1 / 4', alignSelf: 'start', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Portrait who="mercer" size={150} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)', marginTop: 8 }}>Mercer</div>
          <div style={{ fontSize: 21, letterSpacing: 1.5, color: 'var(--ink-dim)', fontWeight: 700 }}>DAY 1</div>
        </div>
        <div data-report style={{ gridColumn: '2 / 5', border: '2px solid var(--line)', borderRadius: 18, background: GREY_FILL, padding: '18px 26px', fontSize: 30, lineHeight: 1.6, color: 'var(--ink)' }}>
          <Fragment i={0} icon="book">On Day 1 Mercer reported</Fragment>{' '}
          <Fragment i={1} icon="nodes">~25% section loss at the bearing plate edges</Fragment>, and said:{' '}
          <Fragment i={2} icon="clipboard">remove loose corrosion before coating</Fragment>.
        </div>

        {[0, 1, 2].map((i) => (
          <div key={i} style={{ gridColumn: i + 2, gridRow: 2, display: 'flex', justifyContent: 'center', height: 56, alignItems: 'center' }}>
            <Arrow d="M13 2 V36 M4 27 L13 38 L22 27" delay={FRAG_AT[i] + 0.2} w={26} h={40} />
          </div>
        ))}

        {KINDS.map((k, i) => (
          <motion.div
            key={k.kind}
            data-kind={k.kind}
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CARD_AT[i], duration: 0.6, ease: EASE }}
            style={{ gridColumn: i + 2, gridRow: 3, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', border: `2px solid ${TEAL_LINE}`, borderRadius: 14, overflow: 'hidden', background: 'var(--card-bg, rgba(127,127,127,0.06))' }}
          >
            <div style={{ background: 'rgba(27, 138, 156, 0.18)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 29, fontWeight: 700, color: 'var(--ink)' }}>
              <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{i + 1}</span>
              {k.title}
            </div>
            <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '10px 16px', background: GREY_FILL, color: 'var(--ink)' }}>
                {k.lead && <div style={{ fontSize: 16, letterSpacing: 1.5, color: 'var(--ink-dim)', fontWeight: 600 }}>{k.lead}</div>}
                <div style={{ fontSize: k.kind === 'Semantic' ? 36 : 24, fontWeight: k.kind === 'Semantic' ? 700 : 500, color: k.kind === 'Semantic' ? 'var(--teal)' : 'var(--ink)', lineHeight: 1.25 }}>{k.body}</div>
              </div>
              <div style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--ink-dim)' }}>{k.like}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', background: GREY_FILL, padding: '7px 20px', fontSize: 16, letterSpacing: 1.5, fontWeight: 600, color: 'var(--ink-dim)' }}>{k.foot}</div>
          </motion.div>
        ))}

        {[0, 1, 2].map((i) => (
          <div key={i} style={{ gridColumn: i + 2, gridRow: 4, display: 'flex', justifyContent: 'center', height: 64, alignItems: 'center' }}>
            <Arrow d="M13 54 V4 M4 15 L13 2 L22 15" delay={Q_AT[i] + 0.15} w={26} h={56} />
          </div>
        ))}

        <div style={{ gridColumn: 1, gridRow: '3 / 6', alignSelf: 'end', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Portrait who="vance" size={150} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)', marginTop: 8 }}>Vance</div>
          <div style={{ fontSize: 21, letterSpacing: 1.5, color: 'var(--ink-dim)', fontWeight: 700 }}>DAY 2</div>
        </div>
        {KINDS.map((k, i) => (
          <motion.div
            key={k.question}
            data-question={k.kind}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Q_AT[i], duration: 0.5, ease: EASE }}
            style={{ gridColumn: i + 2, gridRow: 5, alignSelf: 'center', border: `2px solid ${TEAL_LINE}`, borderRadius: 999, padding: '14px 20px', textAlign: 'center', fontSize: 27, fontWeight: 500, color: 'var(--ink)' }}
          >
            “{k.question}”
          </motion.div>
        ))}
      </div>
      </Fill>
    </WidePanel>
  );
}

/* ------------------------------------------------------------------------------------------------ */

export interface SharedShelfProps {
  kicker: string;
  message: string;
  notebook?: string;
}

const SHELF_CARDS = [
  { label: 'Guideline:', text: 'remove loose corrosion before coating' },
  { label: 'Finding:', text: '~25% section loss, repair within 60 days' },
];

/**
 * 3.10 · Private drawer, shared shelf (V2_10): Mercer's private drawer and the shared shelf for Harbor Bridge;
 * Vance's line to the drawer is tried first and stops at the lock, then his lines reach both shelf cards.
 */
export function SharedShelf({ kicker, message, notebook }: SharedShelfProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="shared-shelf">
      <Fill>
      <FitBox w={1400} h={640} max={1.02}>
      <div style={{ position: 'relative', width: 1400, height: 640 }}>
        <svg width={1400} height={640} viewBox="0 0 1400 640" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }} aria-hidden>
          {/* Vance tries the drawer first: a dotted line that stops at the lock */}
          <motion.path data-line="drawer" d="M500 555 C440 555 400 538 350 512" fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} />
          <motion.path d="M300 466 C292 440 286 414 282 394" fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.4, duration: 0.5 }} />
          {/* then the lines that do arrive */}
          {[
            // the tips stop short of the shelf's border (left edge at x 640), never on it
            { d: 'M545 498 C545 320 555 168 626 160 M612 147 L627 160 L612 173', at: 2.2 },
            { d: 'M585 498 C585 400 598 304 626 296 M612 283 L627 296 L612 309', at: 2.5 },
          ].map((l, i) => (
            <motion.path key={i} data-line="shelf" d={l.d} fill="none" stroke={TEAL_LINE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: l.at, duration: 0.8, ease: EASE }} />
          ))}
        </svg>

        <motion.div data-drawer="private" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 20, top: 0, width: 500, height: 380, border: '3px solid var(--line)', borderRadius: 18, background: GREY_FILL, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 84, boxSizing: 'border-box', padding: '0 20px', borderBottom: '2px solid var(--line)', fontSize: 28, whiteSpace: 'nowrap', fontWeight: 700, color: 'var(--ink)' }}>
            <Portrait who="mercer" size={60} />
            Mercer’s private drawer
            <span style={{ marginLeft: 'auto', display: 'inline-flex' }} data-lock="drawer">
              <LineIcon name="lock" size={34} color="var(--ink-dim)" />
            </span>
          </div>
          <div style={{ padding: '64px 24px' }}>
            <div data-private-note style={{ border: '2px solid var(--line)', borderRadius: 12, padding: '30px 24px', fontSize: 28, color: 'var(--ink-dim)', background: 'var(--card-bg, rgba(127,127,127,0.08))' }}>swap shifts Tuesday</div>
          </div>
        </motion.div>

        <motion.div data-shelf="Harbor Bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 640, top: 0, width: 740, height: 380, border: `3px solid ${TEAL_LINE}`, borderRadius: 18, background: TEAL_FILL, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 84, boxSizing: 'border-box', padding: '0 22px', borderBottom: `2px solid ${TEAL_LINE}`, fontSize: 30, fontWeight: 700, color: 'var(--ink)', background: 'rgba(27, 138, 156, 0.12)' }}>
            <LineIcon name="database" size={38} />
            <span>
              Shared shelf · <span className="mono" style={MONO}>Harbor Bridge</span>
            </span>
          </div>
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 30 }}>
            {SHELF_CARDS.map((c, i) => (
              <motion.div
                key={c.label}
                data-shelf-card={c.label.replace(':', '')}
                initial={{ opacity: 0.55, backgroundColor: 'rgba(27, 138, 156, 0.05)' }}
                animate={{ opacity: 1, backgroundColor: 'rgba(27, 138, 156, 0.20)' }}
                transition={{ delay: 2.8 + i * 0.3, duration: 0.6, ease: EASE }}
                style={{ border: `2px solid ${TEAL_LINE}`, borderRadius: 12, height: 104, boxSizing: 'border-box', padding: '0 18px', display: 'flex', alignItems: 'center', gap: 18 }}
              >
                <Portrait who="mercer" size={62} />
                <div>
                  <div style={{ fontSize: 23, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    <b style={{ color: 'var(--teal)' }}>{c.label}</b> {c.text}
                  </div>
                  <div style={{ fontSize: 19, color: 'var(--ink-dim)', marginTop: 2 }}>written by Mercer</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div data-lock="not-his" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 206, top: 466, display: 'flex', alignItems: 'center', gap: 10, border: '2px solid var(--ink-dim)', borderRadius: 999, background: GREY_FILL, padding: '8px 22px 8px 16px', fontSize: 25, fontWeight: 600, color: 'var(--ink-dim)' }}>
          <LineIcon name="lock" size={28} color="var(--ink-dim)" />
          not his
        </motion.div>

        <motion.div data-vance initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 500, top: 500, width: 150, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Portrait who="vance" size={104} />
          </div>
          <div style={{ fontSize: 23, fontWeight: 600, color: 'var(--ink)', marginTop: 4, whiteSpace: 'nowrap' }}>Vance</div>
        </motion.div>

        <motion.div data-reads initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 0.5 }} style={{ position: 'absolute', left: 700, top: 396, fontSize: 24, fontWeight: 700, color: 'var(--teal)' }}>
          reads both cards
        </motion.div>

        <motion.div data-enforced initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.3, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 720, top: 500, width: 660, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, borderRadius: 12, background: GREY_FILL, padding: '20px 24px', fontSize: 25, lineHeight: 1.4, color: 'var(--ink)' }}>
          <LineIcon name="database" size={40} />
          <span>
            The database enforces this: Vance’s search can’t reach Mercer’s private notes.
          </span>
        </motion.div>
      </div>
      </FitBox>
      </Fill>
    </WidePanel>
  );
}
