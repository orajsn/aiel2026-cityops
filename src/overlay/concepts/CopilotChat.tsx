import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { Rich } from '../Rich';

const EASE = [0.2, 0.8, 0.2, 1] as const;
const GREY = '#8a919c';

/** a line across the chat naming the day and who is talking, e.g. "Day 1 · Evelyn_H_Mercer" */
export interface ChatDivider {
  divider: string;
}

export interface ChatMessage {
  /** person: the inspector, right-aligned like your own messages; copilot: the AI agent, left-aligned */
  from: 'person' | 'copilot';
  text: string;
  /**
   * shown (default): the message comes in (the copilot "types" first)
   * emptying: it is there, then drains to an empty outline (the chat closes, 2.1b)
   * empty: only the outline is left; `label` names what is missing (2.1c)
   */
  state?: 'shown' | 'emptying' | 'empty';
  label?: string;
}

export type ChatItem = ChatDivider | ChatMessage;

export interface CopilotChatProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** the chat window's title bar */
  title?: string;
  subtitle?: string;
  items: ChatItem[];
  notebook?: string;
}

const isDivider = (i: ChatItem): i is ChatDivider => 'divider' in i;

/** seconds: one item every STEP, the copilot types for TYPING before its words show */
const STEP = 0.45;
const TYPING = 0.8;
const START = 0.35;

/** when each item comes in, when emptying starts and when the missing labels show */
export function chatSchedule(items: ChatItem[]) {
  let t = START;
  const at: number[] = [];
  const typingAt: (number | null)[] = [];
  for (const it of items) {
    const already = !isDivider(it) && (it.state === 'emptying' || it.state === 'empty');
    if (already) {
      at.push(0);
      typingAt.push(null);
      continue;
    }
    if (!isDivider(it) && it.from === 'copilot') {
      typingAt.push(t);
      t += TYPING;
    } else typingAt.push(null);
    at.push(t);
    t += STEP;
  }
  // after everything new has come in: drain the closing chat, then name what is missing
  return { at, typingAt, emptyAt: START + 0.8, labelsAt: t + 0.2 };
}

/**
 * The copilot's chat window, like any chat app: the inspector's messages on the right, the AI agent's
 * answers on the left, stacking downwards, with a line between days. Used for 2.1 (the agent that
 * forgets) and meant for every page where someone talks to the copilot.
 */
export function CopilotChat({ kicker, message, title = 'Copilot', subtitle = 'Harbor Bridge inspections', items, notebook }: CopilotChatProps) {
  const s = chatSchedule(items);
  let emptyN = 0;
  let labelN = 0;
  return (
    <div className="beat">
      <motion.div className="beat__panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">{kicker}</div>
        <div className="beat__headline">
          “<Rich text={message} />”
        </div>

        <div style={windowStyle} data-testid="copilot-chat">
          <div style={titleBar}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal)', flex: 'none' }} />
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{title}</span>
            <span style={{ color: 'var(--ink-dim)', marginLeft: 'auto', fontSize: 15 }}>{subtitle}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px 16px' }}>
            {items.map((it, i) => {
              if (isDivider(it)) return <Divider key={i} text={it.divider} delay={s.at[i]} />;
              const state = it.state ?? 'shown';
              if (state === 'emptying') return <Bubble key={i} m={it} mode="emptying" delay={s.emptyAt + 0.22 * emptyN++} />;
              if (state === 'empty') return <Bubble key={i} m={it} mode="empty" delay={s.labelsAt + 0.35 * labelN++} />;
              return <Bubble key={i} m={it} mode="shown" delay={s.at[i]} typingAt={s.typingAt[i]} />;
            })}
          </div>
        </div>

        {notebook && <div className="beat__notebook">notebook · {notebook}</div>}
      </motion.div>
    </div>
  );
}

