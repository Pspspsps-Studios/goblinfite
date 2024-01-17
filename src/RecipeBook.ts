import { Sword } from "./Swords/Sword";
import { SandSword } from "./Swords/SandSword";

export const RecipeBook: Record<
  string,
  (sword1: Sword, sword2: Sword) => Sword
> = {
  "Stone Sword|Stone Sword": (sword1: Sword) => new SandSword(sword1.owner),
  "Sand Sword|Stone Sword": (sword1: Sword, sword2: Sword) =>
    new SandSword(sword1.owner, sword1.level + sword2.level),
  "Sand Sword|Sand Sword": (sword1: Sword, sword2: Sword) =>
    new SandSword(sword1.owner, sword1.level + sword2.level),
  // @todo  "Fire Sword|Fire Sword": (sword1: Sword, Sword2: Sword) => new FireSword(sword1.level + sword2.level)
};
