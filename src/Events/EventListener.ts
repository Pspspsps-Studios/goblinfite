import { DefeatEvent } from "./Defeat";
import { HitEvent } from "./Hit";
import { MissEvent } from "./Miss";
import { PreCombatEvent } from "./PreCombat";
import { PreHitEvent } from "./PreHit";
import { TurnStartEvent } from "./TurnStart";
import { WinEvent } from "./Win";

export type Event = 
  DefeatEvent |
  HitEvent |
  MissEvent |
  PreCombatEvent |
  PreHitEvent |
  TurnStartEvent |
  WinEvent;

export interface EventListener {
  handle<T extends Event>(event: T): Promise<void>
}
