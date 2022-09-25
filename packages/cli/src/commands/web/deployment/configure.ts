import type { GluegunCommand } from "@webstone/gluegun";
import type { WebstoneToolbox } from "../../../extensions/web";

const command: GluegunCommand = {
  alias: ["c"],
  description: "Configure a web service deployment adapter",
  // @ts-ignore: WebstoneToolbox extends GluegunToolbox, ignore TS error.
  run: async (toolbox: WebstoneToolbox) => {
    const { print, prompt, web } = toolbox;

    const availableAdapters = web.configure.deployment.availableAdapters;
    const adapterPromptResult = await prompt.ask({
      type: "select",
      name: "adapter",
      message: `Where would you like to deploy the "web" service to?`,
      choices: availableAdapters.map(
        (adapter) => `${adapter.name} (${adapter.npmPackage})`
      ),
    });
    let adapterIdentifier = "";
    if (adapterPromptResult && adapterPromptResult.adapter)
      adapterIdentifier = adapterPromptResult.adapter;

    if (adapterIdentifier === "") {
      print.error("Please choose an adapter.");
      return;
    }

    const chosenAdapter = availableAdapters.find((availableAdapter) =>
      adapterIdentifier.includes(availableAdapter.npmPackage)
    );
    if (!chosenAdapter) {
      print.error(`The chosen adapter ${adapterIdentifier} is not available.`);
      return;
    }

    const nextStepsInstructions: string[] = [];
    if (web.configure.deployment.isAnyAdapterInstalled()) {
      const installedAdapter = web.configure.deployment.getInstalledAdapter();

      if (
        installedAdapter &&
        installedAdapter?.npmPackage === chosenAdapter.npmPackage
      ) {
        print.info(`Adapter ${chosenAdapter.name} is already installed.`);
        return;
      }

      if (!installedAdapter) {
        print.error(
          `An adapter should be installed, but isn't... This is an unexpected error, please manually review the "package.json file."`
        );
        return;
      }
      const isReplaceInstalledAdapter = await prompt.confirm(
        `The ${installedAdapter.name} adapter is already installed. Would you like to replace it with ${chosenAdapter.name}?`
      );
      if (isReplaceInstalledAdapter) {
        await web.configure.deployment.removeAdapter(installedAdapter);
        nextStepsInstructions.push(
          `- to completely remove the ${installedAdapter.name} adapter: ${installedAdapter.nextStepsDocsLink}`
        );
      } else {
        return;
      }
    }

    await web.configure.deployment.installAdapter(chosenAdapter);
    nextStepsInstructions.push(
      `- to finalize the configuration of the newly installed ${chosenAdapter.name} adapter, undo the changes at: ${chosenAdapter.nextStepsDocsLink}`
    );
    print.highlight(
      `\nPlease perform the following next steps by reading the docs:\n${nextStepsInstructions.join(
        "\n"
      )}`
    );
  },
};

module.exports = command;
