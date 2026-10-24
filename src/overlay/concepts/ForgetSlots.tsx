import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

export interface ForgetSlot {
  /** what the note is, e.g. "Her advice" */
  title: string;
  /** what Mercer said, shown while the note is filled */
  text: string;
  /** what Vance runs into when the note is gone (deck slide 6) */
  missing: string;
}

export interface ForgetSlotsProps {
  kicker: string;
  /** the one line the presenter lands */
  message: string;
  /**
   * filled: Day 1, the notes appear one by one (2.1a)
   * emptying: the chat closes, the filled notes fade to empty outlines (2.1b)
   * missing: Day 2, empty outlines, each names what is missing (2.1c)
   */
  state: 'filled' | 'emptying' | 'missing';
  slots: ForgetSlot[];
  /** chat lines above the notes */
  chat?: { who: string; text: string; tone?: 'teal' | 'grey' }[];
  /** small line under the notes */
  footnote?: string;
  notebook?: string;
}

const GREY = '#8a919c';
/** when the notes start to empty on 2.1b, after the panel has come in */
const EMPTY_AT = 1.1;

const slotBase: CSSProperties = {
  position: 'relative',
  minHeight: 78,
  padding: '14px 18px',
  borderRadius: 10,
  borderWidth: 2,
  borderStyle: 'solid',
  boxSizing: 'border-box',
};

/**
 * 2.1 · The agent that forgets: the three notes Mercer leaves with the copilot on Day 1 (what she found,
 * her advice, the follow-up), the same three going empty when the chat closes, and on Day 2 the empty
 * outlines naming what Vance is missing. 2.14 fills the same three slots back in, with memory.
 */
export function ForgetSlots({ kicker, message, state, slots, chat = [], footnote, notebook }: ForgetSlotsProps) {
  const chatDelay = (i: number) => 0.25 + i * 0.35;
  const slotDelay = (i: number) => 0.35 + chat.length * 0.35 + i * 0.3;
  return (
    <div className="beat">
      <motion.div className="beat__panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">{kicker}</div>
        <div className="beat__headline">“{message}”</div>

        {chat.length > 0 && (
          <div className="beat-chat" style={{ marginBottom: 16 }}>
            {chat.map((l, i) => (
              <motion.div
                key={i}
                className={`beat-chat__line tone-${l.tone ?? 'grey'}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chatDelay(i), duration: 0.45, ease: EASE }}
                style={{ padding: '10px 16px' }}
              >
                <div className="beat-chat__who mono">{l.who}</div>
                <div className="beat-chat__text" style={{ fontSize: 22 }}>{l.text}</div>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} data-testid="forget-slots" data-state={state}>
          {slots.map((s, i) => (
            <SlotView key={i} slot={s} state={state} delay={slotDelay(i)} />
          ))}
        </div>

        {footnote && (
          <motion.div
            className="mono"
            style={{ marginTop: 14, fontSize: 16, color: 'var(--ink-dim)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: state === 'emptying' ? EMPTY_AT + 0.9 : slotDelay(slots.length), duration: 0.5 }}
          >
            {footnote}
          </motion.div>
        )}
        {notebook && <div className="beat__notebook mono">notebook · {notebook}</div>}
      </motion.div>
    </div>
  );
}

function SlotView({ slot, state, delay }: { slot: ForgetSlot; state: ForgetSlotsProps['state']; delay: number }) {
  if (state === 'missing') {
    return (
      <motion.div
        data-slot="missing"
        style={{ ...slotBase, borderStyle: 'dashed', borderColor: GREY, background: 'transparent', display: 'flex', alignItems: 'center', gap: 14 }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.4 }}
      >
        <motion.span
          className="mono"
          style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', border: `2px solid ${GREY}`, color: GREY, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay, duration: 0.4 }}
        >
          ?
        </motion.span>
        <motion.span
          style={{ fontSize: 24, color: 'var(--ink)', fontWeight: 600 }}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.15, duration: 0.45, ease: EASE }}
        >
          {slot.missing}
        </motion.span>
      </motion.div>
    );
  }

  const emptying = state === 'emptying';
  // filled notes come in one by one; on 2.1b they start filled and drain to an empty outline
  return (
    <motion.div
      data-slot={emptying ? 'emptying' : 'filled'}
      style={{ ...slotBase, borderStyle: emptying ? 'dashed' : 'solid' }}
      initial={emptying ? { opacity: 1, borderColor: 'rgba(27, 138, 156, 1)', backgroundColor: 'rgba(27, 138, 156, 0.14)' } : { opacity: 0, y: 8, borderColor: 'rgba(27, 138, 156, 1)', backgroundColor: 'rgba(27, 138, 156, 0.14)' }}
      animate={emptying ? { opacity: 1, borderColor: 'rgba(138, 145, 156, 0.9)', backgroundColor: 'rgba(27, 138, 156, 0)' } : { opacity: 1, y: 0 }}
      transition={emptying ? { delay: EMPTY_AT + delay * 0.4, duration: 0.9, ease: EASE } : { delay, duration: 0.45, ease: EASE }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: emptying ? 0 : 1 }}
        transition={emptying ? { delay: EMPTY_AT + delay * 0.4, duration: 0.7, ease: EASE } : { duration: 0 }}
      >
        <div style={{ fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600, marginBottom: 4 }}>{slot.title}</div>
        <div style={{ fontSize: 24, color: 'var(--ink)' }}>{slot.text}</div>
      </motion.div>
    </motion.div>
  );
}
