import { execa } from "execa";
import { ListrTask } from "listr2/dist/index";

const checkPnpm = async () => {
  try {
    await execa("pnpm", ["version"]);
    return;
  } catch (error) {
    throw new Error("Please install `pnpm` globally with `npm i -g pnpm`");
  }
};

const checkSystemRequirements: ListrTask[] = [
  {
    task: checkPnpm,
    title: "Validating pnpm...",
  },
];

export const tasks: ListrTask[] = [
  {
    task(_, task) {
      return task.newListr(checkSystemRequirements);
    },
    title: "Checking system requirements",
  },
];
