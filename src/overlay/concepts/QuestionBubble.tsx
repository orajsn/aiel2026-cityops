import { motion } from 'motion/react';
import { useUiStore } from '../../engine/ui';

/**
 * 0.4 overlay: the question and the four shapes are 3D in the scene (world/BridgeQuestion.tsx);
 * here only the line the page lands, once they are all up.
 */
export function QuestionBubble() {
  // the script is off: the bottom of the screen is free for the page's line, just above the corner buttons
  const low = useUiStore((s) => !s.scriptOpen);
  return (
    <div className="qb">
      {/* the page's line, once the script is off: with the script on, the script says these same words */}
      {low && (
        <motion.div className="qb__line is-low" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.5 }}>
          The answer <b>exists</b>. In <b className="qb__teal">four shapes</b>, in <b className="qb__teal">four places</b>. The inspector has <b className="qb__red">none of them</b>.
        </motion.div>
      )}
    </div>
  );
}
