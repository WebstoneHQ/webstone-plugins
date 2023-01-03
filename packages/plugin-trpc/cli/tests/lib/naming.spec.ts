import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
	generateZodEnumName,
	generateZodModelName,
	generateRouterFilename
} from '../../src/lib/naming';

test('Generate Zod Model Name', async () => {
	const modelName = generateZodModelName('User');
	assert.is(modelName, 'userModel');
});

test('Generate Zod Enum Name', async () => {
	const enumName = generateZodEnumName('Role');
	assert.is(enumName, 'roleEnum');
});

test('Generate Subrouter filename', async () => {
	const filename = generateRouterFilename('User');
	assert.is(filename, 'user-router');
});

test.run();
