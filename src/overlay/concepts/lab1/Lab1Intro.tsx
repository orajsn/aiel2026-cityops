import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { LineIcon } from '../icons';
import type { IconName } from '../icons';
import { EASE, WidePanel } from '../WidePanel';

/**
 * Lab 1 · AI Economics, the opening and Part 1 (storyboard, 28 Oct): flat illustrated people and
 * drawings, teal and grey only, one idea per page.
 *   L1Opening   1.0  the assistant, its three jobs, two controls, and the engineer who decides
 *   L1Damage    1.1  what the inspection found, and who needs the information
 *   L1Scattered 1.2  the four sources in four systems, and the question
 */

const GREY = 'var(--ink-dim)';
const MONO = 'JetBrains Mono, monospace';
const TEAL_TINT = 'rgba(27, 138, 156, 0.12)';
const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const CONCRETE = '#9aa3ad';
const CONCRETE_DK = '#6f7a86';
const REBAR = '#8a6a4f';
const SKIN = '#c98e6b';

const label = { fontSize: 15, fontWeight: 700, letterSpacing: 2.4, color: GREY, textTransform: 'uppercase' as const, marginBottom: 10 };
const cardBase = { borderRadius: 14, border: '2px solid var(--line)', background: 'rgba(127, 127, 127, 0.08)' } as const;

export interface Lab1IntroProps {
  kicker: string;
  /** the headline; the panel draws it, so the body does not repeat it */
  message: string;
  notebook?: string;
}

/* ---------- people: flat, filled, never stick figures ---------- */

type Role = 'pm' | 'engineer';

/** a project manager (clipboard, grey hat) or the engineer (teal hat and vest, optional check mark) */
function Person({ role, size = 130, check = false, delay = 0 }: { role: Role; size?: number; check?: boolean; delay?: number }) {
  const pm = role === 'pm';
  const shirt = pm ? '#6f7f93' : '#4b5563';
  const hat = pm ? '#aab2bd' : 'var(--teal)';
  const hair = pm ? '#2b2f36' : '#7a4b32';
  return (
    <motion.svg data-person={role} width={size} height={size * 1.36} viewBox="0 0 110 150" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }}>
      <ellipse cx="50" cy="145" rx="38" ry="4" fill="rgba(127,127,127,0.2)" />
      {/* legs */}
      <rect x="33" y="100" width="15" height="42" rx="5" fill={G_DARK} />
      <rect x="52" y="100" width="15" height="42" rx="5" fill={G_DARK} />
      {/* body and arms */}
      <path d="M22 106V72c0-14 11-22 28-22s28 8 28 22v34z" fill={shirt} />
      {!pm && <path d="M32 106V62l18 14 18-14v44z" fill="var(--teal)" opacity={0.9} />}
      {!pm && <rect x="32" y="90" width="36" height="5" fill="rgba(255,255,255,0.75)" />}
      {pm && <path d="M42 52l8 14 8-14z" fill="rgba(255,255,255,0.8)" />}
      <rect x="12" y="62" width="14" height="38" rx="7" fill={shirt} />
      <rect x="74" y="62" width="14" height="38" rx="7" fill={shirt} />
      <circle cx="19" cy="102" r="7" fill={SKIN} />
      <circle cx="81" cy="102" r="7" fill={SKIN} />
      {/* head: neck, ears, face, hair, hard hat */}
      <rect x="43" y="40" width="14" height="14" rx="5" fill={SKIN} />
      <circle cx="34" cy="32" r="4" fill={SKIN} />
      <circle cx="66" cy="32" r="4" fill={SKIN} />
      <circle cx="50" cy="30" r="16" fill={SKIN} />
      <path d="M34 28c0-6 4-8 6-8l-1 8zM66 28c0-6-4-8-6-8l1 8z" fill={hair} />
      <path d="M33 22a17 15 0 0 1 34 0z" fill={hat} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      <rect x="29" y="20" width="42" height="6" rx="3" fill={hat} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      <rect x="46.5" y="8" width="7" height="10" rx="3" fill="rgba(255,255,255,0.45)" />
      <g stroke="var(--ink)" strokeLinecap="round" fill="none" strokeWidth={2.2}>
        <path d="M43 31v3M57 31v3" />
        <path d="M45 39q5 4 10 0" strokeWidth={1.8} />
      </g>
      {pm && (
        <g transform="rotate(-8 66 90)">
          <rect x="52" y="68" width="34" height="42" rx="4" fill={G_LIGHT} stroke={G_DARK} strokeWidth={2} />
          <rect x="62" y="64" width="14" height="8" rx="3" fill="var(--teal)" />
          <path d="M58 82h22M58 90h22M58 98h14" stroke={G_DARK} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx="54" cy="104" r="7" fill={SKIN} />
        </g>
      )}
      {check && (
        <g data-check>
          <circle cx="92" cy="40" r="15" fill="var(--teal)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
          <path d="M84 40l6 6 11-12" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </motion.svg>
  );
}

