export function pickRandom<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export function rollDie(faces = 6): number {
  return Math.ceil(Math.random() * faces)
}
