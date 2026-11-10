import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MAP_STEPS, NB_FILE, PART_KIND, NB_ROWS, stepLines, type MapLine, type MapNode, type MapStep, type NbRow } from '../../content/lab3Map';
import { useDrawerStore } from '../../engine/presentation';
import { useUiStore } from '../../engine/ui';
import { ModelNet, Net } from './lab1/parts';
import mercerPortrait from '../../assets/portraits/mercer.png';
import vancePortrait from '../../assets/portraits/vance.png';
import jupyterOpen from '../../assets/lab3/jupyter-open.webp';
import extractionFigure from '../../assets/lab3/auto-extraction.png';
import adbLogo from '../../assets/oracle/autonomous-ai-database.png';
import './codeMap.css';

/**
 * Lab 3's coding part as one map (owner, 4 Nov, the prototype on the canvas "Lab 3 Code Map"). The panel is drawn at a fixed 1824 x 870 and
 * scaled to the stage. Each Next: the map flies to the step's node, the real notebook window glides to that part of the code, then its
 * lines stay, the key lines light up, the rest fades and the words come in. The step is the drawer store's `focus` (PAGE_STEPS).
 */

const W = 1824;
const H = 870;
/** the camera has arrived and the words can come in */
const SETTLE_MS = 1300;
const SCROLL_MS = 900;
const FOCUS_X = 400 + 48;
const FOCUS_Y = 435 + 110;

const ICON: Record<string, string> = {
  chat: 'M4 5h16v11H9l-5 4zM8 9h8M8 12h5',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  ok: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M8 12.5l3 3 5-6',
  bars: 'M5 20V10M10 20V4M15 20V13M20 20V7',
  table: 'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2M3 10h18M9 10v9',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  clip: 'M7 4h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2M9 4h6v3H9zM9 14l2 2 4-4',
  city: 'M4 21V9l6-4v16M10 21V3h10v18M3 21h18M13 8h4M13 12h4M13 16h4',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  chip: 'M9 7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
};
const Ic = ({ name, size = 28 }: { name: string; size?: number }) => (
  <svg className="cm__ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d={ICON[name]} />
  </svg>
);

interface NodeDef {
  id: MapNode;
  x: number;
  y: number;
  w: number;
  h: number;
  icon?: string;
  name: string;
  sub: string;
  mono?: boolean;
  teal?: boolean;
  step?: string;
  /** what it is: a table (cylinder), a step that computes (hexagon), a page of text (folded corner), or a plain card */
  shape: 'store' | 'process' | 'doc' | 'card';
}
const NODES: NodeDef[] = [
  { id: 'inspector', x: 96, y: 220, w: 220, h: 100, name: 'Inspector', sub: 'Mercer, Vance', step: 'DAY 1, N', shape: 'card' },
  { id: 'copilot', x: 510, y: 220, w: 300, h: 100, icon: 'chat', name: 'call_copilot', sub: 'runs one turn', mono: true, teal: true, step: 'PART 6', shape: 'process' },
  { id: 'prompt', x: 906, y: 220, w: 260, h: 100, icon: 'doc', name: 'The prompt', sub: 'everything it found', shape: 'doc' },
  { id: 'model', x: 1250, y: 220, w: 280, h: 100, name: 'Language model', sub: 'reasons over it', shape: 'process' },
  { id: 'answer', x: 1598, y: 220, w: 226, h: 100, icon: 'ok', name: 'The answer', sub: 'back to the inspector', shape: 'card' },
  // the database lane reads left to right by Part: the embedder (2), then the assets (3a) with the findings (4) in one column, then Part 3's chain
  { id: 'embedder', x: 140, y: 650, w: 250, h: 120, icon: 'bars', name: 'Embedder', sub: 'text to 384 numbers', teal: true, step: 'PART 2', shape: 'process' },
  { id: 'asset', x: 442, y: 540, w: 380, h: 120, icon: 'city', name: 'CITY_ASSET', sub: 'the 26 city assets', mono: true, teal: true, step: 'PART 3a', shape: 'store' },
  { id: 'message', x: 874, y: 540, w: 280, h: 120, icon: 'table', name: 'CITY_MESSAGE', sub: 'every message, word for word', mono: true, teal: true, step: 'PART 3b', shape: 'store' },
  { id: 'extractor', x: 1206, y: 540, w: 240, h: 120, icon: 'filter', name: 'Extractor', sub: 'keeps what matters', teal: true, step: 'PART 3b', shape: 'process' },
  { id: 'memory', x: 1498, y: 540, w: 280, h: 120, icon: 'layers', name: 'CITY_MEMORY', sub: 'what it learned', mono: true, teal: true, step: 'PART 3c', shape: 'store' },
  { id: 'finding', x: 442, y: 760, w: 380, h: 120, icon: 'clip', name: 'CITY_INSPECTION_FINDING', sub: 'the official record', mono: true, teal: true, step: 'PART 4', shape: 'store' },
];

