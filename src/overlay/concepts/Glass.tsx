import { AnimatePresence, motion } from 'motion/react';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon, type IconName } from './icons';

export interface GlassProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** 1: the glass fills with what goes into the context window; 2: the four ways that goes wrong */
  step: 1 | 2;
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
