import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE, WidePanel } from './WidePanel';
import { Db, Doc, Portrait, SitePhoto } from './ThreeLabs';
import { QuizCard } from './Ending';
import { ArrowRight, DIM, INK, SHAPES, TEAL, TEAL_D, TINT, fadeIn, pop } from './Recap';
import { FlowDown, Shield } from './lab1/parts';
import { Rich } from '../Rich';
import adbLogo from '../../assets/oracle/autonomous-ai-database.png';

/**
 * 3.18 · Takeaways of all three labs, the last page of the show (owner approved Flow318V3, 29 Oct): a tight
 * staircase, Lab 1 an assistant, Lab 2 an agent, Lab 3 an agent that remembers, standing on one teal foundation,
 * "One Oracle AI Database under all three"; the quiz card beside it is the page's one red thing.
 */

export interface AllLabsProps {
  kicker: string;
  message: string;
  steps: { tag: string; title: string; line: string; where: string }[];
  foundation: string;
  /** the quiz card beside the staircase; left out for now (owner, 9 Nov), the staircase then takes the whole width */
  quiz?: string[];
}

/** when each step rises, the foundation under them, then the quiz */
export const STEP_AT = [0.4, 1.8, 3.2];
export const FOUNDATION_AT = 4.6;
export const QUIZ_AT = 6;

function AssistantPicture({ t }: { t: number }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        {[<Doc key="d" label="PDF" w={52} />, <Db key="b" w={52} />, <SitePhoto key="p" w={78} />].map((s, i) => (
          <motion.div key={i} {...pop(t + 0.8 + i * 0.2)}>
            {s}
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeIn(t + 1.4)}>
        <FlowDown h={30} delay={t + 1.5} />
      </motion.div>
      <motion.div {...pop(t + 1.7)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: '11px 18px', borderRadius: 12, background: TEAL, color: '#fff', fontSize: 21, fontWeight: 700, whiteSpace: 'nowrap' }}>AI assistant</div>
        <Shield size={44} />
      </motion.div>
    </>
  );
}

function AgentPicture({ t }: { t: number }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* the agent's loop: a light goes round, slowly, once every few seconds */}
        <motion.div {...pop(t + 0.7)} style={{ position: 'relative', width: 100, height: 100, flex: 'none' }}>
          <svg width={100} height={100} viewBox="0 0 120 120" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="60" cy="60" r="44" fill="none" stroke="#b9d3da" strokeWidth={6} />
            <text x="60" y="66" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="700" fill={TEAL_D}>
              decide
            </text>
          </svg>
          <motion.div style={{ position: 'absolute', inset: 0 }} animate={{ rotate: 360 }} transition={{ delay: t + 1.4, duration: 5, ease: 'linear', repeat: Infinity }}>
            <span style={{ position: 'absolute', left: 43, top: 6, width: 14, height: 14, borderRadius: '50%', background: TEAL }} />
          </motion.div>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 5, minWidth: 0 }}>
          {SHAPES.map((s, i) => (
            <motion.div key={s.title} {...pop(t + 1 + i * 0.15)} style={{ background: TINT, borderRadius: 9, padding: '5px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {s.icon}
              <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', color: INK }}>{s.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div {...fadeIn(t + 1.8)} style={{ fontSize: 16, fontWeight: 700, color: TEAL_D }}>
        four shapes, one query
      </motion.div>
    </>
  );
}

function MemoryPicture({ t }: { t: number }) {
  const day = (who: 'mercer' | 'vance', label: string, at: number) => (
    <motion.div {...pop(at)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Portrait who={who} size={60} />
      <span style={{ fontSize: 13, fontWeight: 700, color: TEAL_D }}>{label}</span>
    </motion.div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {day('mercer', 'DAY 1', t + 0.8)}
      <ArrowRight w={22} at={t + 1} />
      <motion.div
        {...pop(t + 1.1)}
        style={{ padding: '9px 11px', borderRadius: 10, background: TINT, border: `2px solid ${TEAL}`, fontSize: 16, fontWeight: 700, color: TEAL_D }}
      >
        <motion.span animate={{ opacity: [1, 0.55, 1] }} transition={{ delay: t + 2, duration: 2.4, ease: 'easeInOut', repeat: Infinity }}>
          memory
        </motion.span>
      </motion.div>
      <ArrowRight w={22} at={t + 1.3} />
      {day('vance', 'DAY 2', t + 1.4)}
    </div>
  );
}

const PICTURES = [AssistantPicture, AgentPicture, MemoryPicture];

function Stair({ n, step, children }: { n: number; step: AllLabsProps['steps'][number]; children: ReactNode }) {
  const t = STEP_AT[n];
  return (
    <motion.div
      data-stair={n + 1}
      style={{ flex: 1, minWidth: 0, height: '100%', transformOrigin: 'bottom', borderRadius: 14, background: `linear-gradient(180deg, rgba(27,138,156,${0.06 + n * 0.05}), rgba(27,138,156,${0.16 + n * 0.05}))`, border: `2px solid ${TEAL}`, padding: '16px 14px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ delay: t, duration: 0.9, ease: EASE }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: TEAL_D, textTransform: 'uppercase' }}>{step.tag}</div>
      <div style={{ fontSize: 31, fontWeight: 700, marginTop: 4, lineHeight: 1.15, color: INK }}>{step.title}</div>
      <motion.div {...fadeIn(t + 0.6)} style={{ flex: 1, minHeight: 0, margin: '14px 0', borderRadius: 12, background: 'var(--panel-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* the picture grows with the step */}
        <div style={{ zoom: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>{children}</div>
      </motion.div>
      <div style={{ fontSize: 24, lineHeight: 1.35, color: INK, minHeight: '4.05em' }}><Rich text={step.line} /></div>
      <div style={{ fontSize: 15, color: DIM, marginTop: 4 }}>{step.where}</div>
    </motion.div>
  );
}

export function AllLabs({ kicker, message, steps, foundation, quiz }: AllLabsProps) {
  return (
    <WidePanel kicker={kicker} message={message} testId="all-labs" kickerColor="var(--teal)">
      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0, marginTop: 6 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          {/* three cards of one height, each rising in turn; the foundation stands apart under them */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'stretch', flex: 1, minHeight: 0, marginBottom: 20 }}>
            {steps.map((s, i) => {
              const Picture = PICTURES[i];
              return [
                i > 0 && (
                  <motion.div key={`a${i}`} {...fadeIn(STEP_AT[i] - 0.2)} style={{ alignSelf: 'center', flex: 'none' }}>
                    <ArrowRight w={22} />
                  </motion.div>
                ),
                <Stair key={s.tag} n={i} step={s}>
                  <Picture t={STEP_AT[i]} />
                </Stair>,
              ];
            })}
          </div>
          <motion.div
            data-foundation
            style={{ height: 80, flex: 'none', transformOrigin: 'left', borderRadius: 14, background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontSize: 25, fontWeight: 700 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: FOUNDATION_AT, duration: 1.1, ease: EASE }}
          >
            <span style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '3px solid var(--teal)', boxShadow: '0 3px 10px rgba(11,14,20,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <img data-logo="adb" src={adbLogo} alt="Oracle Autonomous AI Database" style={{ width: 66, height: 66, objectFit: 'contain' }} />
            </span>
            {foundation}
          </motion.div>
        </div>
        {quiz && <QuizCard quiz={quiz} delay={QUIZ_AT} style={{ flex: '0 0 256px' }} />}
      </div>
    </WidePanel>
  );
}
