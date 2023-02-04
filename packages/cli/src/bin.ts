import { WebstoneToolbox } from "./extensions/web";
import { build } from "@webstone/gluegun";

export const run = async () => {
  const cli = build()
    .brand("webstone")
    .src(__dirname)
    .plugins("./node_modules", { matching: "webstone-plugin-*-cli" })
    .help()
    .version()
    .exclude([
      // "filesystem",
      "http",
      // "meta",
      "package-manager",
      // "patching",
      // "print",
      // "prompt",
      "semver",
      // "strings",
      // "system",
      // "template",
    ])
    .create();
  const toolbox = (await cli.run(process.argv)) as WebstoneToolbox;

  // Return to use it in tests
  return toolbox;
};
