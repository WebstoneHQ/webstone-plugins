import { ListrTask } from "listr2";
import { Ctx } from "../../helpers";
import { initWebApp } from "./application";
import { copyTemplate } from "./plugin";

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
    task: copyTemplate,
    title: "Initializing new Webstone plugin",
  },
];
