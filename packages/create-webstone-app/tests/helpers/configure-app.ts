import fs from "fs-extra";
import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { Ctx } from "../../src/helpers";
import { copyReadme } from "../../src/tasks/3-configure-app/application";

test.after.each(() => {
  sinon.restore();
});

test("Check if Readme gets replaced", async () => {
  const fakeCopySync = sinon.fake();
  sinon.replace(fs, "copySync", fakeCopySync);

  const fakeContext: Ctx = {
    appDir: "test-app",
  };

  await copyReadme(fakeContext);

  assert.is(fakeCopySync.callCount, 1);
  assert.ok(
    (fakeCopySync.firstCall.args[0] as string).includes("template/README.md")
  );
});
