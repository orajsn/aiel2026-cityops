import { useMemo } from 'react';
import { motion } from 'motion/react';
import { qrPath } from '../../engine/follow';
import { EASE } from './WidePanel';

/**
 * "Open the lab" (owner, 4 Nov): one full page at the start of each lab with the address the audience opens, in large type, and its QR.
 * Lab 1 has its own link; Lab 2 and Lab 3 share one.
 */
export interface LabGoProps {
  kicker: string;
  /** the lab's name, big */
  lab: string;
  url: string;
  /** one line under the address, what they will do there */
  line: string;
}

export function LabGo({ kicker, lab, url, line }: LabGoProps) {
  const qr = useMemo(() => qrPath(url), [url]);
  const shown = url.replace(/^https?:\/\//, '');
  return (
    <div className="beat" data-lab-go>
      <motion.div
        className="beat__panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ left: 220, right: 220, top: 110, bottom: 96, width: 'auto', maxHeight: 'none', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', columnGap: 90, padding: '48px 80px' }}
      >
        <div>
          <div className="beat__kicker" style={{ color: 'var(--teal)' }}>{kicker}</div>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, color: 'var(--ink)', margin: '8px 0 26px' }}>Open {lab}</div>
          <div data-lab-url style={{ fontFamily: 'var(--font-mono)', fontSize: 58, fontWeight: 600, color: 'var(--teal)', lineHeight: 1.15, wordBreak: 'break-all' }}>{shown}</div>
          <div style={{ fontSize: 34, lineHeight: 1.4, color: 'var(--ink-dim)', marginTop: 28, maxWidth: 820 }}>{line}</div>
        </div>
        <svg viewBox={`-2 -2 ${qr.n + 4} ${qr.n + 4}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${shown}`} style={{ width: 520, height: 520, borderRadius: 18, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'block' }}>
          <rect x="-2" y="-2" width={qr.n + 4} height={qr.n + 4} fill="#fff" />
          <path d={qr.d} fill="#0b1016" />
        </svg>
      </motion.div>
    </div>
  );
}
