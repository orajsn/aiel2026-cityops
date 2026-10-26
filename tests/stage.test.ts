import { describe, expect, it } from 'vitest';
import { MAX_DPR, renderDpr } from '../src/Stage';

describe('renderDpr', () => {
  it('draws the projector at 1920x1080', () => {
    expect(renderDpr(1920, 1080, 1) * 1920).toBe(1920);
  });
  it('draws a small laptop at its own size, not the full stage', () => {
    expect(renderDpr(1366, 768, 1) * 1920).toBeCloseTo(1365.3, 1);
  });
  it('uses a sharp screen up to the cap', () => {
    expect(renderDpr(1440, 900, 2)).toBe(MAX_DPR);
    expect(renderDpr(1280, 720, 1.5)).toBe(1);
  });
});
