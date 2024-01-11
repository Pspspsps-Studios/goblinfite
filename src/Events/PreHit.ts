import { DamageInstance } from "../DamageInstance";

export const PRE_HIT = "PRE_HIT"

export type PreHitEvent = {
  type: typeof PRE_HIT
  damageInstance: DamageInstance
}
