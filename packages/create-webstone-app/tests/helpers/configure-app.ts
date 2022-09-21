// import fs from "fs-extra";
// import sinon from "sinon";
// import { test } from "uvu";
// import * as assert from "uvu/assert";
// import { Ctx, WebstoneTask } from "../../src/helpers";
// import { copyReadme } from "../../src/tasks/3-configure-app";

// test.after.each(() => {
//   sinon.restore();
// });

// test("Replace existing Readme", async () => {
//   const fakeFsExistsSync = sinon.fake.returns(true);
//   sinon.replace(fs, "existsSync", fakeFsExistsSync);

//   const fakePrompt = sinon.fake.returns(Promise<true>);

//   const fakeListrTask: Partial<WebstoneTask> = {
//     prompt: fakePrompt,
//   };
//   const fakeContext: Ctx = {
//     appDir: "test-app",
//   };

//   await copyReadme(fakeContext, <WebstoneTask>fakeListrTask);
// });
