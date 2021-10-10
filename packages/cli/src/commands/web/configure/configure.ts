import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  description: "No-op entry for the `webstone web configure` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["web", "configure"]);
  },
};

module.exports = command;
