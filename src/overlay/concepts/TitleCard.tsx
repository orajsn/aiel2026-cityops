import { motion } from 'motion/react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function TitleCard() {
  return (
    <div className="title">
      <motion.div className="title__kicker" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        Oracle AI Experience Live 2026 · Bangkok, Thailand
      </motion.div>
      <motion.h1 className="title__word" initial={{ opacity: 0, y: 18, letterSpacing: '0.2em' }} animate={{ opacity: 1, y: 0, letterSpacing: '0.04em' }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>
        CityOps
      </motion.h1>
      <motion.div className="title__rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.6 }} />
      <motion.div className="title__org" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }}>
        Oracle Cloud Engineering Thailand
      </motion.div>
    </div>
  );
}
