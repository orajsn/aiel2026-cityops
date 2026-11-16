import { motion } from 'motion/react';
import { UNIFIED_PARTS } from '../../content/lab2Tools';
import { BRIEF_AT, DB_WIDE, UNIFIED_PANELS, px, py, skyScreen } from '../../world/skyPlaces';
import { Rich } from '../Rich';
import { useUiStore } from '../../engine/ui';

const fade = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.45 } });
const line = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.5 } });
/** the brief card (screen units) */
const BRIEF = { w: 0.36, h: 0.34 };

/**
 * Lab 2 page 6 · one query, four shapes. Writes beside the 3D (UnifiedBoard, SkyStage): the beams from the
 * database into the four panels, the panel names, the lines from the panels into the one brief, and the
 * brief itself, which then goes into the model.
 */
export function UnifiedQuery({ message }: { message?: string }) {
  const db = skyScreen(DB_WIDE);
  // the script is off: the bottom of the screen is free for the page's line, just above the corner buttons
  const low = useUiStore((s) => !s.scriptOpen);
  const bx0 = BRIEF_AT.x - BRIEF.w / 2;
  const by1 = BRIEF_AT.y + BRIEF.h / 2;
  void bx0;
  // the beams run through the gap between the two rows to reach the right column
  const gapY = (UNIFIED_PANELS[0].y0 + UNIFIED_PANELS[2].y1) / 2;
  return (
    <div className="board uq">
      <svg className="tb__svg" viewBox="0 0 1920 1080" aria-hidden>
        {UNIFIED_PANELS.map((p, i) => {
          const cy = (p.y0 + p.y1) / 2;
          const right = p.x0 > 0;
          const d = right
            ? `M ${px(db.x) + 70} ${py(db.y)} L ${px(p.x0 - 0.43)} ${py(gapY)} L ${px((p.x0 + p.x1) / 2)} ${py(gapY)} L ${px((p.x0 + p.x1) / 2)} ${py(p.y1 > 0.5 ? p.y0 : p.y1)}`
            : `M ${px(db.x) + 70} ${py(db.y)} L ${px(p.x0)} ${py(cy)}`;
          return <motion.path key={p.kind} d={d} fill="none" stroke="#1B8A9C" strokeWidth={2.5} strokeOpacity={0.8} {...line(1.3 + i * 0.25)} />;
        })}
      </svg>
      {UNIFIED_PANELS.map((p, i) => {
        const part = UNIFIED_PARTS.find((u) => u.kind === p.kind)!;
        return (
          <motion.div key={p.kind} className="board__head" style={{ left: px(p.x0) + 16, top: py(p.y1) + 12, width: px(p.x1) - px(p.x0) - 32 }} {...fade(1.6 + i * 0.25)}>
            {/* the part joins the brief: a red tick, as its row appears there */}
            <motion.span className="uq__tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.5 + i * 0.15, type: 'spring', stiffness: 400, damping: 18 }}>
              ✓
            </motion.span>
            <b className="board__need">{part.key}</b>
            <span className="board__shape">{part.what}</span>
          </motion.div>
        );
      })}
      <motion.div className="uq__brief" style={{ left: px(bx0), top: py(by1), width: px(BRIEF.w) - px(0) }} {...fade(3.3)}>
        <div className="uq__kicker">one brief · one SQL</div>
        <div className="uq__query">get_asset_incident_brief(Harbor Bridge, cracks, k=5)</div>
        <ul className="uq__parts">
          {UNIFIED_PARTS.map((u, i) => (
            <motion.li key={u.key} {...fade(3.6 + i * 0.15)}>
              <b>{u.key}</b>
              <span>{u.what}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      {/* the page's line, once the script is off: with the script on, the script says these same words */}
      {low && (
        <motion.div className="qb__line is-low" {...fade(5.2)}>
          <Rich text={message ?? "**One SQL statement combines four data models** in this lab."} />
        </motion.div>
      )}
    </div>
  );
}
