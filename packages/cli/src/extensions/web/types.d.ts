import type { Adapter } from "../../toolbox/web/deployment/configure/types";

export interface WebToolbox {
  web: {
    configure: {
      deployment: {
        availableAdapters: Adapter[];
        getInstalledAdapter: () => Adapter;
        installAdapter: (adapter: Adapter) => Promise<void>;
        isAnyAdapterInstalled: () => boolean;
        removeAdapter: (adapter: Adapter) => Promise<void>;
      };
    };
  };
}
