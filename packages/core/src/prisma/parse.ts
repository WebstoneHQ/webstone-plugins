import { readFileSync } from "fs";
import { parsePrismaSchema as schemaParser } from "@loancrate/prisma-schema-parser";

export type getModelFromSchemaOptions = {
  schemaPath?: string;
};

const getModelFromSchemaDefaults: getModelFromSchemaOptions = {
  schemaPath: "prisma/schema.prisma",
};

export const getModelFromSchema = (
  modelName: string,
  options?: getModelFromSchemaOptions
) => {
  const resolvedOptions = {
    ...getModelFromSchemaDefaults,
    ...options,
  };
  const file = readFileSync(resolvedOptions.schemaPath, { encoding: "utf-8" });
  const schema = schemaParser(file);
  const model = schema.declarations.find(
    (schema) => schema.kind === "model" && schema.name.value === modelName
  );
  return model;
};
