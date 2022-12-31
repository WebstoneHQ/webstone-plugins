import { GluegunCommand } from '@webstone/gluegun';
import {
	getModelByName,
	getAllModels,
	populateSubrouterFile,
	getIDType,
	prepareApprouter
} from '../../lib/generate';
import { Project } from 'ts-morph';

const command: GluegunCommand = {
	name: 'generate',
	alias: ['g'],
	description: 'Generate tRPC model',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { print, parameters, prompt, template, strings } = toolbox;
		try {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			let modelName = parameters.first!;

			const spinner = print.spin(`Generating tRPC for model "${modelName}..."`);

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
			if (model.type !== 'model') return;

			const idFieldType = getIDType(model);

			const subrouterFilename = `${strings.singular(model.name.toLowerCase())}-router`;
			const subrouterTarget = `src/lib/server/trpc/subrouters/${subrouterFilename}.ts`;
			const zodModelName = `${strings.lowerCase(modelName)}Model`;

			await template.generate({
				template: 'subrouter.ejs',
				target: subrouterTarget,
				props: {
					capitalizedPlural: strings.upperFirst(strings.plural(modelName)),
					capitalizedSingular: strings.upperFirst(strings.singular(modelName)),
					lowercaseSingular: strings.lowerCase(modelName),
					zodModelName,
					idFieldType
				}
			});

			const project = new Project({
				tsConfigFilePath: 'tsconfig.json'
			});

			const subRouter = project.getSourceFileOrThrow(subrouterTarget);

			populateSubrouterFile(subRouter, model, zodModelName);

			subRouter.formatText({
				tabSize: 1
			});

			const indexRouter = project.getSourceFileOrThrow('src/lib/server/trpc/router.ts');

			prepareApprouter(indexRouter, `${strings.lowerCase(modelName)}Router`, subrouterFilename);

			project.saveSync();

			spinner.succeed(`Generated tRPC for model "${modelName}"`);
		} catch (error) {
			print.error(error);
		}
	}
};

export default command;
