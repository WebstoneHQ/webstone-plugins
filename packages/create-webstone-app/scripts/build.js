import { defineConfig, build } from "tsup";

/**
 * @type {"build" | "dev"}
 */

const mode = process.argv[2];

// check if mode is valid
if (!["build", "dev"].includes(mode)) {
  console.log("Usage: node ./scripts/build.js build|dev");
  process.exit(1);
}

const config = defineConfig({
  entry: ["src/index.ts", "src/bin.ts"],
  target: "esnext",
  format: "esm",
  treeshake: true,
  minify: true,
  dts: true,
  watch: mode === "dev" ? ["src"] : false,
});

await build(config);
