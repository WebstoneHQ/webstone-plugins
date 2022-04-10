import { execa } from "execa";
import * as fs from "fs-extra";
import path from "path";
import prompts from "prompts";

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

export const createAppDir = async (appName: string = process.argv[2]) => {
  console.log(`Creating app directory...`);
  const appDir = appName ? appName.toLowerCase().replace(/\s/g, "-") : ".";

  if (fs.existsSync(appDir)) {
    if (fs.readdirSync(appDir).length > 0) {
      const response = await prompts({
        type: "confirm",
        name: "value",
        message: `The ./${appDir} directory is not empty. Do you want to overwrite it?`,
        initial: false,
      });

      if (!response.value) {
        throw new Error(
          `Exiting, please empty the ./${appDir} directory or choose a different one to create the Webstone app.`
        );
      }

      await fs.rm(appDir, { recursive: true, force: true });
    }
  }
  fs.mkdirSync(appDir, { recursive: true });
  return appDir;
};

export const copyTemplate = (appDir: string) =>
  new Promise((resolve) => {
    console.log(`Copying template...`);
    const templateDir = path.join(__dirname, "..", "template");
    fs.copySync(templateDir, appDir);
    resolve(appDir);
  });

export const installWebApp = async (appDir: string) => {
  const webAppDir = `${appDir}/services/web`;
  console.log(`Installing web app in ${webAppDir}...`);

  try {
    // An empty directory means `pnpm init svelte@next` is not asking to overwrite it
    fs.removeSync(`${webAppDir}/.keep`);

    const svelteInitProcess = execa(
      "pnpm",
      [
        "init",
        "@svelte-add/kit@latest",
        ".",
        "--",
        "--with",
        "typescript+eslint+prettier+playwright",
      ],
      {
        cwd: webAppDir,
        shell: true,
        // stdio: "inherit",
      }
    );

    svelteInitProcess.stdin?.end();

    await svelteInitProcess;
    return appDir;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const displayNextSteps = (appDir: string) =>
  new Promise<void>((resolve) => {
    console.log(`
===================================================
Congratulations 🎉! Your Webstone project is ready.

To contribute: https://github.com/WebstoneHQ/webstone
To chat & get in touch: https://discord.gg/NJRm6eRs


Thank you for your interest in Webstone, I'd love to hear your feedback 🙏.


Next steps: 
  - cd ${appDir.split("/").pop()}
  - pnpm ws dev
    `);
    resolve();
  });
