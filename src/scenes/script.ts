/**
 * What the presenter says on each page (first draft). Built on the Storyboard tab's one-line message for
 * each row; facts and numbers only from the storyboard and the notebooks' recorded runs.
 */
export const SCRIPT: Record<string, string> = {
  // Chapter 0 · The city
  '0.1': 'This is **Bangkok**, our city for the afternoon. Everything you will build today runs its **operations team**. This is the city. Tonight we run it.',
  '0.2': 'Every pin is a piece of infrastructure: bridges, substations, pipelines, sensors. **Twenty-eight assets**. Each one has **a record, a spec sheet, a history, and neighbours**.',
  '0.3': 'Every day the city writes about itself: **308 logs, 60 reports, 220 findings**, all flowing into the City Operations Control Center. Most of it is **free text** written by inspectors.',
  '0.4': 'Meet our inspector on Pier 3 of Harbor Bridge. The question is simple: **what do we know about this bridge, and what should I do?** The answer exists. In **four shapes**, in **four places**. The inspector has !!none of them!!.',
  '0.5': 'To answer the inspector we need four things: **the asset record**, **its spec sheet**, **what it depends on**, and **similar past reports**. Four shapes of data. And **one Oracle AI Database** holds all four. Not four databases to sync.',
  '0.6': 'And this is the language model. It writes an answer **one word at a time**: that wave of light is it producing. It knows **the world**, not !!our city!!. Ours is small and runs on a CPU, so each answer takes **thirty to sixty seconds**. Today is about **what we give it**.',
  '0.7': 'Harbor Bridge is our hero, linked to the substation that powers it, the sensors that watch it and the Ops Center that coordinates it. Two things will go wrong on this bridge today. The first one, we handle with **an agent**. The second, with **memory**.',

  // Chapter 1 · RAG to Agents
  '1.1': 'The operator types the inspector’s question straight into the model. It answers fluently, and **it is a guess**: it has never heard of Harbor Bridge. A model knows **the world**. It does not know !!your city!!.',
  '1.2': 'So we turn text into numbers: **384 of them per text**, computed by ALL_MINILM_L12_V2 inside the database. The question becomes a point among 600, and its **five nearest neighbours** light up. **Similar meaning lands close together.**',
  '1.3': 'Now we put those five documents in an envelope with the question, sealed with one rule: **context is data, not instructions**. The model answers from the envelope only. **Give the model the evidence and it stops guessing.**',
  '1.4': 'But a real operations question is three questions at once: what is this asset, what is connected to it, what happened before. One envelope cannot hold that. RAG answers **one question**. Operations ask **three at once**.',
  '1.5': 'So we give the model tools, each wired to one place in the database, and a procedure: the triage SOP, with its thresholds. Remember this line: !!section loss over 25 percent!!. The model only sees each card’s name and description. **Docstrings are prompt engineering.**',
  '1.6': 'One tool runs one query that returns **all four shapes together**: the row, the JSON, the graph edges and the ranked evidence, in one brief. **No ETL, no sync, one transaction.**',
  '1.7': 'Now the Pier 3 report arrives. The agent recalls, pulls the incident brief, writes down what it learned, and answers. **The agent chooses its tools. The procedure keeps it honest.**',
  '1.8': 'At the end it leaves a sticky note: **one row in the database**, keyed to Harbor Bridge, embedded on write. A memory, but **a thin one**.',
  '1.9': 'Three questions, three patterns. **RAG**: what does the record say. **Workflow**: triage predictably. **Agent**: reason and tell me what to do. And the second marker is still waiting on Pier 2. At three o’clock we give it **a real memory**.',

  // Chapter 2 · Agent Memory
  '2.0': 'Welcome back to the same city. Same city, same database, same bridge. Now, memory.',
  '2.1a': 'Day 1. Evelyn Mercer is at Pier 2. She tells the copilot what she found, what she advises and what needs follow-up. The copilot says: noted.',
  '2.1b': 'Then the chat closes. Mercer goes home, and everything she told the copilot goes with the session. Nothing carried over.',
  '2.1c': 'Day 2. Jordan Vance comes to the same rust and asks what happened here. The copilot has nothing. Same questions again, the earlier advice is missing, and the follow-up is out of view. The records may still exist. The next visit needs a way to find and use the relevant history.',
  '2.2': 'An agent needs several kinds of memory. Short-term on the desk: the context window and the session. Long-term on the shelves: procedures, episodes, facts. And a shared shelf everyone can read. Several kinds of memory, doing different jobs, in one store.',
  '2.3': 'The context window is a glass. Pour in too much and it overflows; pour in noise and the small detail gets lost; the right fact can still arrive at the wrong turn. The context window is the model’s whole world, and it is a curation problem.',
  '2.4': 'Three dials decide what goes in the glass: memory engineering, context engineering and harness engineering. Three disciplines, one job: the right tokens in, the wrong ones out.',
  '2.5': 'Here is the loop from this afternoon, with one change: a read from memory at the start of every turn, and a write at the end. One store, one memory manager, any harness.',
  '2.6': 'The copilot needs one connection, to the database. The embedding model from this afternoon is still there. Same 384 numbers as this afternoon, computed inside the database, no API key.',
  '2.7': 'When Mercer writes a paragraph, the whole message is filed in CITY_MESSAGE, and an extractor peels out typed cards into CITY_MEMORY: facts, preferences, guidelines, memories. The agent does not store what you said. It stores what it learned.',
  '2.8': 'Searching memory needs the right key. With the wrong user id the search comes back empty; with the right one the cards light up. Records inherit the scope of the thread that wrote them.',
  '2.9': 'Next to memory sits the system of record: official inspection findings with category, severity, grade, recommendation and an embedding. Mercer logs one deliberately. Memory is what the agent learns. Findings are what the city records.',
  '2.10': 'To find the right findings we search by meaning, then put up walls: only Harbor Bridge, only corrosion. Vector similarity and relational filters in one SQL statement.',
  '2.11': 'Three keys decide who sees what: user, agent and thread. Vance cannot open Mercer’s private door, but he finds her guideline in the shared hall. This is a SQL WHERE clause, not a Python filter.',
  '2.12': 'Here is one copilot turn, step by step, and the context card it builds: a summary, the topics, the relevant information and the recent messages. This is the prompt the model actually receives.',
  '2.13': 'Day 1. Mercer at Pier 2: about 25 percent section loss, rust bleed. She logs the finding: corrosion, medium, grade C, repair within 60 days, and her guideline lands on the shared shelf for Harbor Bridge. This is what the next inspector inherits.',
  '2.14': 'Day 2. Vance stands at the same pier. He has never met Mercer. Two beams reach back: her logged finding and the pooled guideline, while his own thread stays private. No human handoff. The finding and the distilled memory carried it.',
  '2.15': 'Same question, asked twice. Without memory: a generic answer. With memory: Pier 2, about 25 percent, grade C, 60 days, Mercer, Day 1. Same model. Same question. Only the memory differs.',
  '2.16': 'And here both labs meet. This afternoon’s rule says act when section loss passes 25 percent. Today’s finding says about 25 percent. This afternoon the agent had the rule. Now it has the history. Together they make the call.',
  '2.17': 'Three things to take home: memory is the foundation, scope is governance, and it all lives in one converged database. The rule from this afternoon, the history from today. The same database held both. Now scan the code for the quiz.',
};
