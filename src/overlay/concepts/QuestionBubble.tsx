import { motion } from 'motion/react';

/**
 * 0.4 overlay: the question and the four shapes are 3D in the scene (world/BridgeQuestion.tsx);
 * here only the line the page lands, once they are all up, and the fictional-scenario tag.
 */
export function QuestionBubble() {
  return (
    <div className="qb">
      <motion.div className="qb__line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.5 }}>
        The answer exists. In four shapes, in four places. The inspector has none of them.
      </motion.div>
      <div className="tag">fictional scenario</div>
    </div>
  );
}
