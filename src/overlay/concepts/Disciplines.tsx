import { motion } from 'motion/react';
import { EASE, WidePanel } from './WidePanel';

export interface DisciplinesProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  notebook?: string;
}

/** the three disciplines (Lab 3 deck, slides 24 and 25), in the order the deck numbers them */
export const DISCIPLINES = [
  { name: 'Memory engineering', what: 'What the agent retains', text: 'How information is stored, indexed and retrieved across time.' },
  { name: 'Context engineering', what: 'What the agent perceives', text: 'Which memories reach the model for this question: retrieve, filter, compress.' },
  { name: 'Harness engineering', what: 'How the agent runs reliably', text: 'Read and write memory on every turn, not only when the model remembers.' },
];

/**
 * 3.4 · Three disciplines: three numbered cards come in one after another, as on the deck's slide 24,
 * joined by the dotted path the deck draws under them; the headline is slide 26's one job.
 */
export function Disciplines({ kicker, message, notebook }: DisciplinesProps) {
  const at = (i: number) => 0.4 + i * 0.7;
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="disciplines">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 34 }}>
        {DISCIPLINES.map((d, i) => (
          <motion.div
            key={d.name}
            data-discipline={d.name}
            style={{ position: 'relative', padding: '52px 28px 30px', borderRadius: 16, background: 'rgba(27, 138, 156, 0.1)', border: '2px solid var(--teal)', minHeight: 300 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: at(i), duration: 0.5, ease: EASE }}
          >
            <span
              style={{ position: 'absolute', top: -30, left: 28, width: 60, height: 60, borderRadius: '50%', background: 'var(--teal)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}
            >
              {i + 1}
            </span>
            <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>{d.name}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--teal)', marginBottom: 18 }}>{d.what}</div>
            <div style={{ fontSize: 22, lineHeight: 1.45, color: 'var(--ink)' }}>{d.text}</div>
          </motion.div>
        ))}
      </div>
      {/* the deck's dotted path from one discipline to the next */}
      <svg viewBox="0 0 1400 70" width="100%" style={{ display: 'block', marginTop: 6 }} aria-hidden>
        {[0, 1].map((i) => (
          <motion.path
            key={i}
            d={`M${230 + i * 470} 18 C${360 + i * 470} 66 ${560 + i * 470} 66 ${690 + i * 470} 18`}
            fill="none"
            stroke="var(--teal)"
            strokeWidth={2.5}
            strokeDasharray="3 8"
            strokeLinecap="round"
            // fade, not draw: drawing the path in would override the dots
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: at(i + 1) - 0.2, duration: 0.6, ease: EASE }}
          />
        ))}
      </svg>
    </WidePanel>
  );
}
