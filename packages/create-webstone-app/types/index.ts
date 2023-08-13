export type CreateWebstoneOptions = {
  type: WebstoneAppType;
  extendCLI: boolean;
};

export type WebstoneAppType = "app" | "plugin";
