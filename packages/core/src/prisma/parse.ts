import { readFileSync } from "fs";
import {
  parsePrismaSchema as schemaParser,
  PrismaSchema,
} from "@loancrate/prisma-schema-parser";

export const parsePrismaSchema = (schemaPath: string) => {
  const file = readFileSync(schemaPath, { encoding: "utf-8" });
  return schemaParser(file);
};

export const getModelFromSchema = (schema: PrismaSchema, modelName: string) => {
  const model = schema.declarations.find(
    (schema) => schema.kind === "model" && schema.name.value === modelName
  );
  return model;
};
