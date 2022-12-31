# Webstone Plugins

Webstone Plugins is a CLI and an growing list of plugins to develop your full-stack web application.

There is a core `webstone` CLI which can be extended with plugins either by the Webstone Plugins core team or anyone in the community. You can also create private Webstone Plugin components accessible to your team only.

These are some of the available plugins today:

- CRUD for REST APIs
- CRUD for web pages
- Create tRPC ([trpc.io](https://trpc.io)) APIs with a Prisma ([prisma.io](https://www.prisma.io)) database schema as the single source of truth

When a plugin author fixes a bug or releases a new feature, you upgrade your plugin dependency and voilà, your project can take advantage of the latest plugin release.

## Getting started

```bash
npm create webstone-app my-project
```

or

```bash
yarn create webstone-app my-project
```

or

```bash
pnpm create webstone-app my-project
```

This creates a skeleton [SvelteKit](https://kit.svelte.dev) app and installs the `@webstone/cli` Webstone CLI as a dev dependency.

> **Note** > **You can also run the above command in an existing SvelteKit project**!
>
> This allows anyone to benefit from Webstone Plugins, even if you already have an app.

## Plugins

Webstone Plugins at its core only consists of the `@webstone/cli` CLI. Any Webstone plugin is either created by the Webstone team and hosted in our monorepo or developed by anyone
from the community.

No matter who authors a plugin, each plugin is created with the following command:

```
[npm|yarn|pnpm] create webstone-app my-plugin --type=plugin
```

Note: If you omit the `--type` argument, the CLI will ask whether you want to create a new app or a plugin.

The following diagram illustrates what Webstoe Plugins looks like at a high level.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/WebstoneHQ/webstone/main/docs/assets/webstone-plugins-dark.excalidraw.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/WebstoneHQ/webstone/main/docs/assets/webstone-plugins-light.excalidraw.png">
  <img alt="Shows the Webstone Plugins overview where each plugin's name starts with webstone-plugin-, regardless of whether the Webstone team or someone from the community authored a plugin." src="https://raw.githubusercontent.com/WebstoneHQ/webstone/main/docs/assets/webstone-plugins-light.excalidraw.png">
</picture>

## Documentation

Please refer to the content in the [`docs`](./docs) directory.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## FAQ

### Is Webstone a boilerplate project?

**No.** When you create your new project with a boilerplate today, today's version of the boilerplate is what you get. You miss out on bug fixes and new features – unless you manually scan the boilerplate's PRs and copy & paste code to your project. With a boilerplate, you also opt-in to all technologies the author included whereas with Webstone Plugins, you are in control.

With Webstone, you can add/remove the `@webstone/cli` CLI and any plugin to your project at any time. As new releases become available, you enjoy the benefits by simply upgrading your dependencies.
Should a package upgrade require code changes in your project, Webstone provides automated migrations.

### Does Webstone lock me in?

**No.** Webstone Plugins are just like any other NPM dependency. If you no longer want to use the CLI, simply remove `@webstone/cli` as well as any `webstone-plugin-*` dependencies from your project's `package.json` file.

If you use plugins that provide Svelte components and you leverage these components in your project, you have to replace the components with your own code. Of course, feel free to copy & paste a Webstone component into your own project, we're cool with that :-).

## The backstory of Webstone

### 2017

I ([mikenikles on Twitter](https://twitter.com/mikenikles)) started to write about developer experience & productivity [as far back as 2017](https://www.mikenikles.com/blog/a-mostly-automated-release-process) and continued to do so on a regular basis.

### 2019

In January 2020, I open sourced a [`monorepo-template`](https://github.com/mikenikles/monorepo-template) repo which I had used as a template for a few projects.

### 2020

In summer of 2020, I released the [Cloud Native Web Development](https://www.mikenikles.com/cloud-native-web-development) book and corresponding source code to help web developers go from zero to production. It contains everything from `git init` to monitoring a web application in a production environment.

Ever since, I have received feedback from readers who thanked me for putting the source code together and how it saved them weeks of setting up their web app project. It's been encouraging to hear from individuals and from software agencies who are able to cut their time to market significantly.

### 2021

Webstone Plugins is the next logical step!

With Webstone Plugins, we package code we have repeatedly developed in various projects and provide that code as plugins to anyone who wants to speed up their web application development. At its core, Webstone Plugins is an open concept so anyone can create their own plugin and provide it to the community – or keep it private within their organization.

### 2022

[Cahllagerfeld](https://github.com/Cahllagerfeld) joined the core team and started to contribute to the project.

## Community

We share updates in the [Webstone Discord chat](https://discord.gg/WTyAkYe8t3). Join and help shape Webstone Plugins 🙏.
