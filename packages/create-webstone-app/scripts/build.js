import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

/**
 * @type {Object.<string, esbuild.BuildOptions>}
 */
const config = {
  format: "esm",
  target: "esnext",
  plugins: [nodeExternalsPlugin()],
  banner: {
    js: "#!/usr/bin/env node",
  },
  bundle: true,
  entryPoints: ["./src/index.ts"],
  logLevel: "info",
  minify: true,
  outfile: "./dist/index.js",
  platform: "node",
};

/**
 * @type {"build" | "dev"}
 */
const mode = process.argv[2];
if (!mode) {
  console.error("Usage: node ./scripts/esbuild.js build|dev");
  process.exit(1);
}

switch (mode) {
  case "build":
    await esbuild.build(config).catch(() => process.exit(1));
    break;
  case "dev": {
    const context = await esbuild
      .context({
        ...config.shared,
      })
      .catch(() => process.exit(1));
    await context.watch();
    break;
  }
}
