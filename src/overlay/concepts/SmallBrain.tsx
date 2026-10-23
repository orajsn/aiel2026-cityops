import { motion } from 'motion/react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function SmallBrain() {
  return (
    <div className="brain">
      <motion.div className="brain__card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <div className="brain__kicker">the model</div>
        <div className="brain__name mono">llama3.2</div>
        <div className="brain__facts">
          <span>3B parameters</span>
          <span>CPU only</span>
          <span>via Ollama</span>
        </div>
        <svg viewBox="0 0 200 120" width="220" height="132" className="brain__gauge" aria-label="30 to 60 seconds per answer">
          <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgba(230,233,239,0.15)" strokeWidth="10" strokeLinecap="round" />
          <path d="M20 100 A80 80 0 0 1 60 32" fill="none" stroke="#1B8A9C" strokeWidth="10" strokeLinecap="round" />
          <path d="M140 32 A80 80 0 0 1 180 100" fill="none" stroke="#C74634" strokeWidth="10" strokeLinecap="round" />
          <motion.line x1="100" y1="100" x2="100" y2="34" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ originX: '100px', originY: '100px' }} initial={{ rotate: -80 }} animate={{ rotate: 62 }} transition={{ delay: 0.6, duration: 2.2, ease: EASE }} />
          <circle cx="100" cy="100" r="4" fill="#fff" />
          <text x="22" y="118" fill="#8b93a1" fontSize="10" fontFamily="Inter">fast</text>
          <text x="156" y="118" fill="#8b93a1" fontSize="10" fontFamily="Inter">slow</text>
        </svg>
        <motion.div className="brain__speed mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
          30–60 s per answer
        </motion.div>
        <motion.div className="brain__line" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}>
          Deliberately small and slow. The lab is about what you give the model, not the model.
        </motion.div>
      </motion.div>
    </div>
  );
}