const LINES: { id: MapLine; d: string; head?: boolean; teal?: boolean }[] = [
  { id: 'a', d: 'M316 270 H502', head: true },
  { id: 'b', d: 'M810 270 H898', head: true },
  { id: 'c', d: 'M1166 270 H1242', head: true },
  { id: 'd', d: 'M1530 270 H1590', head: true },
  { id: 'e', d: 'M660 320 V366', head: true },
  // Scope guards the database as a whole
  { id: 'f', d: 'M660 428 V464', head: true },
  { id: 'read', d: 'M1638 540 V430 H1036 V326', head: true },
  // the findings feed the prompt too: along the bottom, up the right side, into the same road
  { id: 'l', d: 'M822 820 H1800' },
  { id: 'n', d: 'M1800 820 V430 H1638' },
  // Part 3 in one row, in order: the assets, the messages, the extractor, the memory
  { id: 'r', d: 'M822 600 H866', head: true, teal: true },
  { id: 'g', d: 'M1154 600 H1198', head: true, teal: true },
  { id: 'h', d: 'M1446 600 H1490', head: true, teal: true },
  // the embedder (Part 2) sits between the assets (3a) and the findings (4) and serves both
  { id: 'o', d: 'M390 710 H416', teal: true },
  { id: 'u', d: 'M416 710 V600 H436', head: true, teal: true },
  { id: 'q', d: 'M416 710 V820 H436', head: true, teal: true },
];

const nodeState = (step: MapStep, id: MapNode) => (!step.nodes ? '' : step.nodes.includes(id) ? ' is-on' : ' is-off');

/** the outline of a shaped node: a table is a cylinder, a step that computes a hexagon (as in the notebook's own diagram), a page of text has a folded corner */
function NodeShape({ shape, w, h }: { shape: NodeDef['shape']; w: number; h: number }) {
  const s = 1.25;
  if (shape === 'store') {
    const ry = 14;
    const rx = w / 2 - s;
    return (
      <svg className="cm__shape" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <path d={`M ${s} ${ry} A ${rx} ${ry - s} 0 0 1 ${w - s} ${ry} V ${h - ry} A ${rx} ${ry - s} 0 0 1 ${s} ${h - ry} Z`} />
        <path className="cm__shape-line" d={`M ${s} ${ry} A ${rx} ${ry - s} 0 0 0 ${w - s} ${ry}`} />
      </svg>
    );
  }
  if (shape === 'process') {
    const d = 26;
    return (
      <svg className="cm__shape" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <path d={`M ${d} ${s} H ${w - d} L ${w - s} ${h / 2} L ${w - d} ${h - s} H ${d} L ${s} ${h / 2} Z`} />
      </svg>
    );
  }
  const f = 30;
  return (
    <svg className="cm__shape" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={`M ${s} ${s} H ${w - f} L ${w - s} ${f} V ${h - s} H ${s} Z`} />
      <path className="cm__shape-line" d={`M ${w - f} ${s} V ${f} H ${w - s}`} />
    </svg>
  );
}

