import { readFileSync } from 'fs';
import { getSchema } from '@mrleebo/prisma-ast';

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

export const getAllEnums = () => {
	const schema = getSchema(readFileSync('prisma/schema.prisma', { encoding: 'utf8' }));
	return schema.list.filter((item) => item.type === 'enum');
};
