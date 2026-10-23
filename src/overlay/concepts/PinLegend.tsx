import { motion } from 'motion/react';
import { ASSETS } from '../../content/geo';


const DISTRICTS = [...new Set(ASSETS.map((a) => a.district))];

export function PinLegend() {
  return (
    <div className="legend">
      <motion.div className="legend__count" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <span className="legend__big">28</span> assets · 7 districts
      </motion.div>
      {DISTRICTS.map((d, i) => (
        <motion.div
          key={d}
          className="legend__row"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 + i * 0.6, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <i />
          <span>{d}</span>
          <span className="legend__n mono">{ASSETS.filter((a) => a.district === d).length}</span>
        </motion.div>
      ))}
      <motion.div className="legend__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7 }}>
        each pin is one asset · hover for its spec sheet
      </motion.div>
    </div>
  );
}
