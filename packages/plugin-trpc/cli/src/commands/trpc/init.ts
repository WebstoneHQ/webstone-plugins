import { GluegunCommand } from '@webstone/gluegun';

const command: GluegunCommand = {
	name: 'init',
	alias: ['i'],
	description: 'Initialize TRPC',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { template, filesystem, print } = toolbox;

		const containsTrpc = filesystem.isDirectory(`${process.cwd()}/src/lib/server/trpc`);
		if (containsTrpc) {
			print.error('TRPC seems to be already initialized');
		}

		const spinner = print.spin('Initializing TRPC...');
		await template.generate({
			template: 'base/router.ts.ejs',
			target: 'src/lib/server/trpc/router.ts'
		});
		await template.generate({
			template: 'base/trpc.ts.ejs',
			target: 'src/lib/server/trpc/trpc.ts'
		});

		spinner.succeed('TRPC initialized');
	}
};

export default command;
