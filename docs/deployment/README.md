# Deployment

To deploy your application, it takes two steps:

1. Configure where to deploy it to
2. Deploy it

## Configure the deployment

You have to configure the deployment once per service. This gives you the flexibility to deploy individual services independently. For example, you can deploy the `web` service to Vercel while you host the API & database on Google Cloud Platform.

### Configure the `web` service

Please use the [`pnpm webstone web configure deployment`](../../packages/cli/docs#webstone-web-configure-deployment) CLI command and follow the prompts.

## Deploy

You can deploy individual services independently or all at once. The CLI command to use is [`pnpm webstone deploy [service] [--preview]`](../../packages/cli/docs#https://github.com/WebstoneHQ/webstone/tree/main/packages/cli/docs#webstone-deploy).

The `pnpm webstone deploy` CLI command prepares your application for deployment. Many hosting providers nowadays support a convenient integration with your git provider such as GitHub, GitLab or Bitbucket. Consult the following provider-specific sections to deploy your application.

### `web` service

To prepare your `web` service for deployment, run `pnpm webstone deploy web`.

#### Cloudflare Workers

TBD: Pull requests welcome 🙏

#### Netlify

TBD: Pull requests welcome 🙏

#### Node

TBD: Pull requests welcome 🙏

#### Static

TBD: Pull requests welcome 🙏

#### Vercel

To get started, please use Vercel's "Create a New Project" instructions at https://vercel.com/docs/get-started.

Vercel automatically detects that the `web` service is a SvelteKit application - no configuration necessary.

What you do have to teach Vercel though is that the `web` service is located in the `services/web` directory rather than the root of the project which is assumed by Vercel by default.

> As you set up (or configure) your project on Vercel, pay close attention to [the "Root Directory" configuration option](https://vercel.com/docs/concepts/deployments/build-step#root-directory). Make sure this is set to `services/web`.

That's it,
