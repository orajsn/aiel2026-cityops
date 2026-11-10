import { motion } from 'motion/react';
import { EASE, WidePanel } from './WidePanel';
import { Fill } from './lab1/parts';
import { LineIcon, type IconName } from './icons';
import { Rich } from '../Rich';
import { useBuild } from './Lab3Opening';
import adbLogo from '../../assets/oracle/autonomous-ai-database.png';

/**
 * 3.15d · Why Oracle AI Database (owner, 10 Nov: after "What you built", turn back to why the memory lives in the database). Each reason is
 * something the notebook showed: one connection (Part 1), the embedder inside the database (Part 2), meaning and filters in one SQL
 * statement (Part 4), scope as a WHERE clause (Part 5), and the Autonomous housekeeping. Built up one reason per Next (PAGE_STEPS).
 */

export interface WhyOracleProps {
  kicker: string;
  message: string;
  notebook?: string;
}

const REASONS: { icon: IconName; head: string; text: string; part?: string }[] = [
  { icon: 'converge', head: 'One place, **one connection**', text: 'Memory, findings, assets and vectors sit in the same database. Nothing to keep in sync.', part: 'Part 1' },
  { icon: 'nodes', head: 'The embedder runs **inside the database**', text: 'The ONNX model is preloaded: a report never leaves the database to become numbers.', part: 'Part 2' },
  { icon: 'funnel', head: 'Meaning and filters in **one SQL statement**', text: 'The nearest in meaning, inside the walls of this asset and this category: VECTOR_DISTANCE and a WHERE clause.', part: 'Part 4' },
  { icon: 'lock', head: 'The **database** decides who sees what', text: 'Scope is a SQL WHERE clause on user_id, agent_id and thread_id, not a filter in Python.', part: 'Part 5' },
  { icon: 'gear', head: 'Autonomous does the **housekeeping**', text: 'Maintenance, copies and locking are handled for you by Autonomous AI Database.' },
];

export function WhyOracle({ kicker, message, notebook }: WhyOracleProps) {
  const L = useBuild();
  return (
    <WidePanel kicker={kicker} message={message} notebook={notebook} testId="why-oracle" kickerColor="var(--teal)">
      <Fill max={1.15}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 8fr)', gap: 36, alignItems: 'center', marginTop: 6 }}>
          <div data-oracle-badge style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center' }}>
            <div style={{ width: 210, height: 210, borderRadius: '50%', background: '#fff', border: '6px solid var(--teal)', boxShadow: '0 8px 24px rgba(11,14,20,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img data-logo="adb" src={adbLogo} alt="Oracle Autonomous AI Database" style={{ width: 170, height: 170, objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>Oracle Autonomous<br />AI Database 26ai</div>
            <div style={{ fontSize: 22, color: 'var(--ink-dim)', lineHeight: 1.35 }}>where the agent’s memory lives</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {REASONS.map((r, i) => (
              <motion.div key={r.head} data-reason={i + 1} data-shown={L >= i} initial={false} animate={{ opacity: L >= i ? 1 : 0, y: L >= i ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 20px', borderRadius: 18, background: 'var(--panel-strong)', border: '2.5px solid var(--teal)' }}>
                <span style={{ flex: 'none', width: 66, height: 66, borderRadius: '50%', background: 'rgba(27,138,156,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LineIcon name={r.icon} size={42} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.15 }}><Rich text={r.head} /></div>
                  <div style={{ fontSize: 20, color: 'var(--ink-dim)', lineHeight: 1.3, marginTop: 4 }}>{r.text}</div>
                </div>
                {r.part && <span style={{ flex: 'none', padding: '4px 14px', borderRadius: 14, background: '#1f2a33', color: '#fff', fontSize: 17, fontWeight: 700 }}>{r.part}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </Fill>
    </WidePanel>
  );
}
