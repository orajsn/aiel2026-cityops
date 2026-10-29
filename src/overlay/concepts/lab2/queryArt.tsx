import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Fill, FitBox } from '../Fill';
import { LineIcon } from '../icons';
import { AgentAvatar } from './AgentAvatar';
import { Figure } from './everyday';
import { CARD, Db, DIM, INK, Net, Num, SOFT, TEAL, TEAL_D, TINT, TINT2, MONO, mono } from './parts';

/**
 * Lab 2 · pages 2.6b, 2.6c and 2.7 in the Lab 3 teaching pattern (owner, 29 Oct: "see how 3.2 to 3.4 build the
 * sequence"): one big flat picture per page, an everyday analogy in plain words, the pieces arriving one after
 * another, and each page laid out its own way.
 *   2.6b · the three parts of one SQL statement fill one lunch tray: the JSON brief.
 *   2.6c · the query becomes a button on a machine: the AI agent sees the front, the SQL stays inside.
 *   2.7  · the agent is a loop, like a cook who tastes, adds and tastes again until it is right.
 * Teal and greys only: the page's one red thing is its kicker.
 */

const G_LIGHT = 'rgba(138, 145, 156, 0.30)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const T_SOFT = 'rgba(27, 138, 156, 0.28)';

/** steps 1..n arrive about a second apart */
const at = (i: number) => 0.5 + i * 0.9;

const label: CSSProperties = { fontSize: 17, fontWeight: 700, letterSpacing: 2.4, color: DIM, textTransform: 'uppercase' };
const hl: CSSProperties = { color: TEAL, fontWeight: 700 };
const fadeIn = (delay: number, y = 10) => ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5, ease: EASE } });

/** a value chip in mono, a little larger than parts' Chip so it reads from the back of the hall */
function Val({ children, strong = false, style }: { children: ReactNode; strong?: boolean; style?: CSSProperties }) {
  return <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 8, background: strong ? TEAL : TINT, ...mono(21, strong ? '#fff' : TEAL_D), fontWeight: 700, whiteSpace: 'nowrap', ...style }}>{children}</span>;
}

/* ================================================================================================
 * 2.6b · one brief from one statement: three parts of the query, one tray
 * ================================================================================================ */

/** the asset's row and its JSON specs: a small table card with a brace badge */
function RowArt({ size = 1 }: { size?: number }) {
  return (
    <svg width={96 * size} height={72 * size} viewBox="0 0 96 72" aria-hidden style={{ flex: 'none' }}>
      <rect x="4" y="6" width="64" height="58" rx="6" fill={CARD} stroke={TEAL} strokeWidth="2.4" />
      <rect x="4" y="6" width="64" height="14" rx="6" fill={TEAL} />
      {[28, 40, 52].map((y) => (
        <path key={y} d={`M12 ${y}h48`} stroke={G_MID} strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect x="56" y="30" width="36" height="36" rx="8" fill={TINT2} stroke={TEAL} strokeWidth="2" />
      <text x="74" y="55" textAnchor="middle" fontFamily={MONO} fontSize="20" fontWeight="700" fill={TEAL_D}>{'{}'}</text>
    </svg>
  );
}

/** Harbor Bridge in the middle, its five neighbours around it; the edges draw in one by one */
function GraphArt({ size = 1, delay = 0 }: { size?: number; delay?: number }) {
  const around = [[16, 16], [80, 14], [90, 52], [50, 68], [10, 54]];
  return (
    <svg width={100 * size} height={76 * size} viewBox="0 0 100 76" aria-hidden style={{ flex: 'none' }}>
      {around.map(([x, y], i) => (
        <motion.path key={i} d={`M50 38L${x} ${y}`} stroke={TEAL} strokeWidth="2.2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + i * 0.12, duration: 0.4 }} />
      ))}
      {around.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="6.5" fill={CARD} stroke={G_DARK} strokeWidth="2.2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + i * 0.12 + 0.25 }} />
      ))}
      <circle cx="50" cy="38" r="10" fill={TEAL} />
    </svg>
  );
}

/** five reports ranked by distance: the closest first, a little shorter each time */
function RankArt({ size = 1, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <svg width={100 * size} height={76 * size} viewBox="0 0 100 76" aria-hidden style={{ flex: 'none' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect key={i} x="6" y={4 + i * 14} height="9" rx="4.5" fill={TEAL} fillOpacity={1 - i * 0.17} initial={{ width: 0 }} animate={{ width: 88 - i * 14 }} transition={{ delay: delay + i * 0.12, duration: 0.5, ease: EASE }} />
      ))}
    </svg>
  );
}

