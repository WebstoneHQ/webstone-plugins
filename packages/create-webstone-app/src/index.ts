import { CreateWebstoneOptions } from "../types";
import {
  copyBuildScript,
  copyCLIExtension,
  createBaseApp,
  getAppName,
  updatePackageJSON,
} from "./functions";

export async function createWebstone(
  cwd: string,
  options: CreateWebstoneOptions,
) {
  const { type, extendCLI } = options;
  const appName = getAppName(cwd, type);
  createBaseApp(cwd, { type, appName });
  updatePackageJSON(cwd, { type, extendCLI });
  if (type === "plugin" && extendCLI) {
    copyBuildScript(cwd);
    copyCLIExtension(cwd);
  }
}
