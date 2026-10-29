import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { Rich } from '../Rich';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './Fill';
import { Portrait } from './ThreeLabs';
import { LineIcon } from './icons';

/**
 * Lab 3 · Back on the bridge (owner, 29 Oct: "match how we already changed Lab 3's first teaching part"): Day 1,
 * Day 2 and where both labs meet as white WidePanel pages that build step by step, with the Mercer and Vance
 * portraits, the agent's chat drawn on the panel, and arrows to where each thing is kept.
 */

const TEAL = 'var(--teal)';
const INK = 'var(--ink)';
const DIM = 'var(--ink-dim)';
const TINT = 'rgba(27, 138, 156, 0.12)';
const SOFT = 'rgba(127, 127, 127, 0.12)';
const RED = 'var(--red)';
const MONO: CSSProperties = { fontFamily: 'JetBrains Mono, monospace' };
const cap: CSSProperties = { fontSize: 17, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: DIM };

export interface BridgeStepProps {
  kicker: string;
  message: string;
  step: number;
  notebook?: string;
}

const show = (on: boolean, delay = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: on ? 1 : 0, y: 0 }, transition: { delay: on ? delay : 0, duration: 0.5, ease: EASE } });

/** a person on the left: portrait, name, day */
function Person({ who, day }: { who: 'mercer' | 'vance'; day: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 230, flex: 'none' }}>
      <Portrait who={who} size={170} />
      <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>{who === 'mercer' ? 'Mercer' : 'Vance'}</div>
      <div style={{ ...cap, fontSize: 20 }}>{day}</div>
    </div>
  );
}

/** one chat bubble: the person on the left, the AI agent on the right */
function Bubble({ from, children, delay = 0, on = true, dim = false }: { from: 'person' | 'agent'; children: ReactNode; delay?: number; on?: boolean; dim?: boolean }) {
  const agent = from === 'agent';
  return (
    <motion.div {...show(on, delay)} style={{ alignSelf: agent ? 'flex-end' : 'flex-start', maxWidth: '86%', opacity: dim ? 0.45 : 1 }}>
      <div style={{ ...cap, fontSize: 14, marginBottom: 4, textAlign: agent ? 'right' : 'left', color: agent ? TEAL : DIM }}>{agent ? 'AI Agent' : 'Inspector'}</div>
      <div style={{ padding: '14px 20px', borderRadius: agent ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: agent ? TINT : 'var(--panel-strong, #fff)', border: `2px solid ${agent ? TEAL : 'rgba(0,0,0,0.12)'}`, fontSize: 24, lineHeight: 1.35, color: INK }}>{children}</div>
    </motion.div>
  );
}

/** the chat window drawn on the panel */
function Chat({ title, children, closed = false }: { title: string; children: ReactNode; closed?: boolean }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', borderRadius: 16, border: '2px solid rgba(0,0,0,0.12)', background: SOFT, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'rgba(127,127,127,0.16)' }}>
        <LineIcon name="prompt" size={30} />
        <span style={{ fontSize: 21, fontWeight: 700, color: INK }}>AI Agent</span>
        <span style={{ fontSize: 18, color: DIM }}>· {title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: '14px 22px' }}>{children}</div>
      <motion.div {...show(closed, 0.2)} style={{ position: 'absolute', right: 20, top: 58, padding: '6px 14px', borderRadius: 8, border: `3px solid ${DIM}`, color: DIM, fontWeight: 800, fontSize: 19, letterSpacing: '0.1em', transform: 'rotate(-6deg)' }}>
        CHAT CLOSED · PRIVATE
      </motion.div>
    </div>
  );
}

/** a place where something is kept: the findings table or shared memory */
function Store({ icon, title, sub, children, red = false, on, delay = 0 }: { icon: 'database' | 'book'; title: string; sub: string; children: ReactNode; red?: boolean; on: boolean; delay?: number }) {
  return (
    <motion.div {...show(on, delay)} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '18px 22px', borderRadius: 16, border: `3px solid ${red ? RED : TEAL}`, background: red ? 'rgba(199,70,52,0.06)' : TINT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <LineIcon name={icon} size={44} color={red ? RED : TEAL} />
        <div>
          <div style={{ ...MONO, fontSize: 22, fontWeight: 700, color: red ? RED : TEAL }}>{title}</div>
          <div style={{ fontSize: 17, color: DIM }}>{sub}</div>
        </div>
      </div>
      <div style={{ fontSize: 23, lineHeight: 1.4, color: INK }}>{children}</div>
    </motion.div>
  );
}

