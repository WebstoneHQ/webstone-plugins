import { readFileSync } from 'fs';
import { getSchema, Field, Model } from '@mrleebo/prisma-ast';
import { SourceFile, VariableDeclarationKind } from 'ts-morph';

export const getModelByName = (modelName: string) => {
	const schema = getSchema(readFileSync('prisma/schema.prisma', { encoding: 'utf8' }));
	return schema.list.find((item) => item.type === 'model' && item.name === modelName);
};

export const getAllModels = () => {
	const schema = getSchema(readFileSync('prisma/schema.prisma', { encoding: 'utf8' }));
	return schema.list.filter((item) => item.type === 'model');
};

export const mapZodType = (prop: Field) => {
	let zodType = '';
	let modifiers: string[] = [''];
	switch (prop.fieldType) {
		case 'Int':
			zodType = 'z.number()';
			modifiers = [...modifiers, 'int()'];
			break;
		case 'String':
			zodType = 'z.string()';
			break;
		case 'BigInt':
			zodType = 'z.bigint()';
			break;
		case 'DateTime':
			zodType = 'z.date()';
			break;
		case 'Float':
			zodType = 'z.number()';
			break;
		case 'Decimal':
			zodType = 'z.number()';
			break;
		case 'Boolean':
			zodType = 'z.boolean()';
			break;
		default:
			zodType = 'z.unknown()';
			break;
	}

	if (prop.array) modifiers = [...modifiers, 'array()'];
	if (prop.optional) modifiers = [...modifiers, 'nullish()'];
	return `${zodType}${modifiers.join('.')}`;
};

export const populateSubrouterFile = (sourceFile: SourceFile, model: Model) => {
	sourceFile.addImportDeclaration({
		moduleSpecifier: 'webstone-plugin-web-trpc',
		namedImports: ['z']
	});

	generateSchemaForModel(sourceFile, model);
};

const generateSchemaForModel = (sourceFile: SourceFile, model: Model) => {
	sourceFile.addVariableStatement({
		declarationKind: VariableDeclarationKind.Const,
		isExported: true,
		leadingTrivia: (writer) => writer.blankLineIfLastNot(),
		declarations: [
			{
				name: model.name,
				initializer: (writer) => {
					writer
						.write('z.object(')
						.inlineBlock(() => {
							model.properties
								.filter((prop) => prop.type === 'field')
								.forEach((prop) => {
									if (prop.type !== 'field') return;
									writer
										.write(`${prop.name}: ${mapZodType(prop)}`)
										.write(',')
										.newLine();
								});
						})
						.write(')');
				}
			}
		]
	});
};
