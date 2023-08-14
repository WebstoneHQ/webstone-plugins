import { CreateWebstoneOptions, WebstoneAppType } from "../types";
import fs from "fs-extra";
import path from "node:path";
import { PackageJson } from "type-fest";
import { appPackageJson, pluginPackageJson } from "./package";
import merge from "ts-deepmerge";
import { create } from "create-svelte";

export async function createWebstone(
  cwd: string,
  options: CreateWebstoneOptions,
) {
  const { type } = options;
  const appName = getAppName(cwd, type);
  createBaseApp(cwd, { type, appName });
  updatePackageJSON(cwd, { type });
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortKeys(obj: any) {
  if (typeof obj !== "object" || obj === null)
    throw new Error("Invalid object");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortedObj: Record<string, any> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = obj[key];
    });
  return sortedObj;
}

function updatePackageJSON(cwd: string, options: { type: WebstoneAppType }) {
  const { type } = options;
  const pkg: PackageJson = fs.readJSONSync(path.resolve(`${cwd}/package.json`));
  let newPkg: PackageJson = pkg;
  if (type === "app") {
    newPkg = deepMergeWithSortedKeys(pkg, appPackageJson);
  }
  if (type === "plugin") {
    newPkg = deepMergeWithSortedKeys(pkg, pluginPackageJson);
  }

  fs.writeJsonSync(path.resolve(`${cwd}/package.json`), newPkg, {
    encoding: "utf-8",
    spaces: "\t",
  });
}

function deepMergeWithSortedKeys(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  const merged = merge(target, source);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recursiveSort(obj: Record<string, any>): Record<string, any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedObj: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        sortedObj[key] = sortKeys(recursiveSort(obj[key]));
      } else {
        sortedObj[key] = obj[key];
      }
    });

    return sortedObj;
  }

  return recursiveSort(merged);
}
