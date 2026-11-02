import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FIGURES, figureUrl, firstStepOf, handsOnFor, handsOnPart, handsOnStepCount, handsOnTitle, hasRoutes, stepAt, useRouteStore, type GuideStep, type Route } from '../../content/lab1HandsOn';
import { useDrawerStore } from '../../engine/presentation';
import { useUiStore } from '../../engine/ui';

/**
 * Lab 1's Hands-on drawer (owner, 29 Oct): the same handle and slide-in as Lab 3's Jupyter drawer, with a dark panel
 * that is the ORIGINAL workshop guide for this page (src/content/lab1HandsOn.ts, text verbatim, in Thai with the L
 * key): tabs for the overview and each task, numbered steps with their expected result, code in JetBrains Mono and
 * the guide's OCI Console screenshots, which open large on a click. No red.
 *
 * Open and focus live in useDrawerStore: focus 0 is the overview, focus k is the k-th guide step overall. A clicker in
 * Presentation mode opens the drawer and walks it step by step (the guide shows the step's task, scrolls to the step and
 * marks it), then closes it and goes on (presentation.ts). A page without an entry renders
 * nothing. Hands-on 3-5 have a 3A Build | 3B Launch switch, remembered across pages (useRouteStore).
 */
const UI = {
  en: {
    kicker: 'ORIGINAL WORKSHOP GUIDE',
    overview: 'Overview',
    expected: 'Expected result',
    steps: 'steps',
    task: 'Tasks on this page',
    build: '3A Build',
    launch: '3B Launch',
    path: 'Path',
    close: 'Close',
  },
  th: {
    kicker: 'คู่มือเวิร์กช็อปฉบับจริง',
    overview: 'ภาพรวม',
    expected: 'ผลลัพธ์ที่คาดหวัง',
    steps: 'ขั้นตอน',
    task: 'งานในหน้านี้',
    build: '3A Build',
    launch: '3B Launch',
    path: 'เส้นทาง',
    close: 'ปิด',
  },
};

