import { render } from '@testing-library/react';
import { LikeAPerson } from '../../src/overlay/concepts/LikeAPerson';
import { chapter2 } from '../../src/scenes/chapter2';

test('three kinds in the map order, each a person example over its agent example over its Harbor Bridge example', () => {
  const c = render(<LikeAPerson kicker="k" message="m" />).container;
  const kinds = [...c.querySelectorAll('[data-kind]')].map((k) => k.getAttribute('data-kind'));
  expect(kinds).toEqual(['Procedural', 'Episodic', 'Semantic']);
  for (const w of ['Riding a bike', 'Its system prompt', 'last summer', 'Its past actions', 'learned in school', 'Facts about a user', 'Approved inspection guidance', 'What Mercer saw and advised', 'Harbor Bridge and the right pier'])
    expect(c.textContent).toContain(w);
  // teal and greys only: red is for alerts
  expect(c.innerHTML).not.toMatch(/--red|#c74634/i);
});

test('the person page sits between long-term memory and the three kinds, at the rust, the camera holding', () => {
  const ids = chapter2.map((s) => s.id);
  expect(ids.slice(ids.indexOf('3.2b'), ids.indexOf('3.2b') + 3)).toEqual(['3.2b', '3.2p', '3.2c']);
  const page = chapter2.find((s) => s.id === '3.2p')!;
  expect(page.overlay).toBe('LikeAPerson');
  expect(page.shot).toBe(chapter2.find((s) => s.id === '3.2b')!.shot);
});
