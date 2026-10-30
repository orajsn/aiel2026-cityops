import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Rich } from '../Rich';
import { useUiStore } from '../../engine/ui';

export const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * The wide centred panel for Lab 3's explainer pages (memory map, glass, disciplines, loop): the scene
 * steps back behind a soft scrim, the panel sits above the 3D labels (zIndexRange 30) and below Camera
 * mode (40). Used with SceneDef.overlayGroup, the panel stays put between clicks and only the headline
 * cross-fades.
 */
export function WidePanel({ kicker, message, notebook, testId, step, kickerColor, wide = false, children }: { wide?: boolean; kicker: string; message: string; notebook?: string; testId: string; step?: number; /** the kicker is red by default; a page whose one red thing is elsewhere passes teal */ kickerColor?: string; children: ReactNode }) {
  // the panel fills the stage from under the header to just above the corner buttons (owner, 29 Oct: use the space,
  // as if the caption were off); with the caption on it stops a little higher so the last line stays clear
  const scriptOpen = useUiStore((s) => s.scriptOpen);
  return (
    <div className="beat">
      <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 14, 20, 0.38)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
      {/* centred by a plain wrapper: the panel's own entrance animation owns its transform */}
      <div data-panel-frame style={{ position: 'absolute', left: 0, right: 0, top: 104, bottom: scriptOpen ? 124 : wide ? 88 : 96, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
        <motion.div
          className="beat__panel"
          data-testid={testId}
          data-step={step}
          // with a larger text size (Settings) the panel grows, but never wider than the stage
          style={{ position: 'relative', right: 'auto', top: 'auto', width: wide ? 'min(1800px, calc(1840px / var(--text-zoom, 1)))' : 'min(1480px, calc(1840px / var(--text-zoom, 1)))', height: 'calc(100% / var(--panel-zoom, 1))', maxHeight: 'none', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="beat__kicker" style={kickerColor ? { color: kickerColor } : undefined}>{kicker}</div>
          <AnimatePresence mode="wait">
            <motion.div key={message} className="beat__headline" style={{ marginBottom: 10 }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease: EASE }}>
              <Rich text={message} />
            </motion.div>
          </AnimatePresence>
          {/* the page's own content takes all the height that is left: lay it out with flex: 1 / grid rows, not fixed heights */}
          <div className="beat__body" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
          {notebook && <div className="beat__notebook">notebook · {notebook}</div>}
        </motion.div>
      </div>
    </div>
  );
}
