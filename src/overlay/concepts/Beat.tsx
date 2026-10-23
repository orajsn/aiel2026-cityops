import { motion } from 'motion/react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

type Tone = 'teal' | 'red' | 'grey' | 'blue' | 'green' | 'amber';

export type Visual =
  | { kind: 'chat'; lines: { who: string; text: string; tone?: Tone }[] }
  | { kind: 'flow'; steps: string[]; loop?: boolean; hot?: number[] }
  | { kind: 'cards'; items: { title: string; sub?: string; tone?: Tone }[]; cols?: number }
  | { kind: 'compare'; left: { title: string; lines: string[]; tone?: Tone }; right: { title: string; lines: string[]; tone?: Tone } }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'code'; lines: string[] };

export interface BeatProps {
  /** small label above the panel, e.g. "The toolbelt" */
  kicker: string;
  visual: Visual;
  /** the one line the presenter lands */
  message: string;
  /** where the same thing lives in the notebook */
  notebook?: string;
  tag?: 'fictional scenario';
}

const item = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.25 + i * 0.18, duration: 0.45, ease: EASE },
});

/**
 * Rough storyboard beat: one plain infographic panel, the presenter's line, and the notebook pointer.
 * Built to see the sequence; each beat gets its own scene treatment later.
 */
export function Beat({ kicker, visual, message, notebook, tag }: BeatProps) {
  return (
    <div className="beat">
      <motion.div className="beat__panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="beat__kicker">
          {kicker}
          {tag && <span className="beat__tag">{tag}</span>}
        </div>
        <div className="beat__headline">“{message}”</div>
        <VisualView v={visual} />
        {notebook && <div className="beat__notebook mono">notebook · {notebook}</div>}
      </motion.div>
    </div>
  );
}

function VisualView({ v }: { v: Visual }) {
  switch (v.kind) {
    case 'chat':
      return (
        <div className="beat-chat">
          {v.lines.map((l, i) => (
            <motion.div key={i} className={`beat-chat__line tone-${l.tone ?? 'grey'}`} {...item(i)}>
              <div className="beat-chat__who mono">{l.who}</div>
              <div className="beat-chat__text">{l.text}</div>
            </motion.div>
          ))}
        </div>
      );
    case 'flow':
      return (
        <div className={`beat-flow${v.loop ? ' beat-flow--loop' : ''}`}>
          {v.steps.map((s, i) => (
            <motion.div key={i} className={`beat-flow__step${v.hot?.includes(i) ? ' is-hot' : ''}`} {...item(i)}>
              <span className="beat-flow__n mono">{i + 1}</span>
              <span>{s}</span>
            </motion.div>
          ))}
          {v.loop && <div className="beat-flow__back mono">↺ next turn</div>}
        </div>
      );
    case 'cards':
      return (
        <div className="beat-cards" style={{ gridTemplateColumns: `repeat(${v.cols ?? 2}, 1fr)` }}>
          {v.items.map((c, i) => (
            <motion.div key={i} className={`beat-card tone-${c.tone ?? 'teal'}`} {...item(i)}>
              <div className="beat-card__title">{c.title}</div>
              {c.sub && <div className="beat-card__sub">{c.sub}</div>}
            </motion.div>
          ))}
        </div>
      );
    case 'compare':
      return (
        <div className="beat-compare">
          {[v.left, v.right].map((col, i) => (
            <motion.div key={i} className={`beat-compare__col tone-${col.tone ?? (i ? 'teal' : 'grey')}`} {...item(i * 2)}>
              <div className="beat-compare__title">{col.title}</div>
              {col.lines.map((l, j) => (
                <div key={j} className="beat-compare__line">
                  {l}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      );
    case 'list': {
      const Tag = v.ordered ? 'ol' : 'ul';
      return (
        <Tag className="beat-list">
          {v.items.map((t, i) => (
            <motion.li key={i} {...item(i)}>
              {t}
            </motion.li>
          ))}
        </Tag>
      );
    }
    case 'code':
      return (
        <motion.pre className="beat-code mono" {...item(0)}>
          {v.lines.join('\n')}
        </motion.pre>
      );
  }
}
