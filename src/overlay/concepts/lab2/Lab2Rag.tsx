import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, ArrowDown, CARD, ChiefInspector, Chip, Db, DIM, Folder, INK, L2Page, Net, Num, Quote, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props,
} from './parts';

/**
 * Lab 2 · §1 RAG, the filing cabinet (the deck's chapter 4): look it up before answering, then the notebook's
 * §1.2 to §1.9 as pictures with numbered steps, and where RAG runs out (a question is not a job).
 */

/* ---------------- 2.2, 2.2a, 2.2b · look it up before answering ---------------- */

const PIPE: { label: string; icon: IconName }[] = [
  { label: 'Question', icon: 'speech' },
  { label: 'Embed', icon: 'nodes' },
  { label: 'Similarity search', icon: 'inspect' },
  { label: 'Top-k into prompt', icon: 'prompt' },
  { label: 'Grounded answer', icon: 'quote' },
];

function Pipeline({ compact }: { compact: boolean }) {
  return (
    <div data-pipeline style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {PIPE.map((s, i) => [
        i > 0 ? <Arrow key={`a${i}`} w={compact ? 40 : 60} delay={0.3 + i * 0.45} loop={i === 4} /> : null,
        <motion.div key={s.label} data-pipe={s.label} {...fadeUp(0.2 + i * 0.45)} style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', alignItems: 'center', gap: compact ? 10 : 12, padding: compact ? '8px 14px' : '18px 18px', ...card(i === 4), background: i === 4 ? TINT : SOFT, minWidth: compact ? 0 : 170 }}>
          <LineIcon name={s.icon} size={compact ? 32 : 60} />
          <span style={{ fontSize: compact ? 19 : 23, fontWeight: 700, color: INK, whiteSpace: 'nowrap' }}>{s.label}</span>
        </motion.div>,
      ])}
    </div>
  );
}

const GRID = Array.from({ length: 72 }, (_, i) => i);
const TOP5 = [6, 17, 27, 39, 52];

