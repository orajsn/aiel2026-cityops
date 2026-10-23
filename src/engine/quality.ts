export type Quality = 'high' | 'low';

const KEY = 'cityops.quality';

export function quality(): Quality {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'low' ? 'low' : 'high';
  } catch {
    return 'high';
  }
}

export function setQuality(q: Quality): void {
  try {
    window.localStorage.setItem(KEY, q);
  } catch {
    /* storage blocked: stay on the default */
  }
}
