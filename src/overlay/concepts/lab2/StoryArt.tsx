import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Fill, FitBox } from '../Fill';
import { CARD, DIM, INK, Portrait, RED, TEAL, TEAL_D, TINT, cap } from './parts';

/**
 * 0.4 · A crack at Harbor Bridge and 0.4a · What proves it? (owner, 29 Oct: "follow how 3.2 to 3.4 build their
 * flow"). 0.4 is Mercer's field report: the bridge is drawn, a pin drops on the south side, a magnifier opens on the
 * weld seam and the crack draws itself (the page's one red thing); Mercer's note, the two numbers and the two
 * all-clears follow. 0.4a is Vance's question: five kinds of evidence, each drawn, travel one after another into
 * one incident brief, which fills line by line.
 */

const T = 'var(--teal)';
const G = '#8a97a3';
const STEEL = '#9aa4ae';
const STEEL_D = '#7f8a95';

/* ---------------- 0.4 · the field report ---------------- */

const PIN = { x: 742, y: 214 };
const ZOOM = { x: 600, y: 430, r: 128 };

function BridgeWithZoom() {
  return (
    <FitBox w={900} h={570} max={1.2}>
      <svg width={900} height={570} viewBox="0 0 900 570" aria-label="Harbor Bridge, the crack on the south side" role="img" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <clipPath id="zoom-clip">
            <circle cx={ZOOM.x} cy={ZOOM.y} r={ZOOM.r - 4} />
          </clipPath>
        </defs>
        {/* the bridge draws in: water, piers, deck, arch, hangers */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <path d="M0 350h900" stroke="rgba(27,138,156,0.35)" strokeWidth={3} strokeDasharray="16 12" />
          {[160, 450, 742].map((x) => <rect key={x} x={x - 16} y={222} width={32} height={128} rx={3} fill={STEEL_D} />)}
          <rect x={20} y={204} width={860} height={18} rx={4} fill={STEEL} />
          <path d="M60 204C230 40 670 40 840 204" fill="none" stroke={STEEL} strokeWidth={10} strokeLinecap="round" />
          {[150, 230, 310, 390, 450, 510, 590, 670, 750].map((x) => {
            const t = (x - 60) / 780;
            const y = 204 - Math.sin(t * Math.PI) * 132;
            return <path key={x} d={`M${x} ${y}V204`} stroke={STEEL} strokeWidth={3} />;
          })}
          <text x={40} y={386} fontSize={20} fill={G} fontFamily="Inter, sans-serif">north</text>
          <text x={860} y={386} fontSize={20} fill={G} textAnchor="end" fontFamily="Inter, sans-serif">south</text>
        </motion.g>
        {/* the pin on the south bearing */}
        <motion.g initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.5, ease: EASE }}>
          <path d={`M${PIN.x} ${PIN.y}c-16-20-22-30-22-42a22 22 0 0 1 44 0c0 12-6 22-22 42z`} fill={TEAL} />
          <circle cx={PIN.x} cy={PIN.y - 42} r={8} fill="#fff" />
        </motion.g>
        {/* the magnifier opens below: two lines from the pin, then the close-up */}
        <motion.path d={`M${PIN.x - 8} ${PIN.y + 10}L${ZOOM.x + 70} ${ZOOM.y - ZOOM.r + 22}M${PIN.x + 8} ${PIN.y + 10}L${ZOOM.x + ZOOM.r - 6} ${ZOOM.y - 30}`} stroke={T} strokeWidth={2.4} strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.4, duration: 0.5 }} />
        <motion.g initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, duration: 0.6, ease: EASE }} style={{ originX: 0.5, originY: 0.5 }}>
          <circle cx={ZOOM.x} cy={ZOOM.y} r={ZOOM.r} fill={CARD} stroke={T} strokeWidth={5} />
          <g clipPath="url(#zoom-clip)">
            {/* girder above, weld seam, bearing plate below */}
            <rect x={ZOOM.x - 140} y={ZOOM.y - 110} width={280} height={86} fill="#b8c0c8" />
            <rect x={ZOOM.x - 140} y={ZOOM.y - 24} width={280} height={14} fill={STEEL_D} />
            <rect x={ZOOM.x - 100} y={ZOOM.y - 10} width={200} height={110} fill={STEEL} />
            <motion.path d={`M${ZOOM.x - 60} ${ZOOM.y - 17}l14-5 12 6 12-6 10 5 14-5 12 6 14-5 12 4`} fill="none" stroke={RED} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.2, duration: 1.1, ease: EASE }} />
            {/* a length mark under the crack */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2, duration: 0.4 }}>
              <path d={`M${ZOOM.x - 60} ${ZOOM.y + 30}h120M${ZOOM.x - 60} ${ZOOM.y + 22}v16M${ZOOM.x + 60} ${ZOOM.y + 22}v16`} stroke="#fff" strokeWidth={3} />
            </motion.g>
          </g>
        </motion.g>
        <motion.text x={ZOOM.x} y={ZOOM.y + ZOOM.r + 34} textAnchor="middle" fontSize={22} fill={DIM} fontFamily="Inter, sans-serif" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.4 }}>
          weld seam · girder to bearing plate
        </motion.text>
      </svg>
    </FitBox>
  );
}

