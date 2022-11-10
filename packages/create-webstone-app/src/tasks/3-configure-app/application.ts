import { execa } from "execa";
import fs from "fs-extra";
import { ListrTask } from "listr2";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Ctx, determinePackageManager } from "../../helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const installCLI = async (ctx: Ctx) => {
  const installProcess = execa(
    determinePackageManager(),
    ["add", "-D", "@webstone/cli"],
    {
      shell: true,
      cwd: ctx.appDir,
    }
  );

  return installProcess.stdout;
};

export const copyReadme = async (ctx: Ctx) => {
  const templateDir = path.join(
    __dirname,
    "..",
    "templates",
    "application",
    "README.md"
  );
  fs.copySync(templateDir, `${ctx.appDir}/README.md`);
};

export const configureApp: ListrTask[] = [
  {
    task: copyReadme,
    title: "Configuring Readme",
  },
  {
    task: installCLI,
    title: "Install dependencies",
  },
];
