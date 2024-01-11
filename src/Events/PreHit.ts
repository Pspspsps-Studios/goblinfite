import { DamageInstance } from "../DamageInstance";

export const PRE_HIT = "PRE_HIT"

export class PreHitEvent {
  type: typeof PRE_HIT = PRE_HIT;
  constructor(public damageInstance: DamageInstance) {}
}