function MapNodeCard({ n, step }: { n: NodeDef; step: MapStep }) {
  const on = !!step.nodes?.includes(n.id);
  const name = n.id === 'inspector' && step.who ? (step.who === 'mercer' ? 'Mercer' : 'Vance') : n.name;
  const sub = n.id === 'inspector' && step.who ? 'Inspector' : n.sub;
  const shaped = n.shape !== 'card';
  return (
    <div className={`cm__node${shaped ? ` cm__node--shaped cm__node--${n.shape}` : ''}${n.teal ? ' is-teal' : ''}${!shaped && n.w < 250 ? ' cm__node--tight' : ''}${nodeState(step, n.id)}`} data-node={n.id} data-shape={n.shape} data-on={on || undefined} style={{ left: n.x, top: n.y, width: n.w, height: n.h }}>
      {shaped && <NodeShape shape={n.shape} w={n.w} h={n.h} />}
      <div className={shaped ? 'cm__nodein' : 'cm__nodeflat'}>
        {n.id === 'inspector' ? (
          <div className="cm__people" data-who={step.who ?? 'both'}>
            {step.who !== 'vance' && <img src={mercerPortrait} alt="" />}
            {step.who !== 'mercer' && <img src={vancePortrait} alt="" />}
          </div>
        ) : n.id === 'model' ? (
          // the language model is a neural network; a wave of light runs through its layers while it produces
          <div className="cm__tile" style={{ background: 'transparent' }}>{on ? <ModelNet w={44} shape="small" who="language-model" period={2.6} start={0} /> : <Net w={44} who="language-model" />}</div>
        ) : (
          <div className={`cm__tile${n.teal ? ' is-teal' : ''}`}>
            <Ic name={n.icon!} />
          </div>
        )}
        <div className="cm__name">
          <b className={n.mono ? `mono${n.name.length > 20 ? ' long' : ''}` : undefined}>{name}</b>
          <span>{sub}</span>
        </div>
      </div>
      {n.step && <span className="cm__tag">{n.step}</span>}
    </div>
  );
}

