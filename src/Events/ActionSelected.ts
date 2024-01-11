import { Action } from "../Actions/Action";

export const ACTION_SELECTED = "ACTION_SELECTED"

export class ActionSelectedEvent {
  type: typeof ACTION_SELECTED = ACTION_SELECTED;
  constructor(public action: Action) {}
}
