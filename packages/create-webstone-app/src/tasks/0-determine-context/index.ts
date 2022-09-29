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

export const tasks: ListrTask[] = [
  {
    task: getMetadata,
    title: "Getting meta information",
  },
];
