import { DamageType, PHYSICAL_DAMAGE_TYPE } from "../DamageInstance";
import { Sword } from "./Sword";

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
}
