import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { displayNextSteps } from "../../src/helpers";

test.after(() => {
  sinon.restore();
});

test("displayNextSteps", async () => {
  const fakeConsoleLog = sinon.fake();
  sinon.replace(console, "log", fakeConsoleLog);

  await displayNextSteps("test-dir");
  assert.ok(fakeConsoleLog.calledOnce);
  assert.ok(
    (fakeConsoleLog.firstCall.firstArg as string).includes(
      "https://github.com/WebstoneHQ/webstone"
    )
  );
  assert.ok(
    (fakeConsoleLog.firstCall.firstArg as string).includes(
      "https://discord.gg/NJRm6eRs"
    )
  );
  assert.ok(
    (fakeConsoleLog.firstCall.firstArg as string).includes("cd test-dir")
  );
});

test.run();
