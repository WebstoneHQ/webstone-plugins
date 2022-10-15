import type { GluegunToolbox } from "@webstone/gluegun";

export default (toolbox: GluegunToolbox) => {
  toolbox.hello = {
    message: "hello world",
  };
};
