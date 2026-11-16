import { antialiasFor, drawSize, fixedDpr, useGraphicsStore } from '../../src/engine/graphics';

test('auto follows the screen; the presets draw exactly their size on the 1920x1080 stage', () => {
  expect(fixedDpr('auto', { w: 0, h: 0 })).toBeNull();
  expect(drawSize(fixedDpr('fhd', { w: 0, h: 0 })!)).toEqual({ w: 1920, h: 1080 });
  expect(drawSize(fixedDpr('2k', { w: 0, h: 0 })!)).toEqual({ w: 2560, h: 1440 });
  expect(drawSize(fixedDpr('4k', { w: 0, h: 0 })!)).toEqual({ w: 3840, h: 2160 });
});

test('a custom size stays 16:9 and inside 640..7680 wide', () => {
  expect(drawSize(fixedDpr('custom', { w: 3200, h: 1800 })!)).toEqual({ w: 3200, h: 1800 });
  // a size that is not 16:9 fits inside it
  expect(drawSize(fixedDpr('custom', { w: 3840, h: 1080 })!)).toEqual({ w: 1920, h: 1080 });
  expect(drawSize(fixedDpr('custom', { w: 100, h: 50 })!)).toEqual({ w: 640, h: 360 });
  expect(drawSize(fixedDpr('custom', { w: 99999, h: 99999 })!)).toEqual({ w: 7680, h: 4320 });
});

test('the choice is remembered on this device', () => {
  useGraphicsStore.getState().setResolution('4k');
  expect(JSON.parse(localStorage.getItem('cityops.jakarta.v4.resolution')!)).toMatchObject({ resolution: '4k' });
  useGraphicsStore.getState().setCustom({ w: 2880, h: 1620 });
  expect(useGraphicsStore.getState().resolution).toBe('custom');
  expect(JSON.parse(localStorage.getItem('cityops.jakarta.v4.resolution')!)).toEqual({ resolution: 'custom', custom: { w: 2880, h: 1620 } });
});

test('anti-aliasing stays enabled across every accepted Senayan resolution', () => {
  const aa = (r: Parameters<typeof antialiasFor>[0], c = { w: 0, h: 0 }) => antialiasFor(r, c);
  expect(aa('auto')).toBe(true);
  expect(aa('fhd')).toBe(true);
  expect(aa('2k')).toBe(true);
  expect(aa('4k')).toBe(true);
  expect(aa('custom', { w: 2880, h: 1620 })).toBe(true);
  expect(aa('custom', { w: 1600, h: 900 })).toBe(true);
});

test('the frame rate readout is a setting remembered on this device', () => {
  useGraphicsStore.getState().setShowFps(true);
  expect(useGraphicsStore.getState().showFps).toBe(true);
  expect(localStorage.getItem('cityops.fps')).toBe('on');
  useGraphicsStore.getState().setShowFps(false);
});

test('Balanced and High keep distinct drawing and shadow budgets with isolated persistence', async () => {
  const { QUALITY, useQualityStore } = await import('../../src/engine/quality');
  useQualityStore.getState().setPreset('balanced');
  expect(QUALITY.balanced.autoCap).toBe(1);
  expect(QUALITY.balanced.shadowSize).toBe(2048);
  useQualityStore.getState().setPreset('high');
  expect(QUALITY.high.autoCap).toBeCloseTo(4 / 3);
  expect(QUALITY.high.shadowSize).toBe(4096);
  expect(localStorage.getItem('cityops.jakarta.v4.quality')).toBe('high');
  useQualityStore.getState().setPreset('balanced');
});