function Arrow({ w = 120, delay = 0 }: { w?: number; delay?: number }) {
  return (
    <svg width={w} height={26} viewBox={`0 0 ${w} 26`} fill="none" stroke="var(--teal)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <path d={`M3 13H${w - 8}`} strokeDasharray="2 9" />
      <path d={`M${w - 18} 4l12 9-12 9`} />
      <motion.circle cx={8} cy={13} r={5} fill="var(--teal)" stroke="none" initial={{ cx: 8, opacity: 0 }} animate={{ cx: w - 22, opacity: [0, 1, 1, 0] }} transition={{ delay, duration: 1.1, ease: EASE }} />
    </svg>
  );
}

/* ---------- 1.0 the opening ---------- */

function Art({ children, w = 96, h = 72 }: { children: ReactNode; w?: number; h?: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 96 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/** search the specifications: a document with a magnifier */
function SpecsArt() {
  return (
    <Art>
      <rect x="14" y="6" width="44" height="58" rx="5" fill={G_LIGHT} stroke={G_DARK} strokeWidth={2.5} />
      <path d="M22 18h28M22 27h28M22 36h18" stroke={G_DARK} strokeWidth={3} />
      <rect x="22" y="43" width="26" height="6" rx="2" fill="rgba(27,138,156,0.45)" />
      <circle cx="60" cy="44" r="14" fill="rgba(27,138,156,0.18)" stroke="var(--teal)" strokeWidth={4} />
      <path d="M70 55l14 12" stroke="var(--teal)" strokeWidth={6} />
    </Art>
  );
}

/** contractors and materials: a stack of materials and a checked list */
function ContractorsArt() {
  return (
    <Art>
      <rect x="6" y="46" width="30" height="16" rx="2" fill={G_MID} stroke={G_DARK} strokeWidth={2} />
      <rect x="10" y="30" width="30" height="16" rx="2" fill={CONCRETE} stroke={G_DARK} strokeWidth={2} />
      <rect x="2" y="14" width="30" height="16" rx="2" fill={G_MID} stroke={G_DARK} strokeWidth={2} />
      <rect x="50" y="8" width="40" height="54" rx="5" fill={G_LIGHT} stroke={G_DARK} strokeWidth={2.5} />
      <rect x="62" y="4" width="16" height="8" rx="3" fill="var(--teal)" />
      {[22, 34, 46].map((y) => (
        <g key={y}>
          <path d={`M56 ${y}l3 3 6-7`} stroke="var(--teal)" strokeWidth={3} />
          <path d={`M69 ${y}h15`} stroke={G_DARK} strokeWidth={3} />
        </g>
      ))}
    </Art>
  );
}

/** summarise site photos: a photo of the bridge with a summary line under it */
function PhotoArt() {
  return (
    <Art>
      <rect x="6" y="4" width="62" height="46" rx="5" fill="rgba(27,138,156,0.16)" stroke={G_DARK} strokeWidth={2.5} />
      <path d="M10 38h54" stroke={G_DARK} strokeWidth={3} />
      <path d="M14 38c6-16 14-16 20 0M34 38c6-16 14-16 20 0" stroke="var(--teal)" strokeWidth={3} />
      <circle cx="54" cy="16" r="5" fill={G_MID} />
      <rect x="40" y="38" width="50" height="30" rx="4" fill={G_LIGHT} stroke={G_DARK} strokeWidth={2} />
      <path d="M46 48h38M46 56h38M46 63h22" stroke={G_DARK} strokeWidth={2.6} />
    </Art>
  );
}

/** choose the right model for each job: two models, a switch picking one */
function ModelsArt() {
  return (
    <Art>
      <rect x="4" y="30" width="28" height="22" rx="5" fill={G_LIGHT} stroke={G_DARK} strokeWidth={2.5} />
      <rect x="40" y="6" width="50" height="46" rx="6" fill="rgba(27,138,156,0.22)" stroke="var(--teal)" strokeWidth={3} />
      <circle cx="56" cy="22" r="4" fill="var(--teal)" />
      <circle cx="74" cy="22" r="4" fill="var(--teal)" />
      <circle cx="65" cy="40" r="4" fill="var(--teal)" />
      <path d="M56 22l18 0M56 22l9 18M74 22l-9 18" stroke="var(--teal)" strokeWidth={2} />
      <path d="M18 62h60" stroke={G_DARK} strokeWidth={3} />
      <circle cx="62" cy="62" r="6" fill="var(--teal)" />
    </Art>
  );
}

/** guardrails: a shield with a tick */
function GuardArt() {
  return (
    <Art>
      <path d="M48 4l32 10v22c0 18-14 28-32 34-18-6-32-16-32-34V14z" fill="rgba(27,138,156,0.2)" stroke="var(--teal)" strokeWidth={3.5} />
      <path d="M33 38l11 11 21-24" stroke="var(--teal)" strokeWidth={6} />
    </Art>
  );
}

const JOBS: { key: string; text: string; art: ReactNode }[] = [
  { key: 'search', text: 'Search the specifications', art: <SpecsArt /> },
  { key: 'check', text: 'Check contractors and materials', art: <ContractorsArt /> },
  { key: 'summarise', text: 'Summarise site photos', art: <PhotoArt /> },
];
const CONTROLS: { key: string; text: string; art: ReactNode }[] = [
  { key: 'model', text: 'Choose the right model for each job', art: <ModelsArt /> },
  { key: 'guardrails', text: 'Guardrails against unsafe instructions', art: <GuardArt /> },
];
const HANDS_ON = ['Unstructured RAG', 'Semantic Store + NL2SQL', 'The assistant app', 'Model routing', 'Guardrails'];

function ArtCard({ attr, index, text, art, delay, tinted }: { attr: 'data-job' | 'data-control'; index: string; text: string; art: ReactNode; delay: number; tinted?: boolean }) {
  const hook = { [attr]: index };
  return (
    <motion.div {...hook} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }} style={{ ...cardBase, flex: 1, minWidth: 0, padding: '12px 14px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, borderColor: tinted ? 'var(--teal)' : 'var(--line)', background: tinted ? TEAL_TINT : cardBase.background }}>
      {art}
      <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.25, color: 'var(--ink)' }}>{text}</div>
    </motion.div>
  );
}

