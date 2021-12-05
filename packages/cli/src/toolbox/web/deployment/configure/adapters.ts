import { Adapter } from "./types";

export const availableAdapters: Adapter[] = [
  {
    // Enable & test when https://github.com/architect/architect/issues/1236 is resolved.
    //   identifier: "adapter-begin",
    //   name: "Begin / Architect",
    //   npmPackage: "@architect/sveltekit-adapter",
    //   nextStepsDocsLink: "https://github.com/architect/sveltekit-adapter"
    // }, {
    identifier: "adapter-cloudflare-workers",
    name: "Cloudflare Workers",
    npmPackage: "@sveltejs/adapter-cloudflare-workers",
    npmPackageVersion: "@next",
    nextStepsDocsLink:
      "https://github.com/sveltejs/kit/tree/master/packages/adapter-cloudflare-workers",
  },
  {
    identifier: "adapter-netlify",
    name: "Netlify",
    npmPackage: "@sveltejs/adapter-netlify",
    npmPackageVersion: "@next",
    nextStepsDocsLink:
      "https://github.com/sveltejs/kit/tree/master/packages/adapter-netlify",
  },
  {
    identifier: "adapter-node",
    name: "Node.js",
    npmPackage: "@sveltejs/adapter-node",
    npmPackageVersion: "@next",
    nextStepsDocsLink:
      "https://github.com/sveltejs/kit/tree/master/packages/adapter-node",
  },
  {
    identifier: "adapter-static",
    name: "Static",
    npmPackage: "@sveltejs/adapter-static",
    npmPackageVersion: "@next",
    nextStepsDocsLink:
      "https://github.com/sveltejs/kit/tree/master/packages/adapter-static",
  },
  {
    identifier: "adapter-vercel",
    name: "Vercel",
    npmPackage: "@sveltejs/adapter-vercel",
    npmPackageVersion: "@next",
    nextStepsDocsLink:
      "https://github.com/sveltejs/kit/tree/master/packages/adapter-vercel",
  },
];
