import { motion } from 'motion/react';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon, type IconName } from './icons';

export interface LikeAPersonProps {
  kicker: string;
  /** the one line the presenter lands; **teal** marks as in Rich.tsx */
  message: string;
}

/** a person's memory is grey, the agent's teal (the same tones as the memory map) */
const GREY = { fill: 'rgba(138, 145, 156, 0.12)', stroke: '#8a919c', label: 'var(--ink-dim)' };
const TEAL = { fill: 'rgba(27, 138, 156, 0.10)', stroke: 'var(--teal)', label: 'var(--teal)' };

type Example = { icon: IconName; text: string };

/**
 * The map's order, top to bottom (MemoryMap click 3), so the next click lines up with this page. The Harbor Bridge
 * examples are the map's own words for each kind.
 */
const KINDS: { kind: string; what: string; icon: IconName; person: Example; agent: Example; lab: Example }[] = [
  { kind: 'Procedural', what: 'how to do the job', icon: 'gear', person: { icon: 'bike', text: 'Riding a bike: instincts and motor skills' }, agent: { icon: 'prompt', text: 'Its system prompt' }, lab: { icon: 'clipboard', text: 'Approved inspection guidance' } },
  { kind: 'Episodic', what: 'what happened', icon: 'book', person: { icon: 'photo', text: 'Things I did: last summer’s trip' }, agent: { icon: 'log', text: 'Its past actions' }, lab: { icon: 'speech', text: 'What Mercer saw and advised' } },
  { kind: 'Semantic', what: 'what is true', icon: 'nodes', person: { icon: 'cap', text: 'Things I learned in school' }, agent: { icon: 'profile', text: 'Facts about a user' }, lab: { icon: 'pin', text: 'Harbor Bridge and the right pier' } },
];

/** each part comes in by its column, then its row: columns left to right, top to bottom in each */
const at = (col: number, row: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.35 + col * 0.35 + row * 0.18, duration: 0.5, ease: EASE } });

/**
 * Lab 3 · the human analogy (owner, 26 Oct, from the "AI Agent Memory: The Human Analogy" picture, redrawn in our
 * colours): between long-term memory (3.2b) and the map's three kinds (3.2c), each kind as a person has it
 * as the agent has it, and what it is in this lab at Harbor Bridge (owner: memory type, human example, lab example).
 * Columns come in left to right, in each one the person first, then the agent, then the bridge.
 */
export function LikeAPerson({ kicker, message }: LikeAPersonProps) {
  return (
    <WidePanel kicker={kicker} message={message} testId="like-a-person">
      {/* one grid for all three columns, so each row (kind, person, arrow, agent, arrow, bridge) lines up across them however the text wraps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridAutoFlow: 'column', gridTemplateRows: 'auto 1fr auto 1fr auto 1fr', columnGap: 28, rowGap: 14, marginTop: 8 }}>
        {KINDS.map((k, col) => (
          <div key={k.kind} data-kind={k.kind} style={{ display: 'contents' }}>
            <motion.div {...at(col, 0)} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <LineIcon name={k.icon} size={52} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>{k.kind}</span>
                <span style={{ fontSize: 18, color: 'var(--ink-dim)' }}>{k.what}</span>
              </div>
            </motion.div>
            <motion.div {...at(col, 1)} style={{ display: 'flex' }}>
              <Card tone={GREY} label="A person" icon={k.person.icon} text={k.person.text} />
            </motion.div>
            <Arrow {...at(col, 2)} />
            <motion.div {...at(col, 3)} style={{ display: 'flex' }}>
              <Card tone={TEAL} label="The agent" icon={k.agent.icon} text={k.agent.text} />
            </motion.div>
            <Arrow {...at(col, 4)} />
            <motion.div {...at(col, 5)} style={{ display: 'flex' }}>
              <Card tone={TEAL} label="At Harbor Bridge" icon={k.lab.icon} text={k.lab.text} dashed />
            </motion.div>
          </div>
        ))}
      </div>
    </WidePanel>
  );
}

const Arrow = (motionProps: ReturnType<typeof at>) => (
  <motion.svg {...motionProps} width={24} height={22} viewBox="0 0 24 22" style={{ justifySelf: 'center' }} aria-hidden="true">
    <path d="M12 2v16M5 11l7 7 7-7" fill="none" stroke="#8a919c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
);

/** dashed: the lab's own case, not a general kind of memory */
function Card({ tone, label, icon, text, dashed = false }: { tone: typeof GREY; label: string; icon: IconName; text: string; dashed?: boolean }) {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 16, alignItems: 'center', padding: '16px 20px', borderRadius: 12, border: `2px ${dashed ? 'dashed' : 'solid'} ${tone.stroke}`, background: dashed ? 'transparent' : tone.fill }}>
      <LineIcon name={icon} size={44} color={tone.stroke} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: tone.label }}>{label}</span>
        <span style={{ fontSize: 24, fontWeight: 500, color: 'var(--ink)' }}>{text}</span>
      </div>
    </div>
  );
}
