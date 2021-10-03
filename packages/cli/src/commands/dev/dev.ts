import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  run: async (toolbox) => {
    const { print } = toolbox;

    print.info("Welcome to the Webstone DEV CLI.");
  },
};

module.exports = command;