/** 1.0 · Today's assistant: three jobs, two controls, the engineer decides, the five hands-on exercises */
export function L1Opening({ kicker, message, notebook }: Lab1IntroProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-opening">
      <div style={{ marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 28 }}>
          <div>
            <div style={label}>Today’s assistant · three jobs</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {JOBS.map((j, i) => (
                <ArtCard key={j.key} attr="data-job" index={j.key} text={j.text} art={j.art} delay={0.3 + i * 0.5} />
              ))}
            </div>
          </div>
          <div>
            <div style={label}>Two controls</div>
            <div style={{ display: 'flex', gap: 14 }}>
              {CONTROLS.map((c, i) => (
                <ArtCard key={c.key} attr="data-control" index={c.key} text={c.text} art={c.art} delay={2 + i * 0.5} tinted />
              ))}
            </div>
          </div>
        </div>

        {/* a clear separate band: the person decides */}
        <motion.div data-engineer initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2, duration: 0.6, ease: EASE }} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 24, padding: '8px 28px', borderRadius: 16, border: '2.5px dashed var(--teal)', background: TEAL_TINT }}>
          <Person role="engineer" size={76} check delay={3.4} />
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>The engineer evaluates and decides on safety.</div>
        </motion.div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'stretch', gap: 10 }}>
          {HANDS_ON.map((h, i) => (
            <motion.div key={h} data-hands-on={i + 1} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.8 + i * 0.12, duration: 0.45, ease: EASE }} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--line)', background: 'rgba(127, 127, 127, 0.08)' }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{i + 1}</span>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.2, color: GREY }}>Hands-on {i + 1}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{h}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </WidePanel>
  );
}

/* ---------- 1.1 the damage ---------- */

