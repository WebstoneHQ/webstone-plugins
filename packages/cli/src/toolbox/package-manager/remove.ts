import type { PkgMngrOptions } from "./types";

import { system } from "@webstone/gluegun";
import { determinePackageManager } from "../../helpers";

export default async (packageName: string, options?: PkgMngrOptions) => {
  const dev = options?.dev ? "-D " : "";
  const stdout = await system.run(
    `${determinePackageManager()} remove ${dev}${packageName}`,
    {
      cwd: options?.dir || "",
    }
  );
  return { success: true, stdout };
};
