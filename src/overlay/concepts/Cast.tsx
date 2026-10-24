import { motion } from 'motion/react';
import { Rich } from '../Rich';

const EASE = [0.2, 0.8, 0.2, 1] as const;

export interface CastMember {
  /** two letters for the round badge */
  initials: string;
  /** the name exactly as the notebook prints it */
  name: string;
  /** e.g. "First visit" */
  when: string;
  text: string;
}

export interface CastProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** a short line over the people, e.g. "One bridge. Two inspectors." */
  heading: string;
  people: CastMember[];
  /** the question the page leaves the room with */
  question?: string;
}

/**
 * Who the story is about, as on the Lab 3 deck's slide 5: a round badge, the name, when they come and
 * what they do, one row each, then the question that sets up the next pages.
 */
export function Cast({ kicker, message, heading, people, question }: CastProps) {
  const at = (i: number) => 0.3 + i * 0.4;
  return (
    <div className="beat">
      <motion.div className="beat__panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">{kicker}</div>
        <div className="beat__headline">
          <Rich text={message} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', margin: '4px 0 14px' }}>{heading}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {people.map((p, i) => (
            <motion.div
              key={p.name}
              data-cast={p.name}
              style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 16px', borderRadius: 12, background: 'rgba(127, 127, 127, 0.08)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: at(i), duration: 0.45, ease: EASE }}
            >
              <span
                style={{ flex: 'none', width: 58, height: 58, borderRadius: '50%', border: '3px solid var(--teal)', color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 700 }}
              >
                {p.initials}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim)', fontWeight: 600 }}>{p.when}</span>
                <span style={{ fontSize: 23, color: 'var(--teal)', fontWeight: 700 }}>{p.name}</span>
                <span style={{ fontSize: 21, color: 'var(--ink)', lineHeight: 1.35 }}>{p.text}</span>
              </span>
            </motion.div>
          ))}
        </div>
        {question && (
          <motion.div
            style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: at(people.length) + 0.2, duration: 0.5 }}
          >
            <Rich text={question} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
