import { motion } from 'motion/react';
import { DATA_TOOLS, MEMORY_TOOLS, SOP_STEPS, SOP_THRESHOLD } from '../../content/lab2Tools';
import { DB_WIDE, MODEL_WIDE, MODEL_WIDE_IN, px, py, skyScreen } from '../../world/skyPlaces';
import { Rich } from '../Rich';

const SHAPE_WORD = { table: 'table', json: 'JSON', graph: 'graph', vectors: 'vectors' } as const;

/** the data tools stand in a column between the database (left) and the model (right); screen units */
const COL = { x0: -0.24, x1: 0.24, top: 0.72, h: 0.17, gap: 0.035 };
/** the memory tools, under the model */
const MEM = { x0: 0.47, x1: 0.84, top: -0.1, h: 0.13, gap: 0.03 };
/** the skill, bottom left */
const SOP = { x0: -0.97, x1: -0.3, y0: -0.64, y1: -0.24 };

const fade = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.45 } });
const line = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay, duration: 0.5 } });

/**
 * Lab 2 page 5 · tools and the skill. The eight tools the notebook gives the agent, as cards beside the
 * 3D database and model: five data tools wired to the database (one shape each, the brief all four) and
 * three memory tools under the model. Then the skill: the SOP, with the one threshold to remember.
 */
export function Toolbelt({ message }: { message?: string }) {
  const db = skyScreen(DB_WIDE);
  const into = skyScreen(MODEL_WIDE_IN);
  const under = skyScreen(MODEL_WIDE);
  const rows = DATA_TOOLS.map((tool, i) => ({ tool, i, y1: COL.top - i * (COL.h + COL.gap), y0: COL.top - i * (COL.h + COL.gap) - COL.h }));
  return (
    <div className="tb">
      <svg className="tb__svg" viewBox="0 0 1920 1080" aria-hidden>
        {rows.map(({ i, y0, y1 }) => {
          const cy = (y0 + y1) / 2;
          return (
            <g key={i}>
              <motion.line x1={px(COL.x0)} y1={py(cy)} x2={px(db.x) + 70} y2={py(db.y)} stroke="#1B8A9C" strokeWidth={2} strokeOpacity={0.75} {...line(0.6 + i * 0.25)} />
              <motion.line x1={px(COL.x1)} y1={py(cy)} x2={px(into.x) - 10} y2={py(into.y)} stroke="#1B8A9C" strokeWidth={2} strokeDasharray="7 6" strokeOpacity={0.7} {...line(0.6 + i * 0.25)} />
            </g>
          );
        })}
      </svg>
      <motion.div className="tb__head" style={{ left: px(COL.x0), top: py(COL.top) - 34 }} {...fade(0.2)}>
        5 data tools · read the database
      </motion.div>
      {rows.map(({ tool, i, y0, y1 }) => (
        <motion.div key={tool.name} className="tb__card" style={{ left: px(COL.x0), top: py(y1), width: px(COL.x1) - px(COL.x0), height: py(y0) - py(y1) }} {...fade(0.3 + i * 0.25)}>
          <div className="tb__name">{tool.name}</div>
          <div className="tb__reads">
            {tool.reads} · <b className="tb__shape">{tool.shapes.map((s) => SHAPE_WORD[s]).join(' + ')}</b>
          </div>
        </motion.div>
      ))}
      <motion.div className="tb__head" style={{ left: px(MEM.x0), top: py(MEM.top) - 34 }} {...fade(1.7)}>
        3 memory tools · its own notes
      </motion.div>
      {MEMORY_TOOLS.map((tool, i) => {
        const y1 = MEM.top - i * (MEM.h + MEM.gap);
        return (
          <motion.div key={tool.name} className="tb__card tb__card--mem" style={{ left: px(MEM.x0), top: py(y1), width: px(MEM.x1) - px(MEM.x0), height: py(y1 - MEM.h) - py(y1) }} {...fade(1.8 + i * 0.25)}>
            <div className="tb__name">{tool.name}</div>
            <div className="tb__reads">{tool.does}</div>
          </motion.div>
        );
      })}
      <motion.div className="tb__sop" style={{ left: px(SOP.x0), top: py(SOP.y1), width: px(SOP.x1) - px(SOP.x0), height: py(SOP.y0) - py(SOP.y1) }} {...fade(3.0)}>
        <div className="tb__sop-kicker">the skill · INCIDENT_TRIAGE_SKILL</div>
        <div className="tb__sop-title">The SOP: which tool, in which order</div>
        <div className="tb__steps">
          {SOP_STEPS.map((s, i) => (
            <span key={s} className="tb__step">
              <i>{i + 1}</i> {s}
            </span>
          ))}
        </div>
        <div className="tb__red">{SOP_THRESHOLD}</div>
      </motion.div>
      <motion.div className="qb__line" {...fade(4.2)}>
        <Rich text={message ?? '**Tools** are what the agent can do. **The skill** is how you want it done.'} />
      </motion.div>
      {/* keeps the model's bottom clear: nothing is drawn here */}
      <span hidden>{Math.round(under.y * 100)}</span>
    </div>
  );
}
