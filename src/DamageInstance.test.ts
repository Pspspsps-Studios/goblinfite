import { Actor } from "./Actors/Actor";
import { DamageInstance, TRUE_DAMAGE_TYPE } from "./DamageInstance";
import { EVADE, EvadeEvent } from "./Events/Evaded";
import { EventListener, emit } from "./Events/EventListener";
import { HIT, HitEvent } from "./Events/Hit";
import { PreHitEvent } from "./Events/PreHit";
import { COMPLETE } from "./Processable";

jest.mock("./Events/EventListener", () => ({
  emit: jest.fn(),
}));

it("Will create a new damage instance", () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
  );
  expect(damageInstance).toBeInstanceOf(DamageInstance);
});

it("Will emit PRE_HIT when created", async () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
  );
  await damageInstance.process();
  expect(emit).toHaveBeenCalledWith(new PreHitEvent(damageInstance));
});

it("Will change its state to HIT if no listener changes its state", async () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
  );
  await damageInstance.process();
  expect(damageInstance.status).toBe(HIT);
});

it("Will emit EVADE when evaded", async () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
    false,
    EVADE,
  );
  await damageInstance.process();
  expect(emit).toHaveBeenCalledWith(new EvadeEvent(damageInstance));
});

it("Will change its state to COMPLETE after EVADE", async () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
    false,
    EVADE,
  );
  await damageInstance.process();
  expect(damageInstance.status).toBe(COMPLETE);
});

it("Will emit HIT when hit", async () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
    false,
    HIT,
  );
  await damageInstance.process();
  expect(emit).toHaveBeenCalledWith(new HitEvent(damageInstance));
});

it("Will change its state to COMPLETE after HIT", async () => {
  const damageInstance = new DamageInstance(
    3,
    TRUE_DAMAGE_TYPE,
    {} as EventListener,
    {} as Actor,
    false,
    HIT,
  );
  await damageInstance.process();
  expect(damageInstance.status).toBe(COMPLETE);
});
