import { motion } from 'motion/react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

const FACTS: [string, string][] = [
  ['Writes', ' the answer one word at a time'],
  ['Knows the world,', ' not our city'],
  ['Small, on a CPU:', ' 30–60 s per answer'],
];

/** 0.6 · the language model: what it is and what it is not, beside the network in the sky */
export function SmallBrain() {
  return (
    <div className="brain">
      <motion.div className="brain__card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <div className="brain__name">The language model</div>
        <ul className="brain__facts">
          {FACTS.map(([b, rest], i) => (
            <motion.li key={b} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.5, duration: 0.4 }}>
              <b>{b}</b>
              {rest}
            </motion.li>
          ))}
        </ul>
        <motion.div className="brain__line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
          Today is about <b>what we give it</b>.
        </motion.div>
      </motion.div>
    </div>
  );
}
