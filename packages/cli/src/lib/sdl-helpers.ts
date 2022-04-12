/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDMMF } from "@prisma/sdk";

export async function getModel(name: string) {
  const models = await getDMMF({ datamodelPath: "services/schema.prisma" });
  return models.datamodel.models.find((model) => model.name === name);
}

export function getQuerySDL(model: any) {
  return model.fields.map((field: any) => mapModelFieldToSDL(field));
}

function mapModelFieldToSDL(field: any) {
  return `${field.name}: ${field.isRequired ? "!" : ""}${field.type}`;
}
