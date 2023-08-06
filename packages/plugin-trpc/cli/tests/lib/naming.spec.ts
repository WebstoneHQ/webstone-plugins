import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
	generateZodEnumName,
	generateZodModelName,
	generateRouterFilename,
	generateEnumFilename,
	generateModelFilename,
	generateCompleteModelName,
	generateEnumName
} from '../../src/lib/naming';

test('should return zod model name', async () => {
	const modelName = generateZodModelName('User');
	assert.is(modelName, 'userModel');
});

test('should return zod enum name', async () => {
	const enumName = generateZodEnumName('Role');
	assert.is(enumName, 'roleEnumModel');
});

test('should return subrouter filename', async () => {
	const filename = generateRouterFilename('User');
	assert.is(filename, 'user-router');
});

test('should return model filename', async () => {
	const filename = generateModelFilename('User');
	assert.is(filename, 'user');
});

test('should return enum filename', async () => {
	const filename = generateEnumFilename('Role');
	assert.is(filename, 'role');
});

test('should return enum name', async () => {
	const enumName = generateEnumName('Role');
	assert.is(enumName, 'roleEnum');
});

test('should return complete name', async () => {
	const completeName = generateCompleteModelName('User');
	assert.is(completeName, 'CompleteUserModel');
});

test.run();
