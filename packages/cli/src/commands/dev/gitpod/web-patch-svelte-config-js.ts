import { GluegunCommand } from "@webstone/gluegun";

const command: GluegunCommand = {
  hidden: true,
  run: async (toolbox) => {
    const { patching, print } = toolbox;
    const fileToPatch = "vite.config.ts";
    print.info(`Patching ${fileToPatch}...`);
    await patching.patch(fileToPatch, {
      insert: `,
      server: {
        hmr: {
          clientPort: process.env.HMR_HOST ? 443 : 5173,
          host: process.env.HMR_HOST ? process.env.HMR_HOST.substring("https://".length) : "localhost"
        }
      }
    `,
      after: `plugins: [sveltekit()]`,
    });
    print.info(`Patched ${fileToPatch}.`);
  },
};

module.exports = command;
