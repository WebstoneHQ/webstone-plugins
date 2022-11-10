import { GluegunCommand } from "@webstone/gluegun";

export type PageType = "page" | "pageLoad" | "pageServer";

const command: GluegunCommand = {
  alias: ["c"],
  description: "Create a new web page",
  run: async (toolbox) => {
    const { parameters, print, prompt, strings, template } = toolbox;

    let name = parameters.first;
    if (!name) {
      const result = await prompt.ask({
        type: "input",
        name: "name",
        message: `What's the page name?`,
      });
      if (result && result.name) name = result.name;
    }

    const types = await prompt.ask({
      type: "multiselect",
      name: "types",
      message: "What types of page do you want to create?",
      choices: [
        { name: "page", message: "Page" },
        { name: "pageLoad", message: "Page Load" },
        { name: "pageServer", message: "Page Server" },
      ],
    });

    const ejsMap = {
      page: "page.ejs",
      pageLoad: "page-load.ejs",
      pageServer: "page-server.ejs",
    };

    console.log(ejsMap);

    if (types.types.length < 1) {
      print.error("You must select at least one type of page to create");
      return;
    }

    if (!name) {
      print.error("Please provide a page name.");
      return;
    }

    const filename = strings.kebabCase(name);
    const target = `src/routes/${filename}/+page.svelte`;
    const spinner = print.spin(`Creating page "${target}"...`);

    await template.generate({
      template: "web/page/create/new-page.ejs",
      target,
      props: {
        name,
      },
    });
    spinner.succeed(`Page created at: ${target}`);
  },
};

module.exports = command;
