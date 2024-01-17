import { DamageInstance } from "../DamageInstance";

export const HIT = "HIT";

export class HitEvent {
  type: typeof HIT = HIT;
  constructor(public damageInstance: DamageInstance) {}
}
