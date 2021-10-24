# Webstone CLI

Webstone provides a `pnpm webstone` (or `pnpm ws` for short) CLI, making interacting with your full-stack application simpler and more streamlined.

- [Webstone CLI](#webstone-cli)
  - [Extend the CLI](#extend-the-cli)
  - [Commands](#commands)
    - [webstone deploy web](#webstone-deploy-web)
    - [webstone dev](#webstone-dev)
    - [webstone web configure deployment](#webstone-web-configure-deployment)
    - [webstone web create page](#webstone-web-create-page)
    - [webstone web delete page](#webstone-web-delete-page)
    - [webstone web svelte-add](#webstone-web-svelte-add)

## Extend the CLI

To extend the Webstone CLI with your own commands, please refer to [the Plugins documentation](./plugins.md).

## Commands

<!-- Command template
### webstone xyz

Describe the command

**Usage**

```bash
webstone xyz
```

* `--flag` - Describe the flag
-->

### webstone deploy web

Deploys the `web` service based on a configured deployment adapter.

**Note**: This command only works after you configured a deployment adapter. See [`webstone web configure deployment`](#webstone-web-configure-deployment)

**Usage**

```bash
webstone deploy web [--preview]
```

- `--preview` - Preview your application in production mode before you deploy it. Equivalent to [`svelte-kit preview`](https://kit.svelte.dev/docs#command-line-interface-svelte-kit-build)

### webstone dev

Starts the development servers.

**Usage**

```bash
webstone dev [service]
```

- `--service` - A service to start, e.g. `web`. The list of available services can be found in your Webstone project's `services/` directory. Any of the directory name can be used for the `--service` flag.

### webstone web configure deployment

Add a deployment adapter for the `web` service. Please refer to SvelteKit's ["Adapters"](https://kit.svelte.dev/docs#adapters) documentation if you are not familiar with that concept.

**Note**: Once the command completes, please make sure you read the console output and follow the link(s) provided to complete the adapter configuration.

**Usage**

```bash
webstone web configure deployment
```

### webstone web create page

Creates a new page in your `web` service. E.g.`/about-us`.

**Usage**

```bash
webstone create page [name]
```

- `--name` - The name of the page to create. This can be `--name about-us` or `--name "About Us"`. If no name is provided, the CLI will prompt you interactively.

### webstone web delete page

Deletes a page in your `web` service. E.g.`/about-us`.

**Usage**

```bash
webstone delete page [name]
```

- `--name` - The name of the page to delete. This can be `--name about-us` or `--name "About Us"`. If no name is provided, the CLI will prompt you interactively.

### webstone web svelte-add

This is a convenience wrapper around `svelte-add` (https://github.com/svelte-add/svelte-add) to add things like Tailwind CSS, mdsvex, etc.

**Usage**

```bash
webstone web svelte-add <integration>
```

- `--integration` - Mandatory, the name of the integration to add, e.g. `tailwindcss` or `mdsvex`. Please refer to [the `svelte-add` docs](https://github.com/svelte-add/svelte-add) for a list of available integrations.
