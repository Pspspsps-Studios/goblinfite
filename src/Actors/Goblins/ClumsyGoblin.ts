import { Attack } from "../../Actions/Attack";
import { BaseActor } from "../Actor";
import { Event, listen } from "../../Events/EventListener";
import { HIT } from "../../Events/Hit";
import { PRE_HIT } from "../../Events/PreHit";
import { SELECT_ACTION } from "../../Events/SelectAction";
import { SELECT_TARGETS } from "../../Events/SelectTargets";


export class ClumsyGoblin extends BaseActor {
  name = "Clumsy Goblin"
  constructor(hitPoints: number) {
    super(hitPoints)
    listen(this, [SELECT_ACTION, SELECT_TARGETS, PRE_HIT, HIT])
  }

  pickRandom<T>(options: T[]): T {
    return options[Math.floor(Math.random() * options.length)]
  }

  async handle<T extends Event>(event: T): Promise<void> {
    switch (event.type) {
      case SELECT_ACTION:
        if (event.turn.actor === this) {
          console.log(event.turn.availableActions)
          event.turn.selectedAction = this.pickRandom(event.turn.availableActions)
        }
        break;
      case SELECT_TARGETS:
        if (event.turn.actor === this && event.turn.selectedAction instanceof Attack) {
          event.turn.selectedAction.targets = [event.turn.combatEncounter.player]
        }
        break;
      case PRE_HIT:
        if (event.damageInstance.source === this.equipped) {
          if (Math.random() < 0.4) {
            event.damageInstance.status = "evaded"
          }
        }
        this.onPreHit(event)
        break;
      case HIT:
        this.onHit(event)
    }
  }

  toString(): string {
    return `${this.name} with a ${this.equipped?.name} and ${this.currentHitPoints} hit points`
  }
}
