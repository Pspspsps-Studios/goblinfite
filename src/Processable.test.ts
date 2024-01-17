import { COMPLETE, Processable } from "./Processable";

class TestProcess extends Processable {
  constructor(protected processFn: () => string) {
    super()
  }

  async process() {
    this.status = this.processFn()
  }
}

it("Will run a process to COMPLETE", async () => {
  const states = ["START", "WORKING", "WORKING", COMPLETE]
  const processFn = jest.fn(() => states.shift())
  const process = new TestProcess(processFn)
  process.status = states.shift();
  await process.runProcess()
  expect(processFn).toHaveBeenCalledTimes(3)
})