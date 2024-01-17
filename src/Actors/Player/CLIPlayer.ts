import { Action } from "../../Actions/Action";
import { Attack } from "../../Actions/Attack";
import { Actor, BaseActor } from "../Actor";
import { DEFEAT } from "../../Events/Defeat";
import { Event, listen } from "../../Events/EventListener";
import { HIT } from "../../Events/Hit";
import { PRE_COMBAT } from "../../Events/PreCombat";
import { PRE_HIT } from "../../Events/PreHit";
import { SELECT_ACTION } from "../../Events/SelectAction";
import { SELECT_TARGETS } from "../../Events/SelectTargets";
import { WIN } from "../../Events/Win";
import { EVADED } from "../../Events/Evaded";
import { Sword } from "../../Swords/Sword";
import { multiselect, note, select, text } from "@clack/prompts";

export class CLIPlayer extends BaseActor {
  constructor(hitPoints: number) {
    super(hitPoints);
    listen(this, [
      PRE_COMBAT,
      DEFEAT,
      WIN,
      SELECT_ACTION,
      SELECT_TARGETS,
      HIT,
      EVADED,
    ]);
  }

  async handle<T extends Event>(event: T): Promise<void> {
    switch (event.type) {
      case PRE_HIT:
        this.onPreHit(event);
        break;
      case PRE_COMBAT:
        event.combatEncounter.enemies.forEach((e) =>
          note(`A crazed ${e} appears!`),
        );
        break;
      case DEFEAT:
        note(`Oh noes! You have been defeated!`);
        break;
      case WIN:
        note(`Hooray! You have won the thing!`);
        const lootstack = event.combatEncounter.enemies.reduce(
          (loot, enemy) => {
            enemy.inventory.forEach((sword) =>
              loot.push({ value: sword, label: sword.name }),
            );
            return loot;
          },
          [] as { value: Sword; label: string }[],
        );
        const grabbed = await multiselect<
          { value: Sword; label: string }[],
          Sword
        >({ message: "Here are your loots!", options: lootstack });
        if (Array.isArray(grabbed)) {
          grabbed.forEach((item) => this.pickUp(item));
        }
        break;
      case SELECT_ACTION:
        if (event.turn.actor === this) {
          const options = event.turn.availableActions.map((action) => ({
            label: action.name,
            value: action,
            hint: action.description,
          }));
          const selected = await select<
            { value: Action; label: string }[],
            Action
          >({ options, message: "What are you going to do?" });
          if (typeof selected === "symbol") {
            throw new Error("Well, Idk how I got a symbol.");
          }
          event.turn.selectedAction = selected;
        }
        break;
      case SELECT_TARGETS:
        if (
          event.turn.actor === this &&
          event.turn.selectedAction instanceof Attack
        ) {
          const choices = event.turn.selectedAction.targetCount;
          const aliveEnemies = event.turn.combatEncounter.enemies.filter(
            (enemy) => !enemy.isDead,
          );
          const options = aliveEnemies.map((goblin) => ({
            value: goblin,
            label: `${goblin}`,
          }));
          const selected: Actor[] = [];
          while (selected.length < choices) {
            const selection = await select<
              { value: Actor; label: string }[],
              Actor
            >({ options, message: "Pick an enemy to smite" });
            if (typeof selection === "symbol") {
              throw new Error(String(selection));
            }
            options.splice(
              options.findIndex((o) => o.value === selection),
              1,
            );
            selected.push(selection);
          }
          event.turn.selectedAction.targets = selected;
        }
        break;
      case EVADED:
        note(`${event.damageInstance.target} dodges the attack`);
        break;
      case HIT:
        this.onHit(event);
        note(
          `${event.damageInstance.target} takes ${event.damageInstance.amount}hp from the attack!`,
        );
        break;
    }
  }

  toString() {
    return `Player ${this.currentHitPoints} hp`;
  }
}
