import { motion } from 'motion/react';
import { useSceneStore } from '../../engine/store';

/** how long the day's data takes to come in (DataStream on this page uses the same) */
export const STREAM_MS = 4000;

/**
 * Introduction page 3: the day's data flows into the City Operations Control Center (3D), and a band along the
 * bottom counts it in: three big numbers side by side, then the line that matters, most of it is free text.
 * Owner, 25 Oct: the counting was slow; it now takes four seconds.
 */
export function DataCounters() {
  const c = useSceneStore((s) => s.counters);
  const rows = [
    { n: c.logs, label: 'maintenance logs', max: 308 },
    { n: c.reports, label: 'inspection reports', max: 60 },
    { n: c.findings, label: 'findings', max: 220 },
  ];
  return (
    <motion.div className="counters" data-testid="data-counters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}>
      <div className="counters__day">in 24 hours</div>
      <div className="counters__rows">
        {rows.map((r) => (
          <div key={r.label} className="counters__row">
            <div className="counters__n mono">{r.n}</div>
            <div className="counters__label">{r.label}</div>
            <div className="counters__bar">
              <div style={{ width: `${(r.n / r.max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <motion.div className="counters__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: STREAM_MS / 1000 + 0.3 }}>
        most of it is <b>free text</b>, written by inspectors
      </motion.div>
    </motion.div>
  );
}
