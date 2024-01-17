import { Action } from "../../Actions/Action";
import { Attack } from "../../Actions/Attack";
import { Actor, BaseActor } from "../Actor";
import { DEFEAT } from "../../Events/Defeat";
import { Event, listen } from "../../Events/EventListener";
import { HIT } from "../../Events/Hit";
import { PRE_COMBAT } from "../../Events/PreCombat";
import { PRE_HIT } from "../../Events/PreHit";
import { SELECT_ACTION, SelectActionEvent } from "../../Events/SelectAction";
import { SELECT_TARGETS, SelectTargetsEvent } from "../../Events/SelectTargets";
import { WIN, WinEvent } from "../../Events/Win";
import { EVADE } from "../../Events/Evaded";
import { Sword } from "../../Swords/Sword";
import { multiselect, note, select } from "@clack/prompts";

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
      EVADE,
    ]);
  }

  async onWin(event: WinEvent) {
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
    const grabbed = await multiselect<{ value: Sword; label: string }[], Sword>(
      { message: "Here are your loots!", options: lootstack },
    );
    if (Array.isArray(grabbed)) {
      grabbed.forEach((item) => this.pickUp(item));
    }
  }

  async onSelectAction(event: SelectActionEvent) {
    if (event.turn.actor === this) {
      const options = event.turn.availableActions.map((action) => ({
        label: action.name,
        value: action,
        hint: action.description,
      }));
      const selected = await select<{ value: Action; label: string }[], Action>(
        { options, message: "What are you going to do?" },
      );
      if (typeof selected === "symbol") {
        throw new Error("Well, Idk how I got a symbol.");
      }
      event.turn.selectedAction = selected;
    }
  }

  async onSelectTargets(event: SelectTargetsEvent) {
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
        await this.onWin(event);
        break;
      case SELECT_ACTION:
        await this.onSelectAction(event);
        break;
      case SELECT_TARGETS:
        await this.onSelectTargets(event);
        break;
      case EVADE:
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
