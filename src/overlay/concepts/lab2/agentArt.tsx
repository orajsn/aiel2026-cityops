import { motion } from 'motion/react';
import { EASE } from '../WidePanel';

/**
 * Lab 2's agent-chapter drawings (owner, 29 Oct: our own flat drawings, as Lab 3's desk, cabinet and glass; not
 * icons pasted in boxes). Two greys, teal for the thing that matters, one slow motion each.
 */

export const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
export const G_MID = '#8a919c';
export const G_DARK = '#5c6b78';
export const T_SOFT = 'rgba(27, 138, 156, 0.28)';
export const T_MID = 'rgba(27, 138, 156, 0.6)';
const TEAL = 'var(--teal)';

/** the inspector's three kinds of kit, small: a wrench (tools), a manual (skills), a plug (MCP) */
export function KitGlyph({ kind, size = 64, on = true }: { kind: 'tools' | 'skills' | 'mcp'; size?: number; on?: boolean }) {
  const c = on ? TEAL : G_MID;
  const f = on ? T_SOFT : G_LIGHT;
  return (
    <svg data-kit={kind} width={size} height={size} viewBox="0 0 64 64" aria-hidden style={{ flex: 'none' }}>
      {kind === 'tools' && (
        <g>
          <path d="M14 50l22-22" stroke={c} strokeWidth="7" strokeLinecap="round" />
          <path d="M34 18a11 11 0 0 1 14-6l-7 7 2 6 6 2 7-7a11 11 0 0 1-14 14z" fill={c} />
          <rect x="8" y="46" width="12" height="10" rx="3" transform="rotate(-45 14 51)" fill={f} stroke={c} strokeWidth="2" />
        </g>
      )}
      {kind === 'skills' && (
        <g>
          <rect x="12" y="8" width="40" height="50" rx="4" fill={f} stroke={c} strokeWidth="2.5" />
          <rect x="12" y="8" width="9" height="50" rx="3" fill={c} />
          <path d="M27 20h18M27 28h18M27 36h12" stroke={c} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {kind === 'mcp' && (
        <g>
          <rect x="16" y="22" width="32" height="26" rx="6" fill={c} />
          <path d="M25 22V8M39 22V8" stroke={c} strokeWidth="5" strokeLinecap="round" />
          <path d="M32 48v10" stroke={c} strokeWidth="5" strokeLinecap="round" />
          <circle cx="32" cy="35" r="4" fill="#fff" opacity="0.8" />
        </g>
      )}
    </svg>
  );
}

/** a cog: the framework that does the work; it turns once when the call reaches it */
export function Cog({ size = 120, delay = 0 }: { size?: number; delay?: number }) {
  const teeth = Array.from({ length: 8 }).map((_, i) => <rect key={i} x="54" y="6" width="12" height="20" rx="3" transform={`rotate(${i * 45} 60 60)`} />);
  return (
    <svg data-cog width={size} height={size} viewBox="0 0 120 120" aria-hidden style={{ flex: 'none' }}>
      <motion.g initial={{ rotate: 0 }} animate={{ rotate: 90 }} transition={{ delay, duration: 1.4, ease: EASE }} style={{ transformOrigin: '60px 60px' }} fill={G_DARK}>
        {teeth}
        <circle cx="60" cy="60" r="38" />
        <circle cx="60" cy="60" r="16" fill={TEAL} />
      </motion.g>
    </svg>
  );
}

/** the plug every source and every agent shares: a body, two prongs, a cable going `dir` */
export function PlugHead({ x, y, dir = 1, on = true }: { x: number; y: number; dir?: 1 | -1; on?: boolean }) {
  const c = on ? TEAL : G_MID;
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <rect x="-26" y="-18" width="26" height="36" rx="6" fill={c} />
      <rect x="0" y="-11" width="14" height="6" rx="2" fill={G_DARK} />
      <rect x="0" y="5" width="14" height="6" rx="2" fill={G_DARK} />
    </g>
  );
}
