import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  alias: "d",
  description: "No-op entry for the `webstone web create` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["web", "delete"]);
  },
};

module.exports = command;
