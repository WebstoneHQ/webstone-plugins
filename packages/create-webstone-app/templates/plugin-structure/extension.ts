import type { GluegunToolbox } from "@webstone/gluegun";

const extension = (toolbox: GluegunToolbox) => {
  const { print } = toolbox;

  toolbox.sayhello = () => {
    print.info("Hello from an extension!");
  };
};

export default extension;
