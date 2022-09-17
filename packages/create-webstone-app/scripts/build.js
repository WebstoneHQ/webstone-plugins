import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

/**
 * @type {Object.<string, esbuild.BuildOptions>}
 */

const config = {
  shared: {
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
  },
  build: {},
  dev: {
    watch: true,
  },
};

const mode = process.argv[2];
if (!mode) {
  console.error("Usage: node ./scripts/esbuild.js build|dev");
  process.exit(1);
}

esbuild
  .build({
    ...config.shared,
    ...(config[mode] || {}),
  })
  .catch(() => process.exit(1));
