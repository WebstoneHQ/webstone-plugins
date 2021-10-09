import type { GluegunToolbox } from "gluegun";
import type { WebToolbox } from "./web/types";

import webConfigureDeployment from "./web/configure/deployment";

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
