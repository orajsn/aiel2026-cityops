import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import vancePortrait from '../../../assets/portraits/vance.png';
import { EASE } from '../WidePanel';
import { Fill } from '../Fill';
import { CARD, ChiefInspector, DIM, INK, SOFT, TEAL, TEAL_D, TINT, TINT2, cap, capTeal } from './parts';

/**
 * 2.0 · Why AI needs your data (owner, 29 Oct: "animation of graphic explaining what no data is, same for all 3
 * cards"). Three columns, one per layer, from the ground up: data, automation, trust. Each column plays a small
 * looping scene of what goes wrong without its layer: the engineer opens an empty drawer and guesses; the lookups
 * pile up behind one person like a bottleneck; the AI agent's action stops at a closed barrier.
 * 2.0a · the four levels as a staircase: each step up gives the system more freedom.
 */

const T = 'var(--teal)';
const G = '#8a97a3';
const GL = 'rgba(127,127,127,0.35)';
const F = 'rgba(27, 138, 156, 0.16)';
/** every scene loops on this cycle (s) */
const CYCLE = 6;
/** a keyframe animation that plays once per cycle, after the column has arrived */
const loop = (start: number, times: number[]) => ({ delay: start, duration: CYCLE, times, repeat: Infinity, ease: 'easeInOut' as const });

/* ---------- 1 · no data: an empty drawer, a bridge it has never seen, a guess ---------- */

