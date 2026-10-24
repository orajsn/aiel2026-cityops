import { CALM, SHOTS, interpolateShot, moveDuration, type Shot, type Vec3 } from '../../src/world/shots';
import { SCENES } from '../../src/scenes/index';

type V = Vec3;
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a: V) => Math.hypot(...a);
const norm = (a: V): V => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** the worst moment of a move: sideways flow of the scene (rad/s), zoom speed (e-folds/s), view turn (deg/s) */
function motion(from: Shot, to: Shot) {
  const ms = moveDuration(from, to);
  const N = 240;
  let flow = 0;
  let zoom = 0;
  let turn = 0;
  let prev = interpolateShot(from, to, 0);
  for (let i = 1; i <= N; i++) {
    const p = interpolateShot(from, to, i / N);
    const dt = ms / N / 1000;
    const dv = sub(p.target, p.position);
    const d = len(dv);
    const pv = sub(prev.target, prev.position);
    const mv = sub(p.position, prev.position);
    const dir = norm(dv);
    const along = mv[0] * dir[0] + mv[1] * dir[1] + mv[2] * dir[2];
    flow = Math.max(flow, len(sub(mv, [dir[0] * along, dir[1] * along, dir[2] * along])) / d / dt);
    zoom = Math.max(zoom, Math.abs(Math.log(d / len(pv))) / dt);
    const c = (dv[0] * pv[0] + dv[1] * pv[1] + dv[2] * pv[2]) / (d * len(pv));
    turn = Math.max(turn, ((Math.acos(Math.min(1, c)) * 180) / Math.PI) / dt);
    prev = p;
  }
  return { flow, zoom, turn, ms };
}

/** where the camera really is when the next page starts: the end of a push-in, if the shot has one */
const settled = (s: Shot): Shot => (s.push ? { ...s, position: s.push.position, target: s.push.target } : s);

// the owner found the bridge <-> Ops Center moves dizzying: the ground slid past at 4-8 camera heights per second
test('no page change makes the ground rush past or the view whip round', () => {
  const bad: string[] = [];
  SCENES.forEach((s, i) => {
    if (i === 0) return;
    const a = SCENES[i - 1].shot;
    if (a === s.shot) return;
    const m = motion(settled(SHOTS[a]), SHOTS[s.shot]);
    const slack = 1.08; // the 240-sample measure is finer than the 80-sample one the duration uses
    if (m.flow > CALM.flow * slack || m.zoom > CALM.zoom * slack || m.turn > CALM.turnDeg * slack)
      bad.push(`${SCENES[i - 1].id}>${s.id} (${a}>${s.shot}) flow ${m.flow.toFixed(2)} zoom ${m.zoom.toFixed(2)} turn ${m.turn.toFixed(0)} in ${m.ms} ms`);
  });
  expect(bad).toEqual([]);
});

test('long moves take longer than short ones, within 1.4 to 6 seconds', () => {
  const short = moveDuration(SHOTS.pier3, SHOTS['pier2-inspect']);
  const long = moveDuration(settled(SHOTS.pier3), SHOTS.ops);
  expect(long).toBeGreaterThan(short);
  for (const d of [short, long]) {
    expect(d).toBeGreaterThanOrEqual(1400);
    expect(d).toBeLessThanOrEqual(6000);
  }
});
