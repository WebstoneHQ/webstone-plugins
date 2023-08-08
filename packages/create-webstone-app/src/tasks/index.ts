import { Listr } from "listr2";
import Enquirer from "enquirer";

const enquirer = new Enquirer();

import { Ctx } from "../helpers";
import { tasks as metadataTasks } from "./0-determine-context";
import { tasks as createAppDirectoryTasks } from "./1-create-directory/index";
import { setupTasks } from "./2-setup-project/index";
import { configureTasks } from "./3-configure-app";

export const tasks = new Listr<Ctx>(
  [
    ...metadataTasks,
    ...createAppDirectoryTasks,
    ...setupTasks,
    ...configureTasks,
  ],
  {
    injectWrapper: { enquirer },
    rendererOptions: {
      collapse: false,
    },
  },
);
