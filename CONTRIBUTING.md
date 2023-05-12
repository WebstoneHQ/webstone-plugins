# Contributing

First and foremost, thank you for your interest in contributing to Webstone 🎉!

> **Local development**: If you prefer to work on your local computer, the best advice is to run the commands in [`.gitpod.yml`](./.gitpod.yml). Things like installing `pnpm` globally, installing dependencies, creating a development app to test your Webstone Plugins changes, etc. The main thing to keep in mind is that the Webstone Plugins code is checked out in a `webstone` directory and the development app lives in a sibling directory called `webstone-dev-app`.
>
> Please note that the remaining content refers to contributions made via Gitpod.

To contribute to Webstone Plugins, we use [Gitpod](https://www.gitpod.io). Click the button below to start your developer environment - no setup required on your local computer.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/WebstoneHQ/webstone)

## Directory structure

Your Webstone Plugins workspace contains the following directory structure:

```
/workspace/
├── webstone
└── webstone-dev-app
```

### `webstone`

This is where you find the Webstone Plugins source code. It's the content of the https://github.com/WebstoneHQ/webstone repository.

The most important directories within are:

<!-- `tree -L 3 -I '__tests__|dist|docs|node_modules|scripts|src' -d` -->

```
/workspace/webstone/
└── packages
    ├── cli
    ├── core
    └── create-webstone-app
        └── template
```

**`create-webstone-app`**

This is what `pnpm` downloads when a developer runs `pnpm init webstone-app my-web-app`. The `bin` script defined in the `package.json` is what gets executed. The `template` directory is the monorepo structure of the final project, e.g. the content of `my-web-app` in the previous `pnpm init` command or the content of the `webstone-dev-app` directory discussed in the next section.

**`core` and `cli`**

These are the only two Webstone dependencies used in the `create-webstone-app/template/package.json` file. As Webstone Plugins evolves, it is the job of the `core` package to depend on additional Webstone packages. With that, the developer experience for Webstone apps is as simple as it gets with only two dependencies needed.

_Fun fact_: Thanks to this simplicity, any regular SvelteKit web application can be turned into a Webstone project by adding the `@webstone/cli` and `@webstone/core` dependencies. Once installed, the Webstone CLI can be leveraged to further develop the project.

### `webstone-dev-app`

This is a development app where you can test changes made to the `webstone` directory above. The dev app's Webstone CLI is symlinked to the `webstone/packages/cli` package. The app runs on port 3000. To preview the web app, use the "Remote Explorer" panel on the left-hand side to open port 3000 in a new browser tab or run `gp url 3000` to get the URL.

## Test framework changes

Each package in `webstone/packages/*` contains a `dev` script defined in the `package.json` file. This script watches source files and when it detects a change, generates the package's output. Often, this is either an `esbuild` or `tsc -w` kind of command.

As you change packages, the `webstone-dev-app` project has access to these changes instantly due to the symlink that exists from the Webstone CLI in `webstone-dev-app/node_modules/@webstone/cli` to the `webstone/packages/cli` directory.

## Release a package

Packages configured in `pnpm-workspace.yaml` are released automatically when a pull request is merged into the default branch, as long as there is at least one changeset present for a given package. Please refer to https://github.com/atlassian/changesets for details on changesets.

To add a changeset:

- Run `pnpm changeset`
- Commit all files as part of your pull request

When the PR gets merged, the [`.github/workflows/release.yml`](.github/workflows/release.yml) workflow will open a release pull request. Review & merge this to publish the changed packages to the NPM registry.
