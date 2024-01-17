export const COMPLETE = "COMPLETE";

export abstract class Processable {
  public status: string | typeof COMPLETE

  abstract process(): Promise<void>

  valueOf() {
    return this.status === COMPLETE ? 1 : 0;
  }
}
