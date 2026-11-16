import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';
import { LineIcon, type IconName } from './icons';
import { Fill, FitBox } from './Fill';
import vancePortrait from '../../assets/portraits/vance.png';
import { useDrawerStore } from '../../engine/presentation';
const adbLogo = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2220%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M20%2028v44c0%2018%2060%2018%2060%200V28%22%20fill%3D%22%23e4f1ef%22%20stroke%3D%22%231b8a9c%22%20stroke-width%3D%224%22/%3E%3Cellipse%20cx%3D%2250%22%20cy%3D%2228%22%20rx%3D%2230%22%20ry%3D%2212%22%20fill%3D%22white%22%20stroke%3D%22%231b8a9c%22%20stroke-width%3D%224%22/%3E%3Cpath%20d%3D%22M20%2050c0%2016%2060%2016%2060%200M20%2068c0%2016%2060%2016%2060%200%22%20fill%3D%22none%22%20stroke%3D%22%231b8a9c%22%20stroke-width%3D%224%22/%3E%3C/svg%3E";

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

export const GREY_LINE = '#8a919c';
export const GREY_FILL = 'rgba(138, 145, 156, 0.28)';
export const TEAL_FILL = 'rgba(27, 138, 156, 0.30)';

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
          <motion.div key="fill" exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <GlassFill />
          </motion.div>
        ) : (
          <motion.div key="wrong" exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <FourGlasses />
          </motion.div>
        )}
      </AnimatePresence>
    </WidePanel>
  );
}

/* ---------- step 1 ---------- */

const LAYER_H = 70;
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

/** a small drawing of the language model, the same 2-3-3-2 network as Lab 2's (NeuralNet.tsx), a wave of light through it */
function NeuralDrawing() {
  const cols = [
    [105, 195],
    [60, 150, 240],
    [60, 150, 240],
    [105, 195],
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
        <motion.circle key={i} cx={n.x} cy={n.y} r={10} fill="var(--teal)" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ delay: 4 + (n.x / 230) * 1.2, duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }} />
      ))}
    </svg>
  );
}

