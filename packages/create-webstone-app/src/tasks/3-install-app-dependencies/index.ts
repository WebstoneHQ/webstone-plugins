//@ts-ignore this package doesn't provdide a declaration file
import { create } from "create-svelte";
import { execa } from "execa";
import fs from "fs-extra";
import { ListrTask } from "listr2/dist/index";

//@ts-expect-error Runner doesn't provide a declaration file
import * as Runner from "jscodeshift/src/Runner.js";

import { Ctx } from "../../helpers";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const initWebApp = async (ctx: Ctx) => {
  const webAppDir = `${ctx.appDir}/services/web`;
  ctx.webAppDir = webAppDir;
  console.log(`Installing web app in ${webAppDir}...`);

  try {
    fs.removeSync(`${webAppDir}/.keep`);

    await create(webAppDir, {
      name: "webstone-app",
      template: "skeleton",
      types: "typescript",
      prettier: true,
      eslint: true,
      playwright: true,
    });

    await Runner.run(
      path.join(__dirname, "../../../../codemods/playwright-config.ts"),
      `${webAppDir}/playwright.config.ts`,
      { parser: "ts", extension: "ts", print: true }
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const installWebAppDependencies = async (ctx: Ctx) => {
  const installProcess = execa("pnpm", ["install"], {
    cwd: ctx.webAppDir,
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
    title: "Installing dependencies for the web service",
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
