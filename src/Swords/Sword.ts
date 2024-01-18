import { Attack } from "../Actions/Attack";
import { Actor } from "../Actors/Actor";
import {
  DamageInstance,
  DamageType,
  PHYSICAL_DAMAGE_TYPE,
} from "../DamageInstance";
import { COLLECT_ACTIONS, CollectActionsEvent } from "../Events/CollectActions";
import { Event, EventListener, listen } from "../Events/EventListener";
import { v4 as uuid } from "uuid";
import { EXECUTE_ACTION, ExecuteActionEvent } from "../Events/ExecuteAction";

export abstract class Sword implements EventListener {
  protected abstract minDamage: number;
  protected abstract maxDamage: number;

  protected myId: string;

  abstract get name(): string;

  abstract get description(): string;

  get damageType(): DamageType {
    return PHYSICAL_DAMAGE_TYPE;
  }

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

  async onExecuteAction(event: ExecuteActionEvent) {
    if (event.action instanceof Attack && event.action.sword === this) {
      event.action.result = await this.attack(event.action.targets);
    }
  }

  async onCollectActions(event: CollectActionsEvent) {
    if (event.turn.actor.equipped === this) {
      event.turn.availableActions.push(new Attack(this, 1));
    }
  }

  async handle(event: Event) {
    switch (event.type) {
      case COLLECT_ACTIONS:
        await this.onCollectActions(event);
        break;
      case EXECUTE_ACTION:
        await this.onExecuteAction(event);
        break;
    }
  }

  async attack(defenders: Actor[]): Promise<DamageInstance[]> {
    const defender = defenders.pop();
    if (!defender) return [];
    // @fix-me
    const result = new DamageInstance(
      this.damage,
      [this.damageType],
      this,
      defender,
    );
    const otherResults = await this.attack(defenders);
    return [result, ...otherResults];
  }
}
