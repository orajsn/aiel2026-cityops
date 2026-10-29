import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { LineIcon } from '../icons';
import { EASE, WidePanel } from '../WidePanel';

/**
 * Lab 1 · AI Economics, the data pages: 1.3 (the assistant and its three engines), 1.4 (Hands-on 1,
 * Unstructured RAG) and 1.5 (Hands-on 2, Semantic Store + NL2SQL). Flat teal/grey drawings, no red,
 * no invented names or numbers: only roles and generic labels.
 */

const GREY = 'var(--ink-dim)';
const MONO = 'JetBrains Mono, monospace';
const TEAL_TINT = 'rgba(27, 138, 156, 0.12)';
const G_LIGHT = 'rgba(138, 145, 156, 0.35)';
const G_MID = '#8a919c';
const G_DARK = '#5c6b78';
const T_SOFT = 'rgba(27, 138, 156, 0.28)';
const T_MID = 'rgba(27, 138, 156, 0.6)';

const label = { fontSize: 15, fontWeight: 700, letterSpacing: 2.4, color: GREY, textTransform: 'uppercase' as const, marginBottom: 12 };

const rise = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5, ease: EASE } });

function Arrow({ delay = 0, w = 60 }: { delay?: number; w?: number }) {
  return (
    <svg width={w} height={22} viewBox={`0 0 ${w} 22`} fill="none" stroke="var(--teal)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <path d={`M2 11H${w - 6}`} strokeDasharray="2 7" />
      <path d={`M${w - 14} 3l9 8-9 8`} />
      <motion.circle cx={6} cy={11} r={4} fill="var(--teal)" stroke="none" initial={{ cx: 6, opacity: 0 }} animate={{ cx: w - 16, opacity: [0, 1, 1, 0] }} transition={{ delay, duration: 0.9, ease: EASE }} />
    </svg>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <motion.span data-tag={text} {...rise(0.2)} style={{ display: 'inline-block', fontSize: 17, fontWeight: 700, letterSpacing: 0.4, padding: '5px 14px', borderRadius: 999, background: 'var(--teal)', color: '#fff' }}>
      {text}
    </motion.span>
  );
}

function Chip({ text }: { text: string }) {
  // a block, so a long source wraps inside its own border
  return <div style={{ display: 'inline-block', fontSize: 17, lineHeight: 1.3, padding: '5px 12px', borderRadius: 7, border: '1.5px solid var(--teal)', background: TEAL_TINT, color: 'var(--ink)' }}>{text}</div>;
}

/** a small database table drawing: header row in teal, `rows` grey rows */
function MiniTable({ w = 70, rows = 3, head = 'var(--teal)' }: { w?: number; rows?: number; head?: string }) {
  const h = 12 + rows * 10;
  return (
    <svg width={w} height={h + 2} viewBox={`0 0 ${w} ${h + 2}`} style={{ flex: 'none' }}>
      <rect x="1" y="1" width={w - 2} height={h} rx="4" fill="rgba(138,145,156,0.18)" stroke={G_MID} strokeWidth={1.5} />
      <path d={`M1 5a4 4 0 0 1 4-4h${w - 10}a4 4 0 0 1 4 4v7H1z`} fill={head} />
      {Array.from({ length: rows }).map((_, i) => (
        <rect key={i} x="7" y={17 + i * 10} width={(w - 14) * (i % 2 ? 0.6 : 0.85)} height="4" rx="2" fill={G_MID} opacity={0.7} />
      ))}
    </svg>
  );
}

/** an illustrated person in a hard hat (flat shapes); `tone` picks the vest/shirt colour */
function Worker({ hat = true, shirt = G_DARK, size = 110 }: { hat?: boolean; shirt?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{ flex: 'none' }}>
      <ellipse cx="55" cy="104" rx="40" ry="4" fill="rgba(127,127,127,0.2)" />
      <path d="M18 104V84c0-16 14-24 37-24s37 8 37 24v20z" fill={shirt} />
      {hat && <path d="M40 104V78l15 12 15-12v26z" fill="var(--teal)" opacity={0.9} />}
      <rect x="48" y="50" width="14" height="14" rx="5" fill="#c98e6b" />
      <circle cx="55" cy="40" r="19" fill="#c98e6b" />
      <path d="M48 41v3M62 41v3" stroke="var(--ink)" strokeWidth={2.4} strokeLinecap="round" />
      <path d="M49 49q6 5 12 0" stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" fill="none" />
      {hat && (
        <>
          <path d="M34 34a21 18 0 0 1 42 0z" fill="var(--teal)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          <rect x="30" y="32" width="50" height="6" rx="3" fill="var(--teal)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          <rect x="51" y="14" width="8" height="12" rx="3" fill="rgba(255,255,255,0.45)" />
        </>
      )}
    </svg>
  );
}

