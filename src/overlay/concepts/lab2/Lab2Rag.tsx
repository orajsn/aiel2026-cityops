import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, ArrowDown, CARD, ChiefInspector, Chip, Db, DIM, Folder, GREY, INK, L2Page, Net, Num, Portrait, Quote, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props,
} from './parts';
import { Fill, FitBox } from '../Fill';
import { BigFolder, CAB_DARK, CAB_GREY, CAB_LIGHT, Cabinet, DeskPerson, Pile } from './ragArt';

/**
 * Lab 2 · RAG, the filing cabinet (the deck's chapter 4): look it up before answering, then the notebook's
 * §1.2 to §1.9 as pictures with numbered steps, and where RAG runs out (a question is not a job).
 */

/* ---------------- 2.2, 2.2a, 2.2b · look it up before answering ---------------- */

/** the five steps of RAG, along the foot of the picture: the technical name, the plain words under it */
const PIPE: { label: string; plain: string }[] = [
  { label: 'Question', plain: 'ask' },
  { label: 'Embed', plain: 'label it' },
  { label: 'Similarity search', plain: 'find the folders' },
  { label: 'Top-k into prompt', plain: 'hand over five' },
  { label: 'Grounded answer', plain: 'answer from them' },
];

function Pipeline({ hi }: { hi: number[] | 'all' }) {
  return (
    <div data-pipeline style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      {PIPE.map((s, i) => {
        const on = hi === 'all' || hi.includes(i);
        return [
          i > 0 ? <Arrow key={`a${i}`} w={44} delay={0.2 + i * 0.3} /> : null,
          <motion.div key={s.label} data-pipe={s.label} data-on={on} initial={{ opacity: 0, y: 8 }} animate={{ opacity: on ? 1 : 0.4, y: 0 }} transition={{ delay: hi === 'all' ? 0.2 + i * 0.3 : 0.2, duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 12, border: `2px solid ${on ? TEAL : 'var(--line)'}`, background: on ? TINT : SOFT }}>
            <Num n={i + 1} on={on} size={32} />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: INK, whiteSpace: 'nowrap' }}>{s.label}</div>
              <div style={{ fontSize: 17, color: DIM, whiteSpace: 'nowrap' }}>{s.plain}</div>
            </div>
          </motion.div>,
        ];
      })}
    </div>
  );
}

const capBig = { fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.25 } as const;
const subBig = { fontSize: 22, color: DIM, lineHeight: 1.35 } as const;
const at = (x: number, y: number, w: number) => ({ position: 'absolute' as const, left: x, top: y, width: w });

/** one column of the picture: the drawing standing on a common floor line, the caption under it */
function Col({ x, w, delay, title, sub, children }: { x: number; w: number; delay: number; title: string; sub: ReactNode; children: ReactNode }) {
  return (
    <motion.div {...fadeUp(delay)} style={{ ...at(x, 0, w), display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>{children}</div>
      <div style={{ ...capBig, marginTop: 14 }}>{title}</div>
      <div style={{ ...subBig, marginTop: 4 }}>{sub}</div>
    </motion.div>
  );
}

/** the answer, drawn: a teal speech bubble with its lines, a folder tag in the corner */
function AnswerBubble() {
  return (
    <svg width="240" height="210" viewBox="0 0 240 210" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <path d="M14 20a14 14 0 0 1 14-14h184a14 14 0 0 1 14 14v116a14 14 0 0 1-14 14H90l-36 34 6-34H28a14 14 0 0 1-14-14z" fill="#1b8a9c" />
      {[44, 74, 104].map((y, i) => (
        <motion.path key={y} d={`M40 ${y}H${i === 2 ? 150 : 196}`} stroke="#fff" strokeWidth="8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 4.2 + i * 0.3, duration: 0.5, ease: EASE }} />
      ))}
      <g transform="translate(170 118)">
        <path d="M0 6a4 4 0 0 1 4-4h16l6 6h26a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4z" fill="#fff" />
        <path d="M0 16h56" stroke="#1b8a9c" strokeWidth="2" opacity="0.5" />
      </g>
    </svg>
  );
}

/** click 1: Vance asks, the cabinet's drawer opens, one folder flies to the engineer's desk, the answer comes from it */
function LookItUp() {
  return (
    <div data-cabinet style={{ position: 'relative', width: 1400, height: 470 }}>
      <Col x={0} w={330} delay={0.2} title="Vance asks" sub="a plain question">
        <Portrait who="vance" size={120} />
        <div style={{ marginTop: 14, fontSize: 22, lineHeight: 1.35, padding: '12px 16px', borderRadius: 16, border: `2px solid ${TEAL}`, background: TINT, color: INK }}>“What recent issues have been reported on Harbor Bridge?”</div>
      </Col>
      <div style={{ ...at(318, 200, 70) }}>
        <Arrow w={64} delay={0.9} />
      </div>
      <Col x={380} w={300} delay={0.7} title="The filing cabinet" sub="every inspection report, labelled">
        <Cabinet w={230} open={0} openAt={1.4} />
      </Col>
      {/* the one folder: out of the drawer, across to the desk */}
      <motion.div data-flying-folder initial={{ opacity: 0, x: 470, y: 40, scale: 0.6 }} animate={{ opacity: [0, 1, 1], x: [470, 470, 838], y: [40, 0, 196], scale: [0.6, 0.8, 1] }} transition={{ delay: 2.2, duration: 1.6, times: [0, 0.3, 1], ease: EASE }} style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }}>
        <BigFolder w={104} />
      </motion.div>
      <Col x={720} w={340} delay={1} title="Pull the right folder" sub="the engineer reads it at the desk">
        <DeskPerson w={320} />
      </Col>
      <div style={{ ...at(1072, 200, 70) }}>
        <Arrow w={64} delay={3.6} />
      </div>
      <Col x={1140} w={260} delay={3.9} title="Answer from it" sub={<>the evidence first, <b style={{ color: INK }}>then</b> the answer</>}>
        <AnswerBubble />
      </Col>
    </div>
  );
}


