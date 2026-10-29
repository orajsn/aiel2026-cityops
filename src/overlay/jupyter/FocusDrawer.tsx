import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LAB2, LAB_STOPS, screenSafe } from '../../content/labStops';
import { LAB2_FOCUS, type FocusStep } from '../../content/lab2Focus';
import { focusNext, focusPrev, useDrawerStore } from '../../engine/presentation';
import { NotebookMarkdown, PythonCode, codeLines, linePieces } from './NotebookMarkdown';

/** cells longer than this show their first lines and fold the rest, unless the page points into them */
const FOLD_AT = 16;
const FOLD_SHOW = 10;

/** a line's place in the focus: the step it belongs to, and whether that step is the one on screen or an earlier one */
interface LineMark {
  step: number;
  /** its callout number, as the picture numbers it */
  n: number;
  now: boolean;
}

/** the 0-based lines a step lights: its ranges, or the whole cell */
export function stepLines(step: FocusStep, lineCount: number): number[] {
  const ranges = step.lines ?? [[1, lineCount]];
  return ranges.flatMap(([a, b]) => Array.from({ length: Math.max(0, Math.min(b, lineCount) - a + 1) }, (_, i) => a - 1 + i));
}

/** a cell's source as the drawer shows it: the screen-safe text, without the empty line after the last one */
const sourceOf = (cell: number) => screenSafe(LAB2.cells[cell]?.source ?? '').replace(/\n$/, '');

