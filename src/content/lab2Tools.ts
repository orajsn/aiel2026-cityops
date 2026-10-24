/**
 * Lab 2's agent tools and skill, as the notebook defines them (rag_to_agents_lab.ipynb, Sections 3 to 5):
 * five data tools, three memory tools, one SOP. Names are exactly the notebook's.
 */
export type DataKind = 'table' | 'json' | 'graph' | 'vectors';

export const DATA_TOOLS: { name: string; reads: string; shapes: DataKind[] }[] = [
  { name: 'get_asset_overview', reads: 'the asset record and its specs', shapes: ['table', 'json'] },
  { name: 'get_connected_assets', reads: 'what it is connected to', shapes: ['graph'] },
  { name: 'search_incidents_semantic', reads: 'similar past reports', shapes: ['vectors'] },
  { name: 'get_recent_incidents', reads: 'the latest reports, by date', shapes: ['table'] },
  { name: 'get_asset_incident_brief', reads: 'all four, in one query', shapes: ['table', 'json', 'graph', 'vectors'] },
];

export const MEMORY_TOOLS: { name: string; does: string }[] = [
  { name: 'recall', does: 'notes on this asset' },
  { name: 'recall_similar', does: 'similar notes, any asset' },
  { name: 'remember', does: 'write a note' },
];

/** the skill's steps, in the SOP's order */
export const SOP_STEPS = ['recall', 'get the brief', 'more only if needed', 'remember', 'answer'];
/** the escalation line the presenter asks people to remember */
export const SOP_THRESHOLD = 'section loss > 25% → immediate structural review';

/** the unified query's three parts and what each returns (Section 4.2), plus the raw specifications it carries along */
export const UNIFIED_PARTS: { kind: DataKind; key: string; what: string }[] = [
  { kind: 'table', key: 'asset', what: 'the row' },
  { kind: 'json', key: 'specifications', what: 'the JSON' },
  { kind: 'graph', key: 'graph_context', what: 'graph edges' },
  { kind: 'vectors', key: 'ranked_evidence', what: 'ranked reports' },
];
