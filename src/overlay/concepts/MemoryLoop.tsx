import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { EASE, WidePanel } from './WidePanel';

export interface MemoryLoopProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** 1: the agent loop with memory wired in (deck slide 34); 2: one store, one manager, any harness (slide 33) */
  step: 1 | 2;
  notebook?: string;
}

/** the loop (slide 34); the model is "the language model" on screen */
export const LOOP_STEPS = [
  { name: 'Read', text: 'Load the context card to start the turn.' },
  { name: 'Reason & act', text: 'The language model reasons and calls tools; results return.' },
  { name: 'Write back', text: 'Save messages, tool calls and extracted facts.' },
  { name: 'Summarize', text: 'Compact the thread when it grows too large.' },
];
export const STORE_KINDS = ['Conversational', 'Knowledge base', 'Entity', 'Workflow', 'Summary', 'Tool log'];
/** the stack (slide 33) */
export const STACK = [
  { name: 'Your harness', text: 'LangGraph · Claude Agent SDK · OpenAI Agents SDK · custom Python: the agent loop you already run.' },
  { name: 'Memory manager · oracleagentmemory', text: 'Creates threads, adds messages, extracts memories, searches, assembles context cards.' },
  { name: 'Memory store · Oracle AI Database', text: 'One converged engine: no separate vector database, document store or graph store.' },
];
export const ENGINES = ['Vector search', 'SQL', 'JSON', 'Graph', 'Spatial'];

/** how long the light stays on each step: a walking pace, one step at a time */
const BEAT_MS = 1400;

/**
 * 3.5 · The loop with memory. Click 1: this afternoon's agent loop with the memory store under it; a light
 * walks the four steps in turn and the read and write arrows light when the loop reaches them. Click 2: the
 * three layers that make it work with any harness. One panel across both clicks.
 */
export function MemoryLoop({ kicker, message, step, notebook }: MemoryLoopProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="memory-loop" step={step}>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="loop" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
            <Loop />
          </motion.div>
        ) : (
          <motion.div key="stack" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <Stack />
          </motion.div>
        )}
      </AnimatePresence>
    </WidePanel>
  );
}

const COLS = '1fr 46px 1fr 46px 1fr 46px 1fr';

function Loop() {
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    // start once the steps are in, then walk round and round
    const start = setTimeout(() => setLit(0), 2000);
    const tick = setInterval(() => setLit((l) => (l < 0 ? l : (l + 1) % LOOP_STEPS.length)), BEAT_MS);
    return () => {
      clearTimeout(start);
      clearInterval(tick);
    };
  }, []);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: COLS, marginTop: 8, marginBottom: 12 }}>
        <span style={{ gridColumn: 7, justifySelf: 'center', padding: '6px 18px', borderRadius: 999, border: '1.5px solid var(--line)', color: 'var(--ink-dim)', fontSize: 18 }}>↻ the loop repeats every turn</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'stretch' }}>
        {LOOP_STEPS.flatMap((s, i) => {
          const on = lit === i;
          const box = (
            <motion.div
              key={s.name}
              data-loop-step={s.name}
              data-lit={on}
              style={{
                padding: '22px 22px 24px',
                borderRadius: 14,
                borderWidth: 2,
                borderStyle: i === 3 ? 'dashed' : 'solid',
                minHeight: 190,
                transition: 'border-color 0.4s, background-color 0.4s',
                borderColor: on ? 'var(--teal)' : 'var(--line)',
                backgroundColor: on ? 'rgba(27, 138, 156, 0.16)' : 'rgba(127, 127, 127, 0.08)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.3, duration: 0.45, ease: EASE }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
                <span style={{ color: 'var(--teal)', marginRight: 12 }}>{i + 1}</span>
                {s.name}
              </div>
              <div style={{ fontSize: 21, lineHeight: 1.4, color: 'var(--ink)' }}>{s.text}</div>
            </motion.div>
          );
          return i < LOOP_STEPS.length - 1
            ? [box, <span key={`a${i}`} style={{ alignSelf: 'center', justifySelf: 'center', fontSize: 30, color: 'var(--ink-dim)' }}>→</span>]
            : [box];
        })}
      </div>
      {/* read comes up into step 1, write goes down from step 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: COLS, height: 96 }}>
        <Flow col={1} up label="read" on={lit === 0} />
        <Flow col={5} label="write" on={lit === 2} />
      </div>
      <motion.div
        data-store
        style={{ padding: '20px 26px', borderRadius: 14, border: '2px solid var(--teal)', background: 'rgba(27, 138, 156, 0.1)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.45, ease: EASE }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)' }}>
          Oracle AI Database <span style={{ color: 'var(--ink-dim)', fontWeight: 500, fontSize: 21 }}>· the memory store</span>
        </div>
        <div style={{ fontSize: 21, color: 'var(--ink)', marginTop: 8 }}>{STORE_KINDS.join('  ·  ')}</div>
      </motion.div>
    </div>
  );
}

function Flow({ col, up = false, label, on }: { col: number; up?: boolean; label: string; on: boolean }) {
  const colour = on ? 'var(--teal)' : 'var(--ink-dim)';
  return (
    <div data-flow={label} data-lit={on} style={{ gridColumn: col, justifySelf: 'center', display: 'flex', alignItems: 'center', gap: 14, transition: 'opacity 0.4s', opacity: on ? 1 : 0.55 }}>
      <svg width={30} height={90} viewBox="0 0 30 90" aria-hidden>
        <line x1={15} y1={up ? 86 : 4} x2={15} y2={up ? 14 : 76} stroke={colour} strokeWidth={5} strokeLinecap="round" />
        <path d={up ? 'M3 22 L15 6 L27 22' : 'M3 68 L15 84 L27 68'} fill="none" stroke={colour} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: 22, fontWeight: 700, color: colour }}>{label}</span>
    </div>
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
