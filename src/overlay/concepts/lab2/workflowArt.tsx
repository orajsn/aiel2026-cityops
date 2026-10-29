import { motion } from 'motion/react';
import { EASE } from '../WidePanel';
import { Figure } from './everyday';

/**
 * The Workflow chapter's everyday pictures (owner, 29 Oct), in the flat style of everyday.tsx: two greys, teal for
 * the thing that matters, one slow motion each. A desk, a tram and a taxi (who picks the next step), a rail
 * junction (every exit laid in advance), a garage work order (a fixed form) and a recipe card (a fixed order).
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const TEAL = 'var(--teal)';
const svgFill = { width: '100%', height: '100%', display: 'block' } as const;

/** RAG: an information desk. One question in, the clerk looks once, one answer card out */
export function InfoDesk() {
  return (
    <svg data-art="info-desk" viewBox="0 0 340 230" style={svgFill}>
      <ellipse cx="170" cy="222" rx="150" ry="6" fill="rgba(127,127,127,0.18)" />
      {/* the shelf of folders behind: one of them is looked up */}
      <rect x="196" y="22" width="126" height="104" rx="8" fill={G_LIGHT} stroke={G_DARK} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={208 + i * 22} y="36" width="16" height="76" rx="2" fill={i === 2 ? TEAL : G_MID} />
      ))}
      <Figure x={110} y={18} shirt="#5d7f8c" />
      <rect x="40" y="150" width="200" height="14" rx="4" fill={G_MID} />
      <rect x="46" y="164" width="188" height="54" rx="3" fill={G_DARK} />
      {/* the question comes in, the answer goes out */}
      <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: [0, 1, 1, 0], x: [30, 0, 0, 0] }} transition={{ delay: 0.6, duration: 2.6, times: [0, 0.2, 0.8, 1], repeat: Infinity, repeatDelay: 2.4 }}>
        <rect x="262" y="150" width="56" height="44" rx="12" fill={G_MID} />
        <text x="290" y="182" textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff">?</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 0 }} animate={{ opacity: [0, 0, 1, 1], x: [0, 0, 70, 70] }} transition={{ delay: 0.6, duration: 2.6, times: [0, 0.55, 0.8, 1], repeat: Infinity, repeatDelay: 2.4 }}>
        <rect x="140" y="114" width="56" height="34" rx="4" fill="#fff" stroke={TEAL} strokeWidth="3" />
        <path d="M148 125h38M148 136h26" stroke={TEAL} strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/** workflow: a tram on rails. The track and its four stops are laid before it leaves */
export function Tram() {
  const stops = [46, 124, 202, 280];
  return (
    <svg data-art="tram" viewBox="0 0 340 230" style={svgFill}>
      <ellipse cx="170" cy="222" rx="150" ry="6" fill="rgba(127,127,127,0.18)" />
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x={14 + i * 14.5} y="170" width="6" height="30" rx="1" fill={G_LIGHT} />
      ))}
      <path d="M8 176H332M8 194H332" stroke={TEAL} strokeWidth="4" strokeLinecap="round" />
      {stops.map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="60" width="4" height="110" fill={G_DARK} />
          <circle cx={x} cy="52" r="16" fill={TEAL} />
          <text x={x} y="58" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">{i + 1}</text>
        </g>
      ))}
      {/* the tram rides stop to stop, pausing at each */}
      <motion.g initial={{ x: 0 }} animate={{ x: [0, 0, 78, 78, 156, 156, 234, 234] }} transition={{ delay: 1, duration: 7, times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}>
        <rect x="10" y="118" width="72" height="50" rx="10" fill={G_DARK} />
        <rect x="18" y="127" width="16" height="17" rx="3" fill="#dfe6ea" />
        <rect x="38" y="127" width="16" height="17" rx="3" fill="#dfe6ea" />
        <rect x="58" y="127" width="16" height="17" rx="3" fill="#dfe6ea" />
        <path d="M46 118V104M36 104h20" stroke={G_DARK} strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/** agent: a taxi in a street grid. The driver picks each turn as it goes */
export function Taxi() {
  const route = 'M30 196 H112 V118 H192 V40 H306';
  return (
    <svg data-art="taxi" viewBox="0 0 340 230" style={svgFill}>
      {[0, 1, 2, 3].flatMap((c) => [0, 1, 2].map((r) => <rect key={`${c}${r}`} x={14 + c * 80} y={10 + r * 78} width="62" height="58" rx="6" fill={G_LIGHT} />))}
      <motion.path d={route} stroke={G_DARK} strokeWidth="4" strokeDasharray="8 8" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1] }} transition={{ delay: 1, duration: 4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }} />
      {[
        [112, 196, 1.9],
        [192, 118, 3.1],
      ].map(([x, y, d]) => (
        <motion.g key={x} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: d, duration: 1.6, repeat: Infinity, repeatDelay: 4.4 }}>
          <circle cx={x} cy={y} r="14" fill="#fff" stroke={G_DARK} strokeWidth="2.5" />
          <text x={x} y={y + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={G_DARK}>?</text>
        </motion.g>
      ))}
      <rect x="296" y="28" width="34" height="24" rx="5" fill={G_MID} />
      <rect x="306" y="22" width="14" height="8" rx="2" fill={G_DARK} />
    </svg>
  );
}

