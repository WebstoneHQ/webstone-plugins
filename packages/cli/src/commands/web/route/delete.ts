import {
  GluegunCommand,
  GluegunFilesystem,
  GluegunPrint,
} from "@webstone/gluegun";

const command: GluegunCommand = {
  alias: ["d"],
  description: "Delete a route",
  run: async (toolbox) => {
    const { filesystem, parameters, print, prompt, strings } = toolbox;

    let name = parameters.first;
    if (!name) {
      const result = await prompt.ask({
        type: "input",
        name: "name",
        message: `What's the route to delete?`,
      });
      if (result && result.name) name = result.name;
    }

    if (!name) {
      print.error("Please provide a route, e.g. 'about-us'.");
      return;
    }

    const filename = strings.kebabCase(name);

    const existingFiles = filesystem.list(`src/routes/${name}`);

    if (!existingFiles || existingFiles.length < 1) {
      deleteAll(filename, print, filesystem);
      return;
    }

    const filesPrompt = (await prompt.ask({
      type: "multiselect",
      name: "files",
      message: "What files do you want to delete?",
      choices: existingFiles,
    })) as {
      files: string[];
    };

    if (filesPrompt.files.length == existingFiles.length) {
      deleteAll(filename, print, filesystem);
      return;
    }

    for (const file of filesPrompt.files) {
      print.newline();
      const target = `src/routes/${filename}/${file}`;
      const spinner = print.spin(`Removing file "${target}"...`);
      filesystem.remove(target);
      spinner.succeed(`File deleted at: ${target}`);
    }
  },
};

module.exports = command;

function deleteAll(
  filename: string,
  print: GluegunPrint,
  filesystem: GluegunFilesystem,
) {
  print.newline();
  const target = `src/routes/${filename}`;
  const spinner = print.spin(`Removing route "${target}"...`);
  filesystem.remove(target);
  spinner.succeed(`Route deleted at: ${target}`);
  return;
}
