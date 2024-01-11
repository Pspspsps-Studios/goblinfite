import { DamageInstance } from "./DamageInstance"
import { StatusEffect } from "./StatusEffects/StatusEffect"
import { Sword } from "./Swords/Sword"
import { CombatEncounter } from "./combatLoop"
import { Event, EventListener } from "./Events/EventListener"
import { TURN_START } from "./Events/TurnStart"

export interface Actor extends EventListener {
  get currentHitPoints(): number
  get maxHitPoints(): number
  get inventory(): Sword[]
  get equipped(): Sword
  damage(damageInstance: DamageInstance): void
  applyStatusEffect(statusEffect: StatusEffect): void;
  removeStatusEffectByName(statusEffectName: string): void;
}

export class BaseActor implements Actor {
  protected myMaxHitPoints: number
  protected statusEffects: Record<string, StatusEffect>;
  protected myInventory: Sword[] = []

  constructor(
    protected myCurrentHitPoints: number, 
    protected myEquippedSword: Sword
    ) {
    this.myMaxHitPoints = myCurrentHitPoints;
  }
  
  get currentHitPoints(): number {
    return this.myCurrentHitPoints
  }

  get inventory(): Sword[] {
    return this.myInventory;
  }
  
  get equipped(): Sword {
    return this.myEquippedSword
  }
  
  defend(damageInstance: DamageInstance): void {
    damageInstance.status = "hit"
  }
  
  applyStatusEffect(statusEffect: StatusEffect): void {
    if (statusEffect.name in this.statusEffects) {
      if (+statusEffect > +this.statusEffects[statusEffect.name]) {
        this.statusEffects[statusEffect.name] = statusEffect
      }
    }
    else {
      this.statusEffects[statusEffect.name] = statusEffect;
    }
  }

  removeStatusEffectByName(statusEffectName: string): void {
    delete this.statusEffects[statusEffectName]
  }

  get maxHitPoints() {
    return this.myMaxHitPoints
  }

  damage(damage: DamageInstance) {
    this.myCurrentHitPoints -= damage.amount
  }

  heal(hitpoints: number) {
    this.myCurrentHitPoints = Math.min(this.myCurrentHitPoints + hitpoints, this.myMaxHitPoints)
  }

  async handle<T extends Event>(event: T) {
  }
}