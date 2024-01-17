import { Turn } from "../Turn";

export const COLLECT_ACTIONS = "COLLECT_ACTIONS";

export class CollectActionsEvent {
  type: typeof COLLECT_ACTIONS = COLLECT_ACTIONS;
  constructor(public turn: Turn) {}
}
