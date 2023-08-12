import { CreateWebstoneOptions, WebstoneAppType } from "../types";

export async function createWebstone(
  cwd: string,
  options: CreateWebstoneOptions,
) {
  const { type } = options;
  const appName = getAppName(cwd, type);
  console.log("appName", appName);
}

function getAppName(cwd: string, type: WebstoneAppType) {
  let appName: string = cwd;
  if (cwd === ".") {
    appName = process.cwd().split("/").pop() || "webstone-project";
  }
  if (type === "plugin") {
    appName = `webstone-plugin-${appName}`;
    return toValidPackageName(appName);
  }
  return toValidPackageName(appName);
}

function toValidPackageName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9~.-]+/g, "-");
}
