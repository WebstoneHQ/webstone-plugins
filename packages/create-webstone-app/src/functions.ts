import fs from "fs-extra";
import path from "node:path";
import { PackageJson } from "type-fest";
import { appPackageJson, pluginPackageJson } from "./package";
import merge from "ts-deepmerge";
import { create } from "create-svelte";
import { WebstoneAppType } from "../types";

export function getRawAppName(cwd: string) {
  let appName: string = cwd;
  if (cwd === ".") {
    appName = process.cwd().split("/").pop() || "webstone-project";
  }
  return appName;
}

export function getAppName(cwd: string, type: WebstoneAppType) {
  let appName = getRawAppName(cwd);
  if (type === "plugin") {
    appName = `webstone-plugin-${appName}`;
    return toValidPackageName(appName);
  }
  return toValidPackageName(appName);
}

export function toValidPackageName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9~.-]+/g, "-");
}

export function createBaseApp(
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
export function sortKeys(obj: any) {
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

export function updatePackageJSON(
  cwd: string,
  options: { type: WebstoneAppType; extendCLI: boolean },
) {
  const { type, extendCLI } = options;
  const pkg: PackageJson = fs.readJSONSync(path.resolve(`${cwd}/package.json`));
  let newPkg: PackageJson = pkg;
  if (type === "app") {
    newPkg = deepMergeWithSortedKeys(pkg, appPackageJson);
  }
  if (type === "plugin" && extendCLI) {
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
      if (["dependencies", "devDependencies", "scripts"].includes(key)) {
        sortedObj[key] = sortKeys(obj[key]);
      } else {
        sortedObj[key] = obj[key];
      }
    });

    return sortedObj;
  }

  return recursiveSort(merged);
}

export function copyBuildScript(cwd: string) {
  fs.copySync(
    new URL("../templates/plugin-structure/build-cli.js", import.meta.url)
      .pathname,
    `${cwd}/scripts/build-cli.js`,
  );
}

export function copyCLIExtension(cwd: string) {
  // copy command
  fs.copySync(
    new URL("../templates/plugin-structure/command.ts", import.meta.url)
      .pathname,
    `${cwd}/src/cli/commands/plugins/${getRawAppName(cwd)}/hello-world.ts`,
  );

  //copy extension
  fs.copySync(
    new URL("../templates/plugin-structure/extension.ts", import.meta.url)
      .pathname,
    `${cwd}/src/cli/extensions/hello-world.ts`,
  );

  // copy templates
  fs.copySync(
    new URL("../templates/plugin-structure/template.ejs", import.meta.url)
      .pathname,
    `${cwd}/src/cli/templates/template.ejs`,
  );
}
