# Contributing

First and foremost, thank you for your interest in contributing to Webstone Plugins 🎉!

To contribute to Webstone Plugins, we use [Devbox](https://github.com/jetpack-io/devbox). Click the button below to start your development environment - no setup required on your local computer.

[![Open In Devbox.sh](https://jetpack.io/img/devbox/open-in-devbox.svg)](https://devbox.sh/github.com/WebstoneHQ/webstone-plugins)

> Please note that the remaining content refers to contributions made via Devbox.

## Local development (with Devbox)

Devbox also works locally. To get started, install it:

```shell
curl -fsSL https://get.jetpack.io/devbox | bash
```

Next, open a new Devbox Shell:

```shell
devbox shell
```

This installs all required dependencies and provides you with helpful scripts. To see a list of available scripts:

```shell
devbox run -l
```

Open multiple terminals and execute the following commands within `devbox shell`:

1. `pnpm dev`
   - This starts the dev environment and watches all Webstone Plugins files for changes.
1. `devbox run dev-app:configure-and-start`
   - Creates a new `_dev-app` directory and starts its dev server. Use this app to test your Webstone Plugins code changes.

## Local development (without Devbox)

If you prefer to install dependencies on your own, please refer to `devbox.json` for a list of required packages. The `package.json` file contains helpful `scripts` you can execute to build, run, and test Webstone Plugins and the dev app (see below).

## Directory structure

Your Webstone Plugins workspace contains the following directory structure:

```
./webstone-plugins
├── _dev-app
├── packages
└── tests
```

### `_dev-app`

This is a development app where you can test changes made to the `webstone` directory above. The dev app's Webstone CLI is symlinked to the `../packages/cli` package. The app runs on port 5173.

### `packages`

This is where you find the Webstone Plugins source code.

The most important directories within are:

<!-- `tree -L 2 -I 'tests|dist|docs|node_modules|scripts|src' -d ./packages` -->

```
./packages
├── cli
├── core
├── create-webstone-app
│   └── templates
└── plugin-*
```

**`create-webstone-app`**

This is what `pnpm` downloads when a developer runs `pnpm init webstone-app my-web-app`. The `bin` script defined in the `package.json` is what gets executed. The `template` directory is the monorepo structure of the final project, e.g. the content of `my-web-app` in the previous `pnpm init` command or the content of the `_dev-app` directory discussed above.

**`core` and `cli`**

These are the only two Webstone dependencies used in the `create-webstone-app/template/package.json` file. As Webstone Plugins evolves, it is the job of the `core` package to depend on additional Webstone packages. With that, the developer experience for Webstone apps is as simple as it gets with only two dependencies needed.

_Fun fact_: Thanks to this simplicity, any regular SvelteKit web application can be turned into a Webstone project by adding the `@webstone/cli` and `@webstone/core` dependencies. Once installed, the Webstone CLI can be leveraged to further develop the project.

## Test framework changes

Each package in `webstone/packages/*` contains a `dev` script defined in the `package.json` file. This script watches source files and when it detects a change, generates the package's output. Often, this is either an `esbuild` or `tsc -w` kind of command.

As you change packages, the `_dev-app` project has access to these changes instantly due to the symlink that exists from the Webstone CLI in `_dev-app/node_modules/@webstone/cli` to the `./packages/cli` directory.

## Release a package

Packages configured in `pnpm-workspace.yaml` are released automatically when a pull request is merged into the default branch, as long as there is at least one changeset present for a given package. Please refer to https://github.com/atlassian/changesets for details on changesets.

To add a changeset:

- Run `pnpm changeset`
- Commit all files as part of your pull request

When the PR gets merged, the [`.github/workflows/release.yml`](.github/workflows/release.yml) workflow will open a release pull request. Review & merge this to publish the changed packages to the NPM registry.
