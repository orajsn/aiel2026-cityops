import { AnimatePresence, motion } from 'motion/react';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon, type IconName } from './icons';

export interface GlassProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** 1: the glass fills with what goes into the context window; 2: the four ways that goes wrong; 3: which discipline solves which */
  step: 1 | 2 | 3;
  notebook?: string;
}

/** what fills the context window, bottom to top (Lab 3 deck, slide 27) */
export const GLASS_LAYERS = ['System prompt', 'Developer instructions', 'Tool schemas', 'Retrieved context', 'Conversation history', 'User message'];
/** the four facts beside the glass (slide 27) */
export const GLASS_FACTS = ['Finite resource', 'LLM’s only input', 'Assembled, not automatic', 'Garbage in, garbage out'];
/**
 * The curation problem (slide 28), told with the bridge instead of the deck's running shoes (owner, 25 Oct). Each has
 * its icon, the same one again when it is solved (Ending.tsx, 3.15b), so the audience links problem and fix.
 */
export const CURATION: { word: string; title: string; text: string; icon: IconName }[] = [
  { word: 'Volume', title: 'The window fills up', text: 'By turn 15 the window is full. One more tool call and it breaks.', icon: 'overflow' },
  { word: 'Relevance', title: 'Wrong data is in it', text: 'Mercer’s finding is there, but buried under search results Vance never asked for.', icon: 'target' },
  { word: 'Accuracy', title: 'Summaries lose details', text: 'The summary says “rust on the pier” but lost the 25%.', icon: 'inspect' },
  { word: 'Timing', title: 'The right memory, at the wrong moment', text: 'Her finding was loaded at the start, not fetched again when Vance asked.', icon: 'clock' },
];

const W = 520;
const H = 470;
const TOP = 24;
const BOTTOM = 446;
const LAYER = (BOTTOM - TOP - 30) / GLASS_LAYERS.length;
/** half the glass's width at height y: wider at the rim, like a tumbler */
const half = (y: number) => 168 + ((BOTTOM - y) / (BOTTOM - TOP)) * 52;

/**
 * 3.3 · The glass: the context window as a tumbler that fills, layer by layer, with everything the model
 * will see (click 1, with the deck's four facts beside it), then the four ways filling it goes wrong,
 * told with Mercer's finding and Vance's question (click 2). One panel across both clicks.
 */
