import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Rich } from '../../Rich';
import { LAB2, screenSafe } from '../../../content/labStops';
import { NB_PAGES, type NbStep } from '../../../content/lab2Notebook';
import { savedOutput } from '../../jupyter/FocusDrawer';
import { codeLines } from '../../jupyter/NotebookMarkdown';
import { EASE, WidePanel } from '../WidePanel';
import { Fill } from '../Fill';

/**
 * A notebook page of the Harbor Bridge deck (the blue pages), in the language of Lab 3's pages 3.4 to 3.5: three
 * columns, "in everyday life" (our picture and one sentence), "at Harbor Bridge" (two or three numbered steps joined
 * by a dotted line with a light running down it), and the notebook, where only the KEY lines are shown and the lines
 * of the step being explained are lit. A line is drawn, with a dot travelling along it, from the step on the left to
 * the lit lines on the right whenever the step changes (owner, 30 Oct).
 */

const TEAL = 'var(--teal)';
const TOKEN_COLOR: Record<string, string> = { kw: '#7fd4e0', builtin: '#9bdc9b', str: '#f0b27a', comment: '#7f8c99', num: '#e6d28a', def: '#ffffff', deco: '#d3a8ff' };
const label = { fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: 'var(--ink-dim)', textTransform: 'uppercase' as const, marginBottom: 16 };

const sourceOf = (cell: number) => screenSafe(LAB2.cells[cell]?.source ?? '').replace(/\n$/, '');

/** the 0-based lines a step lights */
const litOf = (s: NbStep, count: number) => s.lines.flatMap(([a, b]) => Array.from({ length: Math.max(0, Math.min(b, count) - a + 1) }, (_, i) => a - 1 + i));

