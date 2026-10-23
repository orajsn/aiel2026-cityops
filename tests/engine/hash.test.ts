import { hashToIndex, indexToHash } from '../../src/engine/hash';
import type { SceneDef } from '../../src/engine/types';

const s: SceneDef[] = [
  { id: 'a', chapter: 0, title: 'A', shot: 'city-high' },
  { id: 'b', chapter: 0, title: 'B', shot: 'city-high' },
];

test('hashToIndex finds a known scene', () => {
  expect(hashToIndex('#scene=b', s)).toBe(1);
});

test('hashToIndex empty hash lands on the first scene', () => {
  expect(hashToIndex('', s)).toBe(0);
});

test('hashToIndex unknown scene lands on the first scene', () => {
  expect(hashToIndex('#scene=zzz', s)).toBe(0);
});

test('indexToHash builds the hash', () => {
  expect(indexToHash(1, s)).toBe('#scene=b');
});
