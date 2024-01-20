import { listen } from "../../Events/EventListener";
import { HIT } from "../../Events/Hit";
import { PRE_HIT } from "../../Events/PreHit";
import { SELECT_ACTION } from "../../Events/SelectAction";
import { SELECT_TARGETS } from "../../Events/SelectTargets";
import { Goblin } from "./Goblin";

export class ClumsyGoblin extends Goblin {
  constructor(hitPoints: number, name: string = "Clumsy Goblin") {
    super(hitPoints, name);
    listen(this, SELECT_ACTION, SELECT_TARGETS, PRE_HIT, HIT);
  }
}
