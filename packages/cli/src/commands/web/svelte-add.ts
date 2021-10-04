import { GluegunCommand } from "gluegun";

/**
 * This is a wrapper for `npx svelte-add@latest <integration>`.
 *
 * @see https://github.com/svelte-add/svelte-add
 */
const command: GluegunCommand = {
  run: async (toolbox) => {
    const { print, parameters, system } = toolbox;

    if (parameters.first === undefined) {
      print.error(
        "Please provide an integration, i.e. `pnpm webstone web svelte-add tailwindcss`. For available integrations, please visit https://github.com/svelte-add/svelte-add."
      );
      return;
    }

    const svelteAddCommand = `npx svelte-add@latest ${parameters.first}`;
    print.highlight(`Delegating to svelte-add: ${svelteAddCommand}`);
    const result = await system.run(svelteAddCommand, {
      cwd: "./services/web",
    });
    print.info(result);
  },
};

module.exports = command;
