import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { Fill, FitBox } from '../Fill';
import { Cog, G_DARK, G_LIGHT, G_MID, KitGlyph, PlugHead, T_SOFT } from './agentArt';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, ArrowDown, CARD, ChiefInspector, Chip, Db, DIM, INK, L2Page, Net, Num, Quote, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props,
} from './parts';

/**
 * Lab 2 · Tools (tools, skills, MCP), Query (one query, four lenses) and Agent (build the agent): the deck's
 * chapters 7 to 9. The agent is the chief inspector; its tools are its instruments; the skill is its manual.
 */

/* ---------------- 2.5, 2.5a, 2.5b · hands, a procedure, a standard plug ---------------- */

export const DATA_TOOLS = ['get_asset_overview', 'get_recent_incidents', 'get_connected_assets', 'search_incidents_semantic', 'get_asset_incident_brief'];
export const MEMORY_TOOLS = ['remember', 'recall', 'recall_similar'];

/** the inspector's kit, filling one click at a time: what each piece is, in plain words */
const KIT: { kind: 'tools' | 'skills' | 'mcp'; t: string; s: string }[] = [
  { kind: 'tools', t: 'Tools', s: 'the hands' },
  { kind: 'skills', t: 'Skills', s: 'the procedure' },
  { kind: 'mcp', t: 'MCP', s: 'the standard plug' },
];

const big = { fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.25 } as const;
const body = { fontSize: 22, color: INK, lineHeight: 1.4 } as const;
const caption = { fontSize: 24, lineHeight: 1.45, color: INK } as const;

/** the left rail: the kit so far; done pieces ticked, the current one lit, the next ones waiting dashed */
function KitRail({ step }: { step: number }) {
  return (
    <div data-kit-rail style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 26, borderRight: '1px solid var(--line)' }}>
      <div style={{ ...cap, fontSize: 17 }}>The inspector’s kit</div>
      {KIT.map((k, i) => {
        const now = step === i + 1;
        const done = step > i + 1;
        const waiting = step < i + 1;
        return (
          <div key={k.kind} data-kit-slot={k.kind} data-now={now || undefined} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 14, border: `2px ${waiting ? 'dashed' : 'solid'} ${waiting ? 'var(--line)' : TEAL}`, background: now ? TINT2 : done ? TINT : 'transparent', opacity: waiting ? 0.45 : 1, transition: 'all 400ms' }}>
            <KitGlyph kind={k.kind} size={60} on={!waiting} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 27, fontWeight: 700, color: INK }}>{k.t}</div>
              <div style={{ fontSize: 22, color: waiting ? DIM : TEAL_D }}>{k.s}</div>
            </div>
            {done && <Num n="✓" size={32} />}
          </div>
        );
      })}
    </div>
  );
}

