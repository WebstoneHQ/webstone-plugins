import {
  GluegunCommand,
  GluegunFilesystem,
  GluegunParameters,
  GluegunPrint,
  GluegunPrompt,
  GluegunStrings,
} from "@webstone/gluegun";

interface PromptForParameters {
  filesystem?: GluegunFilesystem;
  parameters?: GluegunParameters;
  print?: GluegunPrint;
  prompt?: GluegunPrompt;
  strings?: GluegunStrings;
}

interface PromptForNameParameters extends PromptForParameters {
  parameters: GluegunParameters;
  prompt: GluegunPrompt;
}

interface PromptForTypesParameters extends PromptForParameters {
  filesystem: GluegunFilesystem;
  parameters: GluegunParameters;
  print: GluegunPrint;
  prompt: GluegunPrompt;
  strings: GluegunStrings;
}

const promptForName = async ({
  parameters,
  prompt,
}: PromptForNameParameters) => {
  if (parameters.first) {
    return parameters.first;
  }

  const result = await prompt.ask({
    type: "input",
    name: "name",
    message: `What's the page name?`,
  });
  if (result && result.name) return result.name;

  throw new Error("Please provide a page name.");
};

const promptForFileTypes = async (
  { filesystem, parameters, print, prompt, strings }: PromptForTypesParameters,
  name: string
) => {
  // huge thank you to the Svelte language tools repo! https://github.com/sveltejs/language-tools/tree/master/packages/svelte-vscode/src/sveltekit/generateFiles/templates
  const allChoices = [
    "+page.svelte",
    "+page.ts",
    "+page.server.ts",
    "+layout.svelte",
    "+layout.ts",
    "+layout.server.ts",
    "+server.ts",
    "+error.svelte",
  ];
  const directoryName = strings.kebabCase(name || "");
  const existingFiles = filesystem.list(`src/routes/${directoryName}`);

  if (parameters.options.types) {
    const types: string[] = parameters.options.types.split(",");
    const validTypes: string[] = [];
    const invalidTypes: string[] = [];
    types.forEach((type) => {
      const typeTrimmed = type.trim();
      if (allChoices.includes(typeTrimmed)) {
        validTypes.push(typeTrimmed);
      } else {
        invalidTypes.push(typeTrimmed);
      }
    });

    if (invalidTypes.length > 0) {
      print.warning(`Ignoring invalid types: ${invalidTypes.join(", ")}`);
    }

    if (validTypes.length > 0) {
      return { directoryName, existingFiles, types: validTypes };
    }
  }

  const choices = allChoices.filter((choice) => {
    return !existingFiles?.includes(choice);
  });

  const typesPrompt = (await prompt.ask({
    type: "multiselect",
    name: "types",
    message: "What types of page do you want to create?",
    choices: choices,
  })) as {
    types: string[];
  };

  if (typesPrompt.types.length < 1) {
    throw new Error("You must select at least one type of page to create");
  }

  return { directoryName, existingFiles, types: typesPrompt.types };
};

const command: GluegunCommand = {
  alias: ["c"],
  description: "Create a new web page",
  run: async (toolbox) => {
    const { parameters, print, prompt, strings, template, filesystem } =
      toolbox;

    try {
      // eslint-disable-next-line no-var
      var name = await promptForName({ prompt, parameters });
    } catch (error: unknown) {
      print.error(error instanceof Error ? error.message : String(error));
      return;
    }

    try {
      // eslint-disable-next-line no-var
      var { directoryName, existingFiles, types } = await promptForFileTypes(
        { filesystem, parameters, print, prompt, strings },
        name
      );
    } catch (error: unknown) {
      print.error(error instanceof Error ? error.message : String(error));
      return;
    }

    for (const type of types) {
      const target = `src/routes/${directoryName}/${type}`;
      const spinner = print.spin(`Creating file "${target}"...`);

      if (existingFiles?.includes(type)) {
        spinner.fail(`File "${target}" already exists, skipping...`);
        continue;
      }

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
