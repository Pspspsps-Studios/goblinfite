import { CombatEncounter } from "../combatLoop";

export const WIN = "WIN";

export class WinEvent {
  type: typeof WIN = WIN;
  constructor(public combatEncounter: CombatEncounter) {}
}
