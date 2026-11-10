import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './lab1/parts';
import { Rich } from '../Rich';
import { LineIcon, type IconName } from './icons';
import { useBuild } from './Lab3Opening';

/**
 * 3.5e · The three engineering disciplines (a colleague's review of the Lab 3 material, 10 Nov; her diagram): memory retains evidence,
 * context selects the model's input, the harness coordinates execution and recovery. Built up one part per Next (PAGE_STEPS):
 * the harness, then memory, then context, then the runtime with the loop that writes back. Context engineering is the page's one red thing.
 */

export interface DisciplinesProps {
  kicker: string;
  message: string;
  notebook?: string;
}

const W = 1380;
const H = 660;
const INK = 'var(--ink)';
const DIM = 'var(--ink-dim)';
const LINE = '#4a5a6a';
const RED = 'var(--red)';

const mono: CSSProperties = { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' };

/** a card's emphasis colour: the context card marks its words in Oracle Red (the page's one red thing), the others in teal */
const mark = (tone: 'white' | 'grey' | 'red', t: string) => (tone === 'red' ? t.replace(/\*\*([^*]+)\*\*/g, '!!$1!!') : t);

function Card({ x, y, w, h, show, tone, tag, title, ask, lines, failure, testId, icon, parts }: { x: number; y: number; w: number; h: number; show: boolean; tone: 'white' | 'grey' | 'red'; tag: string; title: string; ask?: string; lines: string[]; failure?: string; testId: string; icon: IconName; parts?: string[] }) {
  const bg = tone === 'grey' ? 'rgba(138,145,156,0.16)' : tone === 'red' ? 'rgba(199,70,52,0.07)' : 'var(--panel-strong)';
  const border = tone === 'red' ? RED : tone === 'grey' ? '#7b8794' : INK;
  return (
    <motion.div data-discipline={testId} data-shown={show} initial={false} animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', padding: '16px 18px', borderRadius: 10, background: bg, border: `2px solid ${border}`, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span data-discipline-icon={testId} style={{ flex: 'none', width: 58, height: 58, borderRadius: '50%', background: tone === 'red' ? 'rgba(199,70,52,0.12)' : 'rgba(27,138,156,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LineIcon name={icon} size={36} color={tone === 'red' ? RED : 'var(--teal)'} />
        </span>
        <div style={{ minWidth: 0 }}>
          <span style={{ ...mono, display: 'inline-block', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(127,127,127,0.5)', background: 'rgba(127,127,127,0.1)', color: DIM }}>{tag}</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: tone === 'red' ? RED : tone === 'grey' ? '#146f7f' : INK, lineHeight: 1.2, marginTop: 4 }}>{title}</div>
        </div>
      </div>

      {ask && <div style={{ fontSize: 18, fontWeight: 700, color: INK, lineHeight: 1.3 }}><Rich text={mark(tone, ask)} /></div>}
      <div style={{ fontSize: 16, color: INK, lineHeight: 1.45, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {lines.map((l) => (
          <span key={l}><Rich text={mark(tone, l)} /></span>
        ))}
      </div>
      {failure && (
        <div style={{ marginTop: 'auto', fontSize: 15.5, lineHeight: 1.4, color: DIM }}>
          <div style={{ ...mono, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LineIcon name="flag" size={16} color="#8a919c" /> Typical failure
          </div>
          <Rich text={mark(tone, failure)} />
        </div>
      )}
      {parts && (
        <div data-notebook-parts={testId} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
          <span style={{ ...mono, fontSize: 10.5, color: DIM }}>In the notebook</span>
          <span style={{ padding: '1px 10px', borderRadius: 11, background: '#1f2a33', color: '#fff', fontSize: 13, fontWeight: 700 }}>{parts.length > 1 ? 'Parts' : 'Part'} {parts.map((q) => q.replace('Part ', '')).join(' · ')}</span>
        </div>
      )}
    </motion.div>
  );
}

function Arrow({ show, d, label, lx, ly, dashed, testId }: { show: boolean; d: string; label: string; lx: number; ly: number; dashed?: boolean; testId: string }) {
  return (
    <motion.g data-arrow={testId} data-shown={show} initial={false} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
      <path d={d} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray={dashed ? '6 5' : undefined} markerEnd="url(#arrow-head)" />
      <text x={lx} y={ly} fill={DIM} fontSize={10.5} fontFamily="JetBrains Mono, monospace" letterSpacing="0.6">{label}</text>
    </motion.g>
  );
}

export function Disciplines({ kicker, message, notebook }: DisciplinesProps) {
  const L = useBuild();
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="disciplines" kickerColor="var(--teal)">
      <Fill max={1}>
        <div data-disciplines style={{ position: 'relative', width: W, height: H, margin: '0 auto', flex: 'none' }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, overflow: 'visible' }} aria-hidden="true">
            <defs>
              <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0 0L10 5L0 10z" fill={LINE} />
              </marker>
            </defs>
            <Arrow show={L >= 1} testId="read-write" d="M210 216 V282" label="READ / WRITE" lx={222} ly={254} />
            <Arrow show={L >= 2} testId="assemble" d="M710 216 V282" label="ASSEMBLE" lx={722} ly={254} />
            <Arrow show={L >= 3} testId="run-loop" d="M1190 216 V346" label="RUN LOOP" lx={1202} ly={286} />
            <Arrow show={L >= 2} testId="retrieve" d="M420 440 H500" label="RETRIEVE" lx={428} ly={428} />
            <Arrow show={L >= 3} testId="model-input" d="M920 446 H1010" label="MODEL INPUT" lx={925} ly={434} />
            <Arrow show={L >= 3} testId="write-policy" dashed d="M1190 544 V640 H210 V618" label="WRITE POLICY" lx={640} ly={632} />
          </svg>
          <Card testId="harness" show tone="white" x={0} y={0} w={W} h={216} icon="loop" parts={['Part 6']} tag="Orchestration" title="Harness engineering" ask="What makes the process **execute and recover** reliably?" lines={['**Model/tool loop** · read/write triggers · **permissions** · **checkpoints** · **retries** · budgets · validation · observability']} failure="**Retrieval skipped** · **write lost** · tool action repeated · task declared complete prematurely" />
          <Card testId="memory" show={L >= 1} tone="grey" x={0} y={284} w={420} h={332} icon="database" parts={['Part 3', 'Part 5', 'Part 6']} tag="Retained state" title="Memory engineering" ask="What should **persist**, and how should it **change**?" lines={['**Representation** · **provenance** (source and history)', '**Storage** · indexing · **scope** · consolidation', '**Versioning** · **correction** · retention · deletion']} failure="A preference is **lost**, incorrectly extracted, stale, or **attributed to the wrong person**." />
          <Card testId="context" show={L >= 2} tone="red" x={500} y={284} w={420} h={332} icon="funnel" parts={['Part 4', 'Part 5', 'Part 6']} tag="Current input" title="Context engineering" ask="What information is **needed for this inference**?" lines={['**Query construction** · **retrieval** · **filtering**', '**Ranking** · deduplication · **compression**', '**Evidence expansion** · **token allocation**']} failure="The right fact exists but is **absent**, **buried**, or stripped of an essential qualifier." />
          <Card testId="runtime" show={L >= 3} tone="white" x={1010} y={348} w={370} h={196} icon="nodes" tag="Runtime" title="Model + tools" lines={['**Reason** · call tools', 'Return **results** to the loop']} />
        </div>
      </Fill>
    </WidePanel>
  );
}
