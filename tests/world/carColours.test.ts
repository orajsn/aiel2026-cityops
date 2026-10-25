import * as THREE from 'three';
import { CAR_COLOURS, carColour } from '../../src/world/Cars';

test('cars come in a real street mix: many colours, mostly white, silver, grey and black', () => {
  expect(new Set(CAR_COLOURS).size).toBeGreaterThanOrEqual(10);
  const picks = Array.from({ length: 400 }, (_, i) => carColour((i + 0.5) / 400));
  expect(new Set(picks).size).toBe(new Set(CAR_COLOURS).size);
  const neutral = picks.filter((h) => new THREE.Color(h).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace).s < 0.15).length;
  expect(neutral / picks.length).toBeGreaterThan(0.5);
});

test('no car is red, pink or orange: red is kept for alerts', () => {
  for (const h of CAR_COLOURS) {
    const c = new THREE.Color(h).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace);
    const deg = c.h * 360;
    if (c.s > 0.25) expect(deg > 40 && deg < 320).toBe(true);
  }
});
