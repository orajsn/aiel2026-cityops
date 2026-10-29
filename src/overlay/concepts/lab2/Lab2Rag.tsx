import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE } from '../WidePanel';
import { LineIcon, type IconName } from '../icons';
import {
  Arrow, ArrowDown, CARD, ChiefInspector, Chip, Db, DIM, Folder, GREY, INK, L2Page, Net, Num, Portrait, Quote, RED, SOFT, Saved, StepRow, TEAL, TEAL_D, TINT, TINT2,
  cap, capTeal, card, fade, fadeUp, mono, reveal, upTo, useFocusN, type L2Props,
} from './parts';
import { Fill, FitBox } from '../Fill';
import { BigFolder, Cabinet, DeskPerson, Pile } from './ragArt';

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
                  <motion.div data-sticky initial={{ opacity: 0, rotate: 0, y: -10 }} animate={{ opacity: 1, rotate: 4, y: 0 }} transition={{ delay: 2, duration: 0.5 }} style={{ position: 'absolute', right: -8, top: -26, padding: '10px 14px', background: '#f6f1df', border: `2px solid ${RED}`, borderRadius: 4, fontSize: 19, color: '#1f2a33', boxShadow: '0 3px 8px rgba(0,0,0,0.2)' }}>
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
                  <span style={{ fontSize: 18, color: DIM }}>by hand</span>
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
                  <span style={{ fontSize: 18, color: DIM }}>LangChain</span>
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
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)', gap: 24, minHeight: 0 }}>
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
            <motion.div key={i} data-source={i + 1} data-claim-of={s.claim} {...fadeUp(1.5 + i * 0.22)} style={{ display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr) auto', gap: 10, alignItems: 'center', padding: '8px 12px', borderRadius: 10, background: s.claim ? TINT : 'rgba(127,127,127,0.10)', border: s.claim ? `2px solid ${TEAL}` : '2px solid transparent' }}>
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
        <motion.div data-row="lookup" {...fadeUp(0.2)} style={{ ...card(), padding: '14px 22px', display: 'grid', gridTemplateColumns: '300px 50px minmax(0, 1fr) 50px minmax(0, 1fr) 50px minmax(0, 1fr)', alignItems: 'center', gap: 8 }}>
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
        <motion.div data-row="job" {...reveal(upTo(step, 2), 0.2)} style={{ ...card(true), padding: '14px 22px', flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: 18 }}>
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
                      <Folder size={58} />
                      <span style={{ fontSize: 17, color: DIM }}>{m}</span>
                    </div>
                  ))}
                </div>
              ),
              q: 'same failure again?',
            },
            {
              n: 2, t: 'Cross-check work orders', tag: 'RAG again', sub: 'a second, independent lookup',
              pic: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: INK, flexWrap: 'wrap' }}>
                  <Chip style={{ fontSize: 21 }}>Findings</Chip>
                  <span style={{ color: TEAL, fontSize: 30 }}>⇄</span>
                  <Chip style={{ fontSize: 21 }}>Work orders</Chip>
                </div>
              ),
            },
            {
              n: 3, t: 'Escalate?', tag: 'needs judgment', sub: 'a judgment, not a search',
              pic: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                  <Chip style={{ fontSize: 21 }}>escalate?</Chip>
                  <span style={{ color: DIM }}>or</span>
                  <Chip dim style={{ fontSize: 21 }}>monitor</Chip>
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
              <div style={{ fontSize: 20, color: DIM }}>{j.sub}</div>
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
