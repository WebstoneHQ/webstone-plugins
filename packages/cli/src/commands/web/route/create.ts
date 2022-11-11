import { GluegunCommand } from "@webstone/gluegun";

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

    const typesPrompt = (await prompt.ask({
      type: "multiselect",
      name: "types",
      message: "What types of page do you want to create?",
      choices: [
        "+page.svelte",
        "+page.ts",
        "+page.server.ts",
        "+layout.svelte",
        "+layout.ts",
        "+layout.server.ts",
        "+server.ts",
        "+error.svelte",
      ],
    })) as {
      types: string[];
    };

    if (typesPrompt.types.length < 1) {
      print.error("You must select at least one type of page to create");
      return;
    }

    for (const type of typesPrompt.types) {
      const directoryName = strings.kebabCase(name || "");
      const target = `src/routes/${directoryName}/${type}`;
      const spinner = print.spin(`Creating file "${target}"...`);
      await template.generate({
        template: `web/route/create/${type}.ejs`,
        target,
        props: {
          name,
        },
      });
      spinner.succeed(`File created at: ${target}`);
    }
  },
};

module.exports = command;
