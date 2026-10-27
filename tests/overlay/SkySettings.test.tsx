import { fireEvent, render, screen } from '@testing-library/react';
import { Overlay } from '../../src/overlay/Overlay';
import { useSceneStore } from '../../src/engine/store';
import { useUiStore } from '../../src/engine/ui';
import { THEMES, applyThemeToDocument } from '../../src/world/theme';

beforeEach(() => {
  useSceneStore.getState().setScenes([{ id: 'a', chapter: 0, title: 'A', shot: 'city' }]);
  useSceneStore.getState().setSettled(true);
  useUiStore.getState().setTheme('light');
});

test('Settings in the corner offers three skies, and picking one changes the world', () => {
  render(<Overlay />);
  expect(screen.queryByRole('radio', { name: 'Clear blue' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  expect(screen.getByRole('radio', { name: 'Afternoon' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Night' })).not.toBeChecked();
  fireEvent.click(screen.getByRole('radio', { name: 'Clear blue' }));
  expect(useUiStore.getState().themeName).toBe('clear');
  expect(useUiStore.getState().theme).toBe(THEMES.clear);
  expect(localStorage.getItem('cityops.theme')).toBe('clear');
});

test('the clear sky is blue, and keeps the light panels', () => {
  const c = THEMES.clear;
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  for (const h of [c.skyTop, c.bg]) {
    const [r, , b] = rgb(h);
    expect(b).toBeGreaterThan(r);
  }
  applyThemeToDocument('clear');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  applyThemeToDocument('night');
  expect(document.documentElement.getAttribute('data-theme')).toBe('night');
});

test('the T key goes through all four skies', () => {
  const seen = [useUiStore.getState().themeName];
  for (let i = 0; i < 3; i++) {
    useUiStore.getState().toggleTheme();
    seen.push(useUiStore.getState().themeName);
  }
  expect(seen).toEqual(['light', 'clear', 'night', 'time']);
});
