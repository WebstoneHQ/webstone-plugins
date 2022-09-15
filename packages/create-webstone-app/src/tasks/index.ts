import { Listr } from "listr2";
import Enquirer from "enquirer";

const enquirer = new Enquirer();

import { Ctx } from "../helpers";
import { tasks as checkSystemRequirements } from "./0-check-system-requirements/index";
import { tasks as createAppDirectoryTasks } from "./1-create-app-directory/index";
import { tasks as prepareProjectStructureTasks } from "./2-prepare-project-structure/index";
import { tasks as installAppDependenciesTasks } from "./3-install-app-dependencies/index";

export const tasks = new Listr<Ctx>(
  [
    ...checkSystemRequirements,
    ...createAppDirectoryTasks,
    ...prepareProjectStructureTasks,
    ...installAppDependenciesTasks,
  ],
  {
    injectWrapper: { enquirer },
    rendererOptions: {
      collapse: false,
    },
  }
);
