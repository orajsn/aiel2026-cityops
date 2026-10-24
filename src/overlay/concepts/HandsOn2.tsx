import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Rich } from '../Rich';
import { SidePanel, type HandsOnProps } from './HandsOn';
import { EASE } from './WidePanel';

/**
 * Lab 3 pages 21 to 23, the notebook's Parts 5 and 6, still in the Ops room (owner, 25 Oct; sketches agreed in
 * chat): private doors and the shared hall, the copilot turn's eight steps, the context card.
 */

const TEAL_TINT = 'rgba(27, 138, 156, 0.12)';
const GREY_TINT = 'rgba(127, 127, 127, 0.1)';

/* ---------- page 21 · Private doors, shared hall ---------- */

export function DoorsAndHall({ kicker, message, notebook }: HandsOnProps) {
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="doors-and-hall">
      <motion.div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 19, color: 'var(--ink)', marginBottom: 16 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Rich text="**Three keys:**" />
        {['user_id', 'agent_id', 'thread_id'].map((k) => (
          <span key={k} className="code" data-key={k} style={{ padding: '4px 12px', borderRadius: 8, background: TEAL_TINT, color: 'var(--teal)', fontWeight: 700, fontSize: 18 }}>
            {k}
          </span>
        ))}
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <motion.div data-room="private" style={{ padding: '18px 20px', borderRadius: 14, background: GREY_TINT, border: '2px solid var(--line)', position: 'relative' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.45, ease: EASE }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>Mercer’s private room</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', margin: '12px 0' }}>“swap shifts Tuesday”</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink-dim)' }}>🔒 door locked</div>
          {/* Vance's search hits her door and bounces off: the one red thing on the page */}
          <motion.div style={{ position: 'absolute', right: 14, bottom: 14, fontSize: 18, fontWeight: 700, color: 'var(--red)' }} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0, duration: 0.4 }}>
            ✕ Vance bounces off
          </motion.div>
        </motion.div>
        <motion.div data-room="hall" style={{ padding: '18px 20px', borderRadius: 14, background: TEAL_TINT, border: '2px solid var(--teal)' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.45, ease: EASE }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal)' }}>Shared hall</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', margin: '12px 0' }}>Mercer’s guideline for Harbor Bridge</div>
          <motion.div style={{ fontSize: 18, fontWeight: 700, color: 'var(--teal)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.4 }}>
            ✓ Vance finds it
          </motion.div>
        </motion.div>
      </div>
      <motion.div data-result style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 20, color: 'var(--ink)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.0, duration: 0.45 }}>
        Vance’s search:
        <span style={{ padding: '4px 12px', borderRadius: 8, background: GREY_TINT, fontWeight: 700 }}>her private memories 0</span>
        <span style={{ padding: '4px 12px', borderRadius: 8, background: TEAL_TINT, color: 'var(--teal)', fontWeight: 700 }}>shared hall 1</span>
      </motion.div>
    </SidePanel>
  );
}

/* ---------- pages 22 and 23 · The copilot turn, then the context card ---------- */

/** one copilot turn (storyline doc, Lab 3 research tab), said plainly */
export const TURN_STEPS = [
  'Open Vance’s own thread',
  'Read the bridge’s record',
  'Build the context card',
  'Search the shared memory',
  'Find similar findings',
  'Ask the language model',
  'Save both messages',
  'Extract new memories',
];
/** the context card's four blocks (Part 6) */
export const CARD_BLOCKS = [
  { tag: 'summary', text: 'what this conversation is about' },
  { tag: 'topics', text: 'what has come up so far' },
  { tag: 'relevant_information', text: 'the memories and findings that match' },
  { tag: 'recent_messages', text: 'the last few turns of the chat' },
];

export interface CopilotTurnProps extends HandsOnProps {
  /** 1: the eight steps, a light walking them; 2: the context card it builds */
  step: 1 | 2;
}

export function CopilotTurn({ kicker, message, notebook, step }: CopilotTurnProps) {
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="copilot-turn" step={step}>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="steps" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <Steps />
          </motion.div>
        ) : (
          <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <Card />
          </motion.div>
        )}
      </AnimatePresence>
    </SidePanel>
  );
}

function Steps() {
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    // a light walks the steps at a walking pace, one at a time, then round again
    const start = setTimeout(() => setLit(0), 1800);
    const tick = setInterval(() => setLit((l) => (l < 0 ? l : (l + 1) % TURN_STEPS.length)), 1100);
    return () => {
      clearTimeout(start);
      clearInterval(tick);
    };
  }, []);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: 'repeat(4, auto)', gap: 12, marginTop: 6 }}>
      {TURN_STEPS.map((s, i) => {
        const on = lit === i;
        return (
          <motion.div
            key={s}
            data-turn-step={i + 1}
            data-lit={on}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 12,
              border: `2px solid ${on ? 'var(--teal)' : 'var(--line)'}`,
              background: on ? 'rgba(27, 138, 156, 0.18)' : GREY_TINT,
              transition: 'border-color 0.35s, background-color 0.35s',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: EASE }}
          >
            <span style={{ flex: 'none', width: 34, height: 34, borderRadius: '50%', background: on ? 'var(--teal)' : 'rgba(27, 138, 156, 0.2)', color: on ? '#ffffff' : 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17 }}>{i + 1}</span>
            <span style={{ fontSize: 20, fontWeight: on ? 700 : 500, color: 'var(--ink)' }}>{s}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function Card() {
  return (
    <div data-card style={{ padding: 16, borderRadius: 16, border: '2px solid var(--teal)', background: TEAL_TINT, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
      {CARD_BLOCKS.map((b, i) => (
        <motion.div key={b.tag} data-block={b.tag} style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(27, 138, 156, 0.16)' }} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.35, duration: 0.45, ease: EASE }}>
          <div className="code" style={{ fontSize: 19, fontWeight: 700, color: 'var(--teal)' }}>{`<${b.tag}>`}</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', marginTop: 4 }}>{b.text}</div>
        </motion.div>
      ))}
    </div>
  );
}
