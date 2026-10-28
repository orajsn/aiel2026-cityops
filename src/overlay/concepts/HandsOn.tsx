import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { Rich } from '../Rich';
import { EASE } from './WidePanel';
import { LAB_STOPS, stopCells } from '../../content/labStops';

/**
 * Lab 3 pages 15 to 19, the notebook's Parts 1 to 5 (owner, 25 Oct; sketches agreed in chat). They play in
 * the Ops room, so the panel sits on the right and the room stays in view. Teal bold for the idea, a tinted
 * chip behind the values the notebook prints, and at most one red thing per page.
 */

const TEAL_TINT = 'rgba(27, 138, 156, 0.12)';
const GREY_TINT = 'rgba(127, 127, 127, 0.1)';
const RED = 'var(--red)';

export function SidePanel({ kicker, message, notebook, testId, step, children }: { kicker: string; message: string; notebook?: string; testId: string; step?: number; children: ReactNode }) {
  return (
    <div className="beat">
      {/* above the Ops room's 3D labels (zIndexRange 15-30), below Camera mode (40) */}
      <motion.div
        className="beat__panel"
        data-testid={testId}
        data-step={step}
        style={{ width: 860, maxHeight: 'none', zIndex: 35 }}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="beat__kicker">{kicker}</div>
        <AnimatePresence mode="wait">
          <motion.div key={message} className="beat__headline" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease: EASE }}>
            <Rich text={message} />
          </motion.div>
        </AnimatePresence>
        {children}
        {notebook && <div className="beat__notebook">notebook · {notebook}</div>}
      </motion.div>
    </div>
  );
}

const In = ({ delay, children, style, ...rest }: { delay: number; children: ReactNode; style?: CSSProperties; [k: `data-${string}`]: string | undefined }) => (
  <motion.div style={style} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: EASE }} {...rest}>
    {children}
  </motion.div>
);

/** a value the notebook prints, on a tinted chip */
const Chip = ({ children, tone = 'teal', code = false }: { children: ReactNode; tone?: 'teal' | 'grey' | 'red'; code?: boolean }) => (
  <span
    className={code ? 'code' : undefined}
    style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 8,
      fontWeight: 700,
      background: tone === 'teal' ? TEAL_TINT : tone === 'red' ? 'rgba(199, 70, 52, 0.12)' : GREY_TINT,
      color: tone === 'teal' ? 'var(--teal)' : tone === 'red' ? RED : 'var(--ink)',
    }}
  >
    {children}
  </span>
);

const Arrow = ({ delay, label }: { delay: number; label?: string }) => (
  <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--teal)' }} initial={{ opacity: 0, scaleX: 0.3 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay, duration: 0.5, ease: EASE }}>
    {label && <span style={{ fontSize: 17, fontWeight: 700 }}>{label}</span>}
    <svg width={64} height={20} viewBox="0 0 64 20" aria-hidden>
      <line x1={2} y1={10} x2={54} y2={10} stroke="var(--teal)" strokeWidth={5} strokeLinecap="round" />
      <path d="M46 2 L60 10 L46 18" fill="none" stroke="var(--teal)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </motion.div>
);

/* ---------- page 15 · One connection ---------- */

export interface HandsOnProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  notebook?: string;
  /** the page's Jupyter stop (labStops.ts): its cells are listed at the bottom, one brief line each */
  stop?: string;
}

/**
 * What the cells do (reviewer, 27 Oct): the page's cells to run, numbered as in the Jupyter drawer, one brief line
 * each, at the bottom of the panel.
 */
export function CellBrief({ stop, delay }: { stop?: string; delay: number }) {
  const s = stop ? LAB_STOPS[stop] : undefined;
  if (!s) return null;
  const runs = stopCells(s).filter((c) => c.run && c.mark?.brief);
  return (
    <In delay={delay} style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim)', marginBottom: 8 }}>What the cells do</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
        {runs.map((c) => (
          <div key={c.run} data-brief={String(c.run)} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: 'var(--ink)', lineHeight: 1.25 }}>
            <span style={{ flex: 'none', width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--teal)', color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{c.run}</span>
            <span>{c.mark!.brief}</span>
          </div>
        ))}
      </div>
    </In>
  );
}

