import { Actor } from "./Actors/Actor"
import { Turn } from "./Turn"
import { CombatEncounter } from "./combatLoop"
import { broadcastEvent } from "./Events/EventListener";
import { COLLECT_ACTIONS, CollectActionsEvent } from "./Events/CollectActions";
import { TURN_START, TurnStartEvent } from "./Events/TurnStart";
import { SELECT_ACTION, SelectActionEvent } from "./Events/SelectAction";
import { EXECUTE_ACTION, ExecuteActionEvent } from "./Events/ExecuteAction";
import { Attack } from "./Actions/Attack";
import { Sword } from "./Swords/Sword";
import { SelectTargetsEvent } from "./Events/SelectTargets";
import { Wait } from "./Actions/Wait";

jest.mock("./Events/EventListener", () => ({
  broadcastEvent: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks()
})

it("Will construct a turn", () => {
  const turn = new Turn({} as Actor, {} as CombatEncounter)
  expect(turn).toBeInstanceOf(Turn)
  expect(turn.state).toBe(COLLECT_ACTIONS)
})

describe("When the turn's state is COLLECT_ACTIONS", () => {
  let turn: Turn;

  beforeEach(() => {
    turn = new Turn({} as Actor, {} as CombatEncounter)
  })

  it("Will emit COLLECT_ACTIONS when its state is COLLECT_ACTIONS", async () => {
    await turn.process()
    expect(broadcastEvent).toHaveBeenCalledWith(new CollectActionsEvent(turn))
  })

  it("Will update its state to start after collecting actions", async () => {
    await turn.process()
    expect(turn.state).toBe(TURN_START)
  })
})

describe("When the turn's state is TURN_START", () => {
  let turn: Turn

  beforeEach(() => {
    turn = new Turn({} as Actor, {} as CombatEncounter)
    turn.state = TURN_START
  })

  it("Will emit TURN_START", async () => {
    await turn.process()
    expect(broadcastEvent).toHaveBeenCalledWith(new TurnStartEvent(turn))
  })

  it("Will change its state to SELECT_ACTION", async () => {
    await turn.process()
    expect(turn.state).toBe(SELECT_ACTION)
  })
})

describe("When the turn's state is SELECT_ACTION", () => {
  let turn: Turn;
  const action = new Attack({} as Sword, 1)

  beforeEach(() => {
    turn = new Turn({} as Actor, {} as CombatEncounter)
    turn.state = SELECT_ACTION;
  })

  it("Will check to see if it has available actions", async () => {
    await expect(async () => await turn.process()).rejects.toThrow("No actions provided to turn")
  })

  it("Will emit SELECT_ACTION", async () => {
    turn.availableActions.push(action)
    turn.selectedAction = action
    await turn.process()
    expect(broadcastEvent).toHaveBeenCalledWith(new SelectActionEvent(turn))
  })

  it("Will check to see if an action was selected", async () => {
    turn.availableActions.push(action)
    await expect(async () => await turn.process()).rejects.toThrow("No action selected")
  })
  
  it("Will change its state to EXECUTE_ACTION", async () => {
    turn.availableActions.push(action)
    turn.selectedAction = action
    await turn.process()
    expect(turn.state).toBe(EXECUTE_ACTION)
  })
})

describe("When the turn's state is EXECUTE_ACTION", () => {
  let turn: Turn
  const attackAction = new Attack({} as Sword, 1);
  const waitAction = new Wait()

  beforeEach(() => {
    turn = new Turn({} as Actor, {} as CombatEncounter)
    turn.availableActions.push(attackAction, waitAction)
    turn.state = EXECUTE_ACTION;
  })

  it("Will emit SELECT_TARGETS and EXECUTE_ACTION if the action is targetable", async () => {
    turn.selectedAction = attackAction
    await turn.process()
    expect(broadcastEvent).toHaveBeenCalledWith(new SelectTargetsEvent(turn))
    expect(broadcastEvent).toHaveBeenCalledWith(new ExecuteActionEvent(attackAction))
  })

  it("Will only emit EXECUTE_ACTION if the action is not targetable", async () => {
    turn.selectedAction = waitAction;
    await turn.process()
    expect(broadcastEvent).toHaveBeenCalledWith(new ExecuteActionEvent(waitAction))
  })
})