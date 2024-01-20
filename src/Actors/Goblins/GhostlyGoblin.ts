import { PHYSICAL_DAMAGE_TYPE } from "../../DamageInstance";
import { EVADE } from "../../Events/Evaded";
import { Event, listen } from "../../Events/EventListener";
import { HIT } from "../../Events/Hit";
import { PRE_HIT, PreHitEvent } from "../../Events/PreHit";
import { SELECT_ACTION } from "../../Events/SelectAction";
import { SELECT_TARGETS } from "../../Events/SelectTargets";
import { Goblin } from "./Goblin";

export class GhostlyGoblin extends Goblin {
  description = "Any solid blade passes through it without effect."
  constructor(maxHitPoints = 5, public name: string = "Ghostly Goblin") {
    super(maxHitPoints, name)
    listen(this, SELECT_ACTION, SELECT_TARGETS, PRE_HIT, HIT);
  }

  async onPreHit(event: PreHitEvent) {
    if(event.damageInstance.target === this) {
      if (event.damageInstance.types.length === 1 && event.damageInstance.types[0] === PHYSICAL_DAMAGE_TYPE) {
        event.damageInstance.status === EVADE
      }
    }
  }

  async handle<T extends Event>(event: T) {
    switch (event.type) {
      case SELECT_ACTION:
        await this.onSelectAction(event)
        break;
      case SELECT_TARGETS:
        await this.onSelectTargets(event)
        break;
      case HIT:
        await this.onHit(event);
        break;
      case PRE_HIT:
        await this.onPreHit(event);
        break;
    }
  }
}
