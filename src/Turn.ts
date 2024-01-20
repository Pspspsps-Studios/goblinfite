import { Action } from "./Actions/Action";
import { Actor } from "./Actors/Actor";
import { CombatEncounter } from "./combatLoop";
import { COLLECT_ACTIONS, CollectActionsEvent } from "./Events/CollectActions";
import { emit } from "./Events/EventListener";
import { EXECUTE_ACTION, ExecuteActionEvent } from "./Events/ExecuteAction";
import { SELECT_ACTION, SelectActionEvent } from "./Events/SelectAction";
import { SelectTargetsEvent } from "./Events/SelectTargets";
import { TURN_END, TurnEndEvent } from "./Events/TurnEnd";
import { TURN_START, TurnStartEvent } from "./Events/TurnStart";
import { COMPLETE, Processable } from "./Processable";

export const PROCESS_RESULTS = "PROCESS_RESULTS";

export type TurnState =
  | typeof TURN_START
  | typeof COLLECT_ACTIONS
  | typeof SELECT_ACTION
  | typeof EXECUTE_ACTION
  | typeof PROCESS_RESULTS
  | typeof TURN_END
  | typeof COMPLETE;

export class Turn extends Processable {
  public selectedAction: Action | null = null;
  public availableActions: Action[] = [];
  public status: TurnState = COLLECT_ACTIONS;

  constructor(
    public actor: Actor,
    public combatEncounter: CombatEncounter,
  ) {
    super();
  }

  get hasResults() {
    return !!this.selectedAction.result?.length;
  }

  async processResults(results: Processable[]) {
    if (results.length) {
      await results.shift().runProcess();
    }
  }

  async process() {
    switch (this.status) {
      case COLLECT_ACTIONS:
        await emit(new CollectActionsEvent(this));
        this.status = TURN_START;
        break;
      case TURN_START:
        await emit(new TurnStartEvent(this));
        this.status = SELECT_ACTION;
        break;
      case SELECT_ACTION:
        if (!this.availableActions.length) {
          throw new NoActionsError();
        }
        await emit(new SelectActionEvent(this));
        if (!this.selectedAction) {
          throw new NoActionSelectedError();
        }
        this.status = EXECUTE_ACTION;
        break;
      case EXECUTE_ACTION:
        if ("targets" in this.selectedAction) {
          await emit(new SelectTargetsEvent(this));
        }
        await emit(new ExecuteActionEvent(this.selectedAction));
        if ("result" in this.selectedAction && this.selectedAction.result) {
          this.status = PROCESS_RESULTS;
        } else {
          this.status = COMPLETE;
        }
        break;
      case PROCESS_RESULTS:
        await this.processResults(this.selectedAction.result);
        if (!this.hasResults) {
          this.status = TURN_END;
        }
        break;
      case TURN_END:
        await emit(new TurnEndEvent(this));
        this.status = COMPLETE
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
