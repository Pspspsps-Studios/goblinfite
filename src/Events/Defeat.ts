import { CombatEncounter } from "../combatLoop";

export const DEFEAT = "DEFEAT";

export type DefeatEvent = {
  type: typeof DEFEAT;
  combatEncounter: CombatEncounter
}