import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  name: "webstone",
  run: async (toolbox) => {
    const { print } = toolbox;

    print.info("Welcome to the Webstone CLI.");
  },
};

module.exports = command;
