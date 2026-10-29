import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, ArrowDown, CARD, ChiefInspector, Chip, DIM, INK, L2Page, Net, Num, Quote, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
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
  { name: 'RAG', who: 'the application', sub: 'one lookup, one answer', icon: 'lookup' as IconName },
  { name: 'Workflow', who: 'the code', sub: '', icon: 'steps' as IconName, ticks: ['Path fixed in advance', 'LLM only inside steps', 'Human sign-off (design option)', 'Replayable'] },
  { name: 'Agent', who: 'the model', sub: 'flexible, less predictable', icon: 'branch' as IconName },
];

const SUCCESS = [
  { t: '1. Receive task', s: 'the crack report comes in' },
  { t: '2. Plan approach', s: 'the steps are written in code' },
  { t: '3. Execute tools', s: 'retrieve, call the model' },
  { t: '4. Evaluate', s: 'is the result good enough?' },
  { t: '5a. Format result', s: 'the report goes out ✓' },
];
const FAILURE = [
  { t: '5b. Human review', s: 'low confidence' },
  { t: '6b. Human resolves', s: 'override or correct ✓' },
  { t: '5c. Replan', s: 'the LLM adjusts' },
  { t: 'Max retries', s: 'abort' },
];

export function WhoPicks(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-pen" {...p}>
      <Swap k={step}>
        {step === 1 ? (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr) minmax(0, 1fr)', gap: 22, minHeight: 0 }}>
            {PENS.map((c, i) => (
              <motion.div key={c.name} data-pen={c.name} {...fadeUp(0.2 + i * 0.4)} style={{ ...card(i === 1), background: i === 1 ? TINT : SOFT, padding: '22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
                <div style={cap}>Who holds the pen?</div>
                <LineIcon name={c.icon} size={72} color={i === 1 ? TEAL : '#8a97a3'} />
                <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>{c.name}</div>
                <div style={{ fontSize: 21, color: DIM }}>picks the next step:</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: TEAL_D }}>{c.who}</div>
                {c.sub && <div style={{ fontSize: 21, color: DIM }}>{c.sub}</div>}
                {c.ticks && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', marginTop: 4 }}>
                    {c.ticks.map((t, k) => (
                      <motion.div key={t} {...fadeUp(1.4 + k * 0.3)} style={{ fontSize: 22, color: INK }}>
                        <span style={{ color: TEAL, fontWeight: 700 }}>✓</span> {t}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
            <div style={capTeal}>Success path · the lab implements this</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 6 }}>
              {SUCCESS.map((s, i) => [
                i > 0 ? (
                  <div key={`a${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <Arrow w={42} delay={0.3 + i * 0.35} />
                  </div>
                ) : null,
                <motion.div key={s.t} data-success={i + 1} {...fadeUp(0.2 + i * 0.35)} style={{ flex: 1, ...card(true), background: i === 4 ? TEAL : CARD, color: i === 4 ? '#fff' : INK, padding: '16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 25, fontWeight: 700 }}>{s.t}</div>
                  <div style={{ fontSize: 20, opacity: 0.85, marginTop: 6 }}>{s.s}</div>
                </motion.div>,
              ])}
            </div>
            <div style={{ ...cap, marginTop: 10 }}>Failure path · designed, not built in the lab</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 6 }}>
              <motion.div {...fadeUp(2.2)} style={{ flex: 1, ...card(), padding: '16px 16px', borderStyle: 'dashed', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 25, fontWeight: 700, color: INK }}>4. Evaluate</div>
                <div style={{ fontSize: 20, color: DIM, marginTop: 6 }}>the result looks weak</div>
              </motion.div>
              {FAILURE.map((s, i) => [
                <div key={`a${i}`} style={{ display: 'flex', alignItems: 'center' }}>
                  <Arrow w={42} delay={2.4 + i * 0.3} color="#8a97a3" />
                </div>,
                <motion.div key={s.t} data-failure={s.t} {...fadeUp(2.5 + i * 0.3)} style={{ flex: 1, ...card(), padding: '16px 16px', borderStyle: 'dashed', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 25, fontWeight: 700, color: INK }}>{s.t}</div>
                  <div style={{ fontSize: 20, color: DIM, marginTop: 6 }}>{s.s}</div>
                </motion.div>,
              ])}
            </div>
            <motion.div {...fade(3.8)} style={{ alignSelf: 'center', fontSize: 22, color: INK, padding: '10px 22px', borderRadius: 999, background: TINT }}>
              Every exit is planned: <b>success · review · replan · abort</b>. The code makes the routing decisions.
            </motion.div>
          </div>
        )}
      </Swap>
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
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-station1" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <motion.div {...fadeUp(0.1)} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, color: INK }}>
          <span style={cap}>Incident report</span>
          <span style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(31,42,51,0.92)', color: '#fff' }}>Crack near the bearing plate · 0.12 mm × 85 mm</span>
        </motion.div>
        <StepRow
          focusN={focusN}
          steps={[
            {
              title: 'Only three ratings exist',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                  {['routine', 'warning', 'critical'].map((r) => (
                    <div key={r} data-rating={r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 12, ...mono(22, r === 'warning' ? '#fff' : INK), background: r === 'warning' ? TEAL : 'rgba(127,127,127,0.12)', fontWeight: 700 }}>
                      {r}
                      {r === 'warning' && <span>✓</span>}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: 'Plus one short reason',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                  <Chip style={{ alignSelf: 'flex-start' }}>reason:</Chip>
                  <div style={{ fontSize: 23, lineHeight: 1.4, color: INK, padding: '14px 18px', borderRadius: 12, background: TINT }}>“Hairline crack detected at weld seam, requiring further inspection”</div>
                </div>
              ),
            },
            {
              title: 'Model told: JSON only',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <Quote style={{ fontSize: 20 }}>{'{"severity": …, "reason": …}'}</Quote>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, color: TEAL_D }}>Pydantic: shape ✓</div>
                  <div style={{ fontSize: 20, color: DIM }}>checks the shape, not whether the rating is right</div>
                </div>
              ),
            },
          ]}
        />
        <Saved label="Saved output, cell 50">Severity. warning: Hairline crack detected at weld seam, requiring further inspection</Saved>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.4g · §2.5 station three: draft the plan ---------------- */

export function Station3(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-station3" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <motion.div {...fadeUp(0.1)} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, color: INK }}>
          <span style={cap}>In</span>
          <Chip>incident</Chip>
          <span style={{ color: TEAL }}>+</span>
          <Chip>severity</Chip>
          <span style={{ color: TEAL }}>+</span>
          <Chip>context, §1.3</Chip>
        </motion.div>
        <StepRow
          focusN={focusN}
          steps={[
            {
              title: 'Three fields to fill',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                  {['recommendation: ____', 'rationale: ____', 'next_steps: [ … ]'].map((f) => (
                    <div key={f} style={{ ...mono(22, INK), padding: '12px 16px', borderRadius: 10, border: '2px dashed rgba(27,138,156,0.55)', background: CARD }}>{f}</div>
                  ))}
                </div>
              ),
            },
            {
              title: 'Facts only from context',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <LineIcon name="funnel" size={80} />
                  <Quote style={{ fontSize: 20 }}>Use ONLY the provided context for facts.</Quote>
                </div>
              ),
            },
            {
              title: 'Prompt into the model',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <Net w={150} live />
                  <Chip style={{ fontSize: 18, alignSelf: 'flex-start' }}>(DRAFT_PROMPT | llm).invoke(…)</Chip>
                </div>
              ),
            },
          ]}
        />
        <Saved label="Saved output, cell 50">Recommendation. Follow-up NDT (mag particle or phased-array) within 14 days</Saved>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.4h · §2.6 the order lives in the code ---------------- */

export function Order(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const runs = [
    { t: 'Rate', f: 'classify', ms: '2,623 ms', by: 'the language model', icon: 'target' as IconName },
    { t: 'Fetch', f: 'retrieve', ms: '3,512 ms', by: 'oracle/V_CHUNKS_UNIFIED', icon: 'lookup' as IconName },
    { t: 'Draft', f: 'draft', ms: '25,515 ms', by: 'the language model', icon: 'prompt' as IconName },
    { t: 'Format', f: 'format', ms: '0 ms', by: 'python', icon: 'clipboard' as IconName },
  ];
  return (
    <L2Page testId="l2-order" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <StepRow
          focusN={focusN}
          steps={runs.map((r) => ({
            title: r.t,
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <LineIcon name={r.icon} size={88} color={r.by === 'the language model' ? TEAL : '#8a97a3'} />
                <Chip style={{ fontSize: 22, alignSelf: 'flex-start' }}>{r.f}</Chip>
                <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>{r.ms}</div>
                <div style={{ ...mono(17, DIM) }}>{r.by}</div>
              </div>
            ),
          }))}
        />
        <motion.div {...fadeUp(2.6)} style={{ alignSelf: 'center', padding: '10px 24px', borderRadius: 999, background: TINT, fontSize: 22, color: INK }}>
          Same four calls, same order, every run. Format is plain Python, no LLM.
        </motion.div>
        <div style={{ fontSize: 15, color: DIM, textAlign: 'center' }}>Timings: saved output, cell 50 (one CPU run)</div>
      </div>
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

