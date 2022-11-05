import { execSync } from "child_process";

type PackageManagers = "npm" | "pnpm" | "yarn";

/**
 * If you modify this function, also change it in
 * webstone/packages/create-webstone-app/src/helpers.ts
 */
export const determinePackageManager = (): PackageManagers => {
  const packageManagers: PackageManagers[] = ["pnpm", "yarn"];
  const installedPackageManager: PackageManagers =
    packageManagers.find((pkgManager) => {
      try {
        execSync(`${pkgManager} --version`);
        return pkgManager;
      } catch (_) {
        // Current `pkgManager` is not installed, move on to the next.
      }
    }) || "npm";

  return installedPackageManager;
};
