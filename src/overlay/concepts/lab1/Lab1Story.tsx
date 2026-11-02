import { useEffect, useState } from 'react';
import { Rich } from '../../Rich';
import { useUiStore } from '../../../engine/ui';
import type { Lab1Props } from './parts';

/**
 * Lab 1's first three pages (owner, 2 Nov; storyboard slides 1 to 3, animated design approved on the canvas): the story
 * plays at the crack on the real Harbor Bridge (the Inspection piece) and this card counts it off in four beats of 2.3 s, then
 * holds: the steps turn on and tick in turn, and the last line says what the page leaves behind. One panel on the right, as on
 * Lab 3's opening pages; the character at the crack is the world's (inspect).
 */
/** one beat of the page's story, in ms: each page runs four of them, then holds */
export const BEAT_MS = 2300;

interface Step {
  title: string;
  sub: string;
}
interface StoryConfig {
  steps: Step[];
  /** when each step turns on, and when it is ticked (seconds; null: it stays the current one) */
  on: number[];
  tick: (number | null)[];
  /** the closing line and when it arrives */
  pill: string;
  pillAt: number;
}

export const CRACK: StoryConfig = {
  steps: [
    { title: 'Walk the site', sub: 'The project manager inspects the bridge.' },
    { title: 'Notice the crack', sub: 'One crack, close to a pier.' },
    { title: 'Record the issue', sub: 'Location and photo go on the tablet.' },
    { title: 'Start the project', sub: 'The engineer reviews before anything is approved.' },
  ],
  on: [0, 2.3, 4.6, 6.9],
  tick: [2.3, 4.6, 6.9, null],
  pill: 'Repair project · Crack observed · Engineer review',
  pillAt: 6.9,
};
export const PLAN: StoryConfig = {
  steps: [
    { title: 'Define the scope', sub: 'Inspect the damaged area' },
    { title: 'Specify materials', sub: 'Use the project specification' },
    { title: 'Schedule delivery', sub: 'Check supplier readiness' },
    { title: 'Engineer approval', sub: 'Review the repair plan' },
  ],
  on: [0, 2.3, 4.6, 6.9],
  tick: [2.3, 4.6, 6.9, null],
  pill: 'The plan needs specifications, supplier records and site evidence',
  pillAt: 6.9,
};
export const CAPTURE: StoryConfig = {
  steps: [
    { title: 'Specification', sub: 'Document' },
    { title: 'Supplier records', sub: 'Database' },
    { title: 'Delivery photo', sub: 'Image' },
  ],
  on: [0, 0, 2.3],
  tick: [0, 0, 5.9],
  pill: 'Documents + database records + a delivery photo',
  pillAt: 6.9,
};

/** the page's clock in seconds: runs once from when the page appears, then holds on the last beat */
function useStoryClock(): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      setT(s);
      if (s > (BEAT_MS * 4) / 1000 + 0.5) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, []);
  return t;
}

function StoryCard({ kicker, message, cfg }: Lab1Props & { cfg: StoryConfig }) {
  const t = useStoryClock();
  const scriptOpen = useUiStore((s) => s.scriptOpen);
  return (
    <div className="beat" data-l1-story>
      <div className={`beat__panel beat__panel--cast${scriptOpen ? '' : ' is-free'}`} data-testid="l1-story">
        <div className="beat__kicker" style={{ color: 'var(--teal)' }}>{kicker}</div>
        <div className="beat__headline">
          <Rich text={message} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
          {cfg.steps.map((s, i) => {
            const on = t >= cfg.on[i];
            const done = cfg.tick[i] !== null && t >= (cfg.tick[i] as number);
            const k = 'var(--cast-k, 1)';
            return (
              <div key={s.title} data-step={i + 1} data-on={on || undefined} data-done={done || undefined} style={{ display: 'grid', gridTemplateColumns: `calc(44px * ${k}) 1fr`, columnGap: 18, position: 'relative', paddingBottom: i < cfg.steps.length - 1 ? `calc(18px * ${k})` : 0 }}>
                <span style={{ width: `calc(44px * ${k})`, height: `calc(44px * ${k})`, borderRadius: '50%', background: on ? 'var(--teal)' : 'rgba(127,127,127,0.4)', color: '#fff', fontWeight: 700, fontSize: `calc(22px * ${k})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 400ms' }}>{done ? '✓' : i + 1}</span>
                {i < cfg.steps.length - 1 && <span style={{ position: 'absolute', left: `calc(21px * ${k})`, top: `calc(48px * ${k})`, bottom: 2, borderLeft: '2.5px dotted var(--teal)' }} />}
                <div style={{ opacity: on ? 1 : 0.45, transition: 'opacity 400ms' }}>
                  <div style={{ fontSize: `calc(23px * ${k})`, fontWeight: 700, color: 'var(--ink)' }}>{s.title}</div>
                  <div style={{ fontSize: `calc(18px * ${k})`, color: 'var(--ink-dim)', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div data-pill style={{ marginTop: 16, padding: '10px 16px', borderRadius: 12, border: '2px solid var(--teal)', background: 'rgba(27, 138, 156, 0.1)', fontSize: 'calc(18px * var(--cast-k, 1))', fontWeight: 600, color: 'var(--ink)', opacity: t >= cfg.pillAt ? 1 : 0, transition: 'opacity 500ms' }}>{cfg.pill}</div>
      </div>
    </div>
  );
}

export const L1Crack = (p: Lab1Props) => <StoryCard {...p} cfg={CRACK} />;
export const L1Plan = (p: Lab1Props) => <StoryCard {...p} cfg={PLAN} />;
export const L1Capture = (p: Lab1Props) => <StoryCard {...p} cfg={CAPTURE} />;
