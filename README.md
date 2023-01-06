# Webstone

> **Warning**
>
> This project is released as pre-beta. We do our best to not break anything, but can't guarantee it. We welcome feedback via [Discussions](https://github.com/WebstoneHQ/webstone/discussions) and are happy to prioritize new plugins based on community demand.

Webstone provides a CLI and an ecosystem of plugins to develop your full-stack web application.

Use the CLI to add REST API endpoints and/or pages. Need a payment integration? Install a payment plugin and use the CLI to create the necessary files and code.

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

This creates a skeleton [SvelteKit](https://kit.svelte.dev) app and installs the `@webstone/cli` Webstone CLI dev dependency.

> **Note**
>
> You can also run the above command in an existing SvelteKit project!
>
> This allows anyone to benefit from the Webstone plugin ecosystem, even if you already have an app.

## Plugin ecosystem

Webstone at its core only consists of the `@webstone/cli` CLI. Any Webstone plugin is either created by the Webstone team and hosted in our monorepo or developed by anyone
from the community.

No matter who authors a plugin, each plugin is created with the following command:`

```
[npm|yarn|pnpm] create webstone-app my-plugin --type=plugin
```

Note: If you ommit the `--type` argument, the CLI will ask whether you want to create a new app or a plugin.

The following diagram illustrates the Webstoe ecosystem.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/WebstoneHQ/webstone/main/docs/assets/webstone-ecosystem-dark.excalidraw.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/WebstoneHQ/webstone/main/docs/assets/webstone-ecosystem-light.excalidraw.png">
  <img alt="Shows a Webstone ecosystem diagram where each plugin's name starts with webstone-, regardless of whether the Webstone team or someon from the community authored a plugin." src="https://raw.githubusercontent.com/WebstoneHQ/webstone/main/docs/assets/webstone-ecosystem-light.excalidraw.png">
</picture>

## Documentation

Please refer to the content in the [`docs`](./docs) directory.

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## FAQ

### Is Webstone a boilerplate project?

**No.** When you create your new project with a boilerplate today, today's version of the boilerplate is what you get. You miss out on bug fixes and new features – unless you manually scan the boilerplate's PRs and copy & paste code to your project.

With Webstone, you can add/remove the `@webstone/cli` CLI and any plugin to your project at any time. As new releases become available, you enjoy the benefits by simply upgrading your dependencies.
Should a package upgrade require code changes in your project, Webstone provides automated migrations.

### Does Webstone lock me in?

**No.** Webstone plugins are just like any other NPM dependency. If you no longer want to use the CLI, simply remove `@webstone/cli` from your project's `package.json` file.

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

Webstone is the next logical step!

With Webstone, I am working on a complete project starter kit you can use to develop your next full-stack application based on modern technologies. It is based on what I see as the next big thing:

- [Svelte](https://svelte.dev) & [SvelteKit](https://kit.svelte.dev)
- [GraphQL](https://graphql.org)
- [Prisma](https://www.prisma.io)
- Your database of choice
- Deployed to any platform ([Vercel](https://vercel.com), [Netlify](https://www.netlify.com), [Begin](https://begin.com), AWS, GCP, etc.).

## Community

I share updates in the [Webstone Discord chat](https://discord.gg/WTyAkYe8t3). Come join and help shape Webstone 🙏.
