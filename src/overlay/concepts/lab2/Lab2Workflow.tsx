import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import { Story, stepAt } from './Story';
import { Triage } from './everyday';
import { Fill, FitBox } from '../Fill';
import { InfoDesk, Junction, Recipe, Taxi, Tram, WorkOrder } from './workflowArt';
import {
  Arrow, ArrowDown, CARD, ChiefInspector, Chip, DIM, INK, L2Page, Net, Num, Portrait, Quote, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props,
} from './parts';

/**
 * Lab 2 · Workflow, the fixed checklist, and the Agent chapter, the chief inspector (the deck's chapters 5 and 6).
 */

function Swap({ k, children }: { k: string | number; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------- 2.4c, 2.4d · who holds the pen, the anatomy of a workflow ---------------- */

const PENS = [
  { name: 'RAG', like: 'an information desk', who: 'the application', sub: 'one lookup, one answer', art: <InfoDesk /> },
  { name: 'Workflow', like: 'a tram on its rails', who: 'the code', sub: '', art: <Tram />, ticks: ['Path fixed in advance', 'LLM only inside steps', 'Human sign-off (design option)', 'Replayable'] },
  { name: 'Agent', like: 'a taxi in the city', who: 'the model', sub: 'flexible, less predictable', art: <Taxi /> },
];
const PEN_AT = [0.3, 1.1, 1.9];

/** 2.4c · three ways to get somewhere: a desk, a tram, a taxi; the workflow's tram in the middle, its four promises after */
function WhoChooses() {
  return (
    <Fill>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr)', gap: 22, marginTop: 4 }}>
        {PENS.map((c, i) => {
          const mid = i === 1;
          return (
            <motion.div key={c.name} data-pen={c.name} {...fadeUp(PEN_AT[i])} style={{ ...card(mid), background: mid ? TINT : SOFT, padding: '18px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>{c.name}</div>
              <div style={{ fontSize: 22, color: DIM }}>is like {c.like}</div>
              <div style={{ flex: '1 1 0', minHeight: 150, width: '100%', margin: '10px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0 }}>{c.art}</div>
              </div>
              <div style={{ fontSize: 21, color: DIM }}>The next step is picked by</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: mid ? TEAL_D : INK }}>{c.who}</div>
              {c.sub && <div style={{ fontSize: 22, color: DIM, marginTop: 4 }}>{c.sub}</div>}
              {c.ticks && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10, textAlign: 'left' }}>
                  {c.ticks.map((t, k) => (
                    <motion.div key={t} {...fadeUp(2.8 + k * 0.3)} style={{ fontSize: 22, color: INK, lineHeight: 1.3 }}>
                      <span style={{ color: TEAL, fontWeight: 700 }}>✓</span> {t}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Fill>
  );
}

/* 2.4d · the anatomy as a rail map: the success line on top, the failure tracks branching off at Evaluate */
const LINE = [
  { t: '1. Receive task', s: 'the crack report comes in' },
  { t: '2. Plan approach', s: 'steps written in code' },
  { t: '3. Execute tools', s: 'retrieve, call the model' },
  { t: '4. Evaluate', s: 'good enough?' },
  { t: '5a. Format result', s: 'the report goes out ✓' },
];
const NODE_X = [270, 518, 766, 1014, 1262];
const NODE_W = 236;
const LINE_AT = (i: number) => 0.4 + i * 0.4;
const BRANCH_AT = 2.6;

function Node({ x, y, t, s, delay, solid = true, end = false, attr }: { x: number; y: number; t: string; s: string; delay: number; solid?: boolean; end?: boolean; attr: Record<string, string> }) {
  return (
    <motion.div {...attr} {...fadeUp(delay)} style={{ position: 'absolute', left: x - NODE_W / 2, top: y, width: NODE_W, height: 128, boxSizing: 'border-box', borderRadius: 14, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: end ? TEAL : solid ? 'var(--panel-strong)' : 'var(--panel-strong)', border: `2px ${solid ? 'solid' : 'dashed'} ${solid ? TEAL : 'rgba(127,127,127,0.6)'}`, color: end ? '#fff' : INK }}>
      <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{t}</div>
      <div style={{ fontSize: 20, opacity: end ? 0.92 : 0.75, marginTop: 4 }}>{s}</div>
    </motion.div>
  );
}

function Anatomy() {
  const grey = 'rgba(127,127,127,0.7)';
  const draw = (delay: number) => ({ initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay, duration: 0.6, ease: EASE } });
  return (
    <Fill>
      <FitBox w={1400} h={660} max={1.15}>
        {/* the tracks */}
        <svg width={1400} height={660} viewBox="0 0 1400 660" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* sleepers and rail of the success line */}
          {Array.from({ length: 62 }, (_, i) => (
            <motion.rect key={i} x={150 + i * 19} y={105} width={6} height={30} rx={1} fill="rgba(127,127,127,0.25)" stroke="none" {...fade(0.3 + i * 0.03)} />
          ))}
          <motion.path d="M150 120 H1390" stroke="var(--teal)" strokeWidth={5} {...draw(0.3)} />
          {/* the failure tracks branch off at Evaluate */}
          <motion.path d="M1014 184 V576" stroke={grey} strokeWidth={3.5} strokeDasharray="8 8" {...draw(BRANCH_AT)} />
          <motion.path d="M1014 300 H890 M1014 438 H890 M1014 576 H890" stroke={grey} strokeWidth={3.5} strokeDasharray="8 8" {...draw(BRANCH_AT + 0.4)} />
          {/* replan loops back to Plan */}
          <motion.path d="M648 300 H518 V190" stroke={grey} strokeWidth={3.5} strokeDasharray="8 8" {...draw(BRANCH_AT + 0.9)} />
          <motion.path d="M508 204 L518 188 L528 204" stroke={grey} strokeWidth={3.5} {...fade(BRANCH_AT + 1.4)} />
          {/* review resolves, retries give up */}
          <motion.path d="M648 438 H642 M648 576 H642" stroke={grey} strokeWidth={3.5} {...fade(BRANCH_AT + 1.2)} />
          {[[894, 300], [894, 438], [894, 576], [646, 438], [646, 576]].map(([x, y]) => (
            <motion.path key={`${x}${y}`} d={`M${x + 10} ${y - 9} L${x - 2} ${y} L${x + 10} ${y + 9}`} stroke={grey} strokeWidth={3.5} {...fade(BRANCH_AT + 1)} />
          ))}
        </svg>
        <motion.div {...fade(0.2)} style={{ position: 'absolute', left: 152, top: 14, ...capTeal, fontSize: 17 }}>
          Success path · the lab implements this
        </motion.div>
        {/* Mercer sends the report in */}
        <motion.div {...fadeUp(0.2)} style={{ position: 'absolute', left: 0, top: 60, width: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Portrait who="mercer" size={92} />
          <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>Mercer</span>
        </motion.div>
        {LINE.map((n, i) => (
          <Node key={n.t} attr={{ 'data-success': String(i + 1) }} x={NODE_X[i]} y={56} t={n.t} s={n.s} delay={LINE_AT(i)} end={i === 4} />
        ))}
        {/* Vance reads it */}
        <motion.div {...fadeUp(LINE_AT(5))} style={{ position: 'absolute', left: NODE_X[4] - 110, top: 190, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ArrowDown h={26} />
          <Portrait who="vance" size={72} />
          <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>Vance reads it</span>
        </motion.div>
        <motion.div {...fade(BRANCH_AT)} style={{ position: 'absolute', left: 20, top: 250, width: 360 }}>
          <div style={{ ...cap, fontSize: 17 }}>Failure path</div>
          <div style={{ fontSize: 22, color: DIM, marginTop: 6, lineHeight: 1.35 }}>designed, not built in the lab</div>
        </motion.div>
        <Node attr={{ 'data-failure': '5c. Replan' }} x={766} y={236} t="5c. Replan" s="the LLM adjusts" delay={BRANCH_AT + 0.6} solid={false} />
        <Node attr={{ 'data-failure': '5b. Human review' }} x={766} y={374} t="5b. Human review" s="low confidence" delay={BRANCH_AT + 0.8} solid={false} />
        <Node attr={{ 'data-failure': '6b. Human resolves' }} x={518} y={374} t="6b. Human resolves" s="override or correct ✓" delay={BRANCH_AT + 1.2} solid={false} />
        <Node attr={{ 'data-failure': 'Max retries' }} x={766} y={512} t="Max retries" s="the limit is reached" delay={BRANCH_AT + 1.0} solid={false} />
        <Node attr={{ 'data-failure': 'Abort' }} x={518} y={512} t="Abort" s="the run stops" delay={BRANCH_AT + 1.4} solid={false} />
        {/* the everyday picture */}
        <motion.div {...fade(BRANCH_AT + 1.8)} style={{ position: 'absolute', left: 1070, top: 366, width: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...cap, fontSize: 17 }}>In everyday life</div>
          <div style={{ height: 112 }}>
            <Junction />
          </div>
          <div style={{ fontSize: 22, color: INK, lineHeight: 1.4 }}>
            A rail junction: <b>every track out</b> is laid before the first train runs.
          </div>
        </motion.div>
      </FitBox>
    </Fill>
  );
}

export function WhoPicks(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-pen" {...p}>
      <Swap k={step}>{step === 1 ? <WhoChooses /> : <Anatomy />}</Swap>
    </L2Page>
  );
}

/* ---------------- 2.4e · §2.2–2.7 a four-station conveyor belt ---------------- */

/** cell 50's saved trace: the four stations, their time and their tokens */
export const STATIONS = [
  { name: 'Classifier', out: 'severity = warning', tok: '114 in · 30 out', ms: 2623, icon: 'target' as IconName },
  { name: 'Retriever', out: 'k = 5 similar incidents', tok: 'one SQL query', ms: 3512, icon: 'lookup' as IconName },
  { name: 'Drafter', out: 'follow-up NDT within 14 days', tok: '1454 in · 234 out', ms: 25515, icon: 'prompt' as IconName },
  { name: 'Formatter', out: 'Markdown report', tok: 'plain Python, no LLM', ms: 0, icon: 'clipboard' as IconName },
];
const TOTAL = STATIONS.reduce((a, s) => a + s.ms, 0);

export function Conveyor(p: L2Props) {
  return (
    <L2Page testId="l2-conveyor" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
        <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* the crack report rides the belt */}
          <motion.div data-rider initial={{ x: 0, opacity: 0 }} animate={{ x: ['0%', '0%', '82%'], opacity: [0, 1, 1] }} transition={{ duration: 6, times: [0, 0.1, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(31,42,51,0.92)', color: '#fff', fontSize: 19, marginBottom: 12 }}>
            <LineIcon name="clipboard" size={26} color="#fff" /> crack 0.12 mm rides the belt →
          </motion.div>
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 50px minmax(0, 1fr) 50px minmax(0, 1fr) 50px minmax(0, 1fr)', alignItems: 'stretch' }}>
            {STATIONS.map((s, i) => [
              i > 0 ? (
                <div key={`a${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Arrow w={44} delay={0.4 + i * 0.4} />
                </div>
              ) : null,
              <motion.div key={s.name} data-station={s.name} {...fadeUp(0.2 + i * 0.4)} style={{ ...card(s.name === 'Drafter'), background: s.name === 'Drafter' ? TINT : SOFT, padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Num n={i + 1} size={34} />
                  <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>{s.name}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LineIcon name={s.icon} size={84} color={s.name === 'Drafter' ? TEAL : '#8a97a3'} />
                </div>
                <div style={{ fontSize: 22, color: INK, lineHeight: 1.35 }}>{s.out}</div>
                <Chip dim={s.name !== 'Drafter'} style={{ alignSelf: 'flex-start', fontSize: 17 }}>{s.tok}</Chip>
              </motion.div>,
            ])}
          </div>
          {/* the belt */}
          <div style={{ height: 10, borderRadius: 5, marginTop: 14, background: 'repeating-linear-gradient(90deg, rgba(127,127,127,0.35) 0 18px, rgba(127,127,127,0.15) 18px 30px)' }} />
        </div>
        <motion.div data-timing {...fadeUp(2)} style={{ ...card(), padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={cap}>Where the 32 seconds go</span>
            <span style={{ fontSize: 15, color: DIM }}>saved output, cell 50 · one CPU run</span>
          </div>
          <div style={{ display: 'flex', height: 46, borderRadius: 8, overflow: 'hidden', gap: 3 }}>
            {STATIONS.filter((s) => s.ms > 0).map((s, i) => (
              <motion.div key={s.name} data-ms={s.ms} initial={{ flexGrow: 0.001 }} animate={{ flexGrow: s.ms / TOTAL }} transition={{ delay: 2.3 + i * 0.3, duration: 0.9, ease: EASE }} style={{ flexBasis: 0, background: s.name === 'Drafter' ? TEAL : 'rgba(27,138,156,0.35)', color: s.name === 'Drafter' ? '#fff' : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono(18, s.name === 'Drafter' ? '#fff' : INK), fontWeight: 700, whiteSpace: 'nowrap', minWidth: 120 }}>
                {s.ms.toLocaleString('en-US')} ms
              </motion.div>
            ))}
          </div>
          <div style={{ fontSize: 19, color: DIM }}>The drafter writes one token at a time: it takes about 25 of the 32 seconds.</div>
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.4f · §2.3 station one: rate the severity ---------------- */

export function Station1(p: L2Props) {
  const focusN = useFocusN(p.focusId) ?? 0;
  return (
    <L2Page testId="l2-station1" {...p}>
      <Story
        focusN={focusN}
        everyday={{ art: <Triage />, caption: <>A triage nurse has <b>three tags</b>. Every patient gets exactly one, and a short note on the card.</> }}
        steps={[
          {
            title: 'The incident report comes in.',
            body: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <LineIcon name="clipboard" size={46} />
                <span style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(31,42,51,0.92)', color: '#fff', fontSize: 21 }}>Crack near the bearing plate · 0.12 mm × 85 mm</span>
              </div>
            ),
          },
          {
            title: <>The model may pick <span style={{ color: TEAL }}>only one of three ratings</span>.</>,
            body: (
              <div style={{ display: 'flex', gap: 12 }}>
                {['routine', 'warning', 'critical'].map((r, i) => (
                  <motion.span key={r} data-rating={r} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepAt(1) + 0.3 + i * 0.15, duration: 0.4, ease: EASE }} style={{ padding: '10px 20px', borderRadius: 10, ...mono(22, r === 'warning' ? '#fff' : INK), fontWeight: 700, background: r === 'warning' ? TEAL : 'rgba(127,127,127,0.14)' }}>
                    {r}
                    {r === 'warning' && ' ✓'}
                  </motion.span>
                ))}
              </div>
            ),
          },
          {
            title: 'Plus one short reason, in a fixed shape.',
            body: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Quote style={{ fontSize: 19 }}>{'{"severity": "warning", "reason": "Hairline crack detected at weld seam, requiring further inspection"}'}</Quote>
                <span style={{ fontSize: 17, color: DIM }}>saved output, cell 50</span>
              </div>
            ),
          },
        ]}
        side={{
          label: 'What the code enforces',
          items: [
            { title: 'Three ratings only', sub: 'routine · warning · critical' },
            { title: 'One short reason', sub: 'a sentence, not an essay' },
            { title: 'The shape is checked', sub: 'Pydantic: the shape, not the truth' },
          ],
          foot: 'station one of four',
        }}
      />
    </L2Page>
  );
}

/* ---------------- 2.4g · station three: draft the plan ---------------- */

/** the drawer's step n is the one being talked about: it stands out, the rest steps back */
const lit = (focusN: number | null, n: number) => ({
  opacity: focusN === null || focusN === n ? 1 : 0.4,
  boxShadow: focusN === n ? '0 0 0 6px rgba(27,138,156,0.22)' : 'none',
  transition: 'opacity 300ms, box-shadow 300ms',
});

const DRAFT_FIELDS = [
  { f: 'recommendation', d: 'One-line recommended action' },
  { f: 'rationale', d: 'Why, in 2-4 sentences, referencing the context' },
  { f: 'next_steps', d: 'Ordered list of concrete next steps' },
];
const FIELD_AT = [3.4, 3.9, 4.4];

/**
 * One big picture (owner, 29 Oct): the empty form waits on the right; the three inputs arrive on the left, pass the
 * "only the context" filter and the language model, and the form's three boxes fill one after another. A garage
 * work order is the everyday picture.
 */
export function Station3(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const label = { ...cap, fontSize: 17, letterSpacing: '0.14em' };
  return (
    <L2Page testId="l2-station3" {...p}>
      <Fill>
        <FitBox w={1400} h={640} max={1.15}>
          {/* the inputs */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: 700 }}>
            <motion.div {...fade(1)} style={label}>In: from stations one and two</motion.div>
          </div>
          {[
            {
              k: 'report',
              body: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: 'rgba(31,42,51,0.92)', color: '#fff', fontSize: 22, lineHeight: 1.3 }}>
                  <LineIcon name="clipboard" size={40} color="#fff" />
                  <span>Crack near the bearing plate · 0.12 mm × 85 mm</span>
                </div>
              ),
            },
            {
              k: 'severity',
              body: (
                <div style={{ ...card(), padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ padding: '6px 16px', borderRadius: 8, background: TEAL, ...mono(22, '#fff'), fontWeight: 700 }}>warning</span>
                  <span style={{ fontSize: 22, color: DIM }}>the rating</span>
                </div>
              ),
            },
            {
              k: 'context',
              body: (
                <div style={{ ...card(), padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <svg width="62" height="50" viewBox="0 0 62 50" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <rect key={i} x={2 + i * 7} y={2 + i * 4} width="30" height="26" rx="3" fill={i === 4 ? 'var(--panel-strong)' : 'rgba(127,127,127,0.25)'} stroke="var(--teal)" strokeWidth="2" />
                    ))}
                  </svg>
                  <span style={{ fontSize: 22, color: INK }}>
                    <b>5</b> similar incidents
                  </span>
                </div>
              ),
            },
          ].map((c, i) => (
            <motion.div key={c.k} data-input={c.k} {...fadeUp(1.2 + i * 0.35)} style={{ position: 'absolute', left: 0, top: 40 + i * 122, width: 380 }}>
              {c.body}
            </motion.div>
          ))}
          {/* three lines run from the inputs into the filter */}
          <svg width="80" height="340" viewBox="0 0 80 340" style={{ position: 'absolute', left: 384, top: 40, overflow: 'visible' }} aria-hidden>
            {[50, 168, 282].map((y, i) => (
              <motion.path key={y} d={`M0 ${y} C40 ${y} 40 120 78 120`} stroke="var(--teal)" strokeWidth="2.6" strokeDasharray="4 6" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.0 + i * 0.1, duration: 0.6 }} />
            ))}
          </svg>
          {/* the filter, then the language model */}
          <motion.div data-filter {...fadeUp(2.3)} style={{ position: 'absolute', left: 466, top: 40, width: 370, padding: '12px 18px', borderRadius: 14, background: 'var(--panel-strong)', border: '2px solid var(--teal)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...lit(focusN, 2) }}>
            <LineIcon name="funnel" size={70} />
            <div style={{ fontSize: 22, color: INK, textAlign: 'center', lineHeight: 1.35 }}>
              Use <b style={{ color: TEAL_D }}>ONLY</b> the provided context for facts.
            </div>
          </motion.div>
          <div style={{ position: 'absolute', left: 640, top: 204 }}>
            <ArrowDown h={36} />
          </div>
          <motion.div data-model {...fadeUp(2.8)} style={{ position: 'absolute', left: 466, top: 246, width: 370, padding: '10px 18px', borderRadius: 14, background: TINT, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...lit(focusN, 3) }}>
            <Net w={120} live />
            <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>the language model</div>
            <span style={{ ...mono(18, TEAL_D), whiteSpace: 'nowrap' }}>(DRAFT_PROMPT | llm).invoke(…)</span>
          </motion.div>
          <div style={{ position: 'absolute', left: 842, top: 320 }}>
            <Arrow w={44} delay={3.1} />
          </div>
          {/* the everyday picture */}
          <motion.div {...fade(0.6)} style={{ position: 'absolute', left: 0, top: 462, width: 836, height: 178, display: 'grid', gridTemplateColumns: '190px 1fr', gap: 22, alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 14, boxSizing: 'border-box' }}>
            <div style={{ height: 160 }}>
              <WorkOrder />
            </div>
            <div>
              <div style={label}>In everyday life</div>
              <div style={{ fontSize: 24, color: INK, lineHeight: 1.45, marginTop: 8 }}>
                A garage work order has <b>three boxes</b>. The mechanic fills each one, and writes only <b>what the inspection found</b>.
              </div>
            </div>
          </motion.div>
          {/* the form, the page's main picture */}
          <motion.div data-form {...fadeUp(0.3)} style={{ position: 'absolute', left: 892, top: 0, width: 508, height: 640, boxSizing: 'border-box', borderRadius: 18, background: 'var(--panel-strong)', border: '2px solid var(--teal)', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 16, ...lit(focusN, 1) }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: INK }}>The plan form</span>
              <span style={{ ...mono(18, DIM) }}>class Draft(BaseModel)</span>
            </div>
            {DRAFT_FIELDS.map((d, i) => (
              <div key={d.f} data-field={d.f} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Num n={i + 1} size={36} />
                  <span style={{ ...mono(24, TEAL_D), fontWeight: 700 }}>{d.f}</span>
                </div>
                <div style={{ fontSize: 20, color: DIM }}>{d.d}</div>
                <div style={{ flex: 1, minHeight: 56, borderRadius: 10, border: '2px dashed rgba(27,138,156,0.55)', padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
                  {i === 0 ? (
                    <motion.span {...fade(FIELD_AT[0])} style={{ fontSize: 22, color: INK, lineHeight: 1.35 }}>
                      Follow-up NDT (mag particle or phased-array) within 14 days
                    </motion.span>
                  ) : (
                    (i === 1 ? [100, 92, 60] : [70, 82, 64]).map((w, k) => (
                      <motion.span key={k} initial={{ width: '0%' }} animate={{ width: `${w}%` }} transition={{ delay: FIELD_AT[i] + k * 0.15, duration: 0.5, ease: EASE }} style={{ height: 8, borderRadius: 4, background: 'rgba(127,127,127,0.3)', display: 'block' }} />
                    ))
                  )}
                </div>
              </div>
            ))}
            <div style={{ fontSize: 16, color: DIM }}>recommendation: saved output, cell 50</div>
          </motion.div>
        </FitBox>
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.4h · the order lives in the code ---------------- */

const CALLS = [
  { t: 'Rate', ms: 2623, code: 'triage, u1 = classify_incident(incident)', by: 'the language model' },
  { t: 'Fetch', ms: 3512, code: 'chunks = retrieve_context(incident, k=k, asset_filter=asset)', by: 'the database · oracle/V_CHUNKS_UNIFIED' },
  { t: 'Draft', ms: 25515, code: 'draft, u2 = draft_response(incident, triage, chunks)', by: 'the language model' },
  { t: 'Format', ms: 0, code: 'report = format_report(incident, triage, draft)', by: 'plain Python, no language model' },
];
/** the run replayed in about five seconds, each call's bar in proportion to its time */
const RUN_FROM = 0.9;
const RUN_DUR = CALLS.map((c) => Math.max(0.25, (c.ms / 31650) * 4.6));
const RUN_AT = CALLS.map((_, i) => RUN_FROM + RUN_DUR.slice(0, i).reduce((a, b) => a + b, 0));

/**
 * The recipe card on the left (same steps, same order; each cake a little different), and on the right the crack
 * report's one run as a time line: each call's bar fills in turn, in proportion to its time, and its line of
 * run_workflow lights up as it starts.
 */
export function Order(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const label = { ...cap, fontSize: 17, letterSpacing: '0.14em', marginBottom: 14 };
  return (
    <L2Page testId="l2-order" {...p}>
      <Fill>
        <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '330px minmax(0, 1fr)', columnGap: 34, marginTop: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--line)', paddingRight: 28 }}>
            <div style={label}>In everyday life</div>
            <motion.div {...fade(0.2)} style={{ flex: 1, minHeight: 170 }}>
              <Recipe />
            </motion.div>
            <div style={{ fontSize: 23, color: INK, lineHeight: 1.4, marginTop: 12 }}>
              A recipe fixes <b>the steps and their order</b>. Every cake comes out a little different.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={label}>One run on the crack report · saved output, cell 50</div>
            <div data-track style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
              {CALLS.map((c, i) => (
                <motion.div key={c.t} data-call={c.t} {...fade(RUN_AT[i] - 0.3)} style={{ flexGrow: c.ms ? c.ms : 0, flexBasis: 0, minWidth: c.ms ? 170 : 156, display: 'flex', flexDirection: 'column', gap: 8, opacity: focusN === null || focusN === i + 1 ? 1 : 0.4, transition: 'opacity 300ms' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Num n={i + 1} size={36} />
                    <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>{c.t}</span>
                  </div>
                  <div style={{ height: 30, borderRadius: 8, background: 'rgba(127,127,127,0.14)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ delay: RUN_AT[i], duration: RUN_DUR[i], ease: 'linear' }} style={{ height: '100%', background: c.by === 'the language model' ? TEAL : 'rgba(27,138,156,0.45)' }} />
                  </div>
                  <span style={{ ...mono(22, INK), fontWeight: 700 }}>{c.ms.toLocaleString('en-US')} ms</span>
                </motion.div>
              ))}
            </div>
            <div style={{ ...label, marginTop: 22 }}>The order, written in run_workflow()</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CALLS.map((c, i) => (
                <motion.div
                  key={c.t}
                  data-line={i + 1}
                  initial={{ opacity: 0.25, backgroundColor: 'rgba(27,138,156,0)', borderColor: 'rgba(127,127,127,0.3)' }}
                  animate={{ opacity: 1, backgroundColor: 'rgba(27,138,156,0.10)', borderColor: 'rgba(27,138,156,0.85)' }}
                  transition={{ delay: RUN_AT[i], duration: 0.4 }}
                  style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', columnGap: 16, alignItems: 'center', padding: '6px 18px', borderRadius: 12, border: '2px solid', boxShadow: focusN === i + 1 ? '0 0 0 6px rgba(27,138,156,0.22)' : 'none' }}
                >
                  <Num n={i + 1} size={40} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ ...mono(21, INK), overflowWrap: 'anywhere' }}>{c.code}</div>
                    <div style={{ fontSize: 20, color: TEAL_D, marginTop: 4 }}>
                      {c.t} · {c.by}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.4i, 2.4j, 2.4k · the chief inspector ---------------- */

const CHECKLIST = ['Check the bearing plate', 'Measure the crack', 'Log the reading'];
const LOOP = [
  { n: 1, t: 'Look', s: 'read the situation' },
  { n: 2, t: 'Pick a tool', s: 'from its toolbox' },
  { n: 3, t: 'Read the result', s: 'check what came back' },
  { n: 4, t: 'Decide again', s: 'done, or next step?' },
];
const DOES = ['Plans and reasons', 'Picks its tools', 'Remembers across sessions', 'Adapts to what it finds'];

export function Chief(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-chief" hasRed={step === 1} {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 26, minHeight: 0 }}>
        {/* the fixed checklist, with no step for the new failure */}
        <motion.div data-checklist {...fadeUp(0.2)} style={{ ...card(), padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LineIcon name="clipboard" size={44} color="#8a97a3" />
            <div>
              <div style={{ fontSize: 25, fontWeight: 700, color: INK }}>Fixed checklist</div>
              <div style={{ fontSize: 18, color: DIM }}>steps decided in advance</div>
            </div>
          </div>
          {CHECKLIST.map((c, i) => (
            <motion.div key={c} {...fadeUp(0.5 + i * 0.3)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: CARD, border: '1.5px solid var(--line)', fontSize: 20, color: INK }}>
              <Num n={i + 1} size={30} on={false} />
              <span style={{ flex: 1 }}>{c}</span>
              <span style={{ color: TEAL, fontWeight: 700 }}>✓</span>
            </motion.div>
          ))}
          <motion.div data-new-failure {...fadeUp(1.6)} style={{ marginTop: 'auto', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textAlign: 'center', borderRadius: 12, border: `2px dashed ${step === 1 ? RED : '#8a97a3'}`, padding: 14 }}>
            <LineIcon name="inspect" size={44} color={step === 1 ? RED : '#8a97a3'} />
            <div style={{ fontSize: 22, fontWeight: 700, color: step === 1 ? RED : INK }}>New failure: no step for it</div>
            <div style={{ fontSize: 18, color: DIM }}>cannot grow new branches by itself</div>
          </motion.div>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
          {/* the chief inspector */}
          <motion.div data-chief {...fadeUp(0.8)} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <ChiefInspector size={step === 1 ? 190 : 120} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: INK }}>Chief inspector</div>
              <span style={{ alignSelf: 'flex-start', padding: '4px 14px', borderRadius: 999, background: TINT2, ...mono(18), fontWeight: 700 }}>AI AGENT · Harbor Bridge</span>
              <div style={{ fontSize: 23, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 14, padding: '10px 18px' }}>“I decide the next step myself.”</div>
            </div>
          </motion.div>
          {/* the loop it runs */}
          <motion.div data-loop {...reveal(upTo(step, 2), 0.2)} style={{ ...card(true), background: TINT, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={capTeal}>The loop it runs, again and again</div>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 6 }}>
              {LOOP.map((l, i) => [
                i > 0 ? (
                  <div key={`a${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <Arrow w={40} delay={0.6 + i * 0.5} loop={upTo(step, 2) && i === 3} />
                  </div>
                ) : null,
                <motion.div key={l.t} data-loop-step={l.n} {...reveal(upTo(step, 2), 0.4 + i * 0.5)} style={{ flex: 1, ...card(), background: CARD, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Num n={l.n} size={30} />
                    <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>{l.t}</span>
                  </div>
                  <div style={{ fontSize: 18, color: DIM, marginTop: 4 }}>{l.s}</div>
                </motion.div>,
              ])}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: TEAL }}>↺</div>
            </div>
          </motion.div>
          {/* what it does, and the signed recommendation */}
          <motion.div data-does {...reveal(upTo(step, 3), 0.2)} style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) 300px', gap: 12, alignItems: 'stretch' }}>
            {DOES.map((d, i) => (
              <motion.div key={d} {...reveal(upTo(step, 3), 0.3 + i * 0.25)} style={{ gridColumn: (i % 2) + 1, ...card(), padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, fontWeight: 600, color: INK }}>
                <span style={{ color: TEAL, fontWeight: 700 }}>✓</span> {d}
              </motion.div>
            ))}
            <motion.div data-signed {...reveal(upTo(step, 3), 1.4)} style={{ gridColumn: 3, gridRow: '1 / 3', ...card(true), background: CARD, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
              <div style={{ fontSize: 21, color: INK }}>Ready → <b>recommendation</b></div>
              <div style={{ borderTop: '1.5px solid var(--line)', paddingTop: 8, ...mono(17), fontWeight: 700 }}>SIGNED · Chief inspector</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.4l · three ways agents are used ---------------- */

const WAYS = [
  { t: 'Assistant', loop: 'request → response → wait', mem: 'context + preferences', m: 0.3, icon: 'speech' as IconName, ours: true },
  { t: 'Workflow agent', loop: 'plan → execute → verify', mem: 'working state', m: 0.6, icon: 'steps' as IconName },
  { t: 'Deep research', loop: 'explore → gather → synthesize', mem: 'the most', m: 0.95, icon: 'lookup' as IconName },
];

const WAY_ICON: IconName[] = ['speech', 'loop', 'nodes'];

export function ThreeWays(p: L2Props) {
  return (
    <L2Page testId="l2-ways" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, minHeight: 0 }}>
          {WAYS.map((w, i) => (
            <motion.div key={w.t} data-way={w.t} {...fadeUp(0.2 + i * 0.4)} style={{ ...card(!!w.ours), background: w.ours ? TINT : SOFT, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <LineIcon name={w.icon} size={50} />
                <span style={{ fontSize: 29, fontWeight: 700, color: INK }}>{w.t}</span>
              </div>
              <div style={{ ...mono(20) }}>{w.loop}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineIcon name={WAY_ICON[i]} size={110} color={w.ours ? TEAL : '#8a97a3'} />
              </div>
              <div style={{ ...cap, fontSize: 14 }}>Memory: {w.mem}</div>
              <div style={{ height: 14, borderRadius: 7, background: 'rgba(127,127,127,0.18)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${w.m * 100}%` }} transition={{ delay: 0.6 + i * 0.4, duration: 0.8, ease: EASE }} style={{ height: '100%', background: TEAL }} />
              </div>
              {w.ours && <span style={{ alignSelf: 'flex-start', padding: '3px 12px', borderRadius: 999, background: TEAL, color: '#fff', fontSize: 16, fontWeight: 700 }}>our bridge agent</span>}
            </motion.div>
          ))}
        </div>
        <motion.div data-split {...fadeUp(1.6)} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 70px minmax(0, 1fr)', alignItems: 'stretch', gap: 8 }}>
          <div style={{ ...card(true), background: CARD, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Net w={90} live />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>The language model decides</div>
              <div style={{ fontSize: 19, color: DIM }}>reasons · picks the tool · decides what to do with results</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, color: TEAL }}>⇄</div>
          <div style={{ ...card(), padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <LineIcon name="gear" size={56} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>The framework executes <span style={{ ...mono(20) }}>(LangGraph)</span></div>
              <div style={{ fontSize: 19, color: DIM }}>runs the call · manages the loop · keeps state and memory</div>
            </div>
          </div>
        </motion.div>
        <div style={{ fontSize: 17, color: DIM, textAlign: 'center' }}>Design option, not in the lab: multi-agent (a main agent delegates to sub-agents) and multi-source deep research</div>
      </div>
    </L2Page>
  );
}

