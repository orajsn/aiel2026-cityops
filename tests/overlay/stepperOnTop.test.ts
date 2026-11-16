// @ts-expect-error node:fs has no type declarations here (vitest runs in node)
import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Stage } from '../../src/Stage';
import { useUiStore } from '../../src/engine/ui';
import { useSceneStore } from '../../src/engine/store';
import { useDrawerStore, usePresentationStore } from '../../src/engine/presentation';

function files(dir: string): string[] {
  return (readdirSync(dir, { withFileTypes: true }) as { name: string; isDirectory(): boolean }[])
    .flatMap(d => d.isDirectory() ? files(`${dir}/${d.name}`) : [`${dir}/${d.name}`]);
}

/** Read the actual CSS cascade, including late overrides, rather than its first regex match. */
function withShellLayers(check: (z: (className: string) => number) => void) {
  const style = document.createElement('style');
  style.textContent = readFileSync('src/styles.css', 'utf8');
  document.head.append(style);
  const stage = document.createElement('div'); stage.className = 'stage';
  document.body.append(stage);
  const z = (className: string) => {
    const element = document.createElement('div'); element.className = className; stage.append(element);
    return Number(getComputedStyle(element).zIndex || 0);
  };
  try { check(z); } finally { stage.remove(); style.remove(); }
}

test('navigation stays above lesson content, world labels and drawers in the stage stacking context', () => {
  withShellLayers(z => {
    const navigation = z('stepper');
    for (const layer of ['jd', 'hd', 'settings', 'cam-edit', 'follow-card', 'blank', 'fps']) {
      expect(navigation, layer).toBeGreaterThan(z(layer));
    }
    const inlineLayers: number[] = [];
    for (const file of files('src').filter(p => /\.tsx?$/.test(p) && !p.endsWith('/MapSources.tsx'))) {
      const source: string = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/zIndex:\s*(\d+)/g)) inlineLayers.push(Number(match[1]));
      for (const match of source.matchAll(/zIndexRange=\{\[(\d+)/g)) inlineLayers.push(Number(match[1]));
    }
    expect(inlineLayers.length).toBeGreaterThan(5);
    expect(navigation).toBeGreaterThan(Math.max(...inlineLayers));
  });
});

test('the modal page picker intentionally covers navigation while a page is being selected', () => {
  withShellLayers(z => expect(z('jump')).toBeGreaterThan(z('stepper')));
});

test('map attribution and the reserved speaker dock are outside the transformed stage', () => {
  useSceneStore.getState().setScenes([{ id: 'stack-test', chapter: 0, title: 'Stack test', shot: 'city', script: 'Speaker notes.' }]);
  useUiStore.setState({ scriptOpen: true });
  useDrawerStore.setState({ open: false });
  usePresentationStore.setState({ blank: false });
  const { container, unmount } = render(createElement(Stage, null, createElement('div', null, 'Scene content')));
  const stage = container.querySelector<HTMLElement>('#stage')!;
  expect(stage.style.transform).toContain('scale(');
  expect(stage.contains(screen.getByTestId('map-sources'))).toBe(false);
  expect(stage.contains(screen.getByLabelText('presenter script'))).toBe(false);
  expect(parseFloat(container.querySelector<HTMLElement>('.letterbox')!.style.bottom)).toBeGreaterThan(0);
  unmount();
  useUiStore.setState({ scriptOpen: false });
});
