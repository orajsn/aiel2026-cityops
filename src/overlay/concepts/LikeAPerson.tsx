import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';

export interface LikeAPersonProps {
  kicker: string;
  /** the one line the presenter lands; **teal** marks as in Rich.tsx */
  message: string;
}

/** a person's memory is grey, the agent's teal (the same tones as the memory map) */
const GREY = { fill: 'rgba(138, 145, 156, 0.12)', stroke: '#8a919c', label: 'var(--ink-dim)' };
const TEAL = { fill: 'rgba(27, 138, 156, 0.10)', stroke: 'var(--teal)', label: 'var(--teal)' };

/** line icons, 48 units, drawn in the card's stroke colour */
const Icon = ({ size, color, children }: { size: number; color: string; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
    {children}
  </svg>
);
const GEAR = <><circle cx="24" cy="24" r="7" /><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2" /></>;
const BOOK = <><path d="M24 12c-5-4-12-4-18-3v29c6-1 13-1 18 3 5-4 12-4 18-3V9c-6-1-13-1-18 3z" /><path d="M24 12v29" /></>;
const NODES = <><circle cx="24" cy="24" r="5" /><circle cx="9" cy="10" r="4" /><circle cx="40" cy="12" r="4" /><circle cx="12" cy="39" r="4" /><circle cx="38" cy="38" r="4" /><path d="M12 13l8 7M37 15l-9 6M15 36l6-8M35 35l-7-7" /></>;
const BIKE = <><circle cx="11" cy="32" r="8" /><circle cx="37" cy="32" r="8" /><path d="M11 32l8-14h12l6 14M19 18l5 14h7M17 14h6" /></>;
const PHOTO = <><rect x="5" y="9" width="38" height="30" rx="3" /><path d="M5 33l11-11 9 9 6-6 12 12" /><circle cx="33" cy="18" r="3" /></>;
const CAP = <><path d="M4 18l20-9 20 9-20 9z" /><path d="M12 22v10c4 4 20 4 24 0V22M44 18v12" /></>;
const PROMPT = <><path d="M12 5h18l8 8v30H12z" /><path d="M30 5v8h8M18 22h14M18 29h14M18 36h9" /></>;
const LOG = <><path d="M8 12l3 3 6-6M8 26l3 3 6-6M8 40l3 3 6-6" /><path d="M22 12h18M22 26h18M22 40h12" /></>;
const PROFILE = <><rect x="4" y="10" width="40" height="28" rx="3" /><circle cx="16" cy="22" r="5" /><path d="M8 33c2-4 14-4 16 0M29 19h10M29 25h10M29 31h6" /></>;

/** the map's order, top to bottom (MemoryMap click 3), so the next click lines up with this page */
const KINDS = [
  { kind: 'Procedural', what: 'how to do the job', icon: GEAR, person: { icon: BIKE, text: 'Riding a bike: instincts and motor skills' }, agent: { icon: PROMPT, text: 'Its system prompt' } },
  { kind: 'Episodic', what: 'what happened', icon: BOOK, person: { icon: PHOTO, text: 'Things I did: last summer’s trip' }, agent: { icon: LOG, text: 'Its past actions' } },
  { kind: 'Semantic', what: 'what is true', icon: NODES, person: { icon: CAP, text: 'Things I learned in school' }, agent: { icon: PROFILE, text: 'Facts about a user' } },
];

/**
 * Lab 3 · the human analogy (owner, 26 Oct, from the "AI Agent Memory: The Human Analogy" picture, redrawn in our
 * colours): between long-term memory (3.2b) and the map's three kinds (3.2c), each kind as a person has it
 * and as the agent has it. Columns come in left to right, in each one the person first, then the agent.
 */
export function LikeAPerson({ kicker, message }: LikeAPersonProps) {
  const at = (col: number, row: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.35 + col * 0.35 + row * 0.18, duration: 0.5, ease: EASE } });
  return (
    <WidePanel kicker={kicker} message={message} testId="like-a-person">
      {/* one grid for all three columns, so each row (kind, person, arrow, agent) lines up across them however the text wraps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoFlow: 'column', gridTemplateRows: 'auto 1fr auto 1fr', columnGap: 28, rowGap: 14, marginTop: 8 }}>
        {KINDS.map((k, col) => (
          <div key={k.kind} data-kind={k.kind} style={{ display: 'contents' }}>
            <motion.div {...at(col, 0)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon size={52} color="var(--teal)">{k.icon}</Icon>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>{k.kind}</span>
                <span style={{ fontSize: 18, color: 'var(--ink-dim)' }}>{k.what}</span>
              </div>
            </motion.div>
            <motion.div {...at(col, 1)} style={{ display: 'flex' }}>
              <Card tone={GREY} label="A person" icon={k.person.icon} text={k.person.text} />
            </motion.div>
            <motion.svg {...at(col, 2)} width={24} height={26} viewBox="0 0 24 26" style={{ justifySelf: 'center' }} aria-hidden="true">
              <path d="M12 2v20M5 15l7 7 7-7" fill="none" stroke="#8a919c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <motion.div {...at(col, 3)} style={{ display: 'flex' }}>
              <Card tone={TEAL} label="The agent" icon={k.agent.icon} text={k.agent.text} />
            </motion.div>
          </div>
        ))}
      </div>
    </WidePanel>
  );
}

function Card({ tone, label, icon, text }: { tone: typeof GREY; label: string; icon: ReactNode; text: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 16, alignItems: 'center', padding: '18px 20px', borderRadius: 12, border: `2px solid ${tone.stroke}`, background: tone.fill }}>
      <Icon size={44} color={tone.stroke}>{icon}</Icon>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: tone.label }}>{label}</span>
        <span style={{ fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}>{text}</span>
      </div>
    </div>
  );
}
