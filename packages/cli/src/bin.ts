const { build } = require("gluegun");

async function run(argv) {
  const cli = build()
    .brand("webstone")
    .src(__dirname)
    .plugins("./node_modules", { matching: "webstone-cli-*", hidden: true })
    .help()
    .version()
    .exclude([
      // "filesystem",
      "http",
      // "meta",
      "package-manager",
      // "patching",
      // "print",
      "prompt",
      "semver",
      "strings",
      "system",
      "template",
    ])
    .create();
  const toolbox = await cli.run(argv);

  // Return to use it in tests
  return toolbox;
}

module.exports = { run };
