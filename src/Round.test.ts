import { ENEMY_TURN, PLAYER_TURN, ROUND_BEGIN, Round } from "./Round"
import { CombatEncounter } from "./combatLoop"
import { Turn } from "./Turn"
import { Actor } from "./Actors/Actor"
import { COMPLETE } from "./Processable"

jest.mock("./Turn")

it("Will create a round", () => {
  const round = new Round({} as CombatEncounter)
  expect(round).toBeInstanceOf(Round);
})

it("Will create a turn for an actor", () => {
  const combatEncounter = {} as CombatEncounter
  const round = new Round(combatEncounter)
  const actor = {} as Actor;
  round.createTurn(actor);
  expect(Turn).toHaveBeenCalledWith(actor, combatEncounter)
})

it("Will create a turn for a player", () => {
  const player = {} as Actor;
  const combatEncounter = {player: player} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextPlayerTurn();
  expect(Turn).toHaveBeenCalledWith(player, combatEncounter)
  expect(round.status).toBe(PLAYER_TURN)
})

it("Will create a turn for an enemy", () => {
  const enemy = {isAlive: true} as Actor;
  const combatEncounter = {enemies: [enemy]} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextEnemyTurn();
  expect(Turn).toHaveBeenCalledWith(enemy, combatEncounter)
  expect(round.status).toBe(ENEMY_TURN)
})

it("Will skip turns for dead enemies", () => {
  const deadEnemy = {isAlive: false} as Actor;
  const aliveEnemy = {isAlive: true} as Actor;
  const combatEncounter = {enemies: [deadEnemy, aliveEnemy]} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextEnemyTurn();
  expect(Turn).toHaveBeenCalledWith(aliveEnemy, combatEncounter)
  expect(round.status).toBe(ENEMY_TURN)
})

it("Will complete the round if all enemies have died", () => {
  const deadEnemy = {isAlive: false} as Actor;
  const combatEncounter = {enemies: [deadEnemy]} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextEnemyTurn();
  expect(round.status).toBe(COMPLETE)
})

it("Will give multiple enemies turns", () => {
  const enemy1 = {isAlive: true} as Actor;
  const enemy2 = {isAlive: true} as Actor;
  const combatEncounter = {enemies: [enemy1, enemy2]} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextEnemyTurn();
  expect(Turn).toHaveBeenCalledWith(enemy1, combatEncounter)
  round.setupNextEnemyTurn();
  expect(Turn).toHaveBeenCalledWith(enemy2, combatEncounter)
})

it("Will start the player turn when the round begins", async () => {
  const combatEncounter = {player: {}} as CombatEncounter
  const round = new Round(combatEncounter)
  round.status = ROUND_BEGIN;
  await round.process()
  expect(Turn).toHaveBeenCalledWith(combatEncounter.player, combatEncounter)
  expect(round.status).toBe(PLAYER_TURN)
})

it("Will run the current turn when it's the player's turn", async () => {
  const player = {isDead: false} as Actor
  const combatEncounter = {player} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextPlayerTurn()
  await round.process()
  expect(round.currentTurn.runProcess).toHaveBeenCalled()
})

it("Will run the current turn when it's the enemy's turn", async () => {
  const enemy = {isAlive: true} as Actor
  const player = {isDead: false} as Actor
  const combatEncounter = {player, enemies: [enemy]} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextEnemyTurn()
  await round.process()
  expect(round.currentTurn.runProcess).toHaveBeenCalled()
})

it("Will end the round if the player is dead", async () => {
  const enemy = {isAlive: true} as Actor
  const player = {isDead: true} as Actor
  const combatEncounter = {player, enemies: [enemy]} as CombatEncounter
  const round = new Round(combatEncounter)
  round.setupNextEnemyTurn()
  await round.process()
  expect(round.status).toBe(COMPLETE)
})
