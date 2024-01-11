import { EventListener } from "../Events/EventListener";

export interface StatusEffect extends EventListener {
  get name(): string,
  valueOf(): number
}
