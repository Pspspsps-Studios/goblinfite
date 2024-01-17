import { Actor } from "./Actors/Actor"
import { DamageInstance, TRUE_DAMAGE_TYPE } from "./DamageInstance"
import { EVADE, EvadeEvent } from "./Events/Evaded"
import { EventListener, broadcastEvent } from "./Events/EventListener"
import { HIT, HitEvent } from "./Events/Hit"
import { PreHitEvent } from "./Events/PreHit"
import { COMPLETE } from "./complete"

jest.mock("./Events/EventListener", () => ({
  broadcastEvent: jest.fn()
}))

it("Will create a new damage instance", () => {
  const damageInstance = new DamageInstance(3, TRUE_DAMAGE_TYPE, {} as EventListener, {} as Actor)
  expect(damageInstance).toBeInstanceOf(DamageInstance);
})

it("Will emit PRE_HIT when created", () => {
  const damageInstance = new DamageInstance(3, TRUE_DAMAGE_TYPE, {} as EventListener, {} as Actor)
  DamageInstance.process(damageInstance)
  expect(broadcastEvent).toHaveBeenCalledWith(new PreHitEvent(damageInstance));
})

it("Will change its state to HIT if no listener changes its state", () => {
  const damageInstance = new DamageInstance(3, TRUE_DAMAGE_TYPE, {} as EventListener, {} as Actor)
  DamageInstance.process(damageInstance)
  expect(damageInstance.status).toBe(HIT)
})

it("Will emit EVADE when evaded", () => {
  const damageInstance = new DamageInstance(3, TRUE_DAMAGE_TYPE, {} as EventListener, {} as Actor, false, EVADE)
  DamageInstance.process(damageInstance)
  expect(broadcastEvent).toHaveBeenCalledWith(new HitEvent(damageInstance));
})

it("Will change its state to COMPLETE after EVADE", () => {
  const damageInstance = new DamageInstance(3, TRUE_DAMAGE_TYPE, {} as EventListener, {} as Actor, false, EVADE)
  DamageInstance.process(damageInstance)
  expect(damageInstance.status).toBe(COMPLETE)
})

it("Will emit HIT when hit", () => {
    const damageInstance = new DamageInstance(
      3, TRUE_DAMAGE_TYPE, {} as EventListener, {} as Actor, false, HIT)
    DamageInstance.process(damageInstance)
    expect(broadcastEvent).toHaveBeenCalledWith(new EvadeEvent(damageInstance));
})
