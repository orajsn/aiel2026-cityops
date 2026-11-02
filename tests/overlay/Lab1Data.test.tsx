import { render } from '@testing-library/react';
import { L1App, L1Assistant, L1Specs, L1Suppliers, SUPPLIER_FIELDS, SWITCHES, TRY_A_PROMPT } from '../../src/overlay/concepts/lab1/Lab1Data';
import { attrs, expectNoRed, expectOneRed } from './lab1Helpers';

test('1.3 one assistant: the app, then OCI Enterprise AI checks, picks the model, looks it up; the answer cites, the engineer decides', () => {
  const c = render(<L1Assistant kicker="k" message="m" />).container;
  expect(c.querySelector('[data-app]')?.textContent).toContain('Seer Construction Intelligence');
  expect(attrs(c, 'data-step')).toEqual(['check', 'route']);
  expect(attrs(c, 'data-store')).toEqual(['vector', 'semantic']);
  expect(attrs(c, 'data-route')).toEqual(['text', 'image']);
  expect(c.querySelector('[data-route="text"]')?.textContent).toContain('the lower-cost model');
  expect(c.querySelector('[data-route="image"]')?.textContent).toContain('the multimodal model');
  for (const w of ['OCI Enterprise AI', 'ApplyGuardrails', 'file_search', 'NL2SQL', 'Object Storage bucket', 'data sync connector', 'Autonomous AI Database', 'ADB MCP Server', 'SQL checked: it cannot reach other projects', 'scoped to one project code'])
    expect(c.textContent).toContain(w);
  // each piece names its hands-on step
  expect(attrs(c, 'data-ho').sort()).toEqual(['1', '2', '3', '4', '5']);
  expect(c.querySelector('[data-answer]')?.textContent).toContain('the engineer decides');
  expectNoRed(c);
});

test('1.3a meet the app: runtime bar, Try a prompt, Runtime configuration with one switch per hands-on; the one red is the Guardrail challenge', () => {
  const c = render(<L1App kicker="k" message="m" />).container;
  expect(c.textContent).toContain('Seer Construction Intelligence');
  expect(c.querySelector('[data-runtime-bar]')?.textContent).toContain('Routing enabled');
  expect(c.querySelector('[data-runtime-bar]')?.textContent).toContain('Guardrails enabled');
  expect(attrs(c, 'data-prompt')).toEqual(TRY_A_PROMPT);
  expect(attrs(c, 'data-config-switch')).toEqual(['1', '2', '4', '5']);
  expect(SWITCHES.map((s) => s.name)).toEqual(['Specification search', 'Governed project data', 'Model routing', 'Prompt-injection protection']);
  expect(c.querySelectorAll('[data-config] [data-switch="on"]')).toHaveLength(4);
  expect(c.querySelector('[data-scope]')?.textContent).toContain('Project code');
  expect(c.querySelector('video[data-app-video]')).not.toBeNull();
  expectOneRed(c, '[data-prompt="Guardrail challenge"]');
});

test('1.4 Hands-on 1: Object Storage, data sync, the vector store, file_search; every point cites the specification', () => {
  const c = render(<L1Specs kicker="k" message="m" />).container;
  for (const w of ['Object Storage', 'data sync', 'OCI Enterprise AI project', 'Unstructured vector store', 'chunks', 'embeddings', 'file_search', 'Responses API', 'Not in the specification? It says so. It does not invent a requirement.'])
    expect(c.textContent).toContain(w);
  expect(attrs(c, 'data-cites')).toEqual(['surface preparation', 'materials', 'inspection and acceptance']);
  expect(c.querySelectorAll('[data-passage]')).toHaveLength(3);
  expect(c.querySelector('[data-ready]')?.textContent).toContain('data sync job Succeeded');
  expect(c.querySelector('[data-ready]')?.textContent).toContain('vector store Completed');
  expectNoRed(c);
});

test('1.5 Hands-on 2: semantic store, NL2SQL, the project-scope SQL check (its one red), ADB MCP Server, an answer of field names only', () => {
  const c = render(<L1Suppliers kicker="k" message="m" />).container;
  expect(attrs(c, 'data-step')).toEqual(['semantic', 'nl2sql', 'sql-check', 'mcp']);
  expect(c.querySelector('[data-question="supplier"]')?.textContent).toContain('Supplier recommendation');
  expect(c.querySelector('[data-blocked]')?.textContent).toContain('SQL that widens to other projects');
  expect(attrs(c, 'data-field')).toEqual(SUPPLIER_FIELDS);
  expect(c.textContent).toContain('Only what the data says');
  expect(c.textContent).not.toMatch(/contractor/i);
  expectOneRed(c, '[data-blocked]');
});
