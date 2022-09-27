import { GluegunCommand } from "@webstone/gluegun";
import { determinePackageManager } from "../../../helpers";

const command: GluegunCommand = {
  alias: ["d"],
  description: "Start the web dev server",
  run: async (toolbox) => {
    const { print, system } = toolbox;

    print.info(`Starting web service...`);
    await system.exec(`${determinePackageManager()} run dev`, {
      stdout: "inherit",
    });
  },
};

module.exports = command;