export function StepsDrawer({ sceneId }: { sceneId: string }) {
  const entry = handsOnFor(sceneId);
  const open = useDrawerStore((s) => s.open);
  const focus = useDrawerStore((s) => s.focus);
  const route = useRouteStore((s) => s.route);
  const lang = useUiStore((s) => s.lang);
  const { setOpen, setFocus } = useDrawerStore.getState();
  const [big, setBig] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  // a page's drawer starts closed when it appears
  useEffect(() => useDrawerStore.getState().reset(), [sceneId]);
  // the lightbox closes with Escape and when the drawer closes
  useEffect(() => {
    if (!big) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setBig(null);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [big]);
  useEffect(() => {
    if (!open) setBig(null);
  }, [open]);
  // each press scrolls the guide to its step (the overview and a new page start at the top); the step is marked in the list
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const el = focus > 0 ? (sc.querySelector('[data-now="true"]') as HTMLElement | null) : null;
    const top = el ? Math.max(0, el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 18) : 0;
    sc.scrollTo?.({ top, behavior: 'smooth' });
  }, [focus, route, open]);
  if (!entry) return null;

  const t = UI[lang];
  const th = lang === 'th';
  const { lab, tasks } = handsOnPart(entry, route);
  // the guide step the presenter is on (focus counts steps across the tasks); a path with fewer steps keeps the last in view
  const pos = stepAt(tasks, focus);
  const shown = pos ? pos.task + 1 : 0;
  const task = shown > 0 ? tasks[shown - 1] : null;
  // about 80% of the 1920 stage (owner, 29 Oct): room for each step and its screenshot side by side
  const width = 1536;
  const pickRoute = (r: Route) => {
    useRouteStore.getState().setRoute(r);
    if (useDrawerStore.getState().focus > handsOnStepCount(sceneId, r)) setFocus(handsOnStepCount(sceneId, r));
  };
  const fig = big ? FIGURES[big] : null;

  return (
    <div className={`hd${th ? ' hd--th' : ''}`} data-testid="handson-drawer" lang={lang}>
      {!open && (
        <motion.button
          type="button"
          className="jd__tab hd__tab"
          aria-label={`Open ${entry.tab}`}
          onClick={() => setOpen(true)}
          initial={{ x: -56, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span className="hd__icon" aria-hidden />
          <span className="jd__tab-text">
            <b>{entry.tab}</b>
            <span>{entry.tabSub}</span>
          </span>
        </motion.button>
      )}
      <AnimatePresence>
        {open && <motion.div key="dim" className="hd__dim" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />}
        {open && (
          <motion.div
            key="panel"
            className="hd__panel"
            role="dialog"
            aria-label={handsOnTitle(entry, lab)}
            style={{ width }}
            initial={{ x: -width - 80 }}
            animate={{ x: 0 }}
            exit={{ x: -width - 80 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button type="button" className="hd__close" aria-label={`Close ${entry.tab}`} onClick={() => setOpen(false)}>
              ✕
            </button>
            <div className="hd__head">
              <div className="hd__kicker">{t.kicker}</div>
              <div className="hd__title">{handsOnTitle(entry, lab)}</div>
              {hasRoutes(entry) && (
                <div className="hd__routes" role="radiogroup" aria-label={t.path}>
                  {(['3a', '3b'] as Route[]).map((r) => (
                    <button key={r} type="button" role="radio" aria-checked={route === r} className={`hd__route${route === r ? ' is-on' : ''}`} data-route={r} onClick={() => pickRoute(r)}>
                      {r === '3a' ? t.build : t.launch}
                    </button>
                  ))}
                </div>
              )}
              <div className="hd__tabs" role="tablist">
                <button type="button" role="tab" aria-selected={shown === 0} className={`hd__ttab${shown === 0 ? ' is-on' : ''}`} data-task={0} onClick={() => setFocus(0)}>
                  {t.overview}
                </button>
                {tasks.map((k, i) => (
                  <button
                    key={k.id}
                    type="button"
                    role="tab"
                    aria-selected={shown === i + 1}
                    className={`hd__ttab${shown === i + 1 ? ' is-on' : ''}`}
                    data-task={i + 1}
                    title={th ? k.title_th : k.title_en}
                    onClick={() => setFocus(firstStepOf(tasks, i))}
                  >
                    {taskLabel(th ? k.title_th : k.title_en)}
                  </button>
                ))}
              </div>
            </div>
            <div className="hd__zoom" ref={scroller}>
              {!task && (
                <div className="hd__overview">
                  <p className="hd__intro">{th ? lab.intro_th : lab.intro_en}</p>
                  <div className="hd__olabel">{t.task}</div>
                  {tasks.map((k, i) => (
                    <button key={k.id} type="button" className="hd__orow" onClick={() => setFocus(firstStepOf(tasks, i))}>
                      <span className="hd__otitle">{th ? k.title_th : k.title_en}</span>
                      <span className="hd__ocount">
                        {k.steps.length} {t.steps}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {task && (
                <div className="hd__task" data-task-id={task.id}>
                  <h2 className="hd__ttitle">{th ? task.title_th : task.title_en}</h2>
                  <ol className="hd__steps">
                    {task.steps.map((s, i) => (
                      <Step key={s.id} s={s} n={i + 1} th={th} expected={t.expected} onImage={setBig} now={pos?.step === i} />
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {open && fig && (
          <motion.div
            key="lightbox"
            className="hd__lb"
            role="dialog"
            aria-label={th ? fig.caption_th : fig.caption_en}
            onClick={() => setBig(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <figure className="hd__lbfig">
              <img src={figureUrl(fig.id)} alt={th ? fig.caption_th : fig.caption_en} />
              <figcaption>{th ? fig.caption_th : fig.caption_en}</figcaption>
            </figure>
            <button type="button" className="hd__close hd__lbclose" aria-label={t.close} onClick={() => setBig(null)}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** a tab's short label: the guide's "Task 2 Create the…" or "Task 2A — Build…" becomes "Task 2" / "Task 2A" (งานที่ 2 in Thai) */
function taskLabel(title: string): string {
  const m = title.match(/^(Task\s+\w+|งานที่\s+\w+)/);
  return m ? m[1] : title;
}

function Step({ s, n, th, expected, onImage, now }: { s: GuideStep; n: number; th: boolean; expected: string; onImage(id: string): void; now: boolean }) {
  const exp = th ? s.expected_th : s.expected_en;
  return (
    <li className={`hd__step${s.images.length ? ' hd__step--shots' : ''}${now ? ' is-now' : ''}`} data-step-id={s.id} data-now={now}>
      <div className="hd__n">{n}</div>
      <div className="hd__body">
        <div className="hd__text">
          <p className="hd__st">{th ? s.th : s.en}</p>
          {s.code.map((c, j) => (
            <pre key={j} className="hd__code">
              {c}
            </pre>
          ))}
          {exp && (
            <p className="hd__exp">
              <b>{expected}:</b> {exp}
            </p>
          )}
        </div>
        {s.images.length > 0 && (
          <div className="hd__shots">
            {s.images.map((id) => {
              const f = FIGURES[id];
              const cap = th ? f.caption_th : f.caption_en;
              return (
                <button key={id} type="button" className="hd__shot" data-figure={id} aria-label={cap} onClick={() => onImage(id)}>
                  <img src={figureUrl(id)} alt={cap} loading="lazy" decoding="async" />
                  <span>{cap}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );
}
