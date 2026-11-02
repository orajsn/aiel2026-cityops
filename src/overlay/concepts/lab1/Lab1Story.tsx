import { useEffect, useState } from 'react';
import { Rich } from '../../Rich';
import { useUiStore } from '../../../engine/ui';
import { BEAT_MS } from '../../../world/Lab1Story';
import type { Lab1Props } from './Lab1Intro';

/**
 * Lab 1's first three pages (owner, 2 Nov; storyboard slides 1 to 3, animated design approved on the canvas): the story
 * plays on the real Harbor Bridge (src/world/Lab1Story.tsx) and this card counts it off in four beats of 2.3 s, then
 * holds: the steps turn on and tick in turn, and the last line says what the page leaves behind. The team stays bottom-left,
 * as the cast does on Lab 3's first page.
 */
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
  /** what the project manager does on this page, in the team card */
  pm: string;
}

const TEAM = [
  { id: 'pm', name: 'Project manager', icon: 'hat' },
  { id: 'engineer', name: 'Engineer', sub: 'reviews before approving', icon: 'shield' },
  { id: 'technician', name: 'Technician', sub: 'adds evidence from the site', icon: 'cam' },
] as const;

const ICON: Record<string, string> = {
  hat: '<path d="M-12 4a12 11 0 0 1 24 0v3h-24z" fill="#1b8a9c"/><rect x="-14" y="6" width="28" height="4" rx="2" fill="#1b8a9c"/>',
  shield: '<path d="M0 -12l10 3v8c0 7-5 10-10 13-5-3-10-6-10-13v-8z M-4 1l3 3 6-7" fill="none" stroke="#1b8a9c" stroke-width="2.4"/>',
  cam: '<rect x="-12" y="-7" width="24" height="16" rx="3" fill="none" stroke="#1b8a9c" stroke-width="2.4"/><circle cy="1" r="4.5" fill="none" stroke="#1b8a9c" stroke-width="2.4"/>',
};

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
  pm: 'walks the site',
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
  pm: 'plans the repair',
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
  pm: 'supports the technician',
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
      <div className="beat__panel beat__panel--compact" data-testid="l1-story" style={{ top: 112, bottom: 'auto', right: 56 }}>
        <div className="beat__kicker">{kicker}</div>
        <div className="beat__headline">
          <Rich text={message} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cfg.steps.map((s, i) => {
            const on = t >= cfg.on[i];
            const done = cfg.tick[i] !== null && t >= (cfg.tick[i] as number);
            return (
              <div key={s.title} data-step={i + 1} data-on={on || undefined} data-done={done || undefined} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', columnGap: 16, position: 'relative', paddingBottom: i < cfg.steps.length - 1 ? 16 : 0 }}>
                <span style={{ width: 44, height: 44, borderRadius: '50%', background: on ? 'var(--teal)' : 'rgba(127,127,127,0.4)', color: '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 400ms' }}>{done ? '✓' : i + 1}</span>
                {i < cfg.steps.length - 1 && <span style={{ position: 'absolute', left: 21, top: 48, bottom: 2, borderLeft: '2.5px dotted var(--teal)' }} />}
                <div style={{ opacity: on ? 1 : 0.45, transition: 'opacity 400ms' }}>
                  <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--ink)' }}>{s.title}</div>
                  <div style={{ fontSize: 18, color: 'var(--ink-dim)', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div data-pill style={{ marginTop: 12, padding: '8px 14px', borderRadius: 12, border: '2px solid var(--teal)', background: 'rgba(27, 138, 156, 0.1)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', opacity: t >= cfg.pillAt ? 1 : 0, transition: 'opacity 500ms' }}>{cfg.pill}</div>
      </div>
      <div data-team style={{ position: 'absolute', left: 48, bottom: scriptOpen ? 150 : 110, width: 524, borderRadius: 14, background: 'var(--panel-strong)', padding: '18px 24px 20px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)', pointerEvents: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)' }}>Lab 1 · Today’s team</div>
        {TEAM.map((m) => (
          <div key={m.id} data-who={m.id} style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 10 }}>
            <span style={{ width: 46, height: 46, borderRadius: '50%', background: '#e8f1f2', border: '3px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={28} height={28} viewBox="-15 -15 30 30" aria-hidden dangerouslySetInnerHTML={{ __html: ICON[m.icon] }} />
            </span>
            <span>
              <span style={{ display: 'block', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>{m.name}</span>
              <span style={{ display: 'block', fontSize: 14, color: 'var(--ink-dim)' }}>{'sub' in m ? m.sub : cfg.pm}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const L1Crack = (p: Lab1Props) => <StoryCard {...p} cfg={CRACK} />;
export const L1Plan = (p: Lab1Props) => <StoryCard {...p} cfg={PLAN} />;
export const L1Capture = (p: Lab1Props) => <StoryCard {...p} cfg={CAPTURE} />;
