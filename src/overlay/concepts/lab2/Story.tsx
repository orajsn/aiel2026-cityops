import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Fill } from '../Fill';
import { DIM, INK, TEAL, TINT } from './parts';

/**
 * Lab 2 in the Lab 3 teaching pattern (owner, 29 Oct: "see how 3.2 to 3.4 build the sequence"): three columns
 * under the headline, as in Engineering.tsx. On the left the everyday picture and one plain sentence; in the
 * middle what happens at Harbor Bridge as a numbered timeline, one step after another with a dot running down
 * the connector; on the right a short list that lights up once the steps have landed.
 */

const GREY = 'var(--ink-dim)';
const label = { fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: GREY, textTransform: 'uppercase' as const, marginBottom: 18 };

/** steps 1, 2, 3 arrive about a second apart; the right column follows */
export const stepAt = (i: number) => 0.5 + i * 0.9;

export const stepTitle = { fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.3, marginBottom: 12 } as const;

function Tick({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden style={{ flex: 'none' }}>
      <circle cx="17" cy="17" r="16" fill="var(--teal)" />
      <path d="M9.5 17.5l5 5 10-11" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Step({ n, last, on, children }: { n: number; last?: boolean; on: boolean; children: ReactNode }) {
  return (
    <motion.div data-step={n} data-on={on || undefined} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepAt(n - 1), duration: 0.5, ease: EASE }} style={{ flex: last ? 'none' : '1 0 auto', display: 'grid', gridTemplateColumns: '50px 1fr', columnGap: 20, position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ width: 50, height: 50, borderRadius: '50%', background: TEAL, color: '#fff', fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? '0 0 0 7px rgba(27,138,156,0.22)' : 'none', transition: 'box-shadow 0.4s' }}>{n}</span>
        {!last && (
          <>
            <span style={{ position: 'absolute', left: 24, top: 56, bottom: 6, borderLeft: '2.5px dotted var(--teal)' }} />
            <motion.span style={{ position: 'absolute', left: 19, width: 12, height: 12, borderRadius: '50%', background: TEAL }} initial={{ top: '0%', opacity: 0 }} animate={{ top: ['0%', '90%'], opacity: [0, 1, 1, 0] }} transition={{ delay: stepAt(n - 1) + 0.5, duration: 0.9, ease: EASE }} />
          </>
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : 22 }}>{children}</div>
    </motion.div>
  );
}

export interface StoryStep {
  title: ReactNode;
  body?: ReactNode;
}

export interface StorySide {
  label: string;
  items: { title: string; sub?: string }[];
  foot?: string;
}

export function Story({ everyday, steps, side, focusN = 0 }: { everyday: { art: ReactNode; caption: ReactNode }; steps: StoryStep[]; side: StorySide; focusN?: number }) {
  const sideAt = stepAt(steps.length) + 0.2;
  return (
    <Fill>
      <div data-story style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '400px 1fr 330px', marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
        <div style={{ paddingRight: 26, borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={label}>In everyday life</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div data-everyday initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ display: 'flex', justifyContent: 'center' }}>
              {everyday.art}
            </motion.div>
            <div data-caption style={{ fontSize: 23, lineHeight: 1.45, color: INK, marginTop: 18 }}>{everyday.caption}</div>
          </div>
        </div>
        <div style={{ padding: '0 30px', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div style={label}>At Harbor Bridge</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {steps.map((s, i) => (
              <Step key={i} n={i + 1} last={i === steps.length - 1} on={focusN === i + 1}>
                <div style={stepTitle}>{s.title}</div>
                {s.body}
              </Step>
            ))}
          </div>
        </div>
        <div style={{ paddingLeft: 26, display: 'flex', flexDirection: 'column' }}>
          <div style={label}>{side.label}</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {side.items.map((it, i) => (
              <motion.div key={it.title} data-side-item={it.title} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: sideAt + i * 0.4, duration: 0.5, ease: EASE }} style={{ flex: '1 0 auto', display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px', borderRadius: 12, border: '2px solid var(--teal)', background: TINT }}>
                <Tick size={38} />
                <div>
                  <div style={{ fontSize: 25, fontWeight: 700, color: INK, lineHeight: 1.25 }}>{it.title}</div>
                  {it.sub && <div style={{ fontSize: 20, color: TEAL, fontWeight: 500, lineHeight: 1.3, marginTop: 2 }}>{it.sub}</div>}
                </div>
              </motion.div>
            ))}
            {side.foot && <div style={{ fontSize: 18, color: DIM }}>{side.foot}</div>}
          </div>
        </div>
      </div>
    </Fill>
  );
}

/* ---------- small pieces the steps reuse ---------- */

export const bubble = { fontSize: 22, fontStyle: 'italic', padding: '12px 20px', borderRadius: 14, background: 'rgba(127, 127, 127, 0.14)', color: INK } as const;

export function Arrow({ delay = 0, w = 64 }: { delay?: number; w?: number }) {
  return (
    <svg width={w} height="24" viewBox={`0 0 ${w} 24`} aria-hidden style={{ flex: 'none' }}>
      <motion.path d={`M2 12 H${w - 10}`} stroke="var(--teal)" strokeWidth={3} strokeDasharray="6 6" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 0.6 }} />
      <path d={`M${w - 16} 5 L${w - 4} 12 L${w - 16} 19`} stroke="var(--teal)" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
