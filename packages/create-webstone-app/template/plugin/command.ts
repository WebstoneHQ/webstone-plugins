import { GluegunCommand, GluegunToolbox } from "@webstone/gluegun";

const command: GluegunCommand = {
  description: "Placeholder command",
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox;

    print.info("Hello from the webstone CLI!");
  },
};

export default command;
