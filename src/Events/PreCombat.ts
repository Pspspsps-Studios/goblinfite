import { CombatEncounter } from "../combatLoop"

export const PRE_COMBAT = "PRE_COMBAT"

export type PreCombatEvent = {
  type: typeof PRE_COMBAT,
  combatInstance: CombatEncounter
}
