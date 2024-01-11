import { DamageInstance } from "../DamageInstance"
import { StatusEffect } from "../StatusEffects/StatusEffect"
import { Sword } from "../Swords/Sword"
import { Event, EventListener, removeListener } from "../Events/EventListener"

export interface Actor extends EventListener {
  get currentHitPoints(): number
  get maxHitPoints(): number
  get inventory(): Sword[]
  get equipped(): Sword | null
  get isDead(): boolean
  get isAlive(): boolean
  damage(damageInstance: DamageInstance): void
  applyStatusEffect(statusEffect: StatusEffect): void;
  removeStatusEffectByName(statusEffectName: string): void;
}

export class BaseActor implements Actor {
  protected myCurrentHitPoints: number
  protected statusEffects: Record<string, StatusEffect> = {};
  protected myInventory: Sword[] = []
  protected myEquippedSword: Sword | null = null;

  constructor(
    protected myMaxHitPoints: number, 
    ) {
    this.myCurrentHitPoints = myMaxHitPoints;
  }

  get isDead(): boolean {
    return this.myCurrentHitPoints <= 0;
  }

  get isAlive(): boolean {
    return this.myCurrentHitPoints > 0;
  }
  
  get currentHitPoints(): number {
    return this.myCurrentHitPoints
  }

  get inventory(): Sword[] {
    return this.myInventory;
  }
  
  get equipped(): Sword | null {
    return this.myEquippedSword
  }

  pickUp(sword: Sword) {
    this.myInventory.push(sword)
  }
  
  equip(sword: Sword) {
    this.myEquippedSword = sword
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
    if (this.myCurrentHitPoints <= 0) {
      this.die()
    }
  }

  heal(hitpoints: number) {
    this.myCurrentHitPoints = Math.min(this.myCurrentHitPoints + hitpoints, this.myMaxHitPoints)
  }

  async handle<T extends Event>(event: T) {
  }

  die() {
    removeListener(this)
  }
}
