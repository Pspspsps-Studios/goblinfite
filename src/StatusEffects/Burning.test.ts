import { listen } from "../Events/EventListener";
import { Actor } from "../Actors/Actor";
import { Burning } from "./Burning";
import { TURN_START, TurnStartEvent } from "../Events/TurnStart";
import { DamageInstance } from "../DamageInstance";

jest.mock("../Events/EventListener", () => ({ listen: jest.fn() }));
jest.mock("../DamageInstance");

const mockActor = {} as Actor;

it("Will register its listeners", () => {
  const effect = new Burning(4, mockActor);
  expect(listen).toHaveBeenCalledWith(effect, [TURN_START]);
});

it("Will return its level", () => {
  const effect = new Burning(4, mockActor);
  expect(effect.level).toBe(4);
});

it("Will return its level as its value", () => {
  const effect = new Burning(4, mockActor);
  expect(+effect).toBe(4);
});

it("Will return its name", () => {
  const effect = new Burning(4, mockActor);
  expect(effect.name).toBe("Burning");
});

it("Will process damage at the start of the actor's turn", async () => {
  const effect = new Burning(4, mockActor);
  await effect.handle({
    type: TURN_START,
    turn: { actor: mockActor },
  } as TurnStartEvent);
  expect(DamageInstance).toHaveBeenCalledWith(
    4,
    ["FIRE_DAMAGE_TYPE"],
    effect,
    mockActor,
  );
});

it("Will decrement its damage at the start of the actor's turn", async () => {
  const effect = new Burning(4, mockActor);
  await effect.handle({
    type: TURN_START,
    turn: { actor: mockActor },
  } as TurnStartEvent);
  expect(effect.level).toBe(3);
});
