type PackageManagers = "npm" | "pnpm" | "yarn";

/**
 * If you modify this function, also change it in
 * webstone/packages/create-webstone-app/src/helpers.ts
 */
export const determinePackageManager = (): PackageManagers => {
  if (process.env.npm_execpath?.endsWith("npm-cli.js")) {
    return "npm";
  } else if (process.env.npm_execpath?.endsWith("pnpm.cjs")) {
    return "pnpm";
  } else if (process.env.npm_execpath?.endsWith("yarn.js")) {
    return "yarn";
  } else {
    console.warn(
      `Could not determine package manager based on "process.env.npm_execpath". Value for env variable: ${process.env.npm_execpath}. Using npm as a fallback. Please report this as a bug, we'd love to make it more resilient.`,
    );
    return "npm";
  }
};