function Arrow({ on, delay = 0, label }: { on: boolean; delay?: number; label?: string }) {
  return (
    <motion.div {...show(on, delay)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, width: 120, flex: 'none' }}>
      {label && <span style={{ fontSize: 17, fontWeight: 700, color: TEAL, textAlign: 'center' }}>{label}</span>}
      <svg width="110" height="30" viewBox="0 0 110 30" aria-hidden>
        <path d="M4 15 H96" stroke="var(--teal)" strokeWidth="4" strokeDasharray="10 7" fill="none" />
        <path d="M88 5 L104 15 L88 25" stroke="var(--teal)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

/** the line at the foot of the page */
function Band({ on, delay = 0, children }: { on: boolean; delay?: number; children: ReactNode }) {
  return (
    <motion.div {...show(on, delay)} style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 18, padding: '18px 26px', borderRadius: 14, background: TINT, borderLeft: `6px solid ${TEAL}`, fontSize: 27, color: INK, fontWeight: 500 }}>
      {children}
    </motion.div>
  );
}

const FINDING = 'corrosion · medium · grade C · repair within 60 days';

/* ---------- 3.13 · Day 1: Mercer at the rust (two steps) ---------- */

export function Day1({ kicker, message, step, notebook }: BridgeStepProps) {
  const saved = step >= 2;
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="day1" step={step} kickerColor={TEAL}>
      <Fill gap={10}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch', gap: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Person who="mercer" day="Day 1 · at the rust" />
          </div>
          <Chat title="Harbor Bridge inspections" closed={saved}>
            <Bubble from="person" delay={0.2} dim={saved}>Corrosion on the bearing assemblies, with about <b>25% section loss</b> at the bearing plate edges.</Bubble>
            <Bubble from="person" delay={0.7} dim={saved}>My advice: repair within 60 days.</Bubble>
            <Bubble from="agent" delay={1.2} dim={saved}>Noted. I’ll log it as a finding for Harbor Bridge.</Bubble>
          </Chat>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <Arrow on={saved} delay={0.4} label="saved as a row" />
            <Arrow on={saved} delay={1.0} label="saved as a note" />
          </div>
          <div style={{ width: 470, flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 18 }}>
            <Store icon="database" title="CITY_INSPECTION_FINDING" sub="a table in the database" red on={saved} delay={0.5}>
              <span style={{ ...MONO, fontSize: 20 }}>{FINDING}</span>
            </Store>
            <Store icon="book" title="Shared memory" sub='user_id="Harbor Bridge"' on={saved} delay={1.1}>
              Her guideline: <b>repair within 60 days</b>, for whoever inspects this bridge next.
            </Store>
          </div>
        </div>
        <Band on={saved} delay={1.6}>
          <LineIcon name="lock" size={40} />
          <span>
            The chat stays private. What the next inspector inherits is <b style={{ color: TEAL }}>the finding and the guideline</b>.
          </span>
        </Band>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 3.14 · Day 2: Vance at the same rust (two steps) ---------- */

export function Day2({ kicker, message, step, notebook }: BridgeStepProps) {
  const answered = step >= 2;
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="day2" step={step} kickerColor={TEAL}>
      <Fill gap={10}>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch', gap: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Person who="vance" day="Day 2 · same rust" />
          </div>
          <Chat title="a new chat, Day 2">
            <Bubble from="person" delay={0.2}>What happened at this pier?</Bubble>
            <motion.div {...show(!answered, 0.8)} style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: TEAL, fontWeight: 600 }}>
              <LineIcon name="lookup" size={30} /> looking it up first…
            </motion.div>
            <Bubble from="agent" on={answered} delay={0.3}>
              Mercer logged corrosion here on Day 1: about <b>25% section loss</b>, grade C, repair within 60 days.
            </Bubble>
            <motion.div {...show(answered, 0.9)} style={{ alignSelf: 'flex-end', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span style={{ padding: '5px 12px', borderRadius: 8, background: TINT, ...MONO, fontSize: 17, color: TEAL }}>source · Mercer’s finding</span>
              <span style={{ padding: '5px 12px', borderRadius: 8, background: TINT, ...MONO, fontSize: 17, color: TEAL }}>source · shared memory</span>
            </motion.div>
          </Chat>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <Arrow on delay={0.9} label="search" />
            <Arrow on delay={1.2} label="read" />
          </div>
          <div style={{ width: 470, flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 18 }}>
            <Store icon="database" title="CITY_INSPECTION_FINDING" sub="vector search on the question" red on delay={1.0}>
              <span style={{ ...MONO, fontSize: 20 }}>{FINDING}</span>
              <div style={{ marginTop: 6, fontSize: 19, color: DIM }}>
                similarity score <b style={{ ...MONO, color: INK }}>0.289</b>
              </div>
            </Store>
            <Store icon="book" title="Shared memory" sub='user_id="Harbor Bridge"' on delay={1.3}>
              Mercer’s guideline: <b>repair within 60 days</b>
            </Store>
            <motion.div {...show(true, 1.6)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 12, border: '2px dashed rgba(0,0,0,0.2)', color: DIM, fontSize: 20 }}>
              <LineIcon name="lock" size={30} color="var(--ink-dim)" /> Mercer’s Day 1 chat · private, not searched
            </motion.div>
          </div>
        </div>
        <Band on={answered} delay={1.3}>
          <LineIcon name="quote" size={40} />
          <span>
            No human handoff. <b style={{ color: TEAL }}>The finding and the memory carried it.</b>
          </span>
        </Band>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 3.16 · Where both labs meet (two steps) ---------- */

/** section loss on a 0 to 50% bar: the rule draws its line at 25%, the history fills up to Mercer's ~25% */
function Meter({ fill, red, delay }: { fill?: number; red?: boolean; delay: number }) {
  const W = 560;
  const x = (v: number) => (v / 50) * W;
  return (
    <svg viewBox={`0 0 ${W + 20} 120`} style={{ width: '100%', maxWidth: 640, overflow: 'visible' }} aria-hidden>
      <rect x="10" y="40" width={W} height="36" rx="18" fill="rgba(127,127,127,0.18)" />
      {fill !== undefined && (
        <motion.rect x="10" y="40" height="36" rx="18" fill={red ? 'var(--red)' : 'var(--teal)'} initial={{ width: 0 }} animate={{ width: x(fill) }} transition={{ delay, duration: 1.1, ease: EASE }} />
      )}
      <line x1={10 + x(25)} x2={10 + x(25)} y1="22" y2="94" stroke="var(--ink)" strokeWidth="4" strokeDasharray="7 5" />
      <text x={10 + x(25)} y="14" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--ink)">25%</text>
      {[0, 50].map((v) => (
        <text key={v} x={10 + x(v)} y="116" textAnchor="middle" fontSize="18" fill="var(--ink-dim)">{v}%</text>
      ))}
    </svg>
  );
}


