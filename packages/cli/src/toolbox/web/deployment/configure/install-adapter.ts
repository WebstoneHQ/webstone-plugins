import type { Adapter } from "./types";

import { print } from "gluegun";
import add from "../../../pnpm/add";

export default async (adapter: Adapter) => {
  const spinner = print.spin(
    `Adding adapter package "${adapter.npmPackage}${
      adapter.npmPackageVersion || ""
    }"...`
  );
  await add(`${adapter.npmPackage}${adapter.npmPackageVersion || ""}`, {
    dev: true,
    dir: "./",
  });
  spinner.succeed(`Adapter added: ${adapter.npmPackage}`);
};
