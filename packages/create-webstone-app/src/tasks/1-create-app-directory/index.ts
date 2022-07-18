import fs from "fs-extra";
import { ListrTask } from "listr2/dist/index";

import { Ctx, WebstoneTask } from "../../helpers";

const determineAppDirName = async (ctx: Ctx, task: WebstoneTask) => {
  const appName = process.argv[2];
  ctx.appDir = appName ? appName.toLowerCase().replace(/\s/g, "-") : ".";

  task.output = `App directory name: ${ctx.appDir}`;
  task.output = ctx.appDir;
  return;
};

const createAppDir = async (ctx: Ctx, task: WebstoneTask) => {
  const appDir = ctx.appDir;

  if (fs.existsSync(appDir)) {
    if (fs.readdirSync(appDir).length > 0) {
      const response = await task.prompt({
        type: "confirm",
        name: "value",
        message: `The ./${appDir} directory is not empty. Do you want to overwrite it?`,
        initial: false,
      });

      if (!response.value) {
        throw new Error(
          `Exiting, please empty the ./${appDir} directory or choose a different one to create the Webstone app.`
        );
      }

      await fs.rm(appDir, { recursive: true, force: true });
    }
  }
  fs.mkdirSync(appDir, { recursive: true });
  return appDir;
};

const createAppDirTasks: ListrTask[] = [
  {
    task: determineAppDirName,
    title: "Determining app directory name",
  },
  {
    task: createAppDir,
    title: "Creating app directory",
  },
];

export const tasks: ListrTask[] = [
  {
    task(_, task) {
      return task.newListr(createAppDirTasks);
    },
    title: "Creating the application directory",
  },
];
