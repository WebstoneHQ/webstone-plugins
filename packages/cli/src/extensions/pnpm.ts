import type { GluegunToolbox } from "@webstone/gluegun";

import add from "../toolbox/pnpm/add";
import remove from "../toolbox/pnpm/remove";

export default (toolbox: GluegunToolbox) => {
  toolbox.pnpm = {
    add,
    remove,
  };
};
