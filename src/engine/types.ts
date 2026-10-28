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
  /** the part: 0 Introduction, 1 Lab 2, 2 Lab 3, 3 Lab 1 (played between the Introduction and Lab 2: PARTS) */
  chapter: 0 | 1 | 2 | 3;
  title: string;
  shot: ShotId;
  /** Cut to this shot on entry, then fly to `shot` (used for the opening fly-in). */
  enterFrom?: ShotId;
  /** shown as page 0 of its part, before page 1 (the Introduction's opening view); the pages after keep their numbers */
  pageZero?: boolean;
  world?: Record<string, unknown>;
  overlay?: OverlayKey;
  overlayProps?: Record<string, unknown>;
  /**
   * Pages in a row with the same group keep one panel on screen and only pass it new props (a diagram
   * that builds up click by click), instead of fading the panel out and in on every page.
   */
  overlayGroup?: string;
  card?: HandoffCard;
  recap?: RecapRef;
  recapMode?: boolean;
  /** what the presenter says on this page (shown as a subtitle the presenter can hide) */
  script?: string;
}