function Clear({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.45, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 600, color: INK }}>
      <svg width={32} height={32} viewBox="0 0 34 34" aria-hidden style={{ flex: 'none' }}>
        <circle cx="17" cy="17" r="16" fill={T} />
        <path d="M9.5 17.5l5 5 10-11" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </motion.div>
  );
}

function Big({ n, label, delay }: { n: string; label: string; delay: number }) {
  return (
    <motion.div data-fact={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: EASE }} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 72, fontWeight: 700, color: INK, lineHeight: 1.25 }}>{n}</span>
        <span style={{ fontSize: 28, color: DIM }}>mm</span>
      </div>
      <span style={{ fontSize: 21, color: DIM }}>{label}</span>
    </motion.div>
  );
}

export function CrackReport() {
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)', gap: 30 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 420 }}>
          <BridgeWithZoom />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22, paddingLeft: 26, borderLeft: '1px solid var(--line)', minWidth: 0 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Portrait who="mercer" size={120} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>Mercer</div>
              <div style={{ fontSize: 22, color: DIM }}>senior inspector, reports the crack</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.5, ease: EASE }} style={{ position: 'relative', fontSize: 25, lineHeight: 1.4, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 16, padding: '16px 20px' }}>
            “Hairline crack on the <b style={{ color: '#7fd3df' }}>south side</b>, at the <b style={{ color: '#7fd3df' }}>weld seam</b> between girder and bearing plate.”
            <span style={{ position: 'absolute', left: 40, top: -12, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '12px solid rgba(31,42,51,0.92)' }} />
          </motion.div>
          <div style={{ display: 'flex', gap: 40 }}>
            <Big n="0.12" label="reported crack width" delay={2.6} />
            <Big n="85" label="reported crack length" delay={3.0} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Clear delay={3.5}>No visible movement</Clear>
            <Clear delay={3.8}>No lane closure</Clear>
          </div>
        </div>
      </div>
    </Fill>
  );
}

/* ---------------- 0.4a · five kinds of evidence, one brief ---------------- */

