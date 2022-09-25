import type { GluegunToolbox } from "@webstone/gluegun";
import type { WebToolbox } from "./web/types";

import webConfigureDeployment from "./web/deployment/configure";

export interface WebstoneToolbox extends GluegunToolbox, WebToolbox {}

export default (toolbox: GluegunToolbox) => {
  const webToolbox: WebToolbox = {
    web: {
      configure: {
        deployment: webConfigureDeployment,
      },
    },
  };
  toolbox.web = {
    ...webToolbox.web,
  };
};
