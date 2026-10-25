import { motion } from 'motion/react';
import { ASSETS } from '../../content/geo';

const DISTRICTS = [...new Set(ASSETS.map((a) => a.district))];

/**
 * Introduction page 2: how many assets, and the seven districts by name, all at once (owner, 25 Oct: waiting for
 * every district to come in one by one was slow; naming the seven is enough).
 */
export function PinLegend() {
  return (
    <motion.div className="legend" data-testid="pin-legend" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
      <div className="legend__count">
        <span className="legend__big">{ASSETS.length}</span> assets · {DISTRICTS.length} districts
      </div>
      <div className="legend__districts">
        {DISTRICTS.map((d) => (
          <span key={d} className="legend__row">
            <i />
            {d}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
