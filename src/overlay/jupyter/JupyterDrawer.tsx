import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LAB_STOPS, stopCells, todoLines, type StopCell } from '../../content/labStops';
import { NotebookMarkdown, PythonCode } from './NotebookMarkdown';
import { useDrawerStore } from '../../engine/presentation';
import { guideSteps, partLines, type GuideStep } from '../../content/labGuide';

/** cells longer than this show their first lines and fold the rest */
const FOLD_AT = 16;
const FOLD_SHOW = 10;

const BADGE: Record<string, string> = { run: 'run', todo: 'fill in, then run', check: 'checkpoint', skip: 'skip' };

/**
 * The lab guide's Jupyter drawer. On a page with a stop (src/content/labStops.ts) a handle waits on the screen's left edge;
 * opening it slides in a JupyterLab-looking notebook: the same cells the audience has open, in order, with the
 * ones to run numbered, the TODO marked, and the line each prints when it worked. "Next cell" walks the room
 * through them one by one. Open and focus live in useDrawerStore, so a clicker in Presentation mode walks the
 * same drawer (presentation.ts).
 *
 * A page with a guide (labGuide.ts) steps through the notebook's sections instead: each step lands on the section's
 * heading with a note for the room, and a long cell's parts are stepped through inside the code, their lines
 * highlighted and their note pinned at the top.
 */
