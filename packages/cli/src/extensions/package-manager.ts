import type { GluegunToolbox } from "@webstone/gluegun";

import add from "../toolbox/package-manager/add";
import remove from "../toolbox/package-manager/remove";

export default (toolbox: GluegunToolbox) => {
  toolbox.pkgMngr = {
    add,
    remove,
  };
};
