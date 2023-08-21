import { PackageJson } from "type-fest";

export const appPackageJson: PackageJson = {
  devDependencies: {
    "@webstone/cli": "^0.12.0",
  },
};

export const pluginPackageJson: PackageJson = {
  scripts: {
    build: "npm run clean:build && npm run cli:build && npm run web:build",
    "clean:build": "rimraf ./dist",
    "cli:build": "node scripts/build-cli.js build && npm run templates:copy",
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
};
