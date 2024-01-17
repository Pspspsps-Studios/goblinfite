import { intro, select, text, note } from "@clack/prompts";
import { ClumsyGoblin } from "./Actors/Goblins/ClumsyGoblin";
import { StoneSword } from "./Swords/StoneSword";
import { CLIPlayer } from "./Actors/Player/CLIPlayer";
import { CombatEncounter, combatLoop } from "./combatLoop";

function createEnemy(i: number) {
  const goblin = new ClumsyGoblin(Math.ceil(Math.random() * 9), `Goblin ${i}`);
  const sword = new StoneSword(goblin);
  goblin.pickUp(sword);
  goblin.equip(sword);
  return goblin;
}

function createPlayer() {
  const player = new CLIPlayer(10);
  const sword = new StoneSword(player);
  player.pickUp(sword);
  player.equip(sword);
  console.log("PLAYER ID", player.id);
  return player;
}

const numberCheck = /^\d+$/;
async function game() {
  const numberOfEnemies = await text({
    message: "How many goblins do you want?",
    validate: (input) => {
      if (!input.match(numberCheck)) {
        return input;
      }
    },
  });
  if (typeof numberOfEnemies === "symbol") {
    throw new Error(`Get outta here with that ${String(numberOfEnemies)}`);
  }
  const enemies = Array(+numberOfEnemies)
    .fill(0)
    .map((v, i) => createEnemy(i));
  const encounter = new CombatEncounter(createPlayer(), enemies);
  let completed = false;
  while (!completed) {
    completed = await combatLoop(encounter);
  }
}

game();
