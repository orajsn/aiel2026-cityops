/**
 * Remote viewing goes through a Cloudflare quick tunnel (a public link). Anyone with that link can
 * open the page, so writes into the project (Camera mode saves) only come from this PC or the home
 * network. cloudflared keeps the local Host header but always adds its own cf-* headers.
 */
export function canSaveFrom(headers: Record<string, string | string[] | undefined>): boolean {
  if (headers['cf-connecting-ip'] || headers['cf-ray']) return false;
  const host = String(headers.host ?? '').toLowerCase();
  return !host.endsWith('.trycloudflare.com');
}

/** host names the dev server answers besides localhost and the LAN IP */
export const TUNNEL_HOSTS = ['.trycloudflare.com'];
