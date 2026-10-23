import { motion } from 'motion/react';
import { useSceneStore } from '../../engine/store';

export function DataCounters() {
  const c = useSceneStore((s) => s.counters);
  const rows = [
    { n: c.logs, label: 'maintenance logs', max: 308 },
    { n: c.reports, label: 'inspection reports', max: 60 },
    { n: c.findings, label: 'findings', max: 220 },
  ];
  return (
    <div className="counters">
      <div className="counters__clock" aria-hidden>
        <svg viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r="29" fill="none" stroke="rgba(230,233,239,0.18)" strokeWidth="1.5" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="32" y1="5" x2="32" y2="9" stroke="rgba(230,233,239,0.4)" strokeWidth="1.5" transform={`rotate(${i * 30} 32 32)`} />
          ))}
          <motion.line x1="32" y1="32" x2="32" y2="10" stroke="#C74634" strokeWidth="2" strokeLinecap="round" style={{ originX: '32px', originY: '32px' }} initial={{ rotate: 0 }} animate={{ rotate: 720 }} transition={{ duration: 9, ease: 'linear' }} />
          <circle cx="32" cy="32" r="2" fill="#C74634" />
        </svg>
        <div className="counters__day">24 hours</div>
      </div>
      {rows.map((r, i) => (
        <motion.div key={r.label} className="counters__row" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
          <div className="counters__n mono">{r.n}</div>
          <div className="counters__label">{r.label}</div>
          <div className="counters__bar"><div style={{ width: `${(r.n / r.max) * 100}%` }} /></div>
        </motion.div>
      ))}
      <motion.div className="counters__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }}>
        most of it is free text, written by inspectors
      </motion.div>
    </div>
  );
}
