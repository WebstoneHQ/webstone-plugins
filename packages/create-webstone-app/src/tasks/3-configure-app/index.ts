import fs from "fs-extra";
import { ListrTask } from "listr2";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Ctx } from "../../helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const copyReadme = async (ctx: Ctx) => {
  const templateDir = path.join(__dirname, "..", "template/README.md");
  fs.copySync(templateDir, `${ctx.appDir}/README.md`);
};

const configureApp: ListrTask[] = [
  {
    task: copyReadme,
    title: "Configuring Readme",
  },
];

export const tasks: ListrTask[] = [
  {
    task(_, task) {
      return task.newListr(configureApp);
    },
    title: "Configuring you app",
  },
];
