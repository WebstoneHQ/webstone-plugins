import fs from "fs-extra";
import path, { dirname } from "path";
import { ListrTask } from "listr2/dist/index";
import { fileURLToPath } from "url";
import { temporaryDirectory } from "tempy";

const ignorePaths = [
  "node_modules",
  "build",
  ".svelte-kit",
  "package",
  "package-lock.json",
  "yarn.lock",
];

import { Ctx } from "../../helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const copyTemplate = (ctx: Ctx) => {
  if (ctx.isSveltekit) {
    ctx.tempDir = temporaryDirectory({ prefix: "webstone" });
    ctx.webAppDir = `${ctx.appDir}/services/web`;
    ignorePaths.forEach((pathString: string) => {
      fs.existsSync(path.join(ctx.appDir, pathString)) &&
        fs.rmdirSync(path.join(ctx.appDir, pathString));
    });
    fs.moveSync(ctx.appDir, ctx.tempDir, { overwrite: true });
  }
  const templateDir = path.join(__dirname, "../../..", "template");
  fs.copySync(templateDir, ctx.appDir);
};

const createCopyTemplateTasks: ListrTask[] = [
  {
    task: copyTemplate,
    title: "Copying the template",
    options: { persistentOutput: true },
  },
];

export const tasks: ListrTask[] = [
  {
    task(_, task) {
      return task.newListr(createCopyTemplateTasks);
    },
    title: "Preparing the project structure",
  },
];
