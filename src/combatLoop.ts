import { Actor } from "./Actors/Actor";
import { DEFEAT, DefeatEvent } from "./Events/Defeat";
import { emit, clearAllListeners } from "./Events/EventListener";
import { PRE_COMBAT, PreCombatEvent } from "./Events/PreCombat";
import { WIN, WinEvent } from "./Events/Win";
import { COMPLETE, Processable } from "./Processable";
import { Round } from "./Round";

export type CombatEncounterState =
  | typeof PRE_COMBAT
  | "COMBAT"
  | typeof WIN
  | typeof DEFEAT
  | "RETREAT"
  | typeof COMPLETE;

export class CombatEncounter extends Processable {
  public round?: Round;

  constructor(
    public player: Actor,
    public enemies: Actor[],
    public status: CombatEncounterState = PRE_COMBAT,
  ) {
    super();
  }

  get hasAnyLivingEnemies(): boolean {
    return !!this.enemies.filter((e) => e.isAlive).length;
  }

  createRound() {
    this.round = new Round(this);
  }

  async process() {
    switch (this.status) {
      case PRE_COMBAT:
        await emit(new PreCombatEvent(this));
        this.status = "COMBAT";
        break;
      case "COMBAT":
        this.createRound();
        await this.round.runProcess();
        if (this.player.isDead) {
          this.status = DEFEAT;
        } else if (!this.hasAnyLivingEnemies) {
          this.status = WIN;
        }
        break;
      case WIN:
        await emit(new WinEvent(this));
        this.status = COMPLETE;
        break;
      case DEFEAT:
        await emit(new DefeatEvent(this));
        this.status = COMPLETE;
        break;
      case COMPLETE:
        clearAllListeners();
    }
  }
}
