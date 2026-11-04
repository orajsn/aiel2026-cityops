import type { ReactNode } from 'react';

/**
 * Page 2.7's picture (owner's colleague, 4 Nov: "put a round graph picture"): the agent as a state graph, drawn as a flowchart
 * that follows the page's steps. START and END are always there; the part the step explains is at full strength, what was
 * explained before is medium, what comes later is faint. The diamond (the decision) is the one amber element, as in the owner's picture.
 * Steps: 1 model (think), 2 tools (act), 3 tool? (the decision, yes, no, the check note, END), 4 back to think; the last step lights all.
 */
const TEAL = '#1B8A9C';
const AMBER = '#B8741A';
const BOX = '#dde2e8';
const EDGE = '#8a919c';
const INK = '#2a3540';
const PAPER = '#f4f6f8';
const SANS = 'Inter, sans-serif';

/** how strongly a part shows at `step`; a part is introduced at step `n` (the last step, 5, lights everything) */
export const graphState = (step: number, n: number): 'now' | 'done' | 'later' => (step >= 5 || step === n ? 'now' : step > n ? 'done' : 'later');
const OPACITY = { now: 1, done: 0.65, later: 0.25 } as const;

function Part({ n, step, name, children }: { n: number; step: number; name: string; children: ReactNode }) {
  const s = graphState(step, n);
  return (
    <g data-node={name} data-state={s} style={{ opacity: OPACITY[s], transition: 'opacity 0.4s' }}>
      {children}
    </g>
  );
}

const Disc = ({ cx, cy, n }: { cx: number; cy: number; n: number }) => (
  <g>
    <circle cx={cx} cy={cy} r={10} fill="#fff" stroke={TEAL} strokeWidth={2} />
    <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEAL} fontFamily={SANS}>{n}</text>
  </g>
);

export function StateGraphArt({ step }: { step: number }) {
  const line = { stroke: TEAL, strokeWidth: 3, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg data-art="nb-state-graph" data-step={step} width="100%" height="100%" viewBox="0 0 420 480" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <defs>
        <marker id="sg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill={TEAL} />
        </marker>
      </defs>
      <rect x="0" y="0" width="420" height="480" rx="22" fill={PAPER} />

      {/* START and END are always there */}
      <g data-node="START">
        <rect x="22" y="24" width="82" height="32" rx="16" fill={BOX} stroke={EDGE} strokeWidth={2} />
        <text x="63" y="45" textAnchor="middle" fontSize={15} fontWeight={700} fill={INK} fontFamily={SANS}>START</text>
      </g>
      <g data-node="END">
        <rect x="150" y="392" width="90" height="32" rx="16" fill={BOX} stroke={EDGE} strokeWidth={2} />
        <text x="195" y="413" textAnchor="middle" fontSize={15} fontWeight={700} fill={INK} fontFamily={SANS}>END</text>
      </g>

      {/* 1 · model, think */}
      <Part n={1} step={step} name="model">
        <path d="M104 40H195V90" {...line} markerEnd="url(#sg-arrow)" />
        <rect x="115" y="92" width="160" height="52" rx="12" fill={BOX} stroke={EDGE} strokeWidth={2} />
        <Disc cx={137} cy={118} n={1} />
        <text x="155" y="124" fontSize={18} fontWeight={700} fill={INK} fontFamily={SANS}>model</text>
        <text x="222" y="124" fontSize={14} fill={INK} fontFamily={SANS}>think</text>
      </Part>

      {/* 2 · tools, act */}
      <Part n={2} step={step} name="tools">
        <rect x="318" y="200" width="96" height="54" rx="12" fill={BOX} stroke={EDGE} strokeWidth={2} />
        <Disc cx={338} cy={218} n={2} />
        <text x="354" y="224" fontSize={18} fontWeight={700} fill={INK} fontFamily={SANS}>tools</text>
        <text x="366" y="244" textAnchor="middle" fontSize={14} fill={INK} fontFamily={SANS}>act</text>
      </Part>

      {/* 3 · the decision, yes, no, the check note */}
      <Part n={3} step={step} name="tool?">
        <path d="M195 144V180" {...line} markerEnd="url(#sg-arrow)" />
        <path d="M105 228H135" stroke={EDGE} strokeWidth={2} strokeDasharray="5 4" fill="none" />
        <rect x="4" y="200" width="102" height="58" rx="10" fill="none" stroke={EDGE} strokeWidth={2} strokeDasharray="5 4" />
        <text x="55" y="222" textAnchor="middle" fontSize={12} fill={INK} fontFamily={SANS}>enforce step:</text>
        <text x="55" y="238" textAnchor="middle" fontSize={12} fill={INK} fontFamily={SANS}>remember</text>
        <text x="55" y="252" textAnchor="middle" fontSize={12} fill={INK} fontFamily={SANS}>called?</text>
        <path d="M195 182L255 228L195 274L135 228Z" fill="#fbf3e3" stroke={AMBER} strokeWidth={3} strokeLinejoin="round" />
        <Disc cx={195} cy={212} n={3} />
        <text x="195" y="245" textAnchor="middle" fontSize={16} fontWeight={700} fill={INK} fontFamily={SANS}>tool?</text>
        <path d="M255 228H316" {...line} markerEnd="url(#sg-arrow)" />
        <text data-label="yes" x="285" y="218" textAnchor="middle" fontSize={14} fontWeight={700} fill={TEAL} fontFamily={SANS}>yes</text>
        <path d="M195 274V390" {...line} markerEnd="url(#sg-arrow)" />
        <text data-label="no" x="210" y="336" fontSize={14} fontWeight={700} fill={TEAL} fontFamily={SANS}>no</text>
      </Part>

      {/* 4 · back to think */}
      <Part n={4} step={step} name="back">
        <path d="M366 200V118H277" {...line} markerEnd="url(#sg-arrow)" />
        <rect x="270" y="148" width="86" height="40" rx="8" fill="#fff" stroke={EDGE} strokeWidth={1.5} />
        <text x="313" y="165" textAnchor="middle" fontSize={13} fontWeight={700} fill={TEAL} fontFamily={SANS}>4 back</text>
        <text x="313" y="181" textAnchor="middle" fontSize={13} fill={INK} fontFamily={SANS}>to think</text>
      </Part>
    </svg>
  );
}
