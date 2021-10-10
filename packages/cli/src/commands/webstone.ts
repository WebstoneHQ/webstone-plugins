import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  description: "No-op entry for the webstone CLI.",
  run: async (toolbox) => {
    const { print } = toolbox;

    print.info("Welcome to the Webstone CLI.");
  },
};

module.exports = command;
