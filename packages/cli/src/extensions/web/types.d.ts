import type { Adapter } from "../../toolbox/web/configure/deployment/types";

export interface WebToolbox {
  web: {
    configure: {
      deployment: {
        availableAdapters: Adapter[];
        getInstalledAdapterPackageName: () => string;
        installAdapter: (adapter: Adapter) => Promise<void>;
        isAnyAdapterInstalled: () => boolean;
        removeAdapter: (adapter: Adapter) => Promise<void>;
      };
    };
  };
}
