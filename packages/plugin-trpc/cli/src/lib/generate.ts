import { Field, Model, Enum } from '@mrleebo/prisma-ast';
import { Project, SourceFile, SyntaxKind, VariableDeclarationKind } from 'ts-morph';
import {
	generateCompleteModelName,
	generateEnumFilename,
	generateEnumName,
	generateModelFilename,
	generateRouterFilename,
	generateZodEnumName,
	generateZodModelName
} from './naming';
import { getAllEnums, getModelByName } from './parser';

const scalarTypes = ['Int', 'String', 'BigInt', 'DateTime', 'Float', 'Decimal', 'Boolean'];

export const generateModelSchema = (sourceFile: SourceFile, model: Model) => {
	sourceFile.addImportDeclaration({
		moduleSpecifier: 'webstone-plugin-web-trpc',
		namedImports: ['z']
	});

	const nonScalarFileds = getNonScalarFields(model);

	sourceFile.addVariableStatement({
		declarationKind: VariableDeclarationKind.Const,
		isExported: true,
		leadingTrivia: (writer) => writer.blankLineIfLastNot(),
		trailingTrivia: (writer) => writer.blankLineIfLastNot(),
		declarations: [
			{
				name:
					nonScalarFileds.length > 0
						? generateZodModelName(model.name)
						: generateCompleteModelName(model.name),
				initializer: (writer) => {
					writer
						.write('z.object(')
						.inlineBlock(() => {
							model.properties
								.filter((prop) => prop.type === 'field')
								.filter(
									(prop) => prop.type === 'field' && scalarTypes.includes(prop.fieldType as string)
								)
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

	if (nonScalarFileds.length > 0) {
		nonScalarFileds.forEach((field) => {
			if (field.type !== 'field') return;
			const isEnum = determineEnum(field);
			if (isEnum && isEnum.type === 'enum') {
				sourceFile.addImportDeclaration({
					moduleSpecifier: `../enums/${generateEnumFilename(isEnum.name)}`,
					namedImports: [generateZodEnumName(isEnum.name), generateEnumName(isEnum.name)]
				});
			}
			if (!isEnum) {
				sourceFile.addImportDeclarations([
					{
						moduleSpecifier: `../models/${generateModelFilename(field.fieldType as string)}`,
						namedImports: [`Complete${field.fieldType}Model`]
					},
					{
						moduleSpecifier: `../models/${generateModelFilename(field.fieldType as string)}`,
						namedImports: [`${field.fieldType as string}WithRelations`],
						isTypeOnly: true
					}
				]);
			}
		});
		sourceFile.addInterface({
			isExported: true,
			name: `${model.name}WithRelations`,
			leadingTrivia: (writer) => writer.blankLineIfLastNot(),
			trailingTrivia: (writer) => writer.blankLineIfLastNot(),
			extends: [`z.infer<typeof ${generateZodModelName(model.name)}>`],
			properties: nonScalarFileds.map((field) => {
				let type = '';
				if (field.type !== 'field') return { name: '', type: 'any' };
				const isEnum = determineEnum(field);
				if (isEnum && isEnum.type === 'enum') {
					type = `${generateEnumName(isEnum.name)}${field.array ? '[]' : ''}${
						field.optional ? ' | null' : ''
					}`;
				} else {
					type = `${field.fieldType as string}WithRelations${field.array ? '[]' : ''}${
						field.optional ? ' | null' : ''
					}`;
				}
				return {
					hasQuestionToken: field.optional,
					name: field.name,
					type
				};
			})
		});

		sourceFile.addVariableStatement({
			declarationKind: VariableDeclarationKind.Const,
			isExported: true,
			leadingTrivia: (writer) => writer.blankLineIfLastNot(),
			trailingTrivia: (writer) => writer.blankLineIfLastNot(),
			declarations: [
				{
					name: `Complete${model.name}Model`,
					type: `z.ZodSchema<${model.name}WithRelations>`,
					initializer: (writer) => {
						writer
							.write(`z.lazy(() => ${generateZodModelName(model.name)}.extend(`)
							.inlineBlock(() => {
								nonScalarFileds.forEach((prop) => {
									if (prop.type !== 'field') return;
									writer
										.write(`${prop.name}: ${mapZodType(prop)}`)
										.write(',')
										.newLine();
								});
							})
							.write('))');
					}
				}
			]
		});
	}
};

export const generateEnumSchema = (sourceFile: SourceFile, enumModel: Enum) => {
	sourceFile.addImportDeclaration({
		moduleSpecifier: 'webstone-plugin-web-trpc',
		namedImports: ['z']
	});

	const enumValues = enumModel.enumerators.map(
		(enumerator) => enumerator.type === 'enumerator' && enumerator.name
	);

	sourceFile.addEnum({
		isExported: true,
		name: generateEnumName(enumModel.name),
		leadingTrivia: (writer) => writer.blankLineIfLastNot(),
		trailingTrivia: (writer) => writer.blankLineIfLastNot(),
		members: enumValues.map((value) => ({
			name: value ? value : ''
		}))
	});

	sourceFile.addVariableStatement({
		declarationKind: VariableDeclarationKind.Const,
		isExported: true,
		leadingTrivia: (writer) => writer.blankLineIfLastNot(),
		trailingTrivia: (writer) => writer.blankLineIfLastNot(),
		declarations: [
			{
				name: `${generateZodEnumName(enumModel.name)}`,
				initializer: (writer) => {
					writer.write(`z.nativeEnum(${generateEnumName(enumModel.name)})`);
				}
			}
		]
	});
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
	}

	if (!zodType) {
		const isEnum = determineEnum(prop);
		if (isEnum && isEnum.type === 'enum') {
			zodType = `${generateZodEnumName(isEnum.name)}`;
		}
		if (!isEnum) {
			zodType = `Complete${prop.fieldType}Model`;
		}
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

export const populateSubrouterFile = (project: Project, model: Model) => {
	const subrouterFilename = generateRouterFilename(model.name);
	const subrouterTarget = `src/lib/server/trpc/subrouters/${subrouterFilename}.ts`;

	generateSchemaForModel(project, model, new Set());

	const subRouter = project.getSourceFileOrThrow(subrouterTarget);

	subRouter.addImportDeclaration({
		moduleSpecifier: 'webstone-plugin-web-trpc',
		namedImports: ['z']
	});

	subRouter.formatText({
		tabSize: 1
	});

	subRouter.addImportDeclaration({
		moduleSpecifier: `../models/${generateModelFilename(model.name)}`,
		namedImports: [generateCompleteModelName(model.name)]
	});
};

export const getNonScalarFields = (model: Model) => {
	return model.properties.filter(
		(prop) => prop.type === 'field' && !scalarTypes.includes(prop.fieldType as string)
	);
};

export function determineEnum(field: Field) {
	const fieldName = field.fieldType;
	const allEnums = getAllEnums();
	const enumType = allEnums.find(
		(enumItem) => enumItem.type === 'enum' && enumItem.name === fieldName
	);
	return enumType;
}

const generateSchemaForModel = (project: Project, model: Model, generatedEntities: Set<string>) => {
	generatedEntities.add(model.name);
	const nonScalarFields = getNonScalarFields(model);
	nonScalarFields.forEach((field) => {
		if (field.type !== 'field') return;
		const enumType = determineEnum(field);
		if (enumType && enumType.type === 'enum') {
			if (generatedEntities.has(enumType.name)) return;
			const sourceFile = project.createSourceFile(
				`src/lib/server/trpc/${
					enumType && enumType.type === 'enum'
						? `enums/${generateEnumFilename(enumType.name)}`
						: `models/${generateModelFilename(model.name)}`
				}.ts`,
				'',
				{ overwrite: true }
			);
			generateEnumSchema(sourceFile, enumType);
			generatedEntities.add(enumType.name);
		} else {
			const dependantModel = getModelByName(field.fieldType as string);
			if (generatedEntities.has(field.fieldType as string)) return;
			if (dependantModel && dependantModel.type === 'model') {
				generatedEntities.add(dependantModel.name);
				generateSchemaForModel(project, dependantModel, generatedEntities);
			}
		}
	});

	const mainModelFile = project.createSourceFile(
		`src/lib/server/trpc/models/${generateModelFilename(model.name)}.ts`,
		'',
		{ overwrite: true }
	);
	generateModelSchema(mainModelFile, model);
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
