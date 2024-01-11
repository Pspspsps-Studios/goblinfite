import { Turn } from "../Turn"

export const SELECT_ACTION = "SELECT_ACTION"

export class SelectActionEvent {
  type: typeof SELECT_ACTION = SELECT_ACTION
  constructor(public turn: Turn) {}
}
