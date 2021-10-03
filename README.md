# Webstone

Start your next web application with Webstone and configure it as you go.

```
npm init webstone-app my-project
```

What you get with the above command is a full-stack web application project - everything you need when you develop a modern web application. More specifically, the project contains:

- Frontend
  - [Svelte](https://svelte.dev)
  - [SvelteKit](https://kit.svelte.dev)
  - TODO: Document the integration with the backend
- Backend
  - TODO: Document the backend technologies & database choices

## Development

To develop or contribute to Webstone, we use [Gitpod](https://www.gitpod.io). Click the button below to start your development environment.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/WebstoneHQ/webstone)

### Release a package

Packages configured in `pnpm-workspace.yaml` are released automatically when a pull request is merged into the default branch, as long as there is at least one changeset present for a given package. Please refer to https://github.com/atlassian/changesets for details on changesets.

To add a changeset:

- Run `pnpm changeset`
- Commit all files as part of your pull request

When the PR gets merged, the [`.github/workflows/release.yml`](.github/workflows/release.yml) workflow will open a release pull request. Review & merge this to publish the changed packages to the NPM registry.

## The backstory of Webstone

I ([mikenikles on Twitter](https://twitter.com/mikenikles)) started to write about developer experience & productivity [as far back as 2017](https://www.mikenikles.com/blog/a-mostly-automated-release-process) and continued to do so on a regular basis. In January 2020, I open sourced a [`monorepo-template`](https://github.com/mikenikles/monorepo-template) repo which I had used as a template for a few projects. In summer of 2020, I released the [Cloud Native Web Development](https://www.mikenikles.com/cloud-native-web-development) book and corresponding source code to help web developers go from zero to production. It contains everything from `git init` to monitoring a web application in a productione environment.

Ever since, I have received feedback from readers who thanked me for putting the source code together and how it saved them weeks of setting up their web app project. It's been encouraging to hear from individuals, but even more so from software agencies who were able to cut their time to market significantly.

Webstone is the next logial step! With Webstone, I am providing a complete project starter kit you can use to develop your next web application based on modern technologies. It is based on what I see as the next big thing in web development: [Svelte](https://svelte.dev) & [SvelteKit](https://kit.svelte.dev), [GraphQL](https://graphql.org/) and your choice of database and deployment platform (think [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), [Begin](https://begin.com), etc.). It contains features any web application needs, sooner or later. Features such as authentication, persistence, billing, sending emails, etc.

The Webstone project started in 2021. If you are interested, please [join our Discord chat](https://discord.gg/WTyAkYe8t3).