/** the runs of lines the excerpt shows: the lit ones with one line of context, short gaps closed, the rest folded as ⋮ */
function runs(lit: number[], count: number, cap = 17): [number, number][] {
  const sorted = [...new Set(lit)].sort((a, b) => a - b);
  const out: [number, number][] = [];
  for (const l of sorted) {
    const a = Math.max(0, l - 1);
    const b = Math.min(count - 1, l + 1);
    const last = out[out.length - 1];
    if (last && a <= last[1] + 2) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  // keep within the cap: trim the tail of the last run first
  let total = out.reduce((n, [a, b]) => n + b - a + 1, 0);
  while (total > cap && out.length) {
    const last = out[out.length - 1];
    if (last[1] > last[0]) { last[1]--; total--; } else { out.pop(); total--; }
  }
  return out;
}

export interface NotebookPageProps {
  id: string;
  kicker: string;
  message: string;
  /** which step is being explained (1-based) */
  step: number;
  notebook?: string;
  everyday: { art: ReactNode; caption: ReactNode };
}

export function NotebookPage({ id, kicker, message, step, notebook, everyday }: NotebookPageProps) {
  const page = NB_PAGES[id];
  const k = Math.min(Math.max(step, 1), page.steps.length);
  const now = page.steps[k - 1];
  const cell = now.cell ?? page.cell;
  const lines = codeLines(sourceOf(cell));
  const lit = litOf(now, lines.length);
  const litSet = new Set(lit);
  const shown = runs(lit, lines.length);
  const out = now.output ? savedOutput(cell) : undefined;
  // the animated line: from the step's card to the first lit line, measured once the code has settled
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<{ d: string; x2: number; y2: number } | null>(null);
  useLayoutEffect(() => {
    setPath(null);
    const t = setTimeout(() => {
      const b = box.current?.getBoundingClientRect();
      const c = card.current?.getBoundingClientRect();
      const f = first.current?.getBoundingClientRect();
      if (!b || !c || !f) return;
      // the stage is scaled by CSS: measure in the box's own pixels
      const sx = b.width / (box.current as HTMLElement).offsetWidth || 1;
      const x1 = (c.right - b.left) / sx;
      const y1 = (c.top + c.height / 2 - b.top) / sx;
      const x2 = (f.left - b.left) / sx;
      const y2 = (f.top + f.height / 2 - b.top) / sx;
      const mid = (x1 + x2) / 2;
      setPath({ d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`, x2, y2 });
    }, 700);
    return () => clearTimeout(t);
  }, [id, k]);

  return (
    <WidePanel wide kicker={kicker} message={message} notebook={notebook} testId="notebook-page" step={k} kickerColor={TEAL}>
      <Fill style={{ overflowY: 'hidden' }}>
        <div ref={box} style={{ position: 'relative', flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 24fr) minmax(0, 36fr) minmax(0, 40fr)', gap: 0, marginTop: 4, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          {/* 1 · in everyday life */}
          <div style={{ paddingRight: 24, borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={label}>In everyday life</div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ flex: '1 1 0', minHeight: 0, display: 'flex' }}>
                <div style={{ flex: 1, minHeight: 0 }}>{everyday.art}</div>
              </motion.div>
              <div data-caption style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--ink)', marginTop: 14 }}>{everyday.caption}</div>
            </div>
          </div>
          {/* 2 · at Harbor Bridge: the numbered steps */}
          <div style={{ padding: '0 0 0 24px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={label}>At Harbor Bridge</div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {page.steps.map((s, i) => {
                const on = i + 1 === k;
                const past = i + 1 < k;
                const lastStep = i === page.steps.length - 1;
                return (
                  <div key={i} data-step-card={i + 1} data-on={on || undefined} style={{ flex: lastStep ? 'none' : '1 0 auto', display: 'grid', gridTemplateColumns: '50px 1fr', columnGap: 18, position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ width: 50, height: 50, borderRadius: '50%', background: on || past ? TEAL : 'rgba(127,127,127,0.4)', color: '#fff', fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? '0 0 0 7px rgba(27,138,156,0.22)' : 'none', transition: 'box-shadow 0.4s' }}>{past ? '✓' : i + 1}</span>
                      {!lastStep && (
                        <>
                          <span style={{ position: 'absolute', left: 24, top: 56, bottom: 6, borderLeft: '2.5px dotted var(--teal)' }} />
                          <motion.span style={{ position: 'absolute', left: 19, width: 12, height: 12, borderRadius: '50%', background: TEAL }} initial={{ top: '0%', opacity: 0 }} animate={{ top: ['0%', '90%'], opacity: on ? [0, 1, 1, 0] : 0 }} transition={{ delay: 0.5, duration: 1.1, ease: EASE }} />
                        </>
                      )}
                    </div>
                    <div style={{ paddingBottom: lastStep ? 0 : 22 }}>
                      <motion.div
                        ref={on ? card : undefined}
                        animate={{ opacity: on ? 1 : past ? 0.8 : 0.5 }}
                        transition={{ duration: 0.4 }}
                        style={{ padding: on ? '12px 16px' : '2px 0', margin: on ? '-12px -16px 0' : 0, borderRadius: 14, border: on ? '2.5px solid var(--teal)' : '2.5px solid transparent', background: on ? 'rgba(27,138,156,0.12)' : 'transparent' }}
                      >
                        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{s.label}</div>
                        <div style={{ fontSize: 22, color: on ? 'var(--ink)' : 'var(--ink-dim)', lineHeight: 1.4, marginTop: 8 }}><Rich text={s.say} /></div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 3 · the notebook: only the key lines */}
          <div data-code-focus data-step={k} style={{ marginLeft: 70, display: 'flex', flexDirection: 'column', minHeight: 0, borderRadius: 16, background: '#0f1720', overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: '#18222d', fontSize: 16, color: '#9fb0bd' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e06c5f' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e0b04f' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#62c46a' }} />
              <span style={{ marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>the notebook · cell {cell}</span>
            </div>
            <div data-code style={{ flex: 1, minHeight: 0, padding: '12px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 20, lineHeight: 1.5, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {shown.map(([a, b], ri) => (
                <div key={ri}>
                  {(ri > 0 || a > 0) && <div style={{ padding: '2px 18px 2px 56px', color: '#5f6f7c' }}>⋮</div>}
                  {lines.slice(a, b + 1).map((pieces, j) => {
                    const i = a + j;
                    const on = litSet.has(i);
                    const isFirst = i === lit[0];
                    return (
                      <motion.div
                        key={`${cell}-${i}`}
                        ref={isFirst ? first : undefined}
                        data-line={on ? 'lit' : undefined}
                        initial={{ backgroundColor: 'rgba(27,138,156,0)', opacity: 0.3 }}
                        animate={{ backgroundColor: on ? 'rgba(27,138,156,0.34)' : 'rgba(27,138,156,0)', opacity: on ? 1 : 0.42 }}
                        transition={{ duration: 0.55, ease: EASE, delay: on ? 0.25 + j * 0.03 : 0 }}
                        style={{ display: 'flex', alignItems: 'flex-start', borderLeft: `5px solid ${on ? '#3fc1d3' : 'transparent'}`, minHeight: '1.5em' }}
                      >
                        <span style={{ flex: 'none', width: 46, textAlign: 'right', paddingRight: 12, color: on ? '#7fd4e0' : '#4f5f6c', userSelect: 'none' }}>{i + 1}</span>
                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: 0, color: on ? '#ffffff' : '#cfd8de', fontWeight: on ? 600 : 400, paddingRight: 14 }}>
                          {pieces.map((p, q) => (p.kind === 'plain' ? p.text : <span key={q} style={{ color: on ? undefined : TOKEN_COLOR[p.kind] }}>{p.text}</span>))}
                          {pieces.length === 0 ? ' ' : ''}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
              {shown.length && shown[shown.length - 1][1] < lines.length - 1 && <div style={{ padding: '2px 18px 2px 56px', color: '#5f6f7c' }}>⋮</div>}
            </div>
            {out && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }} style={{ flex: 'none', padding: '12px 18px', background: '#0b1118', display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 17, color: '#9bdc9b' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7f8c99' }}>Saved output</span>
                <span>{out}</span>
              </motion.div>
            )}
          </div>
          {/* the line from the step to its lines: drawn when the step changes, a light running along it */}
          {path && (
            <svg data-link aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 5 }}>
              <motion.path d={path.d} fill="none" stroke="#1b8a9c" strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE }} />
              <motion.circle cx={path.x2} cy={path.y2} r={9} fill="#3fc1d3" initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.85, duration: 0.3 }} />
              <motion.circle r={6} fill="#ffffff" stroke="#1b8a9c" strokeWidth={3} initial={{ offsetDistance: '0%', opacity: 1 }} animate={{ offsetDistance: '100%', opacity: [1, 1, 0] }} transition={{ duration: 0.9, ease: EASE }} style={{ offsetPath: `path('${path.d}')` }} />
            </svg>
          )}
        </div>
      </Fill>
    </WidePanel>
  );
}
