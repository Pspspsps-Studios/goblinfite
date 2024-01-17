import { Action } from "./Actions/Action";
import { Attack } from "./Actions/Attack";
import { Actor } from "./Actors/Actor";
import { CombatEncounter } from "./combatLoop";
import { COLLECT_ACTIONS, CollectActionsEvent } from "./Events/CollectActions";
import { broadcastEvent } from "./Events/EventListener";
import { EXECUTE_ACTION, ExecuteActionEvent } from "./Events/ExecuteAction";
import { SELECT_ACTION, SelectActionEvent } from "./Events/SelectAction";
import { SelectTargetsEvent } from "./Events/SelectTargets";
import { TURN_START, TurnStartEvent } from "./Events/TurnStart";

export type TurnState =
  | typeof TURN_START
  | typeof COLLECT_ACTIONS
  | typeof SELECT_ACTION
  | typeof EXECUTE_ACTION
  | "TURN_END";

export class Turn {
  public selectedAction: Action | null = null;
  public availableActions: Action[] = [];
  public state: TurnState = COLLECT_ACTIONS;

  constructor(
    public actor: Actor,
    public combatEncounter: CombatEncounter,
  ) {}

  static async process(turn: Turn): Promise<boolean> {
    switch (turn.state) {
      case COLLECT_ACTIONS:
        await broadcastEvent(new CollectActionsEvent(turn));
        turn.state = TURN_START;
        break;
      case TURN_START:
        await broadcastEvent(new TurnStartEvent(turn));
        turn.state = SELECT_ACTION;
        break;
      case SELECT_ACTION:
        if (!turn.availableActions.length) {
          throw new Error(`There should be actions, though ${turn.actor}`);
        }
        await broadcastEvent(new SelectActionEvent(turn));
        if (!turn.selectedAction) {
          throw new Error(
            "An action was not selected during SelectActionEvent. Someone's sleeping on the job.",
          );
        }
        turn.state = EXECUTE_ACTION;
        break;
      case EXECUTE_ACTION:
        if (!turn.selectedAction) {
          throw new Error("You should have selected an action");
        }
        if (turn.selectedAction instanceof Attack) {
          await broadcastEvent(new SelectTargetsEvent(turn));
        }
        await broadcastEvent(new ExecuteActionEvent(turn.selectedAction));
        turn.state = "TURN_END";
        break;
      case "TURN_END":
        return true;
    }
    return false;
  }
}
