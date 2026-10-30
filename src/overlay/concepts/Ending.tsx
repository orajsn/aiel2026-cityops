import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { Rich } from '../Rich';
import { ChatWindow, type ChatItem } from './CopilotChat';
import { EASE, WidePanel } from './WidePanel';
import { CURATION, MiniGlass, pop, GREY_FILL, GREY_LINE, TEAL_FILL } from './Glass';
import type { ReactNode } from 'react';
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

/**
 * 3.15b: the four glasses of page 13 (3.3b), the same drawings in the same places, now solved: each glass is fixed by
 * the memory, its pieces teal where the problem was grey, and the stamp lands once it is.
 */
const FIXED_AT = 1.9;
const SOLVED_GLASS: ((t0: number) => ReactNode)[] = [
  // volume: a summary and a few recent turns, plenty of room, nothing over the rim
  (t0) => (
    <>
      {[0, 1].map((i) => (
        <motion.rect key={i} data-piece="turn" x={52} y={206 - i * 25} width={96} height={19} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + i * 0.12)} />
      ))}
      <motion.g data-piece="summary" {...pop(t0 + 0.5)}>
        <rect x={46} y={124} width={108} height={42} rx={4} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
        <text x={100} y={141} textAnchor="middle" fontSize={13} fill="var(--ink-dim)">summary:</text>
        <text x={100} y={158} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ink)">rust on the pier</text>
      </motion.g>
      <motion.path d="M100 70v34M88 94l12 14 12-14" stroke="var(--teal)" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t0 + 0.9, duration: 0.4 }} />
    </>
  ),
  // relevance: the search noise stays outside, only her finding comes in
  (t0) => (
    <>
      {[[-6, 60], [4, 110], [-2, 160]].map(([x, y], i) => (
        <motion.rect key={i} data-piece="result" x={x - 24} y={y + 20} width={16} height={22} rx={2} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1} initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: t0 + i * 0.1, duration: 0.4 }} />
      ))}
      <motion.g data-piece="finding" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: t0 + 0.4, duration: 0.55, ease: EASE }}>
        <rect x={46} y={168} width={108} height={52} rx={5} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2.5} />
        <text x={100} y={192} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--teal)">HER FINDING</text>
        <text x={100} y={208} textAnchor="middle" fontSize={12} fill="var(--ink)">the only thing in</text>
      </motion.g>
    </>
  ),
  // accuracy: the 25% is kept whole, its own record, not struck out
  (t0) => (
    <>
      <motion.g data-piece="finding" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: t0, duration: 0.5, ease: EASE }} style={{ transformOrigin: '100px 200px' }}>
        <rect x={42} y={120} width={116} height={100} rx={5} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
        <text x={100} y={142} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--teal)">HER FINDING</text>
        <text x={100} y={170} textAnchor="middle" fontSize={22} fontWeight={800} fill="var(--ink)">~25%</text>
        <text x={100} y={190} textAnchor="middle" fontSize={11} fill="var(--ink)">section loss at</text>
        <text x={100} y={205} textAnchor="middle" fontSize={11} fill="var(--ink)">the bearing plate</text>
      </motion.g>
      <motion.g data-piece="kept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t0 + 0.7, duration: 0.4 }}>
        <circle cx={150} cy={104} r={13} fill="var(--teal)" />
        <path d="M143 104l5 5 9-10" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </>
  ),
  // timing: it is fetched again the moment Vance asks
  (t0) => (
    <>
      <motion.g data-piece="ask" {...pop(t0)}>
        <rect x={46} y={46} width={108} height={22} rx={11} fill="none" stroke="var(--ink-dim)" strokeWidth={1.5} />
        <text x={100} y={62} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ink)">Vance asks</text>
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.rect key={i} data-piece="turn" x={52} y={176 - i * 26} width={96} height={20} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + 0.2 + i * 0.12)} />
      ))}
      <motion.g data-piece="finding" initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: t0 + 0.8, duration: 0.6, ease: EASE }}>
        <rect x={52} y={204} width={96} height={22} rx={3} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
        <text x={100} y={220} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--teal)">her finding</text>
      </motion.g>
      <g fontSize={13} fill="var(--ink-dim)">
        <line x1={30} y1={256} x2={170} y2={256} stroke={GREY_LINE} strokeWidth={2} />
        <circle cx={30} cy={256} r={5} fill="var(--teal)" />
        <circle cx={170} cy={256} r={5} fill="var(--ink-dim)" />
        <text x={30} y={276} textAnchor="middle">turn 1</text>
        <text x={170} y={276} textAnchor="middle">turn 15</text>
      </g>
    </>
  ),
];

export function FailuresSolved({ kicker, message, notebook }: EndingProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="failures-solved">
      <Fill>
        <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, alignContent: 'center', paddingTop: 12 }}>
          {SOLVED.map((s, i) => (
            <motion.div key={s.word} data-solved={s.word} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <motion.span style={{ position: 'absolute', top: 0, right: 6, padding: '3px 12px', borderRadius: 7, border: '3px solid var(--teal)', color: 'var(--teal)', fontWeight: 800, fontSize: 17, letterSpacing: '0.1em', background: 'var(--panel-strong, #fff)' }} initial={{ opacity: 0, scale: 1.6, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ delay: FIXED_AT + i * 0.3, duration: 0.35, ease: EASE }}>
                SOLVED
              </motion.span>
              <MiniGlass word={s.word} t0={0.4 + i * 0.3}>
                {SOLVED_GLASS[i]}
              </MiniGlass>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 33, fontWeight: 700, color: 'var(--teal)', marginTop: 14 }}>
                <LineIcon name={CURATION.find((c) => c.word === s.word)!.icon} size={40} />
                {s.word}
              </div>
              <div style={{ fontSize: 23, lineHeight: 1.4, color: 'var(--ink)', marginTop: 8, maxWidth: 320 }}>{s.text}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ flex: 'none', display: 'flex', gap: 48, marginTop: 20, fontSize: 21, color: 'var(--ink-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i style={{ width: 24, height: 18, borderRadius: 3, background: 'rgba(138,145,156,0.28)', border: '1.5px solid #8a919c' }} /> grey = noise and old turns
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i style={{ width: 24, height: 18, borderRadius: 3, background: 'rgba(27,138,156,0.30)', border: '2px solid var(--teal)' }} /> teal = what Vance needs
          </span>
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
