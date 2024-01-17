export const COMPLETE = "COMPLETE";

export abstract class Processable {
  public status: string | typeof COMPLETE

  abstract process(): Promise<void>

  async runProcess() {
    await this.process()
    if (this.status !== COMPLETE) {
      await this.runProcess()
    }
  }
}
