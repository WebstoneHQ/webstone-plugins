import { Listr } from "listr2";
import Enquirer from "enquirer";

const enquirer = new Enquirer();

import { Ctx } from "../helpers";
import { tasks as metadataTasks } from "./0-determine-context";
import { tasks as createAppDirectoryTasks } from "./1-create-directory/index";
import { tasks as installAppDependenciesTasks } from "./2-install-dependencies/index";
import { applicationTasks, pluginTasks } from "./3-configure-app";

export const tasks = new Listr<Ctx>(
  [
    ...metadataTasks,
    ...createAppDirectoryTasks,
    ...installAppDependenciesTasks,
    ...applicationTasks,
    ...pluginTasks,
  ],
  {
    injectWrapper: { enquirer },
    rendererOptions: {
      collapse: false,
    },
  }
);