const PARTS: { n: number; cte: string; title: ReactNode; detail: ReactNode; art: (d: number) => ReactNode }[] = [
  {
    n: 1,
    cte: 'asset',
    title: 'The bridge’s row and its JSON specs',
    detail: (
      <>
        <Val>Harbor Bridge</Val> <Val>criticality 5</Val>
      </>
    ),
    art: () => <RowArt />,
  },
  {
    n: 2,
    cte: 'neighbors',
    title: 'Its neighbours in the graph',
    detail: (
      <>
        <b style={hl}>5 connected assets</b> <span style={{ color: DIM }}>· SQL/PGQ</span> <Val>GRAPH_TABLE</Val>
      </>
    ),
    art: (d) => <GraphArt delay={d} />,
  },
  {
    n: 3,
    cte: 'evidence',
    title: 'The closest reports by meaning',
    detail: (
      <>
        <b style={hl}>5 evidence chunks</b> <span style={{ color: DIM }}>· ranked by</span> <Val>VECTOR_DISTANCE</Val>
      </>
    ),
    art: (d) => <RankArt delay={d} />,
  },
  {
    n: 4,
    cte: 'JSON_OBJECT',
    title: 'Everything packed into one result',
    detail: (
      <>
        <Val>RETURNING JSON</Val> <span style={{ color: DIM }}>· a Python</span> <b style={hl}>dict</b>
      </>
    ),
    art: () => <LineIcon name="converge" size={68} />,
  },
];

/** the cafeteria tray: four compartments named like the brief's keys; each fills when its part of the query lands */
const COMPARTMENTS: { key: string; n: number; x: number; y: number; w: number; h: number; art: ReactNode }[] = [
  { key: 'asset', n: 1, x: 26, y: 26, w: 226, h: 132, art: <RowArt size={1.15} /> },
  { key: 'specifications', n: 1, x: 268, y: 26, w: 226, h: 132, art: <span style={{ ...mono(64, TEAL_D), fontWeight: 700, lineHeight: 1.2 }}>{'{ }'}</span> },
  { key: 'graph_context', n: 2, x: 26, y: 174, w: 226, h: 132, art: <GraphArt size={1.1} delay={at(1) + 0.9} /> },
  { key: 'ranked_evidence', n: 3, x: 268, y: 174, w: 226, h: 132, art: <RankArt size={1.1} delay={at(2) + 0.9} /> },
];

