import { useMemo } from 'react';
import { motion } from 'motion/react';
import { LAB_LINKS } from '../content/labLinks';
import { qrPath } from '../engine/follow';

/**
 * "Open the lab": the address and its QR on the first page of each lab (src/content/labLinks.ts), top right, beside the page title's strip.
 * It comes in after the page has settled and stays for the page.
 */
export function LabLink({ sceneId }: { sceneId: string }) {
  const link = LAB_LINKS[sceneId];
  const qr = useMemo(() => (link ? qrPath(link.url) : null), [link]);
  if (!link || !qr) return null;
  const shown = link.url.replace(/^https?:\/\//, '');
  return (
    <motion.div data-lab-link className="lab-link" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
      <svg className="lab-link__qr" viewBox={`-2 -2 ${qr.n + 4} ${qr.n + 4}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${shown}`}>
        <rect x="-2" y="-2" width={qr.n + 4} height={qr.n + 4} fill="#fff" />
        <path d={qr.d} fill="#0b1016" />
      </svg>
      <div>
        <div className="lab-link__kicker">Open {link.label}</div>
        <div className="lab-link__url">{shown}</div>
      </div>
    </motion.div>
  );
}
