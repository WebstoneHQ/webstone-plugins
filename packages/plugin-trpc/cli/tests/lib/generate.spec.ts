import { test } from 'uvu';
import * as assert from 'uvu/assert';
import sinon from 'sinon';
import fs from 'node:fs';
import {
	getNonScalarFields,
	determineEnum,
	mapZodType,
	prepareApprouter,
	getIDType
} from '../../src/lib/generate';
import { Field, Model } from '@mrleebo/prisma-ast';
import { Project, SourceFile } from 'ts-morph';

test.after.each(() => {
	sinon.restore();
});

test('should return non-scalar fields', async () => {
	const model: Model = {
		name: 'TestModel',
		type: 'model',
		properties: [
			{
				type: 'field',
				fieldType: 'String',
				name: 'stringField'
			},
			{
				type: 'field',
				fieldType: 'Non-Scalar',
				name: 'nonScalarField'
			},
			{
				type: 'field',
				fieldType: 'Int',
				name: 'numberField'
			}
		]
	};
	const nonScalarFields = getNonScalarFields(model);

	assert.is(nonScalarFields.length, 1);
	assert.is(nonScalarFields[0].type === 'field' && nonScalarFields[0].name, 'nonScalarField');
	assert.equal(nonScalarFields, [
		{
			type: 'field',
			fieldType: 'Non-Scalar',
			name: 'nonScalarField'
		}
	]);
});

test('should determine enum', async () => {
	const fakeReadFileSync = sinon.fake.returns(`
	generator client {
		provider = "prisma-client-js"
	  }
	  
	  datasource db {
		provider = "postgresql"
		url      = env("DATABASE_URL")
	  }
	  
	  model User {
		id     Int     @id @default(autoincrement())
		createdAt DateTime @default(now())
		email  String  @unique
		name   String?
		role   Role?   @default(USER)
		postId Int?
		posts  Post[]
	  }
	  
	  model Post {
		id     Int  @id @default(autoincrement())
		user   User @relation(fields: [userId], references: [id])
		role   Role
		userId Int
	  }
	  
	  enum Role {
		USER
		ADMIN
	  }
`);

	sinon.replace(fs, 'readFileSync', fakeReadFileSync);

	const field: Field = {
		type: 'field',
		fieldType: 'Role',
		name: 'Role'
	};

	const determinedEnum = determineEnum(field);

	assert.ok(determinedEnum);
	assert.is(determinedEnum?.type, 'enum');
	assert.is(determinedEnum.type === 'enum' && determinedEnum?.name, 'Role');
	assert.is(determinedEnum.type === 'enum' && determinedEnum?.enumerators.length, 2);
});

test("should determine enum doesn't exist", async () => {
	const fakeReadFileSync = sinon.fake.returns(`
	generator client {
		provider = "prisma-client-js"
	  }
	  
	  datasource db {
		provider = "postgresql"
		url      = env("DATABASE_URL")
	  }
	  
	  model User {
		id     Int     @id @default(autoincrement())
		createdAt DateTime @default(now())
		email  String  @unique
		name   String?
		role   Role?   @default(USER)
		postId Int?
		posts  Post[]
	  }
	  
	  model Post {
		id     Int  @id @default(autoincrement())
		user   User @relation(fields: [userId], references: [id])
		role   Role
		userId Int
	  }
	  
	  enum Role {
		USER
		ADMIN
	  }
`);

	sinon.replace(fs, 'readFileSync', fakeReadFileSync);

	const field: Field = {
		type: 'field',
		fieldType: 'Title',
		name: 'Title'
	};

	const determinedEnum = determineEnum(field);
	assert.not.ok(determinedEnum);
});

test('map zod type to string', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'String',
		name: 'stringField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.string()');
});

test('map zod type to string array', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'String',
		name: 'stringField',
		array: true
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.string().array()');
});

test('map zod type to optional string array', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'String',
		name: 'stringField',
		array: true,
		optional: true
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.string().array().nullish()');
});

test('map zod type to number', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'Int',
		name: 'numberField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.number().int()');
});

test('map zod type to boolean', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'Boolean',
		name: 'booleanField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.boolean()');
});

test('map zod type to BigInt', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'BigInt',
		name: 'bigIntField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.bigint()');
});

test('map zod type to DateTime', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'DateTime',
		name: 'dateField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.date()');
});

test('map zod type to Float', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'Float',
		name: 'floatField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.number()');
});

test('map zod type to Float', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'Float',
		name: 'floatField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.number()');
});

test('map zod type to Decimal', async () => {
	const field: Field = {
		type: 'field',
		fieldType: 'Decimal',
		name: 'decimalField'
	};

	const mappedType = mapZodType(field);
	assert.is(mappedType, 'z.number()');
});

test('should import and extend the approuter', async () => {
	const project = new Project({ useInMemoryFileSystem: true });

	const sourceFile: SourceFile = project.createSourceFile(
		'/testRouter.ts',
		`
		import { router, publicProcedure, mergeRouters } from './trpc';

		const defaultRouter = router({
		greeting: publicProcedure.query(() => 'hello webstone tRPC')
		});

		export const appRouter = mergeRouters(defaultRouter);

		export type AppRouter = typeof appRouter;

	`
	);

	prepareApprouter(sourceFile, 'testRouter', 'testRouter');

	const imports = sourceFile.getImportDeclarations();

	const namedImports = imports.flatMap((imp) =>
		imp.getNamedImports().map((namedImp) => namedImp.getText())
	);

	const moduleSpecifiers = imports.map((imp) => imp.getModuleSpecifierValue());

	assert.is(imports.length, 2);
	assert.is(namedImports.length, 4);

	// check named imports
	assert.ok(namedImports.includes('testRouter'));

	// check module specifiers
	assert.ok(moduleSpecifiers.includes('./subrouters/testRouter'));
});

test('should return string as id type', async () => {
	const model: Model = {
		name: 'TestModel',
		type: 'model',
		properties: [
			{
				type: 'field',
				fieldType: 'String',
				name: 'stringField',
				attributes: [
					{
						name: 'id',
						type: 'attribute',
						kind: 'field'
					}
				]
			},
			{
				type: 'field',
				fieldType: 'Non-Scalar',
				name: 'nonScalarField'
			},
			{
				type: 'field',
				fieldType: 'Int',
				name: 'numberField'
			}
		]
	};

	const idType = getIDType(model);
	assert.is(idType, 'z.string()');
});

test('should return number as id type', async () => {
	const model: Model = {
		name: 'TestModel',
		type: 'model',
		properties: [
			{
				type: 'field',
				fieldType: 'Int',
				name: 'stringField',
				attributes: [
					{
						name: 'id',
						type: 'attribute',
						kind: 'field'
					}
				]
			},
			{
				type: 'field',
				fieldType: 'Non-Scalar',
				name: 'nonScalarField'
			},
			{
				type: 'field',
				fieldType: 'Int',
				name: 'numberField'
			}
		]
	};

	const idType = getIDType(model);
	assert.is(idType, 'z.number().int()');
});

test('should return error, because no ID provided', async () => {
	try {
		const model: Model = {
			name: 'TestModel',
			type: 'model',
			properties: [
				{
					type: 'field',
					fieldType: 'Int',
					name: 'stringField'
				},
				{
					type: 'field',
					fieldType: 'Non-Scalar',
					name: 'nonScalarField'
				},
				{
					type: 'field',
					fieldType: 'Int',
					name: 'numberField'
				}
			]
		};
		getIDType(model);
	} catch (error) {
		assert.is(error.message, 'ID field not found');
	}
});
