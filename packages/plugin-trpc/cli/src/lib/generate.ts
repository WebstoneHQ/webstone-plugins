import { readFileSync } from 'fs';

import {
	parsePrismaSchema as prismaParser,
	PrismaSchema,
	SchemaDeclaration
} from '@loancrate/prisma-schema-parser';
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

export const generateZodSchema = (model: SchemaDeclaration) => {
	const fields =
		model.kind === 'model' && model.members.filter((member) => member.kind === 'field');

	if (!fields) {
		return;
	}

	const zodFields = fields.map((field) => {
		console.log(field);
	});
	console.log(zodFields);
};
const prismaTsMap: { [key: string]: string } = {
	boolean: 'boolean',
	datetime: 'date',
	float: 'number',
	int: 'number',
	string: 'string'
};
