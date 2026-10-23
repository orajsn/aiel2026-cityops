export type ShotId = string;
export type OverlayKey = string;

export interface HandoffCard {
  run: string;
  expect: string;
  minutes: string;
  /** what to look at when it finishes (the recap) */
  then?: string;
}

export interface RecapRef {
  lab: 'lab2' | 'lab3';
  key: string;
  note: string;
}

export interface SceneDef {
  id: string;
  chapter: 0 | 1 | 2;
  title: string;
  shot: ShotId;
  /** Cut to this shot on entry, then fly to `shot` (used for the opening fly-in). */
  enterFrom?: ShotId;
  world?: Record<string, unknown>;
  overlay?: OverlayKey;
  overlayProps?: Record<string, unknown>;
  card?: HandoffCard;
  recap?: RecapRef;
  recapMode?: boolean;
  /** what the presenter says on this page (shown as a subtitle the presenter can hide) */
  script?: string;
}
