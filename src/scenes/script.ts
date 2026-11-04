/**
 * What the presenter says on each page (first draft). Built on the Storyboard tab's one-line message for
 * each row; facts and numbers only from the storyboard and the notebooks' recorded runs.
 */
export const SCRIPT: Record<string, string> = {
  // Chapter 0 · The city
  '0.0': 'Good afternoon. Below us is **Bangkok**, from above. Let us fly down.',
  '0.1': 'This is **Bangkok**, our city for the afternoon. Everything you will build today runs its **operations team**. This is the city. Today, we run it.',
  '0.2': 'Every pin is a piece of infrastructure: bridges, substations, pipelines, sensors. **Twenty-eight assets**. Each one has **a record, a spec sheet, a history, and neighbours**. And one of them is our hero for the afternoon: **Harbor Bridge**.',
  // 0.7 · one bridge, three labs: one panel, one card opening per click
  '0.7': 'Harbor Bridge is our hero. **Three times** today we come back to it, and each time it brings **a new problem**.',
  '0.7a': 'Lab 1, **the repair plan**: the data is in **four places**. We build **one assistant**, pick **the right model** for each question, and add **guardrails**.',
  '0.7b': 'Lab 2, **the crack**: a model alone **guesses**. We build **an agent** that decides what to look up, looks it up, and says what to do.',
  '0.7c': 'Lab 3, **the rust**: the agent **forgets** between days. We give it **memory**, so the next inspector knows what the last one found.',

  // Lab 2 · RAG to Agents (owner, 29 Oct): the Harbor Bridge deck's captions, chapter by chapter
  // Story · one crack
  '0.4': 'Lab 2 starts with one crack. Mercer, our senior inspector, reports it on Harbor Bridge: a hairline crack, **0.12 millimetres wide and 85 long**, in the weld seam between girder and bearing plate. No visible movement, no lane closure. Small numbers, real question.',
  '0.4a': 'And Vance asks the question this whole lab is about: **what should operations do, and what proves it?** Before anyone recommends anything, five kinds of evidence need to land in one brief: the asset record, its specifications, what it is connected to, its history, and what we remembered last time.',
  '0.4b': 'Here is the route for today: eleven stops. Every chapter starts with **the idea**, then opens the matching **notebook** section, so you see the picture first and the code second.',
  // Why · AI needs your data
  '2.0': 'Why does AI need your data? A smart engineer who has never seen this bridge can still give bad advice. The AI apps that work stand on **the right data**, then automation, then trust. Take one layer away and it breaks: no data, generic advice; no automation, people stay the bottleneck; no trust, nobody lets it act on a real asset.',
  '2.0a': 'There are four levels of AI applications. A chatbot gives one reply. RAG looks something up, and the application picks the next step. A workflow triages predictably, and the code picks. An agent reasons it through, and **the model picks**. Each rung gives the system more freedom, and asks more of us in control and observation.',
  '2.1': 'The language model is like **a well-read engineer**. It has read the textbooks, up to its training date. But it has never seen our bridge. Ask it what to do about this crack, and it can only speak in general.',
  '2.1a': 'It does not even know what was inspected this morning. Same model, same question: on the left it answers from memory and gives generic advice. On the right it **looks up today’s record first**, and the answer is fresh, specific and traceable. Retraining is slower, costlier and still not fresh.',
  // Setup · the workbench
  '0.5': 'Lab section zero: the workbench. Three things on it: **Oracle AI Database** with the city’s data and the embedding model inside it; the language model, a small one that runs on a CPU; and the Jupyter notebook, where all the settings live in one cell. The records room, the engineer on call, and one clipboard of settings.',
  '0.5a': 'Before any AI runs, the notebook checks the site: **25 checks, 25 OK**. Tables, views, the property graph, the demo assets, the embedding model and the vector index are all there.',
  '0.3': 'Then we look at what the agent will be **allowed to see**: Harbor Bridge’s row and its specifications, its most recent evidence, and the graph edges into it. Look at the data first, before any model touches it. Later tool calls become easy to audit.',
  '0.3a': 'The notebook has three known-good cases: the bridge, a substation and a pipeline. Today we run **the bridge**. The same code runs the other two by changing one setting.',
  '0.6': 'Last check: is the language model awake? We ask it to reply with exactly one word, **READY**. If it does, the rest of the notebook can use it.',
  // RAG · the filing cabinet
  '2.2': 'RAG means **look it up before answering**. The question becomes numbers, a similarity search finds the closest records, the top few go into the prompt, and the answer is grounded in them. Like an engineer who pulls the right inspection report from the filing cabinet, then answers from it.',
  '2.2a': 'Why not hand over every file? It is slow, costly, and the answer drowns in noise. The top five labelled folders are fast, cheap and grounded. You do not need all the data. You need **the right data at the right moment**.',
  '2.2b': 'So retrieval quality is everything: the right data, the right moment, the right amount. When you get a bad answer, **check retrieval first**. Most bad RAG answers start with the wrong folder, not the wrong model.',
  '2.2c': 'In the notebook, section 1.2: the question, bearing corrosion on a bridge, goes into the database, the embedding model **inside Oracle** turns it into a vector, and out come **384 numbers**. No outside service.',
  '2.2d': 'Section 1.3: the retriever measures distance in meaning, ranks closest first and keeps only five. Here there is no bridge filter, so **the two closest folders belong to other bridges**. That is why the filter matters.',
  '2.3': 'Section 1.6, the rule: answer **only from the facts in the context**. If the answer is missing, say I don’t know instead of guessing. And the folder text is data, never an order: a small defense against prompt injection.',
  '2.3a': 'Sections 1.7 and 1.8, the plumbing: fetch the folders, write the brief, make one call to the model. LangChain writes the same thing as **one pipe**. It saves two or three lines; grounding is still your job.',
  '2.3b': 'Section 1.9: a grounded answer you can check. Each claim in the answer **points back to a retrieved row**. If one did not, you would see it.',
  '2.4': 'But a question is not a job. A lookup is simple: one retrieval, one call to the model, done.',
  '2.4a': 'A real question, what is the status of this bridge, **hides three jobs**: is it recurring, which means many lookups compared over time; cross-check the work orders, a second lookup; and should we escalate, which is a judgment, not a search.',
  '2.4b': 'Something has to coordinate it all: **a checklist, or a chief inspector**. RAG can contribute pieces. A workflow or an agent coordinates them.',
  // Workflow · the fixed checklist
  '2.4c': 'Who chooses the next step? In RAG, the application. In a workflow, **the code**: the path is fixed in advance, the model only works inside the steps, and every run can be replayed. In an agent, the model: flexible, and less predictable.',
  '2.4d': 'This is the anatomy of a workflow. The success path receives the task, plans, runs its tools, evaluates and formats the result. A real system also designs its failure path: human review, replan, or abort. **Every exit is planned**, and the code makes the routing decisions.',
  '2.4e': 'The lab’s workflow is a four-station conveyor belt. The crack report rides it: the classifier says warning, the retriever finds five similar incidents, the drafter writes a plan, the formatter makes the report. Drafting took about **25 of the 32 seconds**, because the model writes one token at a time.',
  '2.4f': 'Station one rates the severity: only three ratings exist, plus one short reason, and the model must answer in JSON. For our crack: **warning**. Pydantic checks the shape of the answer, not whether the rating is right.',
  '2.4g': 'Station three drafts the plan: a fixed form with a recommendation, a rationale and next steps, filled **only from the context**. For our crack: follow-up testing within 14 days.',
  '2.4h': 'And the order lives in the code: rate, fetch, draft, format. Same four calls, same order, every run. **Deterministic means the path, not the words.**',
  // Agent · the chief inspector
  '2.4i': 'But what if the problem keeps changing? A fixed checklist cannot grow new branches by itself. A new failure has no step. So meet **the chief inspector**: the AI agent, which decides the next step itself.',
  '2.4j': 'The chief inspector runs a loop, again and again: **look** at the situation, **pick a tool**, **read the result**, and **decide again**: done, or another step?',
  '2.4k': 'It plans and reasons, picks its tools, remembers across sessions, and adapts to what it finds. When it is ready, it **signs the recommendation**.',
  '2.4l': 'Agents are used in three ways: an assistant, like our bridge agent; a workflow agent; and deep research. Each needs more memory. In every case the language model decides, and **a framework runs the loop**: in the lab, LangGraph.',
  // Tools · tools, skills, MCP
  '2.5': 'Section three: **tools are the hands**. Callable functions that act, not just think. The model asks for a call, and the framework runs it.',
  '2.5a': 'A **skill is the procedure**: the incident triage SOP. Only its description sits in the context window; the body loads when the job needs it, like the manual’s table of contents kept in the truck.',
  '2.5b': 'And **MCP is a standard plug**: connect once, use from any agent. In the lab it stays a concept. An agent is only as good as what it can reach.',
  '2.5c': 'Section 3.2: the inspector’s instruments. The @tool decorator turns a function into a tool. The model reads **only the label**: the name, the inputs and the docstring that says when to use it. And the allowlist holds eight tools.',
  '2.5d': 'Section 3.3: the inspection manual. Recall this bridge’s memory first, pull the incident brief, more tools only if needed, remember the decision, answer as JSON. And when to escalate: crack wider than 1 millimetre, **section loss over 25 percent**, bearing displacement over 15: an immediate structural review.',
  // Query · one query, four lenses
  '2.6': 'Section four: why one query? With four systems, rows, JSON, graph and vectors each live apart, joined by ETL and sync jobs, and the copies go stale.',
  '2.6a': 'In **one Oracle AI Database**, the four are lenses on the same record: relational, JSON, SQL/PGQ graph and vector similarity, in one statement and one transaction. One consistency boundary.',
  '2.6b': 'Sections 4.2 to 4.4: one SQL statement builds the brief. The bridge’s row and JSON specs, its five graph neighbours, five vector evidence chunks, and everything comes back as **one JSON brief**.',
  '2.6c': 'Section 4.5: the query becomes the agent’s main instrument, get_asset_incident_brief. The model fills three arguments. **It never sees or writes the SQL.**',
  // Agent · build the agent
  '2.7': 'Section five: the agent is a state graph. The model thinks; if it asked for a tool, the tools node acts and loops back to the model; if not, it finishes. **That cycle is the whole agent.**',
  '2.7a': 'The agent has two memories in one database: **a visit notebook**, short-term, kept per thread, and **a bridge logbook**, long-term and permanent, found by name or by meaning.',
  '2.7b': 'And memory needs a lifecycle: what to keep, what to forget and when, and reading memory, which is retrieval. Without a lifecycle, an agent will happily act on **stale facts**.',
  '2.7c': 'Section 5.3: before the run, wipe **only this lab’s notes**: this namespace in the logbook, this thread in the notebook. The city’s records are not touched.',
  '2.7d': 'Section 5.4: two memories, one database connection. The logbook is an OracleStore, and its notes are **embedded on write** into 384 numbers. The notebook is an OracleSaver, with its checkpoints.',
  '2.7e': 'Then we bind the allowlist: five data tools and three memory tools. The model is told about these **eight instruments only**. There is no ninth.',
  '2.7f': 'Section 5.5: the system prompt has three layers: the SOP from section 3.3, a safety rule that **tool output is data**, and the report form, which comes after remember.',
  '2.7g': 'Here is the saved first run. Five tool calls: overview, similar memories, the incident brief, recall, and **remember**, then the final JSON. Memory was empty the first time. And what remember stored: immediate structural review, and a proposed load restriction.',
  '2.7h': 'And the trace and the quality checks: 57 seconds on a CPU, every tool call and result in order. Four checks pass; the JSON shape needs **review**. The trace shows what the agent did. The checks catch what it got wrong.',
  '2.8': 'Section 5.8: we open the logbook. The note was filed under bearing plate, not Harbor Bridge, so recall for Harbor Bridge finds nothing. Memory is a retrieval problem: **the key you save under** decides whether you find it again.',
  // Trust · security and observability
  '2.8a': 'Now trust. Three risks, told with the bridge. First, **a fake warning sign**: prompt injection and poisoning. Orders hidden in content, stored now and triggered later.',
  '2.8b': 'Second, **keys to every gate**: excessive agency. Too many permissions, agents that act without asking, and attackers who borrow them.',
  '2.8c': 'Third, **an unverified tool**: malicious components, safe today and unsafe tomorrow. The lab has three real guardrails: only eight allowed tools, tool output is data, and its only write is a memory note. AI is software: apply the security discipline you already have.',
  '2.8d': 'And observability: the site’s CCTV and time log. Agents rarely crash; they **drift**. So we watch new things: groundedness, instruction alignment, governance, token usage. Without them, you cannot tell whether the agent is slow, expensive, or wrong.',
  '2.8e': 'Here is a dashboard for this crack, from the saved run: the draft step takes **25 seconds**, it reads 1,454 tokens and writes 234, and the agent answers after 57 seconds and five tool calls. The drift line is a concept, not data.',
  // Wrap
  '2.8f': 'So pick the tool that fits the job. RAG for what the record says; a workflow to triage predictably; an agent to reason and tell you what to do. Do not reach for an agent because agents are interesting. **Reach for it when the route must be chosen.**',
  '2.9': 'That is Lab 2: **ground the answer** in evidence, give the agent **tools and a skill**, and fetch all four shapes of data in **one query**. And **the rust** is still waiting on the bridge: in Lab 3 the AI agent learns to remember.',

  // Chapter 2 · Agent Memory
  '3.0': 'We are back at Harbor Bridge, because the problem has not gone away: the rust is still there. Two inspectors will look at it on different days. Mercer comes first, Vance comes next. What should Vance know before he starts?',
  '3.1a': 'Day 1. Mercer is at the rust. She talks to the AI agent first: corrosion on the bearing assemblies, about 25 percent section loss at the bearing plate edges, what she advises, and what needs follow-up. Then she calls log_finding to record the official finding. The AI agent says: noted.',
  '3.1b': 'Then the chat closes. This is before we add memory: Mercer goes home, and everything she told the AI agent goes with the session. Nothing carried over.',
  '3.1c': 'Day 2. Vance comes to the same rust and asks what happened here. The AI agent has nothing. Same questions again, the earlier advice is missing, and the follow-up is out of view. The records may still exist. The next visit needs a way to find and use the relevant history.',
  '3.2a': 'An agent needs more than one kind of memory. Short-term memory is the desk: what the agent holds right now, the context window and the session. When the chat closes, everything on the desk is swept away. That is what happened to Mercer’s notes.',
  '3.2b': 'Long-term memory is the cabinet: what the agent keeps between visits. Mercer’s notes go into the cabinet, kept in Oracle AI Database. On Day 2 Vance asks what happened at this pier, and her notes come back out of the cabinet to answer him. This is what Vance needed.',
  '3.2p': 'Long-term memory comes in three kinds, and you already have all three. First, procedural: how to do something. For you, riding a bike. For an agent, its system prompt. At Harbor Bridge, the approved inspection guidance.',
  '3.2q': 'Second, episodic: what happened. For you, last summer’s trip. For an agent, its past actions. At Harbor Bridge, what Mercer saw and advised.',
  '3.2r': 'Third, semantic: what is true. For you, what you learned in school. For an agent, the facts about its users. At Harbor Bridge, the bridge itself and which pier it is. Vance needed all three.',
  '3.2c': 'One sentence from Mercer holds three kinds of knowledge. On Day 1 she reported: that is episodic, what happened, like a diary entry. About 25 percent section loss: that is semantic, what is true, like a fact sheet. Remove loose corrosion before coating: that is procedural, how to do the job, like a checklist. On Day 2, Vance asks three questions, and each one is answered by a different card.',
  '3.2e': 'Last, shared memory. Mercer keeps a private note for herself, and leaves her guideline and her finding on the shared shelf for Harbor Bridge. Vance can’t open her drawer, but he reads the shelf. The database enforces this, not the agent. That is the handoff Vance was missing.',
  '3.3a': 'The language model reads only what is in the glass, this turn. We fill it ourselves on every turn: the system prompt, the instructions, the tool list, the notes we retrieved, the chat so far and Vance’s question. It is a fixed size, and nothing outside it is seen: not Mercer’s closed chat, not the database, not yesterday.',
  '3.3b': 'Filling it, four things go wrong. Volume: every tool result piles in, and by turn 15 it overflows. Relevance: thirty search results crowd in, and Mercer’s finding spills out. Accuracy: a summary squeezes her finding down to rust on the pier, and the 25 percent falls out. Timing: her finding came in at turn 1, and by turn 15, when Vance asks, it is gone.',
  '3.4a': 'Three jobs fix the four problems. First, memory engineering: decide what to keep, and file it where it won’t get lost. Like a clerk who files a report in labelled folders instead of piling it on the desk. When Mercer’s turn is over, it is filed as separate records: the conversation, the fact, the guideline. The glass is free again, and the 25 percent is its own record, so no summary can drop it. That fixes volume and accuracy.',
  '3.4b': 'Second, context engineering: for each question, pour in only what this question needs. Like a librarian who hands you the three pages you need, not the whole library. Vance asks what happened at this pier. We search the store and keep only Mercer’s finding and her guideline. Old chat turns become a one-line summary, and the glass is poured fresh, for this question. That fixes volume, relevance and timing.',
  '3.4c': 'Third, harness engineering: make it happen every turn, automatically. The harness is the loop your agent already runs in: LangGraph, an agents SDK, or your own Python. Like a shift routine on the wall: read the log first, write the log last. Every turn, the loop reads memory into the glass, acts, writes back what happened, and summarizes when the thread gets long. Nobody has to remember to look. That fixes volume and timing.',
  '3.4d': 'Three disciplines, four problems. Memory keeps it, context brings in the right piece, and the harness makes it happen every turn. That is why Vance gets Mercer’s finding.',
  '3.5b': 'You do not have to change your harness. Your agent loop calls one memory manager, and the memory lives in one database: vectors, SQL, JSON and graph together. One store, one memory manager, any harness.',
  '3.6': 'Parts 1 and 2. The AI agent needs one connection: the database, which holds its memory, the findings and the embedding model. Two models, two jobs: the embedding model finds what is similar, and it runs inside Oracle Database. The language model, on Ollama, extracts memories and writes the answers.',
  '3.7': 'When an inspector reports, two things happen. The whole report is filed word for word in CITY_MESSAGE. And the extractor pulls out what is worth keeping as small memory cards in CITY_MEMORY: a fact, a guideline. One message gives three memories. The agent does not store what you said. It stores what it learned.',
  '3.8a': 'Now search those memories. With no user id, the search comes back empty: zero memories.',
  '3.8b': 'Give it the right key, user_id inspector_demo, and the memories light up. Records inherit the scope of the thread that wrote them.',
  '3.9': 'Next to memory sits the system of record: fifteen official findings, each with a category, a severity, a grade, a recommendation and an embedding. Mercer logs one on purpose: corrosion, medium, grade C, repair within 60 days. Memory is what the agent learns. Findings are what the city records.',
  '3.10': 'To find the right findings we search by meaning, and the five nearest light up. Then two walls: only Harbor Bridge, only corrosion. Broad five, asset five, category four. Vector similarity and relational filters in one SQL statement.',
  '3.11': 'Three keys decide who sees what: the user, the agent and the thread. Mercer keeps a private note behind her own door: swap shifts Tuesday. Her guideline for Harbor Bridge goes in the shared hall. When Vance searches, he bounces off her door and finds the guideline in the hall: none of her private memories, one shared. This is a SQL WHERE clause, not a Python filter.',
  '3.12a': 'Here is one AI agent turn, step by step: open Vance’s own thread, read the bridge’s record, build the context card, find similar findings, search the shared memory, ask the language model, save both messages, and extract new memories.',
  '3.12b': 'And this is the context card it builds: a summary, the topics, the relevant information and the recent messages. This is the prompt the model actually receives.',
  '3.13': 'Day 1. Mercer is at the rust: about 25 percent section loss at the bearing plate edges. Her advice: repair within 60 days. The AI agent logs it as a finding for Harbor Bridge.',
  '3.13a': 'Two things are saved. The official finding goes into the findings table: corrosion, medium, grade C, repair within 60 days. Her guideline goes to shared memory for Harbor Bridge. The chat itself stays private. This is what the next inspector inherits.',
  '3.14': 'Day 2. Vance comes to the same rust and asks the same question as before: what happened at this pier? Before answering, the AI agent looks it up: a search over the findings finds Mercer’s, and shared memory holds her guideline. Her private chat is never searched.',
  '3.14a': 'This time the AI agent knows. Mercer logged corrosion here on Day 1: about 25 percent, grade C, repair within 60 days, with both sources. No human handoff. The finding and the memory carried it.',
  '3.15': 'Same question, asked twice. Without memory: no earlier information. With memory: Mercer’s finding, grade C, 60 days. It knows it is the same bridge, cites the real finding, gives a specific action, and never sees anyone’s private chats. Same model. Same question. Only the memory differs.',
  '3.15b': 'Remember the four failures from the glass? The summary keeps the window from filling up. Only Mercer’s finding comes in. The 25 percent is kept as a fact of its own. And it is fetched again when Vance asks. All four, solved.',
  '3.15c': 'And here is the full memory map. Short-term and long-term memory, the three kinds, and shared memory: most of it you built today with oracleagentmemory, in one database. Tools, workflows and caching are left to your agent framework.',
  '3.16': 'And here both labs meet. This afternoon’s rule says: section loss over 25 percent means an immediate structural review. Today’s history says Mercer measured about 25 percent. This afternoon the agent had the rule. Now it has the history.',
  '3.16a': 'Together they make the call: an immediate structural review. Neither lab alone makes it.',
  '3.17': 'That is Lab 3: memory is **the foundation**, not a feature; the context window is **a curation problem**; and **one converged store** beats four services. Before the quiz, let us look at the whole day.',
  '3.18': 'Three labs, one bridge. In Lab 1 we built **an assistant**, in Lab 2 it became **an agent**, in Lab 3 it learned to **remember**. Under all three, **one Oracle AI Database**. Now scan the code for the quiz: five minutes, 80 percent to pass, and a badge.',
};

// The map page says what the pages it replaced said, step by step (3.6 to 3.14a stay above for when a page comes back)
SCRIPT['3.6m'] = [
  'This one map is everything you build today. One turn of the AI agent runs along the top, and everything it remembers sits in one database underneath. We walk it in the order the code runs.',
  ...['3.6', '3.7', '3.8a', '3.8b', '3.9', '3.10', '3.11', '3.12a', '3.12b', '3.13', '3.13a', '3.14', '3.14a'].map((id) => SCRIPT[id]),
].join('\n\n');
