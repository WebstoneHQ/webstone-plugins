import sinon from "sinon";
import { test } from "uvu";
import fs from "fs-extra";
import * as assert from "uvu/assert";
import {
  copyTemplate,
  renameCliPackage,
  renameMainPackage,
} from "../../src/tasks/2-setup-project/plugin";

import { Ctx } from "../../src/helpers";

test.after.each(() => {
  sinon.restore();
});

test("Check if the plugin template gets copied properly", async () => {
  const fakeContext: Ctx = {
    appDir: "dummy",
    type: "plugin",
  };
  const fakeCopySync = sinon.fake();
  sinon.replace(fs, "copySync", fakeCopySync);

  copyTemplate(fakeContext);

  assert.is(fakeCopySync.callCount, 1);
  assert.ok(
    (fakeCopySync.firstCall.args[0] as string).includes(
      "templates/plugin/structure",
    ),
  );
});

test("Check if the cli package gets renamed properly", async () => {
  const fakeContext: Ctx = {
    appDir: "dummy",
    type: "plugin",
  };
  const fakeReadJSONSync = sinon.fake.returns({
    name: "webstone-plugin-placeholder-cli",
  });
  const fakeWriteJSONSync = sinon.fake();
  sinon.replace(fs, "readJSONSync", fakeReadJSONSync);
  sinon.replace(fs, "writeJSONSync", fakeWriteJSONSync);

  renameCliPackage(fakeContext);

  assert.is(fakeReadJSONSync.callCount, 1);
  assert.ok(
    (fakeReadJSONSync.firstCall.args[0] as string).includes(
      "packages/cli/package.json",
    ),
  );
  assert.is(fakeWriteJSONSync.callCount, 1);
  assert.ok(
    (fakeWriteJSONSync.firstCall.args[0] as string).includes(
      "packages/cli/package.json",
    ),
  );
  assert.is(
    fakeWriteJSONSync.firstCall.args[1].name,
    "webstone-plugin-dummy-cli",
  );
});

test("Check if the main package gets renamed properly", async () => {
  const fakeContext: Ctx = {
    appDir: "dummy",
    type: "plugin",
  };
  const fakeReadJSONSync = sinon.fake.returns({
    name: "webstone-plugin-placeholder",
  });
  const fakeWriteJSONSync = sinon.fake();

  sinon.replace(fs, "readJSONSync", fakeReadJSONSync);
  sinon.replace(fs, "writeJSONSync", fakeWriteJSONSync);

  renameMainPackage(fakeContext);

  assert.is(fakeReadJSONSync.callCount, 1);
  assert.ok(
    (fakeReadJSONSync.firstCall.args[0] as string).includes("package.json"),
  );
  assert.is(fakeWriteJSONSync.callCount, 1);
  assert.ok(
    (fakeWriteJSONSync.firstCall.args[0] as string).includes("package.json"),
  );
  assert.is(fakeWriteJSONSync.firstCall.args[1].name, "webstone-plugin-dummy");
});

test.run();
