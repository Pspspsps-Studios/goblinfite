import { Actor } from "../Actors/Actor";
import { DamageInstance, FIRE_DAMAGE_TYPE } from "../DamageInstance";
import { listen, Event } from "../Events/EventListener";
import { TURN_START } from "../Events/TurnStart";
import { StatusEffect } from "./StatusEffect";

export class Burning implements StatusEffect {
  constructor(
    protected myLevel: number,
    protected actor: Actor,
  ) {
    listen(this, [TURN_START]);
  }

  get name(): string {
    return "Burning";
  }

  get level(): number {
    return this.myLevel;
  }

  async handle(event: Event) {
    if (event.type === TURN_START && event.turn.actor === this.actor) {
      // @todo fixme
        new DamageInstance(this.level, [FIRE_DAMAGE_TYPE], this, this.actor),
      this.myLevel -= 1;
    }
  }

  valueOf(): number {
    return this.level;
  }
}
