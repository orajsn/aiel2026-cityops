import { render } from '@testing-library/react';
import { LAB_STOPS, stopCells } from '../../src/content/labStops';
import { OneConnection, WritePath, type HandsOnProps } from '../../src/overlay/concepts/HandsOn';
import { TURN_STEPS } from '../../src/overlay/concepts/HandsOn2';
import { LAB3_ALL as chapter2 } from '../../src/scenes/chapter2';

const props = <T,>(id: string) => chapter2.find((s) => s.id === id)!.overlayProps as T;

test('3.1a: Mercer’s finding in the notebook’s words, no pier number, and log_finding', () => {
  const p = props<{ message: string; items: { text?: string }[] }>('3.1a');
  expect(p.items.map((i) => i.text)).toContain('Corrosion on the bearing assemblies, with about 25% section loss at the bearing plate edges.');
  expect(JSON.stringify(p)).not.toMatch(/Pier \d/);
  expect(p.message).toContain('log_finding');
});

test('3.1b says this is before adding memory', () => {
  expect(props<{ message: string }>('3.1b').message).toMatch(/^Before adding memory/);
});

test('3.12a: similar findings come before the shared memory, as in call_copilot', () => {
  expect(TURN_STEPS.indexOf('Find similar findings')).toBe(3);
  expect(TURN_STEPS.indexOf('Search the shared memory')).toBe(4);
});

test('3.6 and 3.7: every cell to run has a short brief, numbered like the Jupyter drawer', () => {
  for (const id of ['3.6', '3.7']) {
    const runs = stopCells(LAB_STOPS[id]).filter((c) => c.run);
    expect(runs.every((c) => c.mark?.brief), id).toBe(true);
    const page = id === '3.6' ? OneConnection : WritePath;
    const c = render(page({ ...props<HandsOnProps>(id) })).container;
    const shown = [...c.querySelectorAll('[data-brief]')];
    expect(shown.map((b) => b.getAttribute('data-brief'))).toEqual(runs.map((r) => String(r.run)));
    expect(shown.map((b) => b.textContent)).toEqual(runs.map((r) => expect.stringContaining(r.mark!.brief!)));
  }
});

test('3.6: two models with two jobs, and embeddings run inside Oracle Database', () => {
  const p = props<HandsOnProps>('3.6');
  expect(p.kicker).toBe('Lab 3 · Part 1-2');
  const c = render(OneConnection(p)).container;
  expect(c.querySelector('[data-model="embedding"]')?.textContent).toMatch(/ONNX/);
  expect(c.querySelector('[data-model="llm"]')?.textContent).toMatch(/Ollama/);
  expect(c.textContent).toContain('Embeddings run inside Oracle Database.');
  expect(c.textContent).not.toMatch(/API key/);
});
