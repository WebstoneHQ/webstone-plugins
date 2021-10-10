import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  description: "No-op entry for the `webstone deploy` command.",
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox;
    print.printCommands(toolbox, ["deploy"]);
  },
};

module.exports = command;
