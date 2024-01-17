import { Turn } from "../Turn";

export const SELECT_TARGETS = "SELECT_TARGETS";

export class SelectTargetsEvent {
  type: typeof SELECT_TARGETS = SELECT_TARGETS;
  constructor(public turn: Turn) {}
}
