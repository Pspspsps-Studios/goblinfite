import { CombatEncounter } from "../combatLoop";

export const DEFEAT = "DEFEAT";

export class DefeatEvent {
  type: typeof DEFEAT = "DEFEAT";
  constructor(public combatEncounter: CombatEncounter) {}
}
