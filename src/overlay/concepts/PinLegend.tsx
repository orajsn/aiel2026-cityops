import { motion } from 'motion/react';
import { ASSETS } from '../../content/geo';
import { pinColor, TYPE_LABEL, TYPE_ORDER } from '../../world/pinColors';

export function PinLegend() {
  return (
    <div className="legend">
      <motion.div className="legend__count" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <span className="legend__big">28</span> assets · 7 districts
      </motion.div>
      {TYPE_ORDER.map((t, i) => (
        <motion.div
          key={t}
          className="legend__row"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 + i * 0.7, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <i style={{ background: pinColor(t) }} />
          <span>{TYPE_LABEL[t]}</span>
          <span className="legend__n mono">{ASSETS.filter((a) => a.type === t).length}</span>
        </motion.div>
      ))}
      <motion.div className="legend__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7 }}>
        hover a pin for its spec sheet
      </motion.div>
    </div>
  );
}