export function OneConnection({ kicker, message, notebook, stop }: HandsOnProps) {
  const inside = [
    { name: 'Memory', sub: 'what it learns' },
    { name: 'Findings', sub: 'the record' },
    { name: 'Embedding model', sub: 'ALL_MINILM_L12_V2', code: true },
  ];
  /** the lab's two models and their jobs (reviewer, 27 Oct) */
  const models = [
    { id: 'embedding', name: 'Embedding model', job: 'turns text into a vector, for similarity search', where: 'ONNX, inside Oracle Database', teal: true },
    { id: 'llm', name: 'Language model', job: 'reads text to extract memories and write the answers', where: 'Ollama, prepared for the lab', teal: false },
  ];
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="one-connection">
      <div style={{ display: 'grid', gridTemplateColumns: '150px 80px 1fr', alignItems: 'center', marginTop: 12 }}>
        <In delay={0.3} data-box="copilot" style={{ padding: '26px 0', textAlign: 'center', borderRadius: 14, background: GREY_TINT, border: '2px solid var(--line)', fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>
          AI Agent
        </In>
        <Arrow delay={0.8} label="one" />
        <In delay={1.2} data-box="database" style={{ padding: '10px 14px 14px', borderRadius: 16, border: '2px solid var(--teal)', background: TEAL_TINT }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)', textAlign: 'center', marginBottom: 10 }}>Oracle AI Database</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {inside.map((b, i) => (
              <In key={b.name} delay={1.6 + i * 0.3} data-inside={b.name} style={{ padding: '10px 8px', borderRadius: 12, background: 'rgba(27, 138, 156, 0.18)', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{b.name}</div>
                <div className={b.code ? 'code' : undefined} style={{ fontSize: b.code ? 14 : 17, color: 'var(--ink)', marginTop: 6 }}>{b.sub}</div>
              </In>
            ))}
          </div>
        </In>
      </div>
      <In delay={2.7} style={{ marginTop: 14, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim)' }}>
        Two models, two jobs
      </In>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {models.map((m, i) => (
          <In key={m.id} delay={2.9 + i * 0.3} data-model={m.id} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 14, padding: '7px 16px', borderRadius: 10, background: m.teal ? TEAL_TINT : GREY_TINT, border: `2px solid ${m.teal ? 'var(--teal)' : 'var(--line)'}` }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: m.teal ? 'var(--teal)' : 'var(--ink)' }}>{m.name}</span>
            <span style={{ fontSize: 18, color: 'var(--ink)', lineHeight: 1.3 }}>
              {m.job}
              <span style={{ display: 'block', fontSize: 16, color: 'var(--ink-dim)' }}>{m.where}</span>
            </span>
          </In>
        ))}
      </div>
      <In delay={3.6} style={{ marginTop: 10, fontSize: 21, color: 'var(--ink)' }}>
        <Rich text="**Embeddings run inside Oracle Database.**" />
      </In>
      <CellBrief stop={stop} delay={3.9} />
    </SidePanel>
  );
}

/* ---------- page 16 · The write path ---------- */

/** what the notebook's peek_sdk_tables prints after the smoke test (storyline doc, Lab 3 research tab) */
export const EXTRACTED = [
  { type: 'fact', text: 'SC-4 partially detached, water pooling 18 mm' },
  { type: 'guideline', text: 'use emergency clamp RK-400' },
];

export function WritePath({ kicker, message, notebook, stop }: HandsOnProps) {
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="write-path">
      <In delay={0.3} style={{ display: 'flex', justifyContent: 'center' }}>
        <span data-box="report" style={{ padding: '12px 26px', borderRadius: '20px 20px 4px 20px', background: 'var(--teal)', color: '#ffffff', fontSize: 22, fontWeight: 600 }}>
          An inspector’s report
        </span>
      </In>
      <svg viewBox="0 0 800 60" width="100%" height={60} style={{ display: 'block' }} aria-hidden>
        {[
          ['M400 4 C400 30 200 24 200 54', 0.8],
          ['M400 4 C400 30 600 24 600 54', 1.1],
        ].map(([d, delay]) => (
          <motion.path key={d as string} d={d as string} fill="none" stroke="var(--teal)" strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay as number, duration: 0.6, ease: EASE }} />
        ))}
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 18, alignItems: 'start' }}>
        <div>
          <In delay={1.3} data-box="CITY_MESSAGE" style={{ padding: '18px 20px', borderRadius: 14, background: GREY_TINT, border: '2px solid var(--line)' }}>
            <div className="code" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>CITY_MESSAGE</div>
            <div style={{ fontSize: 20, color: 'var(--ink)' }}>
              <Rich text="the whole report, **word for word**" />
            </div>
          </In>
          <In delay={2.9} style={{ marginTop: 16, fontSize: 21, color: 'var(--ink)' }}>
            <Chip>1 message</Chip> → <Chip>3 memories</Chip>
          </In>
        </div>
        <In delay={1.6} data-box="CITY_MEMORY" style={{ padding: '18px 20px', borderRadius: 14, background: TEAL_TINT, border: '2px solid var(--teal)' }}>
          <div className="code" style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal)', marginBottom: 12 }}>CITY_MEMORY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EXTRACTED.map((m, i) => (
              <In key={m.text} delay={2.1 + i * 0.4} data-memory={m.type} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(27, 138, 156, 0.18)', fontSize: 20, color: 'var(--ink)', lineHeight: 1.35 }}>
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--teal)', marginRight: 10 }}>{m.type}</span>
                {m.text}
              </In>
            ))}
          </div>
        </In>
      </div>
      <CellBrief stop={stop} delay={3.3} />
    </SidePanel>
  );
}