/** the line a cell prints when it ran: the lab guide's success line when there is one, else its own ok() or print() */
export function savedOutput(cell: number): string | undefined {
  for (const stop of Object.values(LAB_STOPS)) {
    if (stop.notebook !== LAB2) continue;
    const expect = stop.marks.find((m) => m.cell === cell)?.expect;
    if (expect) return expect;
  }
  const m = LAB2.cells[cell]?.source.match(/(?:ok|print)\(\s*f?(?:"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)')/);
  return m ? screenSafe((m[1] ?? m[2]).replace(/\{[^}]*\}/g, '…')) : undefined;
}

/** the notebook's section a cell sits in, by the nearest numbered heading above it: "1.2 Embed a query in-database" */
export function sectionOf(cell: number): { num: string; title: string } | undefined {
  for (let i = cell; i >= 0; i--) {
    const c = LAB2.cells[i];
    if (c?.type !== 'markdown') continue;
    const h = c.source.match(/^#{1,4}\s+(?:OPTIONAL:\s*)?(?:Section\s+)?(\d+(?:\.\d+)?)\b[:.]?\s*(.*)$/m);
    if (h) return { num: h[1], title: h[2].trim() };
  }
  return undefined;
}

/**
 * Lab 2's notebook focus (src/content/lab2Focus.ts): the whole notebook in the JupyterLab look, and on each Next
 * the drawer scrolls to the step's cell and lights its lines in teal, a numbered callout (the picture's number) and
 * its label above, its "Here:" note below, the saved output when the step asks. Earlier steps stay as a faint band
 * with a small number; the rest of the cell steps back. Open and focus live in useDrawerStore, so the arrows, the
 * clicker and the on-screen buttons all walk the same line (presentation.ts: focusNext, focusPrev).
 */
export function FocusDrawer({ sceneId }: { sceneId: string }) {
  const steps = LAB2_FOCUS[sceneId];
  const stop = LAB_STOPS[sceneId];
  const open = useDrawerStore((s) => s.open);
  const focus = useDrawerStore((s) => s.focus);
  const nbRef = useRef<HTMLDivElement>(null);
  const [unfolded, setUnfolded] = useState<Set<number>>(new Set());
  const current = open && focus > 0 ? steps[focus - 1] : undefined;
  // a page's drawer starts closed when it appears (unless Back from the page after resumes it: presentation.ts)
  useEffect(() => useDrawerStore.getState().reset(), [sceneId]);

  // the callout in focus comes into view, whoever moved it: smooth, a little above the middle
  useEffect(() => {
    if (!open || !focus) return;
    nbRef.current?.querySelector(`[data-callout="${focus}"]`)?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }, [focus, open]);

  const pointed = new Set(steps.map((s) => s.cell));
  // per cell, per line: the latest step up to now that lights it
  const marks = new Map<number, Map<number, LineMark>>();
  steps.slice(0, open ? focus : 0).forEach((s, i) => {
    const m = marks.get(s.cell) ?? new Map<number, LineMark>();
    for (const l of stepLines(s, sourceOf(s.cell).split('\n').length)) m.set(l, { step: i + 1, n: s.n, now: i + 1 === focus });
    marks.set(s.cell, m);
  });
  const section = sectionOf(current?.cell ?? steps[0].cell);
  const last = focus >= steps.length;

  return (
    <div className="jd jd--focus" data-testid="jupyter-drawer">
      {!open && (
        <motion.button type="button" className="jd__tab" aria-label="Open in Jupyter" onClick={() => focusNext()} initial={{ x: -56, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <span className="jd__logo" aria-hidden />
          <span className="jd__tab-text">
            <b>In the notebook</b>
            <span>
                            {steps.length} {steps.length === 1 ? 'step' : 'steps'}
            </span>
          </span>
        </motion.button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div className="jd__panel" initial={{ x: -1560, opacity: 0.6 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -1560, opacity: 0.6 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
            <div className="jd__bar">
              <span className="jd__logo" aria-hidden />
              <span className="jd__file">{LAB2.file}</span>
              <span className="jd__kernel">Python 3 (ipykernel) ○</span>
              <button type="button" className="jd__close" aria-label="Close Jupyter" onClick={() => useDrawerStore.getState().setOpen(false)}>
                ✕
              </button>
            </div>
            <div className="jd__brief jd__brief--focus">
              <div className="jd__where">{stop?.where ?? (section ? `${section.num} ${section.title}` : 'In the notebook')}</div>
              <div className="jd__steps">
                {steps.map((s, i) => (
                  <button key={i} type="button" title={s.label} className={`jd__step${i + 1 === focus ? ' is-on' : i + 1 < focus ? ' is-past' : ''}`} onClick={() => useDrawerStore.getState().setFocus(i + 1)}>
                    {s.n}
                  </button>
                ))}
                <span className="jd__now" data-testid="focus-label">
                  {current?.label}
                </span>
                <button type="button" className="jd__back" onClick={() => focusPrev()}>
                  ‹ Back
                </button>
                <button type="button" className="jd__next" onClick={() => focusNext()}>
                  {last ? 'Close · next page ›' : 'Next ↓'}
                </button>
              </div>
            </div>
            <div className="jd__nb" ref={nbRef}>
              {LAB2.cells.map((cell, i) => {
                if (cell.type !== 'code') {
                  return (
                    <div key={i} className="jd__cell jd__cell--md">
                      <div className="jd__prompt" />
                      <NotebookMarkdown source={screenSafe(cell.source)} />
                    </div>
                  );
                }
                const src = sourceOf(i);
                const folded = !pointed.has(i) && !unfolded.has(i) && src.split('\n').length > FOLD_AT;
                const lit = marks.get(i);
                // the outputs the steps so far have revealed for this cell
                const out = steps.some((s, k) => k < focus && open && s.cell === i && s.output) ? savedOutput(i) : undefined;
                return (
                  <div key={i} className={`jd__cell jd__cell--code${current?.cell === i ? ' is-focus' : ''}`} data-cell={i}>
                    <div className="jd__prompt">
                      <span className="jd__in">[ ]:</span>
                    </div>
                    <div className="jd__body">
                      <div className="jd__input">
                        {lit ? (
                          <FocusCode source={src} marks={lit} step={current?.cell === i ? current : undefined} focus={focus} />
                        ) : (
                          <PythonCode source={folded ? src.split('\n').slice(0, FOLD_SHOW).join('\n') : src} />
                        )}
                        {folded && (
                          <button type="button" className="jd__fold" onClick={() => setUnfolded(new Set(unfolded).add(i))}>
                            ▾ {src.split('\n').length - FOLD_SHOW} more lines
                          </button>
                        )}
                      </div>
                      {out && (
                        <div className="jd__out jd__out--saved" data-output="saved">
                          <span className="jd__out-label">Saved output</span>
                          <span className="jd__ok">✓ {out}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** a cell the focus has reached: its lit lines, the callouts in a gutter, the label above the step on screen and its note below */
function FocusCode({ source, marks, step, focus }: { source: string; marks: Map<number, LineMark>; step?: FocusStep; focus: number }) {
  const lines = codeLines(source);
  const nowLines = [...marks].filter(([, m]) => m.now).map(([l]) => l);
  const first = nowLines.length ? Math.min(...nowLines) : -1;
  const lastLine = nowLines.length ? Math.max(...nowLines) : -1;
  // an earlier step's number sits on the first line it lit
  const firstOf = new Map<number, LineMark & { line: number }>();
  for (const [l, m] of marks) if (!m.now && (!firstOf.has(m.step) || l < firstOf.get(m.step)!.line)) firstOf.set(m.step, { ...m, line: l });
  const pastAt = new Map([...firstOf.values()].map((m) => [m.line, m.n]));
  return (
    <pre className={`jd__code jd__code--focus${step ? ' has-now' : ''}`}>
      {lines.map((line, i) => {
        const m = marks.get(i);
        return (
          <Fragment key={i}>
            {step && i === first && (
              <span className="jd__fl jd__fl--label" data-callout={focus}>
                <span className="jd__gut">
                  <i className="jd__callout">{step.n}</i>
                </span>
                <span className="jd__label">{step.label}</span>
              </span>
            )}
            <span data-line={i + 1} className={`jd__fl${m ? (m.now ? ' is-now' : ' is-past') : ''}`}>
              <span className="jd__gut">{pastAt.has(i) && <i className="jd__callout jd__callout--past">{pastAt.get(i)}</i>}</span>
              <span className="jd__lt">
                {linePieces(line)}
                {'\n'}
              </span>
            </span>
            {step?.note && i === lastLine && (
              <span className="jd__fl jd__fl--here">
                <span className="jd__gut" />
                <span className="jd__here">
                  ▲ <b>Here:</b> {step.note}
                </span>
              </span>
            )}
          </Fragment>
        );
      })}
    </pre>
  );
}
