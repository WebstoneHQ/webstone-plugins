import { Listr } from "listr2";

import { Ctx } from "../helpers.js";
import { tasks as checkSystemRequirements } from "./0-check-system-requirements/index.js";
import { tasks as createAppDirectoryTasks } from "./1-create-app-directory/index.js";
import { tasks as prepareProjectStructureTasks } from "./2-prepare-project-structure/index.js";
import { tasks as installAppDependenciesTasks } from "./3-install-app-dependencies/index.js";

export const tasks = new Listr<Ctx>(
  [
    ...checkSystemRequirements,
    ...createAppDirectoryTasks,
    ...prepareProjectStructureTasks,
    ...installAppDependenciesTasks,
  ],
  {
    rendererOptions: {
      collapse: false,
    },
  }
);
