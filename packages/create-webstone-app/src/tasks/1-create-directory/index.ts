import fs from "fs-extra";
import { ListrTask } from "listr2/dist/index";

import { Ctx, WebstoneTask } from "../../helpers";

export const createAppDir = async (ctx: Ctx, task: WebstoneTask) => {
  const appDir = ctx.appDir;

  if (fs.existsSync(appDir)) {
    if (fs.readdirSync(appDir).length > 0) {
      const response = await task.prompt({
        type: "confirm",
        message: `The ./${appDir} directory is not empty. Do you want to continue?`,
        initial: false,
      });

      if (!response) {
        throw new Error(
          `Exiting, please empty the ./${appDir} directory or choose a different one to create the Webstone app.`
        );
      }
    }
  }
  task.output = appDir;
  fs.mkdirSync(appDir, { recursive: true });
  return appDir;
};

export const tasks: ListrTask[] = [
  {
    task: createAppDir,
    title: "Creating the directory",
  },
];
