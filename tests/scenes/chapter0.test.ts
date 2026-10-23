import { chapter0 } from '../../src/scenes/chapter0';
import { SCENES } from '../../src/scenes/index';
import { SHOTS } from '../../src/world/shots';
import { OVERLAYS } from '../../src/overlay/registry';

test('chapter 0 scenes are 0.x, start at 0.1 and end at 0.7', () => {
  expect(chapter0[0].id).toBe('0.1');
  expect(chapter0[chapter0.length - 1].id).toBe('0.7');
  for (const s of chapter0) {
    expect(s.id.startsWith('0.')).toBe(true);
    expect(s.chapter).toBe(0);
  }
});

test('every shot and overlay referenced by chapter 0 exists', () => {
  for (const s of chapter0) {
    expect(SHOTS[s.shot]).toBeDefined();
    if (s.enterFrom) expect(SHOTS[s.enterFrom]).toBeDefined();
    if (s.overlay) expect(OVERLAYS[s.overlay]).toBeDefined();
  }
});

test('the core dive has four face sub-scenes', () => {
  const faces = chapter0.filter((s) => s.id.startsWith('0.5') && s.id !== '0.5').map((s) => s.world?.core);
  expect(faces).toEqual(['tables', 'json', 'graph', 'vectors']);
});

test('the recap subset is marked', () => {
  expect(chapter0.filter((s) => s.recapMode).map((s) => s.id)).toEqual(['0.1', '0.5', '0.7']);
});

test('SCENES starts with chapter 0', () => {
  expect(SCENES[0].id).toBe('0.1');
});

test('0.3 frames the place the document flow lands', async () => {
  const { assetPosition } = await import('../../src/content/geo');
  const s = chapter0.find((x) => x.id === '0.3')!;
  const shot = SHOTS[s.shot];
  const ops = assetPosition('City Operations Control Center');
  // the Ops Center is in front of the camera and within ~25 degrees of where it looks
  const look = [shot.target[0] - shot.position[0], shot.target[2] - shot.position[2]];
  const toOps = [ops.x - shot.position[0], ops.z - shot.position[2]];
  const cos = (look[0] * toOps[0] + look[1] * toOps[1]) / (Math.hypot(...look) * Math.hypot(...toOps));
  expect(cos).toBeGreaterThan(Math.cos((25 * Math.PI) / 180));
  expect((s.world as { highlight?: string[] }).highlight).toContain('City Operations Control Center');
});
