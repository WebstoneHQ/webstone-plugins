import { ListrTask } from "listr2";
import { Ctx } from "../../helpers";
import { initWebApp } from "./application";
import { configurePlugin } from "./plugin";

export const setupTasks: ListrTask[] = [
  {
    enabled(ctx: Ctx) {
      return ctx.type === "application";
    },
    task: initWebApp,
    title: "Initializing new Webstone application",
  },
  {
    enabled(ctx: Ctx) {
      return ctx.type === "plugin";
    },
    task(_, task) {
      return task.newListr(configurePlugin);
    },
    title: "Initializing new Webstone plugin",
  },
];
