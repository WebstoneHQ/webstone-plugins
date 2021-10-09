import { filesystem } from "gluegun";
import { availableAdapters } from "./adapters";

export default () => {
  const webPackageJson = filesystem.read("./services/web/package.json", "json");
  const availableAdapterNpmPackages = availableAdapters.map(
    (adapter) => adapter.npmPackage
  );
  return (
    Object.keys(webPackageJson.devDependencies).find((devDependency) =>
      availableAdapterNpmPackages.includes(devDependency)
    ) || ""
  );
};
