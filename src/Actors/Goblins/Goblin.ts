import { Attack } from "../../Actions/Attack";
import { listen } from "../../Events/EventListener";
import { HIT } from "../../Events/Hit";
import { SELECT_ACTION, SelectActionEvent } from "../../Events/SelectAction";
import { SELECT_TARGETS, SelectTargetsEvent } from "../../Events/SelectTargets";
import { BaseActor } from "../Actor";
import { Event } from "../../Events/EventListener";
import { pickRandom } from "../../util/random";

export class Goblin extends BaseActor {
  constructor(maxHitPoints: number = 10, public name: string) {
    super(maxHitPoints)
    listen(this, SELECT_ACTION, SELECT_TARGETS, HIT);
  }

  async onSelectAction(event: SelectActionEvent) {
    if (event.turn.actor === this) {
      event.turn.selectedAction = pickRandom(
        event.turn.availableActions,
      );
    }
  }

  async onSelectTargets(event: SelectTargetsEvent) {
    if (
      event.turn.actor === this &&
      event.turn.selectedAction instanceof Attack
    ) {
      event.turn.selectedAction.targets = [
        event.turn.combatEncounter.player,
      ];
    }
  }
  
  async handle<T extends Event>(event: T): Promise<void> {
    switch (event.type) {
      case SELECT_ACTION:
        this.onSelectAction(event)
        break;
      case SELECT_TARGETS:
        this.onSelectTargets(event)
        break;
      case HIT:
        this.onHit(event);
    }
  }

  toString() {
    return this.name
  }
}