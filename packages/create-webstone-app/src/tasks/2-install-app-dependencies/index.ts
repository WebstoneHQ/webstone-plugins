//@ts-ignore this package doesn't provdide a declaration file
import { create } from "create-svelte";
import { execa } from "execa";
import { ListrTask } from "listr2/dist/index";

import { Ctx, determinePackageManager } from "../../helpers";

const initWebApp = async (ctx: Ctx) => {
  try {
    if (ctx.type === "application") {
      await createApplication(ctx.appDir);
    } else {
      await createPlugin(ctx.appDir);
    }
    return;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const installWebAppDependencies = async (ctx: Ctx) => {
  const installProcess = execa(determinePackageManager(), ["install"], {
    cwd: ctx.appDir,
    shell: true,
  });

  return installProcess;
};

const createInstallWebAppTasks: ListrTask[] = [
  {
    task: initWebApp,
    title: "Initializing the web service",
  },
  {
    task: installWebAppDependencies,
    title: "Installing dependencies",
    options: { bottomBar: true },
  },
];

export const tasks: ListrTask[] = [
  {
    task(_, task) {
      return task.newListr(createInstallWebAppTasks);
    },
    title: "Installing the application foundation",
  },
];

const createApplication = async (appDir: string) => {
  return await create(appDir, {
    name: "webstone-app",
    template: "skeleton",
    types: "typescript",
    prettier: true,
    eslint: true,
    playwright: true,
  });
};

const createPlugin = async (appDir: string) => {
  return await create(appDir, {
    name: "webstone-plugin",
    template: "skeletonlib",
    types: "typescript",
    prettier: true,
    eslint: true,
    playwright: true,
  });
};