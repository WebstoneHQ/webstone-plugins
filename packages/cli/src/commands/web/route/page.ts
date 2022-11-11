import { GluegunCommand } from "@webstone/gluegun";

const command: GluegunCommand = {
  alias: "p",
  description: "No-op entry for the `webstone web page` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["web", "page"]);
  },
};

module.exports = command;
