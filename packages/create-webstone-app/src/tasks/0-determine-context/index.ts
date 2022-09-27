import { ListrTask } from "listr2/dist/index";

import { Ctx, WebstoneTask } from "../../helpers";

const getMetadata = async (ctx: Ctx, task: WebstoneTask) => {
  const type: "application" | "plugin" = await task.prompt({
    type: "Select",
    message: "What's the type of the project",
    choices: ["application", "plugin"],
  });

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
