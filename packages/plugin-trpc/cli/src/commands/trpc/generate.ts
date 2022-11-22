import { GluegunCommand } from '@webstone/gluegun';
import { getPrismaModelByName, parsePrismaSchema } from '../../lib/generate';

const command: GluegunCommand = {
	name: 'generate',
	alias: ['g'],
	description: 'Generate tRPC model',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { print, parameters, prompt } = toolbox;

		const allModels = parsePrismaSchema();

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		let modelName = parameters.first!;

		if (!modelName) {
			const modelNames = allModels.declarations
				.filter((declaration) => declaration.kind === 'model')
				.map((model) => model.kind === 'model' && model.name.value);

			if (!modelNames) {
				print.error('No models found in prisma/schema.prisma');
				return;
			}

			const result = await prompt.ask({
				type: 'select',
				name: 'model',
				message: 'Please select model',
				choices: modelNames as string[]
			});
			modelName = result.model;
		}

		const model = getPrismaModelByName(modelName, allModels);

		if (!model) {
			print.error(`Model ${modelName} not found`);
			return;
		}
	}
};

export default command;