/** click 2: the same cabinet, two ways to hand it over: everything onto the desk, or the five folders that matter */
function NotEveryFile() {
  return (
    <div style={{ position: 'relative', width: 1400, height: 470 }}>
      <div data-side="every-file" style={{ ...at(0, 0, 480), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
        <div style={{ ...cap, fontSize: 19, color: INK }}>Every file at once</div>
        <div style={{ position: 'relative', width: 340, height: 272, marginTop: 24 }}>
          <DeskPerson w={340} />
          <div style={{ position: 'absolute', left: -24, top: 16 }}>
            <Pile n={15} w={230} at={0.5} />
          </div>
        </div>
        <div style={{ ...subBig, display: 'flex', gap: 22 }}>
          <span>Slow</span>
          <span>Costly</span>
          <span>Worse answers</span>
        </div>
        <motion.div {...fadeUp(2)} style={{ fontSize: 26, fontWeight: 700, color: RED }}>✗ the answer drowns in noise</motion.div>
      </div>
      <motion.div {...fadeUp(0.2)} style={{ ...at(520, 60, 360), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="60" height="24" viewBox="0 0 60 24" aria-hidden style={{ transform: 'scaleX(-1)', flex: 'none' }}>
            <path d="M2 12H50" stroke={GREY} strokeWidth="3" strokeDasharray="5 6" />
            <path d="M44 5l8 7-8 7" stroke={GREY} strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <Cabinet w={170} lit={[0, 1, 2]} />
          <Arrow w={60} delay={2.4} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 19, fontWeight: 600, marginTop: -8 }}>
          <span style={{ color: DIM }}>everything</span>
          <span style={{ color: TEAL_D }}>top 5</span>
        </div>
        <div style={{ ...capBig, textAlign: 'center' }}>The same cabinet</div>
        <div style={{ ...subBig, textAlign: 'center' }}>cut into labelled folders</div>
      </motion.div>
      <motion.div data-side="top-5" {...fadeUp(2.4)} style={{ ...at(920, 0, 480), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
        <div style={{ ...capTeal, fontSize: 19 }}>The 5 most relevant</div>
        <div style={{ position: 'relative', width: 340, height: 272, marginTop: 24 }}>
          <DeskPerson w={340} />
          <div style={{ position: 'absolute', left: 26, top: 120, display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div key={i} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 + i * 0.2, duration: 0.4, ease: EASE }}>
                <Folder size={52} />
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ ...subBig, display: 'flex', gap: 22 }}>
          <span>Fast</span>
          <span>Cheap</span>
          <span>Grounded answers</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: TEAL_D }}>✓ only the right evidence gets through</div>
      </motion.div>
    </div>
  );
}

const PILLARS = [
  { t: 'Right data', s: 'the reports about this bridge, not every bridge' },
  { t: 'Right moment', s: 'this morning’s inspection, not last year’s' },
  { t: 'Right amount', s: 'five folders, not the whole cabinet' },
];

