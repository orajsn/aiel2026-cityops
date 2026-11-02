import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { WidePanel } from '../WidePanel';
import { Avatar, CARD, Clip, Chip, DbIcon, DIM, Flow, FlowDown, GREY, HandsOn, MONO, PdfIcon, SOFT, Shield, Spark, SteelPhoto, Switch, TEAL, TEAL_D, TINT, cap, capTeal, card, fade, fadeUp, mono, Fill } from './parts';
import type { Lab1Props } from './parts';

/**
 * Lab 1 · AI Economics, the assistant and its data (V2, from the real workshop guide).
 *   L1Assistant  1.3   one question through OCI Enterprise AI: check, pick the model, look it up, answer with sources
 *   L1App        1.3a  Seer Construction Intelligence: the runtime bar, Try a prompt, Runtime configuration
 *                      (one red element: the Guardrail challenge button)
 *   L1Specs      1.4   Hands-on 1: Object Storage, data sync, vector store, file_search, an answer that cites
 *   L1Suppliers  1.5   Hands-on 2: semantic store, NL2SQL, the project-scope SQL check (its one red element), ADB MCP Server
 */

/** the supplier fields the guide's Supplier recommendation prints; never sample values */
export const SUPPLIER_FIELDS = ['supplier', 'recommendation status', 'fit score', 'risk level', 'explanation'];
export const TRY_A_PROMPT = ['Specification requirements', 'Supplier recommendation', 'Guardrail challenge'];

const Bar = ({ w, h = 9 }: { w: number | string; h?: number }) => <span style={{ display: 'block', width: w, height: h, borderRadius: h, background: 'rgba(138,151,163,0.3)' }} />;
const Num = ({ n }: { n: number }) => <span style={{ fontWeight: 700 }}>{n} ·</span>;

/* ---------- 1.3 · one assistant ---------- */

