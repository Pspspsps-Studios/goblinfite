import { CombatEncounter } from "../combatLoop";

export const WIN = "WIN";

export type WinEvent = {
  type: typeof WIN;
  combatEncounter: CombatEncounter;
}
