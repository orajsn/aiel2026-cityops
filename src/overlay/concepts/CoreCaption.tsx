import { motion } from 'motion/react';

const TEXT: Record<string, { title: string; body: string; code?: string }> = {
  none: { title: 'One database, four shapes', body: 'One Oracle AI Database for the whole city. Not four databases to sync. The same engine does all four.' },
  tables: { title: 'Tables', body: 'Rows and columns: every asset, every log, every finding has a record.', code: 'SELECT ... FROM CITY_ASSET' },
  json: { title: 'JSON', body: 'The spec sheet travels with the asset as a document, read with dot notation.', code: 'a.specs.span_length_m' },
  graph: { title: 'Graph', body: 'Who powers, monitors and coordinates what. Drawn on the map below.', code: 'GRAPH_TABLE(citypulse_graph ...)' },
  vectors: { title: 'Vectors', body: 'Free text becomes a point. Similar narratives land close together.', code: 'VECTOR_EMBEDDING(ALL_MINILM_L12_V2 ...)' },
};

/** 0.5: what the inspector's answer needs, ticked off as each piece docks; then the one database */
const NEEDS: [string, string][] = [
  ['the asset record', 'table'],
  ['its spec sheet', 'JSON'],
  ['what it depends on', 'graph'],
  ['similar past reports', 'vectors'],
];

function Needs() {
  return (
    <div className="caption caption--needs">
      <motion.div className="caption__title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        What the answer needs
      </motion.div>
      <ul className="needs">
        {NEEDS.map(([what, shape], i) => (
          <motion.li key={what} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 + i * 0.45, duration: 0.4 }}>
            <motion.span className="needs__tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.9 + i * 0.45, type: 'spring', stiffness: 400, damping: 18 }}>
              ✓
            </motion.span>
            <span className="needs__what">{what}</span>
            <span className="needs__shape mono">{shape}</span>
          </motion.li>
        ))}
      </ul>
      <motion.div className="needs__all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8, duration: 0.6 }}>
        All four, in one Oracle AI Database.
      </motion.div>
    </div>
  );
}

export function CoreCaption({ face = 'none' }: { face?: string }) {
  if (face === 'none') return <Needs />;
  const t = TEXT[face] ?? TEXT.none;
  return (
    <div className="caption">
      <motion.div className="caption__title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {t.title}
      </motion.div>
      <motion.div className="caption__body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}>
        {t.body}
      </motion.div>
      {t.code && (
        <motion.div className="caption__code mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
          {t.code}
        </motion.div>
      )}
      {face === 'none' && (
        <motion.div className="caption__faces" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          Tables · JSON · Graph · Vectors
        </motion.div>
      )}
    </div>
  );
}
