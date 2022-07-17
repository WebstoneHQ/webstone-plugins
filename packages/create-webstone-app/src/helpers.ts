import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
//@ts-ignore this package doesn't provdide a declaration file
import { create } from "create-svelte";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { ListrTaskWrapper, ListrRenderer, ListrTask } from "listr2/dist/index";
import { Listr } from "listr2";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface Ctx {
  appDir: string;
  webAppDir?: string;
}

export type WebstoneTask = ListrTaskWrapper<Ctx, typeof ListrRenderer>;

export const displayWelcome = () =>
  new Promise<void>((resolve) => {
    // https://textfancy.com/ascii-art/
    console.log(`
  ▄     ▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄    ▄ ▄▄▄▄▄▄▄ 
  █ █ ▄ █ █       █  ▄    █       █       █       █  █  █ █       █
  █ ██ ██ █    ▄▄▄█ █▄█   █  ▄▄▄▄▄█▄     ▄█   ▄   █   █▄█ █    ▄▄▄█
  █       █   █▄▄▄█       █ █▄▄▄▄▄  █   █ █  █ █  █       █   █▄▄▄ 
  █       █    ▄▄▄█  ▄   ██▄▄▄▄▄  █ █   █ █  █▄█  █  ▄    █    ▄▄▄█
  █   ▄   █   █▄▄▄█ █▄█   █▄▄▄▄▄█ █ █   █ █       █ █ █   █   █▄▄▄ 
  █▄▄█ █▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█ █▄▄▄█ █▄▄▄▄▄▄▄█▄█  █▄▄█▄▄▄▄▄▄▄█
  
  `);
    resolve();
  });

const determineAppDirName = async (ctx: Ctx, task: WebstoneTask) => {
  const appName = process.argv[2];
  ctx.appDir = appName ? appName.toLowerCase().replace(/\s/g, "-") : ".";

  task.output = `App directory name: ${ctx.appDir}`;
  task.output = ctx.appDir;
  return;
};

export const createAppDir = async (ctx: Ctx, task: WebstoneTask) => {
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

export const copyTemplate = (ctx: Ctx) => {
  const templateDir = path.resolve(__dirname, "../template");
  fs.copySync(templateDir, ctx.appDir);
};

const initWebApp = async (ctx: Ctx) => {
  const webAppDir = `${ctx.appDir}/services/web`;
  ctx.webAppDir = webAppDir;
  console.log(`Installing web app in ${webAppDir}...`);

  try {
    fs.removeSync(`${webAppDir}/.keep`);

    await create(webAppDir, {
      name: "webstone-app",
      template: "skeleton", // or 'skeleton'
      types: "typescript", // or 'typescript' or null;
      prettier: true,
      eslint: true,
      playwright: true,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const installWebAppDependencies = async (ctx: Ctx) => {
  const installProcess = execa("npm", ["install"], {
    cwd: ctx.webAppDir,
    shell: true,
  });

  return installProcess;
};

export const displayNextSteps = async (ctx: Ctx) => {
  console.log(`
===================================================
Congratulations 🎉! Your Webstone project is ready.

To contribute: https://github.com/WebstoneHQ/webstone
To chat & get in touch: https://discord.gg/NJRm6eRs


Thank you for your interest in Webstone, I'd love to hear your feedback 🙏.

Next steps: 
  - ${chalk.bold(chalk.cyan(`cd ${ctx.appDir.split("/").pop()}`))}
  - ${chalk.bold(chalk.cyan("pnpm ws dev"))}
    `);
  console.log(ctx.appDir);
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

const createCopyTemplateTasks: ListrTask[] = [
  {
    task: copyTemplate,
    title: "Copying the template",
    options: { persistentOutput: true },
  },
];

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

export const tasks = new Listr<Ctx>(
  [
    {
      task(_, task) {
        return task.newListr(createAppDirTasks);
      },
      title: "Creating the application directory",
    },
    {
      task(_, task) {
        return task.newListr(createCopyTemplateTasks);
      },
      title: "Preparing the project structure",
    },
    {
      task(_, task) {
        return task.newListr(createInstallWebAppTasks);
      },
      title: "Installing the application foundation",
    },
  ],
  {
    rendererOptions: {
      collapse: false,
    },
  }
);
