import { registerOverlay } from '../../registry';
import { AgentSees, BareModel, CrackStory, ModelAwake, WhyData, Workbench } from './Lab2Opening';
import { Checkable, Embed, Nearest, NotAJob, Plumbing, RagIdea, Rule } from './Lab2Rag';
import { Chief, Conveyor, Order, Station1, Station3, ThreeWays, WhoPicks } from './Lab2Workflow';
import { Allowlist, FirstRun, Instruments, MainInstrument, Manual, OneBrief, OneQuery, StateGraph, StoreSaver, ThreeLayers, Toolkit, TwoMemories, Wipe, WrongDrawer } from './Lab2Agent';
import { Dashboard, Observability, PickTool, ThreeRisks } from './Lab2Trust';

/** Lab 2's panels (src/scenes/chapter1.ts registers them by importing this file) */
export const LAB2_OVERLAYS = {
  L2Story: CrackStory,
  L2Why: WhyData,
  L2Bare: BareModel,
  L2Bench: Workbench,
  L2Sees: AgentSees,
  L2Awake: ModelAwake,
  L2Rag: RagIdea,
  L2Embed: Embed,
  L2Nearest: Nearest,
  L2Rule: Rule,
  L2Plumbing: Plumbing,
  L2Check: Checkable,
  L2Job: NotAJob,
  L2Pen: WhoPicks,
  L2Conveyor: Conveyor,
  L2Station1: Station1,
  L2Station3: Station3,
  L2Order: Order,
  L2Chief: Chief,
  L2Ways: ThreeWays,
  L2Toolkit: Toolkit,
  L2Instruments: Instruments,
  L2Manual: Manual,
  L2OneQuery: OneQuery,
  L2Brief: OneBrief,
  L2Main: MainInstrument,
  L2Graph: StateGraph,
  L2Memories: TwoMemories,
  L2Wipe: Wipe,
  L2StoreSaver: StoreSaver,
  L2Allowlist: Allowlist,
  L2Layers: ThreeLayers,
  L2FirstRun: FirstRun,
  L2Drawer: WrongDrawer,
  L2Risks: ThreeRisks,
  L2Observe: Observability,
  L2Dashboard: Dashboard,
  L2Pick: PickTool,
} as const;

for (const [k, c] of Object.entries(LAB2_OVERLAYS)) registerOverlay(k, c);
