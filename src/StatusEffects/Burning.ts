import { Actor } from "../Actor";
import { DamageInstance, FIRE_DAMAGE_TYPE } from "../DamageInstance";
import { COLLECT_ACTIONS } from "../Events/CollectActions";
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
    if (event.type === COLLECT_ACTIONS) {
      DamageInstance.process(new DamageInstance(
        this.level,
        [FIRE_DAMAGE_TYPE],
        this,
        this.actor
      ))
      this.myLevel -= 1;
    }
  }

  valueOf(): number {
    return this.level
  }
}