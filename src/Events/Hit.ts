import { DamageInstance } from "../DamageInstance";

export const HIT = "HIT";

export type HitEvent = {
  type: typeof HIT,
  damageInstance: DamageInstance
}
