import fs from "fs-extra";
import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import JSON5 from "json5";
import { Ctx } from "../../src/helpers";
import {
  copyFiles,
  adjustConfigFiles,
} from "../../src/tasks/3-configure-app/plugin";

test.after.each(() => {
  sinon.restore();
});

test("Check if tsconfig gets replaced", async () => {
  const fakeCopySync = sinon.fake();
  sinon.replace(fs, "copySync", fakeCopySync);

  const fakeContext: Partial<Ctx> = {
    appDir: "test-app",
  };

  await copyFiles(<Ctx>fakeContext);

  assert.is(fakeCopySync.callCount, 4);
  assert.ok(fakeCopySync.firstCall.args[0].endsWith("tsconfig.json"));
  assert.ok(fakeCopySync.firstCall.args[1].endsWith("tsconfig.cli.json"));
  assert.ok(fakeCopySync.secondCall.args[0].endsWith("command.ts"));
  assert.ok(fakeCopySync.secondCall.args[1].endsWith("command.ts"));
  assert.ok(fakeCopySync.thirdCall.args[0].endsWith("extension.ts"));
  assert.ok(fakeCopySync.thirdCall.args[1].endsWith("extension.ts"));
  assert.ok(fakeCopySync.getCall(3).args[0].endsWith("package.json"));
  assert.ok(fakeCopySync.getCall(3).args[1].endsWith("package.json"));
});

test("Check if package.json & tsconfig are modified", async () => {
  const fakeContext: Partial<Ctx> = {
    appDir: "test-app",
  };

  const fakeReadJSON = sinon.fake.returns(
    Promise.resolve({
      scripts: {
        build: "vite build",
      },
    })
  );

  sinon.replace(fs, "readJSON", fakeReadJSON);

  const fakeWriteJSON = sinon.fake();
  sinon.replace(fs, "writeJSON", fakeWriteJSON);

  const fakeWriteFile = sinon.fake();

  const fakeReadFile = sinon.fake.returns(
    Promise.resolve(
      {
        exclude: ["./node_modules/**", "./svelte-kit/[!ambient.d.ts]**"],
      }.toString()
    )
  );

  const fakeJSON5Parse = sinon.fake.returns({
    exclude: ["./node_modules/**", "./svelte-kit/[!ambient.d.ts]**"],
  });
  sinon.replace(JSON5, "parse", fakeJSON5Parse);

  sinon.replace(fs, "writeFile", fakeWriteFile);
  sinon.replace(fs, "readFile", fakeReadFile);

  await adjustConfigFiles(<Ctx>fakeContext);

  assert.is(fakeWriteJSON.callCount, 1);
  assert.ok(fakeWriteJSON.firstCall.args[0].endsWith("package.json"));
  assert.ok(
    fakeWriteJSON.firstCall.args[1].scripts.build.endsWith(
      "&& tsc -p tsconfig.cli.json"
    )
  );

  assert.is(fakeWriteFile.callCount, 1);
  assert.ok(fakeWriteFile.firstCall.args[0].endsWith("tsconfig.json"));
  assert.ok(fakeWriteFile.firstCall.args[1].includes("./src/lib/cli/**/*"));
});
