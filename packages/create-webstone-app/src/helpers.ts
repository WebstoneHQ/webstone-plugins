import chalk from "chalk";

import { ListrTaskWrapper, ListrRenderer } from "listr2/dist/index";

export interface Ctx {
  appDir: string;
}

export type WebstoneTask = ListrTaskWrapper<Ctx, typeof ListrRenderer>;

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
  console.log(`
===================================================
Congratulations 🎉! Your Webstone project is ready.

To contribute: https://github.com/WebstoneHQ/webstone
To chat & get in touch: https://discord.gg/NJRm6eRs


Thank you for your interest in Webstone, I'd love to hear your feedback 🙏.

Next steps: 
  - ${chalk.bold(chalk.cyan(`cd ${ctx.appDir.split("/").pop()}`))}
  - ${chalk.bold(chalk.cyan("pnpm ws dev"))}
    `);
};
