import { PackageJson } from "type-fest";

export const appPackageJson: PackageJson = {
  devDependencies: {
    "@webstone/cli": "^0.12.0",
  },
};

export const pluginPackageJson: PackageJson = {
  devDependencies: {
    "@webstone/gluegun": "0.0.5",
    "fs-jetpack": "^5.1.0",
    nodemon: "^3.0.1",
    "npm-run-all": "^4.1.5",
    rimraf: "^3.0.2",
    tsup: "^6.7.0",
  },
};
