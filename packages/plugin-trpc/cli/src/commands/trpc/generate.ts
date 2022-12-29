import { GluegunCommand } from '@webstone/gluegun';
import { getModelByName, getAllModels } from '../../lib/generate';

const command: GluegunCommand = {
	name: 'generate',
	alias: ['g'],
	description: 'Generate tRPC model',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { print, parameters, prompt } = toolbox;
		try {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			let modelName = parameters.first!;

			if (!modelName) {
				const modelNames = getAllModels()
					.filter((model) => model.type === 'model')
					.map((model) => model.type === 'model' && model.name);

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

			const model = getModelByName(modelName);

			if (!model) {
				print.error(`Model ${modelName} not found`);
				return;
			}
		} catch (error) {
			print.error(error);
		}
	}
};

export default command;
