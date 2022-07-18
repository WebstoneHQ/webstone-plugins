import fs from "fs-extra";
import path from "path";
import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { Ctx } from "../../src/helpers";
import { copyTemplate } from "../../src/tasks/2-prepare-project-structure";

const context: Ctx = {
  appDir: "test-dir",
};

test.after.each(() => {
  sinon.restore();
});

test("copy the template to the correct location", async () => {
  const fakePathJoin = sinon.fake.returns("../template");
  sinon.replace(path, "join", fakePathJoin);

  const fakeFsCopySync = sinon.fake();
  sinon.replace(fs, "copySync", fakeFsCopySync);

  copyTemplate(context);
  assert.is(fakeFsCopySync.firstCall.firstArg, "../template");
  assert.is(fakeFsCopySync.firstCall.lastArg, "test-dir");
});

test.run();
