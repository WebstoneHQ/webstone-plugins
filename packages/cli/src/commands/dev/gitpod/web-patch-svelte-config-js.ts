import { GluegunCommand } from "gluegun";

const command: GluegunCommand = {
  run: async (toolbox) => {
    const { patching, print } = toolbox;
    const fileToPatch = "services/web/svelte.config.js";
    print.info(`Patching ${fileToPatch}...`);
    await patching.patch(fileToPatch, {
      insert: `,
    vite: {
      server: {
        hmr: {
          clientPort: process.env.HMR_HOST ? 443 : 3000,
          host: process.env.HMR_HOST ? process.env.HMR_HOST.substring("https://".length) : "localhost"
        }
      }
    }`,
      after: `target: '#svelte'`,
    });
    print.info(`Patched ${fileToPatch}.`);
  },
};

module.exports = command;
