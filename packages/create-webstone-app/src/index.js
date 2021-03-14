import execa from "execa";
import fs from "fs-extra";
import path from 'path';
import prompts from "prompts";

const pipe = (...functions) => input => functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

const displayWelcome = () => new Promise((resolve) => {
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
        type: 'confirm',
        name: 'value',
        message: `The ./${appDir} directory is not empty. Do you want to overwrite it?`,
        initial: false
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
  const templateDir = path.join(__dirname, "template");
  fs.copySync(templateDir, appDir);
  return appDir;
};

const installWebApp = (appDir) => {
  const webAppDir = `${appDir}/services/web`;
  console.log(`Installing web app in ${webAppDir}...`);

  try {
    // An empty directory means `npm init svelte@next` is not asking to overwrite it
    fs.removeSync(`${webAppDir}/.keep`);

    execa("npm init svelte@next", {
      cwd: webAppDir,
      shell: true,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
};

pipe(
  displayWelcome,
  createAppDir,
  copyTemplate,
  installWebApp
)();
