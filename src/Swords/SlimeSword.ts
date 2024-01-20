import { ACID_DAMAGE_TYPE, DamageType } from "../DamageInstance";
import { Sword } from "./Sword";

export class SlimeSword extends Sword {
  protected minDamage: number = 1;
  protected maxDamage: number = 2;

  get damageType(): DamageType {
    return ACID_DAMAGE_TYPE
  }
  
  get name(): string {
    return "Slime Sword";
  }
  
  get description(): string {
    return "Made of viscous, putrid goo.";
  }
}