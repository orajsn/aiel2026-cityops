import { motion } from 'motion/react';
import { EASE } from '../WidePanel';
import { Figure } from './everyday';

/**
 * The Workflow chapter's everyday pictures (owner, 29 Oct), in the flat style of everyday.tsx: two greys, teal for
 * the thing that matters, one slow motion each. A library, a train and a taxi (who picks the next step), a rail
 * junction (every exit laid in advance), a garage work order (a fixed form) and a recipe card (a fixed order).
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const TEAL = 'var(--teal)';
const svgFill = { width: '100%', height: '100%', display: 'block' } as const;

/** RAG: a library. A tall bookshelf; the librarian takes one book off it and hands it over, once */
export function Library() {
  const shelves = [30, 82, 134];
  const widths = [14, 18, 12, 16, 20, 13, 17, 15, 12, 19];
  return (
    <svg data-art="library" viewBox="0 0 340 230" style={svgFill}>
      <ellipse cx="170" cy="222" rx="150" ry="6" fill="rgba(127,127,127,0.18)" />
      {/* the bookshelf: three shelves of books, one gap where the teal book was */}
      <rect x="120" y="14" width="206" height="196" rx="6" fill={G_LIGHT} stroke={G_DARK} strokeWidth="2.5" />
      {shelves.map((y, r) => {
        let x = 130;
        return (
          <g key={y}>
            {widths.map((w, i) => {
              const k = (i + r * 3) % widths.length;
              const bw = widths[k];
              const h = 40 + ((k * 7) % 9);
              const gap = r === 1 && i === 4;
              const el = gap ? null : <rect key={i} x={x} y={y + 48 - h} width={bw - 2} height={h} rx="2" fill={[G_MID, G_DARK, '#a3abb5'][(k + r) % 3]} />;
              x += bw;
              return x < 318 ? el : null;
            })}
            <rect x="122" y={y + 48} width="202" height="5" fill={G_DARK} />
          </g>
        );
      })}
      {/* the librarian */}
      <Figure x={66} y={40} shirt="#5d7f8c" scale={0.95} />
      {/* the one book, handed out */}
      <motion.g initial={{ x: 120, y: -40, opacity: 0 }} animate={{ x: [120, 120, 0, 0], y: [-40, -40, 0, 0], opacity: [0, 1, 1, 1] }} transition={{ delay: 0.8, duration: 2.2, times: [0, 0.2, 0.7, 1], ease: EASE }}>
        <rect x="84" y="140" width="22" height="34" rx="3" fill={TEAL} />
        <path d="M88 148h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/** workflow: a train on its rails. The track and its four stations are laid before it leaves */
export function Train() {
  const stops = [46, 124, 202, 280];
  return (
    <svg data-art="train" viewBox="0 0 340 230" style={svgFill}>
      <ellipse cx="170" cy="222" rx="150" ry="6" fill="rgba(127,127,127,0.18)" />
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x={14 + i * 14.5} y="180" width="6" height="24" rx="1" fill={G_LIGHT} />
      ))}
      <path d="M8 186H332M8 198H332" stroke={TEAL} strokeWidth="4" strokeLinecap="round" />
      {stops.map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y="60" width="4" height="58" fill={G_DARK} />
          <circle cx={x} cy="44" r="16" fill={TEAL} />
          <text x={x} y="50" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">{i + 1}</text>
        </g>
      ))}
      {/* the train rides station to station, pausing at each: an engine with a chimney and a cab, then a carriage, on wheels */}
      <motion.g initial={{ x: 0 }} animate={{ x: [0, 0, 78, 78, 156, 156, 234, 234] }} transition={{ delay: 1, duration: 7, times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}>
        {/* carriage */}
        <rect x="-38" y="134" width="50" height="34" rx="5" fill={G_MID} />
        <rect x="-32" y="140" width="14" height="12" rx="2" fill="#dfe6ea" />
        <rect x="-14" y="140" width="14" height="12" rx="2" fill="#dfe6ea" />
        <rect x="12" y="158" width="8" height="4" fill={G_DARK} />
        {/* engine */}
        <rect x="20" y="140" width="46" height="28" rx="4" fill={G_DARK} />
        <rect x="56" y="122" width="26" height="46" rx="4" fill={G_DARK} />
        <rect x="61" y="128" width="16" height="12" rx="2" fill="#dfe6ea" />
        <rect x="28" y="126" width="10" height="14" rx="2" fill={G_DARK} />
        <path d="M82 168l8 6H20" fill={G_DARK} />
        {/* wheels */}
        {[-28, -2, 30, 50, 72].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="176" r="8" fill="#2f3842" />
            <circle cx={cx} cy="176" r="3" fill="#dfe6ea" />
          </g>
        ))}
        <path d="M30 176H72" stroke="#dfe6ea" strokeWidth="2.5" />
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