function TheMap({ step }: { step: MapStep }) {
  // the whole map and Part 0's pictures share one camera, so the map behind does not jump when the picture comes in
  const cam = step.wide || step.guide ? { x: (W + 96 - step.cam.s * 1920) / 2, y: 6 } : { x: FOCUS_X - step.cam.s * step.cam.cx, y: FOCUS_Y - step.cam.s * step.cam.cy };
  const dim = !!step.nodes;
  return (
    <div className="cm__world" data-testid="code-map-world" style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${step.cam.s})` }}>
      <div className={`cm__db${step.lane ? ' is-on' : ''}`} data-lane-on={step.lane || undefined} />
      <svg className="cm__lines" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          {[['grey', '#7C8B98'], ['teal', '#1B8A9C'], ['dim', '#C9D2DA']].map(([k, c]) => (
            <marker key={k} id={`cm-${k}`} orient="auto" markerWidth="6" markerHeight="6" refX="3" refY="3" overflow="visible">
              <path d="M0 0 L6 3 L0 6 Z" fill={c} stroke="none" />
            </marker>
          ))}
        </defs>
        {LINES.map((l) => {
          const lit = step.lines.includes(l.id);
          return <path key={l.id} data-line={l.id} data-lit={lit || undefined} className={`cm-l${l.teal ? ' cm-l--teal' : ''}${lit ? ' cm-l--on' : dim ? ' cm-l--dim' : ''}`} d={l.d} markerEnd={l.head ? `url(#cm-${lit || l.teal ? 'teal' : dim ? 'dim' : 'grey'})` : undefined} />;
        })}
        <path data-line="confirm" data-lit={step.lines.includes('confirm') || undefined} className={`cm-l${step.lines.includes('confirm') ? ' cm-l--on' : ` cm-l--dash${dim ? ' cm-l--dim' : ''}`}`} d="M110 322 V912 H632 V888" markerEnd="url(#cm-teal)" />
      </svg>
      <div className="cm__lane" style={{ left: 96, top: 146, color: '#5B6773' }}>
        <Ic name="chip" size={26} />
        <span>THE AI AGENT · ONE TURN</span>
      </div>
      <div className="cm__lane" style={{ left: 260, top: 486, color: '#14707F' }}>
        <span>ORACLE AUTONOMOUS AI DATABASE 26ai · ONE CONNECTION</span>
        <span className="cm__tag">PART 1</span>
      </div>
      {/* the database logo before the section's title, a white badge straddling the section's top edge */}
      <div data-logo-badge style={{ position: 'absolute', left: 126, top: 412, width: 120, height: 120, borderRadius: 60, background: '#fff', border: '3px solid #1b8a9c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(31,42,51,0.18)', pointerEvents: 'none' }}>
        <img data-logo="adb" src={adbLogo} alt="Oracle Autonomous AI Database" style={{ width: 98, height: 98, objectFit: 'contain' }} />
      </div>
      {NODES.map((n) => (
        <MapNodeCard key={n.id} n={n} step={step} />
      ))}
      <div className={`cm__node cm__node--pill is-teal${nodeState(step, 'scope')}`} data-node="scope" data-on={step.nodes?.includes('scope') || undefined} style={{ left: 510, top: 372, width: 300, height: 56 }}>
        <span style={{ color: '#14707F', display: 'flex' }}>
          <Ic name="shield" size={26} />
        </span>
        <span>
          <b>Scope</b> · who may see what
        </span>
        <span className="cm__tag">PART 5</span>
      </div>
      <div className={`cm__chip${dim && !step.lines.includes('confirm') ? ' is-off' : ''}`}>log_finding · a person confirms</div>
    </div>
  );
}

