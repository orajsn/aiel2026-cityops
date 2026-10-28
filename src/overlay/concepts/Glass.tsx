import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon, type IconName } from './icons';
import vancePortrait from '../../assets/portraits/vance.png';

export interface GlassProps {
  kicker: string;
  /** the one line the presenter lands; **teal** and !!red!! marks as in Rich.tsx */
  message: string;
  /** 1: the glass fills with what goes into the context window; 2: the four ways that goes wrong */
  step: 1 | 2;
  notebook?: string;
}

/** what fills the glass, bottom to top (owner-approved V2 mock, 28 Oct) */
export const GLASS_LAYERS = ['System prompt', 'Developer instructions', 'Tool list', 'Retrieved notes', 'Chat so far', 'Vance’s question'];
/** the three short lines under the glass */
export const GLASS_FACTS = ['Fixed size: it fills up.', 'It is the only thing the model reads.', 'We pour it in, every turn.'];
/** what is outside the glass: the model never sees any of it */
const OUTSIDE = ['Mercer’s Day 1 chat (closed)', 'the database', 'yesterday'];

/**
 * The curation problem (slide 28), told with the bridge instead of the deck's running shoes (owner, 25 Oct). Each has
 * its icon, the same one again when it is solved (Ending.tsx, 3.15b), so the audience links problem and fix.
 */
export const CURATION: { word: string; title: string; text: string; icon: IconName }[] = [
  { word: 'Volume', title: 'The window fills up', text: 'By turn 15 the window is full. One more tool call and it breaks.', icon: 'overflow' },
  { word: 'Relevance', title: 'Wrong data is in it', text: 'Mercer’s finding is there, but buried under search results Vance never asked for.', icon: 'target' },
  { word: 'Accuracy', title: 'Summaries lose details', text: 'The summary says “rust on the pier” but lost the 25%.', icon: 'inspect' },
  { word: 'Timing', title: 'The right memory, at the wrong moment', text: 'Her finding was loaded at the start, not fetched again when Vance asked.', icon: 'clock' },
];

const GREY_LINE = '#8a919c';
const GREY_FILL = 'rgba(138, 145, 156, 0.28)';
const TEAL_FILL = 'rgba(27, 138, 156, 0.30)';

/**
 * 3.3 · The glass: the context window as a tumbler that fills, layer by layer, with everything the model
 * will see (click 1), then the four ways filling it goes wrong, told with Mercer's finding and Vance's
 * question (click 2). One panel across both clicks: only what is inside it cross-fades.
 */
export function Glass({ kicker, message, step, notebook }: GlassProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="glass" step={step}>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="fill" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <GlassFill />
          </motion.div>
        ) : (
          <motion.div key="wrong" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <FourGlasses />
          </motion.div>
        )}
      </AnimatePresence>
    </WidePanel>
  );
}

/* ---------- step 1 ---------- */

const LAYER_H = 60;
const GLASS_W = 440;
const GLASS_TOP = 22;
const GLASS_H = GLASS_TOP + LAYER_H * GLASS_LAYERS.length + 6;
const SLANT = 0.17; // each side leans in by this share of the width at the bottom

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg width={40} height={40} viewBox="0 0 48 48" fill="none" stroke={off ? GREY_LINE : 'var(--teal)'} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 24c5-9 11-13 20-13s15 4 20 13c-5 9-11 13-20 13S9 33 4 24z" />
      <circle cx="24" cy="24" r="6" />
      {off && <path d="M8 40L40 8" />}
    </svg>
  );
}
const PourIcon = () => (
  <svg width={40} height={40} viewBox="0 0 48 48" fill="none" stroke="var(--teal)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 6h32M24 12v16M16 21l8 8 8-8M10 34h28l-3 10H13z" />
  </svg>
);

