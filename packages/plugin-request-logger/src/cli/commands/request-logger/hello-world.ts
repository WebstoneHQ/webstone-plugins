import type { GluegunCommand } from '@webstone/gluegun';

const command: GluegunCommand = {
	name: 'hello',
	alias: ['h'],
	description: 'Hello World Command',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { print } = toolbox;

		print.info(`Hello World`);
	}
};

export default command;
