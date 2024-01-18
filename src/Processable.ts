export const COMPLETE = "COMPLETE";

export abstract class Processable {
  public status: string | typeof COMPLETE;
  public state: never;

  get isComplete() {
    return this.status === COMPLETE;
  }

  abstract process(): Promise<void>;

  async runProcess() {
    await this.process();
    if (this.status !== COMPLETE) {
      await this.runProcess();
    }
  }
}
