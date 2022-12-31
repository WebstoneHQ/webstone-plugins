import { readFileSync } from 'fs';
import { getSchema, Field, Model } from '@mrleebo/prisma-ast';
import { SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';

export const getModelByName = (modelName: string) => {
	const schema = getSchema(readFileSync('prisma/schema.prisma', { encoding: 'utf8' }));
	return schema.list.find(
		(item) => item.type === 'model' && item.name.toLowerCase() === modelName.toLowerCase()
	);
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

export const getIDType = (model: Model) => {
	const idField = model.properties.find(
		(prop) => prop.type === 'field' && prop.attributes?.find((attr) => attr.name === 'id')
	);
	if (idField?.type !== 'field') throw new Error('ID field not found');
	return idField ? mapZodType(idField) : 'z.unknown()';
};

export const populateSubrouterFile = (sourceFile: SourceFile, model: Model, modelName?: string) => {
	sourceFile.addImportDeclaration({
		moduleSpecifier: 'webstone-plugin-web-trpc',
		namedImports: ['z']
	});

	generateSchemaForModel(sourceFile, model, modelName);
};

const generateSchemaForModel = (sourceFile: SourceFile, model: Model, modelName?: string) => {
	const zodModelDeclaration = sourceFile.addVariableStatement({
		declarationKind: VariableDeclarationKind.Const,
		isExported: true,
		leadingTrivia: (writer) => writer.blankLineIfLastNot(),
		trailingTrivia: (writer) => writer.blankLineIfLastNot(),
		declarations: [
			{
				name: modelName || `${model.name.toLowerCase()}Model`,
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
	zodModelDeclaration.setOrder(2);
};

export const prepareApprouter = (
	sourceFile: SourceFile,
	routerName: string,
	routerFile: string
) => {
	const existingImport = sourceFile.getImportDeclaration((declaration) => {
		return declaration.getModuleSpecifierValue() === `./subrouters/${routerFile}`;
	});

	if (!existingImport) {
		sourceFile.addImportDeclaration({
			moduleSpecifier: `./subrouters/${routerFile}`,
			namedImports: [routerName]
		});
	}

	const appRouterDeclaration = sourceFile.getVariableDeclaration('appRouter');

	const existingArgument = appRouterDeclaration
		?.getInitializerIfKindOrThrow(SyntaxKind.CallExpression)
		.getArguments()
		.find((arg) => arg.getText() === routerName);

	if (!existingArgument) {
		appRouterDeclaration
			?.getInitializerIfKindOrThrow(SyntaxKind.CallExpression)
			.addArgument(routerName);
	}
};
