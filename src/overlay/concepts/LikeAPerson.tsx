import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon, type IconName } from './icons';
import mercerPortrait from '../../assets/portraits/mercer.png';

export interface LikeAPersonProps {
  kicker: string;
  /** the one line the presenter lands; **teal** marks as in Rich.tsx */
  message: string;
  /** the kind being talked about (0 procedural, 1 episodic, 2 semantic): the other columns wait in grey */
  focus?: 0 | 1 | 2;
}

const GREY = '#8a919c';

type Example = { icon: IconName; text: string };

/**
 * The map's order (MemoryMap click 3), so the next click lines up with this page. The Harbor Bridge
 * examples are the map's own words for each kind.
 */
const KINDS: { kind: string; what: string; icon: IconName; person: Example; agent: Example; lab: Example }[] = [
  { kind: 'Procedural', what: 'how to do the job', icon: 'gear', person: { icon: 'bike', text: 'Riding a bike: instincts and motor skills' }, agent: { icon: 'prompt', text: 'Its system prompt' }, lab: { icon: 'clipboard', text: 'Approved inspection guidance' } },
  { kind: 'Episodic', what: 'what happened', icon: 'book', person: { icon: 'photo', text: 'Things I did: last summer’s trip' }, agent: { icon: 'log', text: 'Its past actions' }, lab: { icon: 'speech', text: 'What Mercer saw and advised' } },
  { kind: 'Semantic', what: 'what is true', icon: 'nodes', person: { icon: 'cap', text: 'Things I learned in school' }, agent: { icon: 'profile', text: 'Facts about a user' }, lab: { icon: 'pin', text: 'Harbor Bridge and the right pier' } },
];

const ROW_FILL = ['rgba(138, 145, 156, 0.10)', 'rgba(27, 138, 156, 0.10)', 'rgba(138, 145, 156, 0.05)'];
const LABEL_FILL = ['rgba(138, 145, 156, 0.2)', 'rgba(27, 138, 156, 0.2)', 'rgba(138, 145, 156, 0.2)'];
const BORDER = '1px solid rgba(27, 138, 156, 0.45)';

/** the row labels come in first, top to bottom */
const at = (row: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 + row * 0.15, duration: 0.5, ease: EASE } });
/** how much of a column shows while another kind is being talked about */
const WAITING = 0.28;
/**
 * A column's part: in the column being talked about it lights up person, then agent, then bridge (row 0 is the
 * header); the other columns stay grey and faint. The panel stays mounted across the clicks, so each click
 * re-lights only the new column.
 */
const part = (on: boolean, row: number) => ({
  initial: { opacity: 0, y: 8, filter: 'grayscale(1)' },
  animate: { opacity: on ? 1 : WAITING, y: 0, filter: on ? 'grayscale(0)' : 'grayscale(1)' },
  transition: { delay: on ? 0.5 + row * 0.35 : 0, duration: 0.5, ease: EASE },
});

const PersonIcon = () => (
  <svg width={44} height={44} viewBox="0 0 48 48" fill="none" stroke={GREY} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="24" cy="14" r="8" />
    <path d="M8 43c0-9 7-15 16-15s16 6 16 15" />
  </svg>
);
const AgentIcon = () => (
  <svg width={44} height={44} viewBox="0 0 48 48" fill="none" stroke="var(--teal)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M24 4v6" />
    <rect x="9" y="10" width="30" height="26" rx="6" />
    <circle cx="18" cy="23" r="3" />
    <circle cx="30" cy="23" r="3" />
    <path d="M18 30h12M4 21v6M44 21v6M16 36v7M32 36v7" />
  </svg>
);

const cell = (col: number, row: number): CSSProperties => ({
  gridColumn: col + 2,
  gridRow: row + 2,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '14px 18px',
  background: ROW_FILL[row],
  borderTop: BORDER,
  borderLeft: BORDER,
  fontSize: 24,
  fontWeight: 500,
  color: 'var(--ink)',
  minHeight: 118,
  boxSizing: 'border-box',
});

/**
 * Lab 3 · the human analogy (owner, 28 Oct, V2 mock): one table, the three kinds across, and down the rows a
 * person, the agent, and what it is at Harbor Bridge. One click per kind, procedural, episodic, semantic (owner):
 * the kind being talked about lights up person, agent, bridge; the others wait in grey.
 */
export function LikeAPerson({ kicker, message, focus }: LikeAPersonProps) {
  const rowHeads: { label: ReactNode; icon: ReactNode }[] = [
    { label: <b>A person</b>, icon: <PersonIcon /> },
    { label: <b>The agent</b>, icon: <AgentIcon /> },
    {
      label: (
        <span style={{ display: 'flex', flexDirection: 'column', fontSize: 18, color: 'var(--ink-dim)', fontWeight: 600 }}>
          At<span className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink)' }}>Harbor Bridge</span>
        </span>
      ),
      icon: <img data-portrait="mercer" src={mercerPortrait} alt="" width={52} height={52} style={{ borderRadius: '50%', border: '2px solid var(--teal)', objectFit: 'cover' }} />,
    },
  ];
  return (
    <WidePanel kicker={kicker} message={message} testId="like-a-person">
      <div data-table="kinds" style={{ display: 'grid', gridTemplateColumns: '260px repeat(3, minmax(0, 1fr))', gridTemplateRows: 'auto repeat(3, 1fr)', border: '2px solid var(--teal)', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ gridColumn: 1, gridRow: 1, background: 'rgba(27, 138, 156, 0.85)', color: '#fff', padding: '16px 20px', fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>Same idea, three places</div>
        {rowHeads.map((r, row) => (
          <motion.div key={row} data-row={['person', 'agent', 'bridge'][row]} {...at(row)} style={{ gridColumn: 1, gridRow: row + 2, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: LABEL_FILL[row], borderTop: BORDER, fontSize: 24, color: 'var(--ink)' }}>
            {r.icon}
            {r.label}
          </motion.div>
        ))}
        {KINDS.map((k, col) => (
          <div key={k.kind} data-kind={k.kind} data-on={focus === undefined || focus === col} style={{ display: 'contents' }}>
            <motion.div {...part(focus === undefined || focus === col, 0)} style={{ gridColumn: col + 2, gridRow: 1, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 18px', background: 'var(--teal)', color: '#fff', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
              <LineIcon name={k.icon} size={48} color="#fff" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 30, fontWeight: 700 }}>{k.kind}</span>
                <span style={{ fontSize: 18, opacity: 0.9 }}>{k.what}</span>
              </div>
            </motion.div>
            {[k.person, k.agent, k.lab].map((ex, row) => (
              <motion.div key={row} data-cell={['person', 'agent', 'bridge'][row]} {...part(focus === undefined || focus === col, row + 1)} style={cell(col, row)}>
                <LineIcon name={ex.icon} size={44} color={row === 0 ? GREY : 'var(--teal)'} />
                <span>{ex.text}</span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </WidePanel>
  );
}