function GlassFill() {
  const clip = `polygon(0 0, 100% 0, ${100 - SLANT * 100}% 100%, ${SLANT * 100}% 100%)`;
  const outline = `M0 ${GLASS_TOP} L${GLASS_W * SLANT} ${GLASS_H} L${GLASS_W * (1 - SLANT)} ${GLASS_H} L${GLASS_W} ${GLASS_TOP}`;
  return (
    <Fill>
      <FitBox w={1400} h={GLASS_H + 24} max={1.1}>
      <div style={{ position: 'relative', width: 1400, height: GLASS_H + 24 }}>
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
                style={{ height: LAYER_H, boxSizing: 'border-box', borderTop: i === GLASS_LAYERS.length - 1 ? 'none' : '5px solid var(--panel-strong)', background: `rgba(27, 138, 156, ${i % 2 ? 0.3 : 0.16})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 25, fontWeight: 600, color: 'var(--ink)', ...(i === 0 ? { paddingBottom: 6 } : {}) }}
              >
                {name === 'Vance’s question' && <img data-portrait="vance" src={vancePortrait} alt="" width={54} height={54} style={{ borderRadius: '50%', border: '2px solid var(--teal)', objectFit: 'cover' }} />}
                {name}
              </motion.div>
            ))}
          </div>
          <svg width={GLASS_W} height={GLASS_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden="true">
            <path d={outline} fill="none" stroke="var(--ink-dim)" strokeWidth={4} strokeLinejoin="round" />
            <line x1={0} y1={GLASS_TOP} x2={GLASS_W} y2={GLASS_TOP} stroke="var(--ink-dim)" strokeWidth={2.5} strokeDasharray="9 7" />
          </svg>
        </div>
        <motion.div data-rim="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.5 }} style={{ position: 'absolute', left: GLASS_W + 24, top: GLASS_TOP - 16, fontSize: 22, fontWeight: 600, color: 'var(--ink-dim)' }}>
          full line: no more fits
        </motion.div>

        {/* the one arrow, and the model */}
        <motion.div data-arrow="sees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 0.5 }} style={{ position: 'absolute', left: 470, top: 196, width: 230, textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', lineHeight: 1.25, marginBottom: 6 }}>
            it sees this,
            <br />
            and nothing else
          </div>
          <svg width={230} height={29} viewBox="0 0 290 36" aria-hidden="true">
            <motion.path d="M4 18h278M266 4l16 14-16 14" fill="none" stroke="var(--teal)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.6, duration: 0.7, ease: EASE }} />
          </svg>
        </motion.div>
        <motion.div data-model="language-model" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 0.6 }} style={{ position: 'absolute', left: 790, top: 96, width: 260, textAlign: 'center' }}>
          <NeuralDrawing />
          <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>the language model</div>
        </motion.div>

        {/* outside the glass */}
        <div data-outside="glass" style={{ position: 'absolute', left: 1095, top: 70, width: 305 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ink-dim)', marginBottom: 16 }}>OUTSIDE THE GLASS</div>
          {OUTSIDE.map((o, i) => (
            <motion.div
              key={o}
              data-outside-item={o}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.1 + i * 0.25, duration: 0.5, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 18px', marginBottom: 16, border: `2px dashed ${GREY_LINE}`, borderRadius: 8, background: 'rgba(138, 145, 156, 0.1)', color: 'var(--ink-dim)' }}
            >
              <EyeIcon off />
              <div>
                <div style={{ fontSize: 24 }}>{o}</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>not seen</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </FitBox>

      <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginTop: 24 }}>
        {GLASS_FACTS.map((f, i) => (
          <motion.div key={f} data-fact={f} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 + i * 0.25, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 12, background: 'rgba(127, 127, 127, 0.1)', fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}>
            {i === 0 ? <LineIcon name="glass" size={40} /> : i === 1 ? <EyeIcon /> : <PourIcon />}
            {f}
          </motion.div>
        ))}
      </div>
    </Fill>
  );
}

/* ---------- step 2 ---------- */

/** each glass plays for about 2 s, one after another */
export const SLOT = 1.1;
export const START = 0.4;

export const WRONG: { word: string; text: string }[] = [
  { word: 'Volume', text: 'every tool result piles in; by turn 15 it overflows' },
  { word: 'Relevance', text: '30 search results crowd in, and Mercer’s finding spills out' },
  { word: 'Accuracy', text: 'a summary squeezes her finding to “rust on the pier”: the 25% falls out' },
  { word: 'Timing', text: 'her finding came in at turn 1; by turn 15, when Vance asks, it is gone' },
];

/** a tumbler 200 wide, rim at y=40, base at y=230; pieces are drawn inside it */
const TUMBLER = 'M22 40L44 228Q100 238 156 228L178 40';

export function MiniGlass({ word, t0, children }: { word: string; t0: number; children: (t0: number) => ReactNode }) {
  return (
    <svg data-glass={word} width={290} height={392} viewBox="0 0 200 270" style={{ overflow: 'visible', width: '100%', maxWidth: 290, height: 'auto' }} aria-hidden="true">
      {children(t0)}
      <path d={TUMBLER} fill="none" stroke={GREY_LINE} strokeWidth={3} strokeLinejoin="round" />
      <line x1={14} y1={40} x2={186} y2={40} stroke={GREY_LINE} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

export const pop = (delay: number) => ({ initial: { opacity: 0, y: -14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.35, ease: EASE } });

const VolumeGlass = (t0: number) => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.rect key={i} data-piece="turn" x={52} y={206 - i * 25} width={96} height={19} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + i * 0.08)} />
    ))}
    <motion.rect data-piece="lid" x={62} y={0} width={80} height={14} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} initial={{ opacity: 0, y: 30, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: 20 }} transition={{ delay: t0 + 0.9, duration: 0.5, ease: EASE }} style={{ transformOrigin: '100px 7px' }} />
  </>
);

/**
 * Relevance: thirty search results pour in, more than the glass holds; they heap over the rim and spill down the
 * sides, and Mercer's finding (the one teal piece) is among what spills out.
 */
const SPILL: { x: number; y: number; to: [number, number]; finding?: boolean }[] = [
  { x: 70, y: 26, to: [196, 120], finding: true },
  { x: 120, y: 24, to: [-8, 150] },
  { x: 96, y: 14, to: [204, 190] },
  { x: 140, y: 30, to: [-14, 214] },
];
const RelevanceGlass = (t0: number) => (
  <>
    {Array.from({ length: 30 }).map((_, i) => {
      const r = Math.floor(i / 5);
      const c = i % 5;
      return (
        <motion.rect
          key={i}
          data-piece="result"
          x={56 + c * 18}
          y={204 - r * 28}
          width={16}
          height={22}
          rx={2}
          fill={GREY_FILL}
          stroke={GREY_LINE}
          strokeWidth={1}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t0 + (i % 15) * 0.04 + Math.floor(i / 15) * 0.25, duration: 0.3, ease: EASE }}
        />
      );
    })}
    {/* the heap above the rim, then what spills over: Mercer's finding goes with it */}
    {SPILL.map((p, i) => (
      <motion.rect
        key={`s${i}`}
        data-piece={p.finding ? 'finding' : 'result'}
        x={p.x}
        y={p.y}
        width={p.finding ? 22 : 16}
        height={p.finding ? 18 : 14}
        rx={2}
        fill={p.finding ? TEAL_FILL : GREY_FILL}
        stroke={p.finding ? 'var(--teal)' : GREY_LINE}
        strokeWidth={p.finding ? 2.5 : 1}
        initial={{ opacity: 0, x: 0, y: -30, rotate: 0 }}
        animate={{ opacity: 1, x: [0, 0, p.to[0] - p.x], y: [0, 0, p.to[1] - p.y], rotate: [0, 0, i % 2 ? -50 : 50] }}
        transition={{ delay: t0 + 0.7 + i * 0.12, duration: 1.1, times: [0, 0.3, 1], ease: EASE }}
        style={{ transformOrigin: `${p.x + 8}px ${p.y + 7}px` }}
      />
    ))}
    <motion.text x={214} y={112} fontSize={13} fontWeight={700} fill="var(--teal)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t0 + 1.8, duration: 0.4 }}>
      her finding
    </motion.text>
  </>
);

/**
 * Accuracy: Mercer's finding goes in whole ("~25% section loss at the bearing plate edges"), then the window is
 * summarised: the card is squeezed down to "rust on the pier", and the 25% drops out of the glass, crossed out.
 */
const AccuracyGlass = (t0: number) => (
  <>
    <motion.g data-piece="finding" initial={{ opacity: 0, scaleY: 1 }} animate={{ opacity: [0, 1, 1, 0], scaleY: [1, 1, 1, 0.3] }} transition={{ delay: t0, duration: 1.6, times: [0, 0.2, 0.6, 1], ease: EASE }} style={{ transformOrigin: '100px 228px' }}>
      <rect x={42} y={120} width={116} height={100} rx={5} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
      <text x={100} y={142} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--teal)">MERCER’S FINDING</text>
      <text x={100} y={170} textAnchor="middle" fontSize={22} fontWeight={800} fill="var(--ink)">~25%</text>
      <text x={100} y={190} textAnchor="middle" fontSize={13} fill="var(--ink)">section loss at the</text>
      <text x={100} y={206} textAnchor="middle" fontSize={13} fill="var(--ink)">bearing plate edges</text>
    </motion.g>
    <motion.g data-piece="summary" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: t0 + 1.3, duration: 0.45, ease: EASE }} style={{ transformOrigin: '100px 205px' }}>
      <rect x={44} y={184} width={112} height={40} rx={4} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} />
      <text x={100} y={200} textAnchor="middle" fontSize={13} fill="var(--ink-dim)">summary:</text>
      <text x={100} y={217} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--ink)">rust on the pier</text>
    </motion.g>
    {/* the number falls out over the rim, struck through */}
    <motion.g data-piece="lost" initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 1], x: [0, 0, 92], y: [0, -40, 60] }} transition={{ delay: t0 + 1.2, duration: 1.1, times: [0, 0.35, 1], ease: EASE }}>
      <text x={78} y={168} fontSize={22} fontWeight={800} fill="var(--teal)">25%</text>
      <line x1={74} y1={161} x2={126} y2={161} stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
    </motion.g>
  </>
);

/**
 * Timing: a timeline under the glass. At turn 1 Mercer's finding is loaded; turn after turn piles in on top and
 * the oldest drops out of the bottom, so by turn 15, when Vance asks, her finding is gone: an empty dashed slot.
 */
const TimingGlass = (t0: number) => (
  <>
    <motion.g data-piece="finding" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 0, 0, 40] }} transition={{ delay: t0, duration: 1.8, times: [0, 0.15, 0.6, 1], ease: EASE }}>
      <rect x={52} y={204} width={96} height={22} rx={3} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
      <text x={100} y={220} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--teal)">her finding</text>
    </motion.g>
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.rect key={i} data-piece="turn" x={52} y={176 - i * 26} width={96} height={20} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + 0.3 + i * 0.18)} />
    ))}
    <motion.rect data-piece="gone" x={52} y={204} width={96} height={22} rx={3} fill="none" stroke="var(--teal)" strokeWidth={2} strokeDasharray="5 4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t0 + 1.9, duration: 0.4 }} />
    <motion.g data-piece="ask" {...pop(t0 + 1.4)}>
      <rect x={46} y={46} width={108} height={22} rx={11} fill="none" stroke="var(--ink-dim)" strokeWidth={1.5} />
      <text x={100} y={62} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ink)">Vance asks</text>
    </motion.g>
    {/* the timeline */}
    <g fontSize={13} fill="var(--ink-dim)">
      <line x1={30} y1={256} x2={170} y2={256} stroke={GREY_LINE} strokeWidth={2} />
      <circle cx={30} cy={256} r={5} fill="var(--teal)" />
      <circle cx={170} cy={256} r={5} fill="var(--ink-dim)" />
      <text x={30} y={276} textAnchor="middle">turn 1</text>
      <text x={170} y={276} textAnchor="middle">turn 15</text>
    </g>
  </>
);

const DRAW = [VolumeGlass, RelevanceGlass, AccuracyGlass, TimingGlass];

/** a number that ticks from `from` to `to` over `secs`, starting `delay` seconds after it appears */
function useTick(from: number, to: number, delay: number, secs: number): number {
  const [n, setN] = useState(from);
  useEffect(() => {
    const start = performance.now() + delay * 1000;
    const id = window.setInterval(() => {
      const k = Math.max(0, Math.min(1, (performance.now() - start) / (secs * 1000)));
      setN(Math.round(from + (to - from) * k));
      if (k >= 1) window.clearInterval(id);
    }, 120);
    return () => window.clearInterval(id);
  }, [from, to, delay, secs]);
  return n;
}

/** the timeline's turn counter, in the glass's own drawing space */
function TurnCounter({ t0 }: { t0: number }) {
  const n = useTick(1, 15, t0 + 1.2, 2.6);
  return (
    <text x={100} y={268} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">
      turn {n}
    </text>
  );
}

/**
 * Timing, told on one timeline (owner, 4 Nov: it was hard to explain): at turn 1 Mercer's finding is loaded; the counter runs to turn 15 while the
 * turns pile up and push it out; then Vance asks and the place where it should be is empty. Loaded once at the start, never fetched again.
 */
export const TimingStory = (t0: number) => (
  <>
    <motion.g data-piece="finding" initial={{ opacity: 0, y: -16 }} animate={{ opacity: [0, 1, 1, 0], y: [-16, 0, 0, 30] }} transition={{ delay: t0, duration: 4.4, times: [0, 0.1, 0.7, 0.92], ease: EASE }}>
      <rect x={52} y={204} width={96} height={22} rx={3} fill={TEAL_FILL} stroke="var(--teal)" strokeWidth={2} />
      <text x={100} y={220} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--teal)">her finding</text>
    </motion.g>
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.rect key={i} data-piece="turn" x={52} y={178 - i * 26} width={96} height={20} rx={3} fill={GREY_FILL} stroke={GREY_LINE} strokeWidth={1.5} {...pop(t0 + 1.2 + i * 0.5)} />
    ))}
    <motion.rect data-piece="gone" x={52} y={204} width={96} height={22} rx={3} fill="none" stroke="var(--teal)" strokeWidth={2} strokeDasharray="5 4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t0 + 4.1, duration: 0.4 }} />
    <motion.text data-piece="missing" x={100} y={221} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--teal)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: t0 + 4.3, duration: 0.4 }}>
      ?
    </motion.text>
    <motion.g data-piece="ask" {...pop(t0 + 4.9)}>
      <rect x={46} y={46} width={108} height={22} rx={11} fill="var(--panel-strong)" stroke="var(--ink-dim)" strokeWidth={1.5} />
      <text x={100} y={62} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ink)">Vance asks</text>
    </motion.g>
    <g fontSize={13} fill="var(--ink-dim)">
      <line x1={30} y1={250} x2={170} y2={250} stroke={GREY_LINE} strokeWidth={2} />
      <circle cx={30} cy={250} r={5} fill="var(--teal)" />
      <motion.circle data-piece="clock" cy={250} r={6} fill="var(--ink)" initial={{ cx: 30, opacity: 0 }} animate={{ cx: [30, 30, 170], opacity: [0, 1, 1] }} transition={{ delay: t0 + 1.2, duration: 2.6, times: [0, 0.01, 1], ease: 'linear' }} />
      <text x={30} y={268} textAnchor="middle">1</text>
      <text x={170} y={268} textAnchor="middle">15</text>
    </g>
    <TurnCounter t0={t0} />
  </>
);

/**
 * The four glasses play one after another (owner, 4 Nov: one page, the four glasses in one picture, each appearing in turn so the
 * presenter can talk to one at a time). Each glass starts at its own time; the one playing is lit, the ones before it stay as they ended,
 * the ones after it wait as empty tumblers. Timing needs the longest slot: it is a small story of its own.
 */
/** how many glasses are showing: the drawer store's step (Next adds the next glass; presentation.ts PAGE_STEPS) */
const useGlassStep = () => useDrawerStore((s) => (s.open ? s.focus : 0));

function FourGlasses() {
  const step = useGlassStep();
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, alignContent: 'center', paddingTop: 12 }}>
        {WRONG.map((w, i) => {
          const started = i <= step;
          const lit = i === step;
          return (
            <div key={w.word} data-problem={w.word} data-shown={started || undefined} data-active={lit || undefined} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '14px 8px 18px', borderRadius: 22, background: lit ? 'rgba(27,138,156,0.10)' : 'transparent', boxShadow: lit ? 'inset 0 0 0 2.5px var(--teal)' : 'none', opacity: started ? 1 : 0.35, transition: 'background 400ms, box-shadow 400ms, opacity 400ms' }}>
              <MiniGlass word={w.word} t0={0.3}>
                {started ? (i === 3 ? TimingStory : DRAW[i]) : () => null}
              </MiniGlass>
              {/* the same icon comes back when the problem is solved (Ending.tsx, 3.15b) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 33, fontWeight: 700, color: 'var(--ink)', marginTop: 14 }}>
                <LineIcon name={CURATION[i].icon} size={40} />
                {w.word}
              </div>
              <div style={{ fontSize: 23, lineHeight: 1.4, color: 'var(--ink-dim)', marginTop: 8, maxWidth: 320, opacity: started ? 1 : 0, transition: 'opacity 500ms 300ms' }}>{w.text}</div>
            </div>
          );
        })}
      </div>
      {/* the last click (owner, 10 Nov): a tease, the four problems get solved with Oracle AI Database in the lab */}
      <div style={{ flex: 'none', position: 'relative', height: 84, marginTop: 14 }}>
      <motion.div data-teaser="glass" initial={false} animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 110, paddingRight: 24, fontSize: 30, fontWeight: 700, boxShadow: '0 6px 0 rgba(15,85,98,0.35)' }}>
        <span style={{ position: 'absolute', left: 12, top: 4, width: 76, height: 76, borderRadius: '50%', background: '#fff', border: '4px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(11,14,20,0.25)' }}>
          <img data-logo="adb" src={adbLogo} alt="Oracle AI Database" style={{ width: 62, height: 62, objectFit: 'contain' }} />
        </span>
        <span>We will solve <u style={{ textDecorationThickness: 3, textUnderlineOffset: 5 }}>all four</u> with Oracle AI Database, in the lab.</span>
      </motion.div>
      <div data-legend="glass" style={{ position: 'absolute', left: 0, top: 22, display: 'flex', gap: 48, fontSize: 21, color: 'var(--ink-dim)', opacity: step >= 4 ? 0 : 1, transition: 'opacity 0.4s' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <i style={{ width: 24, height: 18, borderRadius: 3, background: GREY_FILL, border: `1.5px solid ${GREY_LINE}` }} /> grey = noise and old turns
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <i style={{ width: 24, height: 18, borderRadius: 3, background: TEAL_FILL, border: '2px solid var(--teal)' }} /> teal = what Vance needs
        </span>
      </div>
      </div>
    </Fill>
  );
}
