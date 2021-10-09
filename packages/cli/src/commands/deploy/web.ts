import type { WebstoneToolbox } from "../../extensions/web";

import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  // @ts-ignore: WebstoneToolbox extends GluegunToolbox, ignore TS error.
  run: async (toolbox: WebstoneToolbox) => {
    const { parameters, print, system, web } = toolbox;

    if (!web.configure.deployment.isAnyAdapterInstalled()) {
      print.warning(
        "No deployment adapter configured. Please run `pnpm webstone web configure deployment` to fix this before you deploy the application."
      );
      return;
    }

    const buildSpinner = print.spin(`Building the web service...`);
    await system.run(`pnpm build --filter ./services/web`);
    buildSpinner.succeed();

    if (parameters.options.preview) {
      print.info(`Previewing the web service...`);
      await system.exec(`pnpm preview --filter ./services/web`, {
        stdout: "inherit",
      });
    } else {
      print.highlight(
        `TODO: Link to deployment docs for the ${web.configure.deployment.getInstalledAdapterPackageName()} adapter.`
      );
    }
  },
};

module.exports = command;
