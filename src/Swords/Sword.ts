import { Attack } from "../Actions/Attack";
import { Actor } from "../Actors/Actor";
import {
  DamageInstance,
  DamageType,
  PHYSICAL_DAMAGE_TYPE,
} from "../DamageInstance";
import { COLLECT_ACTIONS } from "../Events/CollectActions";
import { Event, EventListener, listen } from "../Events/EventListener";
import { v4 as uuid } from "uuid";
import { EXECUTE_ACTION } from "../Events/ExecuteAction";

export abstract class Sword implements EventListener {
  protected abstract minDamage: number;
  protected abstract maxDamage: number;

  protected myId: string;

  abstract get damageType(): DamageType;

  abstract get name(): string;

  abstract get description(): string;

  get damage(): number {
    return Math.floor(
      Math.random() * (this.maxDamage - this.minDamage) + this.minDamage,
    );
  }

  get id(): string {
    return this.myId;
  }

  get level(): number {
    return 1;
  }

  constructor(public owner: Actor) {
    this.myId = uuid();
    listen(this, [COLLECT_ACTIONS, EXECUTE_ACTION]);
  }

  async handle(event: Event) {
    switch (event.type) {
      case COLLECT_ACTIONS:
        if (event.turn.actor.equipped === this) {
          event.turn.availableActions.push(new Attack(this, 1));
        }
        break;
      case EXECUTE_ACTION:
        if (event.action instanceof Attack && event.action.sword === this) {
          await this.attack(event.action.targets);
        }
        break;
    }
  }

  async attack(defenders: Actor[]): Promise<void> {
    const defender = defenders.pop();
    if (!defender) return;
    await DamageInstance.process(
      new DamageInstance(this.damage, [this.damageType], this, defender),
    );
    await this.attack(defenders);
  }
}
