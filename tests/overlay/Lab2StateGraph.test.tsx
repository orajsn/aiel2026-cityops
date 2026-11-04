import { render } from '@testing-library/react';
import { StateGraphArt, graphState } from '../../src/overlay/concepts/lab2/nbArtGraph';
import { NB_ART_B } from '../../src/overlay/concepts/lab2/nbArtB';
import { NB_PAGES } from '../../src/content/lab2Notebook';
import { LAB2_CUT, LAB2_ALL } from '../../src/scenes/chapter1';
import { OVERLAYS } from '../../src/overlay/registry';
import { useDrawerStore } from '../../src/engine/presentation';

const state = (c: HTMLElement, name: string) => c.querySelector(`[data-node="${name}"]`)?.getAttribute('data-state');

test('2.7 draws the state graph with the notebook\'s node names and the yes / no labels', () => {
  expect(typeof NB_ART_B['2.7'].art).toBe('function');
  const { container } = render(<StateGraphArt step={1} />);
  const text = container.textContent ?? '';
  for (const t of ['START', 'END', 'model', 'think', 'tools', 'act', 'tool?', 'yes', 'no', 'back', 'to think', 'enforce step:']) expect(text, t).toContain(t);
  expect(container.querySelector('[data-label="yes"]')).not.toBeNull();
  expect(container.querySelector('[data-label="no"]')).not.toBeNull();
});

test('each step lights its own part: now at full strength, earlier ones medium, later ones faint, the last step all', () => {
  expect(graphState(1, 1)).toBe('now');
  const at = (step: number) => render(<StateGraphArt step={step} />).container;
  let c = at(1);
  expect([state(c, 'model'), state(c, 'tools'), state(c, 'tool?'), state(c, 'back')]).toEqual(['now', 'later', 'later', 'later']);
  c = at(2);
  expect([state(c, 'model'), state(c, 'tools'), state(c, 'tool?'), state(c, 'back')]).toEqual(['done', 'now', 'later', 'later']);
  c = at(3);
  expect([state(c, 'model'), state(c, 'tools'), state(c, 'tool?'), state(c, 'back')]).toEqual(['done', 'done', 'now', 'later']);
  c = at(4);
  expect([state(c, 'model'), state(c, 'tools'), state(c, 'tool?'), state(c, 'back')]).toEqual(['done', 'done', 'done', 'now']);
  c = at(5);
  expect([state(c, 'model'), state(c, 'tools'), state(c, 'tool?'), state(c, 'back')]).toEqual(['now', 'now', 'now', 'now']);
  // START and END are never faded
  expect(c.querySelector('[data-node="START"]')?.getAttribute('data-state')).toBeNull();
  expect(at(1).querySelector('[data-node="END"]')?.getAttribute('style') ?? '').not.toMatch(/opacity/);
});

test('the page 2.7 panel shows the graph and follows the Next steps', () => {
  const s = LAB2_ALL.find((x) => x.id === '2.7')!;
  const C = OVERLAYS[s.overlay!];
  useDrawerStore.setState({ open: false, focus: 0 });
  const a = render(<C {...s.overlayProps} />).container;
  expect(a.querySelector('[data-art="nb-state-graph"]')?.getAttribute('data-step')).toBe('1');
  a.ownerDocument.body.innerHTML = '';
  useDrawerStore.setState({ open: true, focus: 2 });
  const b = render(<C {...s.overlayProps} />).container;
  expect(b.querySelector('[data-art="nb-state-graph"]')?.getAttribute('data-step')).toBe('3');
  useDrawerStore.setState({ open: false, focus: 0 });
});

test('2.3 shows its question above the notebook box, and no other page has one', () => {
  expect(NB_PAGES['2.3'].question).toBe('What recent issues have been reported on Harbor Bridge ?');
  expect(Object.entries(NB_PAGES).filter(([, p]) => p.question).map(([id]) => id)).toEqual(['2.3']);
  const s = LAB2_ALL.find((x) => x.id === '2.3')!;
  const C = OVERLAYS[s.overlay!];
  useDrawerStore.setState({ open: false, focus: 0 });
  const c = render(<C {...s.overlayProps} />).container;
  const q = c.querySelector('[data-question]')!;
  expect(q.textContent).toContain('What recent issues have been reported on Harbor Bridge ?');
  const box = c.querySelector('[data-code-focus]')!;
  expect(q.parentElement).toBe(box.parentElement);
  expect(q.compareDocumentPosition(box) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const other = LAB2_ALL.find((x) => x.id === '2.3a')!;
  const O = OVERLAYS[other.overlay!];
  expect(render(<O {...other.overlayProps} />).container.querySelector('[data-question]')).toBeNull();
});

test('the Trust pages 2.8a to 2.8e are cut from the show but kept', () => {
  for (const id of ['2.8a', '2.8b', '2.8c', '2.8d', '2.8e']) {
    expect(LAB2_CUT.has(id), id).toBe(true);
    expect(LAB2_ALL.some((s) => s.id === id), id).toBe(true);
  }
});
