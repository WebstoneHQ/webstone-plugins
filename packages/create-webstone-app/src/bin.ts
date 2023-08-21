import fs from "fs-extra";
import chalk from "chalk";
import enquirer from "enquirer";
import { displayNextSteps, displayWelcome } from "./helpers";
import { createWebstone } from "./index";
import { parseArgs } from "node:util";

// argparsing
const { values: argValues } = parseArgs({
  allowPositionals: true,
  options: {
    type: {
      type: "string",
      alias: "t",
    },
    "extend-cli": {
      type: "boolean",
    },
  },
});

let extendCLI = argValues["extend-cli"] || false;
let type: "app" | "plugin" | null = null;
if (argValues.type && ["app", "plugin"].includes(argValues.type)) {
  type = argValues.type as "app" | "plugin";
}

const { version } = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
);

let cwd =
  process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : ".";

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

if (!type) {
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

  type = typeMap[promptType.type];
}

if (type === "plugin" && !extendCLI) {
  const extendCLIAnswer: { extendCLI: boolean } = await enquirer.prompt({
    type: "confirm",
    name: "extendCLI",
    message: "Does your plugin extend the Webstone CLI?",
    initial: false,
  });
  extendCLI = extendCLIAnswer.extendCLI;
}

await createWebstone(cwd, { type, extendCLI });

displayNextSteps(cwd);
