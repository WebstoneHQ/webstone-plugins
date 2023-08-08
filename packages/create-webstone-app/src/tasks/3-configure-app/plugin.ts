import fs from "fs-extra";
import { execa } from "execa";
import path from "path";
import { ListrTask } from "listr2";
import { Ctx, getAppName } from "../../helpers";

export const installDeps = async (ctx: Ctx) => {
  const installProcess = execa("pnpm", ["install"], {
    shell: true,
    cwd: ctx.appDir,
  });

  return installProcess.stdout;
};

const installWebDevDependencies = async (ctx: Ctx) => {
  const installCliPluginProcess = execa(
    "pnpm",
    [
      "add",
      "-D",
      `webstone-plugin-${getAppName(ctx.appDir)}-cli`,
      "@webstone/cli",
    ],
    {
      shell: true,
      cwd: path.join(ctx.appDir, "packages", "web"),
    },
  );

  return installCliPluginProcess.stdout;
};

const configureWebPrepublishOnlyScript = async (ctx: Ctx) => {
  const prepublishOnlyCommands = [
    `pnpm remove webstone-plugin-${getAppName(ctx.appDir)}-cli @webstone/cli`,
    "pnpm package",
  ];
  const packageJson = fs.readJSONSync(
    path.join(ctx.appDir, "packages", "web", "package.json"),
  );
  packageJson.scripts.prepublishOnly = prepublishOnlyCommands.join(" && ");
  fs.writeJSONSync(
    path.join(ctx.appDir, "packages", "web", "package.json"),
    packageJson,
    {
      spaces: "\t",
    },
  );
};

export const configurePlugin: ListrTask[] = [
  {
    task: installDeps,
    title: "Installing dependencies",
  },
  {
    task: installWebDevDependencies,
    title: "Installing `web` dev dependencies",
  },
  {
    task: configureWebPrepublishOnlyScript,
    title: "Configuring the `prepublishOnly` script for the web directory",
  },
];
