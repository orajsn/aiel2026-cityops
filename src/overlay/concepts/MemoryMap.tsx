import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';

export interface MemoryMapProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** how far the map is built, 1 to 5, the same order as the Lab 3 deck's slides 19 to 23 */
  step: 1 | 2 | 3 | 4 | 5;
  notebook?: string;
}

/** short-term memory is grey (it does not last), long-term and shared memory teal (it is kept) */
const GREY = { fill: 'rgba(138, 145, 156, 0.16)', stroke: '#8a919c' };
const TEAL = { fill: 'rgba(27, 138, 156, 0.14)', stroke: 'var(--teal)' };
const LINE = '#8a919c';

/**
 * Classification of agent memory, built in five clicks exactly as the Lab 3 deck builds it (slides 19 to 23):
 * 1 short-term memory and the runtime layer, 2 long-term memory, 3 procedural, episodic and semantic (with
 * the Harbor Bridge examples from slide 10), 4 the execution, experience and knowledge layers,
 * 5 coordination and shared memory. The pages share one panel (overlayGroup), so each click only adds
 * its part; whatever is already there stays still.
 */
export function MemoryMap({ kicker, message, step, notebook }: MemoryMapProps) {
  // a part from an earlier click shows at once (when the map is opened mid-way), the new part draws in
  const t = (s: number, order: number) => (s < step ? 0 : 0.3 + order * 0.16);
  // every part gets its own key from its place in the source (the same on every click), so React keeps it
  let n = 0;
  const P = (s: number, order: number, children: ReactNode) =>
    s <= step ? (
      <motion.g key={`p${n++}`} data-step={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t(s, order), duration: 0.5, ease: EASE }}>
        {children}
      </motion.g>
    ) : (n++, null);
  const L = (s: number, order: number, d: string) =>
    s <= step ? (
      <motion.path
        key={`l${s}-${order}-${d}`}
        d={d}
        fill="none"
        stroke={LINE}
        strokeWidth={2}
        markerEnd="url(#mm-arrow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: t(s, order), duration: 0.6, ease: EASE }}
      />
    ) : null;

  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="memory-map" step={step}>
        {/* the map fills the body, as large as its shape allows, centred */}
        <svg viewBox="0 0 1400 600" width="100%" height="100%" style={{ flex: 1, minHeight: 360, display: 'block', overflow: 'visible', fontFamily: 'inherit' }} role="img" aria-label="Classification of agent memory">
          <defs>
            <marker id="mm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke={LINE} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          {/* connectors first, so the boxes sit on top of them */}
          {L(1, 1, 'M190 285 C222 285 222 75 246 75')}
          {L(1, 3, 'M500 75 H530 V52 H556')}
          {L(1, 3, 'M500 75 H530 V108 H556')}
          {L(1, 5, 'M810 52 H845 V72 H876')}
          {L(2, 0, 'M190 297 H246')}
          {L(3, 0, 'M500 297 H530 V201 H556')}
          {L(3, 1, 'M500 297 H556')}
          {L(3, 2, 'M500 297 H530 V393 H556')}
          {L(4, 0, 'M810 201 H845 V206 H876')}
          {L(4, 1, 'M810 297 H845 V354 H876')}
          {L(4, 2, 'M810 393 H845 V519 H876')}
          {L(5, 0, 'M190 309 C222 309 222 515 246 515')}
          {L(5, 1, 'M500 515 H556')}

          {/* click 1: agent memory, short-term memory, working memory and semantic cache, the runtime layer */}
          {P(1, 0, <Box x={20} y={262} w={170} h={70} fill="var(--teal)" stroke="var(--teal)" lines={['Agent memory']} size={22} ink="#ffffff" />)}
          {P(1, 1, <Box x={250} y={40} w={250} h={70} {...GREY} lines={['Short-term', 'memory (STM)']} size={22} bold />)}
          {P(1, 2, <Box x={560} y={30} w={250} h={44} {...GREY} lines={['Working memory']} size={19} />)}
          {P(1, 2, <Box x={560} y={86} w={250} h={44} {...GREY} lines={['Semantic cache']} size={19} />)}
          {P(1, 4, <Layer x={880} y={8} h={128} name="Runtime layer" color={GREY.stroke} items={['LLM context window', 'Session memory']} first={44} gap={44} itemH={36} tone={GREY} />)}

          {/* click 2: long-term memory */}
          {P(2, 0, <Box x={250} y={262} w={250} h={70} {...TEAL} lines={['Long-term', 'memory (LTM)']} size={22} bold />)}

          {/* click 3: the three kinds, each with its Harbor Bridge example (deck slide 10) */}
          {P(3, 0, <Box x={560} y={166} w={250} h={70} {...TEAL} lines={['Procedural']} size={20} note="Approved inspection guidance" />)}
          {P(3, 1, <Box x={560} y={262} w={250} h={70} {...TEAL} lines={['Episodic']} size={20} note="What Mercer saw and advised" />)}
          {P(3, 2, <Box x={560} y={358} w={250} h={70} {...TEAL} lines={['Semantic']} size={20} note="Harbor Bridge and the right pier" />)}

          {/* click 4: the layers they live in */}
          {P(4, 0, <Layer x={880} y={148} h={116} name="Execution layer" color={TEAL.stroke} items={['Workflow', 'Toolbox']} first={36} gap={40} itemH={34} tone={TEAL} />)}
          {P(4, 1, <Layer x={880} y={276} h={156} name="Experience layer" color={TEAL.stroke} items={['Tool logs', 'Conversations', 'Summaries']} first={36} gap={40} itemH={34} tone={TEAL} />)}
          {P(4, 2, <Layer x={880} y={444} h={150} name="Knowledge layer" color={TEAL.stroke} items={['Knowledge base', 'Entity memory', 'Persona memory']} first={36} gap={40} itemH={34} tone={TEAL} />)}

          {/* click 5: coordination and shared memory */}
          {P(5, 0, <Box x={250} y={480} w={250} h={70} {...TEAL} lines={['Coordination']} size={22} bold />)}
          {P(5, 1, <Box x={560} y={490} w={250} h={50} {...TEAL} lines={['Shared memory']} size={20} />)}
        </svg>

    </WidePanel>
  );
}

