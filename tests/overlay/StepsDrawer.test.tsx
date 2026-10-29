import { fireEvent, render } from '@testing-library/react';
import { StepsDrawer } from '../../src/overlay/handsOn/StepsDrawer';
import { LAB1_HANDS_ON } from '../../src/content/lab1HandsOn';
import { LAB_STOPS } from '../../src/content/labStops';
import { useDrawerStore, stopStepCount, presentNext } from '../../src/engine/presentation';
import { useSceneStore } from '../../src/engine/store';

beforeEach(() => useDrawerStore.getState().reset());

test('the handle shows only on a page with a Lab 1 hands-on entry', () => {
  for (const id of ['1.0', '1.3', '0.1', ...Object.keys(LAB_STOPS)]) {
    const { container, unmount } = render(<StepsDrawer sceneId={id} />);
    expect(container.innerHTML).toBe('');
    unmount();
  }
  for (const id of Object.keys(LAB1_HANDS_ON)) {
    const { getByRole, unmount } = render(<StepsDrawer sceneId={id} />);
    expect(getByRole('button', { name: `Open ${LAB1_HANDS_ON[id].tab}` })).toBeTruthy();
    unmount();
  }
});

test('opens over the page with the steps and the highlighted line, and closes', () => {
  const { getByRole, container } = render(<StepsDrawer sceneId="1.8" />);
  fireEvent.click(getByRole('button', { name: 'Open Hands-on 4' }));
  expect(getByRole('dialog').textContent).toContain('Hands-on 4 · Route each request');
  expect(container.querySelectorAll('.hd__step')).toHaveLength(LAB1_HANDS_ON['1.8'].steps.length);
  const keys = [...container.querySelectorAll('.hd__line--key')].map((e) => e.textContent);
  expect(keys).toContain('    if cfg.get("model_routing_enabled") and not messages_include_images(messages):');
  expect(keys).toContain('OCI_GENAI_MODEL_ROUTING_ENABLED=true');
  // no red anywhere in the drawer
  expect(container.innerHTML).not.toMatch(/--red|#c74634|red\b/i);
  fireEvent.click(getByRole('button', { name: 'Close Hands-on 4' }));
  expect(useDrawerStore.getState().open).toBe(false);
});

test('a click on a step puts it in focus', () => {
  const { getByRole, container } = render(<StepsDrawer sceneId="1.9" />);
  fireEvent.click(getByRole('button', { name: 'Open Hands-on 5' }));
  fireEvent.click(container.querySelector('[data-step="2"]')!);
  expect(useDrawerStore.getState().focus).toBe(2);
  expect(container.querySelector('[data-step="2"]')!.className).toContain('is-on');
});

test('the clicker opens the drawer, walks its steps, closes it, then goes on', () => {
  const n = LAB1_HANDS_ON['1.8'].steps.length;
  expect(stopStepCount('1.8')).toBe(n);
  expect(stopStepCount('1.0')).toBe(0);
  useSceneStore.getState().setScenes([
    { id: '1.8', chapter: 3, title: 'Model routing', shot: 'city' },
    { id: 'after', chapter: 3, title: 'After', shot: 'city' },
  ]);
  useSceneStore.setState({ index: 0 });
  useSceneStore.getState().setSettled(true);
  presentNext();
  expect(useDrawerStore.getState().open).toBe(true);
  for (let i = 0; i < n; i++) presentNext();
  expect(useDrawerStore.getState().focus).toBe(n);
  presentNext();
  expect(useDrawerStore.getState().open).toBe(false);
  presentNext();
  expect(useSceneStore.getState().current().id).toBe('after');
});
