import { GluegunCommand } from '@webstone/gluegun';

const command: GluegunCommand = {
	name: 'init',
	alias: ['i'],
	description: 'Initialize the tRPC Webstone plugin',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { template, filesystem, print } = toolbox;

		const containsTrpc = filesystem.isDirectory(`${process.cwd()}/src/lib/server/trpc`);
		if (containsTrpc) {
			print.warning('tRPC seems to be already initialized, skipping...');
			return;
		}

		const isWebPackageInstalled = filesystem.exists(
			`${process.cwd()}/node_modules/webstone-plugin-trpc-web`
		);
		if (!isWebPackageInstalled) {
			print.error('Webstone tRPC Web package is not installed');
			return;
		}

		const spinner = print.spin('Initializing tRPC...');
		await template.generate({
			template: 'base/router.ts.ejs',
			target: 'src/lib/server/trpc/router.ts'
		});
		await template.generate({
			template: 'base/trpc.ts.ejs',
			target: 'src/lib/server/trpc/trpc.ts'
		});

		spinner.succeed('tRPC initialized');
	}
};

export default command;
