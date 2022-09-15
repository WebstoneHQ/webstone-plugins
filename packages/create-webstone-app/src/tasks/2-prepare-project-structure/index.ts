import fs from "fs-extra";
import path, { dirname } from "path";
import { ListrTask } from "listr2/dist/index";
import { fileURLToPath } from "url";

import { Ctx } from "../../helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const copyTemplate = (ctx: Ctx) => {
  const templateDir = path.join(__dirname, "..", "template");
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
