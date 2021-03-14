import fs from "fs-extra";
import path from 'path';
import prompts from "prompts";

const pipe = (...functions) => input => functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

const displayWelcome = () => new Promise((resolve) => {
  // TODO: Print ASCII art (Webstone logo) and a welcome message
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

pipe(
  displayWelcome,
  createAppDir,
  copyTemplate
)();
