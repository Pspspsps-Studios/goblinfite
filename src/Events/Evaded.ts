import { DamageInstance } from "../DamageInstance";

export const EVADE = "EVADE";

export class EvadeEvent {
  type: typeof EVADE = EVADE;
  constructor(public damageInstance: DamageInstance) {}
}