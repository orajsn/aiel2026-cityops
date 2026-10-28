import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Rich } from '../Rich';

export const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * The wide centred panel for Lab 3's explainer pages (memory map, glass, disciplines, loop): the scene
 * steps back behind a soft scrim, the panel sits above the 3D labels (zIndexRange 30) and below Camera
 * mode (40). Used with SceneDef.overlayGroup, the panel stays put between clicks and only the headline
 * cross-fades.
 */
export function WidePanel({ kicker, message, notebook, testId, step, children }: { kicker: string; message: string; notebook?: string; testId: string; step?: number; children: ReactNode }) {
  return (
    <div className="beat">
      <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 14, 20, 0.38)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      {/* centred by a plain wrapper: the panel's own entrance animation owns its transform */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 104, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
        <motion.div
          className="beat__panel"
          data-testid={testId}
          data-step={step}
          // with a larger text size (Settings) the panel grows, but never wider than the stage
          style={{ position: 'relative', right: 'auto', top: 'auto', width: 'min(1480px, calc(1840px / var(--text-zoom, 1)))', maxHeight: 'none' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="beat__kicker">{kicker}</div>
          <AnimatePresence mode="wait">
            <motion.div key={message} className="beat__headline" style={{ marginBottom: 10 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease: EASE }}>
              <Rich text={message} />
            </motion.div>
          </AnimatePresence>
          {children}
          {notebook && <div className="beat__notebook">notebook · {notebook}</div>}
        </motion.div>
      </div>
    </div>
  );
}