/** a small drawing of the language model: a few layers of nodes, a wave of light through them */
function NeuralDrawing() {
  const cols = [
    [60, 150, 240],
    [30, 105, 195, 270],
    [60, 150, 240],
    [150],
  ];
  const xs = [20, 90, 160, 230];
  const nodes = cols.flatMap((c, ci) => c.map((y) => ({ x: xs[ci], y })));
  const links: [number, number, number, number][] = [];
  cols.forEach((c, ci) => {
    if (ci === cols.length - 1) return;
    for (const y1 of c) for (const y2 of cols[ci + 1]) links.push([xs[ci], y1, xs[ci + 1], y2]);
  });
  return (
    <svg data-net="language-model" width={260} height={300} viewBox="0 0 260 300" style={{ overflow: 'visible' }} aria-hidden="true">
      {links.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--teal)" strokeOpacity={0.4} strokeWidth={1.5} />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.x} cy={n.y} r={n.x === 230 ? 11 : 7} fill="var(--teal)" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ delay: 4 + (n.x / 230) * 1.2, duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }} />
      ))}
    </svg>
  );
}

function GlassFill() {
  const clip = `polygon(0 0, 100% 0, ${100 - SLANT * 100}% 100%, ${SLANT * 100}% 100%)`;
  const outline = `M0 ${GLASS_TOP} L${GLASS_W * SLANT} ${GLASS_H} L${GLASS_W * (1 - SLANT)} ${GLASS_H} L${GLASS_W} ${GLASS_TOP}`;
  return (
    <div>
      <div style={{ position: 'relative', width: 1400, height: GLASS_H + 24, margin: '8px auto 0' }}>
        {/* the glass */}
        <div data-glass="fill" style={{ position: 'absolute', left: 0, top: 0, width: GLASS_W, height: GLASS_H }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: GLASS_TOP, bottom: 0, clipPath: clip, display: 'flex', flexDirection: 'column-reverse' }}>
            {GLASS_LAYERS.map((name, i) => (
              <motion.div
                key={name}
                data-layer={name}
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.32, duration: 0.6, ease: EASE }}
                style={{ height: LAYER_H, boxSizing: 'border-box', borderTop: '3px solid var(--panel-bg, rgba(255,255,255,0.0))', background: `rgba(27, 138, 156, ${0.12 + i * 0.045})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 24, fontWeight: 600, color: 'var(--ink)', ...(i === 0 ? { paddingBottom: 6 } : {}) }}
              >
                {name === 'Vance’s question' && <img data-portrait="vance" src={vancePortrait} alt="" width={46} height={46} style={{ borderRadius: '50%', border: '2px solid var(--teal)', objectFit: 'cover' }} />}
                {name}
              </motion.div>
            ))}
          </div>
          <svg width={GLASS_W} height={GLASS_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden="true">
            <path d={outline} fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeLinejoin="round" />
            <line x1={0} y1={GLASS_TOP} x2={GLASS_W} y2={GLASS_TOP} stroke="var(--ink-dim)" strokeWidth={2.5} strokeDasharray="9 7" />
          </svg>
        </div>
        <motion.div data-rim="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.5 }} style={{ position: 'absolute', left: GLASS_W + 24, top: GLASS_TOP - 14, fontSize: 19, fontWeight: 600, color: 'var(--ink-dim)' }}>
          full line: no more fits
        </motion.div>

        {/* the one arrow, and the model */}
        <motion.div data-arrow="sees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.5 }} style={{ position: 'absolute', left: 480, top: 190, width: 290, textAlign: 'center' }}>
          <div style={{ fontSize: 23, fontWeight: 700, color: 'var(--teal)', lineHeight: 1.25, marginBottom: 6 }}>
            it sees this,
            <br />
            and nothing else
          </div>
          <svg width={290} height={36} viewBox="0 0 290 36" aria-hidden="true">
            <motion.path d="M4 18h278M266 4l16 14-16 14" fill="none" stroke="var(--teal)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 0.7, ease: EASE }} />
          </svg>
        </motion.div>
        <motion.div data-model="language-model" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 0.6 }} style={{ position: 'absolute', left: 790, top: 90, width: 260, textAlign: 'center' }}>
          <NeuralDrawing />
          <div style={{ fontSize: 23, fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>the language model</div>
        </motion.div>

        {/* outside the glass */}
        <div data-outside="glass" style={{ position: 'absolute', left: 1090, top: 70, width: 310 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ink-dim)', marginBottom: 12 }}>OUTSIDE THE GLASS</div>
          {OUTSIDE.map((o, i) => (
            <motion.div
              key={o}
              data-outside-item={o}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.1 + i * 0.25, duration: 0.5, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', marginBottom: 12, border: `2px dashed ${GREY_LINE}`, borderRadius: 8, background: 'rgba(138, 145, 156, 0.1)', color: 'var(--ink-dim)' }}
            >
              <EyeIcon off />
              <div>
                <div style={{ fontSize: 22 }}>{o}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>not seen</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18, marginTop: 28 }}>
        {GLASS_FACTS.map((f, i) => (
          <motion.div key={f} data-fact={f} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 + i * 0.25, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderRadius: 10, background: 'rgba(127, 127, 127, 0.1)', fontSize: 23, fontWeight: 600, color: 'var(--ink)' }}>
            {i === 0 ? <LineIcon name="glass" size={40} /> : i === 1 ? <EyeIcon /> : <PourIcon />}
            {f}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- step 2 ---------- */

/** each glass plays for about 2 s, one after another */
const SLOT = 1.1;
const START = 0.4;

const WRONG: { word: string; text: string }[] = [
  { word: 'Volume', text: 'every tool result piles in; by turn 15 it overflows' },
  { word: 'Relevance', text: '30 search results bury Mercer’s finding' },
  { word: 'Accuracy', text: 'squeezed into a summary, the 25% is lost' },
  { word: 'Timing', text: 'her finding was there at the start, not when Vance asks' },
];

/** a tumbler 200 wide, rim at y=40, base at y=230; pieces are drawn inside it */
const TUMBLER = 'M22 40L44 228Q100 238 156 228L178 40';

function MiniGlass({ word, t0, children }: { word: string; t0: number; children: (t0: number) => ReactNode }) {
  return (
    <svg data-glass={word} width={200} height={270} viewBox="0 0 200 270" style={{ overflow: 'visible' }} aria-hidden="true">
      {children(t0)}
      <path d={TUMBLER} fill="none" stroke={GREY_LINE} strokeWidth={3} strokeLinejoin="round" />
      <line x1={14} y1={40} x2={186} y2={40} stroke={GREY_LINE} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

const pop = (delay: number) => ({ initial: { opacity: 0, y: -14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.35, ease: EASE } });

const VolumeGlass = (t0: number) => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.rect key={i} data-piece="turn" x={52} y={206 - i * 25} width={96} height={19} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + i * 0.08)} />
    ))}
    <motion.rect data-piece="lid" x={62} y={0} width={80} height={14} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} initial={{ opacity: 0, y: 30, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 20 }} transition={{ delay: t0 + 0.9, duration: 0.5, ease: EASE }} style={{ transformOrigin: '100px 7px' }} />
  </>
);

const RelevanceGlass = (t0: number) => (
  <>
    {Array.from({ length: 25 }).map((_, i) => {
      const r = Math.floor(i / 5);
      const c = i % 5;
      const hit = i === 12;
      return (
        <motion.rect
          key={i}
          data-piece={hit ? 'finding' : 'result'}
          x={59 + c * 17}
          y={146 + r * 16 - 0}
          width={14}
          height={12}
          rx={2}
          fill={hit ? TEAL_FILL : GREY_FILL}
          stroke={hit ? 'var(--teal)' : GREY_LINE}
          strokeWidth={hit ? 2 : 1}
          initial={{ opacity: 0, y: -16 }}
          animate={hit ? { opacity: 1, y: 0, scale: [1, 1.5, 1] } : { opacity: 1, y: 0 }}
          transition={{ delay: hit ? t0 + 0.8 : t0 + (i % 12) * 0.045, duration: hit ? 0.6 : 0.3, ease: EASE }}
          style={{ transformOrigin: `${59 + c * 17 + 7}px ${146 + r * 16 + 6}px` }}
        />
      );
    })}
  </>
);

const AccuracyGlass = (t0: number) => (
  <>
    {[0, 1, 2, 3].map((i) => (
      <motion.rect key={i} data-piece="turn" x={52} y={206 - i * 22} width={96} height={18} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} initial={{ opacity: 0, y: -14 }} animate={{ opacity: [0, 1, 1, 0], y: 0 }} transition={{ delay: t0, duration: 0.8, times: [0, 0.3, 0.7, 1], ease: EASE }} />
    ))}
    <motion.g data-piece="summary" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: t0 + 0.6, duration: 0.45, ease: EASE }} style={{ transformOrigin: '100px 195px' }}>
      <rect x={44} y={174} width={112} height={44} rx={4} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} />
      <text x={100} y={192} textAnchor="middle" fontSize={14} fill="var(--ink-dim)">summary:</text>
      <text x={100} y={210} textAnchor="middle" fontSize={14} fill="var(--ink-dim)">rust on the pier</text>
    </motion.g>
    <motion.text data-piece="lost" x={156} y={140} fontSize={26} fontStyle="italic" fontWeight={700} fill="var(--teal)" initial={{ opacity: 1, x: 0, y: 0 }} animate={{ opacity: [1, 1, 0], x: [0, 12, 34], y: [0, -14, -44], rotate: [0, 8, 20] }} transition={{ delay: t0 + 0.6, duration: 1, times: [0, 0.3, 1], ease: EASE }}>
      25%
    </motion.text>
  </>
);

const TimingGlass = (t0: number) => (
  <>
    <motion.g data-piece="finding" initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: [0, 0, 44] }} transition={{ delay: t0, duration: 1.0, times: [0, 0.4, 1], ease: EASE }}>
      <rect x={52} y={206} width={96} height={20} rx={3} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
      <text x={100} y={221} textAnchor="middle" fontSize={14} fill="var(--teal)">turn 1</text>
    </motion.g>
    {[0, 1, 2].map((i) => (
      <motion.rect key={i} data-piece="turn" x={52} y={206 - i * 26} width={96} height={20} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + 0.25 + i * 0.15)} />
    ))}
  </>
);

const DRAW = [VolumeGlass, RelevanceGlass, AccuracyGlass, TimingGlass];

function FourGlasses() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 4, paddingTop: 12 }}>
        {WRONG.map((w, i) => (
          <motion.div key={w.word} data-problem={w.word} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <MiniGlass word={w.word} t0={START + i * SLOT}>
              {DRAW[i]}
            </MiniGlass>
            {/* the same icon comes back when the problem is solved (Ending.tsx, 3.15b) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontWeight: 700, color: 'var(--ink)', marginTop: 10 }}>
              <LineIcon name={CURATION[i].icon} size={34} />
              {w.word}
            </div>
            <div style={{ fontSize: 20, lineHeight: 1.35, color: 'var(--ink-dim)', marginTop: 6, maxWidth: 300 }}>{w.text}</div>
          </motion.div>
        ))}
      </div>
      <div data-legend="glass" style={{ display: 'flex', gap: 40, marginTop: 20, fontSize: 18, color: 'var(--ink-dim)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <i style={{ width: 24, height: 18, borderRadius: 3, background: GREY_FILL, border: `1.5px solid ${GREY_LINE}` }} /> grey = noise and old turns
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <i style={{ width: 24, height: 18, borderRadius: 3, background: TEAL_FILL, border: '2px solid var(--teal)' }} /> teal = what Vance needs
        </span>
      </div>
    </div>
  );
}
