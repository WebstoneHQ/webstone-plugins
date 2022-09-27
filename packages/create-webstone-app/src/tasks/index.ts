import { Listr } from "listr2";
import Enquirer from "enquirer";

const enquirer = new Enquirer();

import { Ctx } from "../helpers";
import { tasks as metadataTasks } from "./0-determine-context";
import { tasks as createAppDirectoryTasks } from "./1-create-directory/index";
import { tasks as installAppDependenciesTasks } from "./2-install-dependencies/index";
import { tasks as configureApp } from "./3-configure-app";

export const tasks = new Listr<Ctx>(
  [
    ...metadataTasks,
    ...createAppDirectoryTasks,
    ...installAppDependenciesTasks,
    ...configureApp,
  ],
  {
    injectWrapper: { enquirer },
    rendererOptions: {
      collapse: false,
    },
  }
);
