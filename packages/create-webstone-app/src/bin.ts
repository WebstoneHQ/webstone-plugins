import fs from "fs-extra";
import chalk from "chalk";
import enquirer from "enquirer";
import { displayWelcome } from "./helpers";
import { createWebstone } from "./index";

const { version } = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
);

let cwd = process.argv[2] || ".";

displayWelcome();
console.log(chalk.bold(`create-webstone v${version}`));

if (cwd === ".") {
  const dir: { dir: string } = await enquirer.prompt({
    type: "text",
    name: "dir",
    message:
      "Where should we create your project? (Hit enter to use current directory)",
    initial: ".",
  });

  cwd = dir.dir;
}

if (fs.existsSync(cwd)) {
  if (fs.readdirSync(cwd).length > 0) {
    const forceCreate: { forceCreate: boolean } = await enquirer.prompt({
      type: "confirm",
      name: "forceCreate",
      message: `The ./${cwd} directory is not empty. Do you want to continue?`,
      initial: false,
    });

    if (!forceCreate.forceCreate) {
      console.log(
        chalk.red(
          `Exiting, please empty the ./${cwd} directory or choose a different one to create the Webstone app.`,
        ),
      );
      process.exit(1);
    }
  }
}

const promptType: { type: "Webstone App" | "Webstone Plugin" } =
  await enquirer.prompt({
    type: "select",
    name: "type",
    message: "What type of Webstone project do you want to create?",
    choices: ["Webstone App", "Webstone Plugin"],
  });

const typeMap = {
  "Webstone App": "app",
  "Webstone Plugin": "plugin",
} as const;

const type = typeMap[promptType.type];

await createWebstone(cwd, { type });

console.log(
  chalk.green.bold(`Successfully created Webstone project at ./${cwd}`),
);
