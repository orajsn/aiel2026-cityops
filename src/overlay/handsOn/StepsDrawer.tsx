import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { handsOnFor, type HandsOnLine } from '../../content/lab1HandsOn';
import { useDrawerStore } from '../../engine/presentation';

/**
 * Lab 1's Hands-on drawer (owner, 29 Oct): the same handle and slide-in as Lab 3's Jupyter drawer, with a dark panel
 * of the hands-on's steps (src/content/lab1HandsOn.ts). Code in JetBrains Mono, the key line in teal, values in a cool
 * light tint; no red. Open and focus live in useDrawerStore, so a clicker in Presentation mode opens it, walks its
 * steps and closes it (presentation.ts). A page without an entry renders nothing.
 */
export function StepsDrawer({ sceneId }: { sceneId: string }) {
  const entry = handsOnFor(sceneId);
  const open = useDrawerStore((s) => s.open);
  const focus = useDrawerStore((s) => s.focus);
  const { setOpen, setFocus } = useDrawerStore.getState();
  const stepRefs = useRef(new Map<number, HTMLDivElement>());
  // a page's drawer starts closed when it appears
  useEffect(() => useDrawerStore.getState().reset(), [sceneId]);
  // the step in focus scrolls into view, whoever moved it (a click here or the clicker)
  useEffect(() => {
    if (focus > 0) stepRefs.current.get(focus)?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [focus, open]);
  if (!entry) return null;
  const width = entry.width ?? 900;

  return (
    <div className="hd" data-testid="handson-drawer">
      {!open && (
        <motion.button type="button" className="jd__tab hd__tab" aria-label={`Open ${entry.tab}`} onClick={() => setOpen(true)} initial={{ x: -56, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <span className="hd__icon" aria-hidden />
          <span className="jd__tab-text">
            <b>{entry.tab}</b>
            <span>{entry.tabSub}</span>
          </span>
        </motion.button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div key="dim" className="hd__dim" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
        )}
        {open && (
          <motion.div key="panel" className={`hd__panel${entry.compact ? ' hd__panel--compact' : ''}`} role="dialog" aria-label={entry.title} style={{ width }} initial={{ x: -width - 80 }} animate={{ x: 0 }} exit={{ x: -width - 80 }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}>
            <button type="button" className="hd__close" aria-label={`Close ${entry.tab}`} onClick={() => setOpen(false)}>
              ✕
            </button>
            <div className="hd__zoom">
              <div className="hd__kicker">{entry.kicker}</div>
              <div className="hd__title">{entry.title}</div>
              <div className="hd__sub">{entry.sub}</div>
              <div className="hd__steps">
                {entry.steps.map((s, i) => (
                  <div
                    key={i}
                    ref={(el) => (el ? stepRefs.current.set(i + 1, el) : stepRefs.current.delete(i + 1))}
                    className={`hd__step${focus === i + 1 ? ' is-on' : ''}`}
                    data-step={i + 1}
                    onClick={() => setFocus(i + 1)}
                  >
                    <div className="hd__n">{i + 1}</div>
                    <div className="hd__body">
                      <div className="hd__st">
                        {s.clip && <Clip />}
                        {s.title}
                      </div>
                      {s.code && (
                        <div className="hd__code">
                          {s.code.map((l, j) => (
                            <Line key={j} l={l} />
                          ))}
                        </div>
                      )}
                      {s.note && <div className="hd__note">{s.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Line({ l }: { l: HandsOnLine }) {
  return (
    <div className={`hd__line${l.k ? ' hd__line--key' : ''}${l.c ? ' hd__line--c' : ''}`} data-key={l.k ? '' : undefined}>
      {l.t}
      {l.v && <span className="hd__v">{l.v}</span>}
      {l.after}
      {/* an empty line keeps its height */}
      {!l.t && !l.v && !l.after && ' '}
    </div>
  );
}

function Clip() {
  return (
    <svg className="hd__clip" width="16" height="18" viewBox="0 0 16 18" aria-label="attach">
      <path d="M11 5v7a3 3 0 0 1-6 0V4a2 2 0 0 1 4 0v7a1 1 0 0 1-2 0V5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
