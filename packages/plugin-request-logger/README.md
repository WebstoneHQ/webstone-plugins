# Webstone Plugin

This is a monorepo managed by [pnpm](https://pnpm.io/) that contains two optional, independent parts that make up a [Webstone](https://github.com/WebstoneHQ/webstone/) plugin:

- `packages/cli` ([docs](#cli))
- `packages/web` ([docs](#web))

Your plugin could only extend the Webstone CLI, only extend the web aspect of Webstone Plugins, or both.

## CLI

Webstone Plugins provides a `webstone` CLI used by developers to enhance their projects. You can extend this CLI with `packages/cli`.

Please refer to the [gluegun documentation](https://infinitered.github.io/gluegun/#/?id=quick-start) for instructions on how to develop commands and extensions.

## Web

In many cases, you want to create a Webstone Plugin to provide UI components, actions, or other web-based functionality. This is where `packages/web` comes into play. It is a basic SvelteKit `skeletonlib` project ([docs](https://kit.svelte.dev/docs/packaging)). Developers working on a SvelteKit application will be able to import your UI components as regular Svelte components. The same is true for actions or other web-based functionality your plugin provides.

## Development

Please make sure you have [pnpm](https://pnpm.io/) installed:

```
npm i -g pnpm
```

Start the development scripts for both packages:

```
pnpm dev
```

Alternatively, you can start the development script for either package as follows:

```
pnpm --filter ./packages/[cli|web]
```

## Publish to NPM

Each package, `packages/cli` and `packages/web`, is deployed to NPM as independent package. Before you proceed, please open the `package.json` file for the package(s) you want to publish to NPM and set the `private` property to `false`.

```diff
{
-  "private": true,
+  "private: false,
}
```

### Changesets

To simplify the publishing process, we configured [Changesets](https://github.com/changesets/changesets).

When you are ready to publish your package(s), please run `pnpm changeset` from the root of this project. Follow the instructions in the terminal and commit your changes. Once you pushed your commits, watch out for a new pull request titled "Version Packages". When you merge that PR, the package(s) will be published to NPM automatically.

**`NPM_TOKEN` required**

To make the publish process described above work automatically, please configure a NPM_TOKEN accessible in your GitHub Actions.

- [Docs on how to create a new NPM token](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- [Docs on how to create a `NPM_TOKEN` encrypted secret on GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
