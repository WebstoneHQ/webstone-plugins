import fs from "fs-extra";
import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { Ctx, WebstoneTask } from "../../src/helpers";
import { createAppDir } from "../../src/tasks/1-create-app-directory";

test.before.each(() => {
  sinon.replace(console, "log", sinon.fake());
});

test.after.each(() => {
  sinon.restore();
});

test("app dir does not exist, no app dir provided", async () => {
  const fakeListrTask: Partial<WebstoneTask> = {
    output: "",
  };

  const fakeContext: Ctx = {
    appDir: ".",
  };

  const fakeFsExistsSync = sinon.fake.returns(false);
  sinon.replace(fs, "existsSync", fakeFsExistsSync);

  const fakeFsMkdirSync = sinon.fake();
  sinon.replace(fs, "mkdirSync", fakeFsMkdirSync);

  const originalProcessArgv2 = process.argv[2];
  process.argv[2] = undefined;

  try {
    const appDir = await createAppDir(
      fakeContext,
      fakeListrTask as WebstoneTask
    );
    assert.is(appDir, ".");
  } finally {
    process.argv[2] = originalProcessArgv2;
  }

  assert.is(fakeFsExistsSync.firstCall.firstArg, ".");
  assert.is(fakeFsMkdirSync.firstCall.firstArg, ".");
  assert.equal(fakeFsMkdirSync.firstCall.lastArg, { recursive: true });
});

test("app dir does not exist, app dir with space", async () => {
  const fakeListrTask: Partial<WebstoneTask> = {
    output: "",
  };

  const fakeContext: Ctx = {
    appDir: "test-app",
  };
  const fakeFsExistsSync = sinon.fake.returns(false);
  sinon.replace(fs, "existsSync", fakeFsExistsSync);

  const fakeFsMkdirSync = sinon.fake();
  sinon.replace(fs, "mkdirSync", fakeFsMkdirSync);

  const appDir = await createAppDir(fakeContext, fakeListrTask as WebstoneTask);
  assert.is(appDir, "test-app");
  assert.is(fakeFsExistsSync.firstCall.firstArg, "test-app");
  assert.is(fakeFsMkdirSync.firstCall.firstArg, "test-app");
  assert.equal(fakeFsMkdirSync.firstCall.lastArg, { recursive: true });
});

test("app dir does not exist", async () => {
  const fakeListrTask: Partial<WebstoneTask> = {
    output: "",
  };

  const fakeContext: Ctx = {
    appDir: "test-app",
  };

  const fakeFsExistsSync = sinon.fake.returns(false);
  sinon.replace(fs, "existsSync", fakeFsExistsSync);

  const fakeFsMkdirSync = sinon.fake();
  sinon.replace(fs, "mkdirSync", fakeFsMkdirSync);

  const appDir = await createAppDir(fakeContext, fakeListrTask as WebstoneTask);
  assert.is(appDir, "test-app");
  assert.is(fakeFsExistsSync.firstCall.firstArg, "test-app");
  assert.is(fakeFsMkdirSync.firstCall.firstArg, "test-app");
  assert.equal(fakeFsMkdirSync.firstCall.lastArg, { recursive: true });
});

test("app dir exists and is empty", async () => {
  const fakeListrTask: Partial<WebstoneTask> = {
    output: "",
  };

  const fakeContext: Ctx = {
    appDir: "test-app",
  };

  const fakeFsExistsSync = sinon.fake.returns(true);
  sinon.replace(fs, "existsSync", fakeFsExistsSync);

  const fakeFsReaddirSync = sinon.fake.returns([]);
  sinon.replace(fs, "readdirSync", fakeFsReaddirSync);

  const fakeFsMkdirSync = sinon.fake();
  sinon.replace(fs, "mkdirSync", fakeFsMkdirSync);

  const appDir = await createAppDir(fakeContext, fakeListrTask as WebstoneTask);
  assert.is(appDir, "test-app");
  assert.is(fakeFsReaddirSync.firstCall.firstArg, "test-app");
  assert.is(fakeFsMkdirSync.firstCall.firstArg, "test-app");
  assert.equal(fakeFsMkdirSync.firstCall.lastArg, { recursive: true });
});

test("app dir exists and is not empty, overwrite it", async () => {
  const fakeListrPrompt = sinon.fake.returns(true);
  const fakeListrTask: Partial<WebstoneTask> = {
    output: "",
    prompt: fakeListrPrompt,
  };

  const fakeContext: Ctx = {
    appDir: "test-app",
  };
  const fakeFsExistsSync = sinon.fake.returns(true);
  sinon.replace(fs, "existsSync", fakeFsExistsSync);

  const fakeFsReaddirSync = sinon.fake.returns([
    "dummy-file-to-fake-a-non-empty-directory",
  ]);
  sinon.replace(fs, "readdirSync", fakeFsReaddirSync);

  const fakeFsMkdirSync = sinon.fake();
  sinon.replace(fs, "mkdirSync", fakeFsMkdirSync);

  const appDir = await createAppDir(fakeContext, fakeListrTask as WebstoneTask);
  assert.is(appDir, "test-app");
  assert.equal(fakeListrPrompt.firstCall.firstArg, {
    type: "confirm",
    message: `The ./test-app directory is not empty. Do you want to overwrite it?`,
    initial: false,
  });
  assert.is(fakeFsMkdirSync.firstCall.firstArg, "test-app");
  assert.equal(fakeFsMkdirSync.firstCall.lastArg, { recursive: true });
});

test("app dir exists and is not empty, do not overwrite it", async () => {
  const fakeListrPrompt = sinon.fake.returns(false);
  const fakeListrTask: Partial<WebstoneTask> = {
    output: "",
    prompt: fakeListrPrompt,
  };

  const fakeContext: Ctx = {
    appDir: "test-app",
  };
  const fakeFsExistsSync = sinon.fake.returns(true);
  sinon.replace(fs, "existsSync", fakeFsExistsSync);

  const fakeFsReaddirSync = sinon.fake.returns([
    "dummy-file-to-fake-a-non-empty-directory",
  ]);
  sinon.replace(fs, "readdirSync", fakeFsReaddirSync);

  try {
    await createAppDir(fakeContext, fakeListrTask as WebstoneTask);
    assert.unreachable();
  } catch (error) {
    assert.is(
      error.message,
      `Exiting, please empty the ./test-app directory or choose a different one to create the Webstone app.`
    );
  }
});

test.run();
