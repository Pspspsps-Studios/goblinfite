import { DamageInstance } from "../DamageInstance";
import { Sword } from "../Swords/Sword";
import { Turn } from "../Turn";
import { Action } from "./Action";

export class Attack implements Action<Turn, Promise<DamageInstance>> {
  name = "Attack"
  description = "Just hit the goblin";

  constructor(protected sword: Sword) {

  }

  execute(turn) {
    // @todo this needs to actually provide a mechanism to select a target, then attack that target. It needs to work for a player and an ai.
    return new Promise<DamageInstance>(() => this.sword.createAttack(turn.actor, turn.actor))
  }
}
