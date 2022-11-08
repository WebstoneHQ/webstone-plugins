//@ts-ignore this package doesn't provdide a declaration file
import { create } from "create-svelte";
import { Ctx, getAppName } from "../../helpers";

export const initWebApp = async (ctx: Ctx) => {
  try {
    await createApplication(ctx.appDir);
    return;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createApplication = async (appDir: string) => {
  return await create(appDir, {
    name: getAppName(appDir),
    template: "skeleton",
    types: "typescript",
    prettier: true,
    eslint: true,
    playwright: true,
  });
};
