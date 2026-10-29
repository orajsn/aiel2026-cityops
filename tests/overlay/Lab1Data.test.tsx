import { render } from '@testing-library/react';
import { L1Assistant, L1Contractors, L1Specs } from '../../src/overlay/concepts/lab1/Lab1Data';

const noRed = (c: HTMLElement) => expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
const attrs = (c: HTMLElement, a: string) => [...c.querySelectorAll(`[${a}]`)].map((e) => e.getAttribute(a));

test('L1Assistant: three sources, OCI Enterprise AI with three engines, one assistant', () => {
  const c = render(<L1Assistant kicker="k" message="One assistant" />).container;
  expect(attrs(c, 'data-source')).toEqual(['PDF files', 'Pictures', 'Database tables']);
  expect(c.textContent).toContain('OCI Enterprise AI');
  expect(attrs(c, 'data-engine')).toEqual(['Vector store', 'Semantic store', 'Model routing']);
  for (const w of ['scan', 'split', 'embed', 'store', 'project', 'supplier', 'inspection', 'schedule', 'compliance', 'lower-cost model', 'multimodal model', 'finds passages by meaning', 'answers questions about the project’s data', 'sends each question to the model it needs', 'One AI assistant'])
    expect(c.textContent).toContain(w);
  expect(c.querySelector('[data-answer="assistant"]')).not.toBeNull();
  noRed(c);
});

test('L1Specs: the engineer’s question, three steps, three sourced parts, the contrast', () => {
  const c = render(<L1Specs kicker="k" message="m" />).container;
  expect(c.textContent).toContain('According to the project documents, how must we prepare the surface for this concrete repair, which materials do we use, and how is it inspected and accepted?');
  expect(attrs(c, 'data-step')).toEqual(['1', '2', '3']);
  expect(attrs(c, 'data-answer')).toEqual(['Surface preparation', 'Materials', 'Inspection and acceptance']);
  expect(attrs(c, 'data-pdf')).toEqual(['approved repair specification', 'maintenance manual', 'inspection report']);
  for (const w of ['Object Storage', 'Vector Store', 'OCI Enterprise AI', 'source: approved repair specification (PDF)', 'From the approved documents, with sources', 'Not from general knowledge alone'])
    expect(c.textContent).toContain(w);
  expect(attrs(c, 'data-tag')).toEqual(['Hands-on 1 · Unstructured RAG']);
  noRed(c);
});

test('L1Contractors: tables, Semantic Store, NL2SQL, ADB MCP Server, a printed sample answer, no invented specifics', () => {
  const c = render(<L1Contractors kicker="k" message="m" />).container;
  expect(c.textContent).toContain('Which contractor is qualified for this repair, and what is the delivery status of the materials we need?');
  expect(attrs(c, 'data-table')).toEqual(['Contractors', 'Certifications', 'Purchase orders']);
  for (const w of ['Autonomous Database', 'Semantic Store', 'NL2SQL', 'ADB MCP Server', 'SELECT', 'JOIN certifications'])
    expect(c.textContent).toContain(w);
  // owner, 29 Oct: an actual answer, not a skeleton: which contractor qualifies, and each material's delivery status
  expect([...c.querySelectorAll('[data-answer="table"] [data-row]')].map((r) => r.getAttribute('data-row'))).toEqual(['Contractor A', 'Contractor B', 'Repair mortar', 'Bonding agent', 'Corrosion inhibitor']);
  expect(c.querySelector('[data-answer="table"]')?.textContent).toContain('✓ qualified');
  expect(attrs(c, 'data-tag')).toEqual(['Hands-on 2 · Semantic Store + NL2SQL']);
  expect(c.textContent).not.toMatch(/\$|\d{4}|Kirkland|fictional/);
  noRed(c);
});