function Tray({ lit }: { lit: (n: number) => boolean }) {
  return (
    <div data-tray style={{ position: 'relative', width: 520, height: 332, flex: 'none' }}>
      <svg width="520" height="332" viewBox="0 0 520 332" style={{ position: 'absolute', inset: 0 }} aria-hidden>
        <ellipse cx="260" cy="326" rx="236" ry="6" fill="rgba(127,127,127,0.18)" />
        <rect x="4" y="4" width="512" height="318" rx="26" fill={G_MID} />
        <rect x="10" y="10" width="500" height="306" rx="22" fill={G_LIGHT} />
        {COMPARTMENTS.map((c) => (
          <rect key={c.key} x={c.x} y={c.y} width={c.w} height={c.h} rx="16" fill="rgba(255,255,255,0.55)" stroke={G_DARK} strokeOpacity="0.35" strokeWidth="2" />
        ))}
        {/* once all three parts are in, the tray's rim turns teal: one value, handed over in one go */}
        <motion.rect x="4" y="4" width="512" height="318" rx="26" fill="none" stroke={TEAL} strokeWidth="5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: at(3) + 0.3, duration: 0.6 }} />
      </svg>
      {COMPARTMENTS.map((c) => (
        <div key={c.key} data-compartment={c.key} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: lit(c.n) ? 1 : 0.35, transition: 'opacity 300ms' }}>
          <motion.div initial={{ opacity: 0, y: -26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: at(c.n - 1) + 0.5, duration: 0.6, ease: EASE }} style={{ height: 84, display: 'flex', alignItems: 'center' }}>
            {c.art}
          </motion.div>
          <div style={{ ...mono(20, TEAL_D), fontWeight: 700 }}>{c.key}</div>
        </div>
      ))}
    </div>
  );
}

export function BriefBody({ focusN }: { focusN: number | null }) {
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 540px', columnGap: 30, marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ ...label, marginBottom: 12 }}>One SQL statement, built in parts</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PARTS.map((p, i) => {
              const on = lit(p.n);
              return (
                <motion.div
                  key={p.n}
                  data-step={p.n}
                  data-on={on}
                  {...fadeIn(at(i))}
                  style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr) 104px', alignItems: 'center', columnGap: 18, padding: '10px 18px', borderRadius: 14, border: `2px solid ${focusN === p.n || (focusN === null && p.n === 4) ? TEAL : 'var(--line)'}`, background: focusN === p.n ? CARD : p.n === 4 ? TINT : SOFT, opacity: on ? 1 : 0.4, transition: 'opacity 300ms' }}
                >
                  <Num n={p.n} size={46} on={on} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.25 }}>{p.title}</span>
                      <span style={{ ...mono(19, DIM) }}>{p.cte}</span>
                    </div>
                    <div style={{ fontSize: 22, color: INK, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{p.detail}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>{p.art(at(i) + 0.3)}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--line)', paddingLeft: 20 }}>
          <div style={{ ...label, marginBottom: 12 }}>In everyday life: a lunch tray</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            <Tray lit={(n) => lit(n) || focusN === 4} />
            <motion.div {...fadeIn(0.3)} data-caption style={{ fontSize: 23, lineHeight: 1.45, color: INK }}>
              Four dishes, <b style={hl}>one tray</b>, one trip to the counter. The brief comes back the same way: <b style={hl}>one JSON value</b>.
            </motion.div>
            <motion.div {...fadeIn(at(3) + 0.5)} style={{ alignSelf: 'flex-start', padding: '8px 22px', borderRadius: 999, background: TEAL, color: '#fff', fontSize: 22, fontWeight: 700 }}>
              one statement · one transaction
            </motion.div>
          </div>
        </div>
      </div>
    </Fill>
  );
}

/* ================================================================================================
 * 2.6c · the agent's main instrument: a button on the front, the recipe stays inside
 * ================================================================================================ */

