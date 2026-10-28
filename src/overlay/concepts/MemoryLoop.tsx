import { motion } from 'motion/react';
import { EASE, WidePanel } from './WidePanel';

export interface MemoryLoopProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  notebook?: string;
}

/** the stack (Lab 3 deck, slide 33) */
export const STACK = [
  { name: 'Your harness', text: 'LangGraph · Claude Agent SDK · OpenAI Agents SDK · custom Python: the agent loop you already run.' },
  { name: 'Memory manager · oracleagentmemory', text: 'Creates threads, adds messages, extracts memories, searches, assembles context cards.' },
  { name: 'Memory store · Oracle AI Database', text: 'One converged engine: no separate vector database, document store or graph store.' },
];
export const ENGINES = ['Vector search', 'SQL', 'JSON', 'Graph', 'Spatial'];

/**
 * 3.5b · One store, any harness: the three layers that let memory work with the loop the audience already runs.
 * The loop itself (read, act, write, summarize) is drawn on the harness page (Engineering.tsx, 3.4c).
 */
export function MemoryLoop({ kicker, message, notebook }: MemoryLoopProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="memory-loop">
      <Stack />
    </WidePanel>
  );
}

function Stack() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 10 }}>
      {STACK.map((s, i) => (
        <div key={s.name}>
          <motion.div
            data-stack={s.name}
            style={{
              padding: '22px 28px',
              borderRadius: 14,
              border: `2px solid ${i === 2 ? 'var(--teal)' : 'var(--line)'}`,
              background: i === 2 ? 'rgba(27, 138, 156, 0.1)' : 'rgba(127, 127, 127, 0.08)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.4, duration: 0.45, ease: EASE }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: i === 2 ? 'var(--teal)' : 'var(--ink)', marginBottom: 8 }}>{s.name}</div>
            <div style={{ fontSize: 21, lineHeight: 1.4, color: 'var(--ink)' }}>{s.text}</div>
            {i === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ENGINES.length}, 1fr)`, gap: 14, marginTop: 16 }}>
                {ENGINES.map((e) => (
                  <span key={e} style={{ padding: '12px 0', textAlign: 'center', borderRadius: 10, background: 'rgba(27, 138, 156, 0.16)', fontSize: 21, fontWeight: 600, color: 'var(--ink)' }}>
                    {e}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
          {i < STACK.length - 1 && (
            <motion.div style={{ textAlign: 'center', fontSize: 30, color: 'var(--ink-dim)', lineHeight: '46px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.4 }}>
              ↓
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
