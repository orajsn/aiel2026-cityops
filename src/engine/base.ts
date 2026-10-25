/**
 * Where the app lives: '/' on this PC, '/aiexperiencelive2026/' on the cloud VM (CITYOPS_BASE, see vite.config.ts
 * and tools/vm-setup.sh). Every file and dev-server endpoint the app asks for goes through here, so the same
 * code works at either address.
 */
const BASE = (import.meta.env?.BASE_URL ?? '/').replace(/^\.\/?$/, '/');

export const at = (path: string) => `${BASE.endsWith('/') ? BASE : `${BASE}/`}${path.replace(/^\//, '')}`;
