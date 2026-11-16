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
  /** the title LiveLabs shows for this address, which differs from our lab names */
  listed: string;
  /** the lab(s) on our slides that the LiveLabs title covers */
  covers: string;
  /** a screenshot of that LiveLabs page, so people know what they will land on */
  picture: string;
}

export function LabGo({ kicker, lab, url, line, listed, covers, picture }: LabGoProps) {
  const qr = useMemo(() => qrPath(url), [url]);
  const shown = url.replace(/^https?:\/\//, '');
  return (
    <div className="beat" data-lab-go>
      <motion.div
        className="beat__panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ left: 220, right: 220, top: 110, bottom: 96, width: 'auto', maxHeight: 'none', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', columnGap: 90, padding: '40px 70px', rowGap: 34 }}
      >
        <div>
          <div className="beat__kicker" style={{ color: 'var(--teal)' }}>{kicker}</div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, color: 'var(--ink)', margin: '6px 0 20px' }}>Open {lab}</div>
          <div data-lab-url style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 600, color: 'var(--teal)', lineHeight: 1.15, whiteSpace: 'nowrap' }}>{shown}</div>
          <div style={{ fontSize: 34, lineHeight: 1.4, color: 'var(--ink-dim)', marginTop: 28, maxWidth: 820 }}>{line}</div>
        </div>
        <svg viewBox={`-2 -2 ${qr.n + 4} ${qr.n + 4}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${shown}`} style={{ width: 400, height: 400, borderRadius: 18, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'block' }}>
          <rect x="-2" y="-2" width={qr.n + 4} height={qr.n + 4} fill="#fff" />
          <path d={qr.d} fill="#0b1016" />
        </svg>
        <div data-lab-listed style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 44 }}>
          <img src={picture} alt={`The LiveLabs page: ${listed}`} style={{ width: 640, flex: 'none', borderRadius: 10, border: '1.5px solid var(--line, rgba(0,0,0,0.16))', boxShadow: '0 6px 22px rgba(0,0,0,0.16)' }} />
          <div>
            <div style={{ fontSize: 22, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim)' }}>Source workshop on LiveLabs</div>
            <div style={{ fontSize: 36, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25, margin: '6px 0 8px' }}>{listed}</div>
            <div style={{ fontSize: 28, color: 'var(--teal)' }}>That is {covers}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
