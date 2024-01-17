import { Action } from "../Actions/Action";
import { Turn } from "../Turn";

export const EXECUTE_ACTION = "EXECUTE_ACTION";

export class ExecuteActionEvent {
  type: typeof EXECUTE_ACTION = "EXECUTE_ACTION";
  constructor(public action: Action) {}
}
