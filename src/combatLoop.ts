import { Actor } from "./Actor";
import { PRE_COMBAT } from "./Events/PreCombat";

export type CombatEncounterState = typeof PRE_COMBAT | "COMBAT" | "win" | "loss" | "retreat";

export class CombatEncounter {
  protected myRound = 1;
  
  constructor(
    public player: Actor,
    public enemies: Actor[],
    public state: CombatEncounterState = PRE_COMBAT
  ) {}

  get round() {
    return this.myRound
  }

  nextRound() {
    this.myRound += 1
  }
}

export function combatLoop(player: Actor, enemies: Actor[]) {
  
}