function Box({ x, y, w, h, fill, stroke, lines, size, bold = false, ink = 'var(--ink)', note }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; lines: string[]; size: number; bold?: boolean; ink?: string; note?: string }) {
  const lh = size * 1.18;
  const block = lines.length * lh + (note ? 22 : 0);
  const top = y + (h - block) / 2 + size * 0.86;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={top + i * lh} textAnchor="middle" fontSize={size} fontWeight={bold ? 700 : 600} fill={ink}>
          {l}
        </text>
      ))}
      {note && (
        <text x={x + w / 2} y={top + lines.length * lh + 2} textAnchor="middle" fontSize={15} fill="var(--ink-dim)">
          {note}
        </text>
      )}
    </g>
  );
}

function Layer({ x, y, h, name, color, items, first, gap, itemH, tone }: { x: number; y: number; h: number; name: string; color: string; items: string[]; first: number; gap: number; itemH: number; tone: { fill: string; stroke: string } }) {
  return (
    <g>
      <rect x={x} y={y} width={500} height={h} rx={14} fill="none" stroke={color} strokeWidth={2} strokeDasharray="7 6" />
      <text x={x + 18} y={y + 24} fontSize={15} fontWeight={600} letterSpacing="0.08em" fill={color === GREY.stroke ? 'var(--ink-dim)' : 'var(--teal)'}>
        {name.toUpperCase()}
      </text>
      {items.map((it, i) => (
        <g key={it}>
          <rect x={x + 20} y={y + first + i * gap} width={460} height={itemH} rx={9} fill={tone.fill} stroke={tone.stroke} strokeWidth={1.5} />
          <text x={x + 250} y={y + first + i * gap + itemH / 2 + 6} textAnchor="middle" fontSize={18} fontWeight={500} fill="var(--ink)">
            {it}
          </text>
        </g>
      ))}
    </g>
  );
}
