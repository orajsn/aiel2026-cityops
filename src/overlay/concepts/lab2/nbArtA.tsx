import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Figure, Triage } from './everyday';
import { Recipe, WorkOrder } from './workflowArt';

/**
 * Notebook pages (group A): the "in everyday life" picture and its one-sentence caption. Flat, two greys, teal for
 * the thing that matters, one slow motion at most. Each drawing fills its box (viewBox + 100% x 100%).
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const TEAL = 'var(--teal)';
const MONO = 'JetBrains Mono, monospace';
const fill = { width: '100%', height: '100%', display: 'block' } as const;

/** wraps a drawing that has a fixed size so it fills the box */
function Fit({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
      <style>{'[data-nbfit] > svg { width: 100%; height: auto; display: block; }'}</style>
      <div data-nbfit style={{ width: '100%' }}>{children}</div>
    </div>
  );
}

/** 0.6 · switching a radio on: the light comes on and it says READY */
function RadioCheck() {
  return (
    <svg data-art="radio-check" viewBox="0 0 420 480" style={fill}>
      <ellipse cx="210" cy="448" rx="180" ry="9" fill="rgba(127,127,127,0.18)" />
      <path d="M300 160L360 60" stroke={G_DARK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="360" cy="60" r="8" fill={G_DARK} />
      <rect x="40" y="160" width="340" height="280" rx="28" fill={G_MID} stroke={G_DARK} strokeWidth="4" />
      <rect x="64" y="186" width="190" height="200" rx="14" fill={G_LIGHT} stroke={G_DARK} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M84 ${208 + i * 22}h150`} stroke={G_DARK} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      ))}
      <rect x="284" y="196" width="70" height="44" rx="22" fill={G_DARK} />
      <motion.circle cy="218" r="17" fill="#fff" initial={{ cx: 306 }} animate={{ cx: 332 }} transition={{ delay: 0.5, duration: 0.6, ease: EASE }} />
      <motion.circle cx="319" cy="288" r="20" fill={TEAL} initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 1, 0.7, 1] }} transition={{ delay: 0.9, duration: 2.4, repeat: Infinity, repeatType: 'reverse' }} />
      <circle cx="319" cy="288" r="26" fill="none" stroke={G_DARK} strokeWidth="3" />
      <circle cx="319" cy="358" r="26" fill={G_LIGHT} stroke={G_DARK} strokeWidth="3" />
      <path d="M319 358l12-14" stroke={G_DARK} strokeWidth="4" strokeLinecap="round" />
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6, ease: EASE }}>
        <path d="M110 112l-14 40 48-40z" fill="#fff" stroke={TEAL} strokeWidth="4" strokeLinejoin="round" />
        <rect x="40" y="26" width="220" height="88" rx="20" fill="#fff" stroke={TEAL} strokeWidth="4" />
        <path d="M112 113h30" stroke="#fff" strokeWidth="5" />
        <text x="150" y="82" textAnchor="middle" fontSize="40" fontWeight="700" fill={TEAL} fontFamily={MONO}>READY</text>
      </motion.g>
    </svg>
  );
}

/** 2.2c · a librarian stamps a numeric label on a question card */
function StampLabel() {
  return (
    <svg data-art="stamp-label" viewBox="0 0 420 480" style={fill}>
      <ellipse cx="210" cy="466" rx="190" ry="8" fill="rgba(127,127,127,0.18)" />
      <Figure x={100} y={70} scale={1.55} shirt="#5d7f8c" />
      <rect x="20" y="290" width="380" height="26" rx="8" fill={G_MID} />
      <rect x="34" y="316" width="352" height="140" rx="6" fill={G_DARK} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={52 + i * 114} y="332" width="100" height="56" rx="5" fill={G_MID} />
          <rect x={86 + i * 114} y="354" width="32" height="8" rx="4" fill={G_LIGHT} />
        </g>
      ))}
      <g transform="rotate(-3 285 240)">
        <rect x="180" y="180" width="210" height="112" rx="8" fill="#fff" stroke={G_DARK} strokeWidth="3" />
        <text x="198" y="222" fontSize="40" fontWeight="700" fill={G_DARK}>?</text>
        <path d="M242 204h120M242 220h90" stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.5 }}>
          <rect x="194" y="240" width="184" height="38" rx="5" fill="rgba(27,138,156,0.14)" stroke={TEAL} strokeWidth="2.5" />
          <text x="286" y="266" textAnchor="middle" fontSize="16" fontWeight="700" fill={TEAL} fontFamily={MONO}>0.12 -0.80 0.33 …</text>
        </motion.g>
      </g>
      <motion.g initial={{ y: -40 }} animate={{ y: [-40, -40, 95, -40] }} transition={{ duration: 2.6, times: [0, 0.2, 0.45, 1], ease: EASE }}>
        <rect x="262" y="40" width="48" height="18" rx="9" fill={G_DARK} />
        <rect x="278" y="56" width="16" height="66" fill={G_MID} />
        <rect x="248" y="120" width="76" height="30" rx="6" fill={TEAL} />
      </motion.g>
    </svg>
  );
}

/** 2.2d · a map: the question is the pin, folders sit at different distances, the nearest five are circled */
function NearMap() {
  const pin = { x: 210, y: 270 };
  // x, y, circled, from another bridge
  const folders: [number, number, boolean, boolean][] = [
    [128, 190, true, false],
    [292, 200, true, false],
    [272, 345, true, false],
    [120, 335, true, true],
    [210, 120, true, true],
    [65, 100, false, false],
    [350, 110, false, false],
    [355, 410, false, false],
    [65, 420, false, false],
  ];
  return (
    <svg data-art="near-map" viewBox="0 0 420 480" style={fill}>
      <rect x="6" y="40" width="408" height="430" rx="20" fill={G_LIGHT} opacity="0.5" />
      {[190, 130, 70].map((r) => (
        <circle key={r} cx={pin.x} cy={pin.y} r={r} fill="none" stroke={G_MID} strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
      ))}
      {folders.map(([x, y, near, other], i) => (
        <g key={i} transform={`translate(${x - 24} ${y - 18})`}>
          <path d="M0 6q0-6 6-6h14l6 6h16q6 0 6 6v26q0 6-6 6H6q-6 0-6-6z" fill={other ? G_DARK : G_MID} opacity={near ? 1 : 0.55} />
          <path d="M8 24h32M8 32h20" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          {near && <rect x="-8" y="-8" width="64" height="58" rx="14" fill="none" stroke={TEAL} strokeWidth="3.5" />}
        </g>
      ))}
      <ellipse cx={pin.x} cy={pin.y + 8} rx="14" ry="4" fill="rgba(0,0,0,0.2)" />
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <path d={`M${pin.x} ${pin.y + 6}c-22-26-30-38-30-52a30 30 0 1 1 60 0c0 14-8 26-30 52z`} fill={TEAL} />
        <circle cx={pin.x} cy={pin.y - 46} r="11" fill="#fff" />
      </motion.g>
    </svg>
  );
}

/** 2.3 · an open-book exam: the answer comes from the book on the desk; the book's words are material, not orders */
function OpenBook() {
  return (
    <svg data-art="open-book" viewBox="0 0 420 480" style={fill}>
      <ellipse cx="210" cy="468" rx="190" ry="8" fill="rgba(127,127,127,0.18)" />
      <Figure x={150} y={30} scale={1.6} shirt="#5d7f8c" />
      <rect x="10" y="250" width="400" height="24" rx="8" fill={G_MID} />
      <rect x="30" y="274" width="360" height="184" rx="6" fill={G_DARK} />
      <g transform="rotate(4 314 250)">
        <rect x="244" y="190" width="140" height="100" rx="5" fill="#fff" stroke={G_DARK} strokeWidth="3" />
        <path d="M260 214h88M260 232h60" stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
        <motion.path d="M260 262h96" stroke={TEAL} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1.6, ease: EASE }} />
      </g>
      <path d="M40 336q85-30 170 0v110q-85-30-170 0z" fill="#fff" stroke={G_DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M210 336q85-30 170 0v110q-85-30-170 0z" fill="#fff" stroke={G_DARK} strokeWidth="3" strokeLinejoin="round" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M62 ${358 + i * 18}h120M238 ${358 + i * 18}h${[120, 100, 120, 70][i]}`} stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
      ))}
      <motion.rect x="236" y="391" width="124" height="14" rx="4" fill="rgba(27,138,156,0.35)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
      <path d="M188 330v64l8-8 8 8v-64z" fill={TEAL} />
    </svg>
  );
}

