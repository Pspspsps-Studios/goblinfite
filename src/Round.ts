import { Actor } from "./Actors/Actor";
import { Turn } from "./Turn";
import { CombatEncounter } from "./combatLoop";

// @todo make these event types
export type RoundState = "ROUND_BEGIN" | "PLAYER_TURN" | "ENEMY_TURN" | "ROUND_END"

export class Round {
  protected enemyTurnCount = 0
  protected currentTurn: Turn
  constructor(protected combatEncounter: CombatEncounter, protected state: RoundState = "PLAYER_TURN") {
    this.currentTurn = this.createTurn(this.combatEncounter.player)
  }

  createTurn(actor: Actor): Turn {
    return new Turn(actor, this.combatEncounter)
  }

  setupNextPlayerTurn() {
    this.currentTurn = this.createTurn(this.combatEncounter.player)
  }

  setupNextEnemyTurn() {
    this.state = "ENEMY_TURN"
    if (this.combatEncounter.enemies.filter(e => e.isAlive).length) {
      const deadEnemiesMap = this.combatEncounter.enemies.map(e => e.isDead)
      while (deadEnemiesMap[this.enemyTurnCount] && this.enemyTurnCount < this.combatEncounter.enemies.length) {
        this.enemyTurnCount += 1;
      }
      if (this.enemyTurnCount >= this.combatEncounter.enemies.length) {
        this.state = "ROUND_END"
      }
      else {
        this.currentTurn = this.createTurn(this.combatEncounter.enemies[this.enemyTurnCount])
        this.enemyTurnCount += 1;
      }
    }
  }

  static async process(round: Round): Promise<boolean> {
    switch (round.state) {
      case "ROUND_BEGIN":
        round.state = "PLAYER_TURN"
        break;
      case "PLAYER_TURN":
        await Turn.process(round.currentTurn);
        if (round.currentTurn.state === "TURN_END") {
          round.setupNextEnemyTurn()
        }
        break;
      case "ENEMY_TURN":
        round.setupNextEnemyTurn()
        break;
      case "ROUND_END":
        return true;
    }
    return false;
  }
}
