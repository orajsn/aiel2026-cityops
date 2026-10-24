import { canSaveFrom } from '../../src/engine/remote';

// saving camera angles writes into the project: only from this PC or the home network, never via the public tunnel
test('saves are allowed from this PC and the home Wi-Fi', () => {
  expect(canSaveFrom({ host: 'localhost:5173' })).toBe(true);
  expect(canSaveFrom({ host: '192.168.1.164:5174' })).toBe(true);
});

test('saves through the Cloudflare tunnel are refused', () => {
  expect(canSaveFrom({ host: 'quiet-river-1234.trycloudflare.com' })).toBe(false);
  // cloudflared forwards with the local Host header but always adds these
  expect(canSaveFrom({ host: 'localhost:5174', 'cf-connecting-ip': '203.0.113.9' })).toBe(false);
  expect(canSaveFrom({ host: 'localhost:5174', 'cf-ray': 'abc' })).toBe(false);
});
