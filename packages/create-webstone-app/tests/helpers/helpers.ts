import sinon from "sinon";
import { test } from "uvu";
import * as assert from "uvu/assert";
import fs from "fs-extra";
import { isSveltekit } from "../../src/helpers";

test.before.each(() => {
  sinon.replace(console, "log", sinon.fake());
});

test.after.each(() => {
  sinon.restore();
});

test("successfully recognize Sveltekit app", async () => {
  const fakePackageJson = {
    devDependencies: {
      "@sveltejs/kit": "1.0.0",
    },
  };
  const fakeReadJsonSync = sinon.fake.returns(fakePackageJson);
  const fakeExists = sinon.fake.returns(true);

  sinon.replace(fs, "readJsonSync", fakeReadJsonSync);
  sinon.replace(fs, "existsSync", fakeExists);

  assert.equal(isSveltekit("testapp"), true);
});

test("recognize, that project is not a sveltekit app", async () => {
  const fakePackageJson = {
    devDependencies: {
      react: "16.8.6",
    },
  };

  const fakeExists = sinon.fake.returns(true);
  const fakeReadJsonSync = sinon.fake.returns(fakePackageJson);
  sinon.replace(fs, "readJsonSync", fakeReadJsonSync);
  sinon.replace(fs, "existsSync", fakeExists);

  assert.equal(isSveltekit("testapp"), false);
});

test("no package.json provided", async () => {
  const fakeExists = sinon.fake.returns(true);
  sinon.replace(fs, "existsSync", fakeExists);

  assert.equal(isSveltekit("testapp"), false);
});

test.run();
