import { motion } from 'motion/react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

const SHAPES = [
  { key: 'table', label: 'a table', hint: 'asset record', dx: -300, dy: -150 },
  { key: 'json', label: 'a spec sheet', hint: 'JSON', dx: 300, dy: -150 },
  { key: 'graph', label: 'a web of lines', hint: 'connected assets', dx: -300, dy: 150 },
  { key: 'text', label: 'a pile of narratives', hint: 'free text', dx: 300, dy: 150 },
];

export function QuestionBubble() {
  return (
    <div className="qb">
      <motion.div className="qb__bubble" initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <div className="qb__who">inspector · Harbor Bridge · Pier 3</div>
        <div className="qb__text">“What do we know about this bridge, and what should I do?”</div>
      </motion.div>
      <svg className="qb__arrows" viewBox="-400 -200 800 400" aria-hidden>
        {SHAPES.map((s, i) => (
          <motion.line
            key={s.key}
            x1={0}
            y1={0}
            x2={s.dx * 0.78}
            y2={s.dy * 0.78}
            stroke="rgba(230,233,239,0.45)"
            strokeWidth={1.2}
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1.6 + i * 0.35, duration: 0.7, ease: EASE }}
          />
        ))}
      </svg>
      {SHAPES.map((s, i) => (
        <motion.div
          key={s.key}
          className="qb__shape"
          initial={{ opacity: 0, scale: 0.8, x: s.dx * 0.9, y: s.dy * 0.9 }}
          animate={{ opacity: 1, scale: 1, x: s.dx, y: s.dy }}
          transition={{ delay: 2.0 + i * 0.35, duration: 0.5, ease: EASE }}
        >
          <div className="qb__shape-label">{s.label}</div>
          <div className="qb__shape-hint mono">{s.hint}</div>
        </motion.div>
      ))}
      <motion.div className="qb__line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8 }}>
        The answer exists. In four shapes, in four places. The inspector has none of them.
      </motion.div>
      <div className="tag">fictional scenario</div>
    </div>
  );
}
