import { motion } from 'motion/react';

/**
 * 0.4 overlay: the question and the four shapes are 3D in the scene (world/BridgeQuestion.tsx);
 * here only the line the page lands, once they are all up.
 */
export function QuestionBubble() {
  return (
    <div className="qb">
      <motion.div className="qb__line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.5 }}>
        The answer <b>exists</b>. In <b className="qb__teal">four shapes</b>, in <b className="qb__teal">four places</b>. The inspector has <b className="qb__red">none of them</b>.
      </motion.div>
    </div>
  );
}