/** a concrete slab seen from the front */
function Slab({ children }: { children: ReactNode }) {
  return (
    <svg width="300" height="190" viewBox="0 0 300 190" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="10" width="280" height="160" rx="8" fill={CONCRETE} stroke={CONCRETE_DK} strokeWidth={3} />
      <path d="M10 62h280M10 114h280" stroke={CONCRETE_DK} strokeWidth={1.5} opacity={0.55} />
      <ellipse cx="150" cy="182" rx="130" ry="5" fill="rgba(127,127,127,0.2)" />
      {children}
    </svg>
  );
}

function CracksArt() {
  return (
    <Slab>
      <motion.path d="M96 10l14 38-18 30 22 34-12 36" stroke="#3b4350" strokeWidth={5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 1, ease: EASE }} />
      <motion.path d="M110 48l34 12 20 28M114 100l-30 14" stroke="#3b4350" strokeWidth={3.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 0.8, ease: EASE }} />
      <motion.path d="M214 10l-12 30 20 24-10 30" stroke="#3b4350" strokeWidth={4} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 0.9, ease: EASE }} />
    </Slab>
  );
}

function SpallingArt() {
  return (
    <Slab>
      <motion.path d="M80 40l50-14 46 16 22 40-14 44-52 14-44-22-8-44z" fill="#4c5560" stroke="#3b4350" strokeWidth={3} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
      <path d="M96 64l28-12 30 10 12 24-10 22-34 8-24-14z" fill="#5d6772" />
      {[[216, 108, 14], [240, 140, 10], [196, 146, 9]].map(([x, y, s], i) => (
        <motion.path key={i} d={`M${x} ${y}l${s} -${s * 0.4} ${s * 0.5} ${s} -${s} ${s * 0.3}z`} fill={CONCRETE} stroke={CONCRETE_DK} strokeWidth={2} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 + i * 0.25, duration: 0.5, ease: EASE }} />
      ))}
    </Slab>
  );
}

function RebarArt() {
  return (
    <Slab>
      <path d="M70 44h112l34 24v62l-30 22H84l-26-24V70z" fill="#4c5560" stroke="#3b4350" strokeWidth={3} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
        {[64, 88, 112, 136].map((y) => (
          <g key={y}>
            <rect x="52" y={y} width="170" height="9" rx="4.5" fill={REBAR} stroke="#5f4833" strokeWidth={1.5} />
            <path d={`M70 ${y + 4}h130`} stroke="#b89572" strokeWidth={1.5} strokeDasharray="6 10" />
          </g>
        ))}
        {[88, 128, 168].map((x) => (
          <rect key={x} x={x} y="58" width="8" height="94" rx="4" fill={REBAR} stroke="#5f4833" strokeWidth={1.5} />
        ))}
      </motion.g>
    </Slab>
  );
}

const DAMAGE: { key: string; name: string; sub: string; art: ReactNode }[] = [
  { key: 'cracks', name: 'Cracks', sub: 'lines running through the concrete', art: <CracksArt /> },
  { key: 'spalling', name: 'Spalling concrete', sub: 'concrete breaking away', art: <SpallingArt /> },
  { key: 'rebar', name: 'Exposed reinforcing steel', sub: 'rusty rebar showing', art: <RebarArt /> },
];

/** 1.1 · The inspection found damage; the project manager must prepare the information for the engineer */
export function L1Damage({ kicker, message, notebook }: Lab1IntroProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-damage">
      <div style={{ marginTop: 6, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
        <div style={label}>The inspection found</div>
        <div style={{ display: 'flex', gap: 22 }}>
          {DAMAGE.map((d, i) => (
            <motion.div key={d.key} data-damage={d.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.5, duration: 0.5, ease: EASE }} style={{ ...cardBase, flex: 1, minWidth: 0, padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {d.art}
              <div style={{ fontSize: 25, fontWeight: 700, color: 'var(--ink)', marginTop: 6, textAlign: 'center' }}>{d.name}</div>
              <div style={{ fontSize: 19, color: GREY, textAlign: 'center' }}>{d.sub}</div>
            </motion.div>
          ))}
        </div>

        <motion.div data-handover initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3, duration: 0.6, ease: EASE }} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 22, padding: '8px 28px', borderRadius: 16, border: '2px solid var(--teal)', background: TEAL_TINT }}>
          <div data-who="project manager" style={{ textAlign: 'center', flex: 'none' }}>
            <Person role="pm" size={74} delay={2.5} />
            <div style={{ fontSize: 16, fontWeight: 700, color: GREY, marginTop: -4 }}>project manager</div>
          </div>
          <Arrow w={110} delay={3} />
          <div data-who="engineer" style={{ textAlign: 'center', flex: 'none' }}>
            <Person role="engineer" size={74} delay={2.7} />
            <div style={{ fontSize: 16, fontWeight: 700, color: GREY, marginTop: -4 }}>engineer</div>
          </div>
          <div style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.3, color: 'var(--ink)', marginLeft: 12 }}>Prepare the information for the engineer to assess and plan the repair.</div>
        </motion.div>
      </div>
    </WidePanel>
  );
}

