import { motion } from 'motion/react';

const TEXT: Record<string, { title: string; body: string; code?: string }> = {
  none: { title: 'One database, four shapes', body: 'One Oracle AI Database for the whole city. Not four databases to sync. The same engine does all four.' },
  tables: { title: 'Tables', body: 'Rows and columns: every asset, every log, every finding has a record.', code: 'SELECT ... FROM CITY_ASSET' },
  json: { title: 'JSON', body: 'The spec sheet travels with the asset as a document, read with dot notation.', code: 'a.specs.span_length_m' },
  graph: { title: 'Graph', body: 'Who powers, monitors and coordinates what. Drawn on the map below.', code: 'GRAPH_TABLE(citypulse_graph ...)' },
  vectors: { title: 'Vectors', body: 'Free text becomes a point. Similar narratives land close together.', code: 'VECTOR_EMBEDDING(ALL_MINILM_L12_V2 ...)' },
};

export function CoreCaption({ face = 'none' }: { face?: string }) {
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
