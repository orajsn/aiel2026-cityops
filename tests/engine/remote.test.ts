import { canSaveFrom, TUNNEL_HOSTS } from '../../src/engine/remote';

// saving camera angles writes into the project: only from this PC or the home network, never via the public tunnel
test('saves are allowed from this PC and the home Wi-Fi', () => {
  expect(canSaveFrom({ host: 'localhost:5173' })).toBe(true);
  expect(canSaveFrom({ host: '127.0.0.1:5174' })).toBe(true);
  expect(canSaveFrom({ host: '192.168.1.164:5174' })).toBe(true);
  expect(canSaveFrom({ host: '10.0.0.12:5173' })).toBe(true);
});

test('saves through the Cloudflare tunnel are refused', () => {
  expect(canSaveFrom({ host: 'quiet-river-1234.trycloudflare.com' })).toBe(false);
  // cloudflared forwards with the local Host header but always adds these
  expect(canSaveFrom({ host: 'localhost:5174', 'cf-connecting-ip': '203.0.113.9' })).toBe(false);
  expect(canSaveFrom({ host: 'localhost:5174', 'cf-ray': 'abc' })).toBe(false);
});

// the copy on the cloud VM (jatuponghub) is reached by its DuckDNS name or its public IP: anyone can open those
test('saves through a public name or a public IP are refused', () => {
  expect(canSaveFrom({ host: 'jatuponghub.duckdns.org:5173' })).toBe(false);
  expect(canSaveFrom({ host: '161.118.233.175:5173' })).toBe(false);
  expect(canSaveFrom({ host: 'aielbkk26.aiscloud.app' })).toBe(false);
});

test('the dev server answers the tunnel and DuckDNS names', () => {
  expect(TUNNEL_HOSTS).toEqual(expect.arrayContaining(['.trycloudflare.com', '.duckdns.org', 'aielbkk26.aiscloud.app']));
});
