import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { Rich } from '../Rich';
import { ChatWindow, type ChatItem } from './CopilotChat';
import { EASE, WidePanel } from './WidePanel';
import { CURATION } from './Glass';
import { LineIcon, type IconName } from './icons';
import { Fill } from './Fill';

/**
 * Lab 3 pages 26 to 29, the ending (owner, 25 Oct; sketches agreed in chat): with and without memory, the four
 * failures solved, where both labs meet, takeaways and the quiz.
 */

export interface EndingProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  notebook?: string;
}

const TEAL_TINT = 'rgba(27, 138, 156, 0.12)';

/* ---------- page 26 · With and without memory ---------- */

export interface WithWithoutProps extends EndingProps {
  question: string;
  without: string;
  withMemory: string;
}

/** the deck's comparison rows (slide 14 and the storyline doc's four-row comparison), said plainly */
export const COMPARE_ROWS = ['knows it is the same bridge', 'cites the real finding', 'gives a specific action', 'never sees private chats'];
/** each row's icon, in the same order (owner, 26 Oct: an icon in place of the tick) */
const ROW_ICONS: IconName[] = ['pin', 'quote', 'wrench', 'lock'];

export function WithWithout({ kicker, message, notebook, question, without, withMemory }: WithWithoutProps) {
  const chat = (answer: string): ChatItem[] => [
    { from: 'person', text: question },
    { from: 'copilot', text: answer },
  ];
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="with-without">
      <Fill justify="space-evenly" gap={24}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 8 }}>
          <div data-side="without">
            <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--ink-dim)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Without memory</div>
            {/* the chat window is laid out for a side panel: shown larger here, where the page has the room */}
            <div style={{ zoom: 1.35 }}>
              <ChatWindow items={chat(without)} testId="chat-without" />
            </div>
          </div>
          <div data-side="with">
            <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--teal)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>With memory</div>
            <div style={{ zoom: 1.35 }}>
              <ChatWindow items={chat(withMemory)} testId="chat-with" />
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {COMPARE_ROWS.map((r, i) => (
            <motion.div key={r} data-row={r} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '24px 26px', borderRadius: 14, background: TEAL_TINT, border: '2px solid var(--teal)', fontSize: 27, color: 'var(--ink)' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 + i * 0.25, duration: 0.45, ease: EASE }}>
              <LineIcon name={ROW_ICONS[i]} size={44} />
              {r}
            </motion.div>
          ))}
        </div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- page 27 · The four failures, solved ---------- */

/** the glass page's four problems (3.3b), each with how memory solves it in the bridge story */
export const SOLVED = [
  { word: 'Volume', text: 'The summary keeps the window from filling up.' },
  { word: 'Relevance', text: 'Only Mercer’s finding comes in, not the search noise.' },
  { word: 'Accuracy', text: 'The 25% is kept as a fact of its own, not lost in a summary.' },
  { word: 'Timing', text: 'Her finding is fetched again when Vance asks.' },
];

export function FailuresSolved({ kicker, message, notebook }: EndingProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="failures-solved">
      <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 26, marginTop: 10 }}>
        {SOLVED.map((s, i) => (
          <motion.div key={s.word} data-solved={s.word} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 30, padding: '30px 34px', borderRadius: 18, background: TEAL_TINT, border: '2px solid var(--teal)', minHeight: 180 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.35, duration: 0.45, ease: EASE }}>
            {/* the same icon the problem had on the glass */}
            <LineIcon name={CURATION.find((c) => c.word === s.word)!.icon} size={88} />
            <div style={{ flex: 1, minWidth: 0, paddingRight: 130 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--teal)', marginBottom: 14 }}>{s.word}</div>
              <div style={{ fontSize: 28, color: 'var(--ink)', lineHeight: 1.4 }}>{s.text}</div>
            </div>
            {/* the stamp lands after the card */}
            <motion.span
              style={{ position: 'absolute', top: 26, right: 26, padding: '7px 16px', borderRadius: 8, border: '3px solid var(--teal)', color: 'var(--teal)', fontWeight: 800, fontSize: 22, letterSpacing: '0.1em' }}
              initial={{ opacity: 0, scale: 1.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 0.9 + i * 0.35, duration: 0.35, ease: EASE }}
            >
              SOLVED
            </motion.span>
          </motion.div>
        ))}
      </div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- page 28 · Where both labs meet ---------- */

export interface BothLabsProps {
  rule: string[];
  history: string[];
  message: string;
}

/**
 * Over the bridge, no panel: the Lab 2 rule slides in from the left, the Lab 3 history (the one red thing) from
 * the right, they meet in the middle, and the line under them lands.
 */
export function BothLabs({ rule, history, message }: BothLabsProps) {
  const card = (title: string, lines: string[], red: boolean, from: number) => (
    <motion.div
      data-lab={title}
      style={{ width: 520, padding: '22px 26px', borderRadius: 16, background: 'var(--panel)', border: `3px solid ${red ? 'var(--red)' : 'var(--teal)'}`, backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0, x: from }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: red ? 1.1 : 0.4, duration: 0.8, ease: EASE }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: red ? 'var(--red)' : 'var(--teal)', marginBottom: 10 }}>{title}</div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 26, color: 'var(--ink)', lineHeight: 1.35 }}>
          <Rich text={l} />
        </div>
      ))}
    </motion.div>
  );
  return (
    <div className="beat" data-testid="both-labs">
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, zIndex: 35 }}>
        {card('Lab 2 · the rule', rule, false, -260)}
        <motion.span style={{ fontSize: 44, fontWeight: 700, color: 'var(--ink)' }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, duration: 0.4 }}>
          +
        </motion.span>
        {card('Lab 3 · the history', history, true, 260)}
      </div>
      <motion.div
        style={{ position: 'absolute', left: '50%', top: 380, transform: 'translateX(-50%)', zIndex: 35 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
      >
        <div style={{ padding: '18px 32px', borderRadius: 14, background: 'var(--panel)', backdropFilter: 'blur(8px)', fontSize: 30, fontWeight: 700, color: 'var(--ink)', textAlign: 'center', maxWidth: 1200 }}>
          <Rich text={message} />
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- the quiz (3.18, the last page of the show) ---------- */

/** the quiz card: the page's one red thing; the QR code comes from the owner */
export function QuizCard({ quiz, delay = 2.0, style }: { quiz: string[]; delay?: number; style?: CSSProperties }) {
  return (
    <motion.div data-quiz style={{ padding: 22, borderRadius: 16, border: '3px solid var(--red)', background: 'rgba(199, 70, 52, 0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, boxSizing: 'border-box', ...style }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--red)' }}>Quiz</div>
      <div style={{ width: 180, height: 180, borderRadius: 10, border: '3px dashed var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--red)', fontWeight: 600 }}>QR code</div>
      {quiz.map((q) => (
        <div key={q} style={{ fontSize: 21, color: 'var(--ink)', fontWeight: 600 }}>
          {q}
        </div>
      ))}
    </motion.div>
  );
}
