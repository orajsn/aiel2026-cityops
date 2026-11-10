import { create } from 'zustand';
import qrcode from 'qrcode-generator';
import { at } from './base';
import { useSceneStore } from './store';
import { useDrawerStore } from './presentation';
import { stepOf, stepScriptId } from '../content/scriptSteps';

/**
 * Phone follow (owner, 3 Nov): the audience opens a page on their phones, types a 6-digit code (or scans the QR) and reads the presenter script of
 * the page on screen, live. This is the presenter's side: Settings › Phone follow asks the relay (follow/server.mjs) for a code, then
 * tells it the page id on every page change. It is optional: with no network the show works exactly as before, only the sync is off.
 * The code and the presenter token live in this tab's sessionStorage so a refresh keeps the session going.
 */
const KEY = 'cityops.follow';
type Status = 'off' | 'starting' | 'on' | 'error';
interface FollowState {
  status: Status;
  code: string;
  token: string;
  listeners: number;
  /** the big join card over the stage, for the audience to scan */
  card: boolean;
  start(): Promise<void>;
  stop(): Promise<void>;
  showCard(on: boolean): void;
}

const saved = (): { code: string; token: string } | null => {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    return v?.code && v?.token ? v : null;
  } catch {
    return null;
  }
};

/** the address phones open: the follow app next to this one, with the code in it */
export const joinUrl = (code: string) => `${location.origin}${at('follow/')}?c=${code}`;

/** the QR of an address as an SVG path string (cells as squares, one path) */
export function qrPath(text: string): { d: string; n: number } {
  const q = qrcode(0, 'M');
  q.addData(text);
  q.make();
  const n = q.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return { d, n };
}

let unsub: (() => void) | null = null;
let last = '';

async function post(code: string, token: string, id: string): Promise<number | null> {
  try {
    const r = await fetch(at(`follow/api/s/${code}/state`), { method: 'POST', headers: { 'x-token': token }, body: JSON.stringify({ id }) });
    if (!r.ok) return null;
    return (await r.json()).listeners ?? 0;
  } catch {
    return null;
  }
}

export const useFollowStore = create<FollowState>((set, get) => {
  const run = (code: string, token: string) => {
    unsub?.();
    last = '';
    const send = async () => {
      const page = useSceneStore.getState().current().id;
      const d = useDrawerStore.getState();
      // a page with one script per click tells the phones which click it is on
      const id = page && stepScriptId(page, stepOf(page, d.open, d.focus));
      if (!id || id === last) return;
      last = id;
      const n = await post(code, token, id);
      if (n === null) {
        last = '';
        set({ status: 'error' });
      } else set({ status: 'on', listeners: n });
    };
    const unDrawer = useDrawerStore.subscribe(() => void send());
    const unScene = useSceneStore.subscribe(() => void send());
    unsub = () => (unDrawer(), unScene());
    void send();
  };
  const saved0 = typeof sessionStorage === 'undefined' ? null : saved();
  if (saved0 && typeof window !== 'undefined') queueMicrotask(() => { set({ status: 'on', code: saved0.code, token: saved0.token }); run(saved0.code, saved0.token); });
  return {
    status: 'off',
    code: '',
    token: '',
    listeners: 0,
    card: false,
    async start() {
      set({ status: 'starting' });
      try {
        const r = await fetch(at('follow/api/create'), { method: 'POST' });
        if (!r.ok) throw new Error(String(r.status));
        const { code, token } = await r.json();
        try {
          sessionStorage.setItem(KEY, JSON.stringify({ code, token }));
        } catch {
          /* storage blocked */
        }
        set({ status: 'on', code, token, listeners: 0, card: true });
        run(code, token);
      } catch {
        set({ status: 'error' });
      }
    },
    async stop() {
      const { code, token } = get();
      unsub?.();
      unsub = null;
      try {
        sessionStorage.removeItem(KEY);
      } catch {
        /* storage blocked */
      }
      if (code) await fetch(at(`follow/api/s/${code}/end`), { method: 'POST', headers: { 'x-token': token } }).catch(() => undefined);
      set({ status: 'off', code: '', token: '', listeners: 0, card: false });
    },
    showCard: (card) => set({ card }),
  };
});
