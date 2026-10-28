import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon } from './icons';

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
      alt={who === 'mercer' ? 'Evelyn_H_Mercer' : 'Jordan_Vance'}
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
      <div className="mono" style={{ ...MONO, fontSize: 15, color: 'var(--ink-dim)', marginBottom: 4 }}>Evelyn_H_Mercer</div>
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
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
          {step === 1 ? <Desk /> : <Cabinet />}
        </motion.div>
      </AnimatePresence>
    </WidePanel>
  );
}

function Desk() {
  const [wiped, setWiped] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWiped(true), WIPE_DELAY);
    return () => clearTimeout(t);
  }, []);
  const tilt = [-1.2, 0.8, 0.6, -0.5];
  const cards: { text: string; who: 'mercer' | 'copilot' }[] = [...MERCER_NOTES.map((text) => ({ text, who: 'mercer' as const })), { text: 'Noted.', who: 'copilot' }];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '860px 90px 1fr', alignItems: 'center', gap: 18, marginTop: 14, minHeight: 430 }}>
      <div data-desk="session" style={{ border: '3px solid var(--line)', borderRadius: 28, background: GREY_FILL, padding: '22px 24px 16px', height: 400, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, alignContent: 'start', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -6, top: -10, zIndex: 1 }}>
            <Portrait who="mercer" size={52} />
          </div>
          {cards.map((c, i) => (
            <motion.div
              key={c.text}
              data-card={c.who}
              initial={{ opacity: 0, y: -24, rotate: tilt[i] }}
              animate={wiped ? { opacity: 0, x: 90, rotate: tilt[i] * 3 } : { opacity: 1, x: 0, y: 0, rotate: tilt[i] }}
              transition={{ delay: wiped ? i * 0.12 : 0.3 + i * 0.35, duration: 0.6, ease: EASE }}
              style={{ alignSelf: 'start' }}
            >
              {c.who === 'mercer' ? (
                <NoteCard text={c.text} i={i} style={{ minHeight: 96 }} />
              ) : (
                <div style={{ border: `2px solid ${TEAL_LINE}`, borderRadius: 12, padding: '10px 16px', background: 'var(--card-bg, rgba(127,127,127,0.08))', minHeight: 96 }}>
                  <div className="mono" style={{ ...MONO, fontSize: 15, color: 'var(--teal)', marginBottom: 4 }}>copilot</div>
                  <div style={{ fontSize: 20, color: 'var(--ink)' }}>{c.text}</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 600, color: 'var(--ink-dim)', paddingTop: 8 }}>the context window · the session</div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: wiped ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <Arrow d="M2 15 H80 M66 4 L82 15 L66 26" delay={0} />
      </motion.div>
      <motion.div data-desk="wiped" data-wiped={wiped} initial={{ opacity: 0 }} animate={{ opacity: wiped ? 1 : 0, scale: wiped ? 1 : 0.96 }} transition={{ delay: wiped ? 0.35 : 0, duration: 0.6, ease: EASE }} style={{ textAlign: 'center' }}>
        <div style={{ border: '3px dashed var(--ink-dim)', borderRadius: 24, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--ink-dim)' }}>empty</div>
        <div style={{ marginTop: 14, fontSize: 22, fontWeight: 600, color: 'var(--ink-dim)' }}>the chat closes: the desk is wiped</div>
      </motion.div>
    </div>
  );
}

function Cabinet() {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '700px 130px 340px', gap: 0, alignItems: 'center', justifyContent: 'start' }}>
        <div data-desk="session" style={{ border: '3px solid var(--line)', borderRadius: 28, background: GREY_FILL, padding: '14px 18px 10px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MERCER_NOTES.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0.45] }} transition={{ duration: 1, delay: 0.5 + i * 0.7, times: [0, 0.4, 1] }} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <NoteCard text={t} i={i} style={{ padding: '6px 14px' }} />
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 19, fontWeight: 600, color: 'var(--ink-dim)', paddingTop: 8 }}>
            <Portrait who="mercer" size={40} />
            the desk
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 52, alignItems: 'center', paddingBottom: 46 }}>
          {[0, 1, 2].map((i) => (
            <Arrow key={i} d="M2 15 H92 M78 4 L94 15 L78 26" delay={0.5 + i * 0.7} w={100} />
          ))}
        </div>
        <div>
          <div data-cabinet="drawers" style={{ border: `3px solid ${TEAL_LINE}`, borderRadius: 22, background: TEAL_FILL, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                data-drawer={i}
                initial={{ backgroundColor: 'rgba(27, 138, 156, 0)' }}
                animate={{ backgroundColor: 'rgba(27, 138, 156, 0.22)' }}
                transition={{ delay: 0.9 + i * 0.7, duration: 0.6, ease: EASE }}
                style={{ border: `2px solid ${TEAL_LINE}`, borderRadius: 12, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}
              >
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1 + i * 0.7, duration: 0.5, ease: EASE }} style={{ width: 70, height: 4, borderRadius: 2, background: TEAL_LINE }} />
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 10, textAlign: 'center', fontSize: 21, fontWeight: 700, color: 'var(--teal)' }}>kept in Oracle AI Database</div>
        </div>
      </div>
      <motion.div data-day2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 0.6, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 50, paddingLeft: 870 }}>
        {/* Vance reaches up into the cabinet */}
        <div style={{ position: 'relative' }}>
          <svg width={72} height={40} viewBox="0 0 72 40" aria-hidden style={{ position: 'absolute', left: 0, top: -44, overflow: 'visible' }}>
            <motion.path d="M36 38 V4 M26 14 L36 4 L46 14" fill="none" stroke={TEAL_LINE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3.2, duration: 0.6, ease: EASE }} />
          </svg>
          <Portrait who="vance" size={72} />
        </div>
        <div>
          <div style={{ border: `2px solid ${TEAL_LINE}`, borderRadius: 999, background: TEAL_FILL, padding: '8px 26px', fontSize: 22, color: 'var(--ink)' }} data-question>What happened at this pier?</div>
          <div style={{ marginTop: 6, fontSize: 19, color: 'var(--ink-dim)' }}>
            Day 2 · <span className="mono" style={MONO}>Jordan_Vance</span> opens it
          </div>
        </div>
      </motion.div>
    </div>
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
      <div style={{ display: 'grid', gridTemplateColumns: '170px repeat(3, 1fr)', columnGap: 26, rowGap: 0, marginTop: 8, alignItems: 'start' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Portrait who="mercer" size={84} />
          </div>
          <div className="mono" style={{ ...MONO, fontSize: 15, color: 'var(--ink)', marginTop: 4 }}>Evelyn_H_Mercer</div>
        </div>
        <div data-report style={{ gridColumn: '2 / 5', border: '2px solid var(--line)', borderRadius: 18, background: GREY_FILL, padding: '14px 22px', fontSize: 27, lineHeight: 1.55, color: 'var(--ink)' }}>
          <Fragment i={0} icon="book">On Day 1 Mercer reported</Fragment>{' '}
          <Fragment i={1} icon="nodes">~25% section loss at the bearing plate edges</Fragment>, and said:{' '}
          <Fragment i={2} icon="clipboard">remove loose corrosion before coating</Fragment>.
        </div>

        {[0, 1, 2].map((i) => (
          <div key={i} style={{ gridColumn: i + 2, gridRow: 2, display: 'flex', justifyContent: 'center', height: 40, alignItems: 'center' }}>
            <Arrow d="M13 2 V26 M4 17 L13 28 L22 17" delay={FRAG_AT[i] + 0.2} w={26} h={30} />
          </div>
        ))}

        {KINDS.map((k, i) => (
          <motion.div
            key={k.kind}
            data-kind={k.kind}
            initial={{ opacity: 0, y: -22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CARD_AT[i], duration: 0.6, ease: EASE }}
            style={{ gridColumn: i + 2, gridRow: 3, border: `2px solid ${TEAL_LINE}`, borderRadius: 14, overflow: 'hidden', background: 'var(--card-bg, rgba(127,127,127,0.06))' }}
          >
            <div style={{ background: 'rgba(27, 138, 156, 0.18)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>
              <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{i + 1}</span>
              {k.title}
            </div>
            <div style={{ padding: '10px 16px', minHeight: 150 }}>
              <div style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '6px 12px', background: GREY_FILL, color: 'var(--ink)' }}>
                {k.lead && <div style={{ fontSize: 15, letterSpacing: 1.5, color: 'var(--ink-dim)', fontWeight: 600 }}>{k.lead}</div>}
                <div style={{ fontSize: k.kind === 'Semantic' ? 30 : 21, fontWeight: k.kind === 'Semantic' ? 700 : 500, color: k.kind === 'Semantic' ? 'var(--teal)' : 'var(--ink)', lineHeight: 1.25 }}>{k.body}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: 19, lineHeight: 1.35, color: 'var(--ink-dim)' }}>{k.like}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', background: GREY_FILL, padding: '5px 16px', fontSize: 15, letterSpacing: 1.5, fontWeight: 600, color: 'var(--ink-dim)' }}>{k.foot}</div>
          </motion.div>
        ))}

        {[0, 1, 2].map((i) => (
          <div key={i} style={{ gridColumn: i + 2, gridRow: 4, display: 'flex', justifyContent: 'center', height: 46, alignItems: 'center' }}>
            <Arrow d="M13 44 V4 M4 15 L13 2 L22 15" delay={Q_AT[i] + 0.15} w={26} h={46} />
          </div>
        ))}

        <div style={{ gridColumn: 1, gridRow: 5, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Portrait who="vance" size={68} />
          </div>
          <div className="mono" style={{ ...MONO, fontSize: 15, color: 'var(--ink)', marginTop: 4 }}>Jordan_Vance</div>
          <div style={{ fontSize: 15, letterSpacing: 1.5, color: 'var(--ink-dim)', fontWeight: 600 }}>DAY 2</div>
        </div>
        {KINDS.map((k, i) => (
          <motion.div
            key={k.question}
            data-question={k.kind}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Q_AT[i], duration: 0.5, ease: EASE }}
            style={{ gridColumn: i + 2, gridRow: 5, alignSelf: 'center', border: `2px solid ${TEAL_LINE}`, borderRadius: 999, padding: '10px 18px', textAlign: 'center', fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}
          >
            “{k.question}”
          </motion.div>
        ))}
      </div>
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
      <div style={{ position: 'relative', width: 1400, height: 500, marginTop: 6 }}>
        <svg width={1400} height={500} viewBox="0 0 1400 500" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }} aria-hidden>
          {/* Vance tries the drawer first: a dotted line that stops at the lock */}
          <motion.path data-line="drawer" d="M508 445 C440 445 400 428 350 398" fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} />
          <motion.path d="M300 360 C290 335 285 320 280 304" fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.4, duration: 0.5 }} />
          {/* then the lines that do arrive */}
          {[
            { d: 'M545 392 C545 250 560 150 652 142 M636 128 L653 142 L638 158', at: 2.2 },
            { d: 'M580 392 C580 320 600 250 652 242 M636 228 L653 242 L638 258', at: 2.5 },
          ].map((l, i) => (
            <motion.path key={i} data-line="shelf" d={l.d} fill="none" stroke={TEAL_LINE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: l.at, duration: 0.8, ease: EASE }} />
          ))}
        </svg>

        <motion.div data-drawer="private" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 20, top: 0, width: 500, height: 290, border: '3px solid var(--line)', borderRadius: 18, background: GREY_FILL, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderBottom: '2px solid var(--line)', fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>
            <Portrait who="mercer" size={52} />
            Mercer’s private drawer
            <span style={{ marginLeft: 'auto', display: 'inline-flex' }} data-lock="drawer">
              <LineIcon name="lock" size={30} color="var(--ink-dim)" />
            </span>
          </div>
          <div style={{ padding: 20 }}>
            <div data-private-note style={{ border: '2px solid var(--line)', borderRadius: 12, padding: '22px 20px', fontSize: 24, color: 'var(--ink-dim)', background: 'var(--card-bg, rgba(127,127,127,0.08))' }}>swap shifts Tuesday</div>
          </div>
        </motion.div>

        <motion.div data-shelf="Harbor Bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 640, top: 0, width: 740, height: 290, border: `3px solid ${TEAL_LINE}`, borderRadius: 18, background: TEAL_FILL, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: `2px solid ${TEAL_LINE}`, fontSize: 28, fontWeight: 700, color: 'var(--ink)', background: 'rgba(27, 138, 156, 0.12)' }}>
            <LineIcon name="database" size={34} />
            <span>
              Shared shelf · <span className="mono" style={MONO}>Harbor Bridge</span>
            </span>
          </div>
          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SHELF_CARDS.map((c, i) => (
              <motion.div
                key={c.label}
                data-shelf-card={c.label.replace(':', '')}
                initial={{ opacity: 0.55, backgroundColor: 'rgba(27, 138, 156, 0.05)' }}
                animate={{ opacity: 1, backgroundColor: 'rgba(27, 138, 156, 0.20)' }}
                transition={{ delay: 2.8 + i * 0.3, duration: 0.6, ease: EASE }}
                style={{ border: `2px solid ${TEAL_LINE}`, borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <Portrait who="mercer" size={50} />
                <div>
                  <div style={{ fontSize: 24, color: 'var(--ink)' }}>
                    <b style={{ color: 'var(--teal)' }}>{c.label}</b> {c.text}
                  </div>
                  <div style={{ fontSize: 17, color: 'var(--ink-dim)' }}>written by Mercer</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div data-lock="not-his" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 220, top: 358, display: 'flex', alignItems: 'center', gap: 10, border: '2px solid var(--ink-dim)', borderRadius: 999, background: GREY_FILL, padding: '6px 20px 6px 14px', fontSize: 22, fontWeight: 600, color: 'var(--ink-dim)' }}>
          <LineIcon name="lock" size={26} color="var(--ink-dim)" />
          not his
        </motion.div>

        <motion.div data-vance initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 510, top: 392, width: 130, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Portrait who="vance" size={84} />
          </div>
          <div className="mono" style={{ ...MONO, fontSize: 17, color: 'var(--ink)', marginTop: 4, whiteSpace: 'nowrap', marginLeft: -20, marginRight: -20 }}>Jordan_Vance</div>
        </motion.div>

        <motion.div data-reads initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 0.5 }} style={{ position: 'absolute', left: 700, top: 302, fontSize: 21, fontWeight: 700, color: 'var(--teal)' }}>
          reads both cards
        </motion.div>

        <motion.div data-enforced initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.3, duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: 740, top: 392, width: 640, display: 'flex', alignItems: 'center', gap: 16, borderRadius: 12, background: GREY_FILL, padding: '14px 20px', fontSize: 22, lineHeight: 1.35, color: 'var(--ink)' }}>
          <LineIcon name="database" size={34} />
          <span>
            The database enforces this: Vance’s search can’t reach Mercer’s private notes.
          </span>
        </motion.div>
      </div>
    </WidePanel>
  );
}
