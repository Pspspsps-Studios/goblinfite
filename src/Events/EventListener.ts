import { DEFEAT, DefeatEvent } from "./Defeat";
import { HIT, HitEvent } from "./Hit";
import { EVADED, EvadeEvent } from "./Evaded";
import { PRE_COMBAT, PreCombatEvent } from "./PreCombat";
import { PRE_HIT, PreHitEvent } from "./PreHit";
import { COLLECT_ACTIONS, CollectActionsEvent } from "./CollectActions";
import { TURN_START, TurnStartEvent } from "./TurnStart";
import { WIN, WinEvent } from "./Win";
import { ActionSelectedEvent, ACTION_SELECTED } from "./ActionSelected";
import { SELECT_ACTION, SelectActionEvent } from "./SelectAction";
import { EXECUTE_ACTION, ExecuteActionEvent } from "./ExecuteAction";
import { SELECT_TARGETS, SelectTargetsEvent } from "./SelectTargets";
import { text } from "@clack/prompts";

export type Event =
  | ActionSelectedEvent
  | CollectActionsEvent
  | DefeatEvent
  | ExecuteActionEvent
  | HitEvent
  | EvadeEvent
  | PreCombatEvent
  | PreHitEvent
  | SelectActionEvent
  | SelectTargetsEvent
  | TurnStartEvent
  | WinEvent;

export interface EventListener {
  handle<T extends Event>(event: T): Promise<void>;
}

// @todo Everything after this isn't good design. It hides portions of the process outside of the normal program flow.
// @todo fuck, the stuff above this might not be good design either.

export async function broadcastEvent(event: Event, index = 0) {
  console.log(event.type, index);
  if (listeners[event.type].length < index) {
    return;
  }
  await listeners[event.type][index]?.handle(event);
  await broadcastEvent(event, index + 1);
}

const listeners: Record<Event["type"], EventListener[]> = {
  [ACTION_SELECTED]: [],
  [DEFEAT]: [],
  [EXECUTE_ACTION]: [],
  [HIT]: [],
  [EVADED]: [],
  [PRE_COMBAT]: [],
  [PRE_HIT]: [],
  [SELECT_ACTION]: [],
  [SELECT_TARGETS]: [],
  [COLLECT_ACTIONS]: [],
  [TURN_START]: [],
  [WIN]: [],
};

export function listen(listener: EventListener, events: Event["type"][]) {
  events.forEach((event) => {
    listeners[event].push(listener);
  });
}

export function clearAllListeners() {
  console.log("REMOVING ALL LISTENERS");
  Object.keys(listeners).forEach(
    (key: string) => (listeners[key as Event["type"]] = []),
  );
}

export function removeListener(listener: EventListener) {
  for (const key of Object.keys(listeners)) {
    const indexOfListener = listeners[key as Event["type"]].indexOf(listener);
    if (indexOfListener !== -1) {
      listeners[key as Event["type"]].splice(indexOfListener, 1);
    }
  }
}
