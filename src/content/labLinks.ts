/**
 * The link the audience opens to start each lab (owner, 4 Nov), shown as a card with a QR on the lab's first page: Lab 1 on 1.0, Lab 2 on 0.4,
 * and Lab 3 on 3.0 (Lab 3 uses Lab 2's link).
 */
export const LAB_LINKS: Record<string, { label: string; url: string }> = {
  '1.0': { label: 'Lab 1', url: 'https://aiscloud.app/aielbkk26-lab1' },
  '0.4': { label: 'Lab 2', url: 'https://aiscloud.app/aielbkk26-lab2' },
  '3.0': { label: 'Lab 3', url: 'https://aiscloud.app/aielbkk26-lab2' },
};
