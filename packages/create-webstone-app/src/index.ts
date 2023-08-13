import { CreateWebstoneOptions, WebstoneAppType } from "../types";
import { create } from "create-svelte";

export async function createWebstone(
  cwd: string,
  options: CreateWebstoneOptions,
) {
  const { type } = options;
  const appName = getAppName(cwd, type);

  createBaseApp(cwd, { type, appName });

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

function createBaseApp(
  cwd: string,
  options: { type: WebstoneAppType; appName: string },
) {
  const { appName, type } = options;
  create(cwd, {
    name: appName,
    template: type === "app" ? "skeleton" : "skeletonlib",
    types: "typescript",
    eslint: true,
    prettier: true,
    playwright: true,
    vitest: true,
  });
}
