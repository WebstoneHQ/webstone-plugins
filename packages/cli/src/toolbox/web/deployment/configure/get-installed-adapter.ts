import { filesystem } from "@webstone/gluegun";
import { availableAdapters } from "./adapters";
import { Adapter } from "./types";

export default () => {
  const webPackageJson = filesystem.read("./package.json", "json");
  const availableAdapterNpmPackages = availableAdapters.map(
    (adapter) => adapter.npmPackage,
  );

  const installedAdapterNpmPackage =
    Object.keys(webPackageJson.devDependencies).find((devDependency) =>
      availableAdapterNpmPackages.includes(devDependency),
    ) || "";

  return availableAdapters.find(
    (adapter) => adapter.npmPackage === installedAdapterNpmPackage,
  ) as Adapter;
};
