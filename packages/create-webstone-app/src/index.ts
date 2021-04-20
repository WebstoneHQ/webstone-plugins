import execa from "execa";
import fs from "fs-extra";
import { Listr } from "listr2";
import { TaskWrapper } from "listr2/dist/lib/task-wrapper";
import { DefaultRenderer } from "listr2/dist/renderer/default.renderer";
import path from "path";
import prompts from "prompts";
import readline from "readline";

interface Ctx {
  appDir: string;
  webAppDir: string;
}

interface WebstoneTask extends TaskWrapper<Ctx, typeof DefaultRenderer> {}

const displayWelcome = () => {
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
};

const determineAppDirName = async (ctx: Ctx, task: WebstoneTask) => {
  const appName = process.argv[2];
  ctx.appDir = appName ? appName.toLowerCase().replace(/\s/g, "-") : ".";
  task.output = `App directory name: ${ctx.appDir}`;
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

      if (!response) {
        process.exit(1);
      }

      fs.rmSync(appDir, { recursive: true, force: true });
    }
  }
  fs.mkdirSync(appDir, { recursive: true });
};

const copyTemplate = (ctx: Ctx) => {
  const templateDir = path.join(__dirname, "template");
  fs.copySync(templateDir, ctx.appDir);
};

const initWebApp = async (ctx: Ctx, task: WebstoneTask) => {
  ctx.webAppDir = `${ctx.appDir}/services/web`;

  fs.removeSync(`${ctx.webAppDir}/.keep`);

  const rl = readline.createInterface({ terminal: true, input: process.stdin });
  // readline.emitKeypressEvents(process.stdin, rl);

  const svelteSubprocess = execa("npm init svelte@next -y", {
    cwd: ctx.webAppDir,
    shell: true,
    // stdin: rl,
    // stdout: task.stdout()
    stdio: "inherit",
  });

  // const logOut = (): WriteStream => {
  //   return through((chunk: Buffer | string) => {
  //     chunk = chunk?.toString('utf-8').trim()

  //     task.output = chunk
  //   })
  // }

  // const createOutputStream = async (): Promise<void> => {
  //   svelteSubprocess.stdout.pipe(logOut())
  //   svelteSubprocess.stdin.pipe(logOut())

  //   await svelteSubprocess;
  // }

  // await createOutputStream();
  return svelteSubprocess;
};

const installWebAppDependencies = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 5000);
  });

const createAppDirTasks = () => [
  {
    task: determineAppDirName,
    title: "Determining app directory name",
  },
  {
    task: createAppDir,
    title: "Creating app directory",
  },
];

const createCopyTemplateTasks = () => [
  {
    task: copyTemplate,
    title: "Copying the template",
  },
];

const createInstallWebAppTasks = () => [
  {
    task: initWebApp,
    title: "Initializing the web service",
  },
  {
    task: installWebAppDependencies,
    title: "Installing dependencies for the web service",
  },
];

const tasks = new Listr<Ctx>(
  [
    {
      task: (_, task): Listr => task.newListr(createAppDirTasks()),
      title: "Creating the application directory",
    },
    {
      task: (_, task): Listr => task.newListr(createCopyTemplateTasks()),
      title: "Preparing the project structure",
    },
    {
      task: (_, task): Listr => task.newListr(createInstallWebAppTasks()),
      title: "Installing the application foundation",
    },
  ],
  {
    rendererOptions: {
      collapse: false,
    },
  }
);

displayWelcome();
tasks.run().catch((error) => {
  console.error(error);
});
