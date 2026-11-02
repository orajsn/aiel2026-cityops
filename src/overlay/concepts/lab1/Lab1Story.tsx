import { useEffect, useState } from 'react';
import { Rich } from '../../Rich';
import { useUiStore } from '../../../engine/ui';
import { LineIcon, type IconName } from '../icons';
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
  /** the step's own picture, so each one reads at a glance */
  icon: IconName;
}
interface StoryConfig {
  steps: Step[];
  /** when each step turns on, and when it is ticked (seconds; null: it stays the current one) */
  on?: number[];
  tick?: (number | null)[];
  /** the closing line and when it arrives */
  pill: string;
  pillAt?: number;
  /** panel width in px (the sky pages keep the left of the screen for the 3D) */
  width?: number;
}

export const CRACK: StoryConfig = {
  steps: [
    { title: 'Walk the site', sub: 'The project manager inspects the bridge.', icon: 'pin' },
    { title: 'Notice the crack', sub: 'One crack, close to a pier.', icon: 'inspect' },
    { title: 'Record the issue', sub: 'Location and photo go on the tablet.', icon: 'clipboard' },
    { title: 'Start the project', sub: 'The engineer reviews before anything is approved.', icon: 'flag' },
  ],
  on: [0, 2.3, 4.6, 6.9],
  tick: [2.3, 4.6, 6.9, null],
  pill: 'Repair project · Crack observed · Engineer review',
  pillAt: 6.9,
};
export const PLAN: StoryConfig = {
  steps: [
    { title: 'Define the scope', sub: 'Inspect the damaged area', icon: 'target' },
    { title: 'Specify materials', sub: 'Use the project specification', icon: 'beams' },
    { title: 'Schedule delivery', sub: 'Check supplier readiness', icon: 'truck' },
    { title: 'Engineer approval', sub: 'Review the repair plan', icon: 'shield' },
  ],
  on: [0, 2.3, 4.6, 6.9],
  tick: [2.3, 4.6, 6.9, null],
  pill: 'The plan needs specifications, supplier records and site evidence',
  pillAt: 6.9,
};
export const CAPTURE: StoryConfig = {
  steps: [
    { title: 'Specification', sub: 'Document', icon: 'prompt' },
    { title: 'Supplier records', sub: 'Database', icon: 'database' },
    { title: 'Delivery photo', sub: 'Image', icon: 'camera' },
  ],
  on: [0, 0, 2.3],
  tick: [0, 0, 5.9],
  pill: 'Documents + database records + a delivery photo',
  pillAt: 6.9,
};

/**
 * 4a and 4b (owner, 2 Nov): on the sky stage the page's 3D plays (the vector store's cloud of points, the semantic store's
 * governed tables) and this card, on the right as on the story pages, names each step with its own icon. Each click lights
 * the next step and plays that step's sky act (SkyStage: vector, vector2, vector3, retrieve; semantic to semantic4), so the
 * page has its own sequence inside it.
 */
