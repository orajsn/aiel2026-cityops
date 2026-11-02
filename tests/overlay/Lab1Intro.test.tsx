import { render } from '@testing-library/react';
import { HANDS_ON_STEPS, L1Damage, L1Opening, L1Scattered, QUESTIONS } from '../../src/overlay/concepts/lab1/Lab1Intro';
import { attrs, expectNoRed } from './lab1Helpers';

test('1.0 opening: three questions into one AI assistant (Seer Construction Intelligence), the engineer decides, five hands-on steps', () => {
  const c = render(<L1Opening kicker="k" message="m" />).container;
  expect(attrs(c, 'data-question')).toEqual(['spec', 'supplier', 'photo']);
  for (const q of QUESTIONS) expect(c.textContent).toContain(`“${q}”`);
  expect(attrs(c, 'data-job')).toEqual(['1', '2', '3']);
  expect(attrs(c, 'data-control')).toEqual(['routing', 'guardrails']);
  for (const w of ['One AI assistant', 'Seer Construction Intelligence', 'Searches the specification', 'Looks up governed project data', 'Reads a site photo', 'The right model for each question', 'Guardrails check every request first', 'The engineer decides'])
    expect(c.textContent).toContain(w);
  expect(attrs(c, 'data-hands-on')).toEqual(['1', '2', '3', '4', '5']);
  expect(HANDS_ON_STEPS).toEqual(['Unstructured RAG', 'Semantic Store', 'Launch the app', 'Model routing', 'Guardrails']);
  expect(c.querySelector('[data-engineer] [data-person="engineer"]')).not.toBeNull();
  expect(c.querySelector('[data-net]')).not.toBeNull();
  expectNoRed(c);
});

test('1.1 damage: three findings on Harbor Bridge, the project manager gathers three facts for the engineer', () => {
  const c = render(<L1Damage kicker="k" message="m" />).container;
  expect(attrs(c, 'data-damage')).toEqual(['cracks', 'spalling', 'rebar']);
  expect(attrs(c, 'data-mark')).toEqual(['cracks', 'spalling', 'rebar']);
  for (const w of ['HARBOR BRIDGE · WHAT THE INSPECTION FOUND', 'Cracks', 'Spalling concrete', 'Exposed reinforcing steel', 'what the specification requires', 'which supplier can deliver', 'what the site photos show', 'assesses the damage and plans the repair'])
    expect(c.textContent).toContain(w);
  expect(attrs(c, 'data-who')).toEqual(['project manager', 'engineer']);
  expectNoRed(c);
});

test('1.2 scattered: each question, the place its answer lives, and how it is found by hand today', () => {
  const c = render(<L1Scattered kicker="k" message="m" />).container;
  expect(attrs(c, 'data-place')).toEqual(['spec', 'data', 'photos']);
  expect(attrs(c, 'data-by-hand')).toEqual(['spec', 'data', 'photos']);
  for (const w of ['a long PDF in an Object Storage bucket', 'tables in the Autonomous AI Database', 'a structural-steel delivery, from the site', 'Read it page by page', 'Ask someone to write a query', 'Open each photo and look'])
    expect(c.textContent).toContain(w);
  // field names only, never values
  expect(c.querySelector('[data-fields]')?.textContent).toBe('supplierrecommendation statusfit scorerisk levelpurchase orders');
  expect(c.querySelector('[data-question="all"]')?.textContent).toContain('What if one question, in one app, could reach all three?');
  expectNoRed(c);
});
