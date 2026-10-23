import type { ComponentType } from 'react';
import type { OverlayKey } from '../engine/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OVERLAYS: Record<OverlayKey, ComponentType<any>> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerOverlay(key: OverlayKey, component: ComponentType<any>): void {
  OVERLAYS[key] = component;
}