/** the coffee machine: one teal button pressed, the cup fills; the recipe is behind a locked panel */
function CoffeeMachine() {
  return (
    <svg data-art="coffee-machine" width="230" height="230" viewBox="0 0 250 250">
      <ellipse cx="125" cy="244" rx="112" ry="5" fill="rgba(127,127,127,0.18)" />
      {/* body, side in a darker tone */}
      <rect x="30" y="10" width="190" height="232" rx="16" fill={G_DARK} />
      <rect x="30" y="10" width="182" height="232" rx="16" fill={G_MID} />
      {/* the front panel: three buttons, the middle one teal and pressed */}
      <rect x="46" y="26" width="150" height="66" rx="10" fill="rgba(255,255,255,0.75)" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={76 + i * 45} cy="52" r="15" fill={i === 1 ? TEAL : G_LIGHT} stroke={i === 1 ? TEAL_D : G_DARK} strokeWidth="2" />
          <rect x={64 + i * 45} y="72" width="24" height="5" rx="2.5" fill={i === 1 ? TEAL : G_MID} />
        </g>
      ))}
      <motion.circle cx="121" cy="52" r="15" fill="none" stroke={TEAL} strokeWidth="3" initial={{ r: 15, opacity: 0.9 }} animate={{ r: [15, 26], opacity: [0.9, 0] }} transition={{ delay: 0.8, duration: 1.4, repeat: Infinity, repeatDelay: 2.6 }} />
      {/* the recipe, behind a locked panel */}
      <rect x="46" y="102" width="150" height="40" rx="8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="5 5" />
      <g transform="translate(110 108)" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <rect x="0" y="10" width="22" height="16" rx="3" fill="rgba(255,255,255,0.25)" />
        <path d="M4 10V6a7 7 0 0 1 14 0v4" />
      </g>
      {/* spout, the cup, and the coffee pouring */}
      <rect x="108" y="150" width="26" height="14" rx="4" fill={G_DARK} />
      <rect x="46" y="222" width="150" height="10" rx="4" fill={G_DARK} />
      <motion.rect x="118" y="164" width="6" rx="3" fill={TEAL} initial={{ height: 0, opacity: 0 }} animate={{ height: [0, 30, 30], opacity: [0, 1, 0] }} transition={{ delay: 1.2, duration: 2.2, repeat: Infinity, repeatDelay: 1.8 }} />
      <path d="M96 192h50l-5 30h-40z" fill="#fff" stroke={G_DARK} strokeWidth="2" />
      <path d="M146 198c10 0 10 14 0 14" fill="none" stroke={G_DARK} strokeWidth="3" />
      <motion.rect x="100" y="204" width="42" height="14" rx="2" fill={T_SOFT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} />
    </svg>
  );
}

function FrontStep({ n, focusN, children, delay }: { n: number; focusN: number | null; children: ReactNode; delay: number }) {
  const on = focusN === null || focusN === n;
  return (
    <motion.div data-step={n} data-on={on} {...fadeIn(delay)} style={{ display: 'grid', gridTemplateColumns: '42px minmax(0, 1fr)', columnGap: 14, alignItems: 'start', padding: '10px 14px', borderRadius: 12, border: `2px solid ${focusN === n ? TEAL : 'transparent'}`, background: focusN === n ? CARD : 'transparent', opacity: on ? 1 : 0.4, transition: 'opacity 300ms' }}>
      <Num n={n} size={42} on={on} />
      <div style={{ minWidth: 0 }}>{children}</div>
    </motion.div>
  );
}

const SLOTS: [string, string][] = [
  ['asset_name', '"Harbor Bridge"'],
  ['focus', '"bearing corrosion and cracking"'],
  ['k', '5'],
];

