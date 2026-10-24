import { motion } from 'motion/react';
import { BOARD } from '../../world/answerBoard';
import { LAND_MS } from '../../world/SkyShapes';

/** stage pixels of a screen position (x, y in -1..1) on the 1920 x 1080 stage */
const px = (x: number) => ((x + 1) / 2) * 1920;
const py = (y: number) => ((1 - y) / 2) * 1080;

/**
 * 0.5 · what the inspector's answer needs. Each panel's name sits in its top band (the panel and its
 * shape are 3D, SkyShapes.tsx) and ticks as its piece lands; the database's line sits under the red stack.
 */
export function CoreCaption() {
  return (
    <div className="board">
      {BOARD.map((p, i) => {
        const at = LAND_MS(i) / 1000;
        return (
          <motion.div
            key={p.kind}
            className="board__head"
            style={{ left: px(p.x0) + 20, top: py(p.y1) + 14, width: px(p.x1) - px(p.x0) - 40 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: at - 0.3, duration: 0.4 }}
          >
            <motion.span className="board__tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: at, type: 'spring', stiffness: 400, damping: 18 }}>
              ✓
            </motion.span>
            <b className="board__need">{p.need}</b>
            <span className="board__shape mono">{p.shape}</span>
          </motion.div>
        );
      })}
      <motion.div className="board__db" style={{ top: py(-0.08) }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <b className="board__dbname">One Oracle AI Database</b>
        <motion.span className="board__all" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: LAND_MS(3) / 1000 + 0.8, duration: 0.5 }}>
          <b>All four</b> in one place.
          <br />
          Not four databases to sync.
        </motion.span>
      </motion.div>
    </div>
  );
}
