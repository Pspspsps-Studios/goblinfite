import { Actor } from "./Actor";
import { DamageInstance } from "./DamageInstance";
import { CombatEncounter } from "./combatLoop";


export interface EventHandler {
  onEvade(damageInstance: DamageInstance): void
  onPickup(actor: Actor): void
  onDiscard(actor: Actor): void
  onEquip(actor: Actor): void
  onUnEquip(actor: Actor): void;
  onCombatStart(combat: CombatEncounter): void
  onCombatEnd(combat: CombatEncounter): void
}