/** the wall between the front and the inside: the three arguments go in, one brief comes out */
function Wall() {
  return (
    <div data-wall style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 10, marginLeft: -5, borderRadius: 5, background: 'repeating-linear-gradient(180deg, #8a919c 0 18px, #5c6b78 18px 22px)', opacity: 0.55 }} />
      <svg width="76" height="40" viewBox="0 0 76 40" style={{ position: 'relative' }} aria-label="three arguments in" role="img">
        <path d="M4 20H64" stroke={TEAL} strokeWidth="3" strokeDasharray="5 6" />
        <path d="M56 10l10 10-10 10" stroke={TEAL} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <motion.circle cy="20" r="6" fill={TEAL} initial={{ cx: 6, opacity: 0 }} animate={{ cx: [6, 56], opacity: [0, 1, 1, 0] }} transition={{ delay: at(3), duration: 1.2, repeat: Infinity, repeatDelay: 3.4 }} />
      </svg>
      <span style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: CARD, border: `2px solid ${G_MID}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LineIcon name="lock" size={32} color={G_DARK} />
      </span>
      <svg width="76" height="40" viewBox="0 0 76 40" style={{ position: 'relative' }} aria-label="one brief back" role="img">
        <path d="M72 20H12" stroke={TEAL} strokeWidth="3" strokeDasharray="5 6" />
        <path d="M20 10L10 20l10 10" stroke={TEAL} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <motion.circle cy="20" r="6" fill={TEAL} initial={{ cx: 70, opacity: 0 }} animate={{ cx: [70, 20], opacity: [0, 1, 1, 0] }} transition={{ delay: at(3) + 1.4, duration: 1.2, repeat: Infinity, repeatDelay: 3.4 }} />
      </svg>
    </div>
  );
}

export function MainBody({ focusN }: { focusN: number | null }) {
  const lit4 = focusN === null || focusN === 4;
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '290px minmax(0, 1.35fr) 84px minmax(0, 1fr)', columnGap: 22, marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
        {/* everyday: the coffee machine */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--line)', paddingRight: 22 }}>
          <div style={{ ...label, marginBottom: 8 }}>In everyday life</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
            <motion.div {...fadeIn(0.2, 0)} style={{ display: 'flex', justifyContent: 'center' }}>
              <CoffeeMachine />
            </motion.div>
            <div data-caption style={{ fontSize: 23, lineHeight: 1.42, color: INK }}>
              You press <b style={hl}>one button</b> and pick the size. <b style={hl}>The recipe stays inside</b> the machine.
            </div>
          </div>
        </div>

        {/* the front: what the AI agent sees */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <motion.div {...fadeIn(0.2)} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <AgentAvatar size={72} />
            <div>
              <div style={{ ...label, color: TEAL_D }}>The front</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>What the AI agent sees</div>
            </div>
          </motion.div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', border: `2px solid ${TEAL}`, borderRadius: 16, background: CARD, padding: '6px 6px' }}>
            <FrontStep n={1} focusN={focusN} delay={at(0)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Val strong style={{ fontSize: 24 }}>@tool</Val>
                <span style={{ fontSize: 22, color: INK }}>turns the query into <b style={hl}>a button</b></span>
              </div>
            </FrontStep>
            <FrontStep n={2} focusN={focusN} delay={at(1)}>
              <div style={{ ...mono(24, INK), fontWeight: 700, marginBottom: 8, overflowWrap: 'anywhere' }}>get_asset_incident_brief</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', columnGap: 12, rowGap: 6, alignItems: 'center' }}>
                {SLOTS.map(([k, v]) => (
                  <div key={k} data-slot={k} style={{ display: 'contents' }}>
                    <span style={{ ...mono(20, DIM) }}>{k}</span>
                    <span style={{ ...mono(21, TEAL_D), fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: TINT, justifySelf: 'start' }}>{v}</span>
                  </div>
                ))}
              </div>
            </FrontStep>
            <FrontStep n={3} focusN={focusN} delay={at(2)}>
              <div style={{ fontSize: 22, color: DIM, marginBottom: 4 }}>the note on the button tells it when:</div>
              <div style={{ fontSize: 22, lineHeight: 1.4, fontStyle: 'italic', color: INK, borderLeft: `4px solid ${TEAL}`, paddingLeft: 12 }}>
                “Prefer this when you need a <b style={{ ...hl, fontStyle: 'normal' }}>holistic picture</b> before recommending action.”
              </div>
            </FrontStep>
          </div>
        </div>

        <Wall />

        {/* the inside: the SQL stays in the code */}
        <motion.div data-step={4} data-on={lit4} {...fadeIn(at(3))} style={{ display: 'flex', flexDirection: 'column', minWidth: 0, opacity: lit4 ? 1 : 0.4, transition: 'opacity 300ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <Num n={4} size={42} on={lit4} />
            <div>
              <div style={label}>The inside</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>The SQL stays yours</div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 10, border: `2px solid ${focusN === 4 ? TEAL : 'var(--line)'}`, borderRadius: 16, background: SOFT, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Db size={56} />
              <div style={{ ...mono(19, INK), overflowWrap: 'anywhere' }}>get_asset_incident_brief_raw(asset_name, focus, k)</div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(31, 42, 51, 0.92)', color: '#e6e9ef', fontFamily: MONO, fontSize: 20, lineHeight: 1.5, whiteSpace: 'pre' }}>
              {'WITH asset AS (…),\n     neighbors AS (…),\n     evidence AS (…)\nSELECT JSON_OBJECT(…)'}
            </div>
            <div style={{ fontSize: 22, color: INK, lineHeight: 1.4 }}>
              Out comes <b style={hl}>one JSON brief</b>. The language model <b style={hl}>never sees or writes the SQL</b>.
            </div>
          </div>
        </motion.div>
      </div>
    </Fill>
  );
}

/* ================================================================================================
 * 2.7 · the agent is a state graph: think, act, back to think; like a cook tasting
 * ================================================================================================ */

/** the cook: tastes from a spoon over the pot; a pinch of teal salt falls in, again and again */
function Cook() {
  return (
    <svg data-art="cook" width="300" height="209" viewBox="0 0 330 230">
      <ellipse cx="165" cy="224" rx="150" ry="5" fill="rgba(127,127,127,0.18)" />
      {/* the stove */}
      <rect x="150" y="150" width="170" height="70" rx="6" fill={G_DARK} />
      <rect x="146" y="142" width="178" height="12" rx="4" fill={G_MID} />
      {/* the pot, with steam */}
      <path d="M176 96h120v40a10 10 0 0 1-10 10h-100a10 10 0 0 1-10-10z" fill={G_MID} />
      <rect x="170" y="90" width="132" height="10" rx="4" fill={G_DARK} />
      <rect x="160" y="104" width="16" height="8" rx="3" fill={G_DARK} />
      <rect x="296" y="104" width="16" height="8" rx="3" fill={G_DARK} />
      <rect x="180" y="84" width="112" height="8" rx="4" fill={T_SOFT} />
      {[206, 236, 266].map((x, i) => (
        <motion.path key={x} d={`M${x} 76c-6-8 6-14 0-24`} stroke={G_MID} strokeWidth="3" fill="none" strokeLinecap="round" initial={{ opacity: 0, y: 6 }} animate={{ opacity: [0, 0.8, 0], y: [6, -6, -10] }} transition={{ delay: 0.4 + i * 0.5, duration: 2.4, repeat: Infinity, repeatDelay: 0.6 }} />
      ))}
      {/* the cook */}
      <Figure x={90} y={40} shirt="#5d7f8c" />
      <path d="M68 78h44v-30c0-12-10-18-22-18s-22 6-22 18z" fill="#fff" opacity="0.92" />
      {/* the arm with the shaker over the pot */}
      <path d="M108 140c20-8 40-30 66-44" stroke="#5d7f8c" strokeWidth="13" strokeLinecap="round" fill="none" />
      <circle cx="176" cy="94" r="7" fill="#c98e6a" />
      <rect x="170" y="56" width="20" height="32" rx="5" fill="#fff" stroke={G_DARK} strokeWidth="2" transform="rotate(25 180 72)" />
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={198 + i * 5} r="3" fill={TEAL} initial={{ cy: 66, opacity: 0 }} animate={{ cy: [66, 86], opacity: [0, 1, 0] }} transition={{ delay: 1 + i * 0.2, duration: 1, repeat: Infinity, repeatDelay: 2.6 }} />
      ))}
    </svg>
  );
}

const LOOP: { n: number; everyday: string; node: string; what: string }[] = [
  { n: 1, everyday: 'Taste', node: 'model', what: 'think' },
  { n: 2, everyday: 'Add salt', node: 'tools', what: 'act' },
  { n: 3, everyday: 'Need more?', node: 'tool?', what: 'one question' },
  { n: 4, everyday: 'Taste again', node: 'loop', what: 'back to think' },
];

/** the graph, laid out at 900 × 560 and scaled to its box */
const GW = 900;
const GH = 560;
/** the cycle a light walks: model → tool? → tools → back to model */
const CYCLE = 'M450 236V284L346 344L262 412H170V264Q170 206 300 206H450V236';

function Node({ n, on, x, y, w, h, children }: { n?: number; on: boolean; x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <div data-node style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: 18, border: `2.5px solid ${TEAL}`, background: CARD, boxShadow: '0 3px 10px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', opacity: on ? 1 : 0.4, transition: 'opacity 300ms' }}>
      {n && <Num n={n} size={40} on={on} />}
      {children}
    </div>
  );
}

function Pill({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <div style={{ position: 'absolute', left: x, top: y, padding: '8px 22px', borderRadius: 999, background: 'rgba(31,42,51,0.92)', color: '#fff', ...mono(22, '#fff'), fontWeight: 700 }}>{children}</div>;
}

function LoopGraph({ focusN }: { focusN: number | null }) {
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <FitBox w={GW} h={GH} max={1.3}>
      <div data-graph style={{ position: 'absolute', inset: 0 }}>
        {/* the AI agent: this whole loop */}
        <svg width={GW} height={GH} viewBox={`0 0 ${GW} ${GH}`} style={{ position: 'absolute', inset: 0 }} aria-hidden>
          <rect x="6" y="6" width={GW - 12} height={GH - 12} rx="26" fill={TINT} fillOpacity="0.5" stroke={TEAL} strokeOpacity="0.55" strokeWidth="2" strokeDasharray="8 8" />
          <g fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* START → model */}
            <path d="M206 150H292" strokeDasharray="5 7" />
            <path d="M284 142l8 8-8 8" />
            {/* model → tool? */}
            <path d="M450 236V278" />
            <path d="M442 270l8 8 8-8" />
            {/* tool? yes → tools */}
            <path d="M346 344L268 404" />
            <path d="M268 392l0 12 12 0" />
            {/* tool? no → END */}
            <path d="M554 344L668 384" stroke={G_MID} />
            <path d="M656 390l12-6-6-12" stroke={G_MID} />
          </g>
          {/* the loop back to think: the thick line the light keeps walking */}
          <path data-back d="M170 412V264Q170 206 292 206" fill="none" stroke={TEAL} strokeWidth="6" strokeLinecap="round" opacity={lit(4) ? 1 : 0.4} />
          <path d="M282 196l12 10-12 10" fill="none" stroke={TEAL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* the decision: a diamond */}
          <path d="M450 284L554 344L450 404L346 344Z" fill={CARD} stroke={TEAL} strokeWidth="2.5" opacity={lit(3) ? 1 : 0.4} />
          {/* a light at walking pace, round the cycle and under the nodes */}
          <circle r="9" fill={TEAL}>
            <animateMotion dur="7s" repeatCount="indefinite" begin="2.6s" path={CYCLE} />
          </circle>
        </svg>

        <motion.div {...fadeIn(0.2)} style={{ position: 'absolute', left: 26, top: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AgentAvatar size={64} />
          <div style={{ fontSize: 22, color: INK }}>
            <b style={{ color: TEAL_D }}>AI Agent</b> = this whole loop
          </div>
        </motion.div>

        <motion.div {...fadeIn(0.4)}>
          <Pill x={90} y={128}>START</Pill>
        </motion.div>
        <motion.div {...fadeIn(at(0))}>
          <Node n={1} on={lit(1)} x={300} y={104} w={300} h={132}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ ...mono(28, INK), fontWeight: 700 }}>model</span>
                <Net w={86} live />
              </div>
              <div style={{ fontSize: 22, color: DIM }}>the language model <b style={hl}>thinks</b></div>
            </div>
          </Node>
        </motion.div>
        <motion.div {...fadeIn(at(2))} style={{ position: 'absolute', left: 346, top: 284, width: 208, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: lit(3) ? 1 : 0.4 }}>
          <Num n={3} size={34} on={lit(3)} />
          <span style={{ ...mono(26, INK), fontWeight: 700 }}>tool?</span>
        </motion.div>
        <motion.div {...fadeIn(at(2) + 0.2)} style={{ position: 'absolute', left: 560, top: 262, width: 300, fontSize: 22, color: DIM, lineHeight: 1.35 }}>
          one question: <b style={hl}>did the model ask for a tool?</b>
        </motion.div>
        <motion.div {...fadeIn(at(2) + 0.4)} style={{ position: 'absolute', left: 250, top: 330, fontSize: 24, fontWeight: 700, color: TEAL_D }}>yes</motion.div>
        <motion.div {...fadeIn(at(2) + 0.4)} style={{ position: 'absolute', left: 612, top: 340, fontSize: 24, fontWeight: 700, color: DIM }}>no</motion.div>
        <motion.div {...fadeIn(at(1))}>
          <Node n={2} on={lit(2)} x={40} y={412} w={330} h={110}>
            <LineIcon name="wrench" size={46} />
            <div>
              <span style={{ ...mono(28, INK), fontWeight: 700 }}>tools</span>
              <div style={{ fontSize: 22, color: DIM }}>
                <b style={hl}>act</b>: run the tool it asked for
              </div>
            </div>
          </Node>
        </motion.div>
        <motion.div {...fadeIn(at(3))} style={{ position: 'absolute', left: 30, top: 262, width: 130, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, textAlign: 'right', fontSize: 22, fontWeight: 700, color: TEAL_D, lineHeight: 1.25, opacity: lit(4) ? 1 : 0.4 }}>
          <Num n={4} size={34} on={lit(4)} />
          <span>
            back to
            <br />
            think
          </span>
        </motion.div>
        <motion.div {...fadeIn(at(3) + 0.3)} style={{ position: 'absolute', left: 640, top: 384, width: 240, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', height: 46, width: 104 }}>
              <Pill x={0} y={0}>END</Pill>
            </div>
            <span style={{ fontSize: 22, color: INK }}>
              the <b style={hl}>answer</b>
            </span>
          </div>
          <div style={{ fontSize: 22, color: DIM, lineHeight: 1.3 }}>
            first, an <span style={{ fontFamily: MONO }}>enforce</span> step checks <span style={{ fontFamily: MONO }}>remember</span> was called
          </div>
        </motion.div>
      </div>
    </FitBox>
  );
}

export function GraphBody({ focusN }: { focusN: number | null }) {
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', columnGap: 26, marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <LoopGraph focusN={focusN} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--line)', paddingLeft: 22 }}>
          <div style={{ ...label, marginBottom: 4 }}>In everyday life</div>
          <motion.div {...fadeIn(0.2, 0)} style={{ display: 'flex', justifyContent: 'center' }}>
            <Cook />
          </motion.div>
          <div data-caption style={{ fontSize: 22, lineHeight: 1.4, color: INK, margin: '4px 0 10px' }}>
            A cook <b style={hl}>tastes</b>, adds what is missing, <b style={hl}>tastes again</b>. Right? <b style={hl}>Serve.</b>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOOP.map((s, i) => {
              const on = focusN === null || focusN === s.n;
              return (
                <motion.div key={s.n} data-step={s.n} data-on={on} {...fadeIn(at(i) + 0.3)} style={{ flex: '1 0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '3px 14px', borderRadius: 12, border: `2px solid ${focusN === s.n ? TEAL : 'var(--line)'}`, background: focusN === s.n ? CARD : SOFT, opacity: on ? 1 : 0.4, transition: 'opacity 300ms' }}>
                  <Num n={s.n} size={36} on={on} />
                  <span style={{ fontSize: 23, fontWeight: 700, color: INK, flex: 1 }}>{s.everyday}</span>
                  <span style={{ color: TEAL }}>→</span>
                  <span style={{ ...mono(21, TEAL_D), fontWeight: 700 }}>{s.node}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Fill>
  );
}
