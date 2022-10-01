import { ListrTask } from "listr2/dist/index";
import CommandLineArgs from "command-line-args";

import { Ctx, WebstoneTask } from "../../helpers";

const optionDefinitons: CommandLineArgs.OptionDefinition[] = [
  {
    name: "type",
    alias: "t",
    type: String,
  },
];

const determineAppDirName = async (ctx: Ctx, task: WebstoneTask) => {
  if (process.argv[2] && process.argv[2].startsWith("--")) {
    throw new Error("Please provide a name for the project");
  }
  const appName = process.argv[2];
  ctx.appDir = appName ? appName.toLowerCase().replace(/\s/g, "-") : ".";

  task.output = `App directory name: ${ctx.appDir}`;
  task.output = ctx.appDir;
  return;
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

  let extendCLI = false;
  if (type === "plugin") {
    extendCLI = await task.prompt({
      type: "Confirm",
      message: "Do you want to extend the CLI",
      initial: false,
    });
  }
  ctx.extendsCLI = extendCLI;
  ctx.type = type;
  return { type, extendCLI };
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
];

export const tasks: ListrTask[] = [
  {
    title: "Determining application context",
    task(_, task) {
      return task.newListr(contextTasks);
    },
  },
];
