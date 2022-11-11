import { ListrTask } from "listr2/dist/index";
import CommandLineArgs from "command-line-args";
import { execa } from "execa";

import { Ctx, WebstoneTask } from "../../helpers";

const optionDefinitons: CommandLineArgs.OptionDefinition[] = [
  {
    name: "type",
    alias: "t",
    type: String,
  },
];

const determineAppDirName = async (ctx: Ctx, task: WebstoneTask) => {
  let appName = "";
  if (process.argv[2] && process.argv[2].startsWith("--")) {
    appName = ".";
  }
  if (!appName) {
    appName = process.argv[2];
    console.warn("No app name provided, using current directory");
  }
  ctx.appDir = appName ? appName.toLowerCase().replace(/\s/g, "-") : ".";

  task.output = `App directory name: ${ctx.appDir}`;
  task.output = ctx.appDir;
  return;
};

const checkPnpm = async () => {
  const pnpmVersion = await execa("pnpm", ["-v"]);
  if (pnpmVersion.failed) {
    throw new Error(
      "pnpm is not installed, please install it first (npm i -g pnpm)"
    );
  }
};

const getMetadata = async (ctx: Ctx, task: WebstoneTask) => {
  let type: "application" | "plugin";
  const optionDefinitions = CommandLineArgs(optionDefinitons, {
    partial: true,
  });

  if (
    optionDefinitions.type === "application" ||
    optionDefinitions.type === "plugin"
  ) {
    type = optionDefinitions.type;
  } else {
    type = await task.prompt({
      type: "Select",
      message: "What's the type of the project",
      choices: ["application", "plugin"],
    });
  }

  ctx.type = type;
  return { type };
};

const contextTasks: ListrTask[] = [
  {
    task: determineAppDirName,
    title: "Determining app directory name",
  },
  {
    task: getMetadata,
    title: "Detecting project type",
  },
  {
    task: checkPnpm,
    title: "Checking for pnpm",
    enabled: (ctx: Ctx) => ctx.type === "plugin",
  },
];

export const tasks: ListrTask[] = [
  {
    title: "Determining application context",
    task(_, task) {
      return task.newListr(contextTasks);
    },
  },
];