/** a piece of the flow: a drawing, a bold name, a plain line under it */
function Station({ art, t, s, delay }: { art: ReactNode; t: ReactNode; s: string; delay: number }) {
  return (
    <motion.div {...fadeUp(delay)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', minWidth: 0 }}>
      <div style={{ height: 170, display: 'flex', alignItems: 'center' }}>{art}</div>
      <div style={{ ...big, whiteSpace: 'nowrap' }}>{t}</div>
      <div style={{ fontSize: 22, color: DIM, whiteSpace: 'nowrap' }}>{s}</div>
    </motion.div>
  );
}

/** step 1 · the hands: the agent names the instrument, the framework picks it up and uses it */
function HandsPicture() {
  return (
    <Fill gap={12}>
      <motion.div {...fade(0.1)} style={caption}>
        Like an inspector who says <i>“hand me the crack gauge”</i>: the AI agent names the instrument, <b>the framework picks it up and uses it</b>.
      </motion.div>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'auto 64px auto 64px auto 64px auto', justifyContent: 'space-between', alignItems: 'center', columnGap: 6 }}>
        <Station delay={0.3} art={<ChiefInspector size={160} />} t="AI Agent" s="asks for a call" />
        <Arrow w={64} delay={0.8} />
        <motion.div data-slip {...fadeUp(0.9)} style={{ justifySelf: 'center', transform: 'rotate(-1.5deg)', padding: '16px 20px', borderRadius: 10, background: CARD, boxShadow: '0 4px 14px rgba(0,0,0,0.14)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ ...cap, fontSize: 15 }}>the request</div>
          <div style={{ ...mono(22, INK), fontWeight: 700 }}>get_recent_incidents(</div>
          <div style={{ ...mono(22), paddingLeft: 26 }}>"Harbor Bridge")</div>
        </motion.div>
        <Arrow w={64} delay={1.4} />
        <Station delay={1.5} art={<Cog size={150} delay={1.9} />} t="the framework" s="runs it" />
        <Arrow w={64} delay={2.1} />
        <Station delay={2.2} art={<Db size={140} />} t="the database" s="rows come back" />
      </div>
      <motion.div data-return {...fade(2.8)} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: TEAL_D, fontWeight: 600 }}>
        <span style={{ fontSize: 30 }}>←</span>
        <span style={{ flex: 1, borderTop: `2.5px dashed ${TEAL}` }} />
        <span>the result goes back to the language model, which decides what to do next</span>
        <span style={{ flex: 1, borderTop: `2.5px dashed ${TEAL}` }} />
      </motion.div>
      <div data-what-a-tool-is style={{ display: 'grid', gridTemplateColumns: 'auto repeat(3, minmax(0, 1fr))', gap: 14, alignItems: 'stretch' }}>
        <motion.div {...fade(3.2)} style={{ ...big, alignSelf: 'center' }}>What a tool is</motion.div>
        {[
          { t: 'Data retrieval', s: 'lab: 7 tools' },
          { t: 'Action execution', s: 'lab: remember only' },
          { t: 'Context injection', s: 'lab: the SOP' },
        ].map((k, i) => (
          <motion.div key={k.t} {...fadeUp(3.3 + i * 0.3)} style={{ ...card(), padding: '12px 18px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>{k.t}</div>
            <div style={{ ...mono(20) }}>{k.s}</div>
          </motion.div>
        ))}
      </div>
    </Fill>
  );
}

/** step 2 · the procedure: the manual's contents are always in the truck; a chapter opens when the job needs it */
function ProcedurePicture() {
  const chapter = ['the steps, in order', 'the thresholds', 'scripts', 'references'];
  return (
    <Fill gap={16}>
      <motion.div {...fade(0.1)} style={caption}>
        Like the inspection manual in the truck: its <b>table of contents is always there</b>; the inspector opens the chapter <b>when the job needs it</b>.
      </motion.div>
      <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) 150px minmax(0, 1.2fr)', alignItems: 'stretch', columnGap: 10 }}>
        <motion.div data-closed {...fadeUp(0.3)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={capTeal}>Always in the context window</div>
          <div style={{ flex: 1, display: 'flex', borderRadius: '6px 14px 14px 6px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.16)' }}>
            <div style={{ width: 34, background: TEAL }} />
            <div style={{ flex: 1, background: TINT2, padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.2 }}>Incident triage SOP</div>
              <div style={body}>its name and <b>when to use it</b>: one short description</div>
              <Chip style={{ alignSelf: 'flex-start', fontSize: 20 }}>INCIDENT_TRIAGE_SKILL</Chip>
            </div>
          </div>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Arrow w={100} delay={1.1} />
          <motion.div {...fade(1.2)} style={{ fontSize: 22, color: TEAL_D, fontWeight: 600, textAlign: 'center' }}>the job needs it</motion.div>
        </div>
        <motion.div data-open {...fadeUp(1.4)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={cap}>Loaded only when needed</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 10, background: CARD, boxShadow: '0 6px 18px rgba(0,0,0,0.16)', border: '1px solid var(--line)' }}>
            {[0, 1].map((side) => (
              <div key={side} style={{ padding: '20px 24px', borderLeft: side ? '2px solid var(--line)' : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 10 }}>
                {chapter.slice(side * 2, side * 2 + 2).map((c, i) => (
                  <motion.div key={c} data-chapter={c} {...fadeUp(1.8 + (side * 2 + i) * 0.35)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 25, fontWeight: 700, color: INK }}>{c}</div>
                    <div style={{ height: 6, borderRadius: 3, background: G_LIGHT, width: '90%' }} />
                    <div style={{ height: 6, borderRadius: 3, background: G_LIGHT, width: '70%' }} />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div {...fade(3.4)} style={{ ...body, padding: '12px 20px', borderRadius: 12, background: TINT }}>
        Small skills keep the context free for real data: the description is enough to pick the skill, <b>the body arrives only when the task matches</b>.
      </motion.div>
    </Fill>
  );
}

/** step 3 · the standard plug: one socket shape; sources plug in once, any agent can use them */
function PlugPicture() {
  const agents = ['Agent A', 'Agent B'];
  const sources = ['Database', 'Files', 'Tickets'];
  const ay = (i: number) => 170 + i * 150;
  const sy = (i: number) => 140 + i * 120;
  return (
    <Fill gap={14}>
      <motion.div {...fade(0.1)} style={caption}>
        Like one plug shape for every socket: <b>connect a source once</b>, and any agent can use it.
      </motion.div>
      <FitBox w={1060} h={450} max={1.1}>
        <svg data-plug-picture width={1060} height={450} viewBox="0 0 1060 450" style={{ overflow: 'visible' }}>
          {/* the strip: the one standard socket */}
          <motion.g {...fade(0.3)}>
            <rect x="420" y="40" width="210" height="400" rx="20" fill={T_SOFT} stroke="#146f7f" strokeWidth="3" />
            <rect x="420" y="40" width="210" height="70" rx="20" fill="#146f7f" />
            <text x="525" y="88" textAnchor="middle" fontSize="36" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">MCP</text>
            <text x="525" y="426" textAnchor="middle" fontSize="22" fill="#146f7f" fontFamily="Inter, sans-serif">one standard plug</text>
            {[...agents.map((_, i) => ({ x: 432, y: ay(i) })), ...sources.map((_, i) => ({ x: 610, y: sy(i) }))].map((s, i) => (
              <rect key={i} x={s.x} y={s.y - 16} width="18" height="32" rx="4" fill="#5c6b78" />
            ))}
          </motion.g>
          {/* the sources, each plugged in once */}
          {sources.map((s, i) => {
            const y = sy(i);
            return (
              <motion.g key={s} data-source={s} {...fade(0.9 + i * 0.35)}>
                <motion.path d={`M668 ${y} C720 ${y} 740 ${y} 800 ${y}`} stroke="#5c6b78" strokeWidth="5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 + i * 0.35, duration: 0.6 }} />
                <PlugHead x={642} y={y} dir={-1} />
                <rect x="800" y={y - 44} width="230" height="88" rx="14" fill="var(--panel-strong)" stroke="#aab1ba" strokeWidth="2" />
                <text x="915" y={y + 10} textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--ink)" fontFamily="Inter, sans-serif">{s}</text>
              </motion.g>
            );
          })}
          {/* the agents, each plugged in once */}
          {agents.map((a, i) => {
            const y = ay(i);
            return (
              <motion.g key={a} data-agent={a} {...fade(2.2 + i * 0.4)}>
                <rect x="20" y={y - 50} width="230" height="100" rx="14" fill="rgba(27, 138, 156, 0.10)" stroke="#1b8a9c" strokeWidth="2.5" />
                <text x="135" y={y + 10} textAnchor="middle" fontSize="28" fontWeight="700" fill="var(--ink)" fontFamily="Inter, sans-serif">{a}</text>
                <motion.path d={`M250 ${y} C320 ${y} 340 ${y} 404 ${y}`} stroke="#5c6b78" strokeWidth="5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2.3 + i * 0.4, duration: 0.6 }} />
                <PlugHead x={418} y={y} dir={1} />
              </motion.g>
            );
          })}
        </svg>
      </FitBox>
      <motion.div {...fade(3.2)} style={{ ...body, color: DIM }}>A design option, shown as a concept: in this lab the tools are plain Python functions.</motion.div>
    </Fill>
  );
}

export function Toolkit(p: L2Props) {
  const step = Math.min(3, Math.max(1, p.step ?? 1));
  return (
    <L2Page testId="l2-toolkit" {...p}>
      <div data-picture-row style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', columnGap: 28 }}>
        <KitRail step={step} />
        <AnimatePresence mode="wait">
          <motion.div key={step} data-kit-step={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {step === 1 ? <HandsPicture /> : step === 2 ? <ProcedurePicture /> : <PlugPicture />}
          </motion.div>
        </AnimatePresence>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.5c · §3.2 the inspector's instruments: tools ---------------- */

export function Instruments(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <L2Page testId="l2-instruments" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: 22, minHeight: 0 }}>
          <motion.div {...fadeUp(0.1)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
            <div style={{ width: 130, height: 130, borderRadius: '50%', background: 'rgba(31,42,51,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="76" height="76" viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="2.6" aria-hidden>
                <path d="M3 24s8-13 21-13 21 13 21 13-8 13-21 13S3 24 3 24z" />
                <circle cx="24" cy="24" r="6" />
              </svg>
            </div>
            <div style={{ fontSize: 22, color: INK, fontWeight: 600 }}>The language model reads only the label</div>
          </motion.div>
          <StepRow
            focusN={focusN}
            arrows={false}
            steps={[
              { title: 'Turns a function into a tool', body: <Chip style={{ fontSize: 26, alignSelf: 'flex-start', background: 'rgba(31,42,51,0.92)', color: '#fff' }}>@tool</Chip> },
              { title: 'Name and inputs', grow: 1.4, body: <Quote style={{ fontSize: 19 }}>get_recent_incidents(asset_name: str, days: int = 180)</Quote> },
              { title: 'When to use it', grow: 1.4, body: <div style={{ fontSize: 21, lineHeight: 1.45, fontStyle: 'italic', color: INK }}>“…when you need exact recent incident history before recommending action.”</div> },
            ]}
          />
        </div>
        <motion.div data-allowlist {...fadeUp(1.8)} style={{ ...card(focusN === 4), opacity: lit(4) ? 1 : 0.4, background: TINT, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Num n={4} on={lit(4)} size={32} />
          <span style={capTeal}>Allowlist · AGENT_TOOLS, cell 73 · 8 tools</span>
          {[...DATA_TOOLS, ...MEMORY_TOOLS].map((t) => (
            <Chip key={t} style={{ fontSize: 17, background: t === 'get_recent_incidents' ? TINT2 : CARD }}>{t}</Chip>
          ))}
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.5d · §3.3 the inspection manual: skill / SOP ---------------- */

const SOP: { n?: number; t: string }[] = [
  { n: 1, t: '1. Recall this bridge’s memory first' },
  { n: 2, t: '2. Pull the incident brief' },
  { t: '3. More tools only if needed' },
  { n: 3, t: '4. Remember the decision (mandatory)' },
  { t: '5. Answer as JSON' },
];

export function Manual(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n?: number) => focusN === null || (n !== undefined && focusN === n);
  return (
    <L2Page testId="l2-manual" hasRed {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 24, minHeight: 0 }}>
        <motion.div data-sop {...fadeUp(0.2)} style={{ ...card(true), background: CARD, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LineIcon name="book" size={44} />
            <span style={capTeal}>Inspection manual · SOP, in order</span>
          </div>
          {SOP.map((s, i) => (
            <motion.div key={s.t} data-sop-step={i + 1} {...fadeUp(0.5 + i * 0.3)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: '8px 14px', borderRadius: 12, background: s.n && focusN === s.n ? TINT2 : s.n ? TINT : SOFT, opacity: lit(s.n) ? 1 : 0.4, fontSize: 23, fontWeight: s.n ? 700 : 500, color: s.n ? INK : DIM }}>
              {s.n ? <Num n={s.n} size={34} on={lit(s.n)} /> : <span style={{ width: 34 }} />}
              {s.t}
            </motion.div>
          ))}
        </motion.div>
        <motion.div data-escalate {...fadeUp(1.8)} style={{ ...card(focusN === 4), opacity: lit(4) ? 1 : 0.4, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Num n={4} on={lit(4)} size={34} />
            <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>When to escalate</span>
          </div>
          {['crack width > 1.0 mm', 'section loss > 25%', 'bearing displacement > 15 mm'].map((t, i) => (
            <motion.div key={t} {...fadeUp(2.1 + i * 0.25)} style={{ ...mono(22, INK), padding: '10px 16px', borderRadius: 10, background: SOFT, fontWeight: 700 }}>{t}</motion.div>
          ))}
          <ArrowDown h={34} />
          <motion.div data-red {...fadeUp(3)} style={{ padding: '14px 18px', borderRadius: 12, border: `2px solid ${RED}`, fontSize: 23, fontWeight: 700, color: INK, lineHeight: 1.35 }}>
            IMMEDIATE structural review + propose load restriction
          </motion.div>
          <div style={{ marginTop: 'auto', fontSize: 17, color: DIM }}>The lab’s example operator policy, written in plain English inside the prompt</div>
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.6, 2.6a · why one query ---------------- */

const LENSES = [
  { k: 'rows', s: 'relational', icon: 'steps' as IconName },
  { k: 'JSON', s: 'documents', icon: 'prompt' as IconName },
  { k: 'graph', s: 'SQL/PGQ', icon: 'nodes' as IconName },
  { k: 'vector', s: 'similarity', icon: 'target' as IconName },
];

export function OneQuery(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-onequery" {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px minmax(0, 1.2fr)', alignItems: 'stretch', gap: 10, minHeight: 0 }}>
        <motion.div data-four-systems {...fadeUp(0.2)} style={{ ...card(), padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, opacity: step === 2 ? 0.55 : 1, transition: 'opacity 500ms' }}>
          <div style={cap}>Four systems</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12 }}>
            {LENSES.map((l, i) => (
              <motion.div key={l.k} {...fadeUp(0.4 + i * 0.25)} style={{ ...card(), background: CARD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Db size={46} color="#8a97a3" />
                <span style={{ fontSize: 22, fontWeight: 700, color: INK }}>{l.k}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['ETL', 'sync jobs', 'stale copies'].map((x, i) => (
              <motion.span key={x} {...fadeUp(1.6 + i * 0.25)} style={{ padding: '5px 14px', borderRadius: 999, border: '2px dashed #8a97a3', fontSize: 19, color: DIM }}>{x}</motion.span>
            ))}
          </div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{upTo(step, 2) && <Arrow w={76} delay={0.2} />}</div>
        <motion.div data-one-db {...reveal(upTo(step, 2), 0.4)} style={{ ...card(true), background: TINT, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Db size={56} />
            <span style={{ fontSize: 28, fontWeight: 700, color: INK }}>One Oracle AI Database</span>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12 }}>
            {LENSES.map((l, i) => (
              <motion.div key={l.k} data-lens={l.k} {...reveal(upTo(step, 2), 0.7 + i * 0.25)} style={{ ...card(true), background: CARD, display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px' }}>
                <LineIcon name={l.icon} size={44} />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>{l.k}</div>
                  <div style={{ ...mono(17) }}>{l.s}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ alignSelf: 'center', padding: '8px 20px', borderRadius: 999, background: TEAL, color: '#fff', fontSize: 21, fontWeight: 700 }}>one statement · one transaction</div>
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.6b · §4.2–4.4 one brief from one SQL statement ---------------- */

export function OneBrief(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-brief" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <StepRow
          focusN={focusN}
          steps={[
            { title: 'Row + JSON specs', body: <><LineIcon name="profile" size={64} /><div style={{ ...mono(21, INK), fontWeight: 700 }}>Harbor Bridge</div><Chip style={{ alignSelf: 'flex-start' }}>criticality 5</Chip></> },
            { title: 'Graph neighbours', body: <><LineIcon name="nodes" size={64} /><div style={{ fontSize: 24, fontWeight: 700 }}>5 connected assets</div><Chip style={{ alignSelf: 'flex-start' }}>SQL/PGQ</Chip></> },
            { title: 'Vector evidence', body: <><LineIcon name="target" size={64} /><div style={{ fontSize: 24, fontWeight: 700 }}>5 evidence chunks</div><Chip style={{ alignSelf: 'flex-start' }}>VECTOR_DISTANCE</Chip></> },
            { title: 'One JSON brief', grow: 1.3, body: <Quote style={{ fontSize: 20, flex: 1 }}>{'{ "asset": …,\n  "graph_context": […],\n  "ranked_evidence": […] }'}</Quote> },
          ]}
        />
        <motion.div {...fadeUp(2.4)} style={{ alignSelf: 'center', padding: '8px 22px', borderRadius: 999, background: TEAL, color: '#fff', fontSize: 21, fontWeight: 700 }}>one statement · one transaction</motion.div>
        <div style={{ fontSize: 15, color: DIM, textAlign: 'center' }}>Counts: saved output, cell 65</div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.6c · §4.5 the query becomes the agent's main instrument ---------------- */

export function MainInstrument(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-main" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <StepRow
          focusN={focusN}
          steps={[
            { title: 'Make it a tool', grow: 0.8, body: <Chip style={{ fontSize: 26, alignSelf: 'flex-start', background: 'rgba(31,42,51,0.92)', color: '#fff' }}>@tool</Chip> },
            { title: 'Name and inputs', grow: 1.3, body: <Quote style={{ fontSize: 19 }}>get_asset_incident_brief(asset_name, focus, k=5)</Quote> },
            { title: 'When to prefer it', grow: 1.2, body: <div style={{ fontSize: 21, lineHeight: 1.45, fontStyle: 'italic' }}>“Prefer this when you need a holistic picture before recommending action.”</div> },
            {
              title: 'Calls the one-brief query',
              grow: 1.1,
              body: (
                <>
                  {['relational + JSON', 'graph', 'vector'].map((x) => (
                    <Chip key={x} style={{ alignSelf: 'flex-start', fontSize: 18 }}>{x}</Chip>
                  ))}
                  <ArrowDown h={26} />
                  <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_D }}>one JSON brief</div>
                </>
              ),
            },
          ]}
        />
        <motion.div {...fadeUp(2.6)} style={{ alignSelf: 'center', padding: '10px 24px', borderRadius: 999, background: TINT, fontSize: 22, color: INK }}>
          The model fills three arguments. <b>It never sees or writes the SQL.</b>
        </motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.7 · §5.1 the agent is a state graph ---------------- */

function GNode({ n, title, sub, on, x, y, w = 200 }: { n?: number; title: string; sub?: string; on: boolean; x: number; y: number; w?: number }) {
  return (
    <div data-node={title} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', width: w, padding: '12px 14px', borderRadius: 14, ...card(!!n), background: n ? CARD : 'rgba(31,42,51,0.92)', color: n ? INK : '#fff', opacity: on ? 1 : 0.4, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', transition: 'opacity 300ms' }}>
      {n && <Num n={n} size={32} on={on} />}
      <div style={{ textAlign: n ? 'left' : 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: n ? undefined : 'JetBrains Mono, monospace' }}>{title}</div>
        {sub && <div style={{ fontSize: 17, color: DIM }}>{sub}</div>}
      </div>
    </div>
  );
}

export function StateGraph(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <L2Page testId="l2-graph" {...p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 24, minHeight: 0 }}>
        <motion.div data-graph {...fade(0.2)} style={{ position: 'relative', ...card(), minHeight: 0 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
            <g fill="none" stroke="#1b8a9c" strokeWidth="0.5" strokeDasharray="1.4 1.4" vectorEffect="non-scaling-stroke">
              <path d="M19 16L40 21" />
              <path d="M50 28V46" />
              <path d="M44 57L30 74" />
              <path d="M57 57L76 72" />
              <path d="M76 72V83" />
            </g>
          </svg>
          <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
            {/* the loop: tools back to model, a light walking it at a slow pace */}
            <path id="l2-back" d="M14 82C4 82 4 30 36 24" fill="none" stroke="#1b8a9c" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
          </motion.svg>
          <GNode title="START" on x={12} y={14} w={130} />
          <GNode n={1} title="model" sub="think" on={lit(1)} x={50} y={22} />
          <GNode n={3} title="tool?" sub="did it ask for one?" on={lit(3)} x={50} y={52} w={230} />
          <GNode n={2} title="tools" sub="act" on={lit(2)} x={24} y={80} />
          <div data-node="enforce" style={{ position: 'absolute', left: '78%', top: '64%', transform: 'translate(-50%, -50%)', fontSize: 16, color: DIM, textAlign: 'center', width: 170 }}>enforce step: remember called?</div>
          <GNode title="END" on x={78} y={88} w={120} />
          <div style={{ position: 'absolute', left: '36%', top: '64%', fontSize: 18, fontWeight: 700, color: TEAL_D }}>yes</div>
          <div style={{ position: 'absolute', left: '62%', top: '60%', fontSize: 18, fontWeight: 700, color: DIM }}>no</div>
          <div data-back style={{ position: 'absolute', left: '2%', top: '46%', display: 'flex', alignItems: 'center', gap: 6, opacity: lit(4) ? 1 : 0.4 }}>
            <Num n={4} size={30} on={lit(4)} />
            <span style={{ fontSize: 17, color: TEAL_D, fontWeight: 700 }}>back to think</span>
          </div>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          {[
            { n: 1, t: 'model', s: 'the language model reads everything so far and thinks' },
            { n: 2, t: 'tools', s: 'the framework runs the tool it asked for' },
            { n: 3, t: 'tool?', s: 'one question: did the model ask for a tool?' },
            { n: 4, t: 'loop', s: 'yes: run it and go back to the model; no: finish' },
          ].map((x, i) => (
            <motion.div key={x.n} {...fadeUp(0.6 + i * 0.35)} style={{ display: 'flex', alignItems: 'center', gap: 14, ...card(focusN === x.n), padding: '12px 16px', opacity: lit(x.n) ? 1 : 0.4 }}>
              <Num n={x.n} size={34} on={lit(x.n)} />
              <div>
                <div style={{ ...mono(20, INK), fontWeight: 700 }}>{x.t}</div>
                <div style={{ fontSize: 19, color: DIM }}>{x.s}</div>
              </div>
            </motion.div>
          ))}
          <div style={{ fontSize: 15, color: DIM }}>Illustration of cell 73. The enforce step is in the graph too.</div>
        </div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.7a, 2.7b · two memories, then their lifecycle ---------------- */

const MEMS = [
  { key: 'notebook', t: 'Visit notebook', k: 'short-term · checkpointer', s: 'this visit’s scribbles, kept per thread_id' },
  { key: 'logbook', t: 'Bridge logbook', k: 'long-term · store', s: 'permanent, found by name or by meaning' },
] as const;

const LIFE = [
  { key: 'keep', t: 'What to keep', s: 'decide what is worth writing down' },
  { key: 'forget', t: 'What to forget, and when', s: 'stale facts must expire' },
  { key: 'read', t: 'Reading memory', s: '= retrieval: find the right note' },
] as const;

/** step 1's two memories side by side on the database shelf; on step 2 the whole scene steps back to make room */
function MemoryShelf({ compact }: { compact: boolean }) {
  return (
    <motion.div data-shelf animate={{ height: compact ? 250 : 420 }} initial={false} transition={{ duration: 0.7, ease: EASE }} style={{ flex: 'none', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'end', columnGap: 20 }}>
        {MEMS.map((m, i) => {
          const art = m.key === 'notebook' ? <PocketNotebook /> : <Logbook />;
          const words = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <motion.div animate={{ fontSize: compact ? 28 : 32 }} initial={false} style={{ fontWeight: 700, color: INK, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{m.t}</motion.div>
              <div style={{ ...mono(compact ? 20 : 22) }}>{compact ? m.k : m.k.split(' · ').map((x) => <div key={x}>{x}</div>)}</div>
              {!compact && <div style={{ fontSize: 23, color: DIM, lineHeight: 1.35, marginTop: 6 }}>{m.s}</div>}
            </div>
          );
          return (
            <motion.div key={m.key} data-memory={m.t} {...fadeUp(0.4 + i * 0.8)} style={{ gridColumn: i === 0 ? 1 : 3, height: '100%', minHeight: 0, display: 'flex', flexDirection: i === 0 ? 'row' : 'row-reverse', alignItems: 'flex-end', gap: 22, textAlign: i === 0 ? 'left' : 'right', paddingBottom: 6 }}>
              <div style={{ height: '100%', maxHeight: compact ? 190 : 340, aspectRatio: '1 / 1.15', flex: 'none', display: 'flex', alignItems: 'flex-end' }}>{art}</div>
              {words}
            </motion.div>
          );
        })}
        <motion.div {...fadeUp(0.2)} style={{ gridColumn: 2, gridRow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ChiefInspector size={compact ? 90 : 170} />
          {!compact && <div style={{ fontSize: 22, color: DIM, textAlign: 'center' }}>writes in both</div>}
        </motion.div>
      </div>
      {/* the shelf they both stand on: one database */}
      <motion.div data-db-shelf {...fade(0.1)} style={{ flex: 'none', height: 54, borderRadius: 14, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, color: '#fff', fontSize: 24, fontWeight: 700 }}>
        <Db size={36} color="#fff" /> Oracle AI Database · both memories on one shelf
      </motion.div>
    </motion.div>
  );
}

/** the visit notebook: a small spiral pad, a few lines of today's notes */
function PocketNotebook() {
  return (
    <svg data-art="visit-notebook" viewBox="0 0 230 264" style={{ width: '100%', height: '100%' }} aria-hidden>
      <ellipse cx="115" cy="256" rx="100" ry="7" fill="rgba(127,127,127,0.2)" />
      <rect x="24" y="30" width="182" height="222" rx="10" fill="var(--panel-strong)" stroke={G_DARK} strokeWidth="3" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={40 + i * 24} y="18" width="10" height="26" rx="5" fill="none" stroke={G_DARK} strokeWidth="3" />
      ))}
      {[78, 110, 142, 174, 206].map((y, i) => (
        <motion.path key={y} d={`M46 ${y}h${i === 4 ? 80 : 136}`} stroke={i < 2 ? TEAL : G_MID} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 + i * 0.25, duration: 0.5 }} />
      ))}
      <path d="M160 236l26-8" stroke={G_LIGHT} strokeWidth="2" />
    </svg>
  );
}

/** the bridge logbook: a thick bound book, three-quarter view, with index tabs down its side */
function Logbook() {
  return (
    <svg data-art="logbook" viewBox="0 0 230 264" style={{ width: '100%', height: '100%' }} aria-hidden>
      <ellipse cx="115" cy="256" rx="104" ry="7" fill="rgba(127,127,127,0.2)" />
      {/* the page block, then the cover over it */}
      <path d="M40 54l140-24v206l-140 16z" fill="#e9edf1" stroke={G_MID} strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M44 ${76 + i * 21}l132-${22 - i * 0.6}`} stroke="rgba(92,107,120,0.18)" strokeWidth="2" />
      ))}
      <path d="M22 44l140-26v210l-140 24z" fill={TEAL_D} />
      <path d="M22 44l14-2v210l-14 2z" fill="#0f5562" />
      <rect x="62" y="92" width="76" height="34" rx="5" fill="rgba(255,255,255,0.85)" transform="skewY(-10)" />
      {/* index tabs: one lights as a note is filed */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect key={i} x="160" y={44 + i * 44} width="26" height="30" rx="5" initial={{ fill: '#aab1ba' }} animate={{ fill: i === 1 ? '#1b8a9c' : '#aab1ba' }} transition={{ delay: 1.8, duration: 0.6 }} />
      ))}
    </svg>
  );
}

/** step 2 · the life of one note: written, ageing, found again */
function LifeArt({ k }: { k: (typeof LIFE)[number]['key'] }) {
  return (
    <svg data-life-art={k} width="150" height="125" viewBox="0 0 120 100" aria-hidden style={{ flex: 'none' }}>
      {k === 'keep' && (
        <g>
          <rect x="14" y="14" width="66" height="78" rx="6" fill="var(--panel-strong)" stroke={G_DARK} strokeWidth="2.5" />
          <motion.path d="M26 36h42M26 52h42M26 68h26" stroke={TEAL} strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />
          <path d="M104 10l8 8-38 38-12 4 4-12z" fill={TEAL} />
        </g>
      )}
      {k === 'forget' && (
        <g>
          <rect x="10" y="18" width="62" height="70" rx="6" fill="var(--panel-strong)" stroke={G_DARK} strokeWidth="2.5" />
          <rect x="10" y="18" width="62" height="18" rx="6" fill={G_DARK} />
          <path d="M22 50h38M22 64h38M22 78h22" stroke={G_MID} strokeWidth="4" strokeLinecap="round" />
          <motion.path d="M78 22h30l-15 22 15 22H78l15-22z" fill="none" stroke={TEAL} strokeWidth="3.5" strokeLinejoin="round" initial={{ rotate: 0 }} animate={{ rotate: 180 }} transition={{ delay: 1.8, duration: 1.2, ease: EASE }} style={{ transformOrigin: '93px 44px' }} />
        </g>
      )}
      {k === 'read' && (
        <g>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={10 + i * 8} y={22 + i * 10} width="56" height="60" rx="6" fill={i === 2 ? TINT2 : 'var(--panel-strong)'} stroke={i === 2 ? TEAL : G_MID} strokeWidth="2.5" />
          ))}
          <circle cx="86" cy="44" r="18" fill="none" stroke={TEAL} strokeWidth="5" />
          <path d="M99 57l14 14" stroke={TEAL} strokeWidth="7" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

function Lifecycle() {
  return (
    <div data-lifecycle style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 18 }}>
      <motion.div {...fade(0.3)} style={{ fontSize: 24, color: INK, lineHeight: 1.4 }}>
        A real logbook gets <b>tidied</b>: decide what goes in, cross out what is no longer true, know where to look.
      </motion.div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 90px minmax(0, 1fr) 90px minmax(0, 1fr)', alignItems: 'start' }}>
        {LIFE.map((l, i) => [
          i > 0 ? (
            <div key={`a${i}`} style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Arrow w={80} delay={0.4 + i * 0.8} />
            </div>
          ) : null,
          <motion.div key={l.key} data-life={i + 1} {...fadeUp(0.6 + i * 0.8)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
            <div style={{ height: 130, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Num n={i + 1} size={42} />
              <LifeArt k={l.key} />
            </div>
            <div style={{ fontSize: 27, fontWeight: 700, color: INK }}>{l.t}</div>
            <div style={{ fontSize: 23, color: i === 1 ? TEAL_D : DIM, fontWeight: i === 1 ? 600 : 400 }}>{l.s}</div>
          </motion.div>,
        ])}
      </div>
    </div>
  );
}

export function TwoMemories(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-memories" {...p}>
      <Fill>
        <MemoryShelf compact={step >= 2} />
        <AnimatePresence>{step >= 2 && <Lifecycle key="life" />}</AnimatePresence>
        {step < 2 && (
          <div data-inside style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40, paddingTop: 16 }}>
            {[
              { t: 'Inside the notebook', s: 'the steps of this conversation, per thread', rows: ['checkpoints', 'checkpoint_blobs', 'checkpoint_writes'] },
              { t: 'Inside the logbook', s: 'the notes, and their index for search by meaning', rows: ['store_incident', 'store_vectors_incident'] },
            ].map((c, i) => (
              <motion.div key={c.t} {...fadeUp(2.2 + i * 0.5)} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 20px', borderRadius: 14, background: SOFT, borderTop: `4px solid ${TEAL}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>{c.t}</span>
                  <span style={{ fontSize: 22, color: DIM }}>{c.s}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {c.rows.map((r) => (
                    <Chip key={r} style={{ fontSize: 20, padding: '6px 12px' }}>{r}</Chip>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.7c · wipe only this lab's notes ---------------- */

/** a locker: a grey door with vents and a handle; `open` swings it away to show what is inside */
function Locker({ open, at, inside, padlock = false, w }: { open: boolean; at: number; inside?: ReactNode; padlock?: boolean; w?: number }) {
  return (
    <div data-locker={open ? 'emptied' : 'shut'} style={{ position: 'relative', width: w, flex: 1, minHeight: 0, borderRadius: 10, background: 'rgba(20, 26, 34, 0.78)', overflow: 'hidden' }}>
      {inside && (
        <motion.div {...fade(at + 0.5)} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, textAlign: 'center', color: '#e6e9ef' }}>
          {inside}
        </motion.div>
      )}
      <motion.div
        aria-hidden
        initial={{ scaleX: 1 }}
        animate={{ scaleX: open ? 0.1 : 1 }}
        transition={{ delay: at, duration: 1, ease: EASE }}
        style={{ position: 'absolute', inset: 0, transformOrigin: 'left center', borderRadius: 10, background: open ? '#9aa4ae' : '#aab1ba', border: `2px solid ${G_DARK}`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: '46%', height: 5, borderRadius: 3, background: G_DARK, opacity: 0.55, marginBottom: 7 }} />
        ))}
        <div style={{ flex: 1 }} />
        {padlock ? (
          <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden>
            <path d="M9 18v-6a8 8 0 0 1 16 0v6" fill="none" stroke={G_DARK} strokeWidth="4" />
            <rect x="4" y="17" width="26" height="20" rx="4" fill={G_DARK} />
          </svg>
        ) : (
          <div style={{ width: 12, height: 44, borderRadius: 6, background: G_DARK }} />
        )}
        <div style={{ flex: 1 }} />
      </motion.div>
    </div>
  );
}

const CITY_RECORDS = ['PRISM data', 'graph', 'chunks', 'embeddings', 'vector indexes'];

export function Wipe(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const on = (n: number) => focusN === null || focusN === n;
  const ring = (n: number) => (focusN === n ? `0 0 0 4px ${TINT2}` : 'none');
  const count = (t: ReactNode) => <div style={{ ...mono(21, '#fff'), fontWeight: 700, lineHeight: 1.3 }}>{t}</div>;
  return (
    <L2Page testId="l2-wipe" {...p}>
      <Fill gap={16}>
        <motion.div {...fade(0.1)} style={{ fontSize: 24, lineHeight: 1.45, color: INK }}>
          Like clearing out <b>only your own lockers</b> in a shared changing room: find your name tag, empty those, and leave everyone else’s shut.
        </motion.div>
        <div style={{ flex: 1, minHeight: 360, display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', columnGap: 40 }}>
          {/* ours: the name tag over three lockers */}
          <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <motion.div data-step={1} data-on={on(1)} {...fadeUp(0.3)} style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 12, border: `2px solid ${TEAL}`, background: TINT, opacity: on(1) ? 1 : 0.4, boxShadow: ring(1), transition: 'opacity 300ms' }}>
              <Num n={1} size={38} on={on(1)} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>This lab’s name tag</div>
                <div style={{ ...mono(21) }}>prism_incident_decisions</div>
              </div>
            </motion.div>
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '2fr 1fr', columnGap: 18 }}>
              <div data-step={2} data-on={on(2)} style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: on(2) ? 1 : 0.4, transition: 'opacity 300ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Num n={2} size={34} on={on(2)} />
                  <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Logbook pages</span>
                </div>
                <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12 }}>
                  {['STORE_INCIDENT', 'STORE_VECTORS_INCIDENT'].map((t, i) => (
                    <div key={t} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Locker open at={1.2 + i * 0.4} inside={<>{count('1 row')}<div style={{ fontSize: 18, color: '#c7ced6' }}>cleared</div></>} />
                      <div style={{ ...mono(18, INK), fontWeight: 700, textAlign: 'center', overflowWrap: 'anywhere' }}>{t}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div data-step={3} data-on={on(3)} style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: on(3) ? 1 : 0.4, transition: 'opacity 300ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Num n={3} size={34} on={on(3)} />
                  <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>This visit</span>
                </div>
                <Locker open at={2.2} inside={<>{count('9 · 9 · 17')}<div style={{ fontSize: 18, color: '#c7ced6' }}>rows cleared</div></>} />
                <div style={{ ...mono(18, INK), fontWeight: 700, textAlign: 'center' }}>CHECKPOINTS · BLOBS · WRITES</div>
              </div>
            </div>
            <motion.div {...fade(2.8)} style={{ alignSelf: 'flex-start' }}>
              <Chip style={{ fontSize: 19 }}>thread_id = prism-agent-demo-001</Chip>
            </motion.div>
          </div>
          {/* the city's: shut and locked */}
          <motion.div data-untouched {...fadeUp(0.5)} style={{ minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '10px 16px', borderRadius: 12, border: '2px dashed var(--line)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <svg width="38" height="38" viewBox="0 0 34 40" aria-hidden style={{ flex: 'none' }}>
                <path d="M9 18v-6a8 8 0 0 1 16 0v6" fill="none" stroke={G_DARK} strokeWidth="4" />
                <rect x="4" y="17" width="26" height="20" rx="4" fill={G_DARK} />
              </svg>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>The city records</div>
                <div style={{ fontSize: 22, color: DIM }}>not touched</div>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 10 }}>
              {CITY_RECORDS.map((t) => (
                <div key={t} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Locker open={false} at={0} padlock />
                  <div style={{ fontSize: 19, color: INK, textAlign: 'center', lineHeight: 1.2, minHeight: 46 }}>{t}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 18, color: DIM, textAlign: 'right' }}>Row counts: saved output, cell 71</div>
          </motion.div>
        </div>
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.7d · two memories, one database connection ---------------- */

const SVG_FONT = 'Inter, sans-serif';
const SVG_MONO = 'JetBrains Mono, monospace';

/** a table name drawn as a chip inside the picture */
function TableChip({ x, y, w, t }: { x: number; y: number; w: number; t: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={8} fill="rgba(27,138,156,0.14)" stroke="#1b8a9c" strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize={19} fontFamily={SVG_MONO} fill="#146f7f">{t}</text>
    </g>
  );
}

export function StoreSaver(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const on = (n: number) => focusN === null || focusN === n;
  const dim = (n: number) => ({ opacity: on(n) ? 1 : 0.35, transition: 'opacity 300ms' });
  const bars = Array.from({ length: 22 });
  return (
    <L2Page testId="l2-storesaver" {...p}>
      <Fill gap={10}>
        <motion.div {...fade(0.1)} style={{ fontSize: 24, lineHeight: 1.45, color: INK }}>
          Like a records office with <b>one front door and two rooms</b>: today’s working notes in one, the permanent logbook in the other, each new page filed by its meaning as it comes in.
        </motion.div>
        <FitBox w={1300} h={590} max={1.1}>
          <svg data-storesaver width={1300} height={590} viewBox="0 0 1300 590" style={{ overflow: 'visible' }}>
            {/* the agent and the one connection */}
            <motion.g {...fade(0.2)}>
              <g transform="translate(30 170)">
                <ChiefInspector size={180} />
              </g>
              <text x={120} y={385} textAnchor="middle" fontSize={28} fontWeight={700} fill="var(--ink)" fontFamily={SVG_FONT}>AI Agent</text>
            </motion.g>
            <motion.g {...fade(0.6)}>
              <path d="M222 300H556" stroke="#5c6b78" strokeWidth={6} strokeLinecap="round" />
              <text x={390} y={350} textAnchor="middle" fontSize={24} fontWeight={600} fill="#146f7f" fontFamily={SVG_FONT}>one connection</text>
              <path d="M556 300C575 300 575 210 592 210M556 300C575 300 575 445 592 445" stroke="#5c6b78" strokeWidth={4} fill="none" />
            </motion.g>
            {/* the database, cut open: two rooms */}
            <motion.g {...fade(0.3)}>
              <path d="M548 70V540A372 40 0 0 0 1292 540V70" fill="rgba(27,138,156,0.08)" stroke="#1b8a9c" strokeWidth={3} />
              <ellipse cx={920} cy={70} rx={372} ry={40} fill="rgba(27,138,156,0.22)" stroke="#1b8a9c" strokeWidth={3} />
              <text x={920} y={80} textAnchor="middle" fontSize={26} fontWeight={700} fill="#146f7f" fontFamily={SVG_FONT}>Oracle AI Database</text>
            </motion.g>
            <motion.g data-step={1} data-on={on(1)} {...fadeUp(0.9)} style={dim(1)}>
              <rect x={592} y={130} width={666} height={190} rx={16} fill="var(--panel-strong)" stroke={focusN === 1 ? '#1b8a9c' : '#aab1ba'} strokeWidth={2} />
              <text x={620} y={174} fontSize={30} fontWeight={700} fill="var(--ink)" fontFamily={SVG_FONT}>Logbook <tspan fontFamily={SVG_MONO} fontSize={24} fill="#146f7f">OracleStore</tspan></text>
              <text x={620} y={210} fontSize={22} fill="var(--ink-dim)" fontFamily={SVG_FONT}>decisions kept across conversations</text>
              <TableChip x={620} y={252} w={184} t="store_incident" />
              <TableChip x={820} y={252} w={276} t="store_vectors_incident" />
            </motion.g>
            {/* a note comes down the connection; inside, it becomes 384 numbers */}
            <g data-step={2} data-on={on(2)} style={dim(2)}>
              <motion.g initial={{ x: 0, opacity: 0 }} animate={{ x: [0, 0, 360], opacity: [0, 1, 0] }} transition={{ delay: 1.6, duration: 1.8, times: [0, 0.2, 1], ease: EASE }}>
                <rect x={232} y={232} width={78} height={56} rx={6} fill="var(--panel-strong)" stroke="#5c6b78" strokeWidth={2} />
                <path d="M244 250h54M244 262h54M244 274h34" stroke="#8a919c" strokeWidth={3} strokeLinecap="round" />
                <text x={271} y={222} textAnchor="middle" fontSize={20} fill="var(--ink-dim)" fontFamily={SVG_FONT}>note</text>
              </motion.g>
              <motion.g {...fade(3.2)}>
                <text x={1110} y={170} textAnchor="middle" fontSize={20} fontWeight={700} fill="#146f7f" fontFamily={SVG_FONT}>384 numbers</text>
                {bars.map((_, i) => (
                  <rect key={i} x={1012 + i * 9} y={186 + ((i * 7) % 5) * 3} width={6} height={30 - ((i * 7) % 5) * 3} rx={2} fill="#1b8a9c" opacity={0.45 + ((i * 3) % 5) * 0.12} />
                ))}
                <path d="M1110 222C1110 244 1040 238 1040 252" stroke="#1b8a9c" strokeWidth={2.5} strokeDasharray="4 4" fill="none" />
              </motion.g>
            </g>
            <motion.g data-step={3} data-on={on(3)} {...fadeUp(1.3)} style={dim(3)}>
              <rect x={592} y={355} width={666} height={180} rx={16} fill="var(--panel-strong)" stroke={focusN === 3 ? '#1b8a9c' : '#aab1ba'} strokeWidth={2} />
              <text x={620} y={398} fontSize={30} fontWeight={700} fill="var(--ink)" fontFamily={SVG_FONT}>Notebook <tspan fontFamily={SVG_MONO} fontSize={24} fill="#146f7f">OracleSaver</tspan></text>
              <text x={620} y={434} fontSize={22} fill="var(--ink-dim)" fontFamily={SVG_FONT}>steps of this conversation, per thread</text>
              <TableChip x={620} y={470} w={150} t="checkpoints" />
              <TableChip x={782} y={470} w={206} t="checkpoint_blobs" />
              <TableChip x={1000} y={470} w={218} t="checkpoint_writes" />
            </motion.g>
          </svg>
        </FitBox>
        <motion.div {...fade(3.6)} style={{ fontSize: 23, color: INK, textAlign: 'center' }}>
          Each note is <b style={{ color: TEAL_D }}>embedded inside the database</b> as it is written, and found again by meaning.
        </motion.div>
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.7e · §5.4 bind the allowlist ---------------- */

export function Allowlist(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-allowlist" {...p}>
      <StepRow
        focusN={focusN}
        steps={[
          { title: 'The allowlist', grow: 1.3, body: <><div style={cap}>5 data tools</div>{DATA_TOOLS.map((t) => <Chip key={t} style={{ alignSelf: 'flex-start', fontSize: 18 }}>{t}</Chip>)}</> },
          { title: 'Three memory tools', body: <><div style={cap}>3 memory tools</div>{MEMORY_TOOLS.map((t) => <Chip key={t} style={{ alignSelf: 'flex-start', fontSize: 18 }}>{t}</Chip>)}</> },
          {
            title: 'The model learns only these',
            body: (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
                <ChiefInspector size={120} />
                <div style={{ fontSize: 21, color: INK }}>sees 8 names, types, docstrings</div>
                <span data-no-ninth style={{ padding: '6px 16px', borderRadius: 999, border: '2px dashed #8a97a3', fontSize: 20, fontWeight: 700, color: DIM }}>no 9th tool</span>
              </div>
            ),
          },
        ]}
      />
    </L2Page>
  );
}

/* ---------------- 2.7f · §5.5 the system prompt: three layers ---------------- */

export function ThreeLayers(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  const layers = [
    { n: 1, t: 'The inspection manual (SOP)', code: 'INCIDENT_TRIAGE_SKILL', s: 'order of checks · evidence bar · escalation', icon: 'book' as IconName },
    { n: 2, t: 'Tool output is data', code: 'Security', s: 'do not follow instructions in tool output', icon: 'lock' as IconName },
    { n: 3, t: 'The report form', code: 'Final response format', s: 'JSON: recommendation, rationale, next_steps · after remember', icon: 'clipboard' as IconName },
  ];
  return (
    <L2Page testId="l2-layers" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {layers.map((l, i) => (
          <motion.div key={l.n} data-layer={l.n} {...fadeUp(0.2 + i * 0.45)} style={{ flex: 1, ...card(focusN === l.n), background: focusN === l.n ? CARD : TINT, opacity: lit(l.n) ? 1 : 0.4, padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 20, marginLeft: i * 30, marginRight: i * 30 }}>
            <Num n={l.n} size={40} on={lit(l.n)} />
            <LineIcon name={l.icon} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 27, fontWeight: 700, color: INK }}>{l.t}</div>
              <div style={{ fontSize: 20, color: DIM }}>{l.s}</div>
            </div>
            <Chip style={{ fontSize: 19 }}>{l.code}</Chip>
          </motion.div>
        ))}
        <ArrowDown h={30} />
        <motion.div {...fadeUp(1.8)} style={{ alignSelf: 'center', padding: '10px 26px', borderRadius: 12, background: 'rgba(31,42,51,0.92)', color: '#fff', ...mono(22, '#fff'), fontWeight: 700 }}>AGENT_SYSTEM · 2,533 chars</motion.div>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.7g, 2.7h · the first run, then the trace and the checks ---------------- */

export const CALLS = ['get_asset_overview', 'recall_similar', 'get_asset_incident_brief', 'recall', 'remember'];
/** cell 79's trace, cumulative ms: ● call, ○ result */
const TRACE: { t: string; at: number; result?: boolean }[] = [
  { t: 'get_asset_overview', at: 0.08 },
  { t: 'recall_similar', at: 0.16 },
  { t: 'get_asset_incident_brief', at: 0.26 },
  { t: 'get_asset_overview', at: 0.34, result: true },
  { t: 'recall_similar', at: 0.42, result: true },
  { t: 'get_asset_incident_brief', at: 0.5, result: true },
  { t: 'recall', at: 0.6 },
  { t: 'recall', at: 0.66, result: true },
  { t: 'remember', at: 0.78 },
  { t: 'remember', at: 0.84, result: true },
];
export const CHECKS_RUN: { s: 'OK' | 'REVIEW'; t: string }[] = [
  { s: 'REVIEW', t: 'final JSON shape' },
  { s: 'OK', t: 'tool observed -> recall' },
  { s: 'OK', t: 'tool observed -> get_asset_incident_brief' },
  { s: 'OK', t: 'tool observed -> remember' },
  { s: 'OK', t: 'answer grounded by evidence tool' },
];

export function FirstRun(p: L2Props) {
  const step = p.step ?? 1;
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  return (
    <L2Page testId="l2-firstrun" hasRed={step === 2} {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <motion.div data-part={1} {...fadeUp(0.2)} style={{ ...card(focusN === 1), opacity: lit(1) ? 1 : 0.4, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Num n={1} on={lit(1)} size={32} />
          {CALLS.map((c, i) => [
            i > 0 ? <span key={`a${i}`} style={{ color: TEAL }}>→</span> : null,
            <motion.span key={c} data-call={c} {...fadeUp(0.4 + i * 0.3)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: c === 'remember' ? TEAL : TINT, color: c === 'remember' ? '#fff' : TEAL_D, ...mono(18, c === 'remember' ? '#fff' : TEAL_D), fontWeight: 700 }}>
              <span style={{ opacity: 0.7 }}>{i + 1}</span> {c}
            </motion.span>,
          ])}
          <span style={{ color: TEAL }}>→</span>
          <motion.span {...fadeUp(2)} style={{ padding: '6px 12px', borderRadius: 10, background: 'rgba(31,42,51,0.92)', ...mono(18, '#fff'), fontWeight: 700 }}>final JSON</motion.span>
        </motion.div>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <motion.div {...fadeUp(2.2)} style={{ ...card(), padding: '12px 16px', fontSize: 20, color: INK }}>
                  <b>recall</b> returned empty: memory was empty on the first run
                </motion.div>
                <motion.div {...fadeUp(2.5)} style={{ ...card(), padding: '12px 16px', fontSize: 20, color: INK, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  a longer place name <span style={{ color: TEAL }}>→</span> <Chip>“Harbor Bridge”</Chip>
                  <span style={{ fontSize: 17, color: DIM }}>the agent passes the asset’s exact name</span>
                </motion.div>
                <motion.div data-part={2} {...fadeUp(2.8)} style={{ ...card(focusN === 2), opacity: lit(2) ? 1 : 0.4, flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Num n={2} on={lit(2)} size={30} />
                    <span style={{ fontSize: 21, fontWeight: 700, color: INK }}>remember must come before the final answer</span>
                  </div>
                  <Quote style={{ fontSize: 19 }}>{'That message must come AFTER you have called `remember(asset_name, note)`\nsuccessfully, per step 4 of the SOP.'}</Quote>
                </motion.div>
              </div>
              <motion.div data-part={3} {...fadeUp(3.2)} style={{ ...card(true), background: TINT, opacity: lit(3) ? 1 : 0.4, padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Num n={3} on={lit(3)} size={30} />
                  <span style={capTeal}>Stored by remember · saved output</span>
                </div>
                <div style={{ fontSize: 29, lineHeight: 1.5, color: INK }}>
                  “Hairline cracking near bearing plate at Harbor Bridge … south side, approximately 85 mm crack length. Recommend immediate structural engineering review and propose a load restriction.”
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="trace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 18 }}>
              <div data-part={4} style={{ ...card(focusN === 4), opacity: lit(4) ? 1 : 0.4, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Num n={4} on={lit(4)} size={30} />
                  <span style={cap}>Trace · cumulative ms · cell 79 · ● call ○ result</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                  {TRACE.map((t, i) => (
                    <motion.div key={i} {...fadeUp(0.3 + i * 0.15)} style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', alignItems: 'center', gap: 10 }}>
                      <span style={{ ...mono(15, INK) }}>{t.t}</span>
                      <div style={{ position: 'relative', height: 14 }}>
                        <div style={{ position: 'absolute', left: 0, right: 0, top: 6, height: 2, background: 'rgba(127,127,127,0.25)' }} />
                        <span style={{ position: 'absolute', left: `${t.at * 100}%`, top: 0, width: 14, height: 14, borderRadius: '50%', background: t.result ? CARD : TEAL, border: `2.5px solid ${TEAL}`, boxSizing: 'border-box' }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr)', gap: 10, alignItems: 'center' }}>
                  <span style={{ ...mono(15, DIM) }}>the language model</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(15, DIM) }}>
                    <span>0</span>
                    <span>57,005 ms</span>
                  </div>
                </div>
              </div>
              <div data-part={5} style={{ ...card(focusN === 5), opacity: lit(5) ? 1 : 0.4, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Num n={5} on={lit(5)} size={30} />
                  <span style={cap}>Quality checks</span>
                </div>
                {CHECKS_RUN.map((c, i) => (
                  <motion.div key={c.t} data-check={c.s} {...fadeUp(0.6 + i * 0.25)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 10, background: SOFT }}>
                    <span style={{ ...mono(15, '#fff'), fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: c.s === 'REVIEW' ? RED : TEAL }}>{c.s}</span>
                    <span style={{ ...mono(16, INK) }}>{c.t}</span>
                  </motion.div>
                ))}
                <div style={{ marginTop: 'auto', fontSize: 18, color: DIM }}>The trace shows what it did. The checks catch what it got wrong.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </L2Page>
  );
}

/* ---------------- 2.8 · §5.8 the key you save under decides what you find ---------------- */

export function WrongDrawer(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-drawer" {...p}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <StepRow
          focusN={focusN}
          steps={[
            { title: 'Open the logbook', grow: 0.9, body: <><LineIcon name="book" size={70} /><Chip style={{ alignSelf: 'flex-start', fontSize: 17 }}>store.search(…, limit=5)</Chip></> },
            {
              title: 'Filed under which name?',
              body: (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                  {[
                    { k: 'Harbor Bridge', v: 'empty', on: false },
                    { k: 'bearing plate', v: '1 note', on: true },
                  ].map((d) => (
                    <div key={d.k} data-drawer-key={d.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 12, border: `2px solid ${d.on ? TEAL : 'var(--line)'}`, background: d.on ? TINT : SOFT }}>
                      <span style={{ ...mono(20, INK), fontWeight: 700 }}>{d.k}</span>
                      <span style={{ fontSize: 19, color: d.on ? TEAL_D : DIM, fontWeight: 700 }}>{d.v}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: 'The note itself',
              grow: 1.2,
              body: (
                <>
                  <div style={{ fontSize: 20, lineHeight: 1.45, color: INK, padding: '12px 14px', borderRadius: 10, background: SOFT }}>“Hairline cracking near bearing plate at Harbor Bridge … south side, approximately 85……”</div>
                  <Quote style={{ fontSize: 18 }}>recall("Harbor Bridge") → no match</Quote>
                </>
              ),
            },
          ]}
        />
        <div style={{ fontSize: 15, color: DIM, textAlign: 'center' }}>Saved output, cell 81 · updated_at 2026-10-21 08:39:38</div>
      </div>
    </L2Page>
  );
}
