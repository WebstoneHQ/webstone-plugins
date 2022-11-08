import { ListrTask } from "listr2";
import { Ctx } from "../../helpers";
import { configureApp } from "./application";
import { configurePlugin } from "./plugin";

export const configureTasks: ListrTask[] = [
  {
    enabled(ctx: Ctx) {
      return ctx.type === "application";
    },
    task(_, task) {
      return task.newListr(configureApp);
    },
    title: "Configuring your Webstone application",
  },
  {
    enabled(ctx: Ctx) {
      return ctx.type === "plugin";
    },
    task(_, task) {
      return task.newListr(configurePlugin);
    },
    title: "Configuring your Webstone plugin",
  },
];
