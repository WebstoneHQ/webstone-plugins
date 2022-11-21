import { readFileSync } from 'fs';

import { parsePrismaSchema } from '@loancrate/prisma-schema-parser';

export const getPrismaModelByName = (name: string) => {
	const allModels = parsePrismaSchema(readFileSync('prisma/schema.prisma', { encoding: 'utf8' }));
	const model = allModels.declarations.find(
		(declaration) =>
			declaration.kind === 'model' && declaration.name.value.toLowerCase() === name.toLowerCase()
	);
	return model?.kind === 'model' && model.members;
};