function Box({ title, ho, children, style, ...rest }: { title: ReactNode; ho: number; children: ReactNode; style?: CSSProperties } & Record<string, unknown>) {
  return (
    <div {...rest} style={{ ...card(), borderColor: 'rgba(27,138,156,0.35)', background: CARD, padding: '12px 16px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        <HandsOn n={ho} solid />
      </div>
      {children}
    </div>
  );
}

export function L1Assistant({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-assistant" kickerColor="var(--teal)">
      <Fill max={1.25}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 270fr) 34px minmax(0, 880fr) 34px minmax(0, 236fr)', alignItems: 'stretch', columnGap: 4, marginTop: 8, flex: 1 }}>
        {/* the app */}
        <motion.div data-app {...fadeUp(0.2)} style={{ borderRadius: 12, background: '#1f2a33', color: '#e6e9ef', padding: '16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...cap, color: '#aab4bf', fontSize: 15 }}>The app</span>
            <HandsOn n={3} solid />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Seer Construction Intelligence</div>
          <div style={{ background: '#fff', color: '#1f2a33', borderRadius: 8, padding: '8px 10px', fontSize: 18 }}>“Which supplier is ready?”</div>
          <div style={{ background: '#fff', color: '#1f2a33', borderRadius: 8, padding: '6px 10px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SteelPhoto w={42} label={false} />
            or attach a delivery photo
          </div>
          <div style={{ fontSize: 16, color: '#aab4bf', marginTop: 6 }}>scoped to one project code</div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={32} delay={0.9} loop />
        </div>

        {/* OCI Enterprise AI */}
        <motion.div data-oci {...fadeUp(0.5)} style={{ ...card(true), background: TINT, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 23, fontWeight: 700, color: TEAL_D }}>OCI Enterprise AI</span>
            <span style={{ fontSize: 17, color: DIM }}>one project, one API</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Box data-step="check" title={<><Num n={1} /> Check the request</>} ho={5}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Shield size={60} />
                <div style={{ fontSize: 18, color: 'var(--ink)', lineHeight: 1.35 }}>
                  <div style={mono(18)}>ApplyGuardrails</div>
                  blocks prompt injection <b>before</b> the model
                </div>
              </div>
            </Box>
            <Box data-step="route" title={<><Num n={2} /> Pick the model</>} ho={4}>
              {[
                ['text', 'the lower-cost model', false],
                ['image', 'the multimodal model', true],
              ].map(([k, m, solid]) => (
                <div key={String(k)} data-route={String(k)} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 64, padding: '3px 0', textAlign: 'center', borderRadius: 6, background: SOFT, fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{String(k)}</span>
                  <Flow w={30} delay={1.6} />
                  <span style={{ padding: '3px 10px', borderRadius: 6, border: `2px solid ${TEAL}`, background: solid ? TEAL : CARD, color: solid ? '#fff' : TEAL_D, fontSize: 18, fontWeight: 700 }}>{String(m)}</span>
                </div>
              ))}
            </Box>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FlowDown h={22} delay={2} />
            <span style={capTeal}>3 · Look it up</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
            <Box data-store="vector" title="Vector store" ho={1} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, color: 'var(--ink)' }}>
                <Chip style={{ background: '#1f2a33', color: '#fff' }}>file_search</Chip>
                finds the passage
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '14px 0 12px' }}>
                <div style={{ display: 'grid', gap: 5 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} style={{ width: 84, height: 13, borderRadius: 3, border: `1.5px solid ${TEAL}`, background: TINT }} />
                  ))}
                </div>
                <svg width="92" height="56" viewBox="0 0 46 28" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <circle key={i} cx={6 + (i % 4) * 11} cy={i < 4 ? 6 : 20} r={4} fill={TEAL} />
                  ))}
                </svg>
              </div>
              <div style={{ borderRadius: 8, background: SOFT, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, color: 'var(--ink)' }}>
                <PdfIcon size={30} />
                <b>Object Storage bucket</b>
                <Flow w={26} delay={2.4} />
                <span style={{ color: DIM }}>data sync connector</span>
              </div>
            </Box>
            <Box data-store="semantic" title="Semantic store" ho={2} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, color: 'var(--ink)' }}>
                <Chip style={{ background: '#1f2a33', color: '#fff' }}>NL2SQL</Chip>
                asks the database in plain words
              </div>
              <div style={{ display: 'grid', gap: 5, padding: '14px 0 10px', justifyItems: 'center' }}>
                {[0, 1, 2].map((r) => (
                  <div key={r} style={{ display: 'flex', gap: 5 }}>
                    {[0, 1, 2, 3].map((c) => (
                      <span key={c} style={{ width: 52, height: 13, borderRadius: 3, background: r === 0 ? TEAL : TINT, border: `1.5px solid ${TEAL}` }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: TEAL_D, margin: '0 0 10px' }}>✓ SQL checked: it cannot reach other projects</div>
              <div style={{ borderRadius: 8, background: SOFT, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, color: 'var(--ink)' }}>
                <DbIcon size={28} />
                <b>Autonomous AI Database</b>
                <Flow w={26} delay={2.6} />
                <span style={{ color: DIM }}>ADB MCP Server</span>
              </div>
            </Box>
          </div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={32} delay={3} />
        </div>

        {/* the answer */}
        <motion.div data-answer {...fadeUp(3)} style={{ ...card(true), background: TINT, padding: '16px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
          <div style={capTeal}>The answer</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 19, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
            <PdfIcon size={34} />
            cites the specification
          </div>
          <div data-engineer style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>
            <Avatar who="engineer" size={64} />
            the engineer decides
          </div>
        </motion.div>
      </div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 1.3a · meet the app ---------- */

export const SWITCHES = [
  { name: 'Specification search', sub: 'search the specification', ho: 1 },
  { name: 'Governed project data', sub: 'query the supplier data', ho: 2 },
  { name: 'Model routing', sub: 'text to the lower-cost model', ho: 4 },
  { name: 'Prompt-injection protection', sub: 'check every request first', ho: 5 },
];

const tag = (bold = false): CSSProperties => ({ padding: '4px 10px', borderRadius: 6, background: CARD, fontSize: 15, fontWeight: bold ? 700 : 600, color: bold ? TEAL_D : 'var(--ink)', whiteSpace: 'nowrap' });

export function L1App({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-app" kickerColor="var(--teal)">
      <Fill>
      <motion.div data-window="app" {...fadeUp(0.2)} style={{ marginTop: 4, borderRadius: 12, border: '2px solid var(--line)', overflow: 'hidden', background: CARD }}>
        {/* the browser bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(138,151,163,0.18)' }}>
          {[0, 1, 2].map((i) => (
            <i key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: GREY, opacity: 0.6 }} />
          ))}
          <span style={{ marginLeft: 14, padding: '3px 12px', borderRadius: 6, background: CARD, ...mono(13, 'var(--ink)') }}>http://&lt;application-url&gt;:8080/</span>
        </div>
        {/* the app header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--line)' }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: TEAL }} />
          <span style={{ fontSize: 21, fontWeight: 700, color: 'var(--ink)' }}>Seer Construction Intelligence</span>
          <HandsOn n={3} />
          <span style={{ fontSize: 14, color: DIM }}>you get it running in Hands-on 3</span>
          <span data-scope style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, background: TINT, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
            Project code · <span style={mono(13)}>&lt;one project&gt;</span>
          </span>
          <span style={{ fontSize: 13, color: DIM }}>answers stay inside this project</span>
        </div>
        {/* the runtime bar */}
        <div data-runtime-bar style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', background: TINT, borderBottom: '1px solid var(--line)' }}>
          <span style={{ ...cap, fontSize: 12 }}>Runtime bar</span>
          <span style={tag()}>
            model · <i style={{ color: DIM }}>the model that answered</i>
          </span>
          <span style={tag(true)}>Routing enabled</span>
          <span style={tag(true)}>Guardrails enabled</span>
          <span style={{ marginLeft: 'auto' }}>
            <HandsOn n={4} solid />
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px' }}>
          {/* the chat */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, borderRight: '1px solid var(--line)' }}>
            <motion.div {...fadeUp(0.8)} style={{ alignSelf: 'flex-end', padding: '6px 12px', borderRadius: 8, background: SOFT, fontSize: 16, color: 'var(--ink)' }}>
              the <b>Specification requirements</b> sample question
            </motion.div>
            <motion.div data-reply="spec" {...fadeUp(1.1)} style={{ width: '88%', border: '1.5px solid var(--line)', borderRadius: 8, padding: '10px 14px', display: 'grid', gap: 7 }}>
              <Bar w="92%" />
              <Bar w="74%" />
              <Bar w="54%" />
              <span style={{ justifySelf: 'start', padding: '2px 9px', borderRadius: 999, border: `1.5px solid ${TEAL}`, fontSize: 13, fontWeight: 700, color: TEAL_D }}>cites the specification ✓</span>
            </motion.div>
            <motion.div {...fadeUp(1.5)} style={{ alignSelf: 'flex-end', padding: '6px 12px', borderRadius: 8, background: SOFT, fontSize: 16, color: 'var(--ink)' }}>
              the <b>Supplier recommendation</b> sample question
            </motion.div>
            <motion.div data-reply="supplier" {...fadeUp(1.8)} style={{ width: '88%', border: '1.5px solid var(--line)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 0.9fr 0.9fr 1.1fr', gap: 12 }}>
                {SUPPLIER_FIELDS.map((f) => (
                  <div key={f} data-field={f} style={{ display: 'grid', gap: 6 }}>
                    <span style={mono(13, 'var(--ink)')}>{f}</span>
                    <Bar w="100%" h={7} />
                    <Bar w="100%" h={7} />
                  </div>
                ))}
              </div>
              <span style={{ display: 'inline-block', marginTop: 8, padding: '2px 9px', borderRadius: 999, border: `1.5px solid ${TEAL}`, fontSize: 13, fontWeight: 700, color: TEAL_D }}>from governed project data ✓</span>
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--line)', borderRadius: 8, padding: '7px 10px' }}>
              <Clip />
              <span style={{ fontSize: 15, color: DIM }}>Ask about the project, or attach a photo</span>
              <span style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: 6, background: TEAL, color: '#fff', fontSize: 14, fontWeight: 700 }}>Submit</span>
            </div>
            <div data-try style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DIM }}>Try a prompt</span>
              {TRY_A_PROMPT.map((t, i) => (
                <span key={t} data-prompt={t} style={{ padding: '5px 12px', borderRadius: 6, border: `1.5px solid ${i === 2 ? 'var(--red)' : 'var(--line)'}`, color: i === 2 ? 'var(--red)' : 'var(--ink)', fontSize: 15, fontWeight: i === 2 ? 700 : 500 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {/* Runtime configuration */}
          <div data-config style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
              <span style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>Runtime configuration</span>
              <span style={{ fontSize: 13, color: DIM }}>Launch path</span>
            </div>
            {SWITCHES.map((s, i) => (
              <motion.div
                key={s.name}
                data-config-switch={s.ho}
                initial={{ backgroundColor: 'rgba(27,138,156,0)' }}
                animate={{ backgroundColor: ['rgba(27,138,156,0)', 'rgba(27,138,156,0.12)', 'rgba(27,138,156,0)'] }}
                transition={{ delay: 4 + i * 1.6, duration: 1.6, repeat: Infinity, repeatDelay: SWITCHES.length * 1.6 - 1.6 + 2, ease: 'easeInOut' }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 6px', borderBottom: '1px solid var(--line)' }}
              >
                <Switch on delay={1.2 + i * 0.6} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: DIM }}>{s.sub}</div>
                </div>
                <HandsOn n={s.ho} solid />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 1.4 · Hands-on 1: what the specifications require ---------- */

export const SPEC_ANSWER = ['surface preparation', 'materials', 'inspection and acceptance'];
export const READY_WHEN: [string, string][] = [
  ['data sync job', 'Succeeded'],
  ['vector store', 'Completed'],
  ['processed files', '1'],
];

function Bucket() {
  return (
    <svg width="86" height="86" viewBox="0 0 86 86" aria-hidden="true">
      <ellipse cx="43" cy="14" rx="36" ry="9" fill={CARD} stroke={TEAL_D} strokeWidth={3} />
      <path d="M7 14l8 62c1 5 13 8 28 8s27-3 28-8l8-62" fill={CARD} stroke={TEAL_D} strokeWidth={3} />
      <g transform="translate(29 28)">
        <PdfIcon size={36} />
      </g>
    </svg>
  );
}

export function L1Specs({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-specs" kickerColor="var(--teal)">
      <Fill>
      <div style={{ display: 'grid', gridTemplateColumns: '232px 120px 1fr', alignItems: 'stretch', columnGap: 8, marginTop: 4 }}>
        <motion.div data-source="object-storage" {...fadeUp(0.2)} style={{ ...card(), borderColor: 'rgba(27,138,156,0.35)', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6 }}>
          <Bucket />
          <div style={{ fontSize: 21, fontWeight: 700, color: 'var(--ink)' }}>Object Storage</div>
          <div style={{ fontSize: 14, color: DIM, lineHeight: 1.35 }}>the bucket already holds the structural engineering specification</div>
          <Chip style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>seer-construction-evidence-…</Chip>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEAL_D }}>data sync</span>
          <Flow w={110} delay={0.8} loop />
          <span style={mono(12, DIM)}>construction-evidence</span>
        </div>
        <motion.div data-project {...fade(0.4)} style={{ borderRadius: 14, border: `2px dashed ${TEAL}`, padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={capTeal}>OCI Enterprise AI project</span>
            <Chip style={{ fontSize: 13 }}>seer-construction</Chip>
            <span style={{ fontSize: 13, color: DIM }}>keeps the retention settings for responses and conversations</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 104px 1fr', gap: 6, flex: 1 }}>
            <motion.div data-store="vector" {...fadeUp(0.8)} style={{ ...card(true), padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>Unstructured vector store</div>
              <Chip style={{ fontSize: 12 }}>seer-construction-evidence</Chip>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <PdfIcon size={40} />
                  <div style={{ ...cap, fontSize: 10 }}>the PDF</div>
                </div>
                <span style={{ color: TEAL, fontSize: 18 }}>→</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'grid', gap: 3 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <motion.span key={i} {...fadeUp(1.2 + i * 0.15)} style={{ display: 'block', width: [70, 56, 66, 50][i], height: 8, borderRadius: 2, border: `1.5px solid ${TEAL}`, background: TINT }} />
                    ))}
                  </div>
                  <div style={{ ...cap, fontSize: 10, marginTop: 3 }}>chunks</div>
                </div>
                <span style={{ color: TEAL, fontSize: 18 }}>→</span>
                <div style={{ textAlign: 'center' }}>
                  <svg width="76" height="40" viewBox="0 0 76 40" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, i) => (
                      <motion.circle key={i} cx={6 + (i % 6) * 13} cy={6 + Math.floor(i / 6) * 13} r={4.5} fill={TEAL} {...fade(1.8 + i * 0.04)} opacity={i % 4 === 1 ? 0.45 : 1} />
                    ))}
                  </svg>
                  <div style={{ ...cap, fontSize: 10 }}>embeddings</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: DIM, textAlign: 'center', lineHeight: 1.3 }}>the service splits the file into chunks and turns each into an embedding</div>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <span style={{ ...mono(14), fontWeight: 700 }}>file_search</span>
              <Flow w={70} delay={2.4} />
            </div>
            <motion.div data-ai-card {...fadeUp(1.4)} style={{ ...card(), borderColor: 'rgba(27,138,156,0.35)', background: CARD, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Spark size={32} />
              <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>AI assistant</div>
              <div style={{ fontSize: 13, color: DIM, textAlign: 'center', lineHeight: 1.3 }}>
                searches the store with the <b style={mono(13)}>file_search</b> tool, through the Responses API
              </div>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} data-passage {...fadeUp(2.8 + i * 0.25)} style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px', borderRadius: 6, background: TINT, fontSize: 13, color: 'var(--ink)' }}>
                  <span>• matching passage</span>
                  <b style={{ color: TEAL_D }}>from the spec</b>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '520px 50px 1fr', alignItems: 'stretch', gap: 10, marginTop: 14 }}>
        <motion.div data-question="spec" {...fadeUp(1)} style={{ ...card(), border: 'none', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar who="engineer" size={56} />
            <div style={{ fontSize: 13, fontWeight: 600, color: DIM }}>the engineer</div>
          </div>
          <div>
            <div style={{ ...cap, fontSize: 12 }}>Try a prompt › Specification requirements</div>
            <div style={{ fontSize: 21, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.3 }}>“What does the specification require for this repair?”</div>
          </div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={46} delay={3.2} />
        </div>
        <motion.div data-answer {...fadeUp(3.4)} style={{ ...card(true), padding: '10px 18px' }}>
          <div style={{ ...capTeal, marginBottom: 4 }}>The answer · every point from the specification</div>
          {SPEC_ANSWER.map((a, i) => (
            <motion.div key={a} data-cites={a} {...fadeUp(3.6 + i * 0.3)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderTop: '1px solid var(--line)', fontSize: 18, color: 'var(--ink)' }}>
              <span>
                What the specification requires for <b>{a}</b>
              </span>
              <span style={{ padding: '2px 8px', borderRadius: 6, background: TINT, fontSize: 13, fontWeight: 700, color: TEAL_D, whiteSpace: 'nowrap' }}>cites the specification ↗</span>
            </motion.div>
          ))}
          <div style={{ fontSize: 15, color: DIM, marginTop: 4 }}>Not in the specification? It says so. It does not invent a requirement.</div>
        </motion.div>
      </div>

      <div data-ready style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <span style={cap}>Ready when</span>
        {READY_WHEN.map(([k, v], i) => (
          <motion.span key={k} {...fadeUp(4.6 + i * 0.2)} style={{ padding: '5px 14px', borderRadius: 999, border: '1.5px solid rgba(27,138,156,0.45)', background: TINT, fontSize: 17, color: 'var(--ink)' }}>
            {k} <b style={{ color: TEAL_D }}>{v}</b>
          </motion.span>
        ))}
      </div>
      </Fill>
    </WidePanel>
  );
}

/* ---------- 1.5 · Hands-on 2: which supplier is ready ---------- */

function TableIcon() {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" stroke={TEAL} strokeWidth={2.6} aria-hidden="true">
      <rect x="2" y="4" width="56" height="40" rx="4" />
      <path d="M2 16h56M2 30h56M22 4v40M40 4v40" />
      <circle cx="56" cy="6" r="6" fill={TEAL} stroke="#fff" strokeWidth={1.5} />
      <path d="M53 6l2 2 4-4" stroke="#fff" strokeWidth={1.8} />
    </svg>
  );
}

const STEP: CSSProperties = { ...card(), borderColor: 'rgba(27,138,156,0.35)', background: CARD, padding: '14px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6 };

/** what a supplier recommendation looks like: generic labels, the real values come from the lab's governed views */
const SAMPLE_ROWS: string[][] = [
  ['Supplier A', 'recommended', 'high', 'low', 'certified for this repair, delivered on time on similar work'],
  ['Supplier B', 'conditional', 'medium', 'medium', 'certification renewal pending'],
  ['Supplier C', 'not recommended', 'low', 'high', 'two late deliveries on past orders'],
];

export function L1Suppliers({ kicker, message, notebook }: Lab1Props) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-suppliers" kickerColor="var(--teal)">
      <Fill>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 1fr 30px 1fr 30px 1fr 30px 1fr', alignItems: 'stretch', columnGap: 4, marginTop: 4, flex: 1, minHeight: 290 }}>
        <motion.div data-question="supplier" {...fadeUp(0.2)} style={{ ...card(), border: 'none', padding: '18px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <Avatar who="project manager" size={76} />
          <div style={{ fontSize: 17, fontWeight: 600, color: DIM }}>the project manager</div>
          <div style={{ ...cap, fontSize: 13 }}>Try a prompt › Supplier recommendation</div>
          <div style={{ fontSize: 23, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.3 }}>“Which suppliers do you recommend for this project?”</div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={28} delay={0.8} head={false} />
        </div>
        <motion.div data-step="semantic" {...fadeUp(0.6)} style={{ ...STEP, justifyContent: 'center' }}>
          <div style={{ transform: 'scale(1.5)', margin: '10px 0' }}><TableIcon /></div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>Semantic store</div>
          <Chip style={{ fontSize: 15 }}>seer-construction-semantic</Chip>
          <div style={{ fontSize: 18, color: DIM, lineHeight: 1.4 }}>knows what each governed view and column means (semantic enrichment)</div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={28} delay={1.4} head={false} />
        </div>
        <motion.div data-step="nl2sql" {...fadeUp(1)} style={{ ...STEP, justifyContent: 'center' }}>
          <div style={{ ...mono(28), fontWeight: 700 }}>NL2SQL</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>Question → SQL</div>
          <div style={{ alignSelf: 'stretch', textAlign: 'left', borderRadius: 6, background: SOFT, padding: '10px 14px', ...mono(17, 'var(--ink)'), lineHeight: 1.7 }}>
            SELECT …<br />
            FROM …<br />
            WHERE <b style={{ color: TEAL_D }}>this project</b>
          </div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={28} delay={2} head={false} />
        </div>
        <motion.div data-step="sql-check" {...fadeUp(1.4)} style={{ ...STEP, borderColor: TEAL, justifyContent: 'center' }}>
          <Shield size={64} />
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>SQL check</div>
          <div style={{ fontSize: 18, color: DIM, lineHeight: 1.4 }}>the app checks the SQL stays inside this one project</div>
          <motion.div data-blocked {...fadeUp(2.4)} style={{ alignSelf: 'stretch', borderRadius: 6, border: '1.5px solid var(--red)', color: 'var(--red)', padding: '6px 10px', fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>
            × SQL that widens to other projects
          </motion.div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flow w={28} delay={2.6} head={false} />
        </div>
        <motion.div data-step="mcp" {...fadeUp(1.8)} style={{ ...STEP, justifyContent: 'center' }}>
          <DbIcon size={66} />
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>ADB MCP Server</div>
          <div style={{ fontSize: 18, color: DIM, lineHeight: 1.4 }}>runs it on the Autonomous AI Database, schema</div>
          <span style={{ ...mono(15), fontWeight: 700 }}>CONSTRUCTION_ENGINEERING</span>
        </motion.div>
      </div>

      {/* the answer comes back */}
      <svg width="100%" height="34" viewBox="0 0 1420 34" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block' }}>
        <motion.path d="M1290 0v16H140v18" fill="none" stroke={TEAL} strokeWidth={2.5} strokeDasharray="4 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3, duration: 1.2 }} />
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 18 }}>
        <motion.div data-answer {...fadeUp(3.6)} style={{ ...card(true), padding: '18px 26px' }}>
          <div style={{ ...capTeal, marginBottom: 12, fontSize: 15 }}>The answer · from governed data, with its evidence <span style={{ color: DIM, fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>· sample answer, the shape of the real output</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.8fr 0.8fr 2.2fr', columnGap: 28, rowGap: 14 }}>
            {SUPPLIER_FIELDS.map((f) => (
              <span key={f} data-field={f} style={mono(17, TEAL_D)}>
                {f}
              </span>
            ))}
            {SAMPLE_ROWS.flatMap((row, r) =>
              row.map((v, c) => (
                <motion.span key={`${r}-${c}`} data-sample-cell {...fade(4 + r * 0.3)} style={{ fontSize: 18, color: 'var(--ink)', fontWeight: c === 0 ? 700 : 500, lineHeight: 1.3 }}>
                  {c === 1 ? <Chip style={{ fontSize: 15 }}>{v}</Chip> : v}
                </motion.span>
              )),
            )}
          </div>
        </motion.div>
        <motion.div {...fadeUp(4.4)} style={{ ...card(), border: 'none', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Only what the data says</div>
          <div style={{ fontSize: 19, color: DIM, lineHeight: 1.45 }}>No approval the database does not hold. Values come from the views, not from the model.</div>
        </motion.div>
      </div>
      </Fill>
    </WidePanel>
  );
}
