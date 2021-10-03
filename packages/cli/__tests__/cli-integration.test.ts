const { system, filesystem } = require("gluegun");
const pkg = require("../package.json");

const src = filesystem.path(__dirname, "..");

const cli = async (cmd) =>
  system.run("node " + filesystem.path(src, "bin") + ` --tests ${cmd}`);

test("outputs version", async () => {
  const output = await cli("--version");
  expect(output).toContain(pkg.version);
});

test("outputs help", async () => {
  const output = await cli("--help");
  expect(output).toContain(pkg.version);
});