export function Glass({ kicker, message, step, notebook }: GlassProps) {
  if (step === 3)
    return (
      <WidePanel kicker={kicker} message={message} notebook={notebook} testId="glass" step={step}>
        <CurationMap />
      </WidePanel>
    );
  const cx = W / 2;
  const outline = `M${cx - half(TOP)} ${TOP} L${cx - half(BOTTOM)} ${BOTTOM} Q${cx} ${BOTTOM + 14} ${cx + half(BOTTOM)} ${BOTTOM} L${cx + half(TOP)} ${TOP}`;
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="glass" step={step}>
      <div style={{ display: 'grid', gridTemplateColumns: `${W}px 1fr`, gap: 48, alignItems: 'center' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', overflow: 'visible', fontFamily: 'inherit' }} role="img" aria-label="The context window, filled layer by layer">
          <defs>
            <clipPath id="glass-inside">
              <path d={`${outline} Z`} />
            </clipPath>
          </defs>
          <g clipPath="url(#glass-inside)">
            {GLASS_LAYERS.map((name, i) => {
              const y = BOTTOM - (i + 1) * LAYER;
              return (
                <motion.g
                  key={name}
                  data-layer={name}
                  initial={{ opacity: 0, y: -90 }}
                  animate={{ opacity: step === 2 ? 0.55 : 1, y: 0 }}
                  transition={{ delay: step === 1 ? 0.35 + i * 0.32 : 0, duration: 0.7, ease: EASE }}
                >
                  <rect x={0} y={y + 2} width={W} height={LAYER - 4} fill={`rgba(27, 138, 156, ${0.14 + i * 0.05})`} />
                  <text x={cx} y={y + LAYER / 2 + 7} textAnchor="middle" fontSize={21} fontWeight={600} fill="var(--ink)">
                    {name}
                  </text>
                </motion.g>
              );
            })}
          </g>
          <path d={outline} fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeLinejoin="round" />
          <ellipse cx={cx} cy={TOP} rx={half(TOP)} ry={10} fill="none" stroke="var(--ink-dim)" strokeWidth={3} />
        </svg>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="facts" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.3 }}>
              {GLASS_FACTS.map((f, i) => (
                <motion.div
                  key={f}
                  data-fact={f}
                  style={{ padding: '18px 24px', borderRadius: 12, background: 'rgba(127, 127, 127, 0.1)', fontSize: 26, fontWeight: 600, color: 'var(--ink)' }}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.4 + i * 0.3, duration: 0.45, ease: EASE }}
                >
                  {f}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="curation" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {CURATION.map((c, i) => (
                <motion.div
                  key={c.word}
                  data-problem={c.word}
                  style={{ padding: '18px 22px', borderRadius: 12, background: 'rgba(127, 127, 127, 0.1)', minHeight: 170 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.3, duration: 0.45, ease: EASE }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                    <LineIcon name={c.icon} size={44} />
                    <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--ink)' }}>
                      <span style={{ color: 'var(--teal)' }}>{c.word}</span> · {c.title}
                    </div>
                  </div>
                  <div style={{ fontSize: 21, lineHeight: 1.4, color: 'var(--ink)' }}>{c.text}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WidePanel>
  );
}

/* ---------- click 3 · which discipline solves which (owner, 28 Oct, in the owner's words) ---------- */

/** the three disciplines and the two curation problems each one solves, and how */
export const CURATION_FIX: { name: string; icon: IconName; what: string; solves: { word: string; how: string }[] }[] = [
  {
    name: 'Memory engineering',
    icon: 'database',
    what: 'Building and storing the information the agent uses and generates.',
    solves: [
      { word: 'Volume', how: 'stores and offloads, so the window never bloats' },
      { word: 'Accuracy', how: 'controls what gets summarized, and how' },
    ],
  },
  {
    name: 'Context engineering',
    icon: 'funnel',
    what: 'Deciding what to pull from memory, so the agent perceives the right data, for the right query, at the right time.',
    solves: [
      { word: 'Relevance', how: 'pulls only what matters for this query' },
      { word: 'Timing', how: 'retrieves at the moment of inference, not at session start' },
    ],
  },
  {
    name: 'Harness engineering',
    icon: 'loop',
    what: 'How the agent runs reliably, and guarantees information is retrieved.',
    solves: [
      { word: 'Timing', how: 'guarantees retrieval on every call, not when the model remembers' },
      { word: 'Volume', how: 'enforces offloading after every tool execution' },
    ],
  },
];

/** the problem as it reads on the map: Accuracy is also called fidelity */
const chipLabel = (word: string) => (word === 'Accuracy' ? 'Accuracy / Fidelity' : word);
const iconOf = (word: string) => CURATION.find((c) => c.word === word)!.icon;

/** layout of the map, in the panel's px: four problem chips on top, three discipline cards below */
const MAP_W = 1400;
const CHIP_Y = 0;
const CHIP_H = 64;
const CARD_Y = 176;
const CARD_W = 440;
const chipX = (i: number) => (MAP_W * (i + 0.5)) / CURATION.length;
const cardX = (i: number) => i * (CARD_W + (MAP_W - 3 * CARD_W) / 2);

function CurationMap() {
  // each discipline comes in with its two lines, one after the other
  const at = (i: number) => 0.9 + i * 0.8;
  return (
    <div style={{ position: 'relative', width: MAP_W, height: 540, margin: '6px auto 0' }}>
      <svg width={MAP_W} height={CARD_Y} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
        {CURATION_FIX.map((d, i) =>
          d.solves.map((s, j) => {
            const x1 = chipX(CURATION.findIndex((c) => c.word === s.word));
            const x2 = cardX(i) + CARD_W / 2 + (j ? 90 : -90);
            return (
              <motion.path
                key={`${d.name}>${s.word}`}
                data-link={`${d.name}>${s.word}`}
                d={`M${x1} ${CHIP_Y + CHIP_H} C${x1} ${CHIP_H + 60} ${x2} ${CARD_Y - 60} ${x2} ${CARD_Y}`}
                fill="none"
                stroke="var(--teal)"
                strokeWidth={2.5}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: at(i) + 0.2 + j * 0.2, duration: 0.6, ease: EASE }}
              />
            );
          }),
        )}
      </svg>
      {CURATION.map((c, i) => (
        <motion.div
          key={c.word}
          data-problem-chip={c.word}
          style={{ position: 'absolute', top: CHIP_Y, left: chipX(i) - 140, width: 280, height: CHIP_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderRadius: 32, background: 'rgba(127, 127, 127, 0.1)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.45, ease: EASE }}
        >
          <LineIcon name={c.icon} size={36} />
          {chipLabel(c.word)}
        </motion.div>
      ))}
      {CURATION_FIX.map((d, i) => (
        <motion.div
          key={d.name}
          data-discipline={d.name}
          style={{ position: 'absolute', top: CARD_Y, left: cardX(i), width: CARD_W, boxSizing: 'border-box', padding: '20px 22px', borderRadius: 16, background: 'rgba(27, 138, 156, 0.1)', border: '2px solid var(--teal)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: at(i), duration: 0.5, ease: EASE }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <LineIcon name={d.icon} size={44} />
            <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>{d.name}</span>
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.4, color: 'var(--ink-dim)', marginBottom: 14 }}>{d.what}</div>
          {d.solves.map((s) => (
            <div key={s.word} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <LineIcon name={iconOf(s.word)} size={30} />
              <span style={{ fontSize: 19, lineHeight: 1.35, color: 'var(--ink)' }}>
                <b style={{ color: 'var(--teal)' }}>{chipLabel(s.word)}</b> → {s.how}
              </span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
