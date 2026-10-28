import { registerOverlay } from '../../registry';
import { L1Damage, L1Opening, L1Scattered } from './Lab1Intro';
import { L1Assistant, L1Contractors, L1Specs } from './Lab1Data';
import { L1Guardrails, L1Routing, L1SitePhoto } from './Lab1Models';

/** Lab 1's panels (src/scenes/lab1.ts registers them by importing this file) */
registerOverlay('L1Opening', L1Opening);
registerOverlay('L1Damage', L1Damage);
registerOverlay('L1Scattered', L1Scattered);
registerOverlay('L1Assistant', L1Assistant);
registerOverlay('L1Specs', L1Specs);
registerOverlay('L1Contractors', L1Contractors);
registerOverlay('L1SitePhoto', L1SitePhoto);
registerOverlay('L1Routing', L1Routing);
registerOverlay('L1Guardrails', L1Guardrails);
