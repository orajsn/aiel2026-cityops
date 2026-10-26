import type { ReactNode } from 'react';

/**
 * The line icons the panels share (owner, 26 Oct: more icons, in the "Like a person" style): 48-unit stroke
 * drawings in one colour, no fills, so they sit in teal or grey cards alike. Each one carries its name in
 * data-icon so tests can find it.
 */
const PATHS = {
  // the three kinds of memory, and their person, agent and bridge examples (3.2p)
  gear: <><circle cx="24" cy="24" r="7" /><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2" /></>,
  book: <><path d="M24 12c-5-4-12-4-18-3v29c6-1 13-1 18 3 5-4 12-4 18-3V9c-6-1-13-1-18 3z" /><path d="M24 12v29" /></>,
  nodes: <><circle cx="24" cy="24" r="5" /><circle cx="9" cy="10" r="4" /><circle cx="40" cy="12" r="4" /><circle cx="12" cy="39" r="4" /><circle cx="38" cy="38" r="4" /><path d="M12 13l8 7M37 15l-9 6M15 36l6-8M35 35l-7-7" /></>,
  bike: <><circle cx="11" cy="32" r="8" /><circle cx="37" cy="32" r="8" /><path d="M11 32l8-14h12l6 14M19 18l5 14h7M17 14h6" /></>,
  photo: <><rect x="5" y="9" width="38" height="30" rx="3" /><path d="M5 33l11-11 9 9 6-6 12 12" /><circle cx="33" cy="18" r="3" /></>,
  cap: <><path d="M4 18l20-9 20 9-20 9z" /><path d="M12 22v10c4 4 20 4 24 0V22M44 18v12" /></>,
  prompt: <><path d="M12 5h18l8 8v30H12z" /><path d="M30 5v8h8M18 22h14M18 29h14M18 36h9" /></>,
  log: <><path d="M8 12l3 3 6-6M8 26l3 3 6-6M8 40l3 3 6-6" /><path d="M22 12h18M22 26h18M22 40h12" /></>,
  profile: <><rect x="4" y="10" width="40" height="28" rx="3" /><circle cx="16" cy="22" r="5" /><path d="M8 33c2-4 14-4 16 0M29 19h10M29 25h10M29 31h6" /></>,
  clipboard: <><rect x="10" y="8" width="28" height="36" rx="3" /><path d="M18 5h12v6H18zM17 27l5 5 9-10" /></>,
  speech: <><path d="M6 10h36v22H22l-9 8v-8H6z" /><path d="M14 18h20M14 24h13" /></>,
  pin: <><path d="M24 44s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z" /><circle cx="24" cy="20" r="5" /></>,
  // Lab 2's three patterns (2.9)
  lookup: <><path d="M12 5h18l8 8v30H12z" /><path d="M30 5v8h8" /><circle cx="23" cy="27" r="6" /><path d="M27.5 31.5L33 37" /></>,
  steps: <><rect x="4" y="18" width="10" height="12" rx="2" /><rect x="19" y="18" width="10" height="12" rx="2" /><rect x="34" y="18" width="10" height="12" rx="2" /><path d="M14 24h5M29 24h5" /></>,
  branch: <><circle cx="10" cy="24" r="5" /><circle cx="38" cy="10" r="5" /><circle cx="38" cy="38" r="5" /><path d="M15 24h8l10-11M23 24l10 11" /></>,
  // the three disciplines (3.4)
  database: <><ellipse cx="24" cy="10" rx="15" ry="5" /><path d="M9 10v28c0 2.8 6.7 5 15 5s15-2.2 15-5V10M9 19c0 2.8 6.7 5 15 5s15-2.2 15-5M9 28.5c0 2.8 6.7 5 15 5s15-2.2 15-5" /></>,
  funnel: <path d="M5 7h38L28 25v14l-8 4V25z" />,
  loop: <><path d="M40 20a17 17 0 0 0-31-6M8 28a17 17 0 0 0 31 6" /><path d="M9 6v8h8M39 42v-8h-8" /></>,
  // the four failures of the glass (3.3b) and their fixes (3.15b)
  overflow: <><path d="M9 12h30l-4 31H13z" /><path d="M10 20h28M11 28h26M12 36h24" /><path d="M14 12c0-4 3-6 5-4 1-4 7-4 8 0 2-2 6 0 6 4" /></>,
  target: <><circle cx="24" cy="24" r="19" /><circle cx="24" cy="24" r="12" /><circle cx="24" cy="24" r="4" /></>,
  inspect: <><circle cx="20" cy="20" r="14" /><path d="M30 30l13 13" /><path d="M13 20l5 5 9-10" /></>,
  clock: <><circle cx="24" cy="24" r="19" /><path d="M24 12v12l8 5" /></>,
  // with and without memory (3.15)
  quote: <><path d="M12 5h18l8 8v30H12z" /><path d="M30 5v8h8M18 24c0-3 2-5 4-5M18 24v5h4v-5h-4M27 24c0-3 2-5 4-5M27 24v5h4v-5h-4" /></>,
  wrench: <path d="M30 6a10 10 0 0 0-9 14L6 35l7 7 15-15a10 10 0 0 0 14-9l-6 6-6-2-2-6z" />,
  lock: <><rect x="9" y="21" width="30" height="22" rx="3" /><path d="M15 21v-6a9 9 0 0 1 18 0v6M24 30v5" /></>,
  // the takeaways (3.17)
  foundation: <><path d="M24 4L8 14h32z" /><path d="M12 14v18M20 14v18M28 14v18M36 14v18" /><rect x="4" y="34" width="40" height="5" /><rect x="2" y="39" width="44" height="5" /></>,
  glass: <><path d="M8 6h32l-4 36H12z" /><path d="M10 16h28M11 24h26M12 32h24" /></>,
  converge: <><rect x="3" y="4" width="8" height="8" rx="1.5" /><circle cx="19" cy="8" r="4" /><path d="M27 12l4-8 4 8z" /><path d="M39 4h6v8h-6z" /><path d="M7 12l13 12M19 12l4 12M31 12l-6 12M42 12L28 24" /><ellipse cx="24" cy="28" rx="10" ry="3.5" /><path d="M14 28v12c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5V28" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export function LineIcon({ name, size = 48, color = 'var(--teal)' }: { name: IconName; size?: number; color?: string }) {
  return (
    <svg data-icon={name} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
      {PATHS[name]}
    </svg>
  );
}
