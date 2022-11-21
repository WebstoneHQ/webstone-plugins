import { GluegunCommand } from '@webstone/gluegun';
import { getPrismaModelByName } from '../../lib/generate';

const command: GluegunCommand = {
	name: 'generate',
	alias: ['g'],
	description: 'Generate TRPC model',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { print, parameters } = toolbox;

		if (!parameters.first) {
			print.error('Please specify a model name');
			return;
		}

		const modelName = parameters.first;

		const model = getPrismaModelByName(modelName);

		if (!model) {
			print.error(`Model ${modelName} not found`);
			return;
		}
	}
};

export default command;
