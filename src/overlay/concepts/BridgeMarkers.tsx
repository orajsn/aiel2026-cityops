import { motion } from 'motion/react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function BridgeMarkers() {
  return (
    <div className="markers">
      <motion.div className="markers__asset" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="markers__name mono">Harbor Bridge</div>
        <div className="markers__meta">bridge · Harbor District · criticality 5</div>
      </motion.div>
      <motion.div className="markers__neigh" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
        <div><i style={{ background: '#F5B700' }} /> <span className="mono">Substation Gamma</span> powers it</div>
        <div><i style={{ background: '#B8F2E6' }} /> <span className="mono">Sensor Array A / B</span> monitor it</div>
        <div><i style={{ background: '#FFFFFF' }} /> <span className="mono">City Operations Control Center</span> coordinates it</div>
      </motion.div>
      <motion.div className="markers__incident is-red" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0, duration: 0.5, ease: EASE }}>
        <div className="markers__pier mono">Pier 3</div>
        <div>hairline crack · 0.12 mm · this afternoon</div>
        <div className="markers__lab">Lab 2 · an agent with tools</div>
      </motion.div>
      <motion.div className="markers__incident" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.2, duration: 0.5, ease: EASE }}>
        <div className="markers__pier mono">Pier 2</div>
        <div>surface corrosion · ~25% section loss · next session</div>
        <div className="markers__lab">Lab 3 · an agent with memory</div>
      </motion.div>
      <div className="tag">fictional scenario</div>
    </div>
  );
}
