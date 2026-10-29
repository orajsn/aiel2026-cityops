import { motion } from 'motion/react';
import { EASE } from '../WidePanel';

/**
 * Lab 2 · RAG's own drawings (owner, 29 Oct: our own flat pictures, in the greys of Lab 3's filing cabinet, teal for
 * the thing that matters): the filing cabinet, a folder, the engineer's desk, a pile of every file.
 */

export const CAB_GREY = '#8a919c';
export const CAB_DARK = '#5c6b78';
export const CAB_LIGHT = '#aab1ba';
const TEAL = '#1b8a9c';
const SKIN = '#c98e6a';

/**
 * The filing cabinet, front on with its top and right side showing. `open` is the drawer (0 top) that slides out
 * towards us after `openAt` seconds, its teal folders showing; `lit` drawers glow teal.
 */
export function Cabinet({ w = 260, open, openAt = 1, lit = [] }: { w?: number; open?: number; openAt?: number; lit?: number[] }) {
  const W = 220;
  const H = 300;
  const D = 34;
  const dh = 84;
  const dy = (i: number) => 44 + i * 94;
  return (
    <svg data-cabinet width={w} height={(w * (H + 80)) / (W + D + 20)} viewBox={`0 0 ${W + D + 20} ${H + 80}`} style={{ overflow: 'visible', display: 'block', flex: 'none' }} aria-hidden>
      <ellipse cx={W / 2 + 14} cy={H + 34} rx={W / 2 + 26} ry={8} fill="rgba(127,127,127,0.22)" />
      <path d={`M4 30 L${4 + D} 6 L${4 + W + D} 6 L${4 + W} 30 Z`} fill={CAB_LIGHT} />
      <path d={`M${4 + W} 30 L${4 + W + D} 6 L${4 + W + D} ${H + 6} L${4 + W} ${H + 30} Z`} fill={CAB_DARK} />
      <rect x={4} y={30} width={W} height={H} rx={6} fill={CAB_GREY} />
      {[0, 1, 2].map((i) => {
        const isOpen = open === i;
        const on = lit.includes(i);
        const face = (
          <g>
            <rect x={16} y={dy(i)} width={W - 24} height={dh} rx={5} fill={on || isOpen ? 'rgb(104, 166, 178)' : 'rgb(150, 157, 167)'} stroke={CAB_DARK} strokeWidth={2.5} />
            <rect x={4 + W / 2 - 44} y={dy(i) + 12} width={88} height={20} rx={4} fill="rgba(255,255,255,0.82)" />
            <path d={`M${4 + W / 2 - 34} ${dy(i) + 22}h68`} stroke={CAB_DARK} strokeWidth={3} strokeLinecap="round" />
            <rect x={4 + W / 2 - 30} y={dy(i) + 52} width={60} height={13} rx={6.5} fill={CAB_DARK} />
          </g>
        );
        if (!isOpen) return <g key={i}>{face}</g>;
        return (
          <g key={i} data-drawer-open>
            <rect x={16} y={dy(i)} width={W - 24} height={dh} rx={5} fill="rgba(20,26,34,0.55)" />
            <motion.g initial={{ y: 0, x: 0 }} animate={{ y: 40, x: -26 }} transition={{ delay: openAt, duration: 0.9, ease: EASE }}>
              {/* the open top of the drawer, its folders standing up in it */}
              <path d={`M16 ${dy(i)} L${16 + 26} ${dy(i) - 40} L${W - 8 + 26} ${dy(i) - 40} L${W - 8} ${dy(i)} Z`} fill="rgba(20,26,34,0.75)" />
              {[0, 1, 2, 3, 4].map((f) => (
                <rect key={f} x={34 + f * 34} y={dy(i) - 30 + (f % 2) * 3} width={26} height={24} rx={3} fill={TEAL} opacity={0.6 + (f % 3) * 0.13} />
              ))}
              {face}
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

/** a manila-style folder, drawn large; `tab` writes nothing (text lives in HTML), teal when `on` */
export function BigFolder({ w = 120, on = true }: { w?: number; on?: boolean }) {
  return (
    <svg data-bigfolder width={w} height={w * 0.78} viewBox="0 0 100 78" aria-hidden style={{ flex: 'none', display: 'block' }}>
      <path d="M4 10a4 4 0 0 1 4-4h26l8 8h50a4 4 0 0 1 4 4v52a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill={on ? TEAL : CAB_GREY} />
      <rect x="12" y="20" width="76" height="40" rx="2" fill="#fff" opacity="0.92" />
      <path d="M20 30h50M20 39h40M20 48h46" stroke={on ? TEAL : CAB_GREY} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M4 26a4 4 0 0 1 4-4h84a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill={on ? 'rgba(27,138,156,0.82)' : 'rgba(138,145,156,0.85)'} />
    </svg>
  );
}

/** the engineer at the desk (the language model in the analogy): a person behind a plain grey desk */
export function DeskPerson({ w = 300, hat = false }: { w?: number; hat?: boolean }) {
  return (
    <svg data-desk-person width={w} height={w * 0.8} viewBox="0 0 300 240" aria-hidden style={{ flex: 'none', display: 'block', overflow: 'visible' }}>
      <ellipse cx="150" cy="234" rx="140" ry="6" fill="rgba(127,127,127,0.2)" />
      {/* the person, behind the desk */}
      <g transform="translate(150 16)">
        <path d="M-44 170c0-62 12-100 44-100s44 38 44 100z" fill="#6f7f8c" />
        <path d="M-12 74l12 16 12-16z" fill="rgba(255,255,255,0.8)" />
        <rect x="-8" y="56" width="16" height="18" rx="6" fill={SKIN} />
        <circle cx="0" cy="32" r="28" fill={SKIN} />
        {hat ? (
          <>
            <path d="M-28 26c0-22 12-34 28-34s28 12 28 34z" fill={TEAL} />
            <rect x="-34" y="22" width="68" height="7" rx="3" fill="#146f7f" />
          </>
        ) : (
          <path d="M-29 30c0-22 13-34 29-34s29 12 29 34c-8-10-18-14-29-14s-21 4-29 14z" fill="#2f3842" />
        )}
        <circle cx="-10" cy="36" r="3" fill="#2f3842" />
        <circle cx="10" cy="36" r="3" fill="#2f3842" />
        <path d="M-8 48q8 6 16 0" stroke="#2f3842" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
      {/* the desk */}
      <rect x="10" y="150" width="280" height="16" rx="4" fill={CAB_LIGHT} />
      <rect x="22" y="166" width="256" height="66" rx="3" fill={CAB_DARK} />
      <rect x="30" y="176" width="70" height="8" rx="4" fill={CAB_GREY} />
    </svg>
  );
}

/** every file at once: a tall, untidy pile of grey sheets, dropping in one after another */
export function Pile({ n = 16, at = 0.4, w = 220 }: { n?: number; at?: number; w?: number }) {
  return (
    <svg data-pile width={w} height={w * 0.95} viewBox="0 0 220 210" aria-hidden style={{ flex: 'none', display: 'block', overflow: 'visible' }}>
      {Array.from({ length: n }, (_, i) => {
        const tilt = ((i * 37) % 9) - 4;
        const dx = ((i * 53) % 21) - 10;
        return (
          <motion.rect
            key={i}
            x={30 + dx}
            y={196 - (i + 1) * 12}
            width={160}
            height={11}
            rx={2}
            fill={i % 3 === 0 ? CAB_DARK : i % 3 === 1 ? CAB_GREY : CAB_LIGHT}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, y: -60, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: tilt }}
            transition={{ delay: at + i * 0.08, duration: 0.45, ease: EASE }}
          />
        );
      })}
    </svg>
  );
}