const VB = '0 0 420 380';
const svgProps = { viewBox: VB, width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid meet', role: 'img', style: { display: 'block', overflow: 'hidden' } } as const;

/** a speech bubble: what the figure says or wants */
function Bubble({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M14 0h${w - 28}a14 14 0 0 1 14 14v${h - 28}a14 14 0 0 1-14 14H40l-22 18 4-18h-8A14 14 0 0 1 0 ${h - 14}V14A14 14 0 0 1 14 0z`} fill={CARD} stroke={G} strokeWidth={2.6} strokeLinejoin="round" />
      {children}
    </g>
  );
}

function NoDataScene({ start }: { start: number }) {
  return (
    <svg {...svgProps} aria-label="no data: the drawer is empty">
      {/* the engineer, grey: well read, but nothing about this bridge */}
      <g transform="translate(4 112)">
        <ChiefInspector size={140} grey label="the language model" />
      </g>
      {/* its answer: a guess, grey lines, a question mark */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={loop(start, [0, 0.42, 0.5, 0.9, 1])}>
        <Bubble x={70} y={6} w={230} h={86}>
          <path d="M22 28h120M22 46h150M22 64h90" stroke={GL} strokeWidth={6} strokeLinecap="round" />
          <text x="200" y="68" textAnchor="middle" fontSize="54" fontWeight="700" fill={T} fontFamily="Inter, sans-serif">?</text>
        </Bubble>
      </motion.g>
      {/* the records drawer slides open: nothing inside */}
      <g transform="translate(176 150)">
        <rect x="0" y="0" width="104" height="110" rx="4" fill={SOFT} stroke={G} strokeWidth={2.6} />
        <path d="M0 55h104" stroke={G} strokeWidth={2} />
        <path d="M44 82h16" stroke={G} strokeWidth={3} strokeLinecap="round" />
        <motion.g initial={{ x: 0 }} animate={{ x: [0, 0, 44, 44, 0] }} transition={loop(start, [0, 0.06, 0.18, 0.88, 1])}>
          <rect x="0" y="4" width="104" height="46" rx="3" fill={CARD} stroke={G} strokeWidth={2.6} />
          <rect x="8" y="11" width="88" height="32" rx="2" fill="none" stroke={G} strokeWidth={1.8} strokeDasharray="5 5" />
        </motion.g>
        <motion.text x="96" y="-10" textAnchor="middle" fontSize="20" fill={G} fontFamily="Inter, sans-serif" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={loop(start, [0, 0.18, 0.26, 0.88, 1])}>
          no records
        </motion.text>
      </g>
      {/* the bridge it has never seen: only a dashed outline */}
      <g transform="translate(40 296)">
        <path d="M0 40h360" stroke={GL} strokeWidth={6} strokeDasharray="10 8" />
        <path d="M14 40C90 -6 270 -6 346 40" fill="none" stroke={GL} strokeWidth={4} strokeDasharray="10 8" />
        {[40, 120, 240, 320].map((x) => <path key={x} d={`M${x} 40v40`} stroke={GL} strokeWidth={7} strokeDasharray="8 6" />)}
      </g>
    </svg>
  );
}

/* ---------- 2 · no automation: lookups queue up behind one person ---------- */

function Lookup({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="34" height="42" rx="3" fill={CARD} stroke={G} strokeWidth={2} />
      <path d="M7 10h20M7 18h15M7 26h19" stroke={G} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}

/** the pile inside the bottle (its wide body is at the top, the neck points down) */
const PILE = [
  [92, 196], [130, 196], [168, 196], [206, 196], [244, 196], [282, 196],
  [110, 150], [148, 150], [186, 150], [224, 150], [262, 150],
  [128, 104], [166, 104], [204, 104], [242, 104],
];

function BottleneckScene({ start }: { start: number }) {
  return (
    <svg {...svgProps} aria-label="no automation: every lookup waits for one person">
      <defs>
        <clipPath id="why-vance">
          <circle cx="0" cy="0" r="40" />
        </clipPath>
      </defs>
      {/* an upside-down bottle: a wide body full of lookups, a narrow neck at the bottom */}
      <path d="M70 70h280v160c0 26-70 36-90 60v40h-100v-40c-20-24-90-34-90-60z" fill={SOFT} stroke={G} strokeWidth={2.8} strokeLinejoin="round" />
      {PILE.map(([x, y], i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: start - 0.4 + i * 0.04, duration: 0.3 }}>
          <Lookup x={x} y={y} />
        </motion.g>
      ))}
      {/* a new lookup drops in at the top while one squeezes out through the neck: the pile never shrinks */}
      <motion.g initial={{ opacity: 0 }} animate={{ y: [-70, 0, 0], opacity: [0, 1, 1] }} transition={{ ...loop(start, [0, 0.25, 1]), ease: 'easeOut' }}>
        <Lookup x={280} y={104} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ y: [0, 40, 100, 120], opacity: [1, 1, 1, 0] }} transition={loop(start, [0, 0.4, 0.85, 1])}>
        <Lookup x={193} y={240} />
      </motion.g>
      {/* the person at the neck: every lookup goes through Vance's hands, slowly */}
      <g transform="translate(340 330)">
        <circle cx="0" cy="0" r="43" fill={CARD} stroke={T} strokeWidth={3} />
        <image href={vancePortrait} x="-40" y="-40" width="80" height="80" clipPath="url(#why-vance)" preserveAspectRatio="xMidYMid slice" />
      </g>
      <g transform="translate(76 330)">
        <circle cx="0" cy="0" r="22" fill={CARD} stroke={G} strokeWidth={3} />
        <motion.path d="M0 0V-14" stroke={G} strokeWidth={3} strokeLinecap="round" animate={{ rotate: 360 }} transition={{ delay: start, duration: CYCLE, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '0px 0px' }} />
        <path d="M0 0h9" stroke={G} strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---------- 3 · no trust: the agent's action stops at a closed barrier ---------- */

function BarrierScene({ start }: { start: number }) {
  return (
    <svg {...svgProps} aria-label="no trust: the barrier stays down">
      <g transform="translate(4 40)">
        <ChiefInspector size={150} />
      </g>
      {/* what it wants to do: fix the bridge */}
      <Bubble x={176} y={26} w={180} h={84}>
        <circle cx="62" cy="42" r="24" fill={F} stroke={T} strokeWidth={2.6} />
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" transform="translate(47 27) scale(1.25)" stroke={T} strokeWidth={1.8} strokeLinejoin="round" fill={CARD} />
        <path d="M100 42h20M112 34l8 8-8 8" stroke={T} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M132 50c4-8 14-8 18 0M130 50h22" stroke={G} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      </Bubble>
      {/* the road to the real asset, the barrier across it, the bridge at the end */}
      <path d="M30 300H420" stroke={GL} strokeWidth={4} strokeDasharray="8 10" />
      <g transform="translate(300 236)">
        <path d="M0 64h120" stroke={G} strokeWidth={7} />
        <path d="M6 64C34 16 86 16 114 64" fill="none" stroke={G} strokeWidth={5} />
        {[18, 46, 74, 102].map((x) => <path key={x} d={`M${x} 64v46`} stroke={G} strokeWidth={8} />)}
      </g>
      <rect x="244" y="230" width="14" height="96" rx="3" fill="#5c6b78" />
      <rect x="150" y="262" width="112" height="16" rx="4" fill={CARD} stroke="#5c6b78" strokeWidth={2.6} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={158 + i * 26} y={265} width={13} height={10} fill={GL} />)}
      {/* the padlock on the barrier: it gives a small shake when the action arrives */}
      <motion.g animate={{ rotate: [0, 0, -9, 9, -5, 0, 0] }} transition={loop(start, [0, 0.42, 0.46, 0.5, 0.54, 0.58, 1])} style={{ transformOrigin: '251px 214px' }}>
        <path d="M240 214v-11a11 11 0 0 1 22 0v11" fill="none" stroke={T} strokeWidth={3.6} />
        <rect x="233" y="211" width="36" height="30" rx="4" fill={T} />
        <circle cx="251" cy="225" r="4" fill="#fff" />
      </motion.g>
      {/* the action (a wrench) runs up to the barrier and bounces back */}
      <motion.g initial={{ opacity: 0 }} animate={{ x: [0, 0, 82, 56, 56], opacity: [0, 1, 1, 1, 0] }} transition={loop(start, [0, 0.08, 0.42, 0.56, 0.8])}>
        <circle cx="60" cy="300" r="20" fill={CARD} stroke={T} strokeWidth={3} />
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" transform="translate(47 287) scale(1.1)" stroke={T} strokeWidth={1.8} strokeLinejoin="round" fill={F} />
      </motion.g>
    </svg>
  );
}

/* ---------- 2.0 · three layers, three things that break ---------- */

export const LAYERS = [
  { title: 'Traction needs the right data', sub: 'your records, specs, history', without: 'No data', what: 'Generic advice about a bridge it has never seen.', Scene: NoDataScene },
  { title: 'More automation, fewer humans in the loop', sub: 'the system acts, people supervise', without: 'No automation', what: 'People stay the bottleneck for every lookup.', Scene: BottleneckScene },
  { title: 'Trust becomes a product requirement', sub: 'security · audit · observability', without: 'No trust', what: 'Nobody lets it act on a real asset.', Scene: BarrierScene },
];

const colAt = (i: number) => 0.3 + i * 0.9;

export function WhyLayers() {
  return (
    <Fill gap={10}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} style={{ flex: 'none', fontSize: 24, color: DIM, lineHeight: 1.35 }}>
        A smart engineer who has never seen this bridge can still give bad advice. Three layers make it work, <b style={{ color: INK }}>from the ground up</b>:
      </motion.div>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 22 }}>
        {LAYERS.map((l, i) => {
          const Scene = l.Scene;
          return (
            <motion.div key={l.without} data-layer={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: colAt(i), duration: 0.55, ease: EASE }} style={{ display: 'flex', flexDirection: 'column', borderRadius: 16, border: `2px solid ${i === 0 ? TEAL : 'var(--line)'}`, background: CARD, overflow: 'hidden' }}>
              {/* the layer */}
              <div style={{ padding: '12px 22px 12px', background: i === 0 ? TEAL : i === 1 ? TINT2 : TINT, color: i === 0 ? '#fff' : INK, display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ width: 44, height: 44, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, background: i === 0 ? '#fff' : TEAL, color: i === 0 ? TEAL_D : '#fff' }}>{i + 1}</span>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{l.title}</div>
                  <div style={{ fontSize: 20, opacity: 0.85, marginTop: 2 }}>{l.sub}</div>
                </div>
              </div>
              {/* what goes wrong without it, played as a small scene */}
              <div data-break={l.without} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 20px 14px', gap: 6 }}>
                <div style={{ ...capTeal, fontSize: 18 }}>Without it · {l.without}</div>
                <div style={{ flex: 1, minHeight: 120, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <Scene start={colAt(i) + 0.6} />
                  </div>
                </div>
                <div style={{ fontSize: 24, lineHeight: 1.35, color: INK, fontWeight: 500 }}>{l.what}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Fill>
  );
}

/* ---------- 2.0a · the ladder of four levels ---------- */

const LEVEL_ART: ReactNode[] = [
  // chatbot: a question, one reply, done
  <g key="c">
    <path d="M6 10h56a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H26l-10 9v-9H6a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" fill={F} stroke={T} strokeWidth={3} strokeLinejoin="round" transform="translate(4 0)" />
    <path d="M18 24h36M18 32h22" stroke={T} strokeWidth={2.6} strokeLinecap="round" />
    <path d="M58 44h46a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H96v8l-9-8H58a6 6 0 0 1-6-6V50a6 6 0 0 1 6-6z" fill={CARD} stroke={G} strokeWidth={3} strokeLinejoin="round" />
    <path d="M62 56h36M62 63h20" stroke={G} strokeWidth={2.6} strokeLinecap="round" />
  </g>,
  // RAG: a folder from the records goes into the reply
  <g key="r">
    <path d="M4 24a3 3 0 0 1 3-3h14l5 5h20a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill={F} stroke={T} strokeWidth={3} strokeLinejoin="round" />
    <path d="M56 42h14" stroke={T} strokeWidth={3} strokeDasharray="3 4" strokeLinecap="round" />
    <path d="M66 36l6 6-6 6" stroke={T} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M82 22h30a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6h-8v9l-10-9H82a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z" fill={CARD} stroke={T} strokeWidth={3} strokeLinejoin="round" />
    <path d="M86 34h22M86 42h14" stroke={T} strokeWidth={2.6} strokeLinecap="round" />
  </g>,
  // workflow: a fixed track, the same three stops every time
  <g key="w">
    <path d="M4 66h114" stroke={G} strokeWidth={3} />
    <path d="M4 74h114" stroke={G} strokeWidth={3} />
    {[12, 30, 48, 66, 84, 102].map((x) => <path key={x} d={`M${x} 62v16`} stroke={G} strokeWidth={2.6} />)}
    {[6, 46, 86].map((x, i) => (
      <g key={x}>
        <rect x={x} y="20" width="30" height="30" rx="5" fill={F} stroke={T} strokeWidth={3} />
        <text x={x + 15} y="41" textAnchor="middle" fontSize="17" fontWeight="700" fill={TEAL_D} fontFamily="Inter, sans-serif">{i + 1}</text>
      </g>
    ))}
    <path d="M37 35h8M77 35h8" stroke={T} strokeWidth={3} strokeLinecap="round" />
  </g>,
  // agent: one point, several ways out, it picks one
  <g key="a">
    <circle cx="22" cy="44" r="14" fill={T} />
    <path d="M36 44C60 44 66 14 92 14M36 44h56M36 44c24 0 30 30 56 30" fill="none" stroke={GL} strokeWidth={3} strokeLinecap="round" />
    <motion.path d="M36 44C60 44 66 14 92 14" fill="none" stroke={T} strokeWidth={4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ delay: 3, duration: 4, times: [0, 0.3, 0.85, 1], repeat: Infinity, repeatDelay: 1 }} />
    {[14, 44, 74].map((y) => <circle key={y} cx="102" cy={y} r="9" fill={y === 14 ? F : CARD} stroke={y === 14 ? T : G} strokeWidth={3} />)}
  </g>,
];

export const LEVELS = [
  { level: 'Chatbot', q: '“What is a hairline crack?”', who: 'nobody: one reply', free: 0.12 },
  { level: 'RAG', q: '“What does the record say about this bridge?”', who: 'the application', free: 0.35 },
  { level: 'Workflow', q: '“Triage this incident predictably.”', who: 'the code', free: 0.6 },
  { level: 'Agent', q: '“Reason it through and tell me what to do.”', who: 'the model', free: 0.9 },
];

export function Ladder() {
  return (
    <Fill>
      <div data-levels style={{ flex: '1 0 auto', minHeight: 450, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 18, alignItems: 'end' }}>
        {/* the empty corner over the low steps: the steps climb towards more freedom */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ position: 'absolute', left: 0, top: 0, width: '47%', display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <svg width={92} height={92} viewBox="0 0 92 92" aria-hidden style={{ flex: 'none' }}>
            <path d="M6 86h20V64h20V42h20V20h20" fill="none" stroke={G} strokeWidth={4} strokeLinejoin="round" />
            <path d="M14 70L78 8" stroke={T} strokeWidth={4} strokeLinecap="round" />
            <path d="M60 8h18v18" fill="none" stroke={T} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.2 }}>Each step up, more freedom</div>
            <div style={{ fontSize: 22, color: DIM, marginTop: 6, lineHeight: 1.35 }}>and more for us to control and observe.</div>
          </div>
        </motion.div>
        {LEVELS.map((l, i) => (
          <motion.div key={l.level} data-level={l.level} initial={{ opacity: 0, height: '20%' }} animate={{ opacity: 1, height: `${64 + i * 12}%` }} transition={{ delay: 0.3 + i * 0.35, duration: 0.6, ease: EASE }} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px 16px 6px 6px', border: `2px solid ${i === 3 ? TEAL : 'var(--line)'}`, background: i === 3 ? TINT : SOFT, padding: '16px 20px', gap: 10, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 38, height: 38, borderRadius: '50%', background: TEAL, color: '#fff', fontSize: 19, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{i + 1}</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: INK }}>{l.level}</span>
            </div>
            <div style={{ flex: 1, minHeight: 56, position: 'relative' }}>
              <svg viewBox="0 0 122 84" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden style={{ position: 'absolute', inset: 0, maxHeight: 170, margin: 'auto' }}>
                {LEVEL_ART[i]}
              </svg>
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.35, color: '#fff', background: 'rgba(31,42,51,0.9)', borderRadius: 14, padding: '10px 14px' }}>{l.q}</div>
            <div>
              <div style={{ fontSize: 22, color: DIM }}>
                next step: <b style={{ color: TEAL_D, fontSize: 24 }}>{l.who}</b>
              </div>
              <div style={{ height: 12, borderRadius: 6, background: 'rgba(127,127,127,0.18)', overflow: 'hidden', marginTop: 8 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${l.free * 100}%` }} transition={{ delay: 0.8 + i * 0.35, duration: 0.8, ease: EASE }} style={{ height: '100%', background: TEAL, borderRadius: 6 }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Fill>
  );
}
