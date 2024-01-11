import { Actor } from "../Actor";
import { DamageInstance, DamageType } from "../DamageInstance";
import { EventListener } from "../Events/EventListener";

export interface Sword extends EventListener {
  get name(): string;
  get description(): string;
  get level(): number;
  createAttack(attacker: Actor, defender: Actor)
}

export class BaseSword {
  randomDamage(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  get level(): number {
    return 1
  }
}
