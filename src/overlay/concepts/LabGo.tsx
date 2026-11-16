import { useMemo } from 'react';
import { motion } from 'motion/react';
import { qrPath } from '../../engine/follow';
import { EASE } from './WidePanel';

export interface LabGoProps {
  kicker: string; lab: string; url: string; line: string;
  listed: string; covers: string; picture: string;
}

/** Editable handoff page matching the Indonesia event references. */
export function LabGo({ kicker, lab, url, line, listed, covers, picture }: LabGoProps) {
  const qr = useMemo(() => qrPath(url), [url]);
  const shown = url.replace(/^https?:\/\//, '');
  const split = listed.indexOf(': ');
  const sharedLab = lab !== 'Lab 1';
  return (
    <div className="beat" data-lab-go style={{ background: '#efeeec', color: '#202b31' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3, ease: EASE }}
        style={{ position: 'absolute', inset: 0, padding: '88px 72px 42px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1160 }}>
          <div style={{ color: '#078fa0', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>{kicker}</div>
          <h1 style={{ fontSize: 120, fontWeight: 700, lineHeight: 1.05, margin: '44px 0 30px' }}>Open {lab}</h1>
          <a data-lab-url href={url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 68, fontWeight: 700, color: '#198e9b', lineHeight: 1.15, textDecoration: 'none', pointerEvents: 'auto' }}>{shown}</a>
          <p style={{ fontSize: 46, lineHeight: 1.18, color: '#60727e', margin: '40px 0 0', maxWidth: 1040 }}>{line}</p>
        </div>
        <div style={{ position: 'absolute', right: 84, top: 48, width: 526, height: 526, padding: 40, boxSizing: 'border-box', borderRadius: 26, background: '#fff', boxShadow: '0 18px 25px rgba(0,0,0,.17)' }}>
          <svg data-lab-qr viewBox={`-4 -4 ${qr.n + 8} ${qr.n + 8}`} shapeRendering="crispEdges" role="img" aria-label={`QR code for ${shown}`} style={{ width: '100%', height: '100%', display: 'block' }}>
            <rect x="-4" y="-4" width={qr.n + 8} height={qr.n + 8} fill="#fff" />
            <path d={qr.d} fill="#000" />
          </svg>
        </div>
        <div data-lab-listed style={{ position: 'absolute', left: 72, right: 72, top: 620, height: 418, display: 'grid', gridTemplateColumns: '842px minmax(0, 1fr)', gap: 60, alignItems: 'center' }}>
          <figure style={{ margin: 0, height: 418, padding: sharedLab ? '0 32px 14px' : '14px 24px', boxSizing: 'border-box', borderRadius: 14, background: '#fff', boxShadow: '0 10px 16px rgba(0,0,0,.16)', overflow: 'hidden' }}>
            <img src={picture} alt={`The LiveLabs page: ${listed}`} style={{ display: 'block', width: '100%', height: sharedLab ? 375 : 390, objectFit: 'contain' }} />
            {sharedLab && <figcaption style={{ color: '#60727e', fontSize: 18, marginTop: 10 }}>LIVELABS START MENU</figcaption>}
          </figure>
          <div>
            <div style={{ color: '#60727e', fontSize: 28, textTransform: 'uppercase', marginBottom: 22 }}>On LiveLabs it is called</div>
            <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.16 }}>
              {split >= 0 ? <>{listed.slice(0, split + 1)}<br />{listed.slice(split + 2)}</> : listed}
            </div>
            <div style={{ color: '#0796a7', fontSize: 36, lineHeight: 1.2, marginTop: 32 }}>That is {covers}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