/** a rail junction: every track out of the station is laid before the first train runs */
export function Junction() {
  return (
    <svg data-art="junction" viewBox="0 0 240 130" style={svgFill}>
      <path d="M10 30H226" stroke={TEAL} strokeWidth="5" strokeLinecap="round" />
      <path d="M80 30C120 30 120 66 160 66H226M80 30C120 30 120 104 160 104H226" stroke={G_MID} strokeWidth="4" strokeDasharray="7 6" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="30" r="10" fill={TEAL} />
      {[30, 66, 104].map((y, i) => (
        <circle key={y} cx="226" cy={y} r="7" fill={i === 0 ? TEAL : G_MID} />
      ))}
      <motion.circle r="7" fill={TEAL} initial={{ cx: 12, cy: 30, opacity: 0 }} animate={{ cx: [12, 220], opacity: [0, 1, 1, 0] }} transition={{ delay: 4.2, duration: 2.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }} />
    </svg>
  );
}

/** a garage work order: three boxes, the pen writes in them one after another */
export function WorkOrder() {
  return (
    <svg data-art="work-order" viewBox="0 0 220 200" style={svgFill}>
      <ellipse cx="110" cy="194" rx="96" ry="5" fill="rgba(127,127,127,0.18)" />
      <rect x="34" y="14" width="152" height="176" rx="10" fill={G_LIGHT} stroke={G_DARK} strokeWidth="2.5" />
      <rect x="78" y="6" width="64" height="18" rx="5" fill={G_DARK} />
      <path d="M50 52l14-14M46 36a7 7 0 0 0 10 8M60 34a7 7 0 0 1 8 10" stroke={G_DARK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M80 44h86" stroke={G_MID} strokeWidth="4" strokeLinecap="round" />
      {[72, 112, 152].map((y, i) => (
        <g key={y}>
          <rect x="48" y={y - 4} width="124" height="30" rx="4" fill="#fff" stroke={TEAL} strokeWidth="2.5" strokeDasharray="5 4" />
          <motion.path d={`M58 ${y + 11}h${[96, 80, 64][i]}`} stroke={TEAL} strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.9, duration: 0.8, ease: EASE }} />
        </g>
      ))}
    </svg>
  );
}

/** a recipe card: four steps in a fixed order, and three cakes that each came out a little different */
export function Recipe() {
  return (
    <svg data-art="recipe" viewBox="0 0 240 300" style={svgFill}>
      <rect x="30" y="8" width="180" height="170" rx="10" fill={G_LIGHT} stroke={G_DARK} strokeWidth="2.5" />
      <path d="M52 32h96" stroke={G_DARK} strokeWidth="5" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <motion.g key={i} initial={{ opacity: 0.25 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.5, duration: 0.4 }}>
          <circle cx="60" cy={64 + i * 30} r="11" fill={TEAL} />
          <text x="60" y={69 + i * 30} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">{i + 1}</text>
          <path d={`M80 ${64 + i * 30}h${[100, 80, 110, 70][i]}`} stroke={G_MID} strokeWidth="5" strokeLinecap="round" />
        </motion.g>
      ))}
      {[0, 1, 2].map((i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 + i * 0.3, duration: 0.5 }}>
          <ellipse cx={50 + i * 70} cy="286" rx="30" ry="5" fill="rgba(127,127,127,0.25)" />
          <rect x={26 + i * 70} y="236" width="48" height="48" rx="5" fill={G_MID} />
          <path d={[`M26 246q12 10 24 0t24 0V236H26z`, `M96 246q8 6 16 0t16 0t16 0V236H96z`, `M166 248q16 8 24 -2t24 2V236H166z`][i]} fill="#fff" />
          <rect x={46 + i * 70} y="222" width="8" height="14" rx="2" fill={TEAL} />
        </motion.g>
      ))}
    </svg>
  );
}