export function JupyterDrawer({ sceneId }: { sceneId: string }) {
  const stop = LAB_STOPS[sceneId];
  const open = useDrawerStore((s) => s.open);
  const focus = useDrawerStore((s) => s.focus);
  const { setOpen, setFocus } = useDrawerStore.getState();
  const [unfolded, setUnfolded] = useState<Set<number>>(new Set());
  const cellRefs = useRef(new Map<number, HTMLDivElement>());
  // a page's drawer starts closed when it appears
  useEffect(() => useDrawerStore.getState().reset(), [sceneId]);
  const cells = stop ? stopCells(stop) : [];
  const runs = cells.filter((c) => c.run);
  const steps = guideSteps(sceneId);
  const guided = steps.length > 0;
  const total = guided ? steps.length : runs.length;
  const step: GuideStep | undefined = guided && focus > 0 ? steps[focus - 1] : undefined;
  const lines = step?.part ? stop!.notebook.cells[step.block.cell].source.split('\n') : [];
  const range = step?.part ? partLines(lines, step.part, step.block.parts) : null;
  // what is in focus scrolls into view, whoever moved it (a click here or the clicker): a cell to run; in a
  // guide, a section's heading, or the first line of a part inside its code
  useEffect(() => {
    if (step) {
      const el = range
        ? cellRefs.current.get(step.block.cell)?.querySelector(`[data-line="${range.start}"]`)
        : cellRefs.current.get(step.block.cell - 1);
      el?.scrollIntoView?.({ behavior: 'smooth', block: range ? 'center' : 'start' });
      return;
    }
    const c = runs.find((r) => r.run === focus);
    if (c) cellRefs.current.get(c.index)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, open]);
  if (!stop) return null;

  // the room is done when the last cell has run: its success line if it prints one
  const last = runs[runs.length - 1];
  const cellWord = runs.length === 1 ? 'cell' : 'cells';

  const goTo = (run: number) => setFocus(run);

  return (
    <div className="jd" data-testid="jupyter-drawer">
      {!open && (
        <motion.button type="button" className="jd__tab" aria-label="Run in Jupyter" onClick={() => setOpen(true)} initial={{ x: -56, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <span className="jd__logo" aria-hidden />
          <span className="jd__tab-text">
            <b>Run in Jupyter</b>
            <span>
              {runs.length} {cellWord} · {stop.minutes}
              {stop.optional ? ' · optional' : ''}
            </span>
          </span>
        </motion.button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div className="jd__panel" initial={{ x: -880, opacity: 0.6 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -880, opacity: 0.6 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
            <div className="jd__bar">
              <span className="jd__logo" aria-hidden />
              <span className="jd__file">{stop.notebook.file}</span>
              <span className="jd__kernel">Python 3 (ipykernel) ○</span>
              <button type="button" className="jd__close" aria-label="Close Jupyter" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <div className="jd__brief">
              <div className="jd__where">{stop.where}</div>
              <div className="jd__todo-line">
                {stop.optional && <span className="jd__optional">Optional section: run it if there is time. </span>}
                Run <b>
                  {runs.length} {cellWord}
                </b>
                , top to bottom.{' '}
                {last?.mark?.expect ? (
                  <>
                    Done when you see <span className="jd__ok">✓ {last.mark.expect}</span>
                  </>
                ) : (
                  <>Done when cell {last?.run} has run.</>
                )}
              </div>
              <div className="jd__steps">
                {guided
                  ? // a chip per section: its number, the full name on hover
                    steps.map((s, i) =>
                      s.part ? null : (
                        <button key={s.block.title} type="button" title={s.block.title} className={`jd__step jd__step--section${step?.block === s.block ? ' is-on' : ''}`} onClick={() => goTo(i + 1)}>
                          {s.block.title.split(' ')[0]}
                        </button>
                      ),
                    )
                  : runs.map((r) => (
                      <button key={r.run} type="button" className={`jd__step jd__step--${r.mark!.role}${focus === r.run ? ' is-on' : ''}`} onClick={() => goTo(r.run!)}>
                        {r.run}
                      </button>
                    ))}
                <button type="button" className="jd__next" onClick={() => goTo(Math.min(total, focus + 1))} disabled={focus >= total}>
                  {focus === 0 ? 'Start ↓' : guided ? 'Next ↓' : 'Next cell ↓'}
                </button>
              </div>
            </div>
            <div className="jd__nb">
              {/* a part's note stays pinned at the top while the code scrolls under it */}
              {step?.part && (
                <div className="jd__note jd__note--pinned" data-guide-note>
                  <b>
                    {step.block.title.split(' ')[0]} · {step.part.label}
                  </b>
                  <span>{step.part.note}</span>
                </div>
              )}
              {cells.map((c) => (
                <Cell
                  key={c.index}
                  c={c}
                  focused={guided ? step?.block.cell === c.index : !!c.run && c.run === focus}
                  note={step && !step.part && step.block.cell - 1 === c.index ? step.block : undefined}
                  guideLines={range && step?.block.cell === c.index ? range : undefined}
                  folded={
                    c.cell.type === 'code' &&
                    c.mark?.role !== 'todo' &&
                    !unfolded.has(c.index) &&
                    // a long cell being stepped through opens up
                    !(step?.block.cell === c.index && step.block.parts) &&
                    c.cell.source.split('\n').length > FOLD_AT
                  }
                  onUnfold={() => setUnfolded(new Set(unfolded).add(c.index))}
                  onPick={() => c.run && setFocus(c.run)}
                  refFn={(el) => (el ? cellRefs.current.set(c.index, el) : cellRefs.current.delete(c.index))}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Cell({ c, focused, folded, note, guideLines, onUnfold, onPick, refFn }: { c: StopCell; focused: boolean; folded: boolean; note?: GuideStep['block']; guideLines?: { start: number; end: number }; onUnfold(): void; onPick(): void; refFn(el: HTMLDivElement | null): void }) {
  const role = c.mark?.role;
  if (c.cell.type !== 'code') {
    return (
      <div className={`jd__cell jd__cell--md${note ? ' is-focus' : ''}`} ref={refFn}>
        <div className="jd__prompt" />
        <div>
          <NotebookMarkdown source={c.cell.source} />
          {/* a guide's section: what it does, why, and what to look for, under its heading */}
          {note && (
            <div className="jd__note" data-guide-note>
              <span>{note.note}</span>
              {note.lookFor && <span className="jd__ok">✓ look for: {note.lookFor}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
  const lines = c.cell.source.split('\n');
  const shown = folded ? lines.slice(0, FOLD_SHOW).join('\n') : c.cell.source;
  return (
    <div ref={refFn} className={`jd__cell jd__cell--code${role ? ` jd__cell--${role}` : ''}${focused ? ' is-focus' : ''}`} data-role={role} onClick={onPick}>
      <div className="jd__prompt">
        {c.run && (
          <span className="jd__num" data-run={c.run}>
            {c.run}
          </span>
        )}
        <span className="jd__in">[ ]:</span>
      </div>
      <div className="jd__body">
        {role && (
          <div className={`jd__badge jd__badge--${role}`}>
            {role === 'todo' ? `TODO ${c.mark!.todo} · ` : ''}
            {BADGE[role]}
          </div>
        )}
        {c.mark?.say && <div className="jd__say">{c.mark.say}</div>}
        <div className="jd__input">
          <PythonCode
            source={shown}
            marked={
              guideLines
                ? new Set(Array.from({ length: guideLines.end - guideLines.start }, (_, i) => guideLines.start + i))
                : role === 'todo'
                  ? todoLines(shown.split('\n'), c.mark!.todo!)
                  : undefined
            }
            tone={guideLines ? 'guide' : 'todo'}
          />
          {folded && (
            <button type="button" className="jd__fold" onClick={(e) => (e.stopPropagation(), onUnfold())}>
              ▾ {lines.length - FOLD_SHOW} more lines
            </button>
          )}
        </div>
        {c.mark?.expect && (
          <div className="jd__out">
            <span className="jd__ok">✓ {c.mark.expect}</span>
            <span className="jd__out-label">you should see</span>
          </div>
        )}
      </div>
    </div>
  );
}
