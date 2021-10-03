import execa from "execa";
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";

const KEY_SEQUENCE_DOWN = "\u001b[B";
const KEY_SEQUENCE_ENTER = "\n";
const KEY_SEQUENCE_RIGHT = "\u001b[C";

const pipe = (...functions) => (input) =>
  functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const displayWelcome = () =>
  new Promise((resolve) => {
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

const createAppDir = async (appName = process.argv[2]) => {
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
        process.exit(1);
      }

      fs.rmSync(appDir, { recursive: true, force: true });
    }
  }
  fs.mkdirSync(appDir, { recursive: true });
  return appDir;
};

const copyTemplate = (appDir) => {
  console.log(`Copying template...`);
  const templateDir = path.join(__dirname, "..", "template");
  fs.copySync(templateDir, appDir);
  return appDir;
};

const installWebApp = async (appDir) => {
  const webAppDir = `${appDir}/services/web`;
  console.log(`Installing web app in ${webAppDir}...`);

  try {
    // An empty directory means `pnpm init svelte@next` is not asking to overwrite it
    fs.removeSync(`${webAppDir}/.keep`);

    const svelteInitProcess = execa("pnpm", ["init", "svelte@next", "."], {
      cwd: webAppDir,
      shell: true,
      // stdio: "inherit",
    });

    const waitAndWrite = async (content) => {
      // Thanks to https://github.com/svelte-add/svelte-add/blob/main/projects/create-kit/__init.js
      await wait(300);
      svelteInitProcess.stdin.write(content);
    };

    // It doesn't look like SvelteKit will get a public API to automate the initialization.
    // What follows is a hacky, not to mention fragile workaround.
    // Context: https://github.com/sveltejs/kit/issues/2348 and linked issues / PRs
    await wait(2000);
    // Which Svelte app template? A) SvelteKit demo app. B) Skeleton project*
    await waitAndWrite(KEY_SEQUENCE_DOWN);
    await waitAndWrite(KEY_SEQUENCE_ENTER);
    // Use TypeScript? No / Yes*
    await waitAndWrite(KEY_SEQUENCE_RIGHT);
    await waitAndWrite(KEY_SEQUENCE_ENTER);
    // Add ESLint for code linting? No / Yes*
    await waitAndWrite(KEY_SEQUENCE_RIGHT);
    await waitAndWrite(KEY_SEQUENCE_ENTER);
    // Add Prettier for code formatting? No / Yes*
    await waitAndWrite(KEY_SEQUENCE_RIGHT);
    await waitAndWrite(KEY_SEQUENCE_ENTER);
    svelteInitProcess.stdin.end();

    await svelteInitProcess;
    return appDir;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const installDependencies = async (appDir) => {
  console.log(`Installing dependencies...`);
  try {
    await execa("pnpm", ["install"], {
      cwd: appDir,
      stdio: "inherit",
    });
    return appDir;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const displayNextSteps = (appDir) =>
  new Promise((resolve) => {
    console.log(`
===================================================
Congratulations 🎉! Your Webstone project is ready.

To contribute: https://github.com/WebstoneHQ/webstone
To chat & get in touch: https://discord.gg/NJRm6eRs


Thank you for your interest in Webstone, I'd love to hear your feedback 🙏.


Next steps: 
  - cd ${appDir.split("/").pop()}
  - pnpm dev
    `);
    resolve();
  });

pipe(
  displayWelcome,
  createAppDir,
  copyTemplate,
  installWebApp,
  installDependencies,
  displayNextSteps
)();
