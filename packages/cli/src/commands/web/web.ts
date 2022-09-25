import { GluegunCommand } from "@webstone/gluegun";

const command: GluegunCommand = {
  alias: "w",
  description: "No-op entry for the `webstone` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["web"]);
  },
};

module.exports = command;
