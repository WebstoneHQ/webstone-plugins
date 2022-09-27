import { ListrTask } from "listr2";
import { configureApp } from "./application";

export const tasks: ListrTask[] = [
  {
    task(_, task) {
      return task.newListr(configureApp);
    },
    title: "Configuring your application",
  },
];
