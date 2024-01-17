import { Actor } from "./Actors/Actor";
import { EVADE, EvadeEvent } from "./Events/Evaded";
import { PRE_HIT, PreHitEvent } from "./Events/PreHit";
import { EventListener, broadcastEvent } from "./Events/EventListener";
import { HIT, HitEvent } from "./Events/Hit";
import { COMPLETE, Processable } from "./Processable";

export const FIRE_DAMAGE_TYPE = "FIRE_DAMAGE_TYPE";
export const COLD_DAMAGE_TYPE = "COLD_DAMAGE_TYPE";
export const PHYSICAL_DAMAGE_TYPE = "PHYSICAL_DAMAGE_TYPE";
export const POISON_DAMAGE_TYPE = "POISON_DAMAGE_TYPE";
export const PSYCHIC_DAMAGE_TYPE = "PSYCHIC_DAMAGE_TYPE";
export const ELECTRIC_DAMAGE_TYPE = "ELECTRIC_DAMAGE_TYPE";
export const FORCE_DAMAGE_TYPE = "FORCE_DAMAGE_TYPE";
export const ACID_DAMAGE_TYPE = "ACID_DAMAGE_TYPE";
export const TRUE_DAMAGE_TYPE = "TRUE_DAMAGE_TYPE";

export type DamageType =
  | typeof FIRE_DAMAGE_TYPE
  | typeof COLD_DAMAGE_TYPE
  | typeof PHYSICAL_DAMAGE_TYPE
  | typeof POISON_DAMAGE_TYPE
  | typeof PSYCHIC_DAMAGE_TYPE
  | typeof ELECTRIC_DAMAGE_TYPE
  | typeof FORCE_DAMAGE_TYPE
  | typeof ACID_DAMAGE_TYPE
  | typeof TRUE_DAMAGE_TYPE;

export const DAMAGE_COMPLETE = "DAMAGE_COMPLETE";

export type DamageState =
  | typeof PRE_HIT
  | typeof EVADE
  | typeof HIT
  | typeof COMPLETE;

export class DamageInstance extends Processable {
  constructor(
    public amount: number,
    public types: DamageType | DamageType[],
    public source: EventListener,
    public target: Actor,
    public isCritical: boolean = false,
    public status: DamageState = PRE_HIT,
  ) {
    super()
  }

  async process() {
    switch (this.status) {
      case PRE_HIT:
        await broadcastEvent(new PreHitEvent(this));
        if (this.status === PRE_HIT) {
          this.status = HIT;
        }
        break;
      case EVADE:
        await broadcastEvent(new EvadeEvent(this));
        this.status = COMPLETE;
        break;
      case HIT:
        await broadcastEvent(new HitEvent(this));
        this.status = COMPLETE;
        break;
    }
  }
}
