import { motion } from 'motion/react';
import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { Rich } from '../Rich';
import { useScriptClear } from '../scriptClear';

const EASE = [0.2, 0.8, 0.2, 1] as const;
const GREY = '#8a919c';

/** a line across the chat naming the day and who is talking, e.g. "Day 1 · Mercer" */
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
/** a box under the chat window: what happened because of the chat (a finding logged, where an answer came from) */
export interface ChatNote {
  title: string;
  text?: string;
  /** red for the one thing to look at on the page, teal otherwise */
  tone?: 'teal' | 'red';
}

export function CopilotChat({ kicker, message, title = 'AI Agent', subtitle = 'Harbor Bridge inspections', items, notebook, after = [] }: CopilotChatProps & { after?: ChatNote[] }) {
  const notesAt = chatSchedule(items).labelsAt + 0.2;
  const panel = useRef<HTMLDivElement>(null);
  // with the script on, the panel stops just above it (measured: a long script is taller)
  const clear = useScriptClear();
  const free = clear === null;
  useLayoutEffect(() => {
    const max = free ? 1.4 : 1.2;
    fitChat(panel.current, max);
    // once the bundled fonts are in, the words may wrap differently: fit again
    let live = true;
    document.fonts?.ready.then(() => live && fitChat(panel.current, max));
    return () => {
      live = false;
    };
  }, [free, clear, items, after.length]);
  return (
    <div className="beat">
      <motion.div ref={panel} className={`beat__panel beat__panel--tall${free ? ' is-free' : ''}`} style={free ? undefined : { bottom: Math.max(96, clear) }} data-testid="chat-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">{kicker}</div>
        <div className="beat__headline">
          “<Rich text={message} />”
        </div>
        <ChatWindow title={title} subtitle={subtitle} items={items} grow />
        {after.length > 0 && (
          // side by side, so a long chat plus its notes still fits the panel
          <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: `repeat(${Math.min(after.length, 2)}, 1fr)`, gap: 'calc(12px * var(--chat-k, 1))', marginTop: 'calc(16px * var(--chat-k, 1))' }}>
            {after.map((n, i) => {
              const red = n.tone === 'red';
              return (
                <motion.div
                  key={n.title}
                  data-note={n.title}
                  style={{ padding: 'calc(10px * var(--chat-k, 1)) calc(16px * var(--chat-k, 1))', borderRadius: 12, border: `2px solid ${red ? 'var(--red)' : 'var(--teal)'}`, background: red ? 'rgba(199, 70, 52, 0.08)' : 'rgba(27, 138, 156, 0.1)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: notesAt + i * 0.45, duration: 0.45, ease: EASE }}
                >
                  <div style={{ fontSize: 'calc(20px * var(--chat-k, 1))', fontWeight: 700, color: red ? 'var(--red)' : 'var(--teal)' }}>{n.title}</div>
                  {n.text && (
                    <div style={{ fontSize: 'calc(19px * var(--chat-k, 1))', color: 'var(--ink)', marginTop: 2 }}>
                      <Rich text={n.text} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
        {notebook && <div className="beat__notebook">notebook · {notebook}</div>}
      </motion.div>
    </div>
  );
}

/**
 * the type grows to fill the tall panel: start large and step down until the chat and its notes fit
 * (a short chat gets big bubbles, a long one stays readable without being cut off)
 */
function fitChat(el: HTMLDivElement | null, max: number) {
  if (!el) return;
  const win = el.querySelector<HTMLElement>('[data-testid="copilot-chat"]');
  const fits = () => el.scrollHeight <= el.clientHeight + 1 && (!win || win.scrollHeight <= win.clientHeight + 1);
  for (let k = max; k >= 0.9; k -= 0.05) {
    el.style.setProperty('--chat-k', k.toFixed(2));
    if (fits()) return;
  }
}

/** the chat window alone (title bar and stacked messages), for panels that show one or more of them */
export function ChatWindow({ title = 'AI Agent', subtitle = 'Harbor Bridge inspections', items, testId = 'copilot-chat', grow = false }: { title?: string; subtitle?: string; items: ChatItem[]; testId?: string; /** fill the rest of a tall panel */ grow?: boolean }) {
  const s = chatSchedule(items);
  let emptyN = 0;
  let labelN = 0;
  return (
    <div style={grow ? { ...windowStyle, flex: '1 1 auto', minHeight: 0 } : windowStyle} data-testid={testId}>
      <div style={titleBar}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--teal)', flex: 'none' }} />
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{title}</span>
        <span style={{ color: 'var(--ink-dim)', marginLeft: 'auto', fontSize: 'calc(15px * var(--chat-k, 1))' }}>{subtitle}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(10px * var(--chat-k, 1))', padding: 'calc(14px * var(--chat-k, 1)) 16px 16px' }}>
        {items.map((it, i) => {
          if (isDivider(it)) return <Divider key={i} text={it.divider} delay={s.at[i]} />;
          const state = it.state ?? 'shown';
          if (state === 'emptying') return <Bubble key={i} m={it} mode="emptying" delay={s.emptyAt + 0.22 * emptyN++} />;
          if (state === 'empty') return <Bubble key={i} m={it} mode="empty" delay={s.labelsAt + 0.35 * labelN++} />;
          return <Bubble key={i} m={it} mode="shown" delay={s.at[i]} typingAt={s.typingAt[i]} />;
        })}
      </div>
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
  padding: 'calc(10px * var(--chat-k, 1)) 16px',
  borderBottom: '1px solid var(--line)',
  fontSize: 'calc(17px * var(--chat-k, 1))',
};

function Divider({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      data-chat="divider"
      style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-dim)', fontSize: 'calc(15px * var(--chat-k, 1))', margin: '2px 0' }}
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
  padding: 'calc(10px * var(--chat-k, 1)) calc(16px * var(--chat-k, 1))',
  fontSize: 'calc(21px * var(--chat-k, 1))',
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
      <div data-chat={m.from} data-state="empty" style={{ ...bubbleShape(m.from), borderStyle: 'dashed', borderColor: GREY, background: 'transparent', minHeight: 'calc(50px * var(--chat-k, 1))', display: 'flex', alignItems: 'center', gap: 12 }}>
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
