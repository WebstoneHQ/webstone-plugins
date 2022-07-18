import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

const external = [].concat(
  Object.keys(pkg.dependencies || {}),
  Object.keys(pkg.peerDependencies || {}),
  Object.keys(process.binding("natives")),
  "typescript"
);

/** @type {import('rollup').RollupOptions} */
const config = [
  {
    input: "dist/compiled/index.js",
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: false,
    },
    external: (id) => {
      return id.startsWith("node:") || external.includes(id);
    },
    plugins: [typescript()],
  },
  {
    input: "dist/compiled/dts/index.d.ts",
    output: {
      file: "dist/create-webstone.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];

export default config;
