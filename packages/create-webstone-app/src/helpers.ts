import chalk from "chalk";

import { ListrTaskWrapper, ListrRenderer } from "listr2/dist/index";

export interface Ctx {
  appDir: string;
}

type PackageManagers = "npm" | "pnpm" | "yarn";
export type WebstoneTask = ListrTaskWrapper<Ctx, typeof ListrRenderer>;

export const determinePackageManager = (): PackageManagers => {
  if (process.env.npm_execpath?.endsWith("npm-cli.js")) {
    return "npm";
  } else if (process.env.npm_execpath?.endsWith("pnpm.cjs")) {
    return "pnpm";
  } else if (process.env.npm_execpath?.endsWith("yarn.js")) {
    return "yarn";
  } else {
    console.warn(
      `Could not determine package manager based on "process.env.npm_execpath". Value for env variable: ${process.env.npm_execpath}. Using npm as a fallback. Please report this as a bug, we'd love to make it more resilient.`
    );
    return "npm";
  }
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
