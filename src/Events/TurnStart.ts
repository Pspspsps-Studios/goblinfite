import { Turn } from "../Turn";

export const TURN_START = "TURN_START";

export class TurnStartEvent {
  type: typeof TURN_START = TURN_START;
  constructor(public turn: Turn) {}
}
