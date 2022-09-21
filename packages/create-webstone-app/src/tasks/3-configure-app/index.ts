import fs from "fs-extra";
import { ListrTask } from "listr2";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Ctx, WebstoneTask } from "../../helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

const copyReadme = async (ctx: Ctx, task: WebstoneTask) => {
  const hasReadme = fs.existsSync(`${ctx.appDir}/README.md`);
  if (hasReadme) {
    const response = await task.prompt({
      type: "confirm",
      message: `The ./${ctx.appDir} directory already contains a README. Do you want to overwrite it?`,
      initial: false,
    });
    if (!response) {
      task.skip("Readme not overwritten");
      return;
    }
  }
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