function Bubble({ who, text, delay = 0.3, children }: { who: string; text: string; delay?: number; children: ReactNode }) {
  return (
    <motion.div data-question={who} {...rise(delay)} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {children}
      <div style={{ position: 'relative', fontSize: 22, lineHeight: 1.4, fontStyle: 'italic', padding: '14px 22px', borderRadius: 16, background: 'rgba(127,127,127,0.14)', color: 'var(--ink)', flex: 1 }}>
        <span style={{ position: 'absolute', left: -9, top: '50%', width: 18, height: 18, background: 'rgba(127,127,127,0.14)', transform: 'translateY(-50%) rotate(45deg)' }} />
        <div style={{ fontSize: 15, fontWeight: 700, fontStyle: 'normal', letterSpacing: 2, color: GREY, textTransform: 'uppercase', marginBottom: 4 }}>{who}</div>
        “{text}”
      </div>
    </motion.div>
  );
}

/* ================= 1.3 · the assistant ================= */

const SOURCES = [
  { key: 'PDF files', icon: 'prompt' as const },
  { key: 'Pictures', icon: 'photo' as const },
  { key: 'Database tables', icon: 'database' as const },
];

/** engine 1: a document is scanned, split into chunk strips, embedded as dots, stored */
function VectorAnim() {
  const stage = (i: number) => 0.9 + i * 0.7;
  return (
    <svg data-anim="vector" width="236" height="96" viewBox="0 0 236 96">
      <motion.g {...rise(stage(0))}>
        <rect x="6" y="12" width="40" height="52" rx="4" fill={G_LIGHT} stroke={G_MID} strokeWidth={2} />
        <path d="M13 24h26M13 32h26M13 40h26M13 48h16" stroke={G_DARK} strokeWidth={3} strokeLinecap="round" />
        <motion.rect x="6" width="40" height="4" rx="2" fill="var(--teal)" initial={{ y: 12, opacity: 0 }} animate={{ y: [12, 58, 12], opacity: [0, 1, 0] }} transition={{ delay: stage(0), duration: 1.4, ease: EASE }} />
      </motion.g>
      <motion.g {...rise(stage(1))}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x="68" y={14 + i * 17} width="40" height="12" rx="3" fill={T_SOFT} stroke="var(--teal)" strokeWidth={1.5} />
        ))}
      </motion.g>
      <motion.g {...rise(stage(2))}>
        {[0, 1, 2].map((i) => (
          <motion.circle key={i} cx={134 + (i % 2) * 14} cy={22 + i * 17} r="6" fill="var(--teal)" animate={{ opacity: [1, 0.55, 1] }} transition={{ delay: 4 + i * 0.4, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </motion.g>
      <motion.g {...rise(stage(3))} transform="translate(188 8)">
        <g fill="none" stroke="var(--teal)" strokeWidth={2.3}>
          <ellipse cx="22" cy="10" rx="17" ry="6" fill={T_SOFT} />
          <path d="M5 10v34c0 3.3 7.6 6 17 6s17-2.7 17-6V10M5 24c0 3.3 7.6 6 17 6s17-2.7 17-6" />
        </g>
      </motion.g>
      <path d="M50 38h14M112 38h16M158 38h26" stroke="var(--teal)" strokeWidth={2} strokeDasharray="2 5" strokeLinecap="round" />
      {['scan', 'split', 'embed', 'store'].map((t, i) => (
        <text key={t} x={26 + i * 62} y={90} textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--ink-dim)" fontFamily="Inter, sans-serif">
          {t}
        </text>
      ))}
    </svg>
  );
}

const SEMANTIC_TABLES = ['project', 'supplier', 'inspection', 'schedule', 'compliance'];

function SemanticAnim() {
  return (
    <div data-anim="semantic" style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 96, paddingBottom: 2 }}>
      {SEMANTIC_TABLES.map((t, i) => (
        <motion.div key={t} data-table={t} {...rise(1 + i * 0.25)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <MiniTable w={42} rows={2 + (i % 3)} head={i % 2 ? G_MID : 'var(--teal)'} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>{t}</span>
        </motion.div>
      ))}
    </div>
  );
}

function RoutingAnim() {
  const box = (w: number, h: number, t: string, big: boolean, delay: number) => (
    <motion.div data-model={big ? 'multimodal' : 'lower-cost'} {...rise(delay)} style={{ width: w, height: h, borderRadius: 10, border: '2px solid var(--teal)', background: big ? 'var(--teal)' : TEAL_TINT, color: big ? '#fff' : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 14, fontWeight: 700, lineHeight: 1.15, padding: '0 6px' }}>
      {t}
    </motion.div>
  );
  const q = (icon: 'speech' | 'photo', t: string, delay: number) => (
    <motion.div {...rise(delay)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', width: 96 }}>
      <LineIcon name={icon} size={24} />
      {t}
    </motion.div>
  );
  return (
    <div data-anim="routing" style={{ display: 'grid', gridTemplateColumns: '96px 40px 1fr', rowGap: 8, alignItems: 'center', height: 96 }}>
      {q('speech', 'text question', 1)}
      <Arrow w={38} delay={1.4} />
      {box(100, 34, 'lower-cost model', false, 1.7)}
      {q('photo', 'image question', 2)}
      <Arrow w={38} delay={2.4} />
      {box(120, 48, 'multimodal model', true, 2.7)}
    </div>
  );
}

const ENGINES = [
  { key: 'Vector store', line: 'finds passages by meaning', anim: <VectorAnim /> },
  { key: 'Semantic store', line: 'answers questions about the project’s data', anim: <SemanticAnim /> },
  { key: 'Model routing', line: 'sends each question to the model it needs', anim: <RoutingAnim /> },
];

export interface L1AssistantProps {
  kicker: string;
  message: string;
  notebook?: string;
}

/** 1.3 · Three kinds of source flow into OCI Enterprise AI (three engines) and out as one assistant answering one question. */
export function L1Assistant({ kicker, message, notebook }: L1AssistantProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-assistant">
      <div style={{ display: 'grid', gridTemplateColumns: '190px 44px 1fr 44px 200px', alignItems: 'center', marginTop: 8, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
        <div>
          <div style={label}>Three kinds of source</div>
          {SOURCES.map((s, i) => (
            <motion.div key={s.key} data-source={s.key} {...rise(0.3 + i * 0.2)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 14, borderRadius: 12, border: '2px solid var(--line)', background: 'rgba(127,127,127,0.1)', fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>
              <LineIcon name={s.icon} size={34} />
              {s.key}
            </motion.div>
          ))}
        </div>
        <Arrow w={44} delay={0.9} />
        <motion.div data-block="oci-enterprise-ai" {...rise(0.6)} style={{ border: '2.5px solid var(--teal)', borderRadius: 18, padding: '14px 18px 16px', background: 'rgba(27, 138, 156, 0.06)' }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal)', marginBottom: 10 }}>OCI Enterprise AI</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {ENGINES.map((e, i) => (
              <motion.div key={e.key} data-engine={e.key} {...rise(0.8 + i * 0.5)} style={{ borderRadius: 12, border: '1.5px solid var(--line)', background: 'rgba(127,127,127,0.1)', padding: '10px 12px 12px', minHeight: 230 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--teal)', marginRight: 8 }}>{i + 1}</span>
                  {e.key}
                </div>
                <div style={{ minHeight: 100, display: 'flex', alignItems: 'center' }}>{e.anim}</div>
                <div style={{ fontSize: 19, lineHeight: 1.35, color: 'var(--ink)', marginTop: 8 }}>{e.line}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <Arrow w={44} delay={3.2} />
        <motion.div data-answer="assistant" {...rise(3.2)} style={{ textAlign: 'center' }}>
          <div style={label}>One AI assistant</div>
          <LineIcon name="speech" size={84} />
          <div style={{ fontSize: 20, lineHeight: 1.35, color: 'var(--ink)', marginTop: 10 }}>answers one question</div>
        </motion.div>
      </div>
    </WidePanel>
  );
}

/* ================= 1.4 · Hands-on 1 ================= */

const PARTS = [
  { key: 'Surface preparation', source: 'source: approved repair specification (PDF)' },
  { key: 'Materials', source: 'source: approved repair specification (PDF)' },
  { key: 'Inspection and acceptance', source: 'source: inspection report (PDF)' },
];
const PDFS = ['approved repair specification', 'maintenance manual', 'inspection report'];

function Pdf({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.div data-pdf={name} {...rise(delay)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: 'var(--ink)' }}>
      <LineIcon name="prompt" size={28} />
      {name}
    </motion.div>
  );
}

function NumberDot({ n }: { n: number }) {
  return <span style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--teal)', color: '#fff', fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{n}</span>;
}

const stepTitle = { fontSize: 23, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 8 } as const;

function Step({ n, at, last, children }: { n: number; at: number; last?: boolean; children: ReactNode }) {
  return (
    <motion.div data-step={n} {...rise(at)} style={{ display: 'grid', gridTemplateColumns: '46px 1fr', columnGap: 18 }}>
      <div style={{ position: 'relative' }}>
        <NumberDot n={n} />
        {!last && <span style={{ position: 'absolute', left: 22, top: 50, bottom: -12, borderLeft: '2.5px dotted var(--teal)' }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 14 }}>{children}</div>
    </motion.div>
  );
}

export interface L1SpecsProps {
  kicker: string;
  message: string;
  notebook?: string;
}

/** 1.4 · The engineer asks the approved documents; three numbered steps; the answer comes back in three sourced parts. */
export function L1Specs({ kicker, message, notebook }: L1SpecsProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-specs">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
        <Tag text="Hands-on 1 · Unstructured RAG" />
      </div>
      <div style={{ marginTop: 12 }}>
        <Bubble who="The engineer asks" text="According to the project documents, how must we prepare the surface for this concrete repair, which materials do we use, and how is it inspected and accepted?">
          <Worker />
        </Bubble>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', columnGap: 36, marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
        <div>
          <Step n={1} at={1.1}>
            <div style={stepTitle}>
              The approved PDFs sit in <span style={{ color: 'var(--teal)' }}>Object Storage</span>.
            </div>
            <div style={{ display: 'flex', gap: 22 }}>
              {PDFS.map((p, i) => (
                <Pdf key={p} name={p} delay={1.4 + i * 0.2} />
              ))}
            </div>
          </Step>
          <Step n={2} at={2.0}>
            <div style={stepTitle}>
              The <span style={{ color: 'var(--teal)' }}>Vector Store</span> on OCI Enterprise AI finds the matching passages.
            </div>
          </Step>
          <Step n={3} at={2.9} last>
            <div style={stepTitle}>The answer comes back in three parts, each with its source.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {PARTS.map((p, i) => (
                <motion.div key={p.key} data-answer={p.key} {...rise(3.3 + i * 0.35)} style={{ borderRadius: 12, border: '2px solid var(--teal)', background: TEAL_TINT, padding: '10px 12px' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{p.key}</div>
                  <Chip text={p.source} />
                </motion.div>
              ))}
            </div>
          </Step>
        </div>
        <motion.div data-contrast {...rise(4.0)} style={{ alignSelf: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, border: '2px solid var(--teal)', background: TEAL_TINT, marginBottom: 12 }}>
            <span data-mark="yes" style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--teal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10.5l4 4 8-9" />
              </svg>
            </span>
            <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>From the approved documents, with sources</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', borderRadius: 12, border: '2px dashed var(--line)', opacity: 0.6 }}>
            <span data-mark="no" style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--ink-dim)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="var(--ink-dim)" strokeWidth={3} strokeLinecap="round">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            </span>
            <span style={{ fontSize: 20, color: GREY, lineHeight: 1.3 }}>Not from general knowledge alone</span>
          </div>
        </motion.div>
      </div>
    </WidePanel>
  );
}

/* ================= 1.5 · Hands-on 2 ================= */

const DB_TABLES = [
  { key: 'Contractors', cols: 'qualification · past work' },
  { key: 'Certifications', cols: 'status' },
  { key: 'Purchase orders', cols: 'material · delivery status' },
];

export interface L1ContractorsProps {
  kicker: string;
  message: string;
  notebook?: string;
}

/** 1.5 · The project manager asks the database: tables, the Semantic Store that knows what they mean, NL2SQL, ADB MCP Server, a placeholder answer table. */
/** the answer the assistant prints for the project manager (sample rows: names and items stay generic) */
const ANSWER: { head: string; col: string; rows: [string, string, boolean, string][] }[] = [
  {
    head: 'Contractor',
    col: 'Qualified for this repair',
    rows: [
      ['Contractor A', '✓ qualified', true, 'concrete repair certified, similar bridge work'],
      ['Contractor B', '✗ not yet', false, 'certification expired'],
    ],
  },
  {
    head: 'Material',
    col: 'Delivery status',
    rows: [
      ['Repair mortar', 'delivered', true, ''],
      ['Bonding agent', 'in transit', false, ''],
      ['Corrosion inhibitor', 'not shipped yet', false, ''],
    ],
  },
];

export function L1Contractors({ kicker, message, notebook }: L1ContractorsProps) {
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="l1-contractors">
      <div style={{ marginTop: 6 }}>
        <Tag text="Hands-on 2 · Semantic Store + NL2SQL" />
      </div>
      <div style={{ marginTop: 12 }}>
        <Bubble who="The project manager asks" text="Which contractor is qualified for this repair, and what is the delivery status of the materials we need?">
          <Worker hat={false} shirt="#6f6a8f" />
        </Bubble>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 270px 50px 1fr', alignItems: 'center', marginTop: 16, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
        <motion.div data-block="autonomous-database" {...rise(1.0)} style={{ border: '2.5px solid var(--teal)', borderRadius: 16, padding: '10px 14px 12px', background: 'rgba(27, 138, 156, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 21, fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>
            <LineIcon name="database" size={30} />
            Autonomous Database
          </div>
          {DB_TABLES.map((t, i) => (
            <motion.div key={t.key} data-table={t.key} {...rise(1.3 + i * 0.25)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <MiniTable w={50} rows={2} head={i % 2 ? G_MID : 'var(--teal)'} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>{t.key}</div>
                <div style={{ fontSize: 16, color: GREY }}>{t.cols}</div>
              </div>
            </motion.div>
          ))}
          <motion.div data-layer="semantic-store" {...rise(2.2)} style={{ marginTop: 6, padding: '6px 10px', borderRadius: 8, background: 'var(--teal)', color: '#fff', fontSize: 17, fontWeight: 700 }}>
            Semantic Store <span style={{ fontWeight: 500 }}>· knows what the tables mean</span>
          </motion.div>
        </motion.div>
        <Arrow w={50} delay={2.6} />
        <motion.div {...rise(2.6)} style={{ textAlign: 'center' }}>
          <div data-step="nl2sql" style={{ fontSize: 21, fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>NL2SQL</div>
          <div style={{ fontSize: 16, color: GREY, marginBottom: 6 }}>turns the question into SQL</div>
          <pre data-sql style={{ margin: 0, textAlign: 'left', fontFamily: MONO, fontSize: 14.5, lineHeight: 1.5, padding: '10px 12px', borderRadius: 10, background: 'rgba(127,127,127,0.14)', color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
            {'SELECT …\nFROM contractors\nJOIN certifications …\nJOIN purchase_orders …\nWHERE …'}
          </pre>
          <div data-step="adb-mcp" style={{ marginTop: 8, display: 'inline-block', fontSize: 17, fontWeight: 700, padding: '5px 14px', borderRadius: 8, border: '2px solid var(--teal)', background: TEAL_TINT, color: 'var(--ink)' }}>
            ADB MCP Server
          </div>
        </motion.div>
        <Arrow w={50} delay={3.4} />
        <motion.div data-answer="table" {...rise(3.4)} style={{ borderRadius: 14, border: '2px solid var(--teal)', background: TEAL_TINT, padding: '12px 16px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: GREY, textTransform: 'uppercase', marginBottom: 8 }}>The answer</div>
          {/* a sample answer (owner, 29 Oct: print an answer, not a skeleton); no real company names, prices or dates */}
          {ANSWER.map((group, g) => (
            <div key={group.head} style={{ marginTop: g ? 10 : 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', fontSize: 15, fontWeight: 700, color: 'var(--ink-dim)', borderBottom: '1px solid var(--line)', paddingBottom: 3 }}>
                <span>{group.head}</span>
                <span>{group.col}</span>
              </div>
              {group.rows.map(([name, status, ok, why], r) => (
                <motion.div key={name} data-row={name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.8 + (g * 2 + r) * 0.18, duration: 0.45, ease: EASE }} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ fontSize: 18, color: 'var(--ink)' }}>
                    <b>{name}</b>
                    {why && <span style={{ fontSize: 15, color: 'var(--ink-dim)' }}> · {why}</span>}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, padding: '3px 10px', borderRadius: 999, color: ok ? '#fff' : 'var(--ink)', background: ok ? 'var(--teal)' : 'rgba(127,127,127,0.18)' }}>{status}</span>
                </motion.div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-dim)' }}>sample answer</div>
        </motion.div>
      </div>
    </WidePanel>
  );
}
