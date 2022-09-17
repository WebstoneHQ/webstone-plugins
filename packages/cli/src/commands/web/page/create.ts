import { GluegunCommand } from "gluegun";

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

    if (!name) {
      print.error("Please provide a page name.");
      return;
    }

    const filename = strings.kebabCase(name);
    const target = `services/web/src/routes/${filename}/+page.svelte`;
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
