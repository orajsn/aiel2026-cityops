import { render } from '@testing-library/react';
import { L1Damage, L1Opening, L1Scattered } from '../../src/overlay/concepts/lab1/Lab1Intro';

const attrs = (c: HTMLElement, a: string) => [...c.querySelectorAll(`[${a}]`)].map((e) => e.getAttribute(a));

function noRedAndSvgPeople(c: HTMLElement) {
  expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
  expect(c.querySelectorAll('img')).toHaveLength(0);
  expect(c.querySelectorAll('svg[data-person]').length).toBeGreaterThan(0);
}

test('opening: three jobs, two controls, the engineer decides, five hands-on exercises', () => {
  const c = render(<L1Opening kicker="k" message="m" />).container;
  expect(attrs(c, 'data-job')).toEqual(['search', 'check', 'summarise']);
  expect(attrs(c, 'data-control')).toEqual(['model', 'guardrails']);
  for (const w of ['Search the specifications', 'Check contractors and materials', 'Summarise site photos', 'Choose the right model for each job', 'Guardrails against unsafe instructions', 'The engineer evaluates and decides on safety.', 'Unstructured RAG', 'Semantic Store + NL2SQL', 'The assistant app', 'Model routing', 'Guardrails'])
    expect(c.textContent).toContain(w);
  expect(attrs(c, 'data-hands-on')).toEqual(['1', '2', '3', '4', '5']);
  const eng = c.querySelector('[data-engineer]')!;
  expect(eng.querySelector('svg[data-person="engineer"] [data-check]')).not.toBeNull();
  noRedAndSvgPeople(c);
});

test('damage: cracks, spalling concrete, exposed reinforcing steel, then project manager to engineer', () => {
  const c = render(<L1Damage kicker="k" message="m" />).container;
  expect(attrs(c, 'data-damage')).toEqual(['cracks', 'spalling', 'rebar']);
  for (const w of ['Cracks', 'Spalling concrete', 'concrete breaking away', 'Exposed reinforcing steel', 'rusty rebar showing', 'Prepare the information for the engineer to assess and plan the repair.'])
    expect(c.textContent).toContain(w);
  expect(attrs(c, 'data-who')).toEqual(['project manager', 'engineer']);
  noRedAndSvgPeople(c);
});

test('scattered: four sources in four systems, the manager and the question', () => {
  const c = render(<L1Scattered kicker="k" message="m" />).container;
  expect(attrs(c, 'data-source')).toEqual(['report', 'drawings', 'history', 'contractors']);
  for (const w of ['Inspection report', 'Bridge drawings', 'Repair history', 'Contractor data', '(PDF)', '(pictures)', 'What if one question could gather all of this?'])
    expect(c.textContent).toContain(w);
  expect(c.textContent?.match(/\(database\)/g)).toHaveLength(2);
  expect(c.querySelectorAll('[data-question]')).toHaveLength(1);
  expect(c.querySelectorAll('[data-reach]')).toHaveLength(4);
  noRedAndSvgPeople(c);
});
