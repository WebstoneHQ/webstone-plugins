import fs from "fs-extra";
import path from "path";
import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { copyTemplate } from "../../src/helpers";

test.after.each(() => {
  sinon.restore();
});

test("copy the template to the correct location", () => {
  const fakePathJoin = sinon.fake.returns("../template");
  sinon.replace(path, "join", fakePathJoin);

  const fakeFsCopySync = sinon.fake();
  sinon.replace(fs, "copySync", fakeFsCopySync);

  const appDir = copyTemplate("test-dir");
  assert.is(appDir, "test-dir");
  assert.is(fakeFsCopySync.firstCall.firstArg, "../template");
  assert.is(fakeFsCopySync.firstCall.lastArg, "test-dir");
});

test.run();
