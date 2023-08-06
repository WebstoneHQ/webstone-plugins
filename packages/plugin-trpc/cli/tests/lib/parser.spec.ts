import { test } from 'uvu';
import * as assert from 'uvu/assert';
import sinon from 'sinon';
import fs from 'fs';
import { getAllEnums, getAllModels, getModelByName } from '../../src/lib/parser';

test.after.each(() => {
	sinon.restore();
});

test('should get all enums', async () => {
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

	const enums = getAllEnums();

	assert.is(enums.length, 1);
	assert.is(enums[0].type === 'enum' && enums[0].name, 'Role');
	assert.is(enums[0].type, 'enum');
});

test('should return all models', async () => {
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
	const models = getAllModels();

	assert.is(models.length, 2);
	assert.is(models[0].type, 'model');
	assert.is(models[0].type === 'model' && models[0].name, 'User');
});

test('should get single model by name', async () => {
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

	const model = getModelByName('User');

	assert.ok(model);
	assert.is(model?.type, 'model');
	assert.is(model?.type === 'model' && model?.name, 'User');
	assert.is(model?.type === 'model' && model?.properties.length, 7);
});

test("should return undefined if models doesn't exist", async () => {
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

	const model = getModelByName('User2');

	assert.not.ok(model);
});

test.run();
