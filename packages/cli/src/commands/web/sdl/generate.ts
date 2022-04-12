import { GluegunCommand } from "gluegun";
import { Toolbox } from "gluegun/build/types/domain/toolbox";
import { getModel, getQuerySDL } from "../../../lib/sdl-helpers";

const command: GluegunCommand = {
  description: "Generate GraphQL Schema Definition for a Prisma Schema",
  run: async (toolbox: Toolbox) => {
    const { parameters, print, prompt } = toolbox;

    let name = parameters.first;
    if (!name) {
      const result = await prompt.ask({
        type: "input",
        name: "name",
        message: `What's the model name?`,
      });
      if (result && result.name) name = result.name;
    }

    if (!name) {
      print.error("Please provide a model name.");
      return;
    }
    const spinner = print.spin(
      `Generating GraphQL Schema Definition for "${name}"...`
    );
    const schema = await getModel(name);
    if (!schema) {
      print.error(`Couldn't find a model for name ${name}`);
      return;
    }

    const querySDL = getQuerySDL(schema).join("\n");
    console.log(querySDL);
    spinner.succeed(`SDL for ${name} generated.`);
  },
};

module.exports = command;
