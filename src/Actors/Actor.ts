import { DamageInstance } from "../DamageInstance"
import { StatusEffect } from "../StatusEffects/StatusEffect"
import { Sword } from "../Swords/Sword"
import { Event, EventListener, removeListener } from "../Events/EventListener"
import { HitEvent } from "../Events/Hit"
import { PreHitEvent } from "../Events/PreHit"

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
  protected myStatusEffects: Record<string, StatusEffect> = {};
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

  get maxHitPoints(): number {
    return this.myMaxHitPoints
  }

  get inventory(): Sword[] {
    return this.myInventory;
  }
  
  get equipped(): Sword | null {
    return this.myEquippedSword
  }

  get statusEffects(): Record<string, StatusEffect> {
    return this.myStatusEffects
  }

  pickUp(sword: Sword) {
    sword.owner = this;
    this.myInventory.push(sword)
  }
  
  equip(sword: Sword) {
    this.myEquippedSword = sword
  }

  defend(damageInstance: DamageInstance): void {
    damageInstance.status = "hit"
  }
  
  applyStatusEffect(statusEffect: StatusEffect): void {
    // @todo The override needs to also unlist one of the status effects.
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
    removeListener(this.statusEffects[statusEffectName])
    delete this.statusEffects[statusEffectName]
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

  onHit(event: HitEvent) {
    if (event.damageInstance.target === this) {
      this.damage(event.damageInstance)
    }
  }

  onPreHit(event: PreHitEvent) {
    if (event.damageInstance.target === this && event.damageInstance.status === "created") {
      event.damageInstance.status = "hit"
    }
  }

  die() {
    removeListener(this)
    Object.keys(this.myStatusEffects).forEach(key => this.removeStatusEffectByName(key))
    this.inventory.forEach(sword => removeListener(sword))
    this.myStatusEffects = {}
  }
}
