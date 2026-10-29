/**
 * Lab 1's Hands-on drawers (owner, 29 Oct): on a Lab 1 page with an entry here, a teal handle waits on the screen's
 * left edge, like Lab 3's Jupyter drawer, and opens a dark panel with that hands-on's steps (src/overlay/handsOn/
 * StepsDrawer.tsx). The steps and the code are the lab guide's own lines (the approved "_pop" boards); every value a
 * person brings from their own reservation is a placeholder such as <Project OCID>, never a real-looking ID.
 *
 * Keyed by scene id. A page without an entry shows no drawer, and with WITH_LAB1 = false (src/scenes/lab1.ts) no
 * Lab 1 page exists, so none of this is shown.
 */

/** one line of code or Console values: `t`, then `v` in the value tint, then `after`; `k` is the key line (teal) */
export interface HandsOnLine {
  t: string;
  v?: string;
  after?: string;
  /** the line to type or check: highlighted teal */
  k?: true;
  /** a comment, dimmed */
  c?: true;
}

export interface HandsOnStep {
  title: string;
  /** a paperclip before the title: the step attaches the photo */
  clip?: true;
  code?: HandsOnLine[];
  note?: string;
}

export interface HandsOnEntry {
  /** the handle's label, e.g. "Hands-on 4" */
  tab: string;
  /** a short line under the handle's label */
  tabSub: string;
  kicker: string;
  title: string;
  sub: string;
  steps: HandsOnStep[];
  /** the panel's width at 1920 x 1080, when the code needs more than the default */
  width?: number;
  /** smaller code and tighter steps, for a page whose code is long (it still scrolls if the text size is raised) */
  compact?: true;
}

const L = (t: string, extra: Partial<HandsOnLine> = {}): HandsOnLine => ({ t, ...extra });
const K = (t: string): HandsOnLine => ({ t, k: true });
const C = (t: string): HandsOnLine => ({ t, c: true });
const V = (t: string, v: string, after?: string): HandsOnLine => ({ t, v, ...(after ? { after } : {}) });

