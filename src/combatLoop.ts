import { Actor } from "./Actors/Actor";
import { DEFEAT, DefeatEvent } from "./Events/Defeat";
import { broadcastEvent, clearAllListeners } from "./Events/EventListener";
import { PRE_COMBAT, PreCombatEvent } from "./Events/PreCombat";
import { WIN, WinEvent } from "./Events/Win";
import { Round } from "./Round";

export type CombatEncounterState = typeof PRE_COMBAT | "COMBAT" | typeof WIN | typeof DEFEAT | "RETREAT";

export class CombatEncounter {
  public round: Round;

  constructor(
    public player: Actor,
    public enemies: Actor[],
    public state: CombatEncounterState = PRE_COMBAT
  ) { 
    this.round = new Round(this)
  }

  hasAnyLivingEnemies(): boolean {
    return !!this.enemies.filter(e => e.isAlive).length
  }
}

export async function combatLoop(combatEncounter: CombatEncounter) {
  switch (combatEncounter.state) {
    case PRE_COMBAT:
      await broadcastEvent(new PreCombatEvent(combatEncounter))
      combatEncounter.state = "COMBAT"
      break;
    case "COMBAT":
      let roundComplete = false;
      roundComplete = await Round.process(combatEncounter.round)
      if (combatEncounter.player.currentHitPoints <= 0) {
        roundComplete = true
        combatEncounter.state = DEFEAT
        await broadcastEvent(new DefeatEvent(combatEncounter))
      }
      if (!combatEncounter.hasAnyLivingEnemies) {
        roundComplete = true
        combatEncounter.state = WIN
        await broadcastEvent(new WinEvent(combatEncounter))
      }
      if (roundComplete && combatEncounter.state === "COMBAT") {
        combatEncounter.round = new Round(combatEncounter)
      }
      break;
    default:
      clearAllListeners()
      return true
  }
  return false
}
