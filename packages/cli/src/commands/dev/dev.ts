import { GluegunCommand } from "@webstone/gluegun";
import { determinePackageManager } from "../../helpers";

const command: GluegunCommand = {
  alias: ["d"],
  description: "Start the dev server",
  run: async (toolbox) => {
    const { print, system } = toolbox;
    print.info("Starting dev server...");

    await system.exec(`${determinePackageManager()} run dev`, {
      stdout: "inherit",
    });
  },
};

module.exports = command;
