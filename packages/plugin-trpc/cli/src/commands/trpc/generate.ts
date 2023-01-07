import { GluegunCommand } from '@webstone/gluegun';
import { populateSubrouterFile, getIDType, prepareApprouter } from '../../lib/generate';
import { Project } from 'ts-morph';
import { generateCompleteModelName, generateRouterFilename } from '../../lib/naming';
import { getAllModels, getModelByName } from '../../lib/parser';

const command: GluegunCommand = {
	name: 'generate',
	alias: ['g'],
	description: 'Generate one or more tRPC model(s)',
	hidden: false,
	dashed: false,
	run: async (toolbox) => {
		const { print, parameters, prompt, template, strings, filesystem } = toolbox;
		try {
			let modelNames =
				parameters.string && parameters.string?.split(',').map((modelName) => modelName.trim());

			if (!modelNames) {
				if (!filesystem.exists('prisma/schema.prisma')) {
					print.error(
						'Please create a prisma/schema.prisma file. To learn more, see https://www.prisma.io/docs/concepts/components/prisma-schema.'
					);
					return;
				}

				const prismaModelNames = getAllModels()
					.filter((model) => model.type === 'model')
					.map((model) => model.type === 'model' && model.name);

				if (!prismaModelNames) {
					print.error('No models found in prisma/schema.prisma');
					return;
				}

				const result = await prompt.ask({
					type: 'multiselect',
					name: 'models',
					message: 'Please select your model(s)',
					choices: prismaModelNames as string[]
				});
				modelNames = result.models as unknown as string[];
			}

			const models = modelNames.map((modelName) => getModelByName(modelName));

			for (let index = 0; index < models.length; index++) {
				const model = models[index];
				const modelName = modelNames[index];
				if (!model) {
					print.error(`Model ${modelName} not found, skipping...`);
					continue;
				}

				if (model.type !== 'model') return;

				const spinner = print.spin(`Generating tRPC for model "${modelName}..."`);

				const idFieldType = getIDType(model);

				const subrouterFilename = generateRouterFilename(model.name);
				const subrouterTarget = `src/lib/server/trpc/subrouters/${subrouterFilename}.ts`;
				const zodModelName = generateCompleteModelName(model.name);

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

				populateSubrouterFile(project, model);

				const indexRouter = project.getSourceFileOrThrow('src/lib/server/trpc/router.ts');

				prepareApprouter(indexRouter, `${strings.lowerCase(modelName)}Router`, subrouterFilename);

				indexRouter.formatText({
					tabSize: 1
				});

				project.saveSync();

				spinner.succeed(`Generated tRPC for model "${modelName}"`);
			}
		} catch (error) {
			print.error(error);
		}
	}
};

export default command;
