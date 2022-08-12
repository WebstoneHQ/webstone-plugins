import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { ListrTaskWrapper, ListrRenderer } from "listr2/dist/index";

const minimalVersion = 405;

export interface Ctx {
  appDir: string;
  isSveltekit: boolean;
  tempDir: string;
  webAppDir: string;
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

export const isSveltekit = (appDir: string) => {
  try {
    if (fs.existsSync(path.join(appDir, "package.json"))) {
      const packageJson = fs.readJsonSync(path.join(appDir, "package.json"));
      if (packageJson.devDependencies["@sveltejs/kit"]) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const checkCorrectSveltekitVersion = (version: string) => {
  const versionRegex = /^1\.0\.0-next\.(\d{3})$/;
  const error = Error(
    `Please upgrade to a Sveltekit Version greater than 1.0.0-next.${minimalVersion}`
  );
  if (version === "next") return true;
  const matches = version.match(versionRegex);
  if (!matches) throw error;
  const [, kitVersion] = matches;
  if (parseInt(kitVersion) < minimalVersion) throw error;
  return true;
};