export const VECTOR: StoryConfig = {
  steps: [
    { title: 'The specification', sub: 'A PDF in Object Storage, synced in.', icon: 'doc' },
    { title: 'Meaning becomes numbers', sub: 'Each chunk is 384 numbers: a point in space.', icon: 'points' },
    { title: 'The question is a point too', sub: 'Close in meaning means close in space. The nearest five light up.', icon: 'chat' },
    { title: 'The top five go to the model', sub: 'file_search hands the passages over; the answer cites them.', icon: 'target' },
  ],
  pill: 'Nearest by meaning, not by matching words',
  width: 640,
};
export const SEMANTIC: StoryConfig = {
  steps: [
    { title: 'Governed views', sub: 'The database exposes views, not raw tables.', icon: 'table' },
    { title: 'Ask in plain words', sub: 'The question needs no SQL.', icon: 'chat' },
    { title: 'SQL, checked', sub: 'NL2SQL writes it; the check keeps it to this project.', icon: 'shield' },
    { title: 'Rows come back', sub: 'Through the ADB MCP Server, to the app.', icon: 'database' },
  ],
  pill: 'Governed data for this project only',
  width: 640,
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

function StoryCard({ kicker, message, cfg, step }: Lab1Props & { cfg: StoryConfig }) {
  // a click-by-click page (step given) lights its steps by click; the story pages run on their own clock
  const clock = useStoryClock();
  const t = step === undefined ? clock : 0;
  const isOn = (i: number) => (step === undefined ? t >= (cfg.on?.[i] ?? 0) : i + 1 <= step);
  const isDone = (i: number) => (step === undefined ? cfg.tick?.[i] != null && t >= (cfg.tick[i] as number) : i + 1 < step);
  const pillOn = step === undefined ? t >= (cfg.pillAt ?? Infinity) : step >= cfg.steps.length;
  const scriptOpen = useUiStore((s) => s.scriptOpen);
  return (
    <div className="beat" data-l1-story>
      <div className={`beat__panel beat__panel--cast${scriptOpen ? '' : ' is-free'}`} data-testid="l1-story" style={cfg.width ? { width: cfg.width } : undefined}>
        <div className="beat__kicker" style={{ color: 'var(--teal)' }}>{kicker}</div>
        <div className="beat__headline">
          <Rich text={message} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
          {cfg.steps.map((s, i) => {
            const on = isOn(i);
            const done = isDone(i);
            const k = 'var(--cast-k, 1)';
            return (
              <div key={s.title} data-step={i + 1} data-on={on || undefined} data-done={done || undefined} style={{ display: 'grid', gridTemplateColumns: `calc(68px * ${k}) 1fr`, columnGap: 20, position: 'relative', paddingBottom: i < cfg.steps.length - 1 ? `calc(18px * ${k})` : 0 }}>
                <span data-icon={s.icon} style={{ position: 'relative', width: `calc(68px * ${k})`, height: `calc(68px * ${k})`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'rgba(27, 138, 156, 0.14)' : 'rgba(127,127,127,0.14)', border: `2px solid ${on ? 'var(--teal)' : 'rgba(127,127,127,0.4)'}`, transition: 'background 400ms, border-color 400ms' }}>
                  <LineIcon name={s.icon} size={44} color={on ? 'var(--teal)' : 'var(--ink-dim)'} />
                  <span style={{ position: 'absolute', top: -9, left: -9, width: `calc(26px * ${k})`, height: `calc(26px * ${k})`, borderRadius: '50%', background: on ? 'var(--teal)' : 'rgba(127,127,127,0.6)', color: '#fff', fontWeight: 700, fontSize: `calc(15px * ${k})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 400ms' }}>{done ? '✓' : i + 1}</span>
                </span>
                {i < cfg.steps.length - 1 && <span style={{ position: 'absolute', left: `calc(33px * ${k})`, top: `calc(74px * ${k})`, bottom: 2, borderLeft: '2.5px dotted var(--teal)' }} />}
                <div style={{ opacity: on ? 1 : 0.45, transition: 'opacity 400ms' }}>
                  <div style={{ fontSize: `calc(23px * ${k})`, fontWeight: 700, color: 'var(--ink)' }}>{s.title}</div>
                  <div style={{ fontSize: `calc(18px * ${k})`, color: 'var(--ink-dim)', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div data-pill style={{ marginTop: 16, padding: '10px 16px', borderRadius: 12, border: '2px solid var(--teal)', background: 'rgba(27, 138, 156, 0.1)', fontSize: 'calc(18px * var(--cast-k, 1))', fontWeight: 600, color: 'var(--ink)', opacity: pillOn ? 1 : 0, transition: 'opacity 500ms' }}>{cfg.pill}</div>
      </div>
    </div>
  );
}

export const L1Crack = (p: Lab1Props) => <StoryCard {...p} cfg={CRACK} />;
export const L1Plan = (p: Lab1Props) => <StoryCard {...p} cfg={PLAN} />;
export const L1Capture = (p: Lab1Props) => <StoryCard {...p} cfg={CAPTURE} />;
export const L1Vector = (p: Lab1Props) => <StoryCard {...p} cfg={VECTOR} />;
export const L1Semantic = (p: Lab1Props) => <StoryCard {...p} cfg={SEMANTIC} />;
