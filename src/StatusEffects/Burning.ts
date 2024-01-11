import { Actor } from "../Actor";
import { DamageInstance, FIRE_DAMAGE_TYPE, processDamageInstance } from "../DamageInstance";
import { TURN_START } from "../Events/TurnStart";
import { StatusEffect } from "./StatusEffect";

export class Burning implements StatusEffect {
  constructor(protected myLevel: number, protected actor: Actor) {}

  get name(): string {
    return "Burning";
  }

  get level(): number {
    return this.myLevel
  }

  async handle(event) {
    if (event.type === TURN_START) {
      processDamageInstance(new DamageInstance(
        this.level,
        [FIRE_DAMAGE_TYPE],
        this,
        this.actor
      ))
    }
  }

  valueOf(): number {
    return this.level
  }
}