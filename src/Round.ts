import { Actor } from "./Actors/Actor";
import { Turn } from "./Turn";
import { CombatEncounter } from "./combatLoop";

// @todo make these event types
export type RoundState = "ROUND_BEGIN" | "PLAYER_TURN" | "ENEMY_TURN" | "ROUND_END"

export class Round {
  protected currentTurn: Turn | null = null
  constructor(protected combatEncounter: CombatEncounter, protected state: RoundState = "ROUND_BEGIN") {
  }

  createTurn(actor: Actor): Turn {
    return new Turn(actor, this.combatEncounter)
  }

  setupNextPlayerTurn() {
    this.state = "PLAYER_TURN"
    this.currentTurn = this.createTurn(this.combatEncounter.player)
  }

  findNextLivingEnemy(): Actor | null {
    const currentEnemy = this.state !== "ENEMY_TURN" ? null : this.currentTurn?.actor;
    let currentEnemyIndex = this.combatEncounter.enemies.indexOf(currentEnemy);
    for (const enemy of this.combatEncounter.enemies.slice(currentEnemyIndex + 1)) {
      if (enemy.isAlive) return enemy
    }
    return null;
  }

  setupNextEnemyTurn() {
    this.state = "ENEMY_TURN"
    const enemy = this.findNextLivingEnemy();
    if (enemy) {
      this.currentTurn = this.createTurn(enemy);
    }
    else {
      this.state = "ROUND_END"
    }
  }

  static async process(round: Round): Promise<boolean> {
    switch (round.state) {
      case "ROUND_BEGIN":
        round.setupNextPlayerTurn()
        break;
      case "PLAYER_TURN":
      case "ENEMY_TURN":
        await Turn.process(round.currentTurn)
        if (round.currentTurn.state === "TURN_END") {
          round.setupNextEnemyTurn()
        }
        break;
      case "ROUND_END":
        return true;
    }
    return false;
  }
}
