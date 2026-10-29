import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, CARD, ChiefInspector, Chip, CrackPlate, Db, DIM, Folder, INK, L2Page, Net, Num, Portrait, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, useFocusN, type L2Props,
} from './parts';
import { RouteMap } from './RouteMap';
import { Ladder, WhyLayers } from './WhyArt';
import { Bench, SiteCheck } from './BenchArt';

/**
 * Lab 2 · the opening chapters of the Harbor Bridge deck: Story (one crack), Why (AI needs your data), and Setup
 * (the workbench, what the agent can see, is the model awake?). Mercer reports the crack, Vance asks what to do.
 */

/** one step's content, cross-fading when the click changes the layout */
function Swap({ k, children }: { k: string | number; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------- Story · one crack (0.4, 0.4a, 0.4b) ---------------- */

const EVIDENCE: { label: string; icon: IconName; where: string }[] = [
  { label: 'Asset record', icon: 'profile', where: '' },
  { label: 'Specifications', icon: 'prompt', where: '' },
  { label: 'Connected assets', icon: 'nodes', where: '' },
  { label: 'History', icon: 'log', where: '' },
  { label: 'Memory', icon: 'book', where: '' },
];

export const ROUTE: { n: number; ch: string; name: string; kinds: ('idea' | 'notebook')[] }[] = [
  { n: 1, ch: 'Story', name: 'One crack', kinds: ['idea'] },
  { n: 2, ch: 'Why', name: 'Why AI needs your data', kinds: ['idea'] },
  { n: 3, ch: 'Setup', name: 'The workbench', kinds: ['notebook'] },
  { n: 4, ch: 'RAG', name: 'The filing cabinet', kinds: ['idea', 'notebook'] },
  { n: 5, ch: 'Workflow', name: 'The fixed checklist', kinds: ['idea', 'notebook'] },
  { n: 6, ch: 'Agent', name: 'The chief inspector', kinds: ['idea'] },
  { n: 7, ch: 'Tools', name: 'Tools, skills, MCP', kinds: ['idea', 'notebook'] },
  { n: 8, ch: 'Query', name: 'One query, four lenses', kinds: ['notebook'] },
  { n: 9, ch: 'Agent', name: 'Build the agent', kinds: ['idea', 'notebook'] },
  { n: 10, ch: 'Trust', name: 'Security and observability', kinds: ['idea', 'notebook'] },
  { n: 11, ch: 'Wrap', name: 'Wrap-up', kinds: ['idea', 'notebook'] },
];


function CrackFacts({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: compact ? 22 : 34, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div data-fact="width" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: compact ? 44 : 92, fontWeight: 700, color: INK, lineHeight: 1.1 }}>0.12</span>
          <span style={{ fontSize: compact ? 20 : 28, color: DIM }}>mm</span>
        </div>
        <span style={{ fontSize: compact ? 16 : 20, color: DIM }}>reported crack width</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div data-fact="length" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: compact ? 44 : 92, fontWeight: 700, color: INK, lineHeight: 1.1 }}>85</span>
          <span style={{ fontSize: compact ? 20 : 28, color: DIM }}>mm</span>
        </div>
        <span style={{ fontSize: compact ? 16 : 20, color: DIM }}>reported crack length</span>
      </div>
    </div>
  );
}

