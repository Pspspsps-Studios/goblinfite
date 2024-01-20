import { DamageInstance } from "../DamageInstance";
import { StatusEffect } from "../StatusEffects/StatusEffect";
import { Sword } from "../Swords/Sword";
import { BaseActor } from "./Actor";
import { removeListener } from "../Events/EventListener";
import { HitEvent } from "../Events/Hit";

class TestActor extends BaseActor {
  handle(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

jest.mock("../Events/EventListener", () => ({
  removeListener: jest.fn(),
}));

it("Will know if it's dead", () => {
  const actor = new TestActor(1);
  expect(actor.isDead).toBe(false);
  const deadActor = new TestActor(0);
  expect(deadActor.isDead).toBe(true);
  const reallyDeadActor = new TestActor(-3);
  expect(reallyDeadActor.isDead).toBe(true);
});

it("Will know if it's alive", () => {
  const actor = new TestActor(1);
  expect(actor.isAlive).toBe(true);
  const deadActor = new TestActor(0);
  expect(deadActor.isAlive).toBe(false);
});

it("Will know how many hitpoints it has", () => {
  const actor = new TestActor(1);
  expect(actor.currentHitPoints).toBe(1);
});

it("Will know what its maximum hitpoints are", () => {
  const actor = new TestActor(3);
  expect(actor.maxHitPoints).toBe(3);
});

it("Will know what it has in its inventory", () => {
  const actor = new TestActor(3);
  expect(actor.inventory).toStrictEqual([]);
});

it("Will know what it has equipped", () => {
  const actor = new TestActor(3);
  expect(actor.equipped).toBe(null);
});

it("Will know what status effects it has", () => {
  const actor = new TestActor(3);
  expect(actor.statusEffects).toStrictEqual({});
});

it("Will be able to add swords to its inventory", () => {
  const actor = new TestActor(3);
  const sword = { owner: null } as Sword;
  actor.pickUp(sword);
  expect(actor.inventory).toStrictEqual([sword]);
});

it("Will be able to equip swords", () => {
  const actor = new TestActor(3);
  const sword = { owner: null } as Sword;
  actor.equip(sword);
  expect(actor.equipped).toBe(sword);
});

it("Will have new status effects applied", () => {
  const actor = new TestActor(3);
  const statusEffect = {
    name: "test",
    valueOf() {
      return 0;
    },
  } as StatusEffect;
  actor.applyStatusEffect(statusEffect);
  expect(actor.statusEffects).toStrictEqual({ test: statusEffect });
});

it("Will not apply a lower value status effect", () => {
  const actor = new TestActor(3);
  const mediumStatusEffect = {
    name: "test",
    valueOf() {
      return 2;
    },
  } as StatusEffect;
  actor.applyStatusEffect(mediumStatusEffect);
  const lowStatusEffect = {
    name: "test",
    valueOf() {
      return 1;
    },
  } as StatusEffect;
  actor.applyStatusEffect(lowStatusEffect);
  expect(actor.statusEffects).toStrictEqual({ test: mediumStatusEffect });
});

it("Will apply a higher value status effect", () => {
  const actor = new TestActor(3);
  const mediumStatusEffect = {
    name: "test",
    valueOf() {
      return 2;
    },
  } as StatusEffect;
  actor.applyStatusEffect(mediumStatusEffect);
  const highStatusEffect = {
    name: "test",
    valueOf() {
      return 3;
    },
  } as StatusEffect;
  actor.applyStatusEffect(highStatusEffect);
  expect(actor.statusEffects).toStrictEqual({ test: highStatusEffect });
});

it("Will remove a status effect by name", () => {
  const actor = new TestActor(3);
  const statusEffect = {
    name: "test",
    valueOf() {
      return 0;
    },
  } as StatusEffect;
  actor.applyStatusEffect(statusEffect);
  actor.removeStatusEffectByName("test");
  expect(actor.statusEffects).toStrictEqual({});
});

it("Will apply damage to itself", () => {
  const actor = new TestActor(3);
  actor.damage({ amount: 2 } as DamageInstance);
  expect(actor.currentHitPoints).toBe(1);
});

it("Will heal itself", () => {
  const actor = new TestActor(3);
  actor.damage({ amount: 2 } as DamageInstance);
  actor.heal(1);
  expect(actor.currentHitPoints).toBe(2);
});

it("Will not heal more than its maximum hitpoints", () => {
  const actor = new TestActor(3);
  actor.damage({ amount: 2 } as DamageInstance);
  actor.heal(1000);
  expect(actor.currentHitPoints).toBe(3);
});

it("Will stop listening when it dies", () => {
  const actor = new TestActor(3);
  actor.die();
  expect(removeListener).toHaveBeenCalledWith(actor);
});

it("Will stop its status effects from listening when it dies", () => {
  const actor = new TestActor(3);
  const statusEffect = {
    name: "test",
    valueOf() {
      return 0;
    },
  } as StatusEffect;
  actor.applyStatusEffect(statusEffect);
  actor.die();
  expect(removeListener).toHaveBeenCalledWith(statusEffect);
});

it("Will stop its swords from listening when it dies", () => {
  const actor = new TestActor(3);
  const sword = { owner: null } as Sword;
  actor.pickUp(sword);
  actor.die();
  expect(removeListener).toHaveBeenCalledWith(sword);
});

it("Will take damage from hit events", () => {
  const actor = new TestActor(3);
  actor.onHit({
    damageInstance: { amount: 2, target: actor },
  } as unknown as HitEvent);
  expect(actor.currentHitPoints).toBe(1);
});

it("Will ignore hit events not targeting it", () => {
  const actor = new TestActor(3);
  actor.onHit({
    damageInstance: { amount: 2, target: {} },
  } as unknown as HitEvent);
  expect(actor.currentHitPoints).toBe(3);
});
