//@ts-ignore this package doesn't provide a declaration file
import { create } from "create-svelte";
import { Ctx, getAppName } from "../../helpers";
import path, { dirname } from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { ListrTask } from "listr2";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const copyTemplate = (ctx: Ctx) => {
  const appDir = ctx.appDir;
  fs.copySync(
    path.join(__dirname, "..", "template", "plugin", "structure"),
    appDir
  );
};

export const renameChildPackage = (ctx: Ctx) => {
  const cliPackageJson = fs.readJSONSync(
    path.join(ctx.appDir, "packages", "cli", "package.json")
  );
  cliPackageJson.name = `webstone-plugin-cli-${getAppName(ctx.appDir)}`;
  fs.writeJSONSync(
    path.join(ctx.appDir, "packages", "cli", "package.json"),
    cliPackageJson,
    {
      spaces: "\t",
    }
  );
};

export const renameMainPackage = (ctx: Ctx) => {
  const packageJson = fs.readJSONSync(path.join(ctx.appDir, "package.json"));
  packageJson.name = `webstone-plugin-${getAppName(ctx.appDir)}`;
  fs.writeJSONSync(path.join(ctx.appDir, "package.json"), packageJson, {
    spaces: "\t",
  });
};

export const renamePackages = async (ctx: Ctx) => {
  renameChildPackage(ctx);
  renameMainPackage(ctx);
};

export const createCLINamespace = (ctx: Ctx) => {
  fs.renameSync(
    path.join(ctx.appDir, "packages", "cli", "src", "commands", "placeholder"),
    path.join(
      ctx.appDir,
      "packages",
      "cli",
      "src",
      "commands",
      getAppName(ctx.appDir)
    )
  );
};

const createSveltekitPackage = async (ctx: Ctx) => {
  fs.removeSync(path.join(ctx.appDir, "packages", "web", ".gitkeep"));
  await create(path.join(ctx.appDir, "packages", "web"), {
    name: `webstone-plugin-web-${getAppName(ctx.appDir)}`,
    template: "skeletonlib",
    types: "typescript",
    prettier: true,
    eslint: true,
    playwright: true,
  });
};

export const configurePlugin: ListrTask[] = [
  {
    task: copyTemplate,
    title: "Setting up Plugin Structure",
  },
  {
    task: renamePackages,
    title: "setting package names",
  },
  {
    task: createCLINamespace,
    title: "Creating CLI Namespace",
  },
  {
    task: createSveltekitPackage,
    title: "Creating SvelteKit Package",
  },
];
