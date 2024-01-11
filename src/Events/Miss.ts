import { DamageInstance } from "../DamageInstance";

export const MISS = "MISS";

export type MissEvent = {
  type: typeof MISS;
  damageInstance: DamageInstance
}