import { Actor } from "../Actors/Actor";
import { DamageInstance, DamageType, PHYSICAL_DAMAGE_TYPE } from "../DamageInstance";
import { Event, EventListener } from "../Events/EventListener";
import { Sword } from "./Sword";

export class SandSword extends Sword {
  protected minDamage: 1;
  protected maxDamage: 1;

  constructor(owner: Actor, protected myLevel: number = 2) {
    super(owner)
  }
  
  get damageType(): DamageType {
    return PHYSICAL_DAMAGE_TYPE;
  }

  get level(): number {
    return this.myLevel
  }

  get name(): string {
    return "Sand Sword";
  }

  get description(): string {
    return `What's worse than one stone sword? ${this.level} stone swords, merged together.`;
  }
}
