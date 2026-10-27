import { drawSize, fixedDpr, useGraphicsStore } from '../../src/engine/graphics';

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
  expect(JSON.parse(localStorage.getItem('cityops.resolution')!)).toMatchObject({ resolution: '4k' });
  useGraphicsStore.getState().setCustom({ w: 2880, h: 1620 });
  expect(useGraphicsStore.getState().resolution).toBe('custom');
  expect(JSON.parse(localStorage.getItem('cityops.resolution')!)).toEqual({ resolution: 'custom', custom: { w: 2880, h: 1620 } });
});