/** 2.3a · plumbing: three joints fitted by hand, against one pipe */
function Pipes() {
  return (
    <svg data-art="pipes" viewBox="0 0 420 480" style={fill}>
      <text x="20" y="48" fontSize="20" fontWeight="700" fill={G_DARK} fontFamily={MONO}>by hand</text>
      <rect x="20" y="80" width="96" height="46" rx="6" fill={G_MID} />
      <rect x="148" y="80" width="96" height="46" rx="6" fill={G_MID} />
      <rect x="276" y="80" width="124" height="46" rx="6" fill={G_MID} />
      {[110, 238].map((x) => (
        <g key={x}>
          <rect x={x} y="68" width="44" height="70" rx="8" fill={G_DARK} />
          <circle cx={x + 22} cy="82" r="4" fill="#fff" />
          <circle cx={x + 22} cy="124" r="4" fill="#fff" />
        </g>
      ))}
      {['fetch', 'brief', 'ask'].map((t, i) => (
        <text key={t} x={[68, 196, 338][i]} y="170" textAnchor="middle" fontSize="20" fontWeight="700" fill={G_DARK} fontFamily={MONO}>{t}</text>
      ))}
      {[132, 260].map((x, i) => (
        <motion.ellipse key={x} cx={x} cy="150" rx="5" ry="8" fill={G_MID} animate={{ cy: [144, 210], opacity: [1, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 1.1, ease: 'easeIn' }} />
      ))}
      <path d="M20 250h380" stroke={G_MID} strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      <text x="20" y="306" fontSize="20" fontWeight="700" fill={TEAL} fontFamily={MONO}>one pipe</text>
      <rect x="20" y="334" width="380" height="64" rx="32" fill={TEAL} stroke={G_DARK} strokeWidth="3" />
      <motion.rect y="356" width="60" height="20" rx="10" fill="#fff" opacity="0.8" initial={{ x: 40 }} animate={{ x: [40, 310] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      {['fetch', 'brief', 'ask'].map((t, i) => (
        <text key={t} x={[75, 210, 345][i]} y="436" textAnchor="middle" fontSize="20" fontWeight="700" fill={G_DARK} fontFamily={MONO}>{t}</text>
      ))}
    </svg>
  );
}

/** 2.5c · a tool in its labelled case: the label tells when to reach for it */
function ToolCase() {
  return (
    <svg data-art="tool-case" viewBox="0 0 420 480" style={fill}>
      <ellipse cx="210" cy="458" rx="190" ry="9" fill="rgba(127,127,127,0.18)" />
      <path d="M150 130v-36q0-24 24-24h72q24 0 24 24v36" fill="none" stroke={G_DARK} strokeWidth="14" strokeLinecap="round" />
      <rect x="30" y="120" width="360" height="330" rx="24" fill={G_MID} stroke={G_DARK} strokeWidth="4" />
      <rect x="54" y="146" width="312" height="282" rx="14" fill={G_LIGHT} stroke={G_DARK} strokeWidth="3" />
      <rect x="196" y="110" width="28" height="34" rx="6" fill={G_DARK} />
      <rect x="86" y="180" width="26" height="190" rx="10" fill="rgba(0,0,0,0.12)" />
      <rect x="91" y="262" width="16" height="104" rx="6" fill={G_MID} />
      <rect x="93" y="190" width="12" height="76" rx="3" fill={G_DARK} />
      <g transform="rotate(-30 190 300)">
        <rect x="156" y="190" width="68" height="190" rx="16" fill="rgba(0,0,0,0.12)" />
        <rect x="177" y="240" width="26" height="130" rx="9" fill={TEAL} />
        <path d="M162 250v-52a30 30 0 0 1 16-22v34h24v-34a30 30 0 0 1 16 22v52a30 30 0 0 1-56 0z" fill={TEAL} transform="translate(0 4)" />
      </g>
      <motion.g style={{ originX: '318px', originY: '160px' }} animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M318 160v26" stroke={G_DARK} strokeWidth="3" fill="none" />
        <rect x="260" y="186" width="120" height="150" rx="8" fill="#fff" stroke={TEAL} strokeWidth="4" />
        <circle cx="320" cy="202" r="5" fill={TEAL} />
        <path d="M278 234h84M278 254h70M278 274h84" stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
        <rect x="276" y="294" width="88" height="26" rx="6" fill="rgba(27,138,156,0.18)" />
        <text x="320" y="312" textAnchor="middle" fontSize="14" fontWeight="700" fill={TEAL} fontFamily={MONO}>use when</text>
      </motion.g>
    </svg>
  );
}

export const NB_ART_A: Record<string, { art: ReactNode; caption: ReactNode }> = {
  '0.6': {
    art: <RadioCheck />,
    caption: <>Like switching on a radio and saying “radio check”: before we rely on the language model, we ask it to say <b>READY</b>.</>,
  },
  '2.2c': {
    art: <StampLabel />,
    caption: <>Like a librarian stamping a <b>numeric label</b> on your question card, the database turns the question into <b>384 numbers</b>.</>,
  },
  '2.2d': {
    art: <NearMap />,
    caption: <>Like pins on a map, the five folders <b>closest in meaning</b> to the question come back, even two from other bridges.</>,
  },
  '2.3': {
    art: <OpenBook />,
    caption: <>Like an open-book exam, the AI agent answers <b>only from the folder</b>, and the text inside it is material, not orders.</>,
  },
  '2.3a': {
    art: <Pipes />,
    caption: <>Fetch, brief and ask can be <b>fitted by hand</b>, joint by joint, or run as <b>one LangChain pipe</b>.</>,
  },
  '2.4f': {
    art: <Fit><Triage /></Fit>,
    caption: <>Like triage tags, the AI agent may give <b>only three ratings</b>, plus one reason.</>,
  },
  '2.4g': {
    art: <WorkOrder />,
    caption: <>Like a garage work order, the plan is a <b>fixed form</b> with exactly three boxes to fill in.</>,
  },
  '2.4h': {
    art: <Recipe />,
    caption: <>Like a recipe card, the four calls run in a <b>fixed order</b>, and we time each one.</>,
  },
  '2.5c': {
    art: <ToolCase />,
    caption: <>Like a tool in a labelled case, a function becomes a tool, and <b>the label says when to use it</b>.</>,
  },
};
