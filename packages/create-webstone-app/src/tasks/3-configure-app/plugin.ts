import { execa } from "execa";
import { ListrTask } from "listr2";
import { Ctx } from "../../helpers";

export const installDeps = async (ctx: Ctx) => {
  const installProcess = execa("pnpm", ["install"], {
    shell: true,
    cwd: ctx.appDir,
  });

  return installProcess.stdout;
};

export const configurePlugin: ListrTask[] = [
  {
    task: installDeps,
    title: "installing dependencies",
  },
];
