import { Ctx } from "../../helpers";
import path, { dirname } from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { ListrTask } from "listr2";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const copyTemplate = async (ctx: Ctx) => {
  const appDir = ctx.appDir;
  fs.copySync(
    path.join(__dirname, "..", "template", "plugin", "structure"),
    appDir
  );
};

export const configurePlugin: ListrTask[] = [
  {
    task: copyTemplate,
    title: "Setting up Plugin Structure",
  },
];