export function CrackStory(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-story" hasRed={step === 1} {...p}>
      <Swap k={step === 3 ? 'route' : 'crack'}>
        {step < 3 ? (
          <div style={{ flex: 1, display: 'grid', gridTemplateRows: step === 1 ? '1fr' : 'auto 1fr', gap: 18, minHeight: 0 }}>
            {/* Mercer reports the crack: a drawing, the two numbers, the facts */}
            <motion.div layout transition={{ duration: 0.5, ease: EASE }} style={{ display: 'grid', gridTemplateColumns: step === 1 ? '320px minmax(0, 1fr) minmax(0, 1fr)' : '220px 220px minmax(0, 1fr)', gap: 28, alignItems: 'center', ...card(), padding: step === 1 ? '24px 30px' : '14px 22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                <Portrait who="mercer" size={step === 1 ? 210 : 72} />
                <div style={{ fontSize: step === 1 ? 30 : 19, fontWeight: 700, color: INK }}>Mercer</div>
                {step === 1 && <div style={{ fontSize: 22, color: DIM }}>senior inspector, reports the crack</div>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* the crack is the page's one red thing on the first click; after that the question takes over */}
                <CrackPlate w={step === 1 ? 520 : 200} red={step === 1} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <CrackFacts compact={step > 1} />
                <div style={{ fontSize: step === 1 ? 26 : 18, color: INK, lineHeight: 1.4 }}>
                  South side · weld seam between girder and bearing plate
                  <br />
                  <span style={{ color: DIM }}>No visible movement · no lane closure</span>
                </div>
              </div>
            </motion.div>
            {step === 2 && (
              <div data-evidence style={{ display: 'grid', gridTemplateColumns: '270px minmax(0, 1fr) 60px 300px', gap: 22, alignItems: 'stretch', minHeight: 0, padding: '10px 0' }}>
                <motion.div {...fadeUp(0.2)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
                  <Portrait who="vance" size={130} />
                  <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Vance asks</div>
                  <div style={{ fontSize: 22, lineHeight: 1.35, padding: '12px 16px', borderRadius: 14, background: 'rgba(31,42,51,0.92)', color: '#fff' }}>“What should operations do, and what proves it?”</div>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 14 }}>
                  {EVIDENCE.map((e, i) => (
                    <motion.div key={e.label} data-kind={e.label} {...fadeUp(0.6 + i * 0.25)} style={{ ...card(true), padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
                      <LineIcon name={e.icon} size={72} />
                      <div style={{ fontSize: 21, fontWeight: 700, color: INK, overflowWrap: 'anywhere' }}>{e.label}</div>
                      
                    </motion.div>
                  ))}
                </div>
                <Arrow w={56} delay={2} />
                <motion.div data-brief {...fadeUp(2.2)} style={{ ...card(true), background: TINT, padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <LineIcon name="clipboard" size={96} />
                  <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>One incident brief</div>
                  <div style={{ fontSize: 19, color: DIM }}>before anyone recommends anything</div>
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          <div data-route style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <RouteMap stops={ROUTE} />
          </div>
        )}
      </Swap>
    </L2Page>
  );
}

/* ---------------- Why · AI needs your data (2.0, 2.0a) ---------------- */

export { LEVELS } from './WhyArt';

export function WhyData(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-why" {...p}>
      <Swap k={step}>{step === 1 ? <WhyLayers /> : <Ladder />}</Swap>
    </L2Page>
  );
}

/* ---------------- Why · the bare model (2.1, 2.1a) ---------------- */

function Bubble({ who, children, delay }: { who: 'q' | 'a'; children: ReactNode; delay: number }) {
  return (
    <motion.div {...fadeUp(delay)} style={{ alignSelf: who === 'q' ? 'flex-end' : 'flex-start', maxWidth: '90%', padding: '16px 20px', borderRadius: 16, fontSize: 25, lineHeight: 1.4, background: who === 'q' ? 'rgba(31,42,51,0.92)' : CARD, color: who === 'q' ? '#fff' : INK, border: who === 'a' ? '1.5px solid var(--line)' : 'none' }}>
      {children}
    </motion.div>
  );
}

export function BareModel(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-bare" hasRed={step === 2} {...p}>
      <Swap k={step}>
        {step === 1 ? (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px minmax(0, 1fr)', alignItems: 'center', gap: 20, minHeight: 0 }}>
            <motion.div {...fadeUp(0.2)} style={{ ...card(), height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: 24 }}>
              <ChiefInspector size={170} grey label="a well-read engineer" />
              <div style={{ fontSize: 28, fontWeight: 700, color: INK }}>A well-read engineer</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div key={i} {...fadeUp(0.8 + i * 0.15)} style={{ width: 34, height: 62 + (i % 3) * 10, borderRadius: 4, background: i % 2 ? TINT2 : 'rgba(127,127,127,0.25)', border: `2px solid ${i % 2 ? TEAL : '#9aa4ae'}` }} />
                ))}
              </div>
              <div style={{ fontSize: 21, color: DIM }}>has read the textbooks, up to the training date</div>
            </motion.div>
            <Arrow w={80} delay={1.6} />
            <motion.div {...fadeUp(1.8)} style={{ ...card(), height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 }}>
              <svg width="220" height="120" viewBox="0 0 220 120" aria-label="Harbor Bridge" role="img">
                <path d="M10 70h200" stroke="#5c6b78" strokeWidth="6" />
                {[30, 75, 145, 190].map((x) => <rect key={x} x={x - 6} y={70} width={12} height={44} fill="#9aa4ae" />)}
                <path d="M20 70C60 18 160 18 200 70" fill="none" stroke="#9aa4ae" strokeWidth="4" />
              </svg>
              <div style={{ fontSize: 26, fontWeight: 700, color: INK, textAlign: 'center' }}>…but has never seen this bridge</div>
              <div style={{ fontSize: 24, color: '#fff', background: 'rgba(31,42,51,0.92)', padding: '14px 20px', borderRadius: 16 }}>“What should we do about this crack?”</div>
            </motion.div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 26, minHeight: 0 }}>
            <motion.div data-side="alone" {...fadeUp(0.2)} style={{ ...card(), padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Net w={86} dim />
                <div style={cap}>Model alone · stops at training date</div>
              </div>
              <Bubble who="q" delay={0.5}>What should we do about the crack on Harbor Bridge?</Bubble>
              <Bubble who="a" delay={1.2}>
                “I don’t have information about a crack on Harbor Bridge. In general, cracks should be inspected by a qualified engineer…”
              </Bubble>
              <motion.div data-verdict="generic" {...fade(1.8)} style={{ marginTop: 'auto', fontSize: 22, fontWeight: 700, color: RED }}>✗ Generic. Doesn’t know it happened.</motion.div>
            </motion.div>
            <motion.div data-side="grounded" {...fadeUp(0.6)} style={{ ...card(true), padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Net w={86} live />
                <div style={capTeal}>Look it up first · then answer</div>
              </div>
              <Bubble who="q" delay={0.9}>What should we do about the crack on Harbor Bridge?</Bubble>
              <motion.div {...fadeUp(1.5)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: TINT, border: '1.5px dashed rgba(27,138,156,0.6)' }}>
                <Folder size={40} />
                <span style={{ ...mono(17) }}>INSPECTION_REPORTS · this morning</span>
                <span style={{ fontSize: 19, color: INK }}>south weld seam · 0.12 mm × 85 mm · no movement</span>
              </motion.div>
              <Bubble who="a" delay={2.1}>
                “This morning’s inspection found a <b>0.12 mm crack</b> at the south weld seam. <b>No movement, so no closure</b>; schedule a follow-up…”
              </Bubble>
              <motion.div {...fade(2.6)} style={{ marginTop: 'auto', fontSize: 22, fontWeight: 700, color: TEAL_D }}>✓ Grounded in today’s record.</motion.div>
            </motion.div>
          </div>
        )}
      </Swap>
    </L2Page>
  );
}

/* ---------------- §0 · the workbench (0.5, 0.5a) ---------------- */

/** the readiness probe's checks, in the notebook's own words, grouped by its numbered comments (cell 10) */
export const CHECKS: { n: number; group: string; items: string[] }[] = [
  { n: 1, group: 'Connected', items: ['Configured database user connected'] },
  { n: 2, group: 'Tables', items: ['Canonical PRISM tables exist'] },
  { n: 3, group: 'Views and graph', items: ['View V_CHUNKS_UNIFIED exists', 'View V_ASSET_SPECS_SUMMARY exists', 'View INSPECTION_REPORT_DV exists', 'Property graph CITYPULSE_GRAPH exists'] },
  { n: 4, group: 'Row counts', items: ['DISTRICTS has expected data', 'INFRASTRUCTURE_ASSETS has expected data', 'MAINTENANCE_LOGS has expected data', 'INSPECTION_REPORTS has expected data', 'INSPECTION_FINDINGS has expected data', 'ASSET_CONNECTIONS has expected data', 'DOCUMENT_CHUNKS has expected data'] },
  { n: 5, group: 'Schema and data', items: ['INFRASTRUCTURE_ASSETS.CRITICALITY exists', 'V_CHUNKS_UNIFIED exposes agent context', 'Golden-path substation scenario data loaded'] },
  { n: 6, group: 'Demo assets', items: ['Demo asset exists: Harbor Bridge', 'Demo asset exists: Substation Gamma', 'Demo asset exists: Pipeline North-7', 'Demo asset exists: City Operations Control Center', 'Demo asset exists: Emergency Operations Center'] },
  { n: 7, group: 'Model and index', items: ['ONNX model ALL_MINILM_L12_V2 loaded', 'ONNX model ALL_MINILM_L12_V2 can embed text', 'HNSW vector index IDX_CHUNK_EMBEDDING exists'] },
  { n: 8, group: 'Memory library', items: ['langgraph-oracledb installed'] },
];

export function Workbench(p: L2Props) {
  const step = p.step ?? 1;
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-bench" {...p}>
      <Swap k={step}>{step === 1 ? <Bench focusN={focusN} /> : <SiteCheck groups={CHECKS} focusN={focusN} />}</Swap>
    </L2Page>
  );
}

/* ---------------- §0.8–0.9 · what the agent can see (0.3, 0.3a) ---------------- */

/** cell 12's saved output for Harbor Bridge (the fifth row is cut before its pier number) */
const RECENT = [
  { d: '2026-07-05', sev: 'critical', t: 'Expansion joint at east approach (EJ-1) failed under high tidal gusts; rubber seal torn a…' },
  { d: '2026-07-04', sev: 'critical', t: 'Detected unexpected sagging at midspan during routine automated survey—vertical deflectio…' },
  { d: '2026-07-03', sev: 'critical', t: 'Observed major fracture in lower flange weld of girder G-5…' },
  { d: '2026-07-02', sev: 'routine', t: 'Performed preventive maintenance on traffic monitoring sensors DS-4 and DS-5; cleaned opt…' },
  { d: '2026-06-30', sev: 'routine', t: 'Checked strain gauge array SG-12 and data logger DLT-7 after routine download; gauges sho…' },
];
const EDGES = [
  ['Emergency Operations Center', 'coordinates'],
  ['Harbor Bridge Sensor Array A', 'monitors'],
  ['Harbor Bridge Sensor Array B', 'monitors'],
  ['Substation Gamma', 'powers'],
  ['Harbor Seawall Section A', 'supports'],
];
export const CASES = [
  { name: 'Bridge structural triage', asset: 'Harbor Bridge', q: 'What recent issues have been reported on Harbor Bridge?', icon: 'foundation' as IconName },
  { name: 'Substation cascading outage', asset: 'Substation Gamma', q: 'What evidence points to electrical instability at Substation Gamma?', icon: 'nodes' as IconName },
  { name: 'Pipeline leak response', asset: 'Pipeline North-7', q: 'What leak or pressure evidence affects Pipeline North-7?', icon: 'clock' as IconName },
];

export function AgentSees(p: L2Props) {
  const step = p.step ?? 1;
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <L2Page testId="l2-sees" {...p}>
      <Swap k={step}>
        {step === 1 ? (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)', gridTemplateRows: 'auto 1fr', gap: 18, minHeight: 0 }}>
            <motion.div data-part={1} {...fadeUp(0.2)} style={{ gridColumn: '1 / 3', ...card(true), background: TINT, opacity: lit(1) ? 1 : 0.4, padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <Num n={1} on={lit(1)} size={34} />
              <span style={capTeal}>Asset row + JSON specs</span>
              <span style={{ ...mono(28, INK), fontWeight: 700 }}>Harbor Bridge</span>
              {['bridge', 'criticality 5', 'Harbor District', 'span 485 m'].map((c) => (
                <Chip key={c} style={{ fontSize: 19 }}>{c}</Chip>
              ))}
            </motion.div>
            <motion.div data-part={2} {...fadeUp(0.6)} style={{ ...card(), padding: '14px 20px', opacity: lit(2) ? 1 : 0.4, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Num n={2} on={lit(2)} size={34} />
                <span style={cap}>Most recent evidence</span>
              </div>
              {RECENT.map((r, i) => (
                <motion.div key={r.d} {...fadeUp(0.8 + i * 0.15)} style={{ flex: 1, display: 'grid', gridTemplateColumns: '130px 100px minmax(0, 1fr)', gap: 12, alignItems: 'center', fontSize: 21, lineHeight: 1.35 }}>
                  <span style={mono(16, DIM)}>{r.d}</span>
                  <span style={{ ...mono(15, r.sev === 'critical' ? '#fff' : DIM), background: r.sev === 'critical' ? '#4a5560' : 'rgba(127,127,127,0.15)', borderRadius: 5, padding: '1px 7px', textAlign: 'center' }}>{r.sev}</span>
                  <span style={{ color: INK }}>{r.t}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div data-part={3} {...fadeUp(1.2)} style={{ ...card(), padding: '14px 20px', opacity: lit(3) ? 1 : 0.4, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Num n={3} on={lit(3)} size={34} />
                <span style={cap}>Graph edges into the bridge</span>
              </div>
              {EDGES.map(([from, rel], i) => (
                <motion.div key={from} {...fadeUp(1.4 + i * 0.15)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, color: INK }}>
                  <span style={{ flex: 1 }}>{from}</span>
                  <span style={{ color: TEAL }}>→</span>
                  <Chip style={{ fontSize: 16 }}>{rel}</Chip>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: '1fr auto', gap: 22, minHeight: 0 }}>
            {CASES.map((c, i) => (
              <motion.div key={c.name} data-case={c.asset} data-active={i === 0} {...fadeUp(0.2 + i * 0.35)} style={{ ...card(i === 0), background: i === 0 ? TINT : SOFT, opacity: lit(i + 1) ? 1 : 0.4, padding: '22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Num n={i + 1} on={lit(i + 1)} size={32} />
                  <span style={{ padding: '3px 12px', borderRadius: 999, fontSize: 16, fontWeight: 700, background: i === 0 ? TEAL : 'rgba(127,127,127,0.18)', color: i === 0 ? '#fff' : DIM }}>{i === 0 ? 'active' : 'one setting'}</span>
                </div>
                <LineIcon name={c.icon} size={72} color={i === 0 ? TEAL : '#8a97a3'} />
                <div style={{ fontSize: 28, fontWeight: 700, color: INK }}>{c.name}</div>
                <div style={{ ...mono(20, i === 0 ? TEAL_D : DIM) }}>{c.asset}</div>
                <div style={{ fontSize: 20, color: '#fff', background: 'rgba(31,42,51,0.9)', borderRadius: 14, padding: '12px 16px', lineHeight: 1.35 }}>“{c.q}”</div>
              </motion.div>
            ))}
            <motion.div data-switch {...fadeUp(1.4)} style={{ gridColumn: '1 / 4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: lit(4) ? 1 : 0.4 }}>
              <Num n={4} on={lit(4)} size={32} />
              <span style={{ fontSize: 21, color: INK }}>One setting picks the case:</span>
              <Chip style={{ fontSize: 20 }}>ACTIVE_SCENARIO = SCENARIOS[0]</Chip>
            </motion.div>
          </div>
        )}
      </Swap>
    </L2Page>
  );
}

/* ---------------- §0.10 · is the model awake? (0.6) ---------------- */

export function ModelAwake(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-awake" {...p}>
      <StepRow
        focusN={focusN}
        steps={[
          {
            title: 'Which model, where, how random',
            body: (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                  <Net w={190} live />
                </div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>The language model, on its own local server</div>
                <Chip style={{ fontSize: 19, alignSelf: 'flex-start' }}>temperature=0</Chip>
                <div style={{ fontSize: 19, color: DIM }}>no randomness: the same question gets the same answer</div>
              </>
            ),
          },
          {
            title: 'A one-word test',
            body: (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                  <LineIcon name="speech" size={110} />
                </div>
                <div style={{ fontSize: 23, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 14, padding: '14px 18px', lineHeight: 1.4 }}>“Respond with exactly the single word READY.”</div>
              </>
            ),
          },
          {
            title: 'The reply',
            body: (
              <>
                <motion.div {...fadeUp(1.8)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: TEAL, color: '#fff', fontSize: 64, fontWeight: 700, letterSpacing: '0.08em', minHeight: 140 }}>
                  READY
                </motion.div>
                <Saved>Reply: ’READY’ ✓ reachable</Saved>
              </>
            ),
          },
        ]}
      />
    </L2Page>
  );
}

