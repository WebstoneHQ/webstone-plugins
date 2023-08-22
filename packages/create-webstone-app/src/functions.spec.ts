import { it, describe } from "node:test";
import { deepEqual, deepStrictEqual, strictEqual } from "node:assert";
import path from "node:path";
import {
  sortKeys,
  toValidPackageName,
  getAppName,
  getRawAppName,
  updatePackageJSON,
  copyBuildScript,
  copyCLIExtension,
} from "./functions";
import { WebstoneAppType } from "../types";
import fs from "fs-extra";

describe("sortKeys", () => {
  it("should sort keys of an object in ascending order", () => {
    const input = { c: 3, a: 1, b: 2 };
    const expectedOutput = { a: 1, b: 2, c: 3 };
    const result = sortKeys(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle an empty object", () => {
    const input = {};
    const expectedOutput = {};
    const result = sortKeys(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle an object with a single key", () => {
    const input = { z: 26 };
    const expectedOutput = { z: 26 };
    const result = sortKeys(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle an object with string and number keys", () => {
    const input = { b: 2, a: 1, 2: "value", 1: "value" };
    const expectedOutput = { "1": "value", "2": "value", a: 1, b: 2 };
    const result = sortKeys(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle an object with nested objects", () => {
    const input = { b: { c: 3, a: 1 }, a: 2 };
    const expectedOutput = { a: 2, b: { a: 1, c: 3 } };
    const result = sortKeys(input);
    deepStrictEqual(result, expectedOutput);
  });
});

describe("toValidPackageName", () => {
  it("should convert a valid name to a valid package name", () => {
    const input = "  My Package Name  ";
    const expectedOutput = "my-package-name";
    const result = toValidPackageName(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle a name with leading periods and underscores", () => {
    const input = ".__my_package_name";
    const expectedOutput = "-my-package-name";
    const result = toValidPackageName(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle a name with non-alphanumeric characters", () => {
    const input = "!@#$My_Package%^Name*";
    const expectedOutput = "-my-package-name-";
    const result = toValidPackageName(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle an already valid package name", () => {
    const input = "already-valid-package-name";
    const expectedOutput = "already-valid-package-name";
    const result = toValidPackageName(input);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle an empty name", () => {
    const input = "";
    const expectedOutput = "";
    const result = toValidPackageName(input);
    deepStrictEqual(result, expectedOutput);
  });
});

describe("getAppName", () => {
  it("should generate a valid app name for app type", () => {
    const cwd = "dummy";
    const type: WebstoneAppType = "app";
    const expectedOutput = "dummy";
    const result = getAppName(cwd, type);
    deepStrictEqual(result, expectedOutput);
  });

  it("should generate a valid app name for plugin type", () => {
    const cwd = "dummy";
    const type: WebstoneAppType = "plugin";
    const expectedOutput = "webstone-plugin-dummy";
    const result = getAppName(cwd, type);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle leading periods and underscores in app name", () => {
    const cwd = "__my_app";
    const type: WebstoneAppType = "app";
    const expectedOutput = "-my-app";
    const result = getAppName(cwd, type);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle plugin type and special characters", () => {
    const cwd = "/dummy";
    const type = "plugin";
    const expectedOutput = "webstone-plugin--dummy";
    const result = getAppName(cwd, type);
    deepStrictEqual(result, expectedOutput);
  });
});

describe("getRawAppName", () => {
  it('should return the current dir when cwd is "."', (ctx) => {
    const cwdMock = ctx.mock.fn(process.cwd, () => "dummy-dir");
    ctx.mock.method(process, "cwd", cwdMock);
    const cwd = ".";
    const expectedOutput = "dummy-dir";
    const result = getRawAppName(cwd);
    deepStrictEqual(result, expectedOutput);
  });

  it("should handle a single-character cwd", () => {
    const cwd = "/a";
    const expectedOutput = "/a";
    const result = getRawAppName(cwd);
    deepStrictEqual(result, expectedOutput);
  });
});

describe("updatePackageJson", () => {
  it("should update the package.json properly for type app", (ctx) => {
    const mockReadJsonSync = ctx.mock.fn(fs.readJSONSync, () => {
      return {};
    });
    const mockWriteJsonSync = ctx.mock.fn(fs.writeJsonSync, () => {});
    const mockPathResolve = ctx.mock.fn(path.resolve, (cwd: string) => cwd);
    ctx.mock.method(fs, "readJSONSync", mockReadJsonSync);
    ctx.mock.method(fs, "writeJsonSync", mockWriteJsonSync);
    ctx.mock.method(path, "resolve", mockPathResolve);
    const cwd = "dummy";
    updatePackageJSON(cwd, { extendCLI: false, type: "app" });
    strictEqual(mockReadJsonSync.mock.callCount(), 1);
    strictEqual(mockWriteJsonSync.mock.callCount(), 1);
    deepStrictEqual(mockWriteJsonSync.mock.calls[0].arguments, [
      "dummy/package.json",
      {
        devDependencies: {
          "@webstone/cli": "^0.12.0",
        },
      },
      {
        encoding: "utf-8",
        spaces: "\t",
      },
    ]);
  });

  it("should update the package.json properly for type plugin that does extend the cli", (ctx) => {
    const mockReadJsonSync = ctx.mock.fn(fs.readJSONSync, () => {
      return {};
    });
    const mockWriteJsonSync = ctx.mock.fn(fs.writeJsonSync, () => {});
    const mockPathResolve = ctx.mock.fn(path.resolve, (cwd: string) => cwd);
    ctx.mock.method(fs, "readJSONSync", mockReadJsonSync);
    ctx.mock.method(fs, "writeJsonSync", mockWriteJsonSync);
    ctx.mock.method(path, "resolve", mockPathResolve);
    const cwd = "dummy";
    updatePackageJSON(cwd, { extendCLI: false, type: "plugin" });
    strictEqual(mockReadJsonSync.mock.callCount(), 1);
    strictEqual(mockWriteJsonSync.mock.callCount(), 1);
    deepStrictEqual(mockWriteJsonSync.mock.calls[0].arguments, [
      "dummy/package.json",
      {},
      {
        encoding: "utf-8",
        spaces: "\t",
      },
    ]);
  });

  it("should update the package.json properly for type plugin that doesn't extend the cli", (ctx) => {
    const mockReadJsonSync = ctx.mock.fn(fs.readJSONSync, () => {
      return {};
    });
    const mockWriteJsonSync = ctx.mock.fn(fs.writeJsonSync, () => {});
    const mockPathResolve = ctx.mock.fn(path.resolve, (cwd: string) => cwd);
    ctx.mock.method(fs, "readJSONSync", mockReadJsonSync);
    ctx.mock.method(fs, "writeJsonSync", mockWriteJsonSync);
    ctx.mock.method(path, "resolve", mockPathResolve);
    const cwd = "dummy";
    updatePackageJSON(cwd, { extendCLI: true, type: "plugin" });
    strictEqual(mockReadJsonSync.mock.callCount(), 1);
    strictEqual(mockWriteJsonSync.mock.callCount(), 1);
    deepStrictEqual(mockWriteJsonSync.mock.calls[0].arguments, [
      "dummy/package.json",
      {
        scripts: {
          build:
            "npm run clean:build && npm run cli:build && npm run web:build",
          "clean:build": "rimraf ./dist",
          "cli:build":
            "node scripts/build-cli.js build && npm run templates:copy",
          "cli:dev": "node scripts/build-cli.js dev",
          dev: "npm run clean:build && npm-run-all --parallel cli:dev web:dev templates:dev",
          package: "svelte-kit sync && svelte-package -o ./dist/web && publint",
          "templates:copy": "cp -a ./src/cli/templates ./dist/cli",
          "templates:dev":
            "nodemon --watch src/cli/templates --ext '.ejs' --exec 'npm run templates:copy'",
          "web:build": "vite build && npm run package",
          "web:dev": "vite dev",
        },
        devDependencies: {
          "@webstone/gluegun": "0.0.5",
          "fs-jetpack": "^5.1.0",
          nodemon: "^3.0.1",
          "npm-run-all": "^4.1.5",
          rimraf: "^3.0.2",
          tsup: "^6.7.0",
        },
        svelte: "./dist/web/index.js",
        types: "./dist/web/index.d.ts",
        exports: {
          ".": {
            types: "./dist/web/index.d.ts",
            svelte: "./dist/web/index.js",
          },
        },
      },
      {
        encoding: "utf-8",
        spaces: "\t",
      },
    ]);
  });
});

describe("copyBuildScript", () => {
  it("should copy the build script properly", (ctx) => {
    const mockCopySync = ctx.mock.fn(fs.copySync, () => {});
    ctx.mock.method(fs, "copySync", mockCopySync);
    copyBuildScript("dummy");
    strictEqual(mockCopySync.mock.callCount(), 1);
    deepEqual(
      // TODO find a solution for import.meta.url
      mockCopySync.mock.calls[0].arguments[1],
      "dummy/scripts/build-cli.js",
    );
  });
});

describe("copyCLIExtension", () => {
  it("should copy the CLI extension properly", (ctx) => {
    const mockCopySync = ctx.mock.fn(fs.copySync, () => {});
    ctx.mock.method(fs, "copySync", mockCopySync);
    copyCLIExtension("dummy");
    strictEqual(mockCopySync.mock.callCount(), 3);

    //Commands
    deepStrictEqual(
      mockCopySync.mock.calls[0].arguments[1],
      "dummy/src/cli/commands/plugins/dummy/hello-world.ts",
    );

    // Extensions
    deepStrictEqual(
      mockCopySync.mock.calls[1].arguments[1],
      "dummy/src/cli/extensions/hello-world.ts",
    );

    // Templates
    deepStrictEqual(
      mockCopySync.mock.calls[2].arguments[1],
      "dummy/src/cli/templates/template.ejs",
    );
  });
});
