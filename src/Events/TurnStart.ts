import { Turn } from "../Turn";

export const TURN_START = "TURN_START"

export type TurnStartEvent = {
  type: typeof TURN_START;
  turn: Turn
}
