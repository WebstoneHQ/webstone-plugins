import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  description: "No-op entry for the `webstone web deployment` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["web", "deployment"]);
  },
};

module.exports = command;
