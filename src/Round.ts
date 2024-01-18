import { Actor } from "./Actors/Actor";
import { COMPLETE, Processable } from "./Processable";
import { Turn } from "./Turn";
import { CombatEncounter } from "./combatLoop";

export const ROUND_BEGIN = "ROUND_BEGIN";
export const PLAYER_TURN = "PLAYER_TURN";
export const ENEMY_TURN = "ENEMY_TURN";

export type RoundState =
  | typeof ROUND_BEGIN
  | typeof PLAYER_TURN
  | typeof ENEMY_TURN
  | typeof COMPLETE;

export class Round extends Processable {
  public currentTurn: Turn | null = null;
  constructor(
    public combatEncounter: CombatEncounter,
    public status: RoundState = ROUND_BEGIN,
  ) {
    super();
  }

  createTurn(actor: Actor): Turn {
    return new Turn(actor, this.combatEncounter);
  }

  setupNextPlayerTurn() {
    this.status = PLAYER_TURN;
    this.currentTurn = this.createTurn(this.combatEncounter.player);
  }

  findNextLivingEnemy(): Actor | null {
    const currentEnemy =
      this.status !== ENEMY_TURN ? null : this.currentTurn?.actor;
    const currentEnemyIndex =
      this.combatEncounter.enemies.indexOf(currentEnemy);
    for (const enemy of this.combatEncounter.enemies.slice(
      currentEnemyIndex + 1,
    )) {
      if (enemy.isAlive) return enemy;
    }
    return null;
  }

  setupNextEnemyTurn() {
    this.status = "ENEMY_TURN";
    const enemy = this.findNextLivingEnemy();
    if (enemy) {
      this.currentTurn = this.createTurn(enemy);
    } else {
      this.status = COMPLETE;
    }
  }

  async process() {
    switch (this.status) {
      case "ROUND_BEGIN":
        this.setupNextPlayerTurn();
        break;
      case "PLAYER_TURN":
      case "ENEMY_TURN":
        await this.currentTurn.runProcess();
        if (
          this.combatEncounter.player.isDead ||
          !this.combatEncounter.hasAnyLivingEnemies
        ) {
          this.status = COMPLETE;
        } else if (this.currentTurn.isComplete) {
          this.setupNextEnemyTurn();
        }
        break;
    }
  }
}
