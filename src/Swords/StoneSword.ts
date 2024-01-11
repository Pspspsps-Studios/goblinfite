import { Attack } from "../Actions/Attack";
import { Actor } from "../Actor";
import { DamageInstance, PHYSICAL_DAMAGE_TYPE } from "../DamageInstance";
import { BaseSword, Sword } from "./Sword";

export class StoneSword extends BaseSword implements Sword {
  protected minDamage = 2
  protected maxDamage = 4

  get name(): string {
    return "Stone Sword"
  }
  get description(): string {
    throw "Forged from the hardest limestone, this sword packs an absolutely mediocre bite. Good luck, adventurer.";
  }

  createAttack(attacker: Actor, target: Actor): DamageInstance {
    return new DamageInstance(
      this.randomDamage(this.minDamage, this.maxDamage),
      [PHYSICAL_DAMAGE_TYPE],
      this,
      target
    )
  }

  async handle(event) {
    if (event.turn.actor.equipped === this) {
      event.turn.availableActions.push(new Attack(this))
    }
    return event
  }
}
