import fs from "fs";
import path from 'path';
import prompts from "prompts";

const createAppDir = async (appName = process.argv[2]) => {
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
  fs.mkdirSync(appDir, {recursive: true});
  return appDir;
};

const copyTemplate = (appDir) => {
  const templateDir = path.join(__dirname, "template");

  console.log(`TODO: Copy ${templateDir} to ${appDir}`);
};

const main = async () => {
  // TODO: Print ASCII art (Webstone logo) and a welcome message

  const appDir = await createAppDir();
  copyTemplate(appDir);
};

main();