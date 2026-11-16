import { frameCityScore, frameCorners, projectToScreen } from '../../src/world/frame';
import { SHOTS, interpolateShot } from '../../src/world/shots';
import { SCENES } from '../../src/scenes/index';
import { senayanEdgeVisibility } from '../../src/world/senayanBounds';
import DATA from '../../src/world/senayanData';
import { shotForScene, type SavedAngle } from '../../src/engine/camera';
import senayanAngles from '../../src/content/senayanCameraOverrides.json';
const angles = senayanAngles as unknown as Record<string, SavedAngle>;
const activeShot = (scene: (typeof SCENES)[number]) => shotForScene(scene, angles);
const isCutaway = (shot: string) => shot.startsWith('pier');
const geographicOverviews = new Set(['0.0', '0.1', '0.2']);

// the database scenes (0.5, 0.6) are a separate diorama under the city, waiting for the owner's rework
const isCity = (shot: string) => !shot.startsWith('core-') && shot !== 'vector-field';
// the sky stage is meant to be seen from the side, so the haze shows above it (owner, 24 Oct)
const mustHideSky = (shot: string) => isCity(shot) && !shot.startsWith('sky') && !isCutaway(shot);

test('frame maths: a camera looking straight down sees ground at all four corners, one looking level sees sky', () => {
  expect(frameCorners([-57, 30, -54], [-57, 0, -54.01]).every(Boolean)).toBe(true);
  expect(frameCorners([-57, 5, -54], [-57, 5, -80]).filter((c) => c === null)).toHaveLength(2);
  expect(projectToScreen([0, 10, 10], [0, 0, 0], [0, 0, 0]).x).toBeCloseTo(0, 6);
});

// the owner's rule: never see the sky or where the city ends
test('every neighbourhood and bridge overview frames the sourced Senayan district', () => {
  const bad = SCENES.filter((s) => mustHideSky(s.shot) && !geographicOverviews.has(s.id))
    .map((s) => ({ id: s.id, score: frameCityScore(activeShot(s).position, activeShot(s).target) }))
    .filter((r) => r.score < 0.97);
  expect(bad).toEqual([]);
});

// The accepted Senayan opening deliberately includes the district's horizon/outer context.
// Its guarantee is source-grounded venues in frame, not an invented map beyond the source extent.
test('Senayan opening overviews keep Fairmont, Sentral Senayan I and GBK visible and source-grounded', () => {
  const required = [
    { id: 'relation/14717268', height: 6.3 },
    { id: 'way/162174048', height: 3.9 },
    { id: 'way/682984153', height: 1.3 },
  ];
  const anchors = required.map(({ id }) => DATA.landmarks[id].center);
  for (const scene of SCENES.filter((scene) => geographicOverviews.has(scene.id))) {
    const shot = activeShot(scene);
    expect(senayanEdgeVisibility(shot.target[0], shot.target[2])).toBe(1);
    expect(shot.target[0]).toBeGreaterThanOrEqual(Math.min(...anchors.map(([x]) => x)));
    expect(shot.target[0]).toBeLessThanOrEqual(Math.max(...anchors.map(([x]) => x)));
    expect(shot.target[2]).toBeGreaterThanOrEqual(Math.min(...anchors.map(([, z]) => z)));
    expect(shot.target[2]).toBeLessThanOrEqual(Math.max(...anchors.map(([, z]) => z)));
    expect(shot.position[1]).toBeGreaterThan(13.2); // clears the interpreted hotel crown
    for (const { id, height } of required) {
      const [x, z] = DATA.landmarks[id].center;
      expect(senayanEdgeVisibility(x, z)).toBe(1);
      const p = projectToScreen(shot.position, shot.target, [x, height, z]);
      expect(p.front).toBe(true);
      expect(Math.abs(p.x)).toBeLessThan(0.85);
      expect(Math.abs(p.y)).toBeLessThan(0.8);
    }
  }
});

test('push-ins stay on the mapped district, with horizon allowed only in explicit inspection cutaways', () => {
  const bad: string[] = [];
  for (const [id, sh] of Object.entries(SHOTS)) {
    if (!sh.push) continue;
    for (const t of [0.25, 0.5, 0.75, 1]) {
      const m = interpolateShot(sh, { ...sh.push, durationMs: 1 } as typeof sh, t);
      const score = isCutaway(id) ? senayanEdgeVisibility(m.target[0], m.target[2]) : frameCityScore(m.position, m.target);
      if (score < 0.97) bad.push(`${id} at ${t}`);
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

test('the camera only moves when the story changes place: five places and the sky stage, at most 27 city moves', () => {
  const places = new Set(SCENES.filter((s) => isCity(s.shot)).map((s) => s.shot));
  // only the owner's places (pier3, the crack's close-up, is free since Lab 2 tells the crack in its panel)
  for (const p of places) expect(['bridge', 'city', 'ops', 'pier2', 'pier2-close', 'pier2-inspect', 'pier3', 'sky', 'sky-model', 'sky-v1', 'sky-v2', 'sky-v3', 'sky-v4', 'sky-s1', 'sky-s2', 'sky-s3', 'sky-s4']).toContain(p);
  let moves = 0;
  SCENES.forEach((s, i) => {
    if (i > 0 && SCENES[i - 1].shot !== s.shot && isCity(s.shot) && isCity(SCENES[i - 1].shot)) moves++;
  });
  // 17: the push-in on the bare model (Lab 2 page 1, owner) and back out for the database
  // 27: Lab 1's 4a and 4b move the camera at every click (owner, 2 Nov)
  expect(moves).toBeLessThanOrEqual(27);
});

test('every page at the Ops Center shows the control room; sky pages name the Ops Center below', () => {
  const w = (s: (typeof SCENES)[number]) => (s.world ?? {}) as { ops?: boolean; highlight?: string[] };
  expect(SCENES.filter((s) => s.shot === 'ops' && !w(s).ops).map((s) => s.id)).toEqual([]);
  expect(SCENES.filter((s) => s.shot !== 'ops' && w(s).ops).map((s) => s.id)).toEqual([]);
  // the board pages (0.5, 2.5, 2.6 and their steps) are the exception: the name would sit under the script bar, and on 0.5 pins rising in the camera's path got in the way
  // Lab 2's workbench, tools and query pages keep their boards (0.5x, 2.5x, 2.6x)
  expect(SCENES.filter((s) => s.shot === 'sky' && !/^(0\.5|2\.5|2\.6)/.test(s.id) && !(w(s).highlight ?? []).includes('City Operations Control Center')).map((s) => s.id)).toEqual([]);
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
