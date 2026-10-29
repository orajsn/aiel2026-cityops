import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, CARD, ChiefInspector, Chip, DIM, Folder, INK, L2Page, Net, RED, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, useFocusN, type L2Props,
} from './parts';
import { RouteMap } from './RouteMap';
import { Ladder, WhyLayers } from './WhyArt';
import { Bench, SiteCheck } from './BenchArt';
import { CaseFile, ThreeDrills } from './SeesArt';
import { CrackReport, WhatProves } from './StoryArt';

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


export function CrackStory(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-story" hasRed={step === 1} {...p}>
      <Swap k={step}>
        {step < 3 ? (
          step === 1 ? <CrackReport /> : <WhatProves kinds={EVIDENCE.map((e) => e.label)} />
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
  { name: 'Bridge structural triage', asset: 'Harbor Bridge', q: 'What recent issues have been reported on Harbor Bridge?', key: 'recent issues', icon: 'foundation' as IconName },
  { name: 'Substation cascading outage', asset: 'Substation Gamma', q: 'What evidence points to electrical instability at Substation Gamma?', key: 'electrical instability', icon: 'nodes' as IconName },
  { name: 'Pipeline leak response', asset: 'Pipeline North-7', q: 'What leak or pressure evidence affects Pipeline North-7?', key: 'leak or pressure evidence', icon: 'clock' as IconName },
];

export function AgentSees(p: L2Props) {
  const step = p.step ?? 1;
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-sees" {...p}>
      <Swap k={step}>{step === 1 ? <CaseFile recent={RECENT} edges={EDGES} focusN={focusN} /> : <ThreeDrills cases={CASES} focusN={focusN} />}</Swap>
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

