import { frameCityScore, frameCorners, projectToScreen } from '../../src/world/frame';
import { SHOTS, interpolateShot } from '../../src/world/shots';
import { SCENES } from '../../src/scenes/index';

// the database scenes (0.5, 0.6) are a separate diorama under the city, waiting for the owner's rework
const isCity = (shot: string) => !shot.startsWith('core-') && shot !== 'vector-field';
// the sky stage is meant to be seen from the side, so the haze shows above it (owner, 24 Oct)
const mustHideSky = (shot: string) => isCity(shot) && shot !== 'sky';

test('frame maths: a camera looking straight down sees ground at all four corners, one looking level sees sky', () => {
  expect(frameCorners([-57, 30, -54], [-57, 0, -54.01]).every(Boolean)).toBe(true);
  expect(frameCorners([-57, 5, -54], [-57, 5, -80]).filter((c) => c === null)).toHaveLength(2);
  expect(projectToScreen([0, 10, 10], [0, 0, 0], [0, 0, 0]).x).toBeCloseTo(0, 6);
});

// the owner's rule: never see the sky or where the city ends
test('every city page frames only the city: no sky, no map edge', () => {
  const bad = SCENES.filter((s) => mustHideSky(s.shot))
    .map((s) => ({ id: s.id, score: frameCityScore(SHOTS[s.shot].position, SHOTS[s.shot].target) }))
    .filter((r) => r.score < 0.97);
  expect(bad).toEqual([]);
});

test('the slow push-ins after arriving also show only city, the whole way in', () => {
  const bad: string[] = [];
  for (const [id, sh] of Object.entries(SHOTS)) {
    if (!sh.push) continue;
    for (const t of [0.25, 0.5, 0.75, 1]) {
      const m = interpolateShot(sh, { ...sh.push, durationMs: 1 } as typeof sh, t);
      if (frameCityScore(m.position, m.target) < 0.97) bad.push(`${id} at ${t}`);
    }
  }
  expect(bad).toEqual([]);
});

test('every camera move between city pages stays on the city the whole way', () => {
  const bad: string[] = [];
  SCENES.forEach((s, i) => {
    const from = i === 0 ? s.enterFrom : SCENES[i - 1].shot;
    if (!from || !mustHideSky(from) || !mustHideSky(s.shot)) return;
    if (i === 0) {
      const a = SHOTS[from];
      if (frameCityScore(a.position, a.target) < 0.97) bad.push(`${s.id} start`);
    }
    for (const t of [0.2, 0.4, 0.6, 0.8]) {
      const m = interpolateShot(SHOTS[from], SHOTS[s.shot], t);
      if (frameCityScore(m.position, m.target) < 0.97) bad.push(`${s.id} at ${t}`);
    }
  });
  expect(bad).toEqual([]);
});

test('on pages with the right-hand panel, the place the page is about sits left of the panel', () => {
  const bad = SCENES.filter((s) => s.overlay === 'Beat' && SHOTS[s.shot].subject)
    .map((s) => ({ id: s.id, ...projectToScreen(SHOTS[s.shot].position, SHOTS[s.shot].target, SHOTS[s.shot].subject!) }))
    .filter((p) => !p.front || p.x > 0.1 || p.x < -0.85 || p.y > 0.6 || p.y < -0.7); // the script bar covers y < -0.78
  expect(bad).toEqual([]);
});

test('the camera only moves when the story changes place: five places and the sky stage, at most 16 city moves in 38 pages', () => {
  const places = new Set(SCENES.filter((s) => isCity(s.shot)).map((s) => s.shot));
  expect([...places].sort()).toEqual(['bridge', 'city', 'ops', 'pier2', 'pier2-inspect', 'pier3', 'sky']);
  let moves = 0;
  SCENES.forEach((s, i) => {
    if (i > 0 && SCENES[i - 1].shot !== s.shot && isCity(s.shot) && isCity(SCENES[i - 1].shot)) moves++;
  });
  expect(moves).toBeLessThanOrEqual(16);
});

test('every page at the Ops Center shows the control room; sky pages name the Ops Center below', () => {
  const w = (s: (typeof SCENES)[number]) => (s.world ?? {}) as { ops?: boolean; highlight?: string[] };
  expect(SCENES.filter((s) => s.shot === 'ops' && !w(s).ops).map((s) => s.id)).toEqual([]);
  expect(SCENES.filter((s) => s.shot !== 'ops' && w(s).ops).map((s) => s.id)).toEqual([]);
  expect(SCENES.filter((s) => s.shot === 'sky' && !(w(s).highlight ?? []).includes('City Operations Control Center')).map((s) => s.id)).toEqual([]);
});

test('screenPoint is the inverse of projectToScreen', async () => {
  const { screenPoint } = await import('../../src/world/frame');
  const pos: [number, number, number] = [3, 4, 5];
  const tgt: [number, number, number] = [0, 0, 0];
  const p = screenPoint(pos, tgt, 0.4, -0.3, 2);
  const s = projectToScreen(pos, tgt, p);
  expect(s.x).toBeCloseTo(0.4, 6);
  expect(s.y).toBeCloseTo(-0.3, 6);
});
