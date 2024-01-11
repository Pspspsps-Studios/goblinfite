import { Action } from "./Actions/Action"
import { Actor } from "./Actor"
import { CombatEncounter } from "./combatLoop"

export type TurnState = "begin" | "ready" | "selectAction" | "executeAction" | "end"

export type Turn = {
  state: TurnState
  actor: Actor
  combatEncounter: CombatEncounter
  availableActions: Action[]
}

export function processTurn(turn: Turn) {
  switch (turn.state) {
    case "begin":
      
  }
}