const ART: Record<string, ReactNode> = {
  'Asset record': (
    <g>
      <rect x="8" y="16" width="64" height="46" rx="6" fill={TINT} stroke={T} strokeWidth={3} />
      <circle cx="26" cy="36" r="8" fill="none" stroke={T} strokeWidth={3} />
      <path d="M14 54c2-7 7-10 12-10s10 3 12 10M44 32h20M44 42h14" stroke={T} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  ),
  Specifications: (
    <g>
      <path d="M16 8h36l14 14v50H16z" fill={TINT} stroke={T} strokeWidth={3} strokeLinejoin="round" />
      <path d="M52 8v14h14" fill="none" stroke={T} strokeWidth={3} strokeLinejoin="round" />
      <path d="M24 44h34M24 40v8M58 40v8" stroke={T} strokeWidth={2.6} />
      <path d="M24 30h18M24 58h28" stroke={G} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  'Connected assets': (
    <g>
      <path d="M40 40L14 18M40 40L68 20M40 40L16 64M40 40L66 62" stroke={T} strokeWidth={2.6} />
      <circle cx="40" cy="40" r="11" fill={T} />
      {[[14, 18], [68, 20], [16, 64], [66, 62]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill={TINT} stroke={T} strokeWidth={2.6} />)}
    </g>
  ),
  History: (
    <g>
      {[0, 1, 2].map((i) => <rect key={i} x={12 + i * 6} y={10 + i * 10} width="48" height="40" rx="4" fill={i === 2 ? TINT : CARD} stroke={i === 2 ? T : G} strokeWidth={2.6} />)}
      <path d="M32 40h28M32 50h20M32 60h24" stroke={T} strokeWidth={2.6} strokeLinecap="round" />
    </g>
  ),
  Memory: (
    <g>
      <path d="M40 18c-8-6-18-8-30-7v50c12-1 22 1 30 7 8-6 18-8 30-7V11c-12-1-22 1-30 7z" fill={TINT} stroke={T} strokeWidth={3} strokeLinejoin="round" />
      <path d="M40 18v50" stroke={T} strokeWidth={2.6} />
      <path d="M54 12v20l5-4 5 4V12" fill={T} />
    </g>
  ),
};

/** each kind in plain words: the question it answers */
const PLAIN: Record<string, string> = {
  'Asset record': 'what the bridge is, and how critical',
  Specifications: 'what it was built to carry',
  'Connected assets': 'what depends on it, what it depends on',
  History: 'what happened to it before',
  Memory: 'what we learned last time',
};

/** when the n-th kind of evidence lands in the brief */
const landAt = (i: number) => 1.6 + i * 0.7;

export function WhatProves({ kinds }: { kinds: string[] }) {
  return (
    <Fill>
      <div data-evidence style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '290px minmax(0, 1fr) 70px 400px', gap: 22, alignItems: 'stretch', minHeight: 560 }}>
        {/* Vance asks; Mercer's report is the starting point */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <Portrait who="vance" size={150} />
          <div style={{ fontSize: 28, fontWeight: 700, color: INK }}>Vance asks</div>
          <div style={{ fontSize: 24, lineHeight: 1.4, padding: '14px 18px', borderRadius: 16, background: 'rgba(31,42,51,0.92)', color: '#fff' }}>
            “What should operations do, and <b style={{ color: '#7fd3df' }}>what proves it?</b>”
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, fontSize: 20, color: DIM }}>
            <Portrait who="mercer" size={44} />
            after Mercer’s report
          </div>
        </motion.div>
        {/* the five kinds of evidence, each drawn */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' }}>
          <div style={{ ...cap, fontSize: 17 }}>Five kinds of evidence</div>
          {kinds.map((k, i) => (
            <motion.div key={k} data-kind={k} initial={{ opacity: 0, borderColor: 'rgba(127,127,127,0.3)' }} animate={{ opacity: 1, borderColor: ['rgba(127,127,127,0.3)', 'rgba(127,127,127,0.3)', 'rgba(27,138,156,1)'] }} transition={{ opacity: { delay: 0.6 + i * 0.18, duration: 0.45 }, borderColor: { delay: landAt(i) - 0.4, duration: 0.4, times: [0, 0.2, 1] } }} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '6px 18px', borderRadius: 14, border: '2px solid', background: CARD }}>
              <svg width={72} height={72} viewBox="0 0 80 80" aria-hidden style={{ flex: 'none' }}>
                {ART[k]}
              </svg>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{k}</div>
                <div style={{ fontSize: 21, color: DIM, lineHeight: 1.3 }}>{PLAIN[k]}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={60} height={30} viewBox="0 0 60 30" aria-hidden>
            <path d="M2 15h48" stroke={T} strokeWidth={3} strokeDasharray="5 6" />
            <path d="M42 6l10 9-10 9" stroke={T} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* the incident brief: a clipboard that fills line by line */}
        <motion.div data-brief initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.5 }} style={{ position: 'relative', marginTop: 18, borderRadius: 16, border: `3px solid ${TEAL}`, background: CARD, boxShadow: '0 8px 22px rgba(0,0,0,0.10)', padding: '40px 26px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ position: 'absolute', left: '50%', top: -16, transform: 'translateX(-50%)', width: 130, height: 32, borderRadius: 9, background: TEAL }} />
          <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>One incident brief</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: TEAL_D }}>Harbor Bridge · the crack</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            {kinds.map((k, i) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1.5px dashed rgba(127,127,127,0.3)', padding: '6px 0' }}>
                <span style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${G}`, flex: 'none', position: 'relative' }}>
                  <motion.svg initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: landAt(i), duration: 0.3 }} width={28} height={28} viewBox="0 0 28 28" style={{ position: 'absolute', left: -2, top: -2 }} aria-hidden>
                    <rect x="0" y="0" width="28" height="28" rx="6" fill={T} />
                    <path d="M7 14.5l5 5 9-10" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </span>
                <motion.span initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: landAt(i), duration: 0.3 }} style={{ fontSize: 23, color: INK }}>
                  {k}
                </motion.span>
              </div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: landAt(kinds.length), duration: 0.5 }} style={{ fontSize: 22, color: TEAL_D, fontWeight: 600 }}>
            before anyone recommends anything
          </motion.div>
        </motion.div>
      </div>
    </Fill>
  );
}