/** click 3: the cabinet opens, three folders fan out: what makes a retrieval good */
function RightFolder() {
  return (
    <div style={{ position: 'relative', width: 1400, height: 470 }}>
      <motion.div {...fade(0.1)} style={{ ...at(30, 20, 320), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
        <Cabinet w={260} open={1} openAt={0.3} />
        <div style={capBig}>Pull the right folder</div>
      </motion.div>
      <svg width="140" height="470" viewBox="0 0 140 470" aria-hidden style={{ position: 'absolute', left: 350, top: 0, overflow: 'visible' }}>
        {[82, 232, 382].map((y, i) => (
          <motion.path key={y} d={`M4 232 C70 232 60 ${y} 130 ${y}`} fill="none" stroke={TEAL} strokeWidth={3} strokeDasharray="6 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 + i * 0.5, duration: 0.6, ease: EASE }} />
        ))}
      </svg>
      {PILLARS.map((x, i) => (
        <motion.div key={x.t} data-pillar={x.t} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.5, duration: 0.6, ease: EASE }} style={{ ...at(500, 20 + i * 150, 900), height: 124, display: 'flex', alignItems: 'center', gap: 26, padding: '0 26px', boxSizing: 'border-box', borderRadius: 16, border: `2px solid ${TEAL}`, background: CARD }}>
          <BigFolder w={110} />
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: INK }}>{x.t}</div>
            <div style={{ fontSize: 24, color: DIM }}>{x.s}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function RagIdea(p: L2Props) {
  const step = p.step ?? 1;
  return (
    <L2Page testId="l2-rag" hasRed={step === 2} {...p}>
      <Fill gap={14}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <FitBox w={1400} h={470} max={1.05}>
              {step === 1 ? <LookItUp /> : step === 2 ? <NotEveryFile /> : <RightFolder />}
            </FitBox>
          </motion.div>
        </AnimatePresence>
        {step === 3 && (
          <motion.div {...fadeUp(2.6)} style={{ alignSelf: 'center', padding: '12px 28px', borderRadius: 999, background: 'rgba(31,42,51,0.92)', color: '#fff', fontSize: 25, fontWeight: 600 }}>
            Bad answer? Check retrieval first.
          </motion.div>
        )}
        <Pipeline hi={step === 1 ? 'all' : step === 2 ? [3] : [1, 2]} />
      </Fill>
    </L2Page>
  );
}

/* ---------------- 2.2c · §1.2 the database turns the question into numbers ---------------- */

const BARS = Array.from({ length: 48 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));

/** a strip of bars: the vector, drawn (illustration); `small` is the label on a folder */
function Bars({ h, at = 1.6, n = 48 }: { h: number; at?: number; n?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: h, width: '100%' }}>
      {BARS.slice(0, n).map((v, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v * 100}%` }} transition={{ delay: at + i * 0.02, duration: 0.5, ease: EASE }} style={{ flex: 1, background: TEAL, borderRadius: 2, opacity: 0.85 }} />
      ))}
    </div>
  );
}

/** one part of the machine: picture on top, its numbered caption under it; lights with the drawer's focus */
function Part({ n, focusN, delay, title, children }: { n: number; focusN: number | null; delay: number; title: string; children: ReactNode }) {
  const on = focusN === null || focusN === n;
  return (
    <motion.div data-step={n} data-on={on} {...fadeUp(delay)} style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, opacity: on ? 1 : 0.35, transition: 'opacity 300ms' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</div>
      <div style={{ minHeight: 76, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, paddingTop: 12, borderTop: `3px solid ${focusN === n ? TEAL : 'var(--line)'}` }}>
        <Num n={n} on={on} size={44} />
        <span style={{ fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{title}</span>
      </div>
    </motion.div>
  );
}

export function Embed(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  return (
    <L2Page testId="l2-embed" {...p}>
      <Fill gap={18}>
        <div data-machine style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) 64px minmax(0, 1.15fr) 64px minmax(0, 1.25fr)', alignItems: 'stretch', columnGap: 6, minHeight: 360 }}>
          <Part n={1} focusN={focusN} delay={0.2} title="Your question, in plain words">
            <div style={{ position: 'relative', fontSize: 30, lineHeight: 1.3, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 18, padding: '26px 26px' }}>
              “bearing corrosion on a bridge”
              <svg width="34" height="22" viewBox="0 0 34 22" aria-hidden style={{ position: 'absolute', left: 40, bottom: -20 }}>
                <path d="M0 0h34L6 22z" fill="rgba(31,42,51,0.92)" />
              </svg>
            </div>
            <div style={{ fontSize: 22, color: DIM, marginTop: 34 }}>words: the cabinet cannot compare them yet</div>
          </Part>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 70 }}>
            <Arrow w={56} delay={0.9} />
          </div>
          <Part n={2} focusN={focusN} delay={0.8} title="Embedding model runs inside Oracle">
            {/* the database as a walled room: the model works inside it, the outside service stays crossed out */}
            <div style={{ position: 'relative', border: `3px solid ${TEAL}`, borderRadius: 22, background: TINT, padding: '30px 22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span style={{ position: 'absolute', top: -16, left: 22, padding: '2px 12px', background: CARD, ...capTeal, fontSize: 16 }}>Oracle AI Database</span>
              <Db size={120} />
              <Chip style={{ fontSize: 21 }}>ALL_MINILM_L12_V2</Chip>
              <Chip dim style={{ fontSize: 16, whiteSpace: 'normal', textAlign: 'center' }}>VECTOR_EMBEDDING(… USING :q AS data)</Chip>
              <div data-no-outside style={{ position: 'absolute', top: -30, right: -14, display: 'flex', flexDirection: 'column', alignItems: 'center', background: CARD, borderRadius: 12, padding: '4px 8px' }}>
                <svg width="64" height="44" viewBox="0 0 64 44" aria-hidden>
                  <path d="M16 38a12 12 0 0 1 0-24 16 16 0 0 1 30-2 11 11 0 0 1 4 26z" fill="none" stroke={GREY} strokeWidth="3" />
                  <path d="M10 6l44 34" stroke={GREY} strokeWidth="3.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 17, color: DIM, fontWeight: 600 }}>no outside service</span>
              </div>
            </div>
          </Part>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 70 }}>
            <Arrow w={56} delay={1.5} />
          </div>
          <Part n={3} focusN={focusN} delay={1.4} title="Out come 384 numbers">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
              <Bars h={170} />
              <motion.span {...fade(2.6)} style={{ fontSize: 84, fontWeight: 700, color: TEAL_D, lineHeight: 0.9 }}>384</motion.span>
            </div>
            <div style={{ fontSize: 16, color: DIM, margin: '8px 0 14px' }}>bars: illustration · 384: saved output</div>
            <Saved>✓ The ALL_MINILM_L12_V2 embedding model is active, and has 384 dimensions.</Saved>
          </Part>
        </div>
        {/* the everyday picture: every folder was labelled the same way when it was filed; now the question gets its label */}
        <motion.div data-everyday {...fadeUp(3.2)} style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 26, padding: '14px 24px', borderRadius: 16, background: SOFT }}>
          <div style={{ position: 'relative', flex: 'none' }}>
            <BigFolder w={92} on={false} />
            <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, height: 26, background: '#fff', borderRadius: 4, padding: '3px 5px', boxSizing: 'border-box' }}>
              <Bars h={20} at={0} n={24} />
            </div>
          </div>
          <div style={{ fontSize: 24, lineHeight: 1.4, color: INK }}>
            <span style={{ ...cap, fontSize: 15, display: 'block' }}>In everyday life</span>
            Every folder in the cabinet got <b>a label made of numbers</b> when it was filed. Now the question gets the same kind of label, so the two can be compared.
          </div>
        </motion.div>
      </Fill>
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
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)', gridTemplateRows: 'minmax(0, 1fr)', gap: 24, minHeight: 0 }}>
        <motion.div data-part={1} {...fadeUp(0.2)} style={{ ...card(focusN === 1), opacity: lit(1) ? 1 : 0.4, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Num n={1} on={lit(1)} />
            <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>Measure distance in meaning</span>
          </div>
          <div style={{ alignSelf: 'flex-start', fontSize: 20, color: '#fff', background: TEAL, borderRadius: 999, padding: '6px 16px' }}>“cracks or corrosion on bridge bearings”</div>
          <svg viewBox="0 0 320 320" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, minHeight: 0, width: '100%', height: '100%' }} aria-label="the question among the chunks" role="img">
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
              <motion.div key={i} data-near={r.asset} {...fadeUp(1.3 + i * 0.25)} style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr) auto', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 10, background: r.asset === 'Harbor Bridge' ? TINT : 'rgba(127,127,127,0.12)', fontSize: 22 }}>
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

/** a callout around the open folder: its number, its words; it lights with the drawer's focus step */
function Callout({ n, focusN, x, y, w, delay, title, children }: { n: number; focusN: number | null; x: number; y: number; w: number; delay: number; title: string; children: ReactNode }) {
  const on = focusN === null || focusN === n;
  return (
    <motion.div data-step={n} data-on={on} {...fadeUp(delay)} style={{ ...at(x, y, w), opacity: on ? 1 : 0.35, transition: 'opacity 300ms', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Num n={n} on={on} size={48} />
        <span style={{ fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{title}</span>
      </div>
      <div style={{ paddingLeft: 62, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </motion.div>
  );
}

/** a dotted leader from a callout to the part of the folder it talks about */
function Leader({ d, delay }: { d: string; delay: number }) {
  return <motion.path d={d} fill="none" stroke={TEAL} strokeWidth={2.5} strokeDasharray="5 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 0.6, ease: EASE }} />;
}

export function Rule(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  // the open folder sits in the middle of a 1400 × 520 drawing
  const FX = 430;
  const FY = 110;
  return (
    <L2Page testId="l2-rule" hasRed {...p}>
      <Fill>
        <FitBox w={1400} h={580} max={1.08}>
          <div style={{ position: 'relative', width: 1400, height: 580 }}>
            {/* the open folder, from above: two covers, a page in each */}
            <motion.svg {...fade(0.2)} width={1400} height={580} viewBox="0 0 1400 580" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
              <rect x={FX - 10} y={FY + 6} width={560} height={450} rx={14} fill="rgba(127,127,127,0.18)" />
              <path d={`M${FX} ${FY + 20}a12 12 0 0 1 12-12h90l14-14h148v456H${FX + 12}a12 12 0 0 1-12-12z`} fill="rgba(27,138,156,0.28)" stroke={TEAL} strokeWidth={3} />
              <path d={`M${FX + 274} ${FY - 6}h254a12 12 0 0 1 12 12v432a12 12 0 0 1-12 12H${FX + 274}z`} fill="rgba(27,138,156,0.22)" stroke={TEAL} strokeWidth={3} />
              <path d={`M${FX + 274} ${FY - 6}v456`} stroke={TEAL_D} strokeWidth={4} />
              {/* the left page: the retrieved notes, inside <context> */}
              <rect x={FX + 22} y={FY + 22} width={236} height={406} rx={6} fill="#fff" />
              {[90, 116, 142, 168, 194].map((y, i) => (
                <path key={y} d={`M${FX + 44} ${FY + y}H${FX + (i % 2 ? 210 : 236)}`} stroke="#b8c0c8" strokeWidth={6} strokeLinecap="round" />
              ))}
              <rect x={FX + 44} y={FY + 250} width={192} height={70} rx={8} fill="none" stroke={GREY} strokeWidth={2.5} strokeDasharray="7 7" />
              {/* the right page: more notes, one with a sticky note on it */}
              <rect x={FX + 290} y={FY + 22} width={236} height={406} rx={6} fill="#fff" />
              {[60, 86, 112, 250, 276, 302, 328, 354].map((y, i) => (
                <path key={y} d={`M${FX + 312} ${FY + y}H${FX + (i % 2 ? 478 : 504)}`} stroke="#b8c0c8" strokeWidth={6} strokeLinecap="round" />
              ))}
              <Leader d={`M380 150 C 410 150, 420 ${FY + 110}, ${FX + 40} ${FY + 110}`} delay={1} />
              <Leader d={`M380 410 C 410 410, 420 ${FY + 262}, ${FX + 44} ${FY + 284}`} delay={1.8} />
              <Leader d={`M1020 190 C 990 190, 990 ${FY + 160}, ${FX + 520} ${FY + 160}`} delay={2.6} />
            </motion.svg>
            {/* the mono tags and words on the pages, in HTML */}
            <div style={{ ...at(FX + 44, FY + 38, 200), ...mono(19), fontWeight: 700 }}>&lt;context&gt;</div>
            <div style={{ ...at(FX + 44, FY + 258, 192), height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, color: DIM, textAlign: 'center' }}>not in the folder</div>
            <div style={{ ...at(FX + 44, FY + 384, 200), ...mono(19), fontWeight: 700 }}>&lt;/context&gt;</div>
            <motion.div data-sticky initial={{ opacity: 0, rotate: 0, y: -14 }} animate={{ opacity: 1, rotate: 5, y: 0 }} transition={{ delay: 2.4, duration: 0.5 }} style={{ ...at(FX + 330, FY + 128, 200), padding: '12px 14px', background: '#f6f1df', border: `2.5px solid ${RED}`, borderRadius: 4, fontSize: 22, color: '#1f2a33', boxShadow: '0 4px 10px rgba(0,0,0,0.22)', boxSizing: 'border-box', textAlign: 'center' }}>
              “ignore your rules”
            </motion.div>
            <motion.div {...fade(3)} style={{ ...at(FX + 300, FY + 218, 220), whiteSpace: 'nowrap', textAlign: 'center', ...mono(16, TEAL_D), fontWeight: 700 }}>
              ↑ just text on a page
            </motion.div>
            {/* the system rule, pinned over the folder */}
            <motion.div {...fadeUp(0.4)} style={{ ...at(FX - 70, 10, 680), display: 'flex', justifyContent: 'center' }}>
              <Quote style={{ fontSize: 21, padding: '12px 18px', whiteSpace: 'nowrap' }}>System rule: use ONLY the facts in &lt;context&gt;</Quote>
            </motion.div>
            <Callout n={1} focusN={focusN} x={0} y={110} w={380} delay={0.8} title="Answer only from the folder">
              <div style={{ fontSize: 23, color: DIM, lineHeight: 1.4 }}>Like an open-book exam with one book: the facts come from these pages, not from memory.</div>
            </Callout>
            <Callout n={2} focusN={focusN} x={0} y={360} w={380} delay={1.6} title="If missing, say so">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: INK, padding: '10px 18px', borderRadius: 14, background: TINT, whiteSpace: 'nowrap' }}>“I don’t know”</span>
                <span style={{ fontSize: 22, color: DIM }}>instead of a guess</span>
              </div>
            </Callout>
            <Callout n={3} focusN={focusN} x={1030} y={150} w={370} delay={2.4} title="Folder text is data">
              <div style={{ fontSize: 23, color: DIM, lineHeight: 1.4 }}>A note inside the folder is something to read, not someone to obey.</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: TEAL_D }}>treated as data, never as an order</div>
              <div style={{ fontSize: 16, color: DIM }}>sticky note: illustration</div>
            </Callout>
          </div>
        </FitBox>
      </Fill>
    </L2Page>
  );
}


/* ---------------- 2.3a · §1.7–1.8 RAG plumbing, by hand then LangChain ---------------- */

/** a horizontal pipe drawn behind a row: grey with hand-fitted joints, or one smooth teal run with couplings */
function PipeLine({ smooth, joints }: { smooth: boolean; joints: number[] }) {
  const c = smooth ? TEAL : '#9aa4ae';
  const d = smooth ? '#146f7f' : '#7d8791';
  return (
    <svg width="100%" height="56" viewBox="0 0 1000 56" preserveAspectRatio="none" aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -28, display: 'block' }}>
      <rect x="0" y="12" width="1000" height="32" rx="16" fill={c} opacity={smooth ? 0.85 : 0.7} />
      <rect x="0" y="16" width="1000" height="7" rx="3" fill="#fff" opacity="0.25" />
      {joints.map((x) => (
        <rect key={x} x={x - 9} y="4" width="18" height="48" rx="4" fill={d} />
      ))}
    </svg>
  );
}

/** a station standing on the pipe: its number, its words, its picture; lights with the drawer's focus */
function Station({ n, focusN, delay, title, children }: { n: number; focusN: number | null; delay: number; title: string; children: ReactNode }) {
  const on = focusN === null || focusN === n;
  return (
    <motion.div data-step={n} data-on={on} {...fadeUp(delay)} style={{ position: 'relative', zIndex: 1, flex: '1 1 0', minWidth: 0, ...card(focusN === n), background: CARD, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10, opacity: on ? 1 : 0.35, transition: 'opacity 300ms', boxShadow: '0 3px 10px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Num n={n} on={on} size={40} />
        <span style={{ fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{title}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>{children}</div>
    </motion.div>
  );
}

/** a wrench over a joint: the by-hand fitting between two stations */
function Wrench({ delay }: { delay: number }) {
  return (
    <motion.svg {...fade(delay)} width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#7d8791" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flex: 'none', position: 'relative', zIndex: 1, background: CARD, borderRadius: '50%', padding: 4 }}>
      <path d="M30 6a10 10 0 0 0-9 14L7 34a4 4 0 0 0 6 6l14-14a10 10 0 0 0 14-9l-6 6-6-2-2-6z" />
    </motion.svg>
  );
}

const rowLabel = { flex: 'none', width: 215, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 } as const;

export function Plumbing(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit4 = focusN === null || focusN === 4;
  return (
    <L2Page testId="l2-plumbing" {...p}>
      <Fill gap={18}>
        {/* by hand: three stations on a grey pipe, a hand-fitted joint between each */}
        <div data-row="by-hand" style={{ flex: '1 0 auto', display: 'flex', alignItems: 'stretch', gap: 18 }}>
          <motion.div {...fadeUp(0.1)} style={rowLabel}>
            <span style={{ fontSize: 30, fontWeight: 700, color: INK }}>By hand</span>
            <span style={{ fontSize: 22, color: DIM, lineHeight: 1.35 }}>three moving parts, fitted one by one</span>
          </motion.div>
          <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PipeLine smooth={false} joints={[]} />
            <Station n={1} focusN={focusN} delay={0.3} title="Fetch the folders">
              <div style={{ display: 'flex', gap: 6 }}>
                <Folder size={84} />
                <Folder size={84} />
                <Folder size={84} />
              </div>
              <Chip style={{ alignSelf: 'flex-start', fontSize: 21 }}>retrieve_context</Chip>
            </Station>
            <div style={{ alignSelf: 'center' }}>
              <Wrench delay={0.8} />
            </div>
            <Station n={2} focusN={focusN} delay={0.9} title="Write the brief">
              <Quote style={{ fontSize: 20, padding: '12px 16px' }}>{'<context>\n[1] asset=…\n[2] asset=…\n</context>\n\nQuestion: …'}</Quote>
            </Station>
            <div style={{ alignSelf: 'center' }}>
              <Wrench delay={1.4} />
            </div>
            <Station n={3} focusN={focusN} delay={1.5} title="One call to the model">
              <Net w={200} live />
              <Chip style={{ alignSelf: 'flex-start', fontSize: 21 }}>POST /api/chat</Chip>
            </Station>
          </div>
        </div>
        <motion.div {...fadeUp(1.9)} style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 16, paddingLeft: 233 }}>
          <ArrowDown h={44} delay={1.9} />
          <span style={{ fontSize: 23, color: DIM }}>
            Like a plumber who stops fitting each joint by hand: <b style={{ color: INK }}>the same three steps, screwed into one pipe</b>.
          </span>
        </motion.div>
        {/* LangChain: the same path as one smooth pipe; a drop of light runs through it */}
        <div data-row="langchain" data-step={4} data-on={lit4} style={{ flex: '0 0 auto', display: 'flex', alignItems: 'stretch', gap: 18, opacity: lit4 ? 1 : 0.35, transition: 'opacity 300ms' }}>
          <motion.div {...fadeUp(2.1)} style={rowLabel}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Num n={4} on={lit4} size={40} />
              <span style={{ fontSize: 28, fontWeight: 700, color: INK }}>LangChain</span>
            </span>
            <span style={{ fontSize: 22, color: DIM, lineHeight: 1.35 }}>same path, one pipe</span>
          </motion.div>
          <motion.div {...fadeUp(2.3)} style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 18, padding: '26px 22px', ...card(focusN === 4), background: TINT }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 0, alignSelf: 'stretch', minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <PipeLine smooth joints={[]} />
              <motion.div aria-hidden initial={{ left: '0%', opacity: 0 }} animate={{ left: ['0%', '96%'], opacity: [0, 1, 1, 0] }} transition={{ delay: 3, duration: 2.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.5 }} style={{ position: 'absolute', top: '50%', marginTop: -9, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px rgba(27,138,156,0.9)', zIndex: 0 }} />
              {['rag_prompt', 'llm', 'StrOutputParser()'].flatMap((t, i) => [
                i > 0 ? <span key={`j${i}`} aria-label="|" style={{ position: 'relative', zIndex: 1, width: 18, height: 50, borderRadius: 4, background: '#146f7f' }} /> : null,
                <motion.span key={t} {...fadeUp(2.6 + i * 0.3)} style={{ position: 'relative', zIndex: 1, padding: '8px 16px', borderRadius: 10, background: CARD, border: `2px solid ${TEAL}`, ...mono(22, TEAL_D), fontWeight: 700 }}>
                  {t}
                </motion.span>,
              ])}
            </div>
            <div style={{ flex: 'none', width: 360 }}>
              <Saved>✓ LangChain RAG chain ready: rag_prompt, rag_chain, rag_answer</Saved>
            </div>
          </motion.div>
        </div>
        <motion.div {...fadeUp(3.4)} style={{ flex: 'none', alignSelf: 'center', padding: '12px 28px', borderRadius: 999, border: `2px solid ${TEAL}`, background: TINT, fontSize: 24, fontWeight: 600, color: INK }}>
          LangChain saves two or three lines. <span style={{ color: TEAL_D }}>Grounding is still your job.</span>
        </motion.div>
      </Fill>
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
const CLAIMS = [
  'Expansion joint at east approach (EJ-1) failed under high tidal gusts, resulting in a 400 mm open gap and exposed reinforcement.…',
  'Complete blockage of multiple scuppers on the west side, causing deck ponding up to 60 mm depth in lane 4 over an approximate 10 m longitudinal ext…',
];
/** where things sit in the 1400 × 620 drawing */
const SRC_Y = (i: number) => 64 + i * 108;
/** the claims' tops inside the answer page (which starts at y 120) */
const CLAIM_TOP = [84, 244];

/** a footnote marker: the claim's number in a small teal square */
function Mark({ n, size = 34 }: { n: number; size?: number }) {
  return <span style={{ width: size, height: size, flex: 'none', borderRadius: 8, background: TEAL, color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.55 }}>{n}</span>;
}

export function Checkable(p: L2Props) {
  const focusN = useFocusN(p.focusId);
  const lit = (n: number) => focusN === null || focusN === n;
  const dimStyle = (n: number) => ({ opacity: lit(n) ? 1 : 0.35, transition: 'opacity 300ms' });
  return (
    <L2Page testId="l2-check" {...p}>
      <Fill>
        <FitBox w={1400} h={640} max={1.06}>
          <div style={{ position: 'relative', width: 1400, height: 640 }}>
            {/* 1 · the question, scoped to Harbor Bridge */}
            <motion.div data-step={1} data-on={lit(1)} {...fadeUp(0.2)} style={{ ...at(0, 0, 640), ...dimStyle(1), display: 'flex', alignItems: 'center', gap: 14 }}>
              <Num n={1} on={lit(1)} size={44} />
              <Portrait who="vance" size={80} />
              <div style={{ fontSize: 23, lineHeight: 1.35, color: '#fff', background: 'rgba(31,42,51,0.92)', borderRadius: 16, padding: '12px 18px' }}>“What recent issues have been reported on Harbor Bridge?”</div>
            </motion.div>
            {/* 2 · the answer, as a page with footnote marks */}
            <motion.div data-step={2} data-on={lit(2)} {...fadeUp(0.7)} style={{ ...at(0, 120, 620), height: 410, ...dimStyle(2), boxSizing: 'border-box', background: '#fff', borderRadius: '6px 40px 6px 6px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: `2px solid ${focusN === 2 ? TEAL : 'var(--line)'}`, padding: '20px 26px', color: '#1f2a33' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Num n={2} on={lit(2)} size={40} />
                <span style={{ ...capTeal, fontSize: 17 }}>The answer · saved output</span>
              </div>
              {CLAIMS.map((t, i) => (
                <motion.div key={i} data-claim={i + 1} {...fadeUp(1.2 + i * 0.5)} style={{ position: 'absolute', left: 26, right: 26, top: CLAIM_TOP[i], display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 22, lineHeight: 1.4 }}>
                  <span style={{ flex: 1 }}>{t}</span>
                  <Mark n={i + 1} />
                </motion.div>
              ))}
            </motion.div>
            {/* the everyday picture, under the page */}
            <motion.div data-everyday {...fadeUp(3.6)} style={{ ...at(0, 548, 640), fontSize: 23, lineHeight: 1.4, color: INK }}>
              Like <b>footnotes in a report</b>: every claim points to the page it came from.
            </motion.div>
            {/* the threads from each footnote mark to its row */}
            <svg width={1400} height={620} viewBox="0 0 1400 620" aria-hidden style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
              {[3, 4].map((row, i) => {
                const y1 = 120 + CLAIM_TOP[i] + 17;
                const y2 = SRC_Y(row) + 46;
                return <motion.path key={row} d={`M604 ${y1} C 700 ${y1}, 690 ${y2}, 772 ${y2}`} fill="none" stroke={TEAL} strokeWidth={3} strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 3 + i * 0.4, duration: 0.8, ease: EASE }} />;
              })}
            </svg>
            {/* 3 · the five rows it used, as folders */}
            <motion.div data-step={3} data-on={lit(3)} {...fade(1.6)} style={{ ...at(780, 0, 620), ...dimStyle(3), display: 'flex', alignItems: 'center', gap: 12 }}>
              <Num n={3} on={lit(3)} size={44} />
              <span style={{ fontSize: 26, fontWeight: 700, color: INK }}>The sources it used: top-5 rows</span>
            </motion.div>
            {SOURCES.map((s, i) => (
              <motion.div key={i} data-source={i + 1} data-claim-of={s.claim} {...fadeUp(1.8 + i * 0.22)} style={{ ...at(780, SRC_Y(i), 620), height: 92, ...dimStyle(3), boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr) auto', alignItems: 'center', gap: 14, padding: '0 16px', borderRadius: '4px 12px 12px 12px', background: s.claim ? TINT : 'rgba(127,127,127,0.10)', border: s.claim ? `2px solid ${TEAL}` : '2px solid transparent' }}>
                <Folder size={56} on={!!s.claim} />
                <div style={{ minWidth: 0 }}>
                  <div style={mono(17, TEAL_D)}>{s.src}</div>
                  <div style={{ fontSize: 19, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.t}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={mono(18, TEAL_D)}>{s.d}</span>
                  {s.claim && <Mark n={s.claim} size={30} />}
                </div>
              </motion.div>
            ))}
            <motion.div {...fade(3.8)} style={{ ...at(780, 604, 620), fontSize: 18, color: DIM, whiteSpace: 'nowrap' }}>
              saved output, cell 36 · cosine distance, smaller is closer
            </motion.div>
          </div>
        </FitBox>
      </Fill>
    </L2Page>
  );
}


/* ---------------- 2.4, 2.4a, 2.4b · a question is not a job ---------------- */

/** a balance scale: escalate on one pan, monitor on the other; it tips slowly once (a judgment, not a search) */
function Scale() {
  return (
    <svg width="120" height="84" viewBox="0 0 120 84" aria-hidden style={{ flex: 'none', overflow: 'visible' }}>
      <path d="M60 14v62M40 80h40" stroke={CAB_DARK} strokeWidth="4" strokeLinecap="round" />
      <motion.g style={{ transformOrigin: '60px 16px' }} initial={{ rotate: 0 }} animate={{ rotate: [0, -7, 4, -3] }} transition={{ delay: 1.6, duration: 2.4, ease: 'easeInOut' }}>
        <path d="M14 16h92" stroke={CAB_DARK} strokeWidth="4" strokeLinecap="round" />
        <path d="M14 16l-10 26h20zM106 16l-10 26h20z" fill="none" stroke={CAB_GREY} strokeWidth="2" />
        <path d="M2 42h24a12 6 0 0 1-24 0z" fill={TEAL} />
        <path d="M94 42h24a12 6 0 0 1-24 0z" fill={CAB_GREY} />
      </motion.g>
      <circle cx="60" cy="14" r="5" fill={CAB_DARK} />
    </svg>
  );
}

/** a clipboard with a ticked list: the fixed checklist (a workflow) */
function Clipboard({ w = 74 }: { w?: number }) {
  return (
    <svg width={w} height={w * 1.2} viewBox="0 0 60 72" aria-hidden style={{ flex: 'none' }}>
      <rect x="4" y="8" width="52" height="62" rx="5" fill={CAB_LIGHT} />
      <rect x="10" y="14" width="40" height="50" rx="2" fill="#fff" />
      <rect x="20" y="3" width="20" height="10" rx="3" fill={CAB_DARK} />
      {[24, 36, 48].map((y) => (
        <g key={y}>
          <path d={`M14 ${y}l3 3 5-6`} stroke={TEAL} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M26 ${y}h18`} stroke={CAB_GREY} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

const JOBS: { n: number; t: string; tag: string; sub: string; pic: ReactNode }[] = [
  {
    n: 1, t: 'Recurring?', tag: 'RAG × many', sub: 'many retrievals, then compare',
    pic: (
      <div style={{ display: 'flex', gap: 6 }}>
        {['Mar', 'Apr', 'Jun', 'Jul'].map((m) => (
          <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Folder size={46} />
            <span style={{ fontSize: 16, color: DIM }}>{m}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: 2, t: 'Cross-check work orders', tag: 'RAG again', sub: 'a second, independent lookup',
    pic: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Chip style={{ fontSize: 19 }}>Findings</Chip>
        <span style={{ color: TEAL, fontSize: 24, lineHeight: 1 }}>⇅</span>
        <Chip style={{ fontSize: 19 }}>Work orders</Chip>
      </div>
    ),
  },
  { n: 3, t: 'Escalate?', tag: 'needs judgment', sub: 'escalate or monitor: a judgment', pic: <Scale /> },
];
const JOB_Y = (i: number) => 196 + i * 140;

export function NotAJob(p: L2Props) {
  const step = p.step ?? 1;
  const job = upTo(step, 2);
  const coord = upTo(step, 3);
  return (
    <L2Page testId="l2-job" {...p}>
      <Fill>
        <FitBox w={1400} h={620} max={1.06}>
          <div style={{ position: 'relative', width: 1400, height: 620 }}>
            {/* a lookup: one trip to the cabinet and back */}
            <motion.div data-row="lookup" {...fadeUp(0.2)} style={{ ...at(0, 0, 1400), height: 160, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', boxSizing: 'border-box', ...card(), background: SOFT }}>
              <div style={{ width: 112, flex: 'none' }}>
                <div style={{ ...cap, fontSize: 16 }}>A lookup</div>
                <div style={{ fontSize: 22, color: DIM }}>one trip</div>
              </div>
              <Portrait who="vance" size={84} />
              <div style={{ fontSize: 23, padding: '10px 16px', borderRadius: 14, border: `2px solid ${TEAL}`, background: CARD, color: INK, whiteSpace: 'nowrap' }}>“What does the record say?”</div>
              <Arrow w={38} delay={0.6} />
              <motion.div {...fadeUp(0.8)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Cabinet w={58} lit={[1]} />
                <Folder size={46} />
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 23, fontWeight: 700, color: INK }}>1 retrieval</div>
                  <div style={{ fontSize: 19, color: DIM }}>the right folder</div>
                </div>
              </motion.div>
              <Arrow w={38} delay={1.2} />
              <motion.div {...fadeUp(1.4)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Net w={70} />
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 23, fontWeight: 700, color: INK }}>1 LLM call</div>
                  <div style={{ fontSize: 19, color: DIM }}>answer from it</div>
                </div>
              </motion.div>
              <Arrow w={38} delay={1.8} />
              <motion.span {...fadeUp(2)} style={{ fontSize: 23, fontWeight: 700, color: '#fff', background: TEAL, borderRadius: 999, padding: '8px 18px', whiteSpace: 'nowrap' }}>done ✓</motion.span>
            </motion.div>

            {/* a job: Vance's real question opens into three jobs */}
            <motion.div data-row="job" {...reveal(job, 0.2)} style={{ ...at(0, 300, 380), display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ ...capTeal, fontSize: 16 }}>A job</div>
                <div style={{ fontSize: 22, color: DIM }}>…hides three jobs</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Portrait who="vance" size={84} />
                <div style={{ fontSize: 24, lineHeight: 1.3, padding: '10px 18px', borderRadius: 14, border: `2px solid ${TEAL}`, background: TINT, color: INK }}>“What is the status of this bridge?”</div>
              </div>
            </motion.div>
            <svg width={1400} height={620} viewBox="0 0 1400 620" aria-hidden style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
              {JOBS.map((_, i) => (
                <motion.path key={`b${i}`} d={`M390 420 C 430 420, 410 ${JOB_Y(i) + 60}, 452 ${JOB_Y(i) + 60}`} fill="none" stroke={job ? TEAL : 'rgba(127,127,127,0.25)'} strokeWidth={3} strokeDasharray="6 6" initial={{ pathLength: 0 }} animate={{ pathLength: job ? 1 : 0 }} transition={{ delay: 0.5 + i * 0.3, duration: 0.6, ease: EASE }} />
              ))}
              {JOBS.map((_, i) => (
                <motion.path key={`c${i}`} d={`M1022 ${JOB_Y(i) + 60} C 1066 ${JOB_Y(i) + 60}, 1050 400, 1094 400`} fill="none" stroke={TEAL} strokeWidth={3} initial={{ pathLength: 0 }} animate={{ pathLength: coord ? 1 : 0 }} transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: EASE }} />
              ))}
            </svg>
            {JOBS.map((j, i) => (
              <motion.div key={j.t} data-subjob={j.n} {...reveal(job, 0.6 + i * 0.35)} style={{ ...at(452, JOB_Y(i), 570), height: 128, boxSizing: 'border-box', ...card(), background: CARD, padding: '10px 18px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', columnGap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Num n={j.n} size={34} />
                    <span style={{ fontSize: 24, fontWeight: 700, color: INK }}>{j.t}</span>
                  </div>
                  <div style={{ fontSize: 19, color: DIM, lineHeight: 1.3 }}>{j.sub}</div>
                  <span style={{ alignSelf: 'flex-start', padding: '2px 12px', borderRadius: 999, background: TINT2, color: TEAL_D, fontSize: 16, fontWeight: 700 }}>{j.tag}</span>
                </div>
                {j.pic}
              </motion.div>
            ))}

            {/* who coordinates: a checklist, or the chief inspector */}
            <motion.div data-row="coordinate" {...reveal(coord, 0.9)} style={{ ...at(1094, 196, 306), height: 400, boxSizing: 'border-box', ...card(true), background: TINT, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: INK, lineHeight: 1.25 }}>Something has to coordinate it all:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...card(), background: CARD, padding: '8px 14px' }}>
                <Clipboard w={56} />
                <div>
                  <div style={{ fontSize: 23, fontWeight: 700, color: INK }}>Checklist</div>
                  <div style={{ fontSize: 18, color: DIM }}>a workflow</div>
                </div>
              </div>
              <div style={{ fontSize: 20, color: DIM, textAlign: 'center' }}>or</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...card(true), background: CARD, padding: '8px 14px' }}>
                <ChiefInspector size={64} />
                <div>
                  <div style={{ fontSize: 23, fontWeight: 700, color: INK }}>Chief inspector</div>
                  <div style={{ fontSize: 18, color: DIM }}>an agent</div>
                </div>
              </div>
            </motion.div>
          </div>
        </FitBox>
      </Fill>
    </L2Page>
  );
}