export const LAB1_HANDS_ON: Record<string, HandsOnEntry> = {
  '1.3a': {
    tab: 'Hands-on',
    tabSub: 'your worksheet · 3 values',
    kicker: 'BEFORE HANDS-ON 1 · YOUR WORKSHEET',
    title: 'Collect three values as you go',
    sub: 'Keep worksheet.txt open in a text editor for the whole lab. The app needs these values to find your stores.',
    width: 1120,
    steps: [
      {
        title: 'worksheet.txt · from the Sandbox Resource List (already provided)',
        code: [L('OCI_GENAI_REGION=<region>'), L('OCI_GENAI_GUARDRAILS_COMPARTMENT_OCID=<Compartment OCID>'), L('OCI_ADB_DATABASE_OCID=<ADB OCID>')],
      },
      {
        title: 'worksheet.txt · you create these three',
        code: [
          { t: 'OCI_GENAI_PROJECT_OCID=', v: '<Project OCID>', after: '        # Hands-on 1', k: true },
          { t: 'OCI_GENAI_VECTOR_STORE_IDS=', v: '<vs_…>', after: '            # Hands-on 1', k: true },
          { t: 'OCI_GENAI_SEMANTIC_STORE_OCID=', v: '<Semantic store OCID>', after: ' # Hands-on 2', k: true },
        ],
        note: 'Copy each one from its page in the Console as soon as you create it.',
      },
      {
        title: 'Then, in Hands-on 3',
        code: [L('Build path · 3A   paste them into the app’s .env file'), L('Launch path · 3B  the Launch helper asks for only these three')],
      },
      { title: 'Never copy a secret password into the worksheet.' },
    ],
  },

  '1.4': {
    tab: 'Hands-on 1',
    tabSub: 'Unstructured RAG · 6 steps',
    kicker: 'OCI CONSOLE · ANALYTICS & AI › GENERATIVE AI',
    title: 'Hands-on 1 · Unstructured RAG',
    sub: 'Your own compartment and bucket from the Sandbox Resource List.',
    steps: [
      { title: 'Projects › Create project', code: [{ t: 'Name: ', v: 'seer-construction' }], note: 'Leave the retention settings at their defaults. Copy the Project OCID.' },
      { title: 'Vector stores › Create vector store', code: [L('Name: seer-construction-evidence'), K('Data source type: Unstructured data')] },
      { title: 'Data sync connectors › Create data sync connector', code: [L('Name: construction-evidence'), L('Bucket: seer-construction-evidence-…'), L('Select all in bucket: on')] },
      { title: 'Data sync › Perform Data Sync', code: [K('Job name: construction-evidence')] },
      { title: 'Check before you go on', code: [V('Data sync job    ', 'Succeeded'), V('Vector store     ', 'Completed'), V('Processed files  ', '1')] },
      { title: 'Write down two values', code: [L('OCI_GENAI_PROJECT_OCID=<Project OCID>'), L('OCI_GENAI_VECTOR_STORE_IDS=<vs_…>')] },
    ],
  },

  '1.5': {
    tab: 'Hands-on 2',
    tabSub: 'Semantic Store · 4 steps',
    kicker: 'OCI CONSOLE · ANALYTICS & AI › GENERATIVE AI',
    title: 'Hands-on 2 · Semantic Store',
    sub: 'Connection IDs come from your Sandbox Resource List, never from the screenshots.',
    steps: [
      {
        title: 'Vector stores › Create vector store',
        code: [
          L('Name: seer-construction-semantic'),
          K('Data source type: Structured data'),
          L('Connection type: OCI Database tool'),
          L('Enrichment connection ID: <DB Tools Enrichment Connection OCID>'),
          L('Querying connection ID:   <DB Tools Query Connection OCID>'),
          L('Schema: CONSTRUCTION_ENGINEERING'),
          L('Enrichment: On create'),
        ],
      },
      { title: 'Test both connections', code: [V('Test enrichment connection   ', '✓ succeeded'), V('Test query connection        ', '✓ succeeded')] },
      { title: 'Create, then wait', code: [V('seer-construction-semantic   ', 'Active'), V('Semantic Enrichment          ', 'completed')], note: 'Do not go on while enrichment is queued, running or failed.' },
      { title: 'Write down the third value', code: [L('OCI_GENAI_SEMANTIC_STORE_OCID=<Semantic store OCID>')], note: 'It starts with ocid1.generativeaisemanticstore: not the vs_ ID, not a Database Tools connection OCID.' },
    ],
  },

  '1.6a': {
    tab: 'Hands-on 3',
    tabSub: 'Launch the app · 3A or 3B',
    kicker: 'CHOOSE ONE PATH · 3A OR 3B',
    title: 'Hands-on 3 · Launch the app',
    sub: 'Placeholders only: use the values from your own reservation.',
    width: 980,
    steps: [
      { title: '3A · Build: add the three IDs to sample-app/.env', code: [K('OCI_GENAI_PROJECT_OCID=<Project OCID>'), K('OCI_GENAI_VECTOR_STORE_IDS=<vs_…>'), K('OCI_GENAI_SEMANTIC_STORE_OCID=<Semantic store OCID>')] },
      { title: '3A · Build: start the app', code: [C('# inside sample-app, with the .venv active'), L('python app.py'), C('# open the Local URL, normally http://127.0.0.1:8080')] },
      { title: '3B · Launch: in Cloud Shell, get the Launch helper', code: [K("curl -fL '<launch-helper-par>' -o launch-container-instance.sh")] },
      {
        title: '3B · Launch: run it, paste the three IDs',
        code: [L('./launch-container-instance.sh'), C('# paste, in this order:'), L('<Project OCID>'), L('<vs_…>'), L('<Semantic store OCID>'), C('# wait for ACTIVE, then open http://<public-ip>:8080/')],
      },
    ],
  },

  '1.6': {
    tab: 'Hands-on 3',
    tabSub: 'Test the app · 3 prompts',
    kicker: 'IN THE APP · SEER CONSTRUCTION INTELLIGENCE',
    title: 'Hands-on 3 · Test the app',
    sub: 'Three prompts, one of them with a photo.',
    steps: [
      { title: 'Try a prompt › Specification requirements', note: 'The answer cites the specification and invents nothing.' },
      { title: 'Try a prompt › Supplier recommendation', code: [L('recommendation status · fit score'), L('risk level · explanation')], note: 'Scoped to this project, from governed data.' },
      { title: 'Attach the structural-steel delivery photo', clip: true, code: [K('observations  ≠  assumptions')], note: 'Describe only what is visible. The photo is synthetic and is not inspection evidence.' },
      { title: 'Write down the model in the runtime bar', code: [C('# the same model answers every request, for now'), V('model · ', '<as shown>', '   Routing disabled')] },
    ],
  },

  '1.7': {
    tab: 'Hands-on 4',
    tabSub: 'Record the baseline · 3 steps',
    kicker: 'HANDS-ON 4 · TASK 1',
    title: 'Record the baseline',
    sub: 'One model for everything: note what the runtime bar shows.',
    steps: [
      { title: 'Keep routing off', code: [C('# Build · .env'), K('OCI_GENAI_MODEL_ROUTING_ENABLED=false'), C('# Launch · Runtime configuration'), L('Model routing: off   →  runtime bar: Routing disabled')] },
      { title: 'Try a prompt › Supplier recommendation', code: [V('model · ', '<write it down>'), V('response time · ', '<about how long>')] },
      { title: 'New conversation, the steel delivery photo', clip: true, code: [V('model · ', '<write it down>'), V('response time · ', '<about how long>')], note: 'Keep the same photo and prompt for the routed run.' },
    ],
  },

  '1.8': {
    tab: 'Hands-on 4',
    tabSub: 'Model routing · 4 steps',
    kicker: 'HANDS-ON 4 · MODEL ROUTING',
    title: 'Hands-on 4 · Route each request',
    sub: 'Build edits two files; Launch flips one switch.',
    width: 1060,
    steps: [
      {
        title: 'Build · llm.py, inside response_model',
        code: [C('def response_model(…):'), K('    if cfg.get("model_routing_enabled") and not messages_include_images(messages):'), C('        …  # text only: the lower-cost model'), C('    # keep the image-capability check and return model below')],
      },
      { title: 'Build · .env, then restart', code: [K('OCI_GENAI_MODEL_ROUTING_ENABLED=true'), L('python app.py')] },
      { title: 'Launch · no code', code: [V('Runtime configuration › Model routing: ', 'on'), L('runtime bar → Routing enabled')] },
      {
        title: 'Test, each in a new conversation',
        code: [V('Supplier recommendation   → ', 'the lower-cost model'), V('steel delivery photo      → ', 'the multimodal model')],
        note: 'Compare with the baseline: model, rough time, evidence. Report cost in words; no numbers without token usage and prices.',
      },
    ],
  },

  '1.9': {
    tab: 'Hands-on 5',
    tabSub: 'Guardrails · 5 steps',
    kicker: 'HANDS-ON 5 · PROMPT-INJECTION PROTECTION',
    title: 'Hands-on 5 · Fail-closed guardrail',
    sub: 'The check runs before the model; if it cannot run, nothing is sent.',
    width: 1060,
    compact: true,
    steps: [
      { title: 'Build · app.py, with the other imports', code: [K('from prompt_injection_guardrails import check_prompt_injection')] },
      {
        title: 'Build · app.py, in handle_prompt',
        code: [
          L('if prompt_protection_enabled:'),
          L('    guardrail_check = check_prompt_injection(prompt, cfg)'),
          K('    if guardrail_check.blocked:'),
          L('        answer = ('),
          L('            f"{guardrail_check.message}\\n\\n"'),
          L('            f"OCI ApplyGuardrails result: promptInjection.score={guardrail_check.score}, "'),
          L('            f"blocked={guardrail_check.blocked}"'),
          L('        )'),
          L('        history[-1] = {"role": "assistant", "content": answer}'),
          L('        yield history, state, EMPTY_COMPOSER, runtime_status('),
          L('            model_routing_enabled,'),
          L('            prompt_protection_enabled,'),
          L('            specification_search_enabled,'),
          L('            governed_data_enabled,'),
          L('            cfg["project_code"],'),
          L('            active_model,'),
          { t: '            ', v: '"Blocked by guardrails"', after: ',' },
          L('        )'),
        ],
      },
      { title: 'Build · .env, then restart', code: [K('OCI_GENAI_PROMPT_PROTECTION_ENABLED=true'), L('python app.py')] },
      { title: 'Launch · no code', code: [V('Runtime configuration › Prompt-injection protection: ', 'on')] },
      { title: 'Test both prompts', code: [V('Supplier recommendation  → ', 'answers, with evidence'), V('Guardrail challenge      → ', 'Blocked by guardrails')] },
    ],
  },
};

/** the drawer for a page, or undefined when the page has none */
export const handsOnFor = (sceneId: string): HandsOnEntry | undefined => LAB1_HANDS_ON[sceneId];
