export type Adapter = {
  identifier:
    | "adapter-begin"
    | "adapter-cloudflare-workers"
    | "adapter-netlify"
    | "adapter-node"
    | "adapter-static"
    | "adapter-vercel";
  name: string;
  npmPackage: string;
  npmPackageVersion?: string;
  nextStepsDocsLink: string;
};
