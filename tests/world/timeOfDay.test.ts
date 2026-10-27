import * as THREE from 'three';
import { EVENING, MORNING, showTime, skyAt } from '../../src/world/timeOfDay';
import { SKIES, THEMES, storedTheme } from '../../src/world/theme';

const hex = (c: THREE.Color) => '#' + c.getHexString();
const hue = (h: string) => new THREE.Color(h).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace).h * 360;

test('the show runs from morning (first page) through the afternoon to evening (last page)', () => {
  expect(showTime(0, 47)).toBe(0);
  expect(showTime(23, 47)).toBe(0.5);
  expect(showTime(46, 47)).toBe(1);
  expect(hex(skyAt(0).skyTop)).toBe(MORNING.skyTop.toLowerCase());
  expect(hex(skyAt(0.5).sun)).toBe(THEMES.light.sun.toLowerCase());
  expect(hex(skyAt(1).skyHorizon)).toBe(EVENING.skyHorizon.toLowerCase());
  expect(skyAt(0.5).sunIntensity).toBeCloseTo(THEMES.light.sunIntensity);
});

test('the sun crosses the sky: from the east in the morning to low in the west in the evening', () => {
  const xs = [0, 0.25, 0.5, 0.75, 1].map((t) => skyAt(t).sunPos.x);
  expect(xs[0]).toBeGreaterThan(0);
  expect(xs[4]).toBeLessThan(0);
  for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeLessThan(xs[i - 1]);
  expect(skyAt(1).sunPos.y).toBeLessThan(skyAt(0.5).sunPos.y);
});

test('the evening glow is amber, never Oracle Red, so the one red alert still stands out', () => {
  for (const c of [EVENING.sun, EVENING.skyHorizon, EVENING.bg]) {
    expect(hue(c)).toBeGreaterThan(20);
    expect(hue(c)).toBeLessThan(45);
  }
  expect(hue(THEMES.light.red)).toBeLessThan(15);
});

test('Time of day is a fourth sky in Settings, remembered like the others', () => {
  expect(SKIES.map((k) => k.id)).toEqual(['light', 'clear', 'night', 'time']);
  expect(SKIES.find((k) => k.id === 'time')!.label).toBe('Time of day');
  localStorage.setItem('cityops.theme', 'time');
  expect(storedTheme()).toBe('time');
  localStorage.removeItem('cityops.theme');
});
