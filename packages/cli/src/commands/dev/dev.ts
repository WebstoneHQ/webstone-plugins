import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  alias: ["d"],
  description: "Start the dev server(s)",
  run: async (toolbox) => {
    const { filesystem, parameters, print, system } = toolbox;

    const servicesToStart = filesystem
      .subdirectories("./services/")
      .filter((serviceDir) =>
        parameters.first ? serviceDir.includes(parameters.first) : true
      );

    print.info(
      `Starting services: ${servicesToStart
        .map((service) => service.substring("services/".length))
        .join(", ")}...`
    );
    await system.exec(
      `pnpm run dev ${servicesToStart
        .map((service) => `--filter ./${service}`)
        .join(" ")}`,
      {
        stdout: "inherit",
      }
    );
  },
};

module.exports = command;
