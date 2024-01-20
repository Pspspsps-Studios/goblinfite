import { listen } from "../../Events/EventListener";
import { TURN_END, TurnEndEvent } from "../../Events/TurnEnd";
import { SlimeSword } from "../../Swords/SlimeSword";
import { Goblin } from "./Goblin";

const SMALLEST_SLIME_EVER = 2

export class SlimeGoblin extends Goblin {
  constructor(maxHitPoints = 8, name = "Slime Goblin") {
    super(maxHitPoints, name);
    listen(this, TURN_END)
  }

  subslime(inheritSwords: boolean = false) {
    const subslime = new SlimeGoblin(Math.ceil(this.maxHitPoints / 2))
    if (inheritSwords) {
      subslime.inventory.push(...this.inventory)
      subslime.inventory.forEach(sword => sword.owner = subslime);
      subslime.equip(this.myEquippedSword)
      this.myEquippedSword = null;
      this.myInventory = [];
    }
    else {
      const sword = new SlimeSword(subslime)
      subslime.pickUp(sword)
      subslime.equip(sword)
    }
    return subslime
  }

  async onTurnEnd(event: TurnEndEvent) {
    if (this.isDead && this.maxHitPoints > SMALLEST_SLIME_EVER) {
      const enemies = event.turn.combatEncounter.enemies;
      enemies.splice(enemies.indexOf(this), 1, this.subslime(true), this.subslime())
    }
  }
}
