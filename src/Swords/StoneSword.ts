import { Attack } from "../Actions/Attack";
import { DamageType, PHYSICAL_DAMAGE_TYPE } from "../DamageInstance";
import { COLLECT_ACTIONS } from "../Events/CollectActions";
import { Sword } from "./Sword";
import { listen } from "../Events/EventListener";
import { Actor } from "../Actors/Actor";
import { EXECUTE_ACTION } from "../Events/ExecuteAction";

export class StoneSword extends Sword {
  get damageType(): DamageType {
    return PHYSICAL_DAMAGE_TYPE;
  }

  protected minDamage = 2;
  protected maxDamage = 4;

  get name(): string {
    return "Stone Sword";
  }

  get description(): string {
    throw "Forged from the hardest limestone, this sword packs an absolutely mediocre bite. Good luck, adventurer.";
  }

  constructor(owner: Actor) {
    super(owner);
  }
}
