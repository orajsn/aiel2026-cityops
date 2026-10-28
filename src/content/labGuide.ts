/**
 * The lab guide's notes for the Jupyter drawer (owner, 28 Oct, from the Thai block-by-block guide to
 * rag_to_agents_lab.ipynb, in English for the audience). On a page with a guide the drawer steps through the
 * notebook's blocks, landing on each section's heading with a short note (what it does, why, what to look for),
 * and through a long cell's parts, highlighting the lines each part is about. Pages without a guide step
 * through their cells to run, as before.
 *
 * A part names the line it starts on (`from`); it runs up to the next part's start, or the cell's end.
 * tests/overlay/LabGuide.test.tsx checks every block sits under its heading and every part starts on a real line.
 */
export interface GuidePart {
  /** "A · Memory": the letter and a few words */
  label: string;
  note: string;
  /** the line the part starts on */
  from: RegExp;
}

export interface GuideBlock {
  /** the notebook's code cell (its heading is the markdown cell just before it) */
  cell: number;
  /** "5.4 Memory, tools and the graph": the section number, then a short name */
  title: string;
  note: string;
  /** what the room should see when it runs */
  lookFor?: string;
  parts?: GuidePart[];
}

export const LAB_GUIDE: Record<string, GuideBlock[]> = {
  // page 2.7 · The agent loop: Section 5.3 to 5.7 (5.8 is page 2.8)
  '2.7': [
    {
      cell: 71,
      title: '5.3 Reset',
      note: 'Memory is really stored, so an earlier run can leave notes behind. This clears the lab’s conversation state and memory notes, so the agent starts clean. The city data is not touched.',
      lookFor: 'Done!',
    },
    {
      cell: 73,
      title: '5.4 Memory, tools and the graph',
      note: 'The longest cell: the agent’s memory, its tools and its graph, in eight parts.',
      parts: [
        {
          label: 'A · Two kinds of memory',
          note: 'Both live in Oracle. OracleSaver keeps each conversation’s state; OracleStore keeps notes the agent can search later, across conversations. OracleEmbeddings turns notes and queries into vectors inside the database.',
          from: /^# --- Long-term memory: OracleStore/,
        },
        {
          label: 'B · Tidy the inputs',
          note: 'The model may send a name with extra words after it, or a number written as text. canonical_asset_name and _normalize_tool_args tidy these before a tool runs.',
          from: /^def canonical_asset_name/,
        },
        {
          label: 'C · Memory tools',
          note: 'remember writes a note. recall reads this asset’s notes. recall_similar finds similar notes, on any asset.',
          from: /^def remember\(/,
        },
        {
          label: 'D · The allowed tools',
          note: 'AGENT_TOOLS is the toolbox: the model can only ask for tools on this list. They read data and write memory; none of them can close a bridge or order a repair.',
          from: /^AGENT_TOOLS = \[/,
        },
        {
          label: 'E · What the agent carries',
          note: 'AgentState: the messages so far, how many times the agent has been reminded to remember, and whether Python had to save the note itself.',
          from: /^# --- Agent state/,
        },
        {
          label: 'F · Think, then act',
          note: 'model_node decides: answer, or ask for a tool. tool_node_sequential runs the tools for real, one at a time, because they share one database cursor.',
          from: /^# --- Nodes/,
        },
        {
          label: 'G · The safety net',
          note: 'If the model answers without calling remember, enforce_remember_node reminds it, up to two times. After that, Python writes the note itself.',
          from: /^def enforce_remember_node/,
        },
        {
          label: 'H · The graph',
          note: 'StateGraph wires it together: model → tools → back to model. Ready to answer? It ends once remember was called; otherwise the safety net runs first. Compiled with both memories.',
          from: /^# --- Edges/,
        },
      ],
    },
    {
      cell: 75,
      title: '5.5 The system prompt',
      note: 'AGENT_SYSTEM puts the procedure, the safety rules and the answer format into one prompt. The answer comes back in three parts: recommendation, rationale, next_steps.',
    },
    {
      cell: 77,
      title: '5.6 Run the agent',
      note: 'run_agent sends the crack report in and keeps a trace of every tool call. render_agent_answer shows the answer; validate_agent_run checks its shape and which tools appear in the trace.',
      lookFor: 'First turn complete.',
    },
    {
      cell: 79,
      title: '5.7 The answer and the trace',
      note: 'Read the answer and the trace together: which tools the agent really used, and what came back. The quality checks are a first pass, not proof the advice is right.',
      lookFor: 'Agent run complete!',
    },
  ],
};

/** one step of a guided drawer: a block, or one of its parts */
export interface GuideStep {
  block: GuideBlock;
  part?: GuidePart;
}

/** the steps of a page's guide in order: each block, then its parts; empty when the page has no guide */
export function guideSteps(stopId: string): GuideStep[] {
  return (LAB_GUIDE[stopId] ?? []).flatMap((block) => [{ block }, ...(block.parts ?? []).map((part) => ({ block, part }))]);
}

/** the lines a part covers (0-based, end exclusive): from its own start to the next part's, or the cell's end */
export function partLines(lines: string[], part: GuidePart, parts: GuidePart[] = []): { start: number; end: number } {
  const startOf = (p: GuidePart) => lines.findIndex((l) => p.from.test(l));
  const start = startOf(part);
  const later = parts
    .map(startOf)
    .filter((s) => s > start)
    .sort((a, b) => a - b);
  return { start, end: later[0] ?? lines.length };
}
