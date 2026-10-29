import { motion } from 'motion/react';
import { EASE } from '../WidePanel';

/**
 * Lab 2's everyday pictures (owner, 29 Oct: drawn for this show, in the flat style of Lab 3's clerk and librarian):
 * one small scene per idea, two greys, teal for the thing that matters, a single slow motion.
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const SKIN = '#c98e6a';
const SHIRT = '#6f6a8f';
const TEAL = 'var(--teal)';

/** a person, standing: head, hair, body; `x` is the centre line, `y` the top of the head */
export function Figure({ x, y, shirt = SHIRT, scale = 1 }: { x: number; y: number; shirt?: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-30 150c0-44 8-74 30-74s30 30 30 74z" fill={shirt} />
      <path d="M-10 78l10 14 10-14z" fill="rgba(255,255,255,0.75)" />
      <rect x="-6" y="62" width="12" height="16" rx="5" fill={SKIN} />
      <circle cx="0" cy="40" r="22" fill={SKIN} />
      <path d="M-23 38c0-18 10-27 23-27s23 9 23 27c-6-8-14-11-23-11s-17 3-23 11z" fill="#2f3842" />
      <circle cx="-8" cy="42" r="2.4" fill="#2f3842" />
      <circle cx="8" cy="42" r="2.4" fill="#2f3842" />
      <path d="M-6 52q6 5 12 0" stroke="#2f3842" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** 2.4f · triage: three tags on the wall, the nurse ties exactly one (teal) to the patient's card */
export function Triage() {
  return (
    <svg data-art="triage" width="340" height="260" viewBox="0 0 340 260">
      <ellipse cx="170" cy="252" rx="160" ry="6" fill="rgba(127,127,127,0.18)" />
      {/* the board with three tags */}
      <rect x="196" y="20" width="128" height="150" rx="10" fill={G_LIGHT} stroke={G_DARK} strokeWidth="2" />
      {[
        { y: 40, fill: G_MID, t: 'routine' },
        { y: 82, fill: TEAL, t: 'warning' },
        { y: 124, fill: G_DARK, t: 'critical' },
      ].map((g) => (
        <g key={g.t}>
          <path d={`M212 ${g.y + 14}l14-14h82v28h-82z`} fill={g.fill} />
          <circle cx="226" cy={g.y + 14} r="4" fill="#fff" />
          <text x="270" y={g.y + 19} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="JetBrains Mono, monospace">
            {g.t}
          </text>
        </g>
      ))}
      {/* the counter */}
      <rect x="20" y="170" width="190" height="14" rx="4" fill={G_MID} />
      <rect x="26" y="184" width="178" height="62" rx="3" fill={G_DARK} />
      {/* the nurse */}
      <Figure x={100} y={30} shirt="#5d7f8c" />
      {/* the card on the counter, and the one teal tag landing on it */}
      <rect x="120" y="140" width="72" height="30" rx="4" fill="#fff" stroke={G_DARK} strokeWidth="2" />
      <path d="M128 150h40M128 160h28" stroke={G_MID} strokeWidth="3" strokeLinecap="round" />
      <motion.g initial={{ x: 96, y: -76, opacity: 0 }} animate={{ x: [96, 96, 0], y: [-76, -76, 0], opacity: [0, 1, 1] }} transition={{ delay: 0.6, duration: 1.5, ease: EASE }}>
        <path d="M176 136l8-8h26v16h-26z" fill={TEAL} />
        <circle cx="184" cy="136" r="2.6" fill="#fff" />
      </motion.g>
    </svg>
  );
}
