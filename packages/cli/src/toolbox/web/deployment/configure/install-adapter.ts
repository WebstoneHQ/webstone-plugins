import type { Adapter } from "./types";

import { print } from "@webstone/gluegun";
import add from "../../../package-manager/add";

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