/** one notebook line; only rows whose class changes draw again, so a step change stays light over the 3D */
const Row = memo(function Row({ row, i, cls }: { row: NbRow; i: number; cls: string }) {
  return (
    <div className={`nr nr--${row.kind}${row.first ? ' nr--first' : ''}${row.last ? ' nr--last' : ''}${cls}`} data-r={i}>
      <span className="nr__g">{row.prompt}</span>
      <span className="nr__n">
        <span className="nr__t">{row.line}</span>
      </span>
      <span className="nr__c">
        <span className="nr__t">
          {row.spans.map((s, k) => (
            <span key={k} className={s.k === 'plain' ? undefined : s.k.startsWith('md') ? `nt-${s.k}` : `py-${s.k}`}>
              {s.t}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
});

function Notebook({ step, lit, scroller }: { step: MapStep; lit: boolean; scroller: React.RefObject<HTMLDivElement> }) {
  const hl = useMemo(() => stepLines(step), [step]);
  return (
    <div className="cm__scroll" ref={scroller} data-testid="code-map-notebook">
      <div className="cm__nb">
        {NB_ROWS.map((r, i) => {
          // only the rows near the section fade, so the browser is not animating 900 lines over the 3D
          const near = hl ? Math.abs(i - hl.to) < 45 : false;
          const state = !lit ? ' is-fly' : hl?.key.has(i) ? ' is-key' : hl?.section.has(i) ? '' : ' is-dim';
          // the selected cell gets Jupyter's blue frame and bar
          const sel = step.code && r.cell === step.code.cell ? ' is-sel' : '';
          return <Row key={i} row={r} i={i} cls={`${state}${near ? ' is-near' : ''}${sel}`} />;
        })}
      </div>
    </div>
  );
}

/** the lit part of the JupyterLab screenshot, as fractions of the picture */
const SPOTS = {
  file: { x: 0.052, y: 0.346, w: 0.171, h: 0.072, label: 'notebook_complete_ollama.ipynb' },
  code: { x: 0.238, y: 0.482, w: 0.718, h: 0.518, label: 'A code cell' },
  run: { x: 0.345, y: 0.145, w: 0.022, h: 0.068, label: 'Run' },
} as const;

/** the notebook part's name and its engineering discipline, after the PART badge (PART_KIND in lab3Map.ts) */
function PartKind({ step }: { step: MapStep }) {
  const k = PART_KIND[step.rail];
  if (!k) return null;
  return (
    <>
      <span className="cm__pname" data-testid="code-map-part-name">{k.name}</span>
      <span className="cm__pkind" data-testid="code-map-part-kind">{k.kind}</span>
    </>
  );
}

/** Part 0: the real JupyterLab screen, dimmed but for the one thing this click is about */
function Guide({ step, lit }: { step: MapStep; lit: boolean }) {
  const figure = step.guide === 'extract';
  const spot = figure ? null : SPOTS[step.guide as keyof typeof SPOTS];
  return (
    <div className="cm__guide" data-testid="code-map-guide" data-spot={step.guide}>
      <div className="cm__say cm__fade" style={{ opacity: lit ? 1 : 0 }}>
        <div className="cm__tags">
          <span className="cm__tag">{step.tag}</span>
          <PartKind step={step} />
        </div>
        <div className="cm__ask">{step.ask}</div>
        <div className="cm__plain">{step.plain}</div>
      </div>
      <div className={`cm__shot${figure ? ' cm__shot--fig' : ''}`}>
        <img src={figure ? extractionFigure : jupyterOpen} alt={figure ? 'The notebook’s diagram: a new message goes to CITY_MESSAGE and to the extractor, which writes typed records into CITY_MEMORY' : 'JupyterLab, with the notebooks in the file list on the left'} />
        {spot && (
          <div className="cm__spot" style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%`, width: `${spot.w * 100}%`, height: `${spot.h * 100}%` }}>
            <span className="cm__spotlabel" style={step.guide === 'file' ? { left: 'calc(100% + 8px)', top: 0 } : spot.y > 0.45 ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }}>
              {spot.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The code map as a picture for the handover page (owner, 6 Nov: version A): the real map, the same nodes, scaled to `width`, with
 * numbered marks laid on it. Marks are in map coordinates; `shown` says how many are on.
 */
export function MapPreview({ width = 900, marks = [], shown = 0 }: { width?: number; marks?: { x: number; y: number; n: string }[]; shown?: number }) {
  // the map's content runs from (96, 140) to (1824, 960) in map coordinates
  const s = width / 1728;
  // white space round the map, so nothing (the marks, the logo badge) touches the picture's edge
  const P = 46;
  const step: MapStep = { ...MAP_STEPS[0], wide: false, guide: undefined, nodes: undefined, lane: false, cam: { s, cx: 96 + (400 - P) / s, cy: 140 + (435 - P) / s } };
  return (
    <div className="cm" data-map-preview style={{ width: width + 2 * P, height: Math.round(s * 820) + 2 * P, border: '2px solid #e1e7ec', boxShadow: 'none', borderRadius: 18, background: '#fff' }}>
      <TheMap step={step} />
      {marks.map((m, i) => (
        <div key={i} data-mark={m.n} style={{ position: 'absolute', left: P + s * (m.x - 96), top: P + s * (m.y - 140), transform: 'translate(-50%, -50%)', opacity: i < shown ? 1 : 0, transition: 'opacity 0.5s', width: 46, height: 46, borderRadius: 23, background: '#1b8a9c', color: '#fff', fontSize: 26, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px #fff, 0 3px 10px rgba(31,42,51,0.3)', zIndex: 5 }}>
          {m.n}
        </div>
      ))}
    </div>
  );
}

export function CodeMap() {
  const n = useDrawerStore((s) => (s.open ? Math.min(s.focus, MAP_STEPS.length - 1) : 0));
  const step = MAP_STEPS[n];
  const scriptOpen = useUiStore((s) => s.scriptOpen);
  const [lit, setLit] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);

  // the panel is drawn at one size and scaled to whatever the stage leaves it
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const fit = () => setK(Math.min(el.clientWidth / W, el.clientHeight / H) || 1);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setLit(false);
    const t = window.setTimeout(() => setLit(true), step.wide || step.guide ? 300 : SETTLE_MS);
    const hl = stepLines(step);
    const el = scroller.current;
    let raf = 0;
    if (hl && el) {
      const row = el.querySelector<HTMLElement>(`[data-r="${hl.to}"]`);
      const to = row ? Math.max(0, row.offsetTop - 90) : 0;
      const from = el.scrollTop;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) el.scrollTop = to;
      else {
        const t0 = performance.now();
        const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / SCROLL_MS);
          el.scrollTop = from + (to - from) * ease(p);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
    }
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [step]);

  const jump = (i: number) => useDrawerStore.setState(i === 0 ? { open: false, focus: 0, done: false } : { open: true, focus: i, done: false });

  return (
    <div className="beat" data-testid="code-map" data-step={n}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 14, 20, 0.38)' }} />
      <div ref={frame} style={{ position: 'absolute', left: 48, right: 48, top: 104, bottom: scriptOpen ? 124 : 88, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
        <div className="cm" style={{ transform: `scale(${k})`, flex: 'none' }}>
          <TheMap step={step} />

          <div className={`cm__side${step.wide || step.guide ? ' is-away' : ''}`}>
            <div className="cm__say cm__fade" style={{ opacity: lit ? 1 : 0 }}>
              <div className="cm__tags">
                {step.tag && <span className="cm__tag">{step.tag}</span>}
                <PartKind step={step} />
              </div>
              <div className="cm__ask" data-testid="code-map-ask">{step.ask}</div>
              <div className="cm__plain">{step.plain}</div>
            </div>
            <div className="cm__nbw">
              <div className="cm__nbbar">
                <span className="cm__run">
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2 1l7 4-7 4z" fill="#fff" />
                  </svg>
                </span>
                <span className="cm__file">{NB_FILE}</span>
                <span className="cm__kernel">Python 3 (ipykernel)</span>
              </div>
              <Notebook step={step} lit={lit} scroller={scroller} />
              <div className="cm__see cm__fade" style={{ opacity: lit ? 1 : 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none', fill: 'none', stroke: '#14707F', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  <path d="M5 13l4 4 10-11" />
                </svg>
                <span className="mono" data-testid="code-map-see">{step.see}</span>
                <small>YOU SHOULD SEE</small>
              </div>
            </div>
          </div>

          {step.guide && <Guide step={step} lit={lit} />}

          {/* the map's caption fades out with the map's own step, it is not removed at once (that left the map bare for a moment) */}
          <div className="cm__cap cm__fade" style={{ opacity: step.wide && lit ? 1 : 0, pointerEvents: 'none' }}>
            <div className="cm__ask">{MAP_STEPS[0].ask}</div>
            <div className="cm__plain">{MAP_STEPS[0].plain}</div>
          </div>

          <div className="cm__rail" role="group" aria-label="Steps of the map">
            {MAP_STEPS.map((s, i) =>
              // Part 0's clicks share one button, which starts at its first click
              MAP_STEPS[i - 1]?.rail === s.rail ? null : (
                <button key={s.rail} type="button" aria-label={`${s.rail}: ${s.title}`} aria-current={s.rail === step.rail ? 'step' : undefined} className={s.rail === step.rail ? 'is-now' : i < n ? 'is-done' : ''} onClick={() => jump(i)}>
                  {s.rail}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
