import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LAB_STOPS, stopCells, todoLines, type StopCell } from '../../content/labStops';
import { NotebookMarkdown, PythonCode } from './NotebookMarkdown';

/** cells longer than this show their first lines and fold the rest */
const FOLD_AT = 16;
const FOLD_SHOW = 10;

const BADGE: Record<string, string> = { run: 'run', todo: 'fill in, then run', check: 'checkpoint', skip: 'skip' };

/**
 * The lab guide's Jupyter drawer. On a page with a stop (src/content/labStops.ts) a handle waits on the screen's left edge;
 * opening it slides in a JupyterLab-looking notebook: the same cells the audience has open, in order, with the
 * ones to run numbered, the TODO marked, and the line each prints when it worked. "Next cell" walks the room
 * through them one by one.
 */
export function JupyterDrawer({ sceneId }: { sceneId: string }) {
  const stop = LAB_STOPS[sceneId];
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(0);
  const [unfolded, setUnfolded] = useState<Set<number>>(new Set());
  const cellRefs = useRef(new Map<number, HTMLDivElement>());
  if (!stop) return null;

  const cells = stopCells(stop);
  const runs = cells.filter((c) => c.run);
  // the room is done when the last cell has run: its success line if it prints one
  const last = runs[runs.length - 1];
  const cellWord = runs.length === 1 ? 'cell' : 'cells';

  const goTo = (run: number) => {
    setFocus(run);
    const c = runs.find((r) => r.run === run);
    if (c) cellRefs.current.get(c.index)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

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
                {runs.map((r) => (
                  <button key={r.run} type="button" className={`jd__step jd__step--${r.mark!.role}${focus === r.run ? ' is-on' : ''}`} onClick={() => goTo(r.run!)}>
                    {r.run}
                  </button>
                ))}
                <button type="button" className="jd__next" onClick={() => goTo(Math.min(runs.length, focus + 1))} disabled={focus >= runs.length}>
                  {focus === 0 ? 'Start ↓' : 'Next cell ↓'}
                </button>
              </div>
            </div>
            <div className="jd__nb">
              {cells.map((c) => (
                <Cell
                  key={c.index}
                  c={c}
                  focused={!!c.run && c.run === focus}
                  folded={c.cell.type === 'code' && c.mark?.role !== 'todo' && !unfolded.has(c.index) && c.cell.source.split('\n').length > FOLD_AT}
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

function Cell({ c, focused, folded, onUnfold, onPick, refFn }: { c: StopCell; focused: boolean; folded: boolean; onUnfold(): void; onPick(): void; refFn(el: HTMLDivElement | null): void }) {
  const role = c.mark?.role;
  if (c.cell.type !== 'code') {
    return (
      <div className="jd__cell jd__cell--md" ref={refFn}>
        <div className="jd__prompt" />
        <NotebookMarkdown source={c.cell.source} />
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
          <PythonCode source={shown} marked={role === 'todo' ? todoLines(shown.split('\n'), c.mark!.todo!) : undefined} />
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
