import { BOARD, BOARD_DEPTH, panelContent, fitShape } from '../../src/world/answerBoard';
import { SHAPE_BOX } from '../../src/world/shapeBoxes';
import { SHOTS } from '../../src/world/shots';
import { projectToScreen } from '../../src/world/frame';

const overlap = (a: (typeof BOARD)[number], b: (typeof BOARD)[number]) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('0.5 shows four panels, clear of the page title, the script bar and each other, with the database between them', () => {
  expect(BOARD.map((p) => p.kind)).toEqual(['table', 'json', 'graph', 'vectors']);
  for (const p of BOARD) {
    expect(p.x0).toBeGreaterThanOrEqual(-0.97);
    expect(p.x1).toBeLessThanOrEqual(0.97);
    expect(p.y1).toBeLessThanOrEqual(0.82); // the page title strip ends at y 0.83
    expect(p.y0).toBeGreaterThanOrEqual(-0.76); // the script bar starts at y -0.78
    expect(Math.min(Math.abs(p.x0), Math.abs(p.x1))).toBeGreaterThanOrEqual(0.2); // the centre column holds the database
  }
  for (let i = 0; i < BOARD.length; i++) for (let j = i + 1; j < BOARD.length; j++) expect(overlap(BOARD[i], BOARD[j])).toBe(false);
});

test('every shape fits inside its panel, below the panel name', () => {
  const cam = SHOTS.sky;
  for (const p of BOARD) {
    const c = panelContent(p);
    const fit = fitShape(p.kind, p);
    const [x0, x1, y0, y1] = SHAPE_BOX[p.kind];
    // the shape's box corners, placed as the board places them, land inside the content area on screen
    for (const [bx, by] of [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ]) {
      const w = fit.toWorld(bx, by);
      const s = projectToScreen(cam.position, cam.target, w);
      expect(s.x).toBeGreaterThanOrEqual(c.x0 - 1e-6);
      expect(s.x).toBeLessThanOrEqual(c.x1 + 1e-6);
      expect(s.y).toBeGreaterThanOrEqual(c.y0 - 1e-6);
      expect(s.y).toBeLessThanOrEqual(c.y1 + 1e-6);
    }
    expect(fit.scale).toBeGreaterThan(0);
  }
  expect(BOARD_DEPTH).toBeGreaterThan(4);
});
