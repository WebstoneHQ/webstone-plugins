import { API, FileInfo } from "jscodeshift";

export const parser = "tsx";

export default function adjustPlaywright(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ObjectExpression)
    .forEach((path) => {
      if (path.value.properties.length === 1) {
        console.log(path.value.properties);
        path.value.properties.push({
          type: "Property",
          key: { type: "Identifier", name: "testMatch" },
          value: { type: "Literal", value: "**/*.e2e.ts" },
          kind: "init",
        });
      }
      return path;
    })
    .toSource();
}
