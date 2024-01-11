import { Actor } from "../Actors/Actor";
import { DamageInstance } from "../DamageInstance";
import { Event, EventListener } from "../Events/EventListener";

export interface StatusEffect extends EventListener {
  get name(): string,
  valueOf(): number
}
