import { Listr } from "listr2";
import Enquirer from "enquirer";

const enquirer = new Enquirer();

import { Ctx } from "../helpers";
import { tasks as createAppDirectoryTasks } from "./1-create-app-directory/index";
import { tasks as installAppDependenciesTasks } from "./2-install-app-dependencies/index";
import { tasks as configureApp } from "./3-configure-app";

export const tasks = new Listr<Ctx>(
  [...createAppDirectoryTasks, ...installAppDependenciesTasks, ...configureApp],
  {
    injectWrapper: { enquirer },
    rendererOptions: {
      collapse: false,
    },
  }
);
