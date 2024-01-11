import { Actor } from "../Actor";
import { DamageInstance, DamageType, PHYSICAL_DAMAGE_TYPE } from "../DamageInstance";
import { Event, EventListener } from "../Events/EventListener";
import { Sword, BaseSword } from "./Sword";

export class SandSword extends BaseSword implements Sword {
  protected minDamage: 1;
  protected maxDamage: 1;

  constructor(protected myLevel: number = 2) {
    super()
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
    throw `What's worse than one stone sword? ${this.level} Stone swords, merged together.`;
  }

  createAttack(attacker: Actor, target: Actor): DamageInstance {
    return new DamageInstance(
      this.randomDamage(this.minDamage, this.maxDamage),
      [PHYSICAL_DAMAGE_TYPE],
      this,
      target,
      );
  }

  handle<T extends Event>(event: T): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
