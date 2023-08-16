import { it, describe } from "node:test";
import { deepStrictEqual } from "node:assert";
import {
  sortKeys,
  toValidPackageName,
  getAppName,
  getRawAppName,
} from "./functions";
import { WebstoneAppType } from "../types";

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
