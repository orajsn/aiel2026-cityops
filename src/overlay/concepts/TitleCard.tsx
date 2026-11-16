import { motion } from 'motion/react';
import { useUiStore } from '../../engine/ui';

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** the O of the Oracle logo (public/art/logo.svg), used as the O of "Ops" (owner, 25 Oct) */
function OracleO() {
  return (
    <svg className="title__o" viewBox="5.12945 5.15975 20.17485 12.76355" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.5142 17.9233 18.9331 17.9233C22.4625 17.9233 25.3043 15.0718 25.3043 11.5464 25.3043 8.01715 22.4625 5.15975 18.9331 5.15975L11.5142 5.15975C7.98886 5.15975 5.12945 8.01715 5.12945 11.5464 5.12945 15.0718 7.98886 17.9233 11.5142 17.9233M18.7633 15.6772 11.6774 15.6772C9.39705 15.6772 7.54935 13.8237 7.54935 11.5464 7.54935 9.25935 9.39705 7.41555 11.6774 7.41555L18.7633 7.41555C21.0513 7.41555 22.8971 9.25935 22.8971 11.5464 22.8971 13.8237 21.0513 15.6772 18.7633 15.6772"
      />
    </svg>
  );
}

const Oracle = () => <span className="title__oracle">Oracle</span>;

export function TitleCard() {
  // the script is off: the bottom of the screen is free, so this steps down towards the corner buttons
  const low = useUiStore((s) => !s.scriptOpen);
  return (
    <div className={`title${low ? ' title--low' : ''}`}>
      <motion.div className="title__kicker" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <Oracle /> AI Experience Live 2026 · Jakarta, Indonesia
      </motion.div>
      <motion.h1 className="title__word" aria-label="CityOps" initial={{ opacity: 0, y: 18, letterSpacing: '0.2em' }} animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
        City
        <OracleO />
        ps
      </motion.h1>
      <motion.div className="title__rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }} />
      <motion.div className="title__org" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }}>
        <Oracle /> Cloud Engineering Indonesia
        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 450, lineHeight: 1.4, letterSpacing: 0, textTransform: 'none' }}>Real neighbourhood. Fictional inspection scenario.</div>
      </motion.div>
    </div>
  );
}
