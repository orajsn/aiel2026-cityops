import { registerOverlay } from '../../registry';
import { L1Damage, L1Opening, L1Scattered } from './Lab1Intro';
import { L1App, L1Assistant, L1Specs, L1Suppliers } from './Lab1Data';
import { L1Capture, L1Crack, L1Plan, L1Semantic, L1Vector } from './Lab1Story';
import { L1Recap } from './Lab1Recap';
import { L1Baseline, L1Guardrails, L1Launch, L1Routing, L1SitePhoto } from './Lab1Models';

/** Lab 1's panels (src/scenes/lab1.ts registers them by importing this file) */
// L1Opening, L1Damage and L1Scattered are no longer used by a scene (2 Nov: 1.0 to 1.2 are the story pages below); kept with their tests
registerOverlay('L1Crack', L1Crack);
registerOverlay('L1Plan', L1Plan);
registerOverlay('L1Capture', L1Capture);
registerOverlay('L1Vector', L1Vector);
registerOverlay('L1Semantic', L1Semantic);
registerOverlay('L1Opening', L1Opening);
registerOverlay('L1Damage', L1Damage);
registerOverlay('L1Scattered', L1Scattered);
registerOverlay('L1Assistant', L1Assistant);
registerOverlay('L1App', L1App);
registerOverlay('L1Specs', L1Specs);
registerOverlay('L1Suppliers', L1Suppliers);
registerOverlay('L1Launch', L1Launch);
registerOverlay('L1SitePhoto', L1SitePhoto);
registerOverlay('L1Baseline', L1Baseline);
registerOverlay('L1Routing', L1Routing);
registerOverlay('L1Guardrails', L1Guardrails);
registerOverlay('L1Recap', L1Recap);