export function LabsMeet({ kicker, message, step, notebook }: BridgeStepProps) {
  const call = step >= 2;
  const card = (title: string, lab: string, lines: ReactNode, meter: ReactNode, red: boolean, delay: number) => (
    <motion.div {...show(true, delay)} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, padding: '26px 30px', borderRadius: 18, border: `3px solid ${red ? RED : TEAL}`, background: red ? 'rgba(199,70,52,0.06)' : TINT }}>
      <div style={{ ...cap, fontSize: 19, color: red ? RED : TEAL }}>{lab}</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>{title}</div>
      <div style={{ fontSize: 27, lineHeight: 1.45, color: INK }}>{lines}</div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{meter}</div>
    </motion.div>
  );
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="labs-meet" step={step} kickerColor={TEAL}>
      <Fill gap={16} justify="space-between">
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch', gap: 28 }}>
          {card('The rule', 'Lab 2 · this afternoon', <>Section loss <b>over 25%</b><br />→ immediate structural review</>, <Meter delay={0.8} />, false, 0.2)}
          <motion.div {...show(true, 0.9)} style={{ alignSelf: 'center', fontSize: 64, fontWeight: 700, color: INK }}>+</motion.div>
          {card('The history', 'Lab 3 · from memory', <><span style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}><Portrait who="mercer" size={64} /> Mercer’s finding, Day 1:</span><b>~25% section loss</b> at the bearing plate edges</>, <Meter fill={25} red delay={1.2} />, true, 0.6)}
        </div>
        <motion.div {...show(call, 0.2)} style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
          <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden>
            <path d="M30 4 V48 M14 34 L30 52 L46 34" stroke="var(--teal)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <motion.div {...show(call, 0.5)} style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 26, padding: '24px 32px', borderRadius: 18, background: 'var(--panel-strong, #fff)', border: `3px solid ${TEAL}`, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
          <Portrait who="vance" size={88} />
          <div style={{ flex: 1 }}>
            <div style={{ ...cap, color: TEAL }}>The AI agent’s call, with Vance</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: INK, marginTop: 4 }}>Order an immediate structural review.</div>
            <div style={{ fontSize: 23, color: DIM, marginTop: 4 }}>
              <Rich text="Neither lab alone makes this call: the rule needs the history, the history needs the rule." />
            </div>
          </div>
        </motion.div>
      </Fill>
    </WidePanel>
  );
}
