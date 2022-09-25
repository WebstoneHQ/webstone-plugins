import type { PnpmOptions } from "./types";

import { system } from "@webstone/gluegun";

export default async (packageName: string, options?: PnpmOptions) => {
  const dev = options?.dev ? "-D " : "";
  const stdout = await system.run(`pnpm remove ${dev}${packageName}`, {
    cwd: options?.dir || "",
  });
  return { success: true, stdout };
};
