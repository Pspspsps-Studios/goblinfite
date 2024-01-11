import { CombatEncounter } from "../combatLoop"

export const PRE_COMBAT = "PRE_COMBAT"

export class PreCombatEvent {
  type: typeof PRE_COMBAT = PRE_COMBAT
  constructor(public combatEncounter: CombatEncounter) {}
}
