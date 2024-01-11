import { DamageInstance } from "../DamageInstance";

export const MISS = "MISS";

export class MissEvent {
  type: typeof MISS = MISS;
  constructor(public damageInstance: DamageInstance) {}
}