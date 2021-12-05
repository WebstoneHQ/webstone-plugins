import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  alias: "a",
  description: "No-op entry for the `webstone web api` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["web", "api"]);
  },
};

module.exports = command;
