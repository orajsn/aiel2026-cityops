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
  '2.4': 'But a real operations question is **three questions at once**: what is this asset, what is connected to it, what happened before. One folder of references answers **one question**. The real one needs **several retrievals**, **a graph lookup** and **a judgment call**: that is a workflow, and then an agent.',
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
  '3.6': 'Part 1 of the notebook. The copilot needs one connection: the database. Everything it uses is already in there: its memory, the official findings, and the model from this afternoon that turns text into a point. Nothing else to set up: no outside service, no API key.',
  '3.7': 'When an inspector reports, two things happen. The whole report is filed word for word in CITY_MESSAGE. And the extractor pulls out what is worth keeping as small memory cards in CITY_MEMORY: a fact, a guideline. One message gives three memories. The agent does not store what you said. It stores what it learned.',
  '3.8a': 'Now search those memories. With no user id, the search comes back empty: zero memories.',
  '3.8b': 'Give it the right key, user_id inspector_demo, and the memories light up. Records inherit the scope of the thread that wrote them.',
  '3.9': 'Next to memory sits the system of record: fifteen official findings, each with a category, a severity, a grade, a recommendation and an embedding. Mercer logs one on purpose: corrosion, medium, grade C, repair within 60 days. Memory is what the agent learns. Findings are what the city records.',
  '3.10': 'To find the right findings we search by meaning, and the five nearest light up. Then two walls: only Harbor Bridge, only corrosion. Broad five, asset five, category four. Vector similarity and relational filters in one SQL statement.',
  '3.11': 'Three keys decide who sees what: the user, the agent and the thread. Mercer keeps a private note behind her own door: swap shifts Tuesday. Her guideline for Harbor Bridge goes in the shared hall. When Vance searches, he bounces off her door and finds the guideline in the hall: none of her private memories, one shared. This is a SQL WHERE clause, not a Python filter.',
  '3.12a': 'Here is one copilot turn, step by step: open Vance’s own thread, read the bridge’s record, build the context card, search the shared memory, find similar findings, ask the language model, save both messages, and extract new memories.',
  '3.12b': 'And this is the context card it builds: a summary, the topics, the relevant information and the recent messages. This is the prompt the model actually receives.',
  '3.13': 'Day 1. Mercer is at the rust: about 25 percent section loss, rust bleed, over 1.5 metres. She logs the official finding: corrosion, medium, grade C, repair within 60 days. And her guideline goes to shared memory for Harbor Bridge. This is what the next inspector inherits.',
  '3.14': 'Day 2. Vance comes to the same rust and asks the same question as before: what happened at this pier? This time the copilot knows. Mercer logged corrosion here on Day 1: about 25 percent, grade C, repair within 60 days. It found her finding, and her guideline in shared memory. No human handoff. The finding and the memory carried it.',
  '3.15': 'Same question, asked twice. Without memory: no earlier information. With memory: Mercer’s finding, grade C, 60 days. It knows it is the same bridge, cites the real finding, gives a specific action, and never sees anyone’s private chats. Same model. Same question. Only the memory differs.',
  '3.15b': 'Remember the four failures from the glass? The summary keeps the window from filling up. Only Mercer’s finding comes in. The 25 percent is kept as a fact of its own. And it is fetched again when Vance asks. All four, solved.',
  '3.16': 'And here both labs meet. This afternoon’s rule says: section loss over 25 percent means an immediate structural review. Today’s history says Mercer measured about 25 percent. This afternoon the agent had the rule. Now it has the history. Together they make the call.',
  '3.17': 'If you only remember three things: memory is the foundation, not a feature. The context window is a curation problem. And one converged store beats four services. Now scan the code for the quiz: five minutes, 80 percent to pass, and a badge.',
};
