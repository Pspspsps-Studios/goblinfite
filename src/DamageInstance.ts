import { Actor } from "./Actors/Actor";
import { MISS, MissEvent } from "./Events/Miss";
import { PRE_HIT, PreHitEvent } from "./Events/PreHit";
import { EventListener, broadcastEvent } from "./Events/EventListener";
import { HIT, HitEvent } from "./Events/Hit";

export const FIRE_DAMAGE_TYPE = "FIRE_DAMAGE_TYPE"
export const COLD_DAMAGE_TYPE = "COLD_DAMAGE_TYPE"
export const PHYSICAL_DAMAGE_TYPE = "PHYSICAL_DAMAGE_TYPE"
export const POISON_DAMAGE_TYPE = "POISON_DAMAGE_TYPE"
export const PSYCHIC_DAMAGE_TYPE = "PSYCHIC_DAMAGE_TYPE"
export const ELECTRIC_DAMAGE_TYPE = "ELECTRIC_DAMAGE_TYPE"
export const FORCE_DAMAGE_TYPE = "FORCE_DAMAGE_TYPE"
export const ACID_DAMAGE_TYPE = "ACID_DAMAGE_TYPE"
export const TRUE_DAMAGE_TYPE = "TRUE_DAMAGE_TYPE"

export type DamageType = 
  typeof FIRE_DAMAGE_TYPE |
  typeof COLD_DAMAGE_TYPE |
  typeof PHYSICAL_DAMAGE_TYPE |
  typeof POISON_DAMAGE_TYPE |
  typeof PSYCHIC_DAMAGE_TYPE |
  typeof ELECTRIC_DAMAGE_TYPE |
  typeof FORCE_DAMAGE_TYPE |
  typeof ACID_DAMAGE_TYPE |
  typeof TRUE_DAMAGE_TYPE

export type DamageState = "created" | "evaded" | "hit" | "applied"

// The damage instance is a finite state machine that evaluates a damage instance, triggers any necessary effects, and applies the damage.
export class DamageInstance {
  constructor(
    public amount: number,
    public types: DamageType[],
    public source: EventListener,
    public target: Actor,
    public isCritical: boolean = false,
    public status: DamageState = "created"
  ) {}

  static async process(damageInstance: DamageInstance) {
    switch (damageInstance.status) {
      case "created":
        await broadcastEvent(new PreHitEvent(damageInstance))
        break
      case "evaded":
        await broadcastEvent(new MissEvent(damageInstance))
        damageInstance.status = "applied"
        break
      case "hit":
        await broadcastEvent(new HitEvent(damageInstance))
        damageInstance.status = "applied"
        break
    };
    if (damageInstance.status !== "applied") {
      DamageInstance.process(damageInstance);
    }
  }
}
