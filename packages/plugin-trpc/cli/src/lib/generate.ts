import { readFileSync } from 'fs';

import { parsePrismaSchema as prismaParser, PrismaSchema } from '@loancrate/prisma-schema-parser';

export const parsePrismaSchema = () => {
	return prismaParser(readFileSync('prisma/schema.prisma', { encoding: 'utf8' }));
};

export const getPrismaModelByName = (name: string, schema: PrismaSchema) => {
	const model = schema.declarations.find(
		(declaration) =>
			declaration.kind === 'model' && declaration.name.value.toLowerCase() === name.toLowerCase()
	);
	return model;
};
