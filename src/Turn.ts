import { Action } from "./Actions/Action";
import { Actor } from "./Actors/Actor";
import { CombatEncounter } from "./combatLoop";
import { COLLECT_ACTIONS, CollectActionsEvent } from "./Events/CollectActions";
import { broadcastEvent } from "./Events/EventListener";
import { EXECUTE_ACTION, ExecuteActionEvent } from "./Events/ExecuteAction";
import { SELECT_ACTION, SelectActionEvent } from "./Events/SelectAction";
import { SelectTargetsEvent } from "./Events/SelectTargets";
import { TURN_START, TurnStartEvent } from "./Events/TurnStart";
import { COMPLETE, Processable } from "./Processable";

export type TurnState =
  | typeof TURN_START
  | typeof COLLECT_ACTIONS
  | typeof SELECT_ACTION
  | typeof EXECUTE_ACTION
  | typeof COMPLETE;

export class Turn extends Processable {
  public selectedAction: Action | null = null;
  public availableActions: Action[] = [];
  public state: TurnState = COLLECT_ACTIONS;

  constructor(
    public actor: Actor,
    public combatEncounter: CombatEncounter,
  ) {
    super();
  }

  async process() {
    switch (this.state) {
      case COLLECT_ACTIONS:
        await broadcastEvent(new CollectActionsEvent(this));
        this.state = TURN_START;
        break;
      case TURN_START:
        await broadcastEvent(new TurnStartEvent(this));
        this.state = SELECT_ACTION;
        break;
      case SELECT_ACTION:
        if (!this.availableActions.length) {
          throw new NoActionsError();
        }
        await broadcastEvent(new SelectActionEvent(this));
        if (!this.selectedAction) {
          throw new NoActionSelectedError();
        }
        this.state = EXECUTE_ACTION;
        break;
      case EXECUTE_ACTION:
        if ("targets" in this.selectedAction) {
          await broadcastEvent(new SelectTargetsEvent(this));
        }
        await broadcastEvent(new ExecuteActionEvent(this.selectedAction));
        this.state = COMPLETE;
        break;
    }
  }
}

export class NoActionsError extends Error {
  constructor() {
    super("No actions provided to turn");
  }
}

export class NoActionSelectedError extends Error {
  constructor() {
    super("No action selected");
  }
}
