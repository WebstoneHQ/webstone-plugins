import { execa } from "execa";
import fs from "fs-extra";
import { ListrTask } from "listr2";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Ctx, determinePackageManager, getAppName } from "../../helpers";
import json5 from "json5";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const installDeps = async (ctx: Ctx) => {
  const installProcess = execa(
    determinePackageManager(),
    ["add", "-D", "@webstone/cli", "@webstone/gluegun"],
    {
      shell: true,
      cwd: ctx.appDir,
    }
  );

  return installProcess.stdout;
};

export const copyFiles = async (ctx: Ctx) => {
  const tsconfigPath = path.join(
    __dirname,
    "..",
    "template",
    "plugin",
    "tsconfig.json"
  );

  const cliPath = path.join(ctx.appDir, "src", "lib", "cli");
  fs.copySync(tsconfigPath, `${ctx.appDir}/tsconfig.cli.json`);

  const appDirectoryName = getAppName(ctx.appDir)?.startsWith("webstone-")
    ? getAppName(ctx.appDir)
    : `webstone-${getAppName(ctx.appDir)}`;

  fs.copySync(
    path.join(__dirname, "..", "template", "plugin", "command.ts"),
    path.join(cliPath, "commands", appDirectoryName, "command.ts"),
    { recursive: true }
  );
  fs.copySync(
    path.join(__dirname, "..", "template", "plugin", "extension.ts"),
    path.join(cliPath, "extensions", appDirectoryName, "extension.ts"),
    { recursive: true }
  );

  const packageJSONPath = path.join(
    __dirname,
    "..",
    "template",
    "plugin",
    "package.json"
  );
  fs.copySync(
    packageJSONPath,
    path.join(ctx.appDir, "src", "lib", "cli", "package.json")
  );
};

export const adjustConfigFiles = async (ctx: Ctx) => {
  //package.json
  const packageJson = await fs.readJSON(`${ctx.appDir}/package.json`);
  packageJson.scripts.build = `${packageJson.scripts.build} && tsc -p tsconfig.cli.json`;
  await fs.writeJSON(`${ctx.appDir}/package.json`, packageJson, { spaces: 2 });

  //tsconfig
  const tsconfig = await fs.readFile(`${ctx.appDir}/tsconfig.json`, "utf-8");

  const tsconfigJson = json5.parse(tsconfig);
  tsconfigJson.exclude = [
    ...["./node_modules/**", "./svelte-kit/[!ambient.d.ts]**"],
    "./src/lib/cli/**/*",
  ];
  await fs.writeFile(
    `${ctx.appDir}/tsconfig.json`,
    JSON.stringify(tsconfigJson, null, 2)
  );
};

export const configurePlugin: ListrTask[] = [
  {
    enabled(ctx: Ctx) {
      return ctx.extendsCLI;
    },
    task: copyFiles,
    title: "adding configuration files",
  },
  {
    enabled(ctx: Ctx) {
      return ctx.extendsCLI;
    },
    task: adjustConfigFiles,
    title: "adjusting configuration files",
  },
  {
    task: installDeps,
    title: "installing dependencies",
  },
];
