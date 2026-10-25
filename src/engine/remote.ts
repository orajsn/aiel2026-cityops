/**
 * Remote viewing goes through public links: a Cloudflare quick tunnel to this PC, and the copy on the cloud VM
 * (jatuponghub.duckdns.org, or its bare public IP). Anyone with such a link can open the page, so writes into
 * the project (Camera mode saves) only come from the machine itself or a private network address.
 * cloudflared keeps the local Host header but always adds its own cf-* headers.
 */
export function canSaveFrom(headers: Record<string, string | string[] | undefined>): boolean {
  if (headers['cf-connecting-ip'] || headers['cf-ray']) return false;
  const host = String(headers.host ?? '')
    .toLowerCase()
    .replace(/:\d+$/, '');
  if (host === 'localhost' || host === '[::1]') return true;
  const ip = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)?.slice(1).map(Number);
  if (!ip) return false;
  const [a, b] = ip;
  return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

/** host names the dev server answers besides localhost and IP addresses */
export const TUNNEL_HOSTS = ['.trycloudflare.com', '.duckdns.org'];
