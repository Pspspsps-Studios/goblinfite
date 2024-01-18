import { Actor } from "../Actors/Actor";
import { DamageInstance } from "../DamageInstance";
import { Sword } from "../Swords/Sword";
import { Action } from "./Action";
import { Targetable } from "./Targetable";

export class Attack extends Targetable implements Action {
  name = "Attack";
  description = "Just hit a goblin";
  targets: Actor[] = [];
  result: DamageInstance[] = [];

  constructor(
    public sword: Sword,
    public targetCount: number,
  ) {
    super();
  }
}
