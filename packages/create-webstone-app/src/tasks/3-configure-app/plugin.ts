import { execa } from "execa";
import fs from "fs-extra";
import { ListrTask } from "listr2";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Ctx, determinePackageManager } from "../../helpers";

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
  const cliPath = path.join(__dirname, "..", "template", "plugin", "cli");
  fs.copySync(tsconfigPath, `${ctx.appDir}/tsconfig.cli.json`);
  fs.copySync(cliPath, `${ctx.appDir}/src/lib/cli`);
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
    task: installDeps,
    title: "Install dependencies",
  },
];
