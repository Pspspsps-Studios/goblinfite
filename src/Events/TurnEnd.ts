import { Turn } from "../Turn";

export const TURN_END = "TURN_END";

export class TurnEndEvent {
  type: typeof TURN_END = TURN_END;
  constructor(public turn: Turn) {
  }
}
