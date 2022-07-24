//@ts-ignore this package doesn't provdide a declaration file
import { create } from "create-svelte";
import { execa } from "execa";
import fs from "fs-extra";
import glob from "fast-glob";
import { ListrTask } from "listr2/dist/index";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { Ctx } from "../../helpers";

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
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const setUpTestFramework = async (ctx: Ctx) => {
  await execa(
    "npx",
    [
      "jscodeshift",
      "-t",
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "codemods",
        "playwright-config.ts"
      ),
      "--extensions=ts",
      "--parser=ts",
      "'playwright.config.ts'",
      "--print",
    ],
    {
      cwd: ctx.webAppDir,
      shell: true,
    }
  );

  const tests = await glob(`${ctx.webAppDir as string}/tests/**/*`);

  tests.forEach((globPath: string) => {
    fs.renameSync(globPath, globPath.replace(".ts", ".e2e.ts"));
  });
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
    task: setUpTestFramework,
    title: "Configuring Testing Framework",
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
