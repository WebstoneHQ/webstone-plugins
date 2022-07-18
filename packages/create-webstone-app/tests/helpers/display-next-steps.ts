import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { Ctx, displayNextSteps } from "../../src/helpers";

const context: Ctx = {
  appDir: "test-dir",
};

test.after(() => {
  sinon.restore();
});

test("displayNextSteps", async () => {
  const fakeConsoleLog = sinon.fake();
  sinon.replace(console, "log", fakeConsoleLog);

  await displayNextSteps(context);
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
