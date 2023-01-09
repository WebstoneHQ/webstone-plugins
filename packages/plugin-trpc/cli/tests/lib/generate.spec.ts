import { test } from 'uvu';
import * as assert from 'uvu/assert';
import sinon from 'sinon';
import fs from 'node:fs';
import { getNonScalarFields, determineEnum, mapZodType } from '../../src/lib/generate';
import { Field, Model } from '@mrleebo/prisma-ast';

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

test.run();