export function RagIdea(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-rag" hasRed={step === 2} {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
        <motion.div layout transition={{ duration: 0.5, ease: EASE }}>
          <Pipeline compact={step > 1} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'flex' }}>
            {step === 1 && (
              <div data-cabinet style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 70px 1fr 70px 1fr', alignItems: 'center', gap: 6 }}>
                <motion.div {...fadeUp(2.4)} style={{ ...card(), height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  {/* a filing cabinet: three drawers, one lit */}
                  <svg width="130" height="150" viewBox="0 0 130 150" aria-hidden>
                    <rect x="10" y="6" width="110" height="138" rx="8" fill="rgba(127,127,127,0.15)" stroke="#8a97a3" strokeWidth="3" />
                    {[0, 1, 2].map((i) => (
                      <g key={i}>
                        <rect x="20" y={16 + i * 42} width="90" height="34" rx="4" fill={i === 1 ? 'rgba(27,138,156,0.25)' : 'rgba(127,127,127,0.12)'} stroke={i === 1 ? '#1b8a9c' : '#8a97a3'} strokeWidth="2.5" />
                        <rect x="55" y={30 + i * 42} width="20" height="6" rx="3" fill={i === 1 ? '#1b8a9c' : '#8a97a3'} />
                      </g>
                    ))}
                  </svg>
                  <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>The filing cabinet</div>
                  <div style={{ fontSize: 19, color: DIM }}>every inspection report, labelled</div>
                </motion.div>
                <Arrow w={60} delay={2.8} />
                <motion.div {...fadeUp(3)} style={{ ...card(true), background: TINT, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <Folder size={110} />
                  <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>Pull the right folder</div>
                  <div style={{ fontSize: 19, color: DIM }}>the right report, for this question</div>
                </motion.div>
                <Arrow w={60} delay={3.4} />
                <motion.div {...fadeUp(3.6)} style={{ ...card(), height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <ChiefInspector size={120} grey label="the engineer" />
                  <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>Answer from it</div>
                  <div style={{ fontSize: 19, color: DIM }}>RAG fetches the evidence first</div>
                </motion.div>
              </div>
            )}
            {step === 2 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div data-side="every-file" style={{ ...card(), borderColor: RED, background: 'rgba(199,70,52,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }}>
                  <div style={{ ...cap, color: INK }}>Every file at once</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 26px)', gap: 6 }}>
                    {GRID.map((i) => (
                      <motion.div key={i} {...fade(0.2 + (i % 12) * 0.03)} style={{ width: 26, height: 26, borderRadius: 4, background: 'rgba(127,127,127,0.35)' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 30, fontSize: 21, color: DIM }}>
                    <span>Slow</span>
                    <span>Costly</span>
                    <span>Worse answers</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: RED }}>✗ the answer drowns in noise</div>
                </div>
                <div data-side="top-5" style={{ ...card(true), background: TINT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }}>
                  <div style={capTeal}>Top 5 labelled folders</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 26px)', gap: 6 }}>
                    {GRID.map((i) => (
                      <motion.div key={i} initial={{ opacity: 0.25 }} animate={{ opacity: TOP5.includes(i) ? 1 : 0.18, scale: TOP5.includes(i) ? 1.15 : 1 }} transition={{ delay: 1 + TOP5.indexOf(i) * 0.25, duration: 0.5 }} style={{ width: 26, height: 26, borderRadius: 4, background: TOP5.includes(i) ? TEAL : 'rgba(127,127,127,0.4)' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 30, fontSize: 21, color: DIM }}>
                    <span>Fast</span>
                    <span>Cheap</span>
                    <span>Grounded answers</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: TEAL_D }}>✓ only the right evidence reaches the model</div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                  {[
                    { t: 'Right data', s: 'the reports about this bridge, not every bridge', icon: 'target' as IconName },
                    { t: 'Right moment', s: 'this morning’s inspection, not last year’s', icon: 'clock' as IconName },
                    { t: 'Right amount', s: 'five folders, not the whole cabinet', icon: 'funnel' as IconName },
                  ].map((x, i) => (
                    <motion.div key={x.t} data-pillar={x.t} {...fadeUp(0.3 + i * 0.35)} style={{ ...card(true), background: CARD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: 22 }}>
                      <LineIcon name={x.icon} size={84} />
                      <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>{x.t}</div>
                      <div style={{ fontSize: 21, color: DIM }}>{x.s}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.div {...fadeUp(1.5)} style={{ alignSelf: 'center', padding: '12px 26px', borderRadius: 999, background: 'rgba(31,42,51,0.92)', color: '#fff', fontSize: 24, fontWeight: 600 }}>
                  Bad answer? Check retrieval first.
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.2c · §1.2 the database turns the question into numbers ---------------- */

const BARS = Array.from({ length: 48 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));

export function Embed(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-embed" {...p}>
      <StepRow
        focusN={focusN}
        steps={[
          {
            title: 'Your question, in plain words',
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                <LineIcon name="speech" size={80} />
                <div style={{ fontSize: 26, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 14, padding: '16px 20px' }}>“bearing corrosion on a bridge”</div>
              </div>
            ),
          },
          {
            title: 'Embedding model runs inside Oracle',
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
                <Db size={110} />
                <Chip style={{ fontSize: 22 }}>ALL_MINILM_L12_V2</Chip>
                <div style={{ fontSize: 21, color: DIM }}>no outside service</div>
                <Chip dim style={{ fontSize: 16 }}>VECTOR_EMBEDDING(… USING :q AS data)</Chip>
              </div>
            ),
          },
          {
            title: 'Out come 384 numbers',
            grow: 1.3,
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 3, height: 140 }}>
                    {BARS.map((h, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h * 100}%` }} transition={{ delay: 1.6 + i * 0.02, duration: 0.5, ease: EASE }} style={{ flex: 1, background: TEAL, borderRadius: 2, opacity: 0.85 }} />
                    ))}
                  </div>
                  <motion.span {...fade(2.6)} style={{ fontSize: 76, fontWeight: 700, color: TEAL_D, lineHeight: 1 }}>384</motion.span>
                </div>
                <div style={{ fontSize: 16, color: DIM }}>bars: illustration · 384: saved output</div>
                <Saved>✓ The ALL_MINILM_L12_V2 embedding model is active, and has 384 dimensions.</Saved>
              </div>
            ),
          },
        ]}
      />
    </L2Page>
  );
}

/* ---------------- 2.2d · §1.3 and §1.5 the five folders closest in meaning ---------------- */

/** cell 26's saved output: the five closest chunks for “cracks or corrosion on bridge bearings”, no bridge filter */
export const NEAREST = [
  { asset: 'Riverside Pedestrian Bridge', d: '0.3117' },
  { asset: 'Meridian Overpass', d: '0.3604' },
  { asset: 'Harbor Bridge', d: '0.3963' },
  { asset: 'Harbor Bridge', d: '0.4011' },
  { asset: 'Harbor Bridge', d: '0.4314' },
];
const DOTS: [number, number][] = [[150, 60], [70, 90], [250, 80], [40, 200], [280, 210], [110, 260], [210, 270], [300, 140], [20, 120], [170, 290]];
const NEAR_DOTS: [number, number][] = [[185, 140], [128, 128], [205, 205], [118, 190], [228, 160]];

export function Nearest(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <L2Page testId="l2-nearest" {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 24, minHeight: 0 }}>
        <motion.div data-part={1} {...fadeUp(0.2)} style={{ ...card(focusN === 1), opacity: lit(1) ? 1 : 0.4, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Num n={1} on={lit(1)} />
            <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Measure distance in meaning</span>
          </div>
          <div style={{ alignSelf: 'flex-start', fontSize: 20, color: '#fff', background: TEAL, borderRadius: 999, padding: '6px 16px' }}>“cracks or corrosion on bridge bearings”</div>
          <svg viewBox="0 0 320 320" style={{ flex: 1, minHeight: 0, width: '100%' }} aria-label="the question among the chunks" role="img">
            {[60, 110, 150].map((r) => <circle key={r} cx="165" cy="165" r={r} fill="none" stroke="rgba(27,138,156,0.25)" strokeDasharray="4 6" />)}
            {DOTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="rgba(127,127,127,0.35)" />)}
            {NEAR_DOTS.map(([x, y], i) => (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }}>
                <line x1="165" y1="165" x2={x} y2={y} stroke="#1b8a9c" strokeWidth="1.6" strokeDasharray="3 4" />
                <circle cx={x} cy={y} r="13" fill="#1b8a9c" />
                <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">{i + 1}</text>
              </motion.g>
            ))}
            <path d="M165 147l5 12h13l-10 8 4 13-12-8-12 8 4-13-10-8h13z" fill="#1f2a33" />
          </svg>
          <div style={{ fontSize: 15, color: DIM }}>grey dots: other chunks, not returned · positions illustrative, distances real</div>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <motion.div data-part={2} {...fadeUp(0.6)} style={{ ...card(focusN === 2), opacity: lit(2) ? 1 : 0.4, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Num n={2} on={lit(2)} />
            <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Bridge filter: off</span>
            <Chip dim style={{ fontSize: 18 }}>no WHERE asset_name</Chip>
          </motion.div>
          <motion.div data-part={3} {...fadeUp(1)} style={{ ...card(focusN === 3), opacity: lit(3) ? 1 : 0.4, padding: '12px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Num n={3} on={lit(3)} />
              <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Closest first</span>
            </div>
            {NEAREST.map((r, i) => (
              <motion.div key={i} data-near={r.asset} {...fadeUp(1.3 + i * 0.25)} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 10, background: r.asset === 'Harbor Bridge' ? TINT : 'rgba(127,127,127,0.12)', fontSize: 22 }}>
                <span style={{ ...mono(18, DIM) }}>{i + 1}</span>
                <span style={{ fontWeight: r.asset === 'Harbor Bridge' ? 700 : 500, color: INK }}>{r.asset}</span>
                <span style={mono(19, TEAL_D)}>{r.d}</span>
              </motion.div>
            ))}
            <div style={{ fontSize: 15, color: DIM }}>saved output, cell 26 · cosine distance, smaller is closer</div>
          </motion.div>
          <motion.div data-part={4} {...fadeUp(2.6)} style={{ ...card(focusN === 4), opacity: lit(4) ? 1 : 0.4, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Num n={4} on={lit(4)} />
            <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Keep only k = 5</span>
            <Chip style={{ fontSize: 18 }}>FETCH FIRST :k ROWS ONLY</Chip>
          </motion.div>
        </div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.3 · §1.6 the rule: answer only from what you were given ---------------- */

export function Rule(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-rule" hasRed {...p}>
      <StepRow
        focusN={focusN}
        steps={[
          {
            title: 'Answer only from the folder',
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
                <Folder size={100} />
                <Quote style={{ fontSize: 20 }}>System rule: use ONLY the facts in &lt;context&gt;</Quote>
              </div>
            ),
          },
          {
            title: 'If missing, say so',
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                <div style={{ fontSize: 22, color: DIM }}>question not covered</div>
                <ArrowDown h={40} />
                <div style={{ fontSize: 30, fontWeight: 700, color: INK, padding: '14px 18px', borderRadius: 14, background: TINT, textAlign: 'center' }}>“I don’t know”</div>
                <div style={{ fontSize: 21, color: DIM, textAlign: 'center' }}>instead of a guess</div>
              </div>
            ),
          },
          {
            title: 'Folder text is data',
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                <div style={{ position: 'relative', padding: '22px 18px', borderRadius: 12, border: `2px solid ${TEAL}`, background: CARD }}>
                  <div style={{ ...mono(18) }}>&lt;context&gt;</div>
                  <div style={{ fontSize: 21, color: INK, margin: '10px 0' }}>retrieved inspection notes</div>
                  <div style={{ ...mono(18) }}>&lt;/context&gt;</div>
                  <motion.div data-sticky initial={{ opacity: 0, rotate: 0, y: -10 }} animate={{ opacity: 1, rotate: 4, y: 0 }} transition={{ delay: 2, duration: 0.5 }} style={{ position: 'absolute', right: 12, top: 30, padding: '10px 14px', background: '#f6f1df', border: `2px solid ${RED}`, borderRadius: 4, fontSize: 19, color: '#1f2a33', boxShadow: '0 3px 8px rgba(0,0,0,0.2)' }}>
                    “ignore your rules”
                  </motion.div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_D }}>treated as data, never as an order</div>
                <div style={{ fontSize: 15, color: DIM }}>sticky note: illustration</div>
              </div>
            ),
          },
        ]}
      />
    </L2Page>
  );
}

/* ---------------- 2.3a · §1.7–1.8 RAG plumbing, by hand then LangChain ---------------- */

export function Plumbing(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-plumbing" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <StepRow
          focusN={focusN}
          steps={[
            {
              title: 'Fetch the folders',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Folder size={62} />
                    <Folder size={62} />
                    <Folder size={62} />
                  </div>
                  <Chip>retrieve_context</Chip>
                  <span style={{ fontSize: 18, color: DIM }}>§1.3</span>
                </div>
              ),
            },
            {
              title: 'Write the brief',
              body: <Quote style={{ fontSize: 18, flex: 1 }}>{'<context>\n[1] asset=…\n[2] asset=…\n</context>\n\nQuestion: …'}</Quote>,
            },
            {
              title: 'One call to the model',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 14 }}>
                  <Net w={150} live />
                  <Chip>POST /api/chat</Chip>
                  <span style={{ fontSize: 18, color: DIM }}>by hand · §1.7</span>
                </div>
              ),
            },
            {
              title: 'Same path, one pipe',
              grow: 1.25,
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                    <Chip style={{ fontSize: 19 }}>rag_prompt</Chip>
                    <b style={{ ...mono(24, TEAL) }}>|</b>
                    <Chip style={{ fontSize: 19 }}>llm</Chip>
                    <b style={{ ...mono(24, TEAL) }}>|</b>
                    <Chip style={{ fontSize: 19 }}>StrOutputParser()</Chip>
                  </div>
                  <span style={{ fontSize: 18, color: DIM }}>LangChain · §1.8</span>
                  <Saved>✓ LangChain RAG chain ready: rag_prompt, rag_chain, rag_answer</Saved>
                </div>
              ),
            },
          ]}
        />
        <motion.div {...fadeUp(2.8)} style={{ alignSelf: 'center', padding: '10px 24px', borderRadius: 999, border: `2px solid ${TEAL}`, background: TINT, fontSize: 22, fontWeight: 600, color: INK }}>
          LangChain saves two or three lines. <span style={{ color: TEAL_D }}>Grounding is still your job.</span>
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.3b · §1.9 a grounded answer you can check ---------------- */

/** cell 36's saved output: the answer's two claims and the five rows behind it */
export const SOURCES = [
  { src: 'inspection_reports · B', d: '0.3446', t: 'The Harbor Bridge is in sub-optimal condition with moderate localized …' },
  { src: 'inspection_reports · D', d: '0.4043', t: 'Significant structural and corrosion deficiencies were identified that…' },
  { src: 'maintenance_logs · routine', d: '0.4579', t: 'Performed scheduled midspan inspection of Harbor Bridge (span 485 m) a…' },
  { src: 'maintenance_logs · critical', d: '0.4801', t: 'Expansion joint at east approach (EJ-1) failed under high tidal gusts;…', claim: 1 },
  { src: 'inspection_findings · high', d: '0.5071', t: 'Complete blockage of multiple scuppers on the west side resulting in d…', claim: 2 },
];

export function Checkable(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <L2Page testId="l2-check" {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 24, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <motion.div data-part={1} {...fadeUp(0.2)} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: lit(1) ? 1 : 0.4 }}>
            <Num n={1} on={lit(1)} />
            <div style={{ fontSize: 22, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 14, padding: '12px 18px' }}>“What recent issues have been reported on Harbor Bridge?”</div>
          </motion.div>
          <motion.div data-part={2} {...fadeUp(0.6)} style={{ ...card(true), opacity: lit(2) ? 1 : 0.4, flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Num n={2} on={lit(2)} />
              <span style={capTeal}>Answer · saved output</span>
            </div>
            {[
              'Expansion joint at east approach (EJ-1) failed under high tidal gusts, resulting in a 400 mm open gap and exposed reinforcement.…',
              'Complete blockage of multiple scuppers on the west side, causing deck ponding up to 60 mm depth in lane 4 over an approximate 10 m longitudinal ext…',
            ].map((t, i) => (
              <motion.div key={i} data-claim={i + 1} {...fadeUp(1 + i * 0.4)} style={{ display: 'flex', gap: 12, fontSize: 21, lineHeight: 1.4, color: INK }}>
                <span style={{ width: 30, height: 30, flex: 'none', borderRadius: 8, background: TEAL, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{i + 1}</span>
                <span>{t}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div data-part={3} {...fadeUp(1.2)} style={{ ...card(), opacity: lit(3) ? 1 : 0.4, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Num n={3} on={lit(3)} />
            <span style={cap}>Sources used: top-5 rows</span>
          </div>
          {SOURCES.map((s, i) => (
            <motion.div key={i} data-source={i + 1} data-claim-of={s.claim} {...fadeUp(1.5 + i * 0.22)} style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto', gap: 10, alignItems: 'center', padding: '8px 12px', borderRadius: 10, background: s.claim ? TINT : 'rgba(127,127,127,0.10)', border: s.claim ? `2px solid ${TEAL}` : '2px solid transparent' }}>
              <span style={mono(17, DIM)}>{i + 1}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...mono(15, TEAL_D) }}>{s.src}</div>
                <div style={{ fontSize: 17, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.t}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={mono(17, TEAL_D)}>{s.d}</span>
                {s.claim && <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', background: TEAL, borderRadius: 6, padding: '2px 8px' }}>← claim {s.claim}</span>}
              </div>
            </motion.div>
          ))}
          <div style={{ marginTop: 'auto', fontSize: 17, color: DIM }}>Highlighted rows back up claims 1 and 2.</div>
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.4, 2.4a, 2.4b · a question is not a job ---------------- */

function RowLabel({ title, sub }: { title: string; sub: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ ...cap, fontSize: 14 }}>{title}</span>
      <span style={{ fontSize: 22, fontWeight: 600, color: INK, lineHeight: 1.3 }}>{sub}</span>
    </div>
  );
}

export function NotAJob(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-job" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        {/* a lookup */}
        <motion.div data-row="lookup" {...fadeUp(0.2)} style={{ ...card(), padding: '14px 22px', display: 'grid', gridTemplateColumns: '300px 50px 1fr 50px 1fr 50px 1fr', alignItems: 'center', gap: 8 }}>
          <RowLabel title="A lookup" sub="“What does the record say?”" />
          <Arrow w={44} delay={0.5} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Folder size={40} />
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, color: INK }}>1 retrieval</div>
              <div style={{ fontSize: 17, color: DIM }}>find the right folder</div>
            </div>
          </div>
          <Arrow w={44} delay={0.9} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Net w={64} />
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, color: INK }}>1 LLM call</div>
              <div style={{ fontSize: 17, color: DIM }}>answer from it</div>
            </div>
          </div>
          <Arrow w={44} delay={1.3} />
          <div style={{ fontSize: 21, fontWeight: 700, color: TEAL_D }}>Grounded answer · done</div>
        </motion.div>
        {/* a job: three jobs hide inside it */}
        <motion.div data-row="job" {...reveal(upTo(step, 2), 0.2)} style={{ ...card(true), padding: '14px 22px', flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
            <RowLabel title="A job" sub="“What is the status of this bridge?”" />
            <span style={{ fontSize: 19, color: TEAL_D, fontWeight: 600 }}>…hides three jobs ▾</span>
          </div>
          {[
            {
              n: 1, t: 'Recurring?', tag: 'RAG × many', sub: 'many retrievals, then compare',
              pic: (
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Mar', 'Apr', 'Jun', 'Jul'].map((m) => (
                    <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <Folder size={36} />
                      <span style={{ fontSize: 14, color: DIM }}>{m}</span>
                    </div>
                  ))}
                </div>
              ),
              q: 'same failure again?',
            },
            {
              n: 2, t: 'Cross-check work orders', tag: 'RAG again', sub: 'a second, independent lookup',
              pic: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: INK }}>
                  <Chip>Findings</Chip>
                  <span style={{ color: TEAL, fontSize: 24 }}>⇄</span>
                  <Chip>Work orders</Chip>
                </div>
              ),
            },
            {
              n: 3, t: 'Escalate?', tag: 'needs judgment', sub: 'a judgment, not a search',
              pic: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                  <Chip>escalate?</Chip>
                  <span style={{ color: DIM }}>or</span>
                  <Chip dim>monitor</Chip>
                </div>
              ),
            },
          ].map((j, i) => (
            <motion.div key={j.t} data-subjob={j.n} {...reveal(upTo(step, 2), 0.5 + i * 0.35)} style={{ ...card(), background: CARD, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Num n={j.n} size={32} />
                <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>{j.t}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{j.pic}</div>
              <div style={{ fontSize: 18, color: DIM }}>{j.sub}</div>
              <span style={{ alignSelf: 'flex-start', padding: '3px 12px', borderRadius: 999, background: TINT2, color: TEAL_D, fontSize: 16, fontWeight: 700 }}>{j.tag}</span>
            </motion.div>
          ))}
        </motion.div>
        {/* something has to coordinate it */}
        <motion.div data-row="coordinate" {...reveal(upTo(step, 3), 0.2)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '6px 0' }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Something has to coordinate it all:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...card(), padding: '8px 18px' }}>
            <LineIcon name="clipboard" size={40} color="#8a97a3" />
            <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>Checklist</span>
          </div>
          <span style={{ fontSize: 20, color: DIM }}>or</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...card(true), background: TINT, padding: '6px 18px' }}>
            <ChiefInspector size={52} />
            <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>Chief inspector</span>
          </div>
        </motion.div>
      </div>
    </L2Page>
  );
}
