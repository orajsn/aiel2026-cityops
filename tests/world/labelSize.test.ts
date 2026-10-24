import { labelLayout, MAX_LABEL_PX, MIN_LABEL_PX } from '../../src/world/DataShapes';

const px = (l: { worldHeight: number }, distance: number) => l.worldHeight / ((2 * distance * Math.tan((22.5 * Math.PI) / 180)) / 1080);

test('a label fills the space its shape gives it', () => {
  // designed 0.1 tall, shape at scale 1, seen from a distance where 0.1 is ~40 px
  const d = 0.1 / ((40 * 2 * Math.tan((22.5 * Math.PI) / 180)) / 1080);
  const l = labelLayout({ designSize: 0.1, parentScale: 1, distance: d, fovDeg: 45 });
  expect(px(l, d)).toBeCloseTo(40, 3);
  expect(l.visible).toBe(true);
});

test('never smaller than 20 px: a little small grows to 20, much too small hides (it would overlap)', () => {
  expect(MIN_LABEL_PX).toBe(20);
  const d = (s: number) => s / ((16 * 2 * Math.tan((22.5 * Math.PI) / 180)) / 1080); // where it would be 16 px
  const grown = labelLayout({ designSize: 0.1, parentScale: 1, distance: d(0.1), fovDeg: 45 });
  expect(px(grown, d(0.1))).toBeCloseTo(20, 3);
  expect(grown.visible).toBe(true);
  expect(labelLayout({ designSize: 0.1, parentScale: 0.2, distance: d(0.1), fovDeg: 45 }).visible).toBe(false);
});

test(`never larger than ${MAX_LABEL_PX} px`, () => {
  const l = labelLayout({ designSize: 1, parentScale: 1, distance: 1, fovDeg: 45 });
  expect(px(l, 1)).toBeCloseTo(MAX_LABEL_PX, 3);
});
