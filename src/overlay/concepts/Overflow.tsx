import { motion } from 'motion/react';
import { FOLDER, OPS_TOP, px, py, skyScreen } from '../../world/skyPlaces';
import { Rich } from '../Rich';

/** the three questions, where each stops above the folder (screen units, relative to the folder) */
const QUESTIONS: { text: string; dx: number; dy: number }[] = [
  { text: 'What is this asset?', dx: -0.36, dy: 0.42 },
  { text: 'What is connected to it?', dx: 0, dy: 0.56 },
  { text: 'What happened before?', dx: 0.36, dy: 0.42 },
];
const fade = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.45 } });

/**
 * Lab 2 page 4 · one folder is not enough. Three questions rise from the Ops Center and stop short of the
 * folder of references (3D, SkyStage): one folder answers one question. On the right, the notebook's own
 * comparison (Section 1.10): a simple question against a real operations question.
 */
export function Overflow({ message }: { message?: string }) {
  const f = skyScreen(FOLDER);
  const ops = skyScreen(OPS_TOP);
  return (
    <div className="ov">
      <svg className="tb__svg" viewBox="0 0 1920 1080" aria-hidden>
        {QUESTIONS.map((q, i) => {
          const sx = f.x + q.dx;
          const sy = f.y + q.dy - 0.05;
          // the line reaches for the folder and stops short: no way in
          const ex = f.x + q.dx * 0.42;
          const ey = f.y + 0.24;
          return <motion.line key={q.text} x1={px(sx)} y1={py(sy)} x2={px(ex)} y2={py(ey)} stroke="#C74634" strokeWidth={2} strokeDasharray="8 6" strokeOpacity={0.85} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + i * 0.3, duration: 0.4 }} />;
        })}
      </svg>
      {QUESTIONS.map((q, i) => {
        const sx = f.x + q.dx;
        const sy = f.y + q.dy;
        return (
          <motion.div
            key={q.text}
            className="ov__q"
            style={{ left: px(sx), top: py(sy) }}
            initial={{ x: px(ops.x) - px(sx), y: py(ops.y) - py(sy), opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.35, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {q.text}
          </motion.div>
        );
      })}
      {QUESTIONS.map((q, i) => (
        <motion.div key={q.text} className="ov__x" style={{ left: px(f.x + q.dx * 0.42), top: py(f.y + 0.24) }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0 + i * 0.3, type: 'spring', stiffness: 400, damping: 18 }}>
          ✕
        </motion.div>
      ))}
      <motion.div className="ov__pill" style={{ left: px(f.x), top: py(f.y - 0.3) }} {...fade(2.6)}>
        one folder · <b>one question</b>
      </motion.div>
      <motion.div className="ov__card ov__card--teal" style={{ left: px(0.36), top: py(0.8), width: px(0.95) - px(0.36) }} {...fade(0.4)}>
        <div className="ov__kicker">A simple question</div>
        <div className="ov__text">“What is the maintenance status of this asset?”</div>
        <div className="ov__verdict ov__verdict--teal">one retrieval, one call ✓</div>
      </motion.div>
      <motion.div className="ov__card ov__card--red" style={{ left: px(0.36), top: py(0.46), width: px(0.95) - px(0.36) }} {...fade(3.0)}>
        <div className="ov__kicker ov__kicker--red">A real operations question</div>
        <div className="ov__text">“Review the evidence, find recurring failures, check connected assets, flag what to escalate.”</div>
        <div className="ov__needs">
          needs <b>several retrievals</b> · <b>a graph lookup</b> · <b>a judgment call</b>
        </div>
        <div className="ov__verdict ov__verdict--red">A workflow, not a RAG call.</div>
      </motion.div>
      <motion.div className="qb__line" {...fade(4.2)}>
        <Rich text={message ?? '**One folder answers one question.** Operations ask **three at once**.'} />
      </motion.div>
    </div>
  );
}
