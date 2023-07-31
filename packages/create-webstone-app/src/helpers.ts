import chalk from "chalk";
import { execSync } from "child_process";

import { ListrTaskWrapper, ListrRenderer } from "listr2/dist/index";

export interface Ctx {
  appDir: string;
  type: "application" | "plugin";
}

type PackageManagers = "npm" | "pnpm" | "yarn";
export type WebstoneTask = ListrTaskWrapper<Ctx, typeof ListrRenderer>;

/**
 * If you modify this function, also change it in
 * webstone/packages/cli/src/helpers.ts
 */
export const determinePackageManager = (): PackageManagers => {
  const packageManagers: PackageManagers[] = ["pnpm", "yarn"];
  const installedPackageManager: PackageManagers =
    packageManagers.find((pkgManager) => {
      try {
        execSync(`${pkgManager} --version`);
        return pkgManager;
      } catch (_) {
        // Current `pkgManager` is not installed, move on to the next.
      }
    }) || "npm";

  return installedPackageManager;
};

export const getAppName = (appDir: string, isPlugin = false) => {
  if (appDir === ".") {
    return process.cwd().split("/").pop() || isPlugin
      ? "webstone-plugin"
      : "webstone-app";
  }
  return appDir;
};

export const displayWelcome = () =>
  new Promise<void>((resolve) => {
    // https://textfancy.com/ascii-art/
    console.log(`
  ▄     ▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄    ▄ ▄▄▄▄▄▄▄ 
  █ █ ▄ █ █       █  ▄    █       █       █       █  █  █ █       █
  █ ██ ██ █    ▄▄▄█ █▄█   █  ▄▄▄▄▄█▄     ▄█   ▄   █   █▄█ █    ▄▄▄█
  █       █   █▄▄▄█       █ █▄▄▄▄▄  █   █ █  █ █  █       █   █▄▄▄ 
  █       █    ▄▄▄█  ▄   ██▄▄▄▄▄  █ █   █ █  █▄█  █  ▄    █    ▄▄▄█
  █   ▄   █   █▄▄▄█ █▄█   █▄▄▄▄▄█ █ █   █ █       █ █ █   █   █▄▄▄ 
  █▄▄█ █▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█ █▄▄▄█ █▄▄▄▄▄▄▄█▄█  █▄▄█▄▄▄▄▄▄▄█
  
  `);
    resolve();
  });

export const displayNextSteps = async (ctx: Ctx) => {
  const wsDevCommandPerPackageManager = {
    npm: "npx ws dev",
    pnpm: "pnpm ws dev",
    yarn: "yarn ws dev",
  };

  console.log(`
===================================================
Congratulations 🎉! Your Webstone project is ready.

To contribute: https://github.com/WebstoneHQ/webstone
To chat & get in touch: https://discord.gg/NJRm6eRs


Thank you for your interest in Webstone, I'd love to hear your feedback 🙏.

Next steps: 
  - ${chalk.bold(chalk.cyan(`cd ${ctx.appDir.split("/").pop()}`))}
  - ${chalk.bold(
    chalk.cyan(wsDevCommandPerPackageManager[determinePackageManager()])
  )}
    `);
};