/* ---------- page 17 · Scope is the key (two clicks) ---------- */

export interface ScopeProps extends HandsOnProps {
  /** 1: the search with no user id finds nothing; 2: with the right key the memories light up */
  step: 1 | 2;
}

export function Scope({ kicker, message, notebook, step }: ScopeProps) {
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="scope" step={step}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 10 }}>
        <div data-scope="none">
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim)', marginBottom: 8 }}>Click 1</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>search with</div>
          <Chip tone="grey" code>user_id=None</Chip>
          <div style={{ textAlign: 'center', fontSize: 28, color: 'var(--ink-dim)', lineHeight: '44px' }}>↓</div>
          <div style={{ height: 170, borderRadius: 14, border: '2px dashed #8a919c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.span style={{ fontSize: 24, fontWeight: 700, color: step === 1 ? RED : 'var(--ink-dim)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: step === 1 ? 0.8 : 0, duration: 0.4 }}>
              0 memories found
            </motion.span>
          </div>
        </div>
        <div data-scope="inspector_demo" style={{ opacity: step === 2 ? 1 : 0.35 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim)', marginBottom: 8 }}>Click 2</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>the same search with</div>
          <Chip code>{'user_id="inspector_demo"'}</Chip>
          <div style={{ textAlign: 'center', fontSize: 28, color: 'var(--teal)', lineHeight: '44px' }}>↓</div>
          <div style={{ height: 170, borderRadius: 14, border: `2px ${step === 2 ? 'solid var(--teal)' : 'dashed #8a919c'}`, background: step === 2 ? TEAL_TINT : 'transparent', padding: 14, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {step === 2 &&
              [...EXTRACTED.map((m) => `${m.type} · ${m.text}`), '+ more'].map((t, i) => (
                <motion.div
                  key={t}
                  data-found={t}
                  style={{ padding: '8px 12px', borderRadius: 8, fontSize: 17, color: 'var(--ink)', lineHeight: 1.3 }}
                  initial={{ opacity: 0, backgroundColor: 'rgba(27, 138, 156, 0)' }}
                  animate={{ opacity: 1, backgroundColor: 'rgba(27, 138, 156, 0.22)' }}
                  transition={{ delay: 0.5 + i * 0.3, duration: 0.5 }}
                >
                  {t}
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </SidePanel>
  );
}

/* ---------- page 18 · The system of record ---------- */

export function SystemOfRecord({ kicker, message, notebook }: HandsOnProps) {
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="system-of-record">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 18, marginTop: 10, alignItems: 'stretch' }}>
        <In delay={0.3} data-shelf="CITY_MEMORY" style={{ padding: '20px 22px', borderRadius: 14, background: GREY_TINT, border: '2px solid var(--line)' }}>
          <div className="code" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>CITY_MEMORY</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>what the agent learns</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', lineHeight: 1.4 }}>written by the agent itself, from every chat</div>
        </In>
        <In delay={0.8} data-shelf="CITY_INSPECTION_FINDING" style={{ padding: '20px 22px', borderRadius: 14, background: TEAL_TINT, border: '2px solid var(--teal)' }}>
          <div className="code" style={{ fontSize: 22, fontWeight: 700, color: 'var(--teal)', marginBottom: 10 }}>CITY_INSPECTION_FINDING</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>what the city records</div>
          <div style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 10 }}>
            <Chip>15 findings</Chip>, each with
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {['category', 'severity', 'grade', 'recommendation', 'embedding'].map((f) => (
              <span key={f} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(27, 138, 156, 0.18)', fontSize: 17, color: 'var(--ink)' }}>
                {f}
              </span>
            ))}
          </div>
          {/* the one red thing on the page: the finding Mercer logs on purpose */}
          <In delay={1.6} data-finding="mercer" style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${RED}`, background: 'rgba(199, 70, 52, 0.08)' }}>
            <div style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 6 }}>
              <Rich text="Mercer logs one **on purpose**:" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: RED }}>corrosion · medium · grade C</div>
            <div style={{ fontSize: 20, color: 'var(--ink)', marginTop: 4 }}>repair within 60 days</div>
          </In>
        </In>
      </div>
    </SidePanel>
  );
}

/* ---------- page 19 · Vector search with walls ---------- */

/** the findings as dots: [x, y, near the question, asset Harbor Bridge, corrosion] */
const DOTS: [number, number, boolean][] = [
  [40, 30, false], [92, 250, false], [330, 22, false], [350, 262, false], [52, 160, false], [300, 270, false], [70, 270, false], [340, 120, false],
  [120, 24, false], [270, 30, false],
  [170, 150, true], [222, 128, true], [205, 200, true], [252, 186, true], [158, 206, true],
];
const Q: [number, number] = [205, 168];

export function VectorWalls({ kicker, message, notebook }: HandsOnProps) {
  return (
    <SidePanel kicker={kicker} message={message} notebook={notebook} testId="vector-walls">
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24, alignItems: 'center', marginTop: 6 }}>
        <svg viewBox="0 0 400 300" width={400} height={300} style={{ display: 'block' }} aria-label="Findings as points; the five nearest the question light up">
          <rect x={2} y={2} width={396} height={296} rx={14} fill="none" stroke="#8a919c" strokeWidth={2} strokeDasharray="6 6" />
          {DOTS.map(([x, y, near], i) => (
            <motion.circle
              key={i}
              data-dot={near ? 'near' : 'far'}
              cx={x}
              cy={y}
              r={near ? 10 : 8}
              initial={{ opacity: 0, fill: '#b4b2a9' }}
              animate={{ opacity: 1, fill: near ? '#1b8a9c' : '#b4b2a9' }}
              transition={{ opacity: { delay: 0.2 + i * 0.04, duration: 0.3 }, fill: { delay: near ? 1.4 : 0, duration: 0.5 } }}
            />
          ))}
          <motion.circle cx={Q[0]} cy={Q[1]} r={72} fill="none" stroke="#1b8a9c" strokeWidth={2.5} strokeDasharray="5 5" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.6, ease: EASE }} style={{ transformOrigin: `${Q[0]}px ${Q[1]}px` }} />
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
            <path d={`M${Q[0]} ${Q[1] - 9} L${Q[0] + 3} ${Q[1] - 3} L${Q[0] + 9} ${Q[1]} L${Q[0] + 3} ${Q[1] + 3} L${Q[0]} ${Q[1] + 9} L${Q[0] - 3} ${Q[1] + 3} L${Q[0] - 9} ${Q[1]} L${Q[0] - 3} ${Q[1] - 3} Z`} fill="var(--ink)" />
            <text x={Q[0]} y={Q[1] + 98} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--teal)">
              the nearest 5 light up
            </text>
          </motion.g>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['asset = Harbor Bridge', 'category = corrosion'].map((w, i) => (
            <In key={w} delay={2.0 + i * 0.4} data-wall={w} style={{ padding: '10px 14px', borderRadius: 10, background: TEAL_TINT, border: '2px solid var(--teal)', fontSize: 20, color: 'var(--ink)' }}>
              <span style={{ fontWeight: 700, color: 'var(--teal)', marginRight: 10 }}>wall {i + 1}</span>
              {w}
            </In>
          ))}
          <In delay={3.0} style={{ fontSize: 20, color: 'var(--ink)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            found: <Chip>broad 5</Chip> <Chip>asset 5</Chip> <Chip>category 4</Chip>
          </In>
          <In delay={3.4} style={{ fontSize: 20, color: 'var(--ink)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            top 3: <Chip>0.187</Chip> <Chip>0.190</Chip> <Chip>0.208</Chip>
          </In>
          <In delay={3.8} style={{ fontSize: 18, color: 'var(--ink)' }}>
            each wall in the SQL: <Chip tone="grey" code>(:bind IS NULL OR col = :bind)</Chip>
          </In>
        </div>
      </div>
    </SidePanel>
  );
}
