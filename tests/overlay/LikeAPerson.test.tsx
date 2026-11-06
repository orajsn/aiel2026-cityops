import { render } from '@testing-library/react';
import { LikeAPerson } from '../../src/overlay/concepts/LikeAPerson';
import { LAB3_ALL } from '../../src/scenes/chapter2';

test('three kinds in the map order, each a person example over its agent example over its Harbor Bridge example', () => {
  const c = render(<LikeAPerson kicker="k" message="m" />).container;
  const kinds = [...c.querySelectorAll('[data-kind]')].map((k) => k.getAttribute('data-kind'));
  expect(kinds).toEqual(['Procedural', 'Episodic', 'Semantic']);
  for (const w of ['Riding a bike', 'Its system prompt', 'last summer', 'Its past actions', 'learned in school', 'Facts about a user', 'Approved inspection guidance', 'What Mercer saw and advised', 'Harbor Bridge and the right pier'])
    expect(c.textContent).toContain(w);
  // a table: corner cell, three kinds across, three rows, Mercer's portrait in the bridge row
  expect(c.textContent).toContain('Same idea, three places');
  expect([...c.querySelectorAll('[data-row]')].map((r) => r.getAttribute('data-row'))).toEqual(['person', 'agent', 'bridge']);
  for (const k of c.querySelectorAll('[data-kind]')) expect(k.querySelectorAll('[data-cell]')).toHaveLength(3);
  expect(c.querySelector('[data-row="bridge"] [data-portrait="mercer"]')).not.toBeNull();
  // teal and greys only: red is for alerts
  expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
});

test('the person page sits between long-term memory and the three kinds, at the rust, the camera holding', () => {
  const ids = LAB3_ALL.map((s) => s.id);
  expect(ids.slice(ids.indexOf('3.2b'), ids.indexOf('3.2b') + 5)).toEqual(['3.2b', '3.2p', '3.2q', '3.2r', '3.2c']);
  const page = LAB3_ALL.find((s) => s.id === '3.2p')!;
  expect(page.overlay).toBe('LikeAPerson');
  expect(page.shot).toBe(LAB3_ALL.find((s) => s.id === '3.2b')!.shot);
});

test('one click per kind: procedural, episodic, semantic; the kind being talked about is lit, the others wait', () => {
  const ids = ['3.2p', '3.2q', '3.2r'];
  const pages = ids.map((id) => LAB3_ALL.find((s) => s.id === id)!);
  expect(pages.map((p) => (p.overlayProps as { focus: number }).focus)).toEqual([0, 1, 2]);
  expect(new Set(pages.map((p) => p.overlayGroup)).size).toBe(1);
  const c = render(<LikeAPerson kicker="k" message="m" focus={1} />).container;
  expect([...c.querySelectorAll('[data-kind]')].map((k) => k.getAttribute('data-on'))).toEqual(['false', 'true', 'false']);
});