/* ---------- 1.2 the data is scattered ---------- */

const SOURCES: { key: string; name: string; kind: string; icon: IconName; x: number; y: number }[] = [
  { key: 'report', name: 'Inspection report', kind: 'PDF', icon: 'prompt', x: 40, y: 34 },
  { key: 'drawings', name: 'Bridge drawings', kind: 'pictures', icon: 'photo', x: 360, y: 84 },
  { key: 'history', name: 'Repair history', kind: 'database', icon: 'database', x: 800, y: 28 },
  { key: 'contractors', name: 'Contractor data', kind: 'database', icon: 'database', x: 1090, y: 94 },
];
const BOX_W = 270;
const BOX_H = 150;
const MGR = { x: 700, y: 318 };

/** 1.2 · Four sources in four systems; the project manager asks whether one question could gather them */
export function L1Scattered({ kicker, message, notebook }: Lab1IntroProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-scattered">
      <div style={{ position: 'relative', width: 1400, height: 490, marginTop: 6, borderTop: '1px solid var(--line)' }}>
        {/* dashed lines reach for the manager and fall short */}
        <svg width="1400" height="490" viewBox="0 0 1400 490" fill="none" style={{ position: 'absolute', inset: 0 }}>
          {SOURCES.map((s, i) => {
            const x0 = s.x + BOX_W / 2;
            const y0 = s.y + BOX_H;
            return (
              <motion.path key={s.key} data-reach={s.key} d={`M${x0} ${y0 + 4}C${x0} ${y0 + 90} ${MGR.x} ${MGR.y - 100} ${MGR.x} ${MGR.y - 6}`} stroke="var(--teal)" strokeWidth={3} strokeLinecap="round" strokeDasharray="3 12" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 0.7, 0.45], opacity: [0, 0.9, 0.5] }} transition={{ delay: 2.6 + i * 0.25, duration: 1.6, ease: EASE }} />
            );
          })}
        </svg>

        {SOURCES.map((s, i) => (
          <motion.div key={s.key} data-source={s.key} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.5, duration: 0.55, ease: EASE }} style={{ position: 'absolute', left: s.x, top: s.y, width: BOX_W, height: BOX_H, boxSizing: 'border-box', borderRadius: 14, border: '2.5px solid var(--line)', background: 'rgba(127, 127, 127, 0.08)', padding: '10px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: -24, left: 4, fontSize: 14, fontWeight: 700, letterSpacing: 1.6, color: GREY }}>SYSTEM {i + 1}</div>
            <LineIcon name={s.icon} size={56} />
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>{s.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 17, color: 'var(--teal)' }}>({s.kind})</div>
          </motion.div>
        ))}

        <div style={{ position: 'absolute', left: MGR.x - 55, top: MGR.y, width: 110 }}>
          <Person role="pm" size={110} delay={2.2} />
        </div>

        <motion.div data-question initial={{ opacity: 0, scale: 0.94, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 4.2, duration: 0.6, ease: EASE }} style={{ position: 'absolute', left: MGR.x + 90, top: MGR.y + 30, width: 520, padding: '14px 22px', borderRadius: 20, border: '2.5px solid var(--teal)', background: TEAL_TINT, fontSize: 28, fontWeight: 700, lineHeight: 1.3, color: 'var(--ink)' }}>
          <span style={{ position: 'absolute', left: -14, top: 44, width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderRight: '16px solid var(--teal)' }} />
          What if one question could gather all of this?
        </motion.div>
      </div>
    </WidePanel>
  );
}
