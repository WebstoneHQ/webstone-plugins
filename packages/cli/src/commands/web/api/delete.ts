import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  alias: ["d"],
  description: "Delete an API endpoint",
  run: async (toolbox) => {
    const { filesystem, parameters, print, prompt } = toolbox;

    let apiPath = parameters.first;
    if (!apiPath) {
      const result = await prompt.ask({
        type: "input",
        name: "apiPath",
        message: `What's the API endpoint path (e.g. /api/users)?`,
      });
      if (result && result.apiPath) apiPath = result.apiPath;
    }

    if (!apiPath) {
      print.error("Please provide an API endpoint path (e.g. /api/users).");
      return;
    }

    const filePath = apiPath.toLowerCase().replace(/^\//, "");
    const targetDir = `src/routes/${filePath}`;

    const spinner = print.spin(`Removing API endpoint at "${targetDir}"...`);
    filesystem.remove(targetDir);
    spinner.succeed(`API endpoint deleted at: ${targetDir}`);
  },
};

module.exports = command;
