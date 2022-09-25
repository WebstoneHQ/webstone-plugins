import { GluegunCommand } from "@webstone/gluegun";

const command: GluegunCommand = {
  alias: ["c"],
  description: "Create new web API CRUD endpoints",
  run: async (toolbox) => {
    const { filesystem, parameters, print, prompt, template } = toolbox;

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

    if (filesystem.exists(targetDir) === "dir") {
      print.info(`The ${apiPath} API endpoint already exists.`);
      return;
    }

    const spinner = print.spin(`Creating API endpoint at "${targetDir}"...`);
    if (filesystem.exists("src/lib/types.d.ts") !== "file") {
      await template.generate({
        template: "web/api/create/lib-types.d.ejs",
        target: "src/lib/types.d.ts",
        props: {
          apiPath,
        },
      });
    }

    await template.generate({
      template: "web/api/create/index.ejs",
      target: `${targetDir}/+server.ts`,
      props: {
        apiPath,
      },
    });
    await template.generate({
      template: "web/api/create/[uid].ejs",
      target: `${targetDir}/[uid]/+server.ts`,
      props: {
        apiPath,
      },
    });
    spinner.succeed(`API endpoint created at: ${targetDir}/`);
  },
};

module.exports = command;
