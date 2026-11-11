import { motion } from 'motion/react';
import { Fill } from '../Fill';
import { LineIcon } from '../icons';
import { CARD, DIM, Db, INK, L2Page, MONO, TEAL, TEAL_D, TINT, TINT2, fadeUp, type L2Props } from './parts';

/**
 * 2.2c · The embedding model determines vector dimensions (owner, 3 Nov, handoff page 12). A question goes through the embedding model
 * inside Oracle and comes out as a long row of numbers, 384 in this lab. The box on the right says what controls that length; three
 * lines under it say what a dimension is and is not. The numbers are an illustration, not a measurement.
 */

/** a fingerprint: concentric arcs, the picture of "one text, one unique row of numbers" */
function Fingerprint({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={{ flex: 'none' }}>
      <path d="M12 26a20 20 0 0 1 40 0" />
      <path d="M17 52c-3-6-4-12-4-18a19 19 0 0 1 38 0c0 6 0 10-2 16" />
      <path d="M22 56c-3-5-4-10-4-16a14 14 0 0 1 28 0c0 5-1 9-2 13" />
      <path d="M27 58c-2-4-3-9-3-14a8 8 0 0 1 16 0c0 4 0 8-2 12" />
      <path d="M32 44c0 4 1 8 2 11" />
    </svg>
  );
}

const arrow = (
  <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M3 12h30M26 4l9 8-9 8" fill="none" stroke={TEAL} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const box = { borderRadius: 18, border: '2.5px solid var(--teal)', background: CARD } as const;

export function Dims(p: L2Props) {
  const strip = (icon: React.ReactNode, text: React.ReactNode, strong = false, delay = 0) => (
    <motion.div {...fadeUp(delay)} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: strong ? '16px 24px' : '12px 24px', borderRadius: 16, background: strong ? TINT : 'rgba(127,127,127,0.08)', border: strong ? '2.5px solid var(--teal)' : '2px solid transparent', fontSize: strong ? 30 : 26, color: INK, lineHeight: 1.3, fontWeight: strong ? 600 : 500 }}>
      <span style={{ flex: 'none', width: 52, display: 'flex', justifyContent: 'center' }}>{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
  return (
    <L2Page testId="l2-dims" {...p}>
      <Fill gap={16}>
        <div style={{ flex: '1 0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.95fr) minmax(0, 1fr)', columnGap: 28, alignItems: 'stretch' }}>
          {/* the path: question, embedding model, fingerprint, 384 dimensions */}
          <div data-path style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div {...fadeUp(0.2)} style={{ ...box, flex: '1 1 0', minWidth: 0, padding: '18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: INK }}>Question</div>
              <div data-question style={{ fontSize: 24, color: INK, lineHeight: 1.25 }}>“bearing corrosion on a bridge”</div>
              <svg width="120" height="64" viewBox="0 0 120 64" aria-hidden="true">
                <path d="M4 40h112M16 40V22M104 40V22M16 22c20 20 68 20 88 0M30 40V30M46 40v-6M60 40v-8M74 40v-6M90 40V30" fill="none" stroke="#5c6b78" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M30 22V8M90 22V8M30 8h60" fill="none" stroke="#5c6b78" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M4 56q14-8 28 0t28 0 28 0 28 0" fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.div>
            {arrow}
            <motion.div {...fadeUp(0.5)} style={{ ...box, background: TINT2, flex: '1 1 0', minWidth: 0, padding: '18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
              <Db size={86} />
              <div style={{ fontSize: 24, fontWeight: 700, color: INK, lineHeight: 1.2 }}>Embedding model inside Oracle</div>
            </motion.div>
            {arrow}
            <motion.div {...fadeUp(0.8)} style={{ ...box, flex: '1.5 1 0', minWidth: 0, padding: '18px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Fingerprint size={96} />
              <div data-vector style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: TEAL_D, padding: '6px 6px', borderRadius: 10, border: '2px solid var(--teal)', whiteSpace: 'nowrap', maxWidth: '100%', boxSizing: 'border-box' }}>[0.12, −0.80, 0.33, …]</div>
              <div style={{ fontSize: 16, color: DIM }}>illustrative numbers</div>
            </motion.div>
            {arrow}
            <motion.div {...fadeUp(1.1)} data-count style={{ flex: 'none', width: 138, padding: '22px 10px', borderRadius: 18, background: TEAL, color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1 }}>384</div>
              <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6, lineHeight: 1.2 }}>dimensions in this lab</div>
            </motion.div>
          </div>
          {/* what controls the length */}
          <motion.div {...fadeUp(0.6)} data-controls style={{ borderRadius: 20, background: 'rgba(27,138,156,0.08)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: INK }}>What controls the length?</div>
            <div style={{ fontSize: 23, color: INK, lineHeight: 1.35 }}>The embedding model you chose determines how many dimensions (the length of the vector) to use.</div>
            {[['all-MiniLM-L12-v2', '384'], ['all-mpnet-base-v2', '768']].map(([m, n]) => (
              <div key={m} data-model={m} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, background: CARD, border: '1.5px solid var(--line)' }}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 20, fontWeight: 700, color: INK, padding: '6px 10px', borderRadius: 10, background: 'rgba(27,138,156,0.14)', whiteSpace: 'nowrap' }}>{m}</span>
                <span style={{ flex: 'none', display: 'flex' }}>{arrow}</span>
                <span style={{ flex: 'none', width: 110, padding: '6px 6px', borderRadius: 10, background: TEAL, color: '#fff', textAlign: 'center', lineHeight: 1.1 }}>
                  <b style={{ fontSize: 28 }}>{n}</b>
                  <div style={{ fontSize: 17 }}>dimensions</div>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
        <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {strip(<LineIcon name="clipboard" size={40} color={TEAL} />, <>The dimensions are a group of numbers that describe the meaning, <b>not a word count</b>.</>, false, 1.4)}
          {strip(<LineIcon name="target" size={46} />, <><b style={{ color: TEAL_D }}>Larger models may capture richer meaning</b>, but model size and vector dimensions are different. More dimensions do not guarantee better retrieval.</>, true, 1.7)}
          {strip(<LineIcon name="inspect" size={40} color={TEAL} />, <>Use the same model for documents and queries. Compare retrieval quality, latency and storage on your own data.</>, false, 2)}
        </div>
      </Fill>
    </L2Page>
  );
}
