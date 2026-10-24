/**
 * What the presenter says on each page (first draft). Built on the Storyboard tab's one-line message for
 * each row; facts and numbers only from the storyboard and the notebooks' recorded runs.
 */
export const SCRIPT: Record<string, string> = {
  // Chapter 0 · The city
  '0.1': 'This is **Bangkok**, our city for the afternoon. Everything you will build today runs its **operations team**. This is the city. Tonight we run it.',
  '0.2': 'Every pin is a piece of infrastructure: bridges, substations, pipelines, sensors. **Twenty-eight assets**. Each one has **a record, a spec sheet, a history, and neighbours**.',
  '0.3': 'Every day the city writes about itself: **308 logs, 60 reports, 220 findings**, all flowing into the City Operations Control Center. Most of it is **free text** written by inspectors.',
  '0.4': 'Meet our inspector on Harbor Bridge, at **a hairline crack**. The question is simple: **what do we know about this bridge, and what should I do?** The answer exists. In **four shapes**, in **four places**. The inspector has !!none of them!!.',
  '0.5': 'To answer the inspector we need four things: **the asset record**, **its spec sheet**, **what it depends on**, and **similar past reports**. Four shapes of data. And **one Oracle AI Database** holds all four. Not four databases to sync.',
  '0.6': 'And this is the language model. It writes an answer **one word at a time**: that wave of light is it producing. It knows **the world**, not !!our city!!. Ours is small and runs on a CPU, so each answer takes **thirty to sixty seconds**. Today is about **what we give it**.',
  '0.7': 'Harbor Bridge is our hero, linked to the substation that powers it, the sensors that watch it and the Ops Center that coordinates it. Two things will go wrong on this bridge today. The first one, we handle with **an agent**. The second, with **memory**.',

  // Chapter 1 · RAG to Agents
  '2.1': 'The operator types the inspector’s question straight into the model. It answers fluently, and **it is a guess**: it has never heard of Harbor Bridge. A model knows **the world**. It does not know !!your city!!.',
  '2.2': 'So we turn text into numbers: **384 of them per text**, computed by ALL_MINILM_L12_V2 inside the database. The question becomes a point among 600, and its **five nearest neighbours** light up. **Similar meaning lands close together.**',
  '2.3': 'Now we take those five reports, the references the search found, and stack them with the question, under one rule: **context is data, not instructions**. The stack goes into the model, and the answer comes out the other side, built from the references. **Give the model the evidence and it stops guessing.**',
  '2.4': 'But a real operations question is three questions at once: what is this asset, what is connected to it, what happened before. One envelope cannot hold that. RAG answers **one question**. Operations ask **three at once**.',
  '2.5': 'So we give the model **eight tools**: five that read the database, one shape each, and the brief that reads **all four at once**; and three that keep its own notes. And one **skill**: the SOP, which says which tool to call in which order, and when to escalate. Remember this line: !!section loss over 25 percent!!. **Tools are what the agent can do. The skill is how you want it done.**',
  '2.6': 'One tool runs one SQL statement with three parts: the row and its JSON, the graph edges, and the reports ranked by similarity. It comes back as **one brief** and goes straight into the model. **One call, four data models, one transaction.** No ETL, no sync jobs, no stale copies.',
  '2.7': 'Now the crack report arrives. The agent recalls, pulls the incident brief, writes down what it learned, and answers. **The agent chooses its tools. The procedure keeps it honest.**',
  '2.8': 'At the end it leaves a sticky note: **one row in the database**, keyed to Harbor Bridge, embedded on write. A memory, but **a thin one**.',
  '2.9': 'Three questions, three patterns. **RAG**: what does the record say. **Workflow**: triage predictably. **Agent**: reason and tell me what to do. And **the rust** is still waiting on the bridge. At three o’clock we give it **a real memory**.',

  // Chapter 2 · Agent Memory
  '3.0': 'We are back at Harbor Bridge, because the problem has not gone away: the rust is still there. Two inspectors will look at it on different days. Evelyn Mercer comes first, Jordan Vance comes next. What should Vance know before he starts?',
  '3.1a': 'Day 1. Evelyn Mercer is at the rust. She tells the copilot what she found, what she advises and what needs follow-up. The copilot says: noted.',
  '3.1b': 'Then the chat closes. Mercer goes home, and everything she told the copilot goes with the session. Nothing carried over.',
  '3.1c': 'Day 2. Jordan Vance comes to the same rust and asks what happened here. The copilot has nothing. Same questions again, the earlier advice is missing, and the follow-up is out of view. The records may still exist. The next visit needs a way to find and use the relevant history.',
  '3.2a': 'An agent needs more than one kind of memory. Short-term memory is what it holds right now: the context window and the session. When the chat closes, it is gone. That is what happened to Mercer’s notes.',
  '3.2b': 'Long-term memory is what the agent keeps between visits. This is what Vance needed.',
  '3.2c': 'Long-term memory comes in three kinds. Procedural is how to do the job. Episodic is what happened. Semantic is what is true.',
  '3.2d': 'Each kind lives in its own layer. Procedures become workflows and tools. Episodes become tool logs, conversations and summaries. Facts become a knowledge base, entities and personas.',
  '3.2e': 'Last, shared memory. What one inspector learns, the next one can use. That is the handoff Vance was missing.',
  '3.3a': 'The context window is all the model sees. Think of it as a glass we fill on every turn: the system prompt, the instructions, the tool schemas, what we retrieved, the conversation so far and the user’s message. It is finite, it is the model’s only input, and nothing goes in by itself.',
  '3.3b': 'Filling it is a curation problem. The window fills up. The wrong data buries Mercer’s finding. A summary drops the 25 percent. Or the finding arrives at the start, not when Vance asks.',
  '3.4': 'Three disciplines decide what goes in the glass. Memory engineering: what the agent keeps. Context engineering: what the model gets to see for this question. Harness engineering: reading and writing memory on every turn, reliably. One job: the right tokens in, the wrong ones out.',
  '3.5a': 'Here is the loop from this afternoon, with memory wired in. Read the context card at the start of the turn, reason and act, write back what happened, and summarize when the thread gets long. Then the loop runs again.',
  '3.5b': 'You do not have to change your harness. Your agent loop calls one memory manager, and the memory lives in one database: vectors, SQL, JSON and graph together. One store, one memory manager, any harness.',
  '3.6': 'The copilot needs one connection, to the database. The embedding model from this afternoon is still there. Same 384 numbers as this afternoon, computed inside the database, no API key.',
  '3.7': 'When Mercer writes a paragraph, the whole message is filed in CITY_MESSAGE, and an extractor peels out typed cards into CITY_MEMORY: facts, preferences, guidelines, memories. The agent does not store what you said. It stores what it learned.',
  '3.8': 'Searching memory needs the right key. With the wrong user id the search comes back empty; with the right one the cards light up. Records inherit the scope of the thread that wrote them.',
  '3.9': 'Next to memory sits the system of record: official inspection findings with category, severity, grade, recommendation and an embedding. Mercer logs one deliberately. Memory is what the agent learns. Findings are what the city records.',
  '3.10': 'To find the right findings we search by meaning, then put up walls: only Harbor Bridge, only corrosion. Vector similarity and relational filters in one SQL statement.',
  '3.11': 'Three keys decide who sees what: user, agent and thread. Vance cannot open Mercer’s private door, but he finds her guideline in the shared hall. This is a SQL WHERE clause, not a Python filter.',
  '3.12': 'Here is one copilot turn, step by step, and the context card it builds: a summary, the topics, the relevant information and the recent messages. This is the prompt the model actually receives.',
  '3.13': 'Day 1. Mercer at the rust: about 25 percent section loss, rust bleed. She logs the finding: corrosion, medium, grade C, repair within 60 days, and her guideline lands on the shared shelf for Harbor Bridge. This is what the next inspector inherits.',
  '3.14': 'Day 2. Vance stands at the same pier. He has never met Mercer. Two beams reach back: her logged finding and the pooled guideline, while his own thread stays private. No human handoff. The finding and the distilled memory carried it.',
  '3.15': 'Same question, asked twice. Without memory: a generic answer. With memory: the rust, about 25 percent, grade C, 60 days, Mercer, Day 1. Same model. Same question. Only the memory differs.',
  '3.16': 'And here both labs meet. This afternoon’s rule says act when section loss passes 25 percent. Today’s finding says about 25 percent. This afternoon the agent had the rule. Now it has the history. Together they make the call.',
  '3.17': 'Three things to take home: memory is the foundation, scope is governance, and it all lives in one converged database. The rule from this afternoon, the history from today. The same database held both. Now scan the code for the quiz.',
};
