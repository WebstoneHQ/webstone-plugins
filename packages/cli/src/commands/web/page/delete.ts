import { GluegunCommand } from "@webstone/gluegun";

const command: GluegunCommand = {
  alias: ["d"],
  description: "Delete a web page",
  run: async (toolbox) => {
    const { filesystem, parameters, print, prompt, strings } = toolbox;

    let name = parameters.first;
    if (!name) {
      const result = await prompt.ask({
        type: "input",
        name: "name",
        message: `What's the page to delete?`,
      });
      if (result && result.name) name = result.name;
    }

    if (!name) {
      print.error("Please provide a page, e.g. 'about-us'.");
      return;
    }

    const filename = strings.kebabCase(name);
    const target = `src/routes/${filename}`;
    const spinner = print.spin(`Removing page "${target}"...`);
    filesystem.remove(target);
    spinner.succeed(`Page deleted at: ${target}`);
  },
};

module.exports = command;
