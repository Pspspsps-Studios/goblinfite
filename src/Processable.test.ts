import { COMPLETE, Processable } from "./Processable";

class TestProcess extends Processable {
  constructor(protected processFn: () => string) {
    super();
  }

  async process() {
    this.status = this.processFn();
  }
}

it("Will run a process to COMPLETE", async () => {
  const states = ["WORKING", "FINISHING", COMPLETE];
  const runOnceEachState = jest.fn(() => states.shift());
  const process = new TestProcess(runOnceEachState);
  process.status = "START";

  await process.runProcess();
  expect(runOnceEachState).toHaveBeenCalledTimes(3);
});

it("Will know if it's complete", () => {
  const process = new TestProcess(() => "");
  process.status = "Not Complete";
  expect(process.isComplete).toBeFalsy();
  process.status = COMPLETE;
  expect(process.isComplete).toBeTruthy();
});