const windowStyle: CSSProperties = {
  borderRadius: 14,
  border: '1px solid var(--line)',
  background: 'rgba(127, 127, 127, 0.06)',
  overflow: 'hidden',
};

const titleBar: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 16px',
  borderBottom: '1px solid var(--line)',
  fontSize: 17,
};

function Divider({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      data-chat="divider"
      style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-dim)', fontSize: 15, margin: '2px 0' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span>{text}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </motion.div>
  );
}

const bubbleShape = (from: ChatMessage['from']): CSSProperties => ({
  alignSelf: from === 'person' ? 'flex-end' : 'flex-start',
  maxWidth: '78%',
  minWidth: 160,
  padding: '10px 16px',
  fontSize: 21,
  lineHeight: 1.35,
  borderRadius: from === 'person' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  borderWidth: 2,
  borderStyle: 'solid',
  boxSizing: 'border-box',
});

const PERSON_BG = 'rgba(27, 138, 156, 1)';
const COPILOT_BG = 'rgba(138, 145, 156, 0.18)';

function Bubble({ m, mode, delay, typingAt = null }: { m: ChatMessage; mode: 'shown' | 'emptying' | 'empty'; delay: number; typingAt?: number | null }) {
  const person = m.from === 'person';
  const fill = person ? PERSON_BG : COPILOT_BG;
  const ink = person ? '#ffffff' : 'var(--ink)';

  if (mode === 'empty') {
    return (
      <div data-chat={m.from} data-state="empty" style={{ ...bubbleShape(m.from), borderStyle: 'dashed', borderColor: GREY, background: 'transparent', minHeight: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
        {m.label && (
          <>
            <motion.span
              style={{ flex: 'none', width: 26, height: 26, borderRadius: '50%', border: `2px solid ${GREY}`, color: GREY, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay, duration: 0.4 }}
            >
              ?
            </motion.span>
            <motion.span style={{ color: 'var(--ink)', fontWeight: 600 }} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.12, duration: 0.45, ease: EASE }}>
              {m.label}
            </motion.span>
          </>
        )}
      </div>
    );
  }

  if (mode === 'emptying') {
    // there when the page opens, then the words go and only a dashed outline is left
    return (
      <motion.div
        data-chat={m.from}
        data-state="emptying"
        style={{ ...bubbleShape(m.from), borderStyle: 'dashed' }}
        initial={{ backgroundColor: fill, borderColor: person ? PERSON_BG : 'rgba(138, 145, 156, 0)' }}
        animate={{ backgroundColor: 'rgba(0, 0, 0, 0)', borderColor: GREY }}
        transition={{ delay, duration: 0.9, ease: EASE }}
      >
        <motion.div style={{ color: ink }} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay, duration: 0.6, ease: EASE }}>
          <Rich text={m.text} />
        </motion.div>
      </motion.div>
    );
  }

  // every message keeps its place from the start, so the window never jumps; the copilot shows its
  // typing dots inside its own bubble first, then its words
  const typing = typingAt !== null;
  return (
    <motion.div
      data-chat={m.from}
      data-state="shown"
      style={{ ...bubbleShape(m.from), background: fill, borderColor: 'transparent', color: ink, position: 'relative' }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: typing ? typingAt : delay, duration: 0.4, ease: EASE }}
    >
      <motion.div initial={{ opacity: typing ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.35 }}>
        <Rich text={m.text} />
      </motion.div>
      {typing && <Typing until={delay} />}
    </motion.div>
  );
}

/** the copilot's "typing" dots, over its own bubble until its words come in at `until` */
function Typing({ until }: { until: number }) {
  return (
    <motion.div
      aria-hidden
      style={{ position: 'absolute', left: 16, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 6 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: until - 0.1, duration: 0.2 }}
    >
      {[0, 1, 2].map((d) => (
        <motion.span
          key={d}
          style={{ width: 8, height: 8, borderRadius: '50%', background: GREY }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }}
        />
      ))}
    </motion.div>
  );
}